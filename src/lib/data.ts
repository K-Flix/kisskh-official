
'use server';

import type { Movie, Show, MovieDetails, ShowDetails, TmdbItem, Genre, Country, PersonDetails } from '@/lib/types';
import { endpoints } from './endpoints';
import { networksConfig } from './networks';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB_API_KEY is not defined');
    return null;
  }
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };
  
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
  });
  
  try {
    const response = await fetch(url.toString(), { ...options, next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      console.error(`Failed to fetch from TMDB endpoint: ${endpoint}`, await response.text());
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching from TMDB endpoint: ${endpoint}`, error);
    return null;
  }
}

function processItem(item: TmdbItem, mediaTypeOverride?: 'movie' | 'tv'): Movie | Show | null {
    if (!item || !item.id) return null;
    
    const mediaType = mediaTypeOverride || item.media_type;
    
    if (mediaType !== 'movie' && mediaType !== 'tv') {
        return null;
    }

    if (!item.poster_path || !item.backdrop_path) {
        return null;
    }

    const logo = item.images?.logos?.find((l: any) => l.iso_639_1 === 'en' && !l.file_path.endsWith('.svg'));
    const trailer = item.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    
    const baseItem = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        poster_path: `${IMAGE_BASE_URL}/w500${item.poster_path}`,
        backdrop_path: `${IMAGE_BASE_URL}/w1280${item.backdrop_path}`,
        overview: item.overview || '',
        release_date: item.release_date || item.first_air_date || '',
        vote_average: item.vote_average || 0,
        genres: item.genres || [],
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        trailer_url: trailer ? `https://www.youtube.com/embed/${trailer.key}` : undefined,
        popularity: item.popularity || 0,
    };

    if (mediaType === 'movie') {
        return {
            ...baseItem,
            media_type: 'movie',
            runtime: item.runtime,
        } as Movie;
    } else { // mediaType === 'tv'
        return {
            ...baseItem,
            media_type: 'tv',
            number_of_seasons: item.number_of_seasons,
        } as Show;
    }
}

function getDynamicParams() {
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 90);
  
    return {
      'air_date.lte': today.toISOString().split('T')[0],
      'air_date.gte': ninetyDaysAgo.toISOString().split('T')[0],
    };
}

export async function getItems(
    key: string,
    page: number = 1,
    featured: boolean = false,
    isCategoryPage: boolean = false,
    filters: Record<string, string> = {}
  ): Promise<(Movie | Show)[]> {
    
    if (key === 'discover_all') {
        const { media_type, ...apiFilters } = filters;
        const pageStr = page.toString();

        const typesToFetch: ('movie' | 'tv')[] = media_type && media_type !== 'all'
            ? [media_type as 'movie' | 'tv']
            : ['movie', 'tv'];

        const promises = typesToFetch.map(type => {
            const endpoint = `discover/${type}`;
            const paramsForType = { ...apiFilters, page: pageStr };
            
            // Handle year filter difference between movies and TV
            if (paramsForType.primary_release_year) {
              if (type === 'tv') {
                paramsForType.first_air_date_year = paramsForType.primary_release_year;
                delete paramsForType.primary_release_year;
              }
            }
            
            // Logic for TV shows
            if (type === 'tv') {
                if (paramsForType.with_networks) {
                    delete paramsForType.with_watch_providers;
                } else if (paramsForType.with_watch_providers) {
                    paramsForType.watch_region = 'US';
                }
            } 
            // Logic for Movies
            else if (type === 'movie') {
                delete paramsForType.with_networks;
                if (paramsForType.with_watch_providers) {
                    paramsForType.watch_region = 'US';
                }
            }

            return fetchFromTMDB(endpoint, paramsForType);
        });

        const results = await Promise.all(promises);
        
        let allItems: (Movie | Show)[] = [];
        results.forEach((data, index) => {
            if (data?.results) {
                const type = typesToFetch[index];
                const processed = data.results.map((item: TmdbItem) => processItem(item, type)).filter(Boolean) as (Movie | Show)[];
                allItems = allItems.concat(processed);
            }
        });

        if (typesToFetch.length > 1 && allItems.length > 0) {
          const sortBy = filters.sort_by || 'popularity.desc';
          if (!sortBy.includes('release_date')) {
            allItems.sort((a, b) => b.popularity - a.popularity);
          }
        }

        return allItems;
    }
  
    const endpoint = endpoints.find(e => e.key === key);
    if (!endpoint) return [];
  
    const finalParams: Record<string, string> = { ...endpoint.params, ...filters, page: page.toString() };
  
    if (isCategoryPage && (key === 'k_drama' || key === 'c_drama')) {
        finalParams.sort_by = 'first_air_date.desc';
    } else if (key === 'k_drama_on_air' || key === 'c_drama_on_air') {
        const dynamicParams = getDynamicParams();
        Object.assign(finalParams, dynamicParams);
        finalParams.sort_by = 'popularity.desc';
    } else if (endpoint.sort_by) {
      finalParams.sort_by = endpoint.sort_by;
    }
  
    const data = await fetchFromTMDB(endpoint.url, finalParams);
    if (!data?.results) return [];
    
    let items = data.results
        .map((item: TmdbItem) => processItem(item, endpoint.type || item.media_type))
        .filter(Boolean) as (Movie | Show)[];
    
    if (featured && items.length > 0) {
        const detailedItems = await Promise.all(
            items.slice(0, 5).map(async (item: Movie | Show) => {
                const details = await fetchFromTMDB(`${item.media_type}/${item.id}`, { append_to_response: 'images,videos' });
                return details ? processItem({ ...item, ...details }, item.media_type) : item;
            })
        );
        return detailedItems.filter(Boolean) as (Movie | Show)[];
    }
  
    return items;
  }

export async function getMovieById(id: number): Promise<MovieDetails | null> {
    const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'aggregate_credits,images,similar,videos' });
    if (!data) return null;

    const logo = data.images?.logos?.find((l: any) => l.iso_639_1 === 'en' && !l.file_path.endsWith('.svg'));
    const trailer = data.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

    const movie: MovieDetails = {
        id: data.id,
        title: data.title || 'Untitled',
        poster_path: data.poster_path ? `${IMAGE_BASE_URL}/w500${data.poster_path}` : '/placeholder.svg',
        backdrop_path: data.backdrop_path ? `${IMAGE_BASE_URL}/w1280${data.backdrop_path}`: '/placeholder.svg',
        overview: data.overview || '',
        release_date: data.release_date || '',
        vote_average: data.vote_average || 0,
        genres: data.genres || [],
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        trailer_url: trailer ? `https://www.youtube.com/embed/${trailer.key}` : undefined,
        media_type: 'movie',
        runtime: data.runtime,
        cast: (data.aggregate_credits?.cast || []).map((member: any) => ({
            id: member.id,
            credit_id: member.credit_id,
            name: member.name,
            character: member.roles?.map((r: any) => r.character).join(', ') || '',
            profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar: (data.similar?.results || [])
            .map((item: TmdbItem) => processItem(item, 'movie'))
            .filter(Boolean) as Movie[],
        popularity: data.popularity || 0,
    };
    
    return movie;
}

export async function getShowById(id: number): Promise<ShowDetails | null> {
    const data = await fetchFromTMDB(`tv/${id}`, { append_to_response: 'aggregate_credits,images,similar,videos' });
    if (!data) return null;

    const show = processItem(data, 'tv') as Show;
    if (!show) return null;
    
    const seasons = await Promise.all((data.seasons || [])
        .filter((s:any) => s.season_number > 0 && s.episode_count > 0)
        .map(async (season: any) => {
            const seasonDetails = await fetchFromTMDB(`tv/${id}/season/${season.season_number}`);
            return {
                ...season,
                episodes: (seasonDetails?.episodes || []).map((ep: any) => ({
                    ...ep,
                    still_path: ep.still_path ? `${IMAGE_BASE_URL}/w300${ep.still_path}` : null,
                })),
            };
    }));

    const cast = (data.aggregate_credits?.cast || []).map((member: any) => ({
        id: member.id,
        credit_id: member.credit_id,
        name: member.name,
        character: member.roles?.map((r: any) => r.character).join(', ') || '',
        profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
    }));

    const similar = (data.similar?.results || [])
        .map((item: TmdbItem) => processItem(item, 'tv'))
        .filter(Boolean) as Show[];

    return {
        ...show,
        number_of_seasons: data.number_of_seasons,
        seasons,
        cast,
        similar,
        popularity: data.popularity || 0,
    };
};

export async function searchMovies(query: string, page: number = 1): Promise<(Movie | Show)[]> {
  if (!query) return [];

  const data = await fetchFromTMDB('search/multi', { query, page: page.toString(), include_adult: 'false' });

  if (!data?.results) return [];

  return data.results
    .map((item: TmdbItem) => processItem(item, item.media_type))
    .filter(Boolean)
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0)) as (Movie | Show)[];
}


export async function getGenres(): Promise<Genre[]> {
    const movieGenres = await fetchFromTMDB('genre/movie/list');
    const tvGenres = await fetchFromTMDB('genre/tv/list');
  
    const allGenres = new Map<number, string>();
    
    if (movieGenres?.genres) {
      movieGenres.genres.forEach((g: Genre) => allGenres.set(g.id, g.name));
    }
    if (tvGenres?.genres) {
      tvGenres.genres.forEach((g: Genre) => allGenres.set(g.id, g.name));
    }
  
    return Array.from(allGenres, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
}
  
export async function getCountries(): Promise<Country[]> {
    const data = await fetchFromTMDB('configuration/countries');
    if (!data) return [];
    
    return data
        .filter((c: Country) => c.english_name)
        .sort((a: Country, b: Country) => a.english_name.localeCompare(b.english_name));
}


export async function getPersonById(id: number): Promise<PersonDetails | null> {
    const data = await fetchFromTMDB(`person/${id}`, { append_to_response: 'combined_credits' });
    if (!data) return null;

    const knownFor = (data.combined_credits?.cast || [])
        .map((item: TmdbItem) => processItem(item, item.media_type))
        .filter(Boolean)
        .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0)) as (Movie | Show)[];
    
    const person: PersonDetails = {
        id: data.id,
        name: data.name,
        profile_path: data.profile_path ? `${IMAGE_BASE_URL}/w500${data.profile_path}` : '/placeholder-avatar.svg',
        biography: data.biography,
        birthday: data.birthday,
        place_of_birth: data.place_of_birth,
        known_for: knownFor,
    };

    return person;
}

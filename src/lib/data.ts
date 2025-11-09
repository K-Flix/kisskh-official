
'use server';

import type { Movie, Show, MovieDetails, ShowDetails, TmdbItem } from '@/lib/types';
import { endpoints } from './endpoints';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`
  }
};

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!process.env.TMDB_API_READ_ACCESS_TOKEN) {
    console.error('TMDB_API_READ_ACCESS_TOKEN is not defined');
    return null;
  }
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  
  try {
    const response = await fetch(url.toString(), options);
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

export async function getItems(key: string, page: number = 1, featured: boolean = false, isCategoryPage: boolean = false): Promise<(Movie | Show)[]> {
    const endpoint = endpoints.find(e => e.key === key);
    if (!endpoint) return [];

    const finalParams: Record<string, string> = { 
        page: page.toString(), 
        ...endpoint.params,
    };

    const specialCategories = ['k_drama_on_air', 'k_drama', 'c_drama', 'anime'];

    if (specialCategories.includes(key)) {
        if (isCategoryPage) {
            // For "See All" pages, sort by newest, no date restriction.
            finalParams.sort_by = 'first_air_date.desc';
        } else {
            // For homepage carousels, filter by recent air dates and sort by popularity.
            const dynamicParams = getDynamicParams();
            finalParams['air_date.gte'] = dynamicParams['air_date.gte'];
            finalParams['air_date.lte'] = dynamicParams['air_date.lte'];
            finalParams.sort_by = 'popularity.desc';
        }
    } else if(endpoint.sort_by) {
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
    const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'credits,images,similar,videos' });
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
        cast: (data.credits?.cast || []).map((member: any) => ({
            credit_id: member.credit_id,
            name: member.name,
            character: member.character,
            profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar: (data.similar?.results || [])
            .map((item: TmdbItem) => processItem(item, 'movie'))
            .filter(Boolean) as Movie[],
    };
    
    return movie;
}

export async function getShowById(id: number): Promise<ShowDetails | null> {
    const data = await fetchFromTMDB(`tv/${id}`, { append_to_response: 'credits,images,similar,videos' });
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

    const cast = (data.credits?.cast || []).map((member: any) => ({
        credit_id: member.credit_id,
        name: member.name,
        character: member.character,
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

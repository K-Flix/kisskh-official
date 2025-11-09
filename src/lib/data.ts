
'use server';

import type { Movie, Show, MovieDetails, ShowDetails } from '@/lib/types';
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

function processItem(item: any, mediaType?: 'movie' | 'tv'): Movie | Show | null {
    if (!item) return null;
    const determinedMediaType = mediaType || item.media_type;
    
    if (determinedMediaType !== 'movie' && determinedMediaType !== 'tv') {
        return null;
    }

    const logo = item.images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    const trailer = item.videos?.results?.find((video: any) => video.site === 'YouTube' && video.type === 'Trailer');
    
    const baseItem = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        poster_path: item.poster_path ? `${IMAGE_BASE_URL}/w500${item.poster_path}` : '/placeholder.svg',
        backdrop_path: item.backdrop_path ? `${IMAGE_BASE_URL}/w1280${item.backdrop_path}` : '/placeholder.svg',
        overview: item.overview,
        release_date: item.release_date || item.first_air_date,
        vote_average: item.vote_average,
        genres: item.genres || [],
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        trailer_url: trailer ? `https://www.youtube.com/embed/${trailer.key}` : undefined,
    };

    if (determinedMediaType === 'movie') {
        return {
            ...baseItem,
            media_type: 'movie',
            genre_ids: item.genre_ids || [],
        } as Movie;
    } else {
        return {
            ...baseItem,
            media_type: 'tv',
        } as Show;
    }
}

export async function getItems(key: string, page: number = 1, featured: boolean = false): Promise<(Movie | Show)[]> {
    const endpoint = endpoints.find(e => e.key === key);
    if (!endpoint) return [];

    const params: Record<string, string> = { page: page.toString() };
    if(endpoint.sort_by) {
        params.sort_by = endpoint.sort_by;
    }
    // Add endpoint-specific params
    Object.assign(params, endpoint.params);

    const data = await fetchFromTMDB(endpoint.url, params);
    if (!data?.results) return [];
    
    let items = data.results
        .map((item: any) => processItem(item, endpoint.type || item.media_type))
        .filter(Boolean) as (Movie | Show)[];
    
    items = items.filter((item: any) => item.poster_path && item.backdrop_path && item.poster_path !== '/placeholder.svg' && item.backdrop_path !== '/placeholder.svg');

    if (featured && items.length > 0) {
        const detailedItems = await Promise.all(
            items.slice(0, 5).map(async (item: any) => {
                const details = await fetchFromTMDB(`${item.media_type}/${item.id}`, { append_to_response: 'images,videos' });
                if (!details) return item;
                // re-process to add logos and trailers
                return processItem({...item, ...details}, item.media_type);
            })
        );
        items = detailedItems.filter(Boolean) as (Movie | Show)[];
    }

    return items;
}

export async function getFeatured(): Promise<(Movie | Show)[]> {
    return getItems('trending_today', 1, true);
}


export async function getMovieById(id: number): Promise<MovieDetails | null> {
    const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'credits,images,similar,videos' });
    if (!data) return null;
    
    const movie = processItem(data, 'movie') as Movie;
    if (!movie) return null;
    
    return {
        ...movie,
        runtime: data.runtime,
        cast: (data.credits?.cast || []).map((member: any) => ({
          ...member,
          profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar: data.similar?.results?.map((item: any) => processItem(item, 'movie')).filter(Boolean) || [],
    };
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

    const similar = (data.similar?.results || []).map((item: any) => processItem(item, 'tv')).filter(Boolean) as Show[];

    return {
        ...show,
        seasons: seasons,
        cast: (data.credits?.cast || []).map((member: any) => ({
          ...member,
          profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar,
    };
};

export async function searchMovies(query: string, page: number = 1): Promise<(Movie | Show)[]> {
  if (!query) return [];

  const data = await fetchFromTMDB('search/multi', { query, page: page.toString(), include_adult: 'false' });

  if (!data?.results) return [];

  const processedResults = data.results
    .map((item: any) => processItem(item, item.media_type))
    .filter(Boolean) as (Movie | Show)[];
  
  processedResults.sort((a, b) => {
    const aPopularity = (a as any).popularity || 0;
    const bPopularity = (b as any).popularity || 0;
    return bPopularity - aPopularity;
  });

  return processedResults;
}

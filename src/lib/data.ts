
'use server';

import type { Movie, Show, MovieDetails, ShowDetails, CastMember } from '@/lib/types';
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
      console.error(`Failed to fetch from TMDB endpoint: ${endpoint}`, await response.json());
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching from TMDB endpoint: ${endpoint}`, error);
    return null;
  }
}

function processItem(item: any, mediaType?: 'movie' | 'tv', images?: any, videos?: any): Movie | Show {
    const determinedMediaType = mediaType || item.media_type;
    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    const trailer = videos?.results?.find((video: any) => video.site === 'YouTube' && video.type === 'Trailer');
    
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
        media_type: determinedMediaType,
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

export async function getItems(key: string, page: number = 1): Promise<(Movie | Show)[]> {
    const endpoint = endpoints.find(e => e.key === key);
    if (!endpoint) return [];

    const params: Record<string, string> = { page: page.toString() };
    if(endpoint.sort_by) {
        params.sort_by = endpoint.sort_by;
    }

    const data = await fetchFromTMDB(endpoint.url, params);
    if (!data?.results) return [];

    const items = data.results
        .filter((item: any) => item.poster_path && item.backdrop_path)
        .map((item: any) => processItem(item, endpoint.type || item.media_type));

    return items.filter(Boolean) as (Movie | Show)[];
}

export async function getFeatured(): Promise<(Movie | Show)[]> {
    const items = await getItems('trending_today');
    const detailedItems = await Promise.all(
        items.slice(0, 15).map(async (item) => {
            const details = await fetchFromTMDB(`${item.media_type}/${item.id}`, { append_to_response: 'images,videos' });
            return processItem(item, item.media_type, details?.images, details?.videos);
        })
    );
    return detailedItems.filter(Boolean) as (Movie | Show)[];
}


export async function getMovieById(id: number): Promise<MovieDetails | null> {
    const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'credits,images,similar,videos' });
    if (!data) return null;
    
    const movie = processItem(data, 'movie', data.images, data.videos) as Movie;
    
    return {
        ...movie,
        runtime: data.runtime,
        cast: (data.credits?.cast || []).map((member: any) => ({
          ...member,
          profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar: data.similar?.results?.map((item: any) => processItem(item, 'movie')) || [],
    };
}

export async function getShowById(id: number): Promise<ShowDetails | null> {
    const data = await fetchFromTMDB(`tv/${id}`, { append_to_response: 'credits,images,similar,videos' });
    if (!data) return null;

    const show = processItem(data, 'tv', data.images, data.videos) as Show;
    
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

    const similar = (data.similar?.results || []).map((item: any) => processItem(item, 'tv'));

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

export async function searchMovies(query: string, limit: number = 40): Promise<(Movie | Show)[]> {
    if (!query) return [];

    // Fetch first two pages of results
    const [page1, page2] = await Promise.all([
        fetchFromTMDB('search/multi', { query, page: '1' }),
        fetchFromTMDB('search/multi', { query, page: '2' })
    ]);

    let combinedResults = [];
    if (page1?.results) combinedResults.push(...page1.results);
    if (page2?.results) combinedResults.push(...page2.results);

    if (combinedResults.length === 0) return [];
    
    const processedResults = combinedResults
        .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path && item.backdrop_path)
        .map((item: any) => processItem(item, item.media_type))
        .filter(Boolean) as (Movie | Show)[];

    // Sort by popularity and whether the title starts with the query
    const sortedResults = processedResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = query.toLowerCase();

        const aStartsWith = aTitle.startsWith(queryLower);
        const bStartsWith = bTitle.startsWith(queryLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Use vote_average as a stand-in for popularity if available
        const popularityA = a.vote_average || 0;
        const popularityB = b.vote_average || 0;

        return popularityB - popularityA;
    });

    // Remove duplicates
    const uniqueResults = Array.from(new Map(sortedResults.map(item => [item.id, item])).values());
    
    return uniqueResults.slice(0, limit);
}

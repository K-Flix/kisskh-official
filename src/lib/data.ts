
import type { Genre, Movie, MovieDetails, Show, ShowDetails, BaseItem } from '@/lib/types';

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

function processItem(item: any, mediaType: 'movie' | 'tv', images?: any): Movie | Show {
    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    
    const baseItem: BaseItem = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        poster_path: item.poster_path ? `${IMAGE_BASE_URL}/w500${item.poster_path}` : '/placeholder.svg',
        backdrop_path: item.backdrop_path ? `${IMAGE_BASE_URL}/w1280${item.backdrop_path}` : '/placeholder.svg',
        overview: item.overview,
        release_date: item.release_date || item.first_air_date,
        vote_average: item.vote_average,
        genres: item.genres || [],
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        media_type: mediaType,
    };

    if (mediaType === 'movie') {
        return {
            ...baseItem,
            media_type: 'movie',
            genre_ids: item.genre_ids || [],
        } as Movie;
    } else {
        return {
            ...baseItem,
            media_type: 'tv',
            title: item.name || item.title || 'Untitled',
        } as Show;
    }
}

export const getTrending = async (time_window: 'day' | 'week' = 'day', media_type: 'all' | 'movie' | 'tv' = 'all'): Promise<(Movie | Show)[]> => {
    const data = await fetchFromTMDB(`trending/${media_type}/${time_window}`);
    if (!data?.results) return [];
    
    const items = data.results
        .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path && item.backdrop_path)
        .map(async (item: any) => {
            const images = await fetchFromTMDB(`${item.media_type}/${item.id}/images`);
            return processItem(item, item.media_type, images);
        });

    return Promise.all(items);
}

export const getFeaturedMovie = async (): Promise<Movie | Show | undefined> => {
    const trending = await getTrending('day');
    return trending[0];
}

export const getKDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_origin_country: 'KR',
        sort_by: 'first_air_date.desc',
        language: 'en-US',
    });
    if (!data?.results) return [];
    
    const shows = data.results.map(async (show: any) => {
        const images = await fetchFromTMDB(`tv/${show.id}/images`);
        return processItem(show, 'tv', images) as Show;
    });

    return Promise.all(shows);
}

export const getCDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_origin_country: 'CN',
        sort_by: 'popularity.desc',
        language: 'en-US',
    });
    if (!data?.results) return [];

    const shows = data.results.map(async (show: any) => {
        const images = await fetchFromTMDB(`tv/${show.id}/images`);
        return processItem(show, 'tv', images) as Show;
    });

    return Promise.all(shows);
}

export const getAnime = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_origin_country: 'JP',
        with_genres: '16',
        sort_by: 'popularity.desc',
        language: 'en-US',
    });
    if (!data?.results) return [];

    const shows = data.results.map(async (show: any) => {
        const images = await fetchFromTMDB(`tv/${show.id}/images`);
        return processItem(show, 'tv', images) as Show;
    });

    return Promise.all(shows);
}

export const getPopularMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTMDB('movie/popular', { language: 'en-US' });
    if (!data?.results) return [];

    const movies = data.results.map(async (movie: any) => {
        const images = await fetchFromTMDB(`movie/${movie.id}/images`);
        return processItem(movie, 'movie', images) as Movie;
    });

    return Promise.all(movies);
};


export const getTopRated = async (): Promise<(Movie | Show)[]> => {
    const data = await fetchFromTMDB('discover/movie', {
        sort_by: 'vote_average.desc',
        'vote_count.gte': '200',
        language: 'en-US',
    });
    if (!data?.results) return [];

    const items = data.results.map(async (item: any) => {
        const images = await fetchFromTMDB(`movie/${item.id}/images`);
        return processItem(item, 'movie', images);
    });

    return Promise.all(items);
};


export const getMovieById = async (id: number): Promise<MovieDetails | null> => {
    const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'credits,images,similar' });
    if (!data) return null;
    
    const movie = processItem(data, 'movie', data.images) as Movie;
    
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

export const getShowById = async (id: number): Promise<ShowDetails | null> => {
    const data = await fetchFromTMDB(`tv/${id}`, { append_to_response: 'credits,images,similar' });
    if (!data) return null;

    const show = processItem(data, 'tv', data.images) as Show;
    
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

export const searchMovies = async (query: string): Promise<(Movie | Show)[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('search/multi', { query });
    if (!data?.results) return [];

    const results = data.results
        .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
        .map(async (item: any) => {
            const images = await fetchFromTMDB(`${item.media_type}/${item.id}/images`);
            return processItem(item, item.media_type, images);
        });

    return Promise.all(results);
}

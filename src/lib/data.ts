
import type { Genre, Movie, Show, MovieDetails, ShowDetails, BaseItem, CastMember, Season, Episode } from '@/lib/types';
import { subDays, format } from 'date-fns';

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
            title: item.name || item.title || 'Untitled',
        } as Show;
    }
}

const formatDate = (date: Date) => {
    const d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const today = new Date();
const ninetyDaysAgo = subDays(today, 90);
const airDateGte = formatDate(ninetyDaysAgo);
const airDateLte = formatDate(today);


const endpoints: { key: string; title: string; url: string; type?: 'movie' | 'tv' }[] = [
  // Home Page
  { key: 'trending_today', title: 'Trending Today', url: `/trending/all/day?language=en-US` },
  { key: 'k_drama_on_air', title: 'On The Air K-Dramas', url: `/tv/on_the_air?with_origin_country=KR&language=en-US`, type: 'tv' },

  // TV Shows
  { key: 'trending_tv', title: 'Trending TV Shows', url: `/trending/tv/week?language=en-US`, type: 'tv' },
  { key: 'k_drama', title: 'Recent K-Dramas', url: `/discover/tv?with_origin_country=KR&with_genres=18&language=en-US&sort_by=popularity.desc&air_date.gte=${airDateGte}&air_date.lte=${airDateLte}`, type: 'tv' },
  { key: 'c_drama', title: 'Recent C-Dramas', url: `/discover/tv?with_origin_country=CN&with_genres=18&language=en-US&sort_by=popularity.desc&air_date.gte=${airDateGte}&air_date.lte=${airDateLte}`, type: 'tv' },
  { key: 'anime', title: 'Recent Anime', url: `/discover/tv?with_genres=16&language=en-US&sort_by=popularity.desc&air_date.gte=${airDateGte}&air_date.lte=${airDateLte}`, type: 'tv' },
  { key: 'on_the_air_tv', title: 'On The Air TV Shows', url: `/tv/on_the_air?language=en-US`, type: 'tv' },
  { key: 'top_rated_tv', title: 'Top Rated TV Shows', url: `/tv/top_rated?language=en-US`, type: 'tv' },
  
  // Movies
  { key: 'trending_movies', title: 'Trending Movies', url: `/trending/movie/week?language=en-US`, type: 'movie' },
  { key: 'popular_movies', title: 'Popular Movies', url: `/movie/popular?language=en-US`, type: 'movie' },
  { key: 'now_playing_movies', title: 'Now Playing Movies', url: `/movie/now_playing?language=en-US`, type: 'movie' },
  { key: 'upcoming_movies', title: 'Upcoming Movies', url: `/movie/upcoming?language=en-US`, type: 'movie' },
  { key: 'top_rated_movies', title: 'Top Rated Movies', url: `/movie/top_rated?language=en-US`, type: 'movie' },
];

export const getItems = async (key: string): Promise<(Movie | Show)[]> => {
    const endpoint = endpoints.find(e => e.key === key);
    if (!endpoint) return [];

    const data = await fetchFromTMDB(endpoint.url);
    if (!data?.results) return [];

    const items = data.results
        .filter((item: any) => item.poster_path && item.backdrop_path)
        .map(async (item: any) => {
            const mediaType = endpoint.type || item.media_type;
            if (mediaType !== 'movie' && mediaType !== 'tv') return null;
            const images = await fetchFromTMDB(`${mediaType}/${item.id}/images`);
            return processItem(item, mediaType, images);
        });

    return (await Promise.all(items)).filter(Boolean) as (Movie | Show)[];
}

export const getFeatured = async (): Promise<Movie | Show | undefined> => {
    const items = await getItems('trending_today');
    return items[0];
}


export const getMovieById = async (id: number): Promise<MovieDetails | null> => {
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

export const getShowById = async (id: number): Promise<ShowDetails | null> => {
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

export const searchMovies = async (query: string): Promise<(Movie | Show)[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('search/multi', { query });
    if (!data?.results) return [];

    const results = data.results
        .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
        .map(async (item: any) => {
            const details = await fetchFromTMDB(`${item.media_type}/${item.id}`, { append_to_response: 'images,videos' });
            return processItem(item, item.media_type, details?.images, details?.videos);
        });

    return (await Promise.all(results)).filter(Boolean) as (Movie | Show)[];
}

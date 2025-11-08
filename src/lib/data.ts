import type { Genre, Movie, MovieDetails, Show } from '@/lib/types';

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
      console.error(await response.json());
      throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function processMovie(movie: any, images?: any): Movie {
    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    return {
        ...movie,
        poster_path: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : '/placeholder.svg',
        backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}` : '/placeholder.svg',
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
    }
}

function processShow(show: any, images?: any): Show {
    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    return {
        id: show.id,
        title: show.name,
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}/w500${show.poster_path}` : '/placeholder.svg',
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}/w1280${show.backdrop_path}` : '/placeholder.svg',
        overview: show.overview,
        release_date: show.first_air_date,
        vote_average: show.vote_average,
        genre_ids: show.genre_ids,
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
    }
}


export const getGenres = async (): Promise<Genre[]> => {
    const data = await fetchFromTMDB('genre/movie/list');
    return data?.genres || [];
}

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
    const data = await fetchFromTMDB('discover/movie', { with_genres: String(genreId) });
    if (!data?.results) return [];

    const movies = await Promise.all(data.results.map(async (movie: any) => {
        const images = await fetchFromTMDB(`movie/${movie.id}/images`);
        return processMovie(movie, images);
    }));

    return movies;
}

export const getTrending = async (): Promise<(Movie | Show)[]> => {
    const movieData = await fetchFromTMDB('trending/movie/week');
    const tvData = await fetchFromTMDB('trending/tv/week');
    
    const movies = movieData?.results.map((m: any) => processMovie(m)) || [];
    const shows = tvData?.results.map((s: any) => processShow(s)) || [];

    return [...movies, ...shows].sort((a, b) => b.vote_average - a.vote_average);
}


export const getTrendingMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTMDB('trending/movie/week');
    if (!data?.results) return [];

    const movies = await Promise.all(data.results.map(async (movie: any) => {
        const images = await fetchFromTMDB(`movie/${movie.id}/images`);
        return processMovie(movie, images);
    }));

    return movies;
}

export const getAllMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTMDB('movie/popular');
    if (!data?.results) return [];
    
    const movies = await Promise.all(data.results.map(async (movie: any) => {
        const images = await fetchFromTMDB(`movie/${movie.id}/images`);
        return processMovie(movie, images);
    }));

    return movies;
}

export const getMovieById = async (id: number): Promise<MovieDetails | null> => {
    const movieData = await fetchFromTMDB(`movie/${id}`);
    if (!movieData) return null;
    
    const creditsData = await fetchFromTMDB(`movie/${id}/credits`);
    const images = await fetchFromTMDB(`movie/${id}/images`);
    
    return {
        ...processMovie(movieData, images),
        genres: movieData.genres,
        cast: creditsData?.cast || [],
    };
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('search/movie', { query });
    if (!data?.results) return [];

    const movies = await Promise.all(data.results.map(async (movie: any) => {
        const images = await fetchFromTMDB(`movie/${movie.id}/images`);
        return processMovie(movie, images);
    }));

    return movies;
}

export const getFeaturedMovie = async (): Promise<Movie | Show | undefined> => {
    const trending = await getTrending();
    return trending[0];
}

export const getKDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_original_country: 'KR',
        sort_by: 'popularity.desc',
        'air_date.gte': new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0]
    });
    return data?.results.map((s: any) => processShow(s)) || [];
}

export const getCDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_original_country: 'CN',
        sort_by: 'popularity.desc',
        'air_date.gte': new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0]
    });
    return data?.results.map((s: any) => processShow(s)) || [];
}
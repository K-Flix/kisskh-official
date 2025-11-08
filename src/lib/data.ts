import type { Genre, Movie, MovieDetails, Credits } from '@/lib/types';

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

function processMovie(movie: any): Movie {
    return {
        ...movie,
        poster_path: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : '/placeholder.svg',
        backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}` : '/placeholder.svg',
    }
}

export const getGenres = async (): Promise<Genre[]> => {
    const data = await fetchFromTMDB('genre/movie/list');
    return data?.genres || [];
}

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
    const data = await fetchFromTMDB('discover/movie', { with_genres: String(genreId) });
    return data?.results.map(processMovie) || [];
}

export const getTrendingMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTMDB('trending/movie/week');
    return data?.results.map(processMovie) || [];
}

export const getAllMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTMDB('movie/popular');
    return data?.results.map(processMovie) || [];
}

export const getMovieById = async (id: number): Promise<MovieDetails | null> => {
    const movieData = await fetchFromTMDB(`movie/${id}`);
    if (!movieData) return null;
    
    const creditsData = await fetchFromTMDB(`movie/${id}/credits`);
    
    return {
        ...processMovie(movieData),
        genres: movieData.genres,
        cast: creditsData?.cast || [],
    };
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('search/movie', { query });
    return data?.results.map(processMovie) || [];
}

export const getFeaturedMovie = async (): Promise<Movie | undefined> => {
    const trending = await getTrendingMovies();
    return trending[0];
}
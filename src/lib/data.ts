
import type { Genre, Movie, MovieDetails, Show, ShowDetails, Episode } from '@/lib/types';

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
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : '/placeholder.svg',
        backdrop_path: movie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${movie.backdrop_path}` : '/placeholder.svg',
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        release_date: movie.release_date || movie.first_air_date,
        media_type: 'movie',
    }
}

function processShow(show: any, images?: any): Show {
    const logo = images?.logos?.find((logo: any) => logo.iso_639_1 === 'en' && !logo.file_path.endsWith('.svg'));
    return {
        id: show.id,
        title: show.name || show.title || 'Untitled',
        poster_path: show.poster_path ? `${IMAGE_BASE_URL}/w500${show.poster_path}` : '/placeholder.svg',
        backdrop_path: show.backdrop_path ? `${IMAGE_BASE_URL}/w1280${show.backdrop_path}` : '/placeholder.svg',
        overview: show.overview,
        release_date: show.first_air_date,
        vote_average: show.vote_average,
        genre_ids: show.genre_ids,
        logo_path: logo ? `${IMAGE_BASE_URL}/w500${logo.file_path}` : undefined,
        media_type: 'tv',
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

export const getTrending = async (media_type: 'all' | 'movie' | 'tv' = 'all'): Promise<(Movie | Show)[]> => {
    const data = await fetchFromTMDB(`trending/${media_type}/week`);
    if (!data?.results) return [];
    
    const combined = data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => {
            if (item.media_type === 'tv') {
                return processShow(item);
            }
            return processMovie(item);
        });

    const detailedCombined = await Promise.all(combined.map(async (item: any) => {
        const type = item.media_type;
        const images = await fetchFromTMDB(`${type}/${item.id}/images`);
        if (type === 'movie') {
            return processMovie(item, images);
        }
        return processShow(item, images);
    }));

    return detailedCombined.sort((a, b) => b.vote_average - a.vote_average);
}


export const getMovieById = async (id: number): Promise<MovieDetails | null> => {
    const movieData = await fetchFromTMDB(`movie/${id}`, { append_to_response: 'credits,images,similar' });
    if (!movieData) return null;
    
    const creditsData = movieData.credits;
    const images = movieData.images;
    
    return {
        ...processMovie(movieData, images),
        genres: movieData.genres,
        cast: (creditsData?.cast || []).map((member: any) => ({
          ...member,
          profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        similar: movieData.similar?.results.map((item: any) => processMovie(item)) || [],
        runtime: movieData.runtime
    };
}

export const getShowById = async (id: number): Promise<ShowDetails | null> => {
    const showData = await fetchFromTMDB(`tv/${id}`, { append_to_response: 'credits,images,similar' });
    if (!showData) return null;

    const creditsData = showData.credits;
    const images = showData.images;

    const seasons = await Promise.all(showData.seasons
        .filter((s:any) => s.season_number > 0)
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

    return {
        ...processShow(showData, images),
        genres: showData.genres,
        cast: (creditsData?.cast || []).map((member: any) => ({
          ...member,
          profile_path: member.profile_path ? `${IMAGE_BASE_URL}/w300${member.profile_path}` : null
        })),
        seasons: seasons,
        similar: showData.similar?.results.map((item: any) => processShow(item)) || []
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
            if (item.media_type === 'tv') {
                return processShow(item, images);
            }
            return processMovie(item, images);
        });

    return Promise.all(results);
}

export const getFeaturedMovie = async (): Promise<Movie | Show | undefined> => {
    const trending = await getTrending();
    return trending[0];
}

export const getKDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_origin_country: 'KR',
        sort_by: 'popularity.desc',
        language: 'en-US',
    });
    if (!data?.results) return [];
    
    const shows = await Promise.all(data.results.map(async (show: any) => {
        const images = await fetchFromTMDB(`tv/${show.id}/images`);
        return processShow(show, images);
    }));

    return shows;
}

export const getCDramas = async (): Promise<Show[]> => {
    const data = await fetchFromTMDB('discover/tv', {
        with_origin_country: 'CN',
        sort_by: 'popularity.desc',
        language: 'en-US',
    });
    if (!data?.results) return [];

    const shows = await Promise.all(data.results.map(async (show: any) => {
        const images = await fetchFromTMDB(`tv/${show.id}/images`);
        return processShow(show, images);
    }));

    return shows;
}

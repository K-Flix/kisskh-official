
export interface Genre {
  id: number;
  name: string;
}

export interface BaseItem {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: Genre[];
  logo_path?: string;
  trailer_url?: string;
  media_type: 'movie' | 'tv';
}

export interface Movie extends BaseItem {
  media_type: 'movie';
  runtime?: number;
}

export interface Show extends BaseItem {
  media_type: 'tv';
  number_of_seasons?: number;
}

export interface CastMember {
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails extends Movie {
  cast: CastMember[];
  similar: Movie[];
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string | null;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  episodes: Episode[];
}

export interface ShowDetails extends Show {
  cast: CastMember[];
  seasons: Season[];
  similar: Show[];
}

// Represents a raw item from the TMDB API
export interface TmdbItem {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    genres?: Genre[];
    media_type?: 'movie' | 'tv';
    images?: {
        logos?: { file_path: string; iso_639_1: string; }[];
    };
    videos?: {
        results?: { site: string; type: string; key: string; }[];
    };
    runtime?: number;
    number_of_seasons?: number;
    credits?: {
        cast?: any[];
    };
    seasons?: any[];
    similar?: {
        results?: TmdbItem[];
    };
    popularity?: number;
}

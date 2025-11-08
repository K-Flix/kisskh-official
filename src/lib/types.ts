
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
  media_type: 'movie' | 'tv';
}

export interface Movie extends BaseItem {
  media_type: 'movie';
  genre_ids: number[];
}

export interface Show extends BaseItem {
  media_type: 'tv';
  title: string;
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
  runtime: number;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
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

export interface ImageDetails {
  logos: {
    file_path: string;
    iso_639_1: string;
  }[];
}

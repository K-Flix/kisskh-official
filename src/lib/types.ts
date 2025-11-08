export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  logo_path?: string;
  media_type?: 'movie' | 'tv';
}

export interface Show {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    logo_path?: string;
    media_type?: 'tv';
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
    cast: CastMember[];
}

export interface MovieDetails extends Movie {
    genres: Genre[];
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
  runtime: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  episodes: Episode[];
}

export interface ShowDetails extends Show {
    genres: Genre[];
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

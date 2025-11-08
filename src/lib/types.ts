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
}

export interface ImageDetails {
    logos: {
        file_path: string;
        iso_639_1: string;
    }[];
}
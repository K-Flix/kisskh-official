export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  cast: { name: string; character: string; profile_path: string | null }[];
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

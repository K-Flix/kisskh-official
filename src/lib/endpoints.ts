
type Endpoint = { 
  key: string; 
  title: string; 
  url: string; 
  type?: 'movie' | 'tv',
  params?: Record<string, string>,
  sort_by?:string;
}

export const endpoints: Endpoint[] = [
    // Home Page
    { key: 'trending_today', title: 'Trending Today', url: `trending/all/day`, params: { language: 'en-US' } },
    { key: 'k_drama_on_air', title: 'K-Drama', url: `discover/tv`, params: { with_origin_country: 'KR', language: 'en-US', 'air_date.gte': '__DATE_30_DAYS_AGO__', 'air_date.lte': '__TODAY__' }, sort_by: 'popularity.desc', type: 'tv' },
  
    // TV Shows
    { key: 'trending_tv', title: 'Trending TV Shows', url: `trending/tv/week`, params: { language: 'en-US' }, type: 'tv' },
    { key: 'k_drama', title: 'K-Dramas', url: `discover/tv`, params: { with_origin_country: 'KR', language: 'en-US' }, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'c_drama', title: 'C-Drama', url: `discover/tv`, params: { with_origin_country: 'CN', language: 'en-US', 'air_date.gte': '__DATE_30_DAYS_AGO__', 'air_date.lte': '__TODAY__' }, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'anime', title: 'Anime', url: `discover/tv`, params: { with_genres: '16', language: 'en-US', 'air_date.gte': '__DATE_30_DAYS_AGO__', 'air_date.lte': '__TODAY__' }, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'on_the_air_tv', title: 'On The Air TV Shows', url: `tv/on_the_air`, params: { language: 'en-US' }, type: 'tv' },
    { key: 'top_rated_tv', title: 'Top Rated TV Shows', url: `tv/top_rated`, params: { language: 'en-US' }, type: 'tv' },
    
    // Movies
    { key: 'trending_movies', title: 'Trending Movies', url: `trending/movie/week`, params: { language: 'en-US' }, type: 'movie' },
    { key: 'popular_movies', title: 'Popular Movies', url: `movie/popular`, params: { language: 'en-US' }, type: 'movie' },
    { key: 'now_playing_movies', title: 'Now Playing Movies', url: `movie/now_playing`, params: { language: 'en-US' }, type: 'movie' },
    { key: 'upcoming_movies', title: 'Upcoming Movies', url: `movie/upcoming`, params: { language: 'en-US' }, type: 'movie' },
    { key: 'top_rated_movies', title: 'Top Rated Movies', url: `movie/top_rated`, params: { language: 'en-US' }, type: 'movie' },
  ];

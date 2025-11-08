
export const endpoints: { key: string; title: string; url: string; sort_by?:string; type?: 'movie' | 'tv' }[] = [
    // Home Page
    { key: 'trending_today', title: 'Trending Today', url: `/trending/all/day?language=en-US` },
    { key: 'k_drama_on_air', title: 'Popular K-Dramas', url: `/discover/tv?with_origin_country=KR&language=en-US&sort_by=popularity.desc&air_date.gte=2024-01-01`, type: 'tv' },
  
    // TV Shows
    { key: 'trending_tv', title: 'Trending TV Shows', url: `/trending/tv/week?language=en-US`, type: 'tv' },
    { key: 'k_drama', title: 'K-Dramas', url: `/discover/tv?with_origin_country=KR&language=en-US`, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'c_drama', title: 'C-Dramas', url: `/discover/tv?with_origin_country=CN&language=en-US`, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'anime', title: 'Anime', url: `/discover/tv?with_genres=16&language=en-US`, sort_by: 'popularity.desc', type: 'tv' },
    { key: 'on_the_air_tv', title: 'On The Air TV Shows', url: `/tv/on_the_air?language=en-US`, type: 'tv' },
    { key: 'top_rated_tv', title: 'Top Rated TV Shows', url: `/tv/top_rated?language=en-US`, type: 'tv' },
    
    // Movies
    { key: 'trending_movies', title: 'Trending Movies', url: `/trending/movie/week?language=en-US`, type: 'movie' },
    { key: 'popular_movies', title: 'Popular Movies', url: `/movie/popular?language=en-US`, type: 'movie' },
    { key: 'now_playing_movies', title: 'Now Playing Movies', url: `/movie/now_playing?language=en-US`, type: 'movie' },
    { key: 'upcoming_movies', title: 'Upcoming Movies', url: `/movie/upcoming?language=en-US`, type: 'movie' },
    { key: 'top_rated_movies', title: 'Top Rated Movies', url: `/movie/top_rated?language=en-US`, type: 'movie' },
  ];
  

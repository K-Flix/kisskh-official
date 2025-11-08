import type { Genre, Movie } from '@/lib/types';
import placeholderImages from './placeholder-images.json';

const allGenres: Genre[] = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
];

const moviesData: Omit<Movie, 'genres'>[] = [
    {
        id: 1,
        title: "Dune: Part Two",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'dune-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'dune-backdrop')!.imageUrl,
        overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        release_date: "2024-02-27",
        vote_average: 8.3,
        cast: [
            { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: null },
            { name: "Zendaya", character: "Chani", profile_path: null }
        ],
        genre_ids: [878, 12]
    },
    {
        id: 2,
        title: "The Creator",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'creator-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'creator-backdrop')!.imageUrl,
        overview: "Amid a future war between the human race and the forces of artificial intelligence, a hardened ex-special forces agent grieving the disappearance of his wife, is recruited to hunt down and kill the Creator, the elusive architect of advanced AI who has developed a mysterious weapon with the power to end the war—and mankind itself.",
        release_date: "2023-09-27",
        vote_average: 7.1,
        cast: [
            { name: "John David Washington", character: "Joshua", profile_path: null },
            { name: "Madeleine Yuna Voyles", character: "Alpha-O / 'Alphie'", profile_path: null }
        ],
        genre_ids: [878, 28, 53]
    },
    {
        id: 3,
        title: "Oppenheimer",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'oppenheimer-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'oppenheimer-backdrop')!.imageUrl,
        overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        release_date: "2023-07-19",
        vote_average: 8.1,
        cast: [
            { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: null },
            { name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: null }
        ],
        genre_ids: [18, 36]
    },
    {
        id: 4,
        title: "The Super Mario Bros. Movie",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'mario-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'mario-backdrop')!.imageUrl,
        overview: "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.",
        release_date: "2023-04-05",
        vote_average: 7.7,
        cast: [
            { name: "Chris Pratt", character: "Mario (voice)", profile_path: null },
            { name: "Anya Taylor-Joy", character: "Princess Peach (voice)", profile_path: null }
        ],
        genre_ids: [16, 10751, 12, 14, 35]
    },
    {
        id: 5,
        title: "Godzilla Minus One",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'godzilla-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'godzilla-backdrop')!.imageUrl,
        overview: "Post-war Japan is at its lowest point when a new crisis emerges in the form of a giant monster, baptized in the horrific power of the atomic bomb.",
        release_date: "2023-11-03",
        vote_average: 8.0,
        cast: [
            { name: "Ryunosuke Kamiki", character: "Kōichi Shikishima", profile_path: null },
            { name: "Minami Hamabe", character: "Noriko Ōishi", profile_path: null }
        ],
        genre_ids: [878, 27, 28]
    },
    {
        id: 6,
        title: "Spider-Man: Across the Spider-Verse",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'spiderman-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'spiderman-backdrop')!.imageUrl,
        overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
        release_date: "2023-05-31",
        vote_average: 8.4,
        cast: [
            { name: "Shameik Moore", character: "Miles Morales (voice)", profile_path: null },
            { name: "Hailee Steinfeld", character: "Gwen Stacy (voice)", profile_path: null }
        ],
        genre_ids: [16, 28, 12, 878]
    },
     {
        id: 7,
        title: "Poor Things",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'poor-things-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'poor-things-backdrop')!.imageUrl,
        overview: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents. Free from the prejudices of her times, she grows steadfast in her purpose to stand for equality and liberation.",
        release_date: "2023-12-08",
        vote_average: 8.0,
        cast: [
            { name: "Emma Stone", character: "Bella Baxter", profile_path: null },
            { name: "Mark Ruffalo", character: "Duncan Wedderburn", profile_path: null }
        ],
        genre_ids: [878, 18, 35, 10749]
    },
    {
        id: 8,
        title: "Anatomy of a Fall",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'anatomy-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'anatomy-backdrop')!.imageUrl,
        overview: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the main witness.",
        release_date: "2023-08-23",
        vote_average: 7.7,
        cast: [
            { name: "Sandra Hüller", character: "Sandra", profile_path: null },
            { name: "Swann Arlaud", character: "Vincent Renzi", profile_path: null }
        ],
        genre_ids: [53, 80, 18]
    },
    {
        id: 9,
        title: "Past Lives",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'past-lives-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'past-lives-backdrop')!.imageUrl,
        overview: "Nora and Hae Sung, two deeply connected childhood friends, are wrest apart after Nora's family emigrates from South Korea. Twenty years later, they are reunited for one fateful week as they confront notions of love, destiny and the choices that make a life.",
        release_date: "2023-06-02",
        vote_average: 7.9,
        cast: [
            { name: "Greta Lee", character: "Nora", profile_path: null },
            { name: "Teo Yoo", character: "Hae Sung", profile_path: null }
        ],
        genre_ids: [18, 10749]
    },
    {
        id: 10,
        title: "The Holdovers",
        poster_path: placeholderImages.placeholderImages.find(p => p.id === 'holdovers-poster')!.imageUrl,
        backdrop_path: placeholderImages.placeholderImages.find(p => p.id === 'holdovers-backdrop')!.imageUrl,
        overview: "A curmudgeonly instructor at a New England prep school is forced to remain on campus during Christmas break to babysit the handful of students with nowhere to go. Eventually, he forms an unlikely bond with one of them — a damaged, brainy troublemaker — and with the school’s head cook, who has just lost a son in Vietnam.",
        release_date: "2023-10-27",
        vote_average: 7.9,
        cast: [
            { name: "Paul Giamatti", character: "Paul Hunham", profile_path: null },
            { name: "Da'Vine Joy Randolph", character: "Mary Lamb", profile_path: null }
        ],
        genre_ids: [35, 18]
    }
];

const movies: Movie[] = moviesData.map(movie => ({
    ...movie,
    genres: movie.genre_ids.map(id => allGenres.find(g => g.id === id)!).filter(Boolean)
}));

export const getGenres = async (): Promise<Genre[]> => {
    return allGenres;
}

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
    return movies.filter(movie => movie.genre_ids.includes(genreId));
}

export const getTrendingMovies = async (): Promise<Movie[]> => {
    // Return a slice of movies, sorted by vote_average to simulate "trending"
    return [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
}

export const getAllMovies = async (): Promise<Movie[]> => {
    return movies;
}

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
    return movies.find(movie => movie.id === id);
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const lowercasedQuery = query.toLowerCase();
    return movies.filter(movie => movie.title.toLowerCase().includes(lowercasedQuery));
}

export const getFeaturedMovie = async (): Promise<Movie | undefined> => {
    return movies.find(movie => movie.id === 1); // Dune: Part Two as featured
}

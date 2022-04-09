const API_KEY = "e51171931820c845ce6637f3e578d769";
const BASE_URL = "https://api.themoviedb.org/3";
const movieId = "";

export interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
}
export interface IGetNowPlayMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface ISearchedMovie {
  id: number;
  backdrop_path: string;
  name: string;
  adult: boolean;
  media_type: string;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  original_title: string;
}
export interface ISearchedMovies {
  results: ISearchedMovie[];
}

export function getNowPlayMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export async function getSearchedMovies(keyword: string) {
  return await (
    await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=true`
    )
  ).json();
}

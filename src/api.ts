const API_KEY = "e51171931820c845ce6637f3e578d769";
const BASE_URL = "https://api.themoviedb.org/3";

// Movies interface
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
export interface ILatestMovie {
  backdrop_path: string | null;
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  title: string;
}
// Movies interface

// Tv interface
export interface ILatestTv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  original_name: string;
  overview: string;
  vote_average: number;
}
export interface IAirTodayTvs {
  page: number;
  results: IAirTodayTv[];
}
export interface IAirTodayTv {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}
export interface IpopulaTv {
  backdrop_path: string;
  first_air_date: string;
  id: string;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}
export interface IPopulaTvs {
  page: number;
  results: IpopulaTv[];
}
export interface ITopRatedTv {
  backdrop_path: string;
  first_air_date: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}
export interface ITopRatedTvs {
  page: number;
  results: ITopRatedTv[];
}
// Tv interface

// fetch Movies
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
export async function getLatestMovie() {
  return await (
    await fetch(`${BASE_URL}/movie/latest?api_key=${API_KEY}`)
  ).json();
}
// fetch Movies

// fetch Tv
export async function getLatestTv() {
  return await fetch(`${BASE_URL}/tv/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export async function getAiringTodayTv() {
  return await fetch(
    `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&page=1`
  ).then((response) => response.json());
}
export async function getPopularTv() {
  return await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`).then(
    (response) => response.json()
  );
}
export async function getTopRatedTv() {
  return await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=1`).then(
    (reponse) => reponse.json()
  );
}
export async function getTv(tvId: any) {
  return await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`).then(
    (reponse) => reponse.json()
  );
}
// fetch Tv

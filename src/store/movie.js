import { Store } from "../core/heropy";
import dotenv from 'dotenv';

dotenv.config();

const store = new Store({
  searchText: '',
  page: 1,
  pageMax: 1,
  movies: [],
  loading: false,
  message: 'Search for the movie title!'
});

console.log(store.state);

export default store;
export const searchMovies = async page => {
  store.state.loading = true;
  store.state.page = page;
  if(page === 1) {
    store.state.movies = [];
    store.state.message = '';
  }
  // 영화 리스트 api 연결
  try {
    const res = await fetch(`${process.env.OMDb_API_KEY}s=${store.state.searchText}&page=${page}`);
    const { Search, totalResults, Response, Error } = await res.json();
    if(Response === 'True') {
      store.state.movies = [
        ...store.state.movies,
        ...Search
      ]
      store.state.pageMax = Math.ceil(Number(totalResults) / 10);
    } else {
      store.state.message = Error;
    }
  } catch (error) {
    console.log('searchMovies error: ', error);
  } finally {
    store.state.loading = false;
  }
}
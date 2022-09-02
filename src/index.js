import axios from 'axios';
// import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryCard } from './js/templates';
// import { fetchData } from './js/fetchImages';

// const axios = require('axios').default;
// const DEBOUNCE_DELAY = 300;

const KEY = `key=29520671-c96ba25b52e4cbbca2f07c463`;
const SEARCH_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = 40;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

axios.defaults.baseURL = `https://pixabay.com/api/`;

let currentPage = 1;
let query = '';
let items = [];
let totalPages = 0;

const loadMoreOn = () => refs.loadMoreBtn.classList.remove('is-hidden');
const loadMoreOff = () => refs.loadMoreBtn.classList.add('is-hidden');

function fetchData(searchImg) {
  axios
    .get(
      `?${KEY}&q=${searchImg}&${SEARCH_PARAMS}&per_page=${PER_PAGE}&page=${currentPage}`
    )
    .then(({ data }) => {
      totalPages = data.totalHits / PER_PAGE;
      console.log(items);
      console.log(data);
      console.log(totalPages);
      items = data.hits;
      render(items);
    })
    .catch(error => console.log(error.message));
}

function render() {
  const list = createGalleryCard(items);
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', list);
  loadMoreOn();
}

function handleSubmit(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value;
  console.log(query);
  fetchData(query);
}

refs.searchForm.addEventListener('submit', handleSubmit);

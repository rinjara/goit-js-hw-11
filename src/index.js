import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createGalleryCard } from './js/templates';

const KEY = `key=29520671-c96ba25b52e4cbbca2f07c463`;
const SEARCH_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = 40;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

axios.defaults.baseURL = `https://pixabay.com/api/`;

let currentPage = 1;
let query = '';
let items = [];
let totalHits = 0;
let hitsLeft = 0;

const loadMoreOn = () => refs.loadMoreBtn.classList.remove('is-hidden');
const loadMoreOff = () => refs.loadMoreBtn.classList.add('is-hidden');

async function fetchData() {
  try {
    const { data } = await axios.get(
      `?${KEY}&q=${query}&${SEARCH_PARAMS}&per_page=${PER_PAGE}&page=${currentPage}`
    );

    if (data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    items = data.hits;
    totalHits = data.totalHits;
    hitsLeft = data.totalHits - data.hits.length;
    render(items);
    if (data.hits.length < PER_PAGE) {
      Notify.info('We`re sorry, but you`ve reached the end of search results.');
      loadMoreOff();
    }
  } catch (error) {
    Notify.warning(error.message);
    console.log(error.message);
  }
}

function render() {
  const list = createGalleryCard(items);
  refs.gallery.insertAdjacentHTML('beforeend', list);
  loadMoreOn();
  lightbox.refresh();
}

async function handleSubmit(e) {
  e.preventDefault();
  loadMoreOff();
  refs.gallery.innerHTML = '';
  currentPage = 1;

  query = e.target.elements.searchQuery.value.trim();
  if (!query) {
    return;
  }
  console.log(query);
  await fetchData();
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function onLoadMoreBtnClick() {
  currentPage += 1;

  if (hitsLeft === 0 || hitsLeft < 0) {
    loadMoreOff();
    return Notify.info(
      'We`re sorry, but you`ve reached the end of search results.'
    );
  }
  fetchData();
}

refs.searchForm.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

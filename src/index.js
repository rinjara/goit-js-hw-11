import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { cardTemplate } from './js/templates';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const axios = require('axios').default;

const ref = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.gallery'),
};

ref.searchForm.addEventListener('input', () => {});

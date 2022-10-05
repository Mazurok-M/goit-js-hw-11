import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import NewsApiService from './js/news-service';
import { createContainerCardImg } from './js/container-card';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const newsApiService = new NewsApiService();

const newCallary = new SimpleLightbox('.link');

let currentHits = 0;

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
buttonLoadMoreHidden();

function onSearch(e) {
  e.preventDefault();
  try {
    buttonLoadMoreHidden();
    newsApiService.query = e.target.elements.searchQuery.value;
    newsApiService.resetPage();
    newsApiService.fetchArticles().then(({ hits, totalHits }) => {
      clearContainerCardImg();
      currentHits = hits.length;

      if (totalHits === 0 || newsApiService.query === '') {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      appendImgMarkup(hits);
      newCallary.refresh();

      if (currentHits === totalHits) {
        return;
      }
      buttonLoadMoreActive();
    });
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  buttonLoadMoreHidden();
  newsApiService.fetchArticles().then(({ hits, totalHits }) => {
    appendImgMarkup(hits);
    newCallary.refresh();
    buttonLoadMoreActive();
    currentHits += hits.length;

    if (currentHits === totalHits) {
      Notiflix.Notify.failure(
        'Were sorry, but youve reached the end of search results.'
      );
      buttonLoadMoreHidden();
    }
  });
}

function appendImgMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML(
    'beforeend',
    createContainerCardImg(hits)
  );
}

function clearContainerCardImg() {
  refs.galleryContainer.innerHTML = '';
}

function buttonLoadMoreHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function buttonLoadMoreActive() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

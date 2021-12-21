import Notiflix from 'notiflix';
const axios = require('axios').default;

const inputSearch = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let pageNumber = 1;
let imageCounter = 0;

async function fetchImages(name, page) {
  try {
    const res = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?key=24785169-ce0e5464f046c25feb9965069&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
    });
    return res.data;
  } catch (error) {
    return Notiflix.Notify.failure('Oops! Error!');
  }
}

function clearResults() {
  gallery.innerHTML = '';
  pageNumber = 1;
  imageCounter = 0;
  loadMoreButton.classList.add('is-hidden');
}

let foundImages = [];
let totalHits;

searchButton.addEventListener('click', event => {
  event.preventDefault();
  clearResults();
  fetchImages(inputSearch.value, pageNumber).then(res => {
    if (inputSearch.value === '') {
      Notiflix.Notify.failure('Nie wiem czego mam szukać! Wpisz coś!');
    } else if (res.total === 0) {
      Notiflix.Notify.failure('Nie znalazłem żadnych obrazków!');
    } else {
      Notiflix.Notify.success(`Znalazłem ${res.total} obrazków!`);
      foundImages = res.hits;
      totalHits = res.totalHits;
      buildGallery();
      if (totalHits > 40) {
        loadMoreButton.classList.remove('is-hidden');
      }
    }
  });
});

function buildGallery() {
  foundImages.forEach(function (image) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.innerHTML = `
    <div class="photo">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${image.downloads}
        </p>
      </div>`;
    gallery.append(photoCard);
    imageCounter++;
  });
  Notiflix.Notify.info(`Wyświetlam ${imageCounter} z ${totalHits} obrazków`);
  if (imageCounter >= totalHits) {
    loadMoreButton.classList.add('is-hidden');
    Notiflix.Notify.info('Wszystkie wyniki wyszukiwania zostały wyświetlone');
  }
}

function loadMoreImages() {
  loadMoreButton.classList.add('is-hidden');
  pageNumber++;
  fetchImages(inputSearch.value, pageNumber).then(res => {
    foundImages = res.hits;
    buildGallery();
  });
  if (imageCounter < totalHits) {
    loadMoreButton.classList.remove('is-hidden');
  }
}

loadMoreButton.addEventListener('click', loadMoreImages);

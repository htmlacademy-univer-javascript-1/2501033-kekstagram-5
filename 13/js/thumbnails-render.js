import renderBigPicture from './full-picture-view.js';
import { getData } from './api.js';
import { showFilters, setupFilters } from './filter.js';

function renderThumbnails() {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const fragment = document.createDocumentFragment();

  const renderPhotos = (photos) => {
    photos.forEach((photo) => {
      const pictureElement = pictureTemplate.cloneNode(true);
      const pictureImg = pictureElement.querySelector('.picture__img');
      const pictureLikes = pictureElement.querySelector('.picture__likes');
      const pictureComments = pictureElement.querySelector('.picture__comments');

      pictureImg.src = photo.url;
      pictureImg.alt = photo.description;
      pictureLikes.textContent = photo.likes;
      pictureComments.textContent = photo.comments.length;

      pictureElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        renderBigPicture(photo);
      });

      fragment.append(pictureElement);
    });

    picturesContainer.append(fragment);
  };

  getData().then((photos) => {
    renderPhotos(photos);
    setupFilters(photos, renderPhotos);
    showFilters();
  }).catch(() => {
    showError('Ошибка загрузки фотографий.');
  });
}

function showError(message) {
  const errorTemplate = document.querySelector('#error').content.cloneNode(true);
  const errorMessage = errorTemplate.querySelector('.error__title');
  errorMessage.textContent = message;

  document.body.append(errorTemplate);
  const errorButton = document.querySelector('.error__button');

  errorButton.addEventListener('click', () => {
    document.querySelector('.error').remove();
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      document.querySelector('.error').remove();
    }
  });

  document.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      document.querySelector('.error').remove();
    }
  });
}

export default renderThumbnails;

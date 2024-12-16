import { debounce } from './util.js';

const FILTER_DEBOUNCE_DELAY = 500;

const filtersContainer = document.querySelector('.img-filters');
const filtersForm = filtersContainer.querySelector('.img-filters__form');
let activeFilter = 'filter-default';

export const showFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive');
};

const clearPhotos = () => {
  const picturesContainer = document.querySelector('.pictures');
  picturesContainer.querySelectorAll('.picture').forEach((photo) => photo.remove());
};

const applyFilter = (filterId, photos) => {
  let filteredPhotos = [];

  switch (filterId) {
    case 'filter-default':
      filteredPhotos = photos.slice();
      break;

    case 'filter-random':
      filteredPhotos = photos.slice().sort(() => Math.random() - 0.5).slice(0, 10);
      break;

    case 'filter-discussed':
      filteredPhotos = photos.slice().sort((a, b) => b.comments.length - a.comments.length);
      break;

    default:
      filteredPhotos = photos.slice();
  }

  return filteredPhotos;
};

const updatePhotos = (filterId, photos, renderPhotos) => {
  clearPhotos();
  const filteredPhotos = applyFilter(filterId, photos);
  renderPhotos(filteredPhotos);
};

export const setupFilters = (photos, renderPhotos) => {
  const debouncedUpdatePhotos = debounce((filterId) => {
    updatePhotos(filterId, photos, renderPhotos);
  }, FILTER_DEBOUNCE_DELAY);

  filtersForm.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('img-filters__button')) {
      document.querySelectorAll('.img-filters__button').forEach((button) => {
        button.classList.remove('img-filters__button--active');
      });
      evt.target.classList.add('img-filters__button--active');
      activeFilter = evt.target.id;
      debouncedUpdatePhotos(activeFilter);
    }
  });
};

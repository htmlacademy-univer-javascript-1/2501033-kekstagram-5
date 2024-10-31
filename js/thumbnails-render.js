import { photoDescriptions } from './data.js';

function renderThumbnails() {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content;
  const fragment = document.createDocumentFragment();

  photoDescriptions.forEach((photo) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    const pictureImg = pictureElement.querySelector('.picture__img');
    const pictureLikes = pictureElement.querySelector('.picture__likes');
    const pictureComments = pictureElement.querySelector('.picture__comments');

    pictureImg.src = photo.url;
    pictureImg.alt = photo.description;
    pictureLikes.textContent = photo.likes;
    pictureComments.textContent = photo.comments.length;

    fragment.append(pictureElement);
  });

  picturesContainer.append(fragment);
}

export default renderThumbnails;


const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');
const bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');

const renderBigPicture = (photoData) => {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPictureImg.src = photoData.url;
  likesCountElement.textContent = photoData.likes;
  commentsCountElement.textContent = photoData.comments.length;
  socialCaptionElement.textContent = photoData.description;

  socialCommentsElement.innerHTML = '';

  const commentsFragment = document.createDocumentFragment();

  photoData.comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    const commentAvatar = document.createElement('img');
    commentAvatar.classList.add('social__picture');
    commentAvatar.src = comment.avatar;
    commentAvatar.alt = comment.name;
    commentAvatar.width = 35;
    commentAvatar.height = 35;

    const commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = comment.message;

    commentElement.appendChild(commentAvatar);
    commentElement.appendChild(commentText);
    commentsFragment.appendChild(commentElement);
  });

  socialCommentsElement.appendChild(commentsFragment);
  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  const onBigPictureEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeBigPicture();
    }
  };

  const onCancelClick = (evt) => {
    evt.preventDefault();
    closeBigPicture();
  };

  function closeBigPicture() {
    bigPictureElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscKeydown);
    bigPictureCancel.removeEventListener('click', onCancelClick);
  }

  document.addEventListener('keydown', onBigPictureEscKeydown);
  bigPictureCancel.addEventListener('click', onCancelClick);
};

export default renderBigPicture;

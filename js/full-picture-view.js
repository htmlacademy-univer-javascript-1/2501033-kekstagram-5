const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');
const bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let currentCommentPage = 0;

const renderComments = () => {
  const startIndex = currentCommentPage * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const commentsToShow = currentComments.slice(startIndex, endIndex);

  const commentsFragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
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

  const displayedComments = Math.min((currentCommentPage + 1) * COMMENTS_PER_PAGE, currentComments.length);
  socialCommentCount.textContent = `${displayedComments} из ${currentComments.length} комментариев`;

  if (displayedComments >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onLoadMoreClick = () => {
  currentCommentPage++;
  renderComments();
};

const renderBigPicture = (photoData) => {
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPictureImg.src = photoData.url;
  likesCountElement.textContent = photoData.likes;
  commentsCountElement.textContent = photoData.comments.length;
  socialCaptionElement.textContent = photoData.description;

  socialCommentsElement.innerHTML = '';
  socialCommentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  currentComments = photoData.comments;
  currentCommentPage = 0;
  renderComments();

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
    commentsLoader.removeEventListener('click', onLoadMoreClick);
  }

  document.addEventListener('keydown', onBigPictureEscKeydown);
  bigPictureCancel.addEventListener('click', onCancelClick);
  commentsLoader.addEventListener('click', onLoadMoreClick);
};

export default renderBigPicture;

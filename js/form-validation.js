import { sendData } from './api.js';
import { onFileUpload } from './image-upload.js';

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS = 5;
const HASHTAG_REGEX = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const uploadFileInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancelButton = document.querySelector('#upload-cancel');
const uploadForm = document.querySelector('.img-upload__form');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const commentsTextarea = uploadForm.querySelector('.text__description');
const submitButton = uploadForm.querySelector('#upload-submit');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'form__error'
});

function resetFormState() {
  uploadForm.reset();
  pristine.reset();

  const imgPreview = document.querySelector('.img-upload__preview img');
  imgPreview.style.transform = '';
  imgPreview.style.filter = '';

  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelValue = document.querySelector('.effect-level__value');
  if (effectLevelSlider && effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.set(100);
  }
  if (effectLevelValue) {
    effectLevelValue.value = 100;
  }

  const defaultEffect = document.querySelector('#effect-none');
  if (defaultEffect) {
    defaultEffect.checked = true;
  }

  if (imgPreview) {
    imgPreview.className = '';
    imgPreview.style.filter = '';
  }
}

function closeUploadOverlay() {
  resetFormState();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function onFileInputChange() {
  onFileUpload();
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    const errorElement = document.querySelector('.error');
    if (!errorElement) {
      if (
        document.activeElement !== hashtagsInput &&
        document.activeElement !== commentsTextarea
      ) {
        evt.preventDefault();
        closeUploadOverlay();
      }
    }
  }
}

function onInputKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

function validateHashtags(value) {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/).map((tag) => tag.toLowerCase());

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }
  if (new Set(hashtags).size !== hashtags.length) {
    return false;
  }

  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
}

function getHashtagsErrorMessage(value) {
  const hashtags = value.trim().split(/\s+/).map((tag) => tag.toLowerCase());

  if (hashtags.length > MAX_HASHTAGS) {
    return 'Нельзя указать больше пяти хэш-тегов!';
  }
  if (new Set(hashtags).size !== hashtags.length) {
    return 'Хэш-теги не должны повторяться!';
  }

  const invalidTag = hashtags.find((tag) => !HASHTAG_REGEX.test(tag));
  if (invalidTag) {
    if (!invalidTag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #!';
    }
    if (invalidTag.length === 1) {
      return 'Хеш-тег не может состоять только из одной решётки!';
    }
    if (invalidTag.length > 20) {
      return 'Максимальная длина хэш-тега 20 символов!';
    }
    return 'Строка после решётки должна состоять из букв и чисел!';
  }
  return '';
}

function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

function getCommentErrorMessage() {
  return `Комментарий не должен превышать ${MAX_COMMENT_LENGTH} символов!`;
}

function showErrorMessage(message) {
  const existingError = document.querySelector('.error');
  if (existingError) {
    existingError.remove();
  }

  const errorTemplate = document.querySelector('#error').content.cloneNode(true);
  const errorMessage = errorTemplate.querySelector('.error__title');
  errorMessage.textContent = message;

  document.body.append(errorTemplate);

  const errorElement = document.querySelector('.error');
  const errorButton = errorElement.querySelector('.error__button');

  function onErrorKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeErrorMessage();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage();
    }
  }

  function closeErrorMessage() {
    errorElement.remove();
    document.removeEventListener('keydown', onErrorKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  errorButton.addEventListener('click', closeErrorMessage);
  document.addEventListener('keydown', onErrorKeydown);
  document.addEventListener('click', onOutsideClick);
}

function showSuccessMessage() {
  const successTemplate = document.querySelector('#success').content.cloneNode(true);
  document.body.append(successTemplate);

  const successElement = document.querySelector('.success');
  const successButton = successElement.querySelector('.success__button');

  function closeSuccess() {
    if (successElement) {
      successElement.remove();
      document.removeEventListener('keydown', onSuccessKeydown);
      document.removeEventListener('click', onSuccessOutsideClick);
    }
  }

  function onSuccessKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccess();
    }
  }

  function onSuccessOutsideClick(evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccess();
    }
  }

  successButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onSuccessKeydown);
  document.addEventListener('click', onSuccessOutsideClick);
}


pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsErrorMessage);
pristine.addValidator(commentsTextarea, validateComment, getCommentErrorMessage);

hashtagsInput.addEventListener('keydown', onInputKeydown);
commentsTextarea.addEventListener('keydown', onInputKeydown);

uploadFileInput.addEventListener('change', onFileInputChange);

uploadCancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
});

document.addEventListener('keydown', onDocumentKeydown);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    submitButton.disabled = true;
    sendData(new FormData(uploadForm))
      .then(() => {
        showSuccessMessage();
        closeUploadOverlay();
      })
      .catch(() => {
        showErrorMessage('Не удалось отправить данные.');
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }
});

import { sendData } from './api.js';

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

const onFileInputChange = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeUploadOverlay = () => {
  // eslint-disable-next-line no-use-before-define
  resetFormState();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

uploadCancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
});

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    if (document.activeElement !== hashtagsInput && document.activeElement !== commentsTextarea) {
      evt.preventDefault();
      closeUploadOverlay();
    }
  }
};

document.addEventListener('keydown', onDocumentKeydown);

const onInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

hashtagsInput.addEventListener('keydown', onInputKeydown);
commentsTextarea.addEventListener('keydown', onInputKeydown);

uploadFileInput.addEventListener('change', onFileInputChange);

const MAX_HASHTAGS = 5;
const HASHTAG_REGEX = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const validateHashtags = (value) => {
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
};

const getHashtagsErrorMessage = (value) => {
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
};

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsErrorMessage);

const showErrorMessage = (message) => {
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
};

const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success').content.cloneNode(true);
  document.body.append(successTemplate);

  const successButton = document.querySelector('.success__button');
  successButton.addEventListener('click', () => {
    document.querySelector('.success').remove();
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      document.querySelector('.success').remove();
    }
  });

  document.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      document.querySelector('.success').remove();
    }
  });
};

const resetFormState = () => {
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
};

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

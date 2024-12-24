const BASE_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить фотографии. Обновите страницу.',
  SEND_DATA: 'Не удалось отправить данные. Попробуйте ещё раз.',
};

const showDataErrorMessage = (message) => {
  const existingDataError = document.querySelector('.data-error');
  if (existingDataError) {
    existingDataError.remove();
  }

  const existingError = document.querySelector('.error');
  if (existingError) {
    existingError.remove();
  }

  const dataErrorTemplate = document.querySelector('#data-error').content.cloneNode(true);
  const dataErrorMessage = dataErrorTemplate.querySelector('.data-error__title');
  dataErrorMessage.textContent = message;

  document.body.append(dataErrorTemplate);

  const dataErrorElement = document.querySelector('.data-error');
  const dataErrorButton = dataErrorElement.querySelector('.data-error__button');

  function closeDataErrorMessage() {
    dataErrorElement.remove();
    document.removeEventListener('keydown', onDataErrorKeydown);
  }

  function onDataErrorKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeDataErrorMessage();
    }
  }

  dataErrorButton.addEventListener('click', closeDataErrorMessage);
  document.addEventListener('keydown', onDataErrorKeydown);

  document.addEventListener('click', (evt) => {
    if (!evt.target.closest('.data-error__inner')) {
      closeDataErrorMessage();
    }
  });
};

const load = async (route, errorText, method = Method.GET, body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${route}`, { method, body });
    if (!response.ok) {
      throw new Error(errorText);
    }
    return await response.json();
  } catch {
    showDataErrorMessage(errorText);
    throw new Error(errorText);
  }
};

const getData = () => load(Route.GET_DATA, ErrorText.GET_DATA);

const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export { getData, sendData };

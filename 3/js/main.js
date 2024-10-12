const DESCRIPTIONS = [
  'мое любимое фото',
  'мое не любимое фото',
  'не мое любмиое фото',
  'не мое фото',
];

const COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артем',
  'Елена',
  'Виктор',
  'Василий',
  'Валерий'
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomId (min, max) {
  const previousId = [];
  return function () {
    let currentId = getRandomInt(min, max);
    if (previousId.length >= (max - min + 1)) {
      return null;
    }
    while (previousId.includes(currentId)) {
      currentId = getRandomInt(min, max);
    }
    previousId.push(currentId);
    return currentId;
  };
}

const getDescriptionId = createRandomId(1,25);

function createPhotoDescription() {
  const id = getDescriptionId();
  return ({
    id: id,
    url: `photos/${id}.jpg`,
    description: DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)],
    likes: getRandomInt(15, 200),
    comments: Array.from({ length: getRandomInt(0, 30) }, createComment),
  });
}

function createComment() {
  const getCommentId = createRandomId(0,30);
  return ({
    id: getCommentId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: COMMENTS[getRandomInt(0, COMMENTS.length - 1)],
    name: NAMES[getRandomInt(0, NAMES.length - 1)],
  });
}

const photoDescriptions = Array.from({length: 25}, createPhotoDescription);

console.log(photoDescriptions);

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imgPreview = document.querySelector('.img-upload__preview img');

const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  'none': {
    style: '',
    unit: '',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
  },
  'chrome': {
    style: 'grayscale',
    unit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
  },
  'sepia': {
    style: 'sepia',
    unit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
  },
  'marvin': {
    style: 'invert',
    unit: '%',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
  },
  'phobos': {
    style: 'blur',
    unit: 'px',
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
  },
  'heat': {
    style: 'brightness',
    unit: '',
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
  },
};

let currentEffect = EFFECTS['none'];

function setScale(value) {
  scaleControlValue.value = `${value}%`;
  imgPreview.style.transform = `scale(${value / 100})`;
}

function initScale() {
  setScale(SCALE_DEFAULT);

  scaleControlSmaller.addEventListener('click', () => {
    const currentValue = parseInt(scaleControlValue.value, 10);
    let newValue = currentValue - SCALE_STEP;
    if (newValue < SCALE_MIN) {
      newValue = SCALE_MIN;
    }
    setScale(newValue);
  });

  scaleControlBigger.addEventListener('click', () => {
    const currentValue = parseInt(scaleControlValue.value, 10);
    let newValue = currentValue + SCALE_STEP;
    if (newValue > SCALE_MAX) {
      newValue = SCALE_MAX;
    }
    setScale(newValue);
  });
}

function updateEffect(value) {
  effectLevelValue.value = value;
  if (currentEffect.style) {
    imgPreview.style.filter = `${currentEffect.style}(${value}${currentEffect.unit})`;
  } else {
    imgPreview.style.filter = '';
  }
}

function onSliderUpdate() {
  const value = effectLevelSlider.noUiSlider.get();
  updateEffect(value);
}

function onEffectChange(evt) {
  const effectName = evt.target.value;
  currentEffect = EFFECTS[effectName];

  if (currentEffect.style === '') {
    effectLevelContainer.style.display = 'none';
    imgPreview.style.filter = '';
  } else {
    effectLevelContainer.style.display = 'block';
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: currentEffect.min,
        max: currentEffect.max,
      },
      start: currentEffect.start,
      step: currentEffect.step,
    });
    effectLevelSlider.noUiSlider.set(currentEffect.start);
  }
}

function initEffects() {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: currentEffect.min,
      max: currentEffect.max,
    },
    start: currentEffect.start,
    step: currentEffect.step,
    connect: 'lower',
    format: {
      to: (value) => value % 1 === 0 ? value.toFixed(0) : value.toFixed(1),
      from: (value) => parseFloat(value),
    },
  });

  effectLevelContainer.style.display = 'none';
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
  effectsList.addEventListener('change', onEffectChange);
}

export function initImageEditor() {
  initScale();
  initEffects();
}


const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const uploadFileInput = document.querySelector('#upload-file');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const onFileUpload = () => {
  const file = uploadFileInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    const fileURL = URL.createObjectURL(file);
    imgPreview.src = fileURL;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${fileURL})`;
    });
  }
};

export { onFileUpload };

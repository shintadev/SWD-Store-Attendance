const width = 321;
const height = 241;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let imageData;
let file;
const imgMsg = document.getElementById('img-msg');
const msg = document.getElementById('msg');
const captureBtn = document.getElementById('capture-btn');
const addBtn = document.getElementById('add-employee-btn');

let stream;

video.setAttribute('width', width);
video.setAttribute('height', height);

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((mediaStream) => {
    stream = mediaStream;
    video.srcObject = stream;
  })
  .catch(function (err) {
    console.error('Error accessing webcam:', err);
  });

captureBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  context.drawImage(video, 0, 0, width, height);

  file = await getFile(canvas);
  console.log('🚀 ~ file:', file);

  imgMsg.innerText = 'OK';

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
});

addBtn.addEventListener('click', async function () {
  const formData = new FormData();

  // Access and add form data from the input elements
  const name_ = document.getElementById('name-input').value;
  console.log('🚀 ~ name_:', name_);

  const DOB = document.getElementById('dob-input').value;
  console.log('🚀 ~ DOB:', DOB);

  const phone = document.getElementById('phone-input').value;
  console.log('🚀 ~ phone:', phone);

  const address = document.getElementById('address-input').value;
  console.log('🚀 ~ address:', address);

  // Add image data to the FormData
  formData.append('file', file); // Extract base64 data after comma
  formData.append('name', name_);
  formData.append('DOB', DOB);
  formData.append('phone', phone);
  formData.append('address', address);

  await upload(formData);

  window.location.href = '/employees';
});

async function upload(formData) {
  try {
    const response = await fetch('api/employees', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    msg.innerText = 'Image successfully sent to API!';
    console.log('Success:', result);
  } catch (error) {
    msg.innerText = 'Error sending image:';
    console.error('Error:', error);
  }
}

function getFile(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const result = new File([blob], 'img.jpg', { type: 'image/jpeg' });
      console.log('🚀 ~ file=awaitcanvas.toBlob ~ result:', result);
      resolve(result);
    }, 'image/jpeg');
  });
}

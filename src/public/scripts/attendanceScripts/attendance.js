const storeInput = document.getElementById('store-select');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let file;
const msg = document.getElementById('msg');
const captureBtn = document.getElementById('capture-btn');

async function preStart() {
  const storeResponse = await fetch('/api/store/all', {
    method: 'GET',
  });
  const storeJson = await storeResponse.json();

  const storeData = storeJson.data;

  storeData.forEach((element) => {
    const option = document.createElement('option');
    option.textContent = element.id + ' : ' + element.name;
    option.value = element.id; // Assign a value to each option
    storeInput.appendChild(option);
  });
}

async function upload(formData) {
  try {
    const response = await fetch('api/attendance', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.error) msg.innerText = result.error;
    else msg.innerText = result.data.name + '\n' + result.message;
  } catch (error) {
    msg.innerText = error;
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

let stream;
canvas.style.display = 'none';
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch(function (err) {
    console.error('Error accessing webcam:', err);
  });

captureBtn.addEventListener('click', async (e) => {
  const context = await canvas.getContext('2d');
  await context.drawImage(video, 0, 0, canvas.width, canvas.height);
  file = await getFile(canvas);

  if (stream) {
    await stream.getTracks().forEach((track) => track.stop());
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('storeId', storeInput.value);

  await upload(formData);
});

preStart();

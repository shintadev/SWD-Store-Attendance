const storeInput = document.getElementById('store-select');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let file;
const msg = document.getElementById('msg');
const captureBtn = document.getElementById('capture-btn');
const employeeBtn = document.getElementById('employee-btn');
const scheduleBtn = document.getElementById('schedule-btn');
const userBtn = document.getElementById('user-btn');
const storeBtn = document.getElementById('store-btn');
const loginBtn = document.getElementById('login-btn');

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

  const role = getCookie('role');
  console.log('🚀 ~ document.addEventListener ~ role:', role);

  if (role) {
    employeeBtn.style.display = 'block';
    scheduleBtn.style.display = 'block';
    if (role == 'MANAGER') {
      userBtn.style.display = 'none';
      storeBtn.style.display = 'none';
    } else {
      userBtn.style.display = 'block';
      storeBtn.style.display = 'block';
    }
    loginBtn.style.display = 'none';
  } else {
    employeeBtn.style.display = 'none';
    scheduleBtn.style.display = 'none';
    userBtn.style.display = 'none';
    storeBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  }
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

function getCookie(name) {
  const value = document.cookie;
  const parts = value.split(';');
  if (parts.length > 1) {
    return parts.find((e) => {
      if (e.split('=')[0] === name) return e;
    });
  } else return parts[0].split('=')[1];
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

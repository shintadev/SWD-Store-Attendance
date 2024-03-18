const width = 321;
const height = 241;
const canvas = document.getElementById('canvas');
let imageData;
let file;
const nameField = document.getElementById('name-input');
const dobField = document.getElementById('dob-input');
const phoneField = document.getElementById('phone-input');
const addressField = document.getElementById('address-input');
const confirmBtn = document.getElementById('confirm-employee-btn');
const cancelBtn = document.getElementById('cancel-employee-btn');

const id = localStorage.getItem('id');

if (!id) window.location.href = '/employees';

async function renderItems() {
  const response = await fetch('/api/employees?id=' + id, {
    method: 'GET',
  });
  const result = await response.json();
  const data = result.data;
  console.log('🚀 ~ data:', data);

  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var img = new Image();
  img.onload = function () {
    context.drawImage(img, 0, 0, width, height);
  };
  img.src = data.imgUrl;

  nameField.value = data.dataValues.name;

  dobField.valueAsDate = new Date(data.dataValues.DOB);

  phoneField.value = data.dataValues.phone;

  addressField.value = data.dataValues.address;
}

confirmBtn.addEventListener('click', async function () {
  const formData = new FormData();

  // Access and add form data from the input elements
  const name_ = nameField.value;

  const DOB = dobField.value;

  const phone = phoneField.value;

  const address = addressField.value;

  // Add image data to the FormData
  formData.append('id', id);
  formData.append('name', name_);
  formData.append('DOB', DOB);
  formData.append('phone', phone);
  formData.append('address', address);

  await upload(formData);

  localStorage.clear();
  window.location.href = '/employees';
});

cancelBtn.addEventListener('click', async function () {
  localStorage.clear();
  window.location.href = '/employees';
});

async function upload(formData) {
  try {
    const response = await fetch('/api/employees', {
      method: 'PUT',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

renderItems();

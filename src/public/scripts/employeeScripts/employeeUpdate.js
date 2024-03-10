const nameField = document.getElementById('name-input');
const dobField = document.getElementById('dob-input');
const phoneField = document.getElementById('phone-input');
const addressField = document.getElementById('address-input');
const updateBtn = document.getElementById('update-employee-btn');
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

  nameField.value = data.name;
  dobField.valueAsDate = new Date(data.DOB);
  phoneField.value = data.phone;
  addressField.value = data.address;
}

updateBtn.addEventListener('click', async function () {
  const formData = new FormData();

  // Access and add form data from the input elements
  const name_ = nameField.value;
  console.log('🚀 ~ name_:', name_);

  const DOB = dobField.value;
  console.log('🚀 ~ DOB:', DOB);

  const phone = phoneField.value;
  console.log('🚀 ~ phone:', phone);

  const address = addressField.value;
  console.log('🚀 ~ address:', address);

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

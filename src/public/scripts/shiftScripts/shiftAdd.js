const shiftInput = document.getElementById('shift-no-select');
const dateInput = document.getElementById('date-input');
const storeInput = document.getElementById('store-select');
const addBtn = document.getElementById('add-shift-btn');
const cancelBtn = document.getElementById('cancel-shift-btn');

async function renderItems() {
  const response = await fetch('/api/store/all', {
    method: 'GET',
  });
  const result = await response.json();

  const data = result.data;
  console.log('🚀 ~ renderItems ~ data:', data);

  data.forEach((element) => {
    const option = document.createElement('option');
    option.textContent = element.id + ' : ' + element.name;
    option.value = element.id; // Assign a value to each option
    storeInput.appendChild(option);
  });
}

addBtn.addEventListener('click', async function () {
  const formData = new FormData();

  const shiftNo = shiftInput.value;
  const date = new Date(dateInput.value).toISOString();
  const storeId = storeInput.value;

  formData.append('shiftNo', shiftNo);
  formData.append('day', date);
  formData.append('storeId', storeId);

  await upload(formData);

  window.location.href = '/schedule';
});

cancelBtn.addEventListener('click', async function () {
  window.location.href = '/schedule';
});

async function upload(formData) {
  try {
    const response = await fetch('/api/shift', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

renderItems();
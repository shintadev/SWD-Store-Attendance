const shiftInput = document.getElementById('shift-no-select');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-shift-btn');
const cancelBtn = document.getElementById('cancel-shift-btn');

addBtn.addEventListener('click', async function () {
  const formData = new FormData();

  const shiftNo = shiftInput.value;
  const date = dateInput.value;

  formData.append('shiftNo', shiftNo);
  formData.append('day', date);

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

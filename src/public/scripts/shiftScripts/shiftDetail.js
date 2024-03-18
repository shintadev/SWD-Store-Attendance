const shiftInput = document.getElementById('shift-no-select');
const dateInput = document.getElementById('date-input');
const storeInput = document.getElementById('store-select');
const assignInput = document.getElementById('assign-select');
const selectedItems = document.getElementById('selected-items');
const confirmBtn = document.getElementById('confirm-shift-btn');

const selectedId = new Set();

const id = localStorage.getItem('id');

if (!id) window.location.href = '/shift';

async function renderItems() {
  const shiftResponse = await fetch('/api/shift?id=' + id, {
    method: 'GET',
  });
  const shiftJson = await shiftResponse.json();
  const shiftData = shiftJson.data;
  console.log('🚀 ~ renderItems ~ shiftData:', shiftData);

  shiftInput.value = shiftData.shift.shiftNo;
  dateInput.valueAsDate = new Date(shiftData.shift.day);

  const storeResponse = await fetch('/api/store?id=' + shiftData.shift.storeId, {
    method: 'GET',
  });
  const storeJson = await storeResponse.json();
  const storeData = await storeJson.data;

  const option = document.createElement('option');
  option.textContent = storeData.id + ' : ' + storeData.name;
  option.value = storeData.id;
  storeInput.appendChild(option);
  storeInput.value = storeData.id;

  const assignId = [];

  await shiftData.employeeOfShift.forEach((element) => {
    assignId.push(element.employeeId);
  });

  const employeesResponse = await fetch('/api/employees/all', {
    method: 'GET',
  });
  const employeesJson = await employeesResponse.json();
  const employeesData = employeesJson.data;

  employeesData.forEach((element) => {
    if (!assignId.includes(element.id)) {
      const option = document.createElement('option');
      option.textContent = element.id + ' : ' + element.name;
      option.value = element.id; // Assign a value to each option
      assignInput.appendChild(option);
    } else {
      const listItem = document.createElement('div');
      listItem.textContent = element.id + ' : ' + element.name;
      listItem.classList.add('selected-item');
      listItem.addEventListener('click', function () {
        assignInput.querySelector(`option[value="${optionValue}"]`).selected = false;
        selectedItems.removeChild(listItem);
      });
      selectedItems.appendChild(listItem);
    }
  });
}

assignInput.addEventListener('change', async function (event) {
  const selectedOption = event.target.selectedOptions[0];

  if (selectedOption && selectedOption.value != '') {
    const optionText = selectedOption.textContent;
    const optionValue = selectedOption.value;
    const listItem = document.createElement('div');
    listItem.textContent = optionText;
    listItem.classList.add('selected-item');

    listItem.addEventListener('click', function () {
      assignInput.querySelector(`option[value="${optionValue}"]`).selected = false;
      selectedItems.removeChild(listItem);
    });

    const formData = new FormData();
    formData.append('employeeId', optionText.substring(0, 10));
    formData.append('shiftId', id);
    const response = await fetch('/api/shift/assign', {
      method: 'POST',
      body: formData,
    });

    // selectedId.add(optionText.substring(0, 10));
    selectedItems.appendChild(listItem);
    assignInput.removeChild(selectedOption);
  }
  console.log('🚀 ~ selectedId:', selectedId);
});

selectedItems.addEventListener('click', async function (event) {
  if (event.target.classList.contains('selected-item')) {
    const selectedItemText = event.target.textContent;
    const option = document.createElement('option');
    option.textContent = selectedItemText;
    option.value = event.target.dataset.value;

    const formData = new FormData();
    formData.append('employeeId', selectedItemText.substring(0, 10));
    formData.append('shiftId', id);
    const response = await fetch('/api/shift/assign', {
      method: 'PUT',
      body: formData,
    });

    // selectedId.delete(selectedItemText.substring(0, 10));
    assignInput.appendChild(option);
    selectedItems.removeChild(event.target);
  }
  console.log('🚀 ~ selectedId:', selectedId);
});

confirmBtn.addEventListener('click', async function () {
  window.localStorage.clear();
  window.location.href = '/schedule';
});

renderItems();

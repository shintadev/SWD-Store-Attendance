// DOM elements
const itemList = document.getElementById('item-list');
const storeInput = document.getElementById('store-select');
const dateChoice = document.getElementById('date-choice');
const addBtn = document.getElementById('add-shift-btn');

dateChoice.valueAsDate = new Date();

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

  storeInput.value = storeData[0].id;

  renderItems();
}

async function renderItems() {
  const formData = new FormData();
  formData.append('day', dateChoice.value.toISOString());
  formData.append('storeId', storeInput.value ?? '');

  const response = await fetch('api/shift/schedule', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  const data = result.data;
  console.log('🚀 ~ renderItems ~ data:', data);

  // Clear previous items
  itemList.innerHTML = '';
  for (let row = 1; row <= 4; row++) {
    const tr = document.createElement('tr');
    const headCell = document.createElement('td');
    headCell.innerHTML = 'Shift ' + row + '<br>' + (row * 3 + 5) + ':00 - ' + (row * 3 + 8) + ':00';
    tr.appendChild(headCell);
    for (let col = 0; col <= 6; col++) {
      const cell = document.createElement('td');
      data.every((shift) => {
        const day = new Date(shift.day);
        if (shift.shiftNo === row && day.getDay() === col) {
          cell.innerHTML =
            day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear() + '<br>';
          const detailBtn = document.createElement('button');
          const deleteBtn = document.createElement('button');
          detailBtn.innerText = 'Detail';
          deleteBtn.innerText = 'Delete';
          cell.appendChild(detailBtn);
          cell.appendChild(deleteBtn);

          detailBtn.addEventListener('click', () => {
            callDetail(shift.id);
          });
          deleteBtn.addEventListener('click', () => {
            callDelete(shift.id);
          });
          return false;
        } else {
          cell.innerHTML = '‎ ';
          return true;
        }
      });

      tr.appendChild(cell);
    }
    itemList.appendChild(tr);
  }
}

storeInput.addEventListener('change', () => {
  if (storeInput.value != '') renderItems();
});

dateChoice.addEventListener('change', () => {
  renderItems();
});

addBtn.addEventListener('click', () => {
  callAdd();
});

async function callAdd() {
  window.location.href = '/shift/add';
}

async function callDetail(id) {
  localStorage.setItem('id', id);
  window.location.href = '/shift/detail';
}

async function callDelete(id) {
  if (confirm('This will delete ' + id + ' permanently. Will you continue?')) {
    const formData = new FormData();
    formData.append('id', id);
    await fetch('api/shift', {
      method: 'DELETE',
      body: formData,
    });
    renderItems();
  }
}

// Initial render
preStart();

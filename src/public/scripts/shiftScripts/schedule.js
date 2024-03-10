// DOM elements
const itemList = document.getElementById('item-list');
const addShiftBtn = document.getElementById('add-shift-btn');
const dateChoice = document.getElementById('date-choice');

dateChoice.valueAsDate = new Date();

async function renderItems() {
  const formData = new FormData();
  formData.append('day', dateChoice.value);

  const response = await fetch('api/shift/schedule', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  const data = result.data;

  // Clear previous items
  itemList.innerHTML = '';
  for (let n = 0; n < findMaxColumnLength(data); n++) {
    const tr = document.createElement('tr');
    data.forEach((day) => {
      const cell = document.createElement('td');
      cell.innerHTML = day[n]
        ? day[n].startTime.getHours() +
          ' : ' +
          day[n].startTime.getMinutes() +
          ' - ' +
          day[n].endTime.getHours() +
          ' : ' +
          day[n].endTime.getMinutes() +
          '<br><button>Edit🔄️</button><button>Delete❎</button>'
        : '';

      tr.appendChild(cell);
    });
    itemList.appendChild(tr);
  }
}

function findMaxColumnLength(matrix) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return -1; // Invalid matrix
  }

  let maxColumnLength = 0;

  for (let col = 0; col < matrix[0].length; col++) {
    let columnLength = 0;

    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][col] !== undefined) {
        // Assuming undefined values should not be considered in the length
        columnLength++;
      }
    }

    maxColumnLength = Math.max(maxColumnLength, columnLength);
  }

  return maxColumnLength;
}

dateChoice.addEventListener('change', () => {
  renderItems();
});

async function callAdd() {
  window.location.href = '/shift/form/add';
}

async function callUpdate(id) {
  localStorage.setItem('id', id);
  window.location.href = '/shift/form/update';
}

async function callDelete(id) {
  const formData = new FormData();
  formData.append('id', id);
  await fetch('api/shift', {
    method: 'DELETE',
    body: formData,
  });
  renderItems();
}

// Initial render
renderItems();

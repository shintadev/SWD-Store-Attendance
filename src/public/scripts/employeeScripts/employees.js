// Variables for pagination
const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 0;

// DOM elements
const itemList = document.getElementById('item-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Function to render items based on current page
async function renderItems() {
  const response = await fetch(
    'api/employees/list?page=' + currentPage + '&pageSize=' + itemsPerPage,
    {
      method: 'GET',
    }
  );
  const result = await response.json();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = result.data;
  const list = data.employees;
  totalPages = data.totalPages;

  const currentItems = list.slice(startIndex, endIndex);

  // Clear previous items
  itemList.innerHTML = '';

  // Render current items
  currentItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    let status;
    if (item.status === 'Active') status = '🟢';
    else status = '🔴';
    // Create table cells and add data
    const noCell = document.createElement('td');
    noCell.textContent = index + 1;

    const idCell = document.createElement('td');
    idCell.textContent = item.id;

    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;

    const phoneCell = document.createElement('td');
    phoneCell.textContent = item.phone;

    const statusCell = document.createElement('td');
    statusCell.textContent = status;

    const operationCell = document.createElement('td');
    operationCell.innerHTML =
      '<button onclick="callUpdate(\'' +
      item.id +
      '\')">Edit🔄️</button><button onclick="callDelete(\'' +
      item.id +
      '\')">Delete❎</button>';

    // Append cells to the table row
    tr.appendChild(noCell);
    tr.appendChild(idCell);
    tr.appendChild(nameCell);
    tr.appendChild(phoneCell);
    tr.appendChild(statusCell);
    tr.appendChild(operationCell);

    // Append the table row to the table body
    itemList.appendChild(tr);
  });

  // Update pagination information
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listeners for pagination buttons
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
});

async function callAdd() {
  window.location.href = '/employees/form/add';
}

async function callUpdate(id) {
  localStorage.setItem('id', id);
  window.location.href = '/employees/form/update';
}

async function callDelete(id) {
  const formData = new FormData();
  formData.append('id', id);
  await fetch('api/employees', {
    method: 'DELETE',
    body: formData,
  });
  renderItems();
}

// Initial render
renderItems();

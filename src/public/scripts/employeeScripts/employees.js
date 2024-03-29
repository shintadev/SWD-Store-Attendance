// Variables for pagination
const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 0;

// DOM elements
const itemList = document.getElementById('item-list');
const addBtn = document.getElementById('add-employee-btn');
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
    statusCell.addEventListener('click', () => {
      if (statusCell.textContent == '🟢') {
        callInactivate(item.id);
      } else if (statusCell.textContent == '🔴') {
        callActivate(item.id);
      }
    });

    const operationCell = document.createElement('td');
    const detailBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    detailBtn.innerText = 'Detail';
    deleteBtn.innerText = 'Delete';
    operationCell.appendChild(detailBtn);
    operationCell.appendChild(deleteBtn);

    detailBtn.addEventListener('click', () => {
      callDetail(item.id);
    });
    deleteBtn.addEventListener('click', () => {
      callDelete(item.id);
    });

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
addBtn.addEventListener('click', () => {
  callAdd();
});

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
  window.location.href = '/employees/add';
}

async function callDetail(id) {
  localStorage.setItem('id', id);
  window.location.href = '/employees/detail';
}

async function callActivate(id) {
  const formData = new FormData();
  formData.append('id', id);
  await fetch('api/employees/active', {
    method: 'PUT',
    body: formData,
  });
  renderItems();
}

async function callInactivate(id) {
  const formData = new FormData();
  formData.append('id', id);
  await fetch('api/employees/inactive', {
    method: 'PUT',
    body: formData,
  });
  renderItems();
}

async function callDelete(id) {
  if (confirm('This will delete ' + id + ' permanently. Will you continue?')) {
    const formData = new FormData();
    formData.append('id', id);
    await fetch('api/employees', {
      method: 'DELETE',
      body: formData,
    });
    renderItems();
  }
}

// Initial render
renderItems();

// Variables for pagination
const itemsPerPage = 10;
let currentPage = 1;

// DOM elements
const itemList = document.getElementById('item-list');
const addBtn = document.getElementById('add-store-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Function to render items based on current page
async function renderItems() {
  const response = await fetch('api/store/list?page=' + currentPage + '&pageSize=' + itemsPerPage, {
    method: 'GET',
  });
  const result = await response.json();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = result.data;
  const list = data.stores;

  const currentItems = list.slice(startIndex, endIndex);

  // Clear previous items
  itemList.innerHTML = '';

  // Render current items
  currentItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    // Create table cells and add data
    const noCell = document.createElement('td');
    noCell.textContent = index + 1;

    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;

    const managerCell = document.createElement('td');
    managerCell.textContent = item.managerId;

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
    tr.appendChild(nameCell);
    tr.appendChild(managerCell);
    tr.appendChild(operationCell);

    // Append the table row to the table body
    itemList.appendChild(tr);
  });

  // Update pagination information
  pageInfo.textContent = `Page ${currentPage} of ${data.totalPages}`;
}

async function upload(formData) {
  try {
    const response = await fetch('/api/store', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Event listeners for pagination buttons
addBtn.addEventListener('click', async () => {
  let name = prompt('Please enter store name', 'Store Number x');
  if (name == null || name == '') {
    alert('User cancelled the prompt.');
  } else {
    let managerId = prompt('Please enter manager id', 'User x');
    if (managerId == null || managerId == '') {
      alert('User cancelled the prompt.');
    } else {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('managerId', managerId);

      await upload(formData);

      renderItems();
    }
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
});

async function callDetail(id) {
  const response = await fetch('/api/store?id=' + id, {
    method: 'GET',
  });
  const result = await response.json();
  const data = result.data;

  let name = prompt('Please enter store name', data.name);
  if (name == null || name == '') {
    alert('User cancelled the prompt.');
  } else {
    let managerId = prompt('Please enter manager id', data.managerId);
    if (managerId == null || managerId == '') {
      alert('User cancelled the prompt.');
    } else {
      const formData = new FormData();

      formData.append('id', id);
      formData.append('password', password);

      await upload(formData);

      renderItems();
    }
  }
}

async function callDelete(id) {
  if (confirm('This will delete ' + id + ' permanently. Will you continue?')) {
    const formData = new FormData();
    formData.append('id', id);
    await fetch('api/user', {
      method: 'DELETE',
      body: formData,
    });
    renderItems();
  }
}

// Initial render
renderItems();

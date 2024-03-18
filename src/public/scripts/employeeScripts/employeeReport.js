// Variables for pagination
const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 0;

const id = localStorage.getItem('id');
console.log('🚀 ~ id:', id);

if (!id) window.location.href = '/employees';

// DOM elements
const itemList = document.getElementById('item-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Function to render items based on current page
async function renderItems() {
  const response = await fetch(
    '/api/employees/attendance-report?id=' +
      id +
      '&page=' +
      currentPage +
      '&pageSize=' +
      itemsPerPage,
    {
      method: 'GET',
    }
  );
  const result = await response.json();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = result.data;
  console.log('🚀 ~ renderItems ~ data:', data);

  const list = data.records;
  totalPages = data.totalPages;

  const currentItems = list.slice(startIndex, endIndex);

  // Clear previous items
  itemList.innerHTML = '';

  // Render current items
  currentItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    // Create table cells and add data
    const noCell = document.createElement('td');
    noCell.textContent = index + 1;

    const checkInTime = new Date(item.checkInTime);
    const checkInCell = document.createElement('td');
    checkInCell.textContent = checkInTime.toLocaleString('ja-JP', { timeZoneName: 'short' });

    const checkOutTime = new Date(item.checkOutTime);
    const checkOutCell = document.createElement('td');
    checkOutCell.textContent =
      checkOutTime.toLocaleString('ja-JP', { timeZoneName: 'short' }) ?? 'Not yet';

    const shiftCell = document.createElement('td');
    shiftCell.textContent = item.shiftId;

    // const operationCell = document.createElement('td');
    // const updateBtn = document.createElement('button');
    // const deleteBtn = document.createElement('button');
    // updateBtn.innerText = 'Update';
    // deleteBtn.innerText = 'Delete';
    // operationCell.appendChild(updateBtn);
    // operationCell.appendChild(deleteBtn);

    // updateBtn.addEventListener('click', () => {
    //   callDetail(item.id);
    // });
    // deleteBtn.addEventListener('click', () => {
    //   callDelete(item.id);
    // });

    // Append cells to the table row
    tr.appendChild(noCell);
    tr.appendChild(checkInCell);
    tr.appendChild(checkOutCell);
    tr.appendChild(shiftCell);
    // tr.appendChild(operationCell);

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

// Initial render
renderItems();

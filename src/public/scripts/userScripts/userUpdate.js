const idField = document.getElementById('id-input');
const passwordField = document.getElementById('password-input');
const confirmField = document.getElementById('confirm-input');
const roleField = document.getElementById('role-input');
const updateBtn = document.getElementById('update-user-btn');
const cancelBtn = document.getElementById('cancel-user-btn');

const id = localStorage.getItem('id');

if (!id) window.location.href = '/users';

async function renderItems() {
  const response = await fetch('/api/users?id=' + id, {
    method: 'GET',
  });
  const result = await response.json();
  const data = result.data;
  console.log('🚀 ~ data:', data);

  idField.value = id;
  if (data.role.toUpperCase() === 'ADMIN') roleField.checked = true;
}

confirmField.addEventListener('blur', function () {
  if (passwordField.value !== confirmField.value) {
    confirmMsg.innerText = 'Mật khẩu xác thực không trùng khớp.';
  } else confirmMsg.innerText = '';
});

updateBtn.addEventListener('click', async function () {
  const formData = new FormData();

  if (passwordField.value !== confirmField.value) {
    confirmMsg.innerText = 'Mật khẩu xác thực không trùng khớp.';
    return;
  }

  const password = passwordField.value;
  console.log('🚀 ~ password:', password);

  const role = roleField.checked;
  console.log('🚀 ~ role:', role);

  if (role == true) {
    formData.append('role', 'ADMIN');
  } else formData.append('role', 'MANAGER');

  formData.append('id', id);
  formData.append('password', password);

  await upload(formData);

  localStorage.clear();
  window.location.href = '/users';
});

cancelBtn.addEventListener('click', async function () {
  localStorage.clear();
  window.location.href = '/users';
});

async function upload(formData) {
  try {
    const response = await fetch('/api/users', {
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

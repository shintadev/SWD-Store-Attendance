const passwordField = document.getElementById('password-input');
const confirmField = document.getElementById('confirm-input');
const passwordMsg = document.getElementById('password-msg');
const confirmMsg = document.getElementById('confirm-msg');
const addBtn = document.getElementById('add-user-btn');
const cancelBtn = document.getElementById('cancel-user-btn');

passwordField.addEventListener('blur', function () {
  if (passwordField.value.length < 6) {
    passwordMsg.innerText = 'Mật khẩu phải chứa 6 ký tự trở lên.';
  } else passwordMsg.innerText = '';
});

confirmField.addEventListener('blur', function () {
  if (passwordField.value !== confirmField.value) {
    confirmMsg.innerText = 'Mật khẩu xác thực không trùng khớp.';
  } else confirmMsg.innerText = '';
});

addBtn.addEventListener('click', async function () {
  const formData = new FormData();

  if (passwordField.value.length < 6) {
    passwordMsg.innerText = 'Mật khẩu phải chứa 6 ký tự trở lên.';
    return;
  }

  if (passwordField.value !== confirmField.value) {
    confirmMsg.innerText = 'Mật khẩu xác thực không trùng khớp.';
    return;
  }

  const id = document.getElementById('id-input').value;
  console.log('🚀 ~ id:', id);

  const password = document.getElementById('password-input').value;
  console.log('🚀 ~ password:', password);

  const role = document.getElementById('role-input');
  if (role.checked == true) {
    formData.append('role', 'ADMIN');
  }

  formData.append('id', id);
  formData.append('password', password);

  await upload(formData);

  window.location.href = '/users';
});

cancelBtn.addEventListener('click', async function () {
  window.location.href = '/users';
});

async function upload(formData) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

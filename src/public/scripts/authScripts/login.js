const loginBtn = document.getElementById('login-btn');
const msg = document.getElementById('msg');
const errorMsg = localStorage.getItem('error');

if (errorMsg) {
  msg.style.color = 'red';
  msg.innerText = errorMsg;
  localStorage.clear();
}
async function login() {
  const formData = new FormData();

  // Perform login logic (you should implement server-side authentication)
  const username = await document.getElementById('username').value;
  const password = await document.getElementById('password').value;

  await formData.append('id', username);
  await formData.append('password', password);
  console.log('🚀 ~ login ~ formData:', formData.get('password'));

  await upload(formData);
}

async function upload(formData) {
  try {
    const response = await fetch('api/auth/login', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.error) {
      msg.innerText = result.error;
      return;
    } else msg.innerText = result.message;

    window.location.href = '/dashboard';
  } catch (error) {
    msg.innerText = error;
    console.error('Error:', error);
  }
}

loginBtn.addEventListener('click', () => {
  login();
});

const loginBtn = document.getElementById('login-btn');
const msg = document.getElementById('msg');
const errorMsg = localStorage.getItem('error');

if (errorMsg) {
  msg.style.color = 'red';
  msg.innerText = errorMsg;
  localStorage.clear();
}

function getCookie(name) {
  const value = document.cookie;
  const parts = value.split(';');
  if (parts.length > 1) {
    return parts.find((e) => {
      if (e.split('=')[0] === name) return e;
    });
  } else return parts[0].split('=')[1];
}

function setCookie(name, value, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

const role = getCookie('role');
if (role) window.location.href = '/dashboard';

async function login() {
  const formData = new FormData();

  // Perform login logic (you should implement server-side authentication)
  const username = await document.getElementById('username').value;
  const password = await document.getElementById('password').value;

  await formData.append('id', username);
  await formData.append('password', password);

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
    } else {
      msg.innerText = result.message;

      setCookie('role', result.data.role, 3);
      window.location.href = '/dashboard';
    }
  } catch (error) {
    msg.innerText = error;
    console.error('Error:', error);
  }
}

loginBtn.addEventListener('click', () => {
  login();
});

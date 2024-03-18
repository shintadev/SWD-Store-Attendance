const userBtn = document.getElementById('user-btn');
const storeBtn = document.getElementById('store-btn');
const logoutBtn = document.getElementById('logout-btn');

async function logout() {
  if (confirm('Log out now?')) {
    await fetch('api/auth/logout', {
      method: 'POST',
    });
    window.location.href = '/';
  }
}

async function refreshToken() {
  await fetch('api/auth/refresh-token', {
    method: 'POST',
  });
}

function getParams() {
  var idx = document.URL.indexOf('?');
  var params = {}; // simple js object
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

document.addEventListener('DOMContentLoaded', () => {
  const error = document.getElementById('error');
  if (error) {
    localStorage.setItem('error', error.innerText);
    if (error.innerText === 'Need Login First') window.location.href = '/login';
  }
  const role = getCookie('role');
  console.log('🚀 ~ document.addEventListener ~ role:', role);

  if (role == 'MANAGER') {
    userBtn.style.display = 'none';
    storeBtn.style.display = 'none';
  } else {
    userBtn.style.display = 'block';
    storeBtn.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => {
  logout();
});

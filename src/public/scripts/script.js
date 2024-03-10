function navigateTo(page) {
  // Implement navigation logic based on the selected page
  window.location.href = page;
}

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

document.addEventListener('DOMContentLoaded', () => {
  const error = document.getElementById('error');
  if (error) localStorage.setItem('error', error.innerText);
  if (error.innerText === 'Authentication failed') window.location.href = '/login';
});

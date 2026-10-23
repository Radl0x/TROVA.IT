(() => {
  const form = document.querySelector('#adminAuthForm');
  if (!form) return;
  const error = document.querySelector('#adminAuthError');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = (document.querySelector('#adminEmail')?.value || '').trim().toLowerCase();
    const password = document.querySelector('#adminPassword')?.value || '';
    error.hidden = true; error.textContent = '';
    if (email !== 'test@test.com' || password !== 'test') {
      error.textContent = 'Email o password non corrette.';
      error.hidden = false; return;
    }
    sessionStorage.setItem('trova_demo_role', 'admin');
    sessionStorage.setItem('trova_demo_email', email);
    location.href = 'admin-dashboard.html';
  });
})();

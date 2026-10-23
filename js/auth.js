/* Trova — autenticazione esclusivamente dimostrativa, senza backend. */
(() => {
  const form = document.querySelector('#authForm');
  const error = document.querySelector('#authError');
  const page = location.pathname.split('/').pop() || '';
  const isPro = page.includes('professionista');
  const isLogin = page.startsWith('login-');
  const dashboard = isPro ? 'pro-dashboard.html' : 'client-dashboard.html';
  const showError = (message) => { if (!error) return; error.textContent = message; error.hidden = false; };
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (error) { error.hidden = true; error.textContent = ''; }
    const email = (document.querySelector('#email')?.value || '').trim().toLowerCase();
    const password = document.querySelector('#password')?.value || '';
    if (!email || !password) return showError('Inserisci email e password per continuare.');
    if (isLogin) {
      if (email !== 'test@test.com' || password !== 'test') {
        return showError('Email o password non corrette.');
      }
      sessionStorage.setItem('trova_demo_role', isPro ? 'professionista' : 'cliente');
      sessionStorage.setItem('trova_demo_email', email);
      location.href = dashboard;
      return;
    }
    const name = (document.querySelector('#fullName')?.value || '').trim();
    const terms = document.querySelector('#terms');
    if (!name) return showError('Inserisci il nome o il nome della tua attività.');
    if (terms && !terms.checked) return showError('Per proseguire, conferma di aver letto le condizioni d’uso e l’informativa privacy.');
    if (window.Trova) window.Trova.toast('Registrazione non disponibile', 'La creazione dell’account sarà disponibile quando verrà attivato il servizio di registrazione.');
  });
  const google = document.querySelector('#googleButton');
  if (google) google.addEventListener('click', () => {
    if (window.Trova) window.Trova.toast('Google non collegato', 'Il pulsante è presente come anteprima. L’accesso Google reale richiede la configurazione del provider e del backend.');
  });
  const forgot = document.querySelector('#forgotPassword');
  if (forgot) forgot.addEventListener('click', () => {
    if (window.Trova) window.Trova.toast('Recupero password non disponibile', 'Il recupero tramite email non è ancora attivo.');
  });
})();

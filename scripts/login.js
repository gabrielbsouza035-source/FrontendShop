import { API_ROUTES } from './utils/api_routes.js';

/* ========================================
   ELEMENTOS
======================================== */

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const messageElement = document.getElementById('message');

/* LOGIN */

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

const loginButton = document.getElementById('loginButton');

/* REGISTER */

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');

const registerButton = document.getElementById('registerButton');

/* ========================================
   MENSAGENS
======================================== */

function showMessage(message, type = 'success') {

  messageElement.textContent = message;

  messageElement.className = `message ${type}`;
}

/* ========================================
   TABS
======================================== */

function activateLogin() {

  loginTab.classList.add('active');
  registerTab.classList.remove('active');

  loginForm.classList.add('active');
  registerForm.classList.remove('active');

  messageElement.textContent = '';
}

function activateRegister() {

  registerTab.classList.add('active');
  loginTab.classList.remove('active');

  registerForm.classList.add('active');
  loginForm.classList.remove('active');

  messageElement.textContent = '';
}

loginTab.addEventListener('click', activateLogin);

registerTab.addEventListener('click', activateRegister);

/* ========================================
   LOGIN
======================================== */

loginForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {

    showMessage(
      'Preencha todos os campos.',
      'error'
    );

    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = 'Entrando...';

  try {

    const response = await fetch(
      API_ROUTES.AUTH.LOGIN,
      {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {

      showMessage(
        data.detail || 'Erro ao realizar login.',
        'error'
      );

      return;
    }

    /*
      RESPOSTA ESPERADA:

      {
        access: '',
        refresh: '',
        user: {}
      }
    */

    if (data.access) {

      localStorage.setItem(
        'access_token',
        data.access
      );
    }

    if (data.refresh) {

      localStorage.setItem(
        'refresh_token',
        data.refresh
      );
    }

    if (data.user) {

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );
    }


    // REDIRECT FUTURO
    // window.location.href = '/dashboard.html';
    window.location.href = './home.html';

  } catch (error) {

    console.error(error);

    showMessage(
      'Erro de conexão com o servidor.',
      'error'
    );

  } finally {

    loginButton.disabled = false;
    loginButton.textContent = 'Entrar';

  }

});

/* ========================================
   REGISTER
======================================== */

registerForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const name = registerName.value.trim();

  const email = registerEmail.value.trim();

  const password = registerPassword.value.trim();

  if (!name || !email || !password) {

    showMessage(
      'Preencha todos os campos.',
      'error'
    );

    return;
  }

  registerButton.disabled = true;

  registerButton.textContent = 'Criando conta...';

  try {

    /*
      AJUSTE OS CAMPOS
      CONFORME SUA API DJANGO
    */

    const response = await fetch(
      API_ROUTES.AUTH.REGISTER,
      {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),

      }
    );

    const data = await response.json();

    if (!response.ok) {

      showMessage(
        data.detail || 'Erro ao registrar.',
        'error'
      );

      return;
    }

    showMessage(
      'Conta criada com sucesso!',
      'success'
    );

    console.log('REGISTER:', data);

    registerForm.reset();

    activateLogin();

  } catch (error) {

    console.error(error);

    showMessage(
      'Erro de conexão com o servidor.',
      'error'
    );

  } finally {

    registerButton.disabled = false;

    registerButton.textContent = 'Criar conta';

  }

});
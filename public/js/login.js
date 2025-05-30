document.addEventListener('DOMContentLoaded', () => {
    // Alternância de telas
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
  
    registerBtn.addEventListener('click', () => {
      container.classList.add('active');
    });
  
    loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  
    // Cadastro
    document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const nome = document.getElementById('cadastroNome').value;
      const email = document.getElementById('cadastroEmail').value;
      const senha = document.getElementById('cadastroSenha').value;
  
      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
  
      const resultado = await resposta.json();
  
      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        document.getElementById('cadastroForm').reset();
        container.classList.remove('active'); // Volta pro login
      } else {
        alert('Erro ao cadastrar: ' + resultado.erro);
      }
    });
  
    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('loginEmail').value;
      const senha = document.getElementById('loginSenha').value;
  
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
  
      const resultado = await resposta.json();
  
      if (resposta.ok) {
        alert('Login realizado!');
        window.location.href = 'dashboard.html';
      } else {
        alert('Erro no login: ' + resultado.erro);
      }
    });
  });
  
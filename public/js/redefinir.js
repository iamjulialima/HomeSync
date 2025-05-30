document.querySelector('button').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    const novaSenha = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (novaSenha !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
  
    const response = await fetch('/api/redefinir-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha }),
    });
  
    const result = await response.json();
    alert(result.mensagem || result.erro);
  
    if (response.ok) {
      window.location.href = 'login.html';
    }
  });
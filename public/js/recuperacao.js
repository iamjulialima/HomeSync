document.querySelector('button').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
  
    const response = await fetch('/api/recuperar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  
    const result = await response.json();
    alert(result.mensagem || result.erro);
  });
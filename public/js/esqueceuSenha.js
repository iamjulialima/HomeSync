document.getElementById('recuperarSenhaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('recuperarEmail').value;
  console.log("Enviando requisição com email:", email);

  try {
    const resposta = await fetch('/api/esqueceuSenha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert('E-mail enviado com sucesso!');
      document.getElementById('recuperarSenhaForm').reset();
    } else {
      alert('Erro ao enviar e-mail: ' + resultado.erro);
    }
  } catch (erro) {
    console.error("Erro ao enviar requisição:", erro);
    alert('Erro na requisição: verifique o console.');
  }
});

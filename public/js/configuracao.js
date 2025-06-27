const cod_usuario = localStorage.getItem('cod_usuario');

document.addEventListener('DOMContentLoaded', () => {
  console.log("ID do usuário carregado:", cod_usuario);

  if (!cod_usuario) {
    alert("Usuário não identificado. Faça login novamente.");
    return;
  }

  carregarDadosUsuario();

  const salvarDadosBtn = document.querySelector('.settings-section .btn-primary');
  const atualizarSenhaBtn = document.querySelectorAll('.settings-section .btn-primary')[1];

  salvarDadosBtn.addEventListener('click', async () => {
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!nome || !email) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`/api/atualizarDados/${cod_usuario}`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.mensagem);
        localStorage.setItem('nome_usuario', nome);
      } else {
        alert("Erro: " + data.erro);
      } 
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  });

  atualizarSenhaBtn.addEventListener('click', async () => {
    const senhaAtual = document.getElementById('current-password').value;
    const novaSenha = document.getElementById('new-password').value;
    const confirmarSenha = document.getElementById('confirm-password').value;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert("Preencha todos os campos de senha!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("A nova senha e a confirmação não coincidem!");
      return;
    }

    try {
      const response = await fetch(`/api/atualizarSenha/${cod_usuario}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senhaAtual, novaSenha })
});


      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';

        window.location.href = 'login.html';
      } else {
        alert("Erro: " + data.erro);
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  });
});

async function carregarDadosUsuario() {
  console.log("Buscando dados do usuário com ID:", cod_usuario);

  try {
    const response = await fetch(`/api/usuario/${cod_usuario}`);
    const usuario = await response.json();

    if (response.ok) {
      console.log("Dados recebidos:", usuario);
      document.getElementById('name').value = usuario.nome;
      document.getElementById('email').value = usuario.email;
    } else {
      console.error("Erro ao buscar dados:", usuario.erro);
    }
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Exibir o nome do usuário logado
  const nomeUsuario = localStorage.getItem('nome_usuario');
  if (nomeUsuario) {
    document.getElementById('nome-usuario').textContent = nomeUsuario;
  } else {
    document.getElementById('nome-usuario').textContent = "Usuário";
  }
});


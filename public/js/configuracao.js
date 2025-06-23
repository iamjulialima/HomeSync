document.addEventListener('DOMContentLoaded', () => {
    const salvarNomeBtn = document.querySelector('.settings-section:nth-of-type(1) .btn-primary');
    const atualizarSegurancaBtn = document.querySelector('.settings-section:nth-of-type(2) .btn-primary');
  
    // Atualizar nome
    salvarNomeBtn.addEventListener('click', () => {
      const nome = document.getElementById('name').value;
      const cod_usuario = localStorage.getItem('cod_usuario');
  
      fetch('http://localhost:3000/usuario/atualizar-nome', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod_usuario, nome })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem || 'Nome atualizado com sucesso');
      })
      .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao atualizar nome');
      });
    });
  
    // Atualizar email/senha
    atualizarSegurancaBtn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const senhaAtual = document.getElementById('current-password').value;
      const novaSenha = document.getElementById('new-password').value;
      const confirmarSenha = document.getElementById('confirm-password').value;
      const cod_usuario = localStorage.getItem('cod_usuario');
  
      if (novaSenha !== confirmarSenha) {
        return alert('As senhas não coincidem');
      }
  
      fetch('http://localhost:3000/usuario/atualizar-seguranca', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cod_usuario, email, senhaAtual, novaSenha })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem || 'Email e/ou senha atualizados com sucesso');
      })
      .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao atualizar segurança');
      });
    });
  });
  
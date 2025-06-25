document.addEventListener('DOMContentLoaded', () => {
// Atualiza status do portão
  const statusPortao = localStorage.getItem('status_portao') || "Desconhecido";

  const cardValor = document.querySelector('.card:nth-child(3) .card-value');
  const cardStatus = document.querySelector('.card:nth-child(3) .card-status');

  cardValor.textContent = statusPortao;

  if (statusPortao === "Aberto") {
    cardStatus.textContent = "Aberto";
    cardStatus.classList.remove('status-off');
    cardStatus.classList.add('status-on');
  } else if (statusPortao === "Fechado") {
    cardStatus.textContent = "Fechado";
    cardStatus.classList.remove('status-on');
    cardStatus.classList.add('status-off');
  } else {
    cardStatus.textContent = "Desconhecido";
  }
});

//btn logout
function handleLogout() {
  localStorage.removeItem('cod_usuario'); 
  window.location.href = 'index.html';    
}
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

  // Atualiza temperatura no carregamento
  atualizarTemperaturaDashboard();
});

// Função para buscar o último valor de temperatura
// Função para buscar o último valor de temperatura e umidade
async function atualizarTemperaturaDashboard() {
  try {
    const response = await fetch('/api/temperatura/ultimas?horas=2');
    if (!response.ok) {
      throw new Error('Erro ao buscar temperatura: ' + response.statusText);
    }

    const dados = await response.json();
    if (dados.length === 0) return;

    const ultimo = dados[dados.length - 1];
    
    // Atualiza Temperatura
    const tempElement = document.getElementById('temperatura-dashboard');
    if (tempElement) {
      tempElement.textContent = `${ultimo.temperatura}°C`;
    }

    // Atualiza Status da Umidade
    const statusUmidade = document.getElementById('status-umidade');
    if (statusUmidade) {
      const umidade = ultimo.umidade;

      if (umidade >= 40 && umidade <= 60) {
        statusUmidade.textContent = "Umidade boa";
        statusUmidade.classList.remove('status-off');
        statusUmidade.classList.add('status-on');
      } else if (umidade < 40) {
        statusUmidade.textContent = "Umidade baixa";
        statusUmidade.classList.remove('status-on');
        statusUmidade.classList.add('status-off');
      } else if (umidade > 60) {
        statusUmidade.textContent = "Umidade alta";
        statusUmidade.classList.remove('status-off');
        statusUmidade.classList.add('status-on');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Atualiza o status do Gás no Dashboard
async function atualizarGasDashboard() {
  try {
    const response = await fetch('/api/gas/historico');
    if (!response.ok) {
      throw new Error('Erro ao buscar status do gás: ' + response.statusText);
    }

    const dados = await response.json();
    if (!Array.isArray(dados) || dados.length === 0) return;

    const statusAtual = dados[0].status; // Considera o mais recente
    const gasElement = document.getElementById('status-gas-dashboard');
    const statusIndicador = document.getElementById('status-gas-indicador');

    if (statusAtual === 'vazamento') {
      gasElement.textContent = 'Sim';
      statusIndicador.textContent = 'Vazamento';
      statusIndicador.classList.remove('status-on');
      statusIndicador.classList.add('status-off');
    } else {
      gasElement.textContent = 'Não';
      statusIndicador.textContent = 'Seguro';
      statusIndicador.classList.remove('status-off');
      statusIndicador.classList.add('status-on');
    }

  } catch (error) {
    console.error('Erro ao atualizar status do gás:', error);
  }
}

// No final do window.onload:
window.onload = () => {
  atualizarTemperaturaDashboard();
  atualizarGasDashboard();
};

// Atualiza a temperatura e o status do gás a cada 5 segundos
setInterval(() => {
  atualizarTemperaturaDashboard();
  atualizarGasDashboard();
}, 5000);


// btn logout
function handleLogout() {
  localStorage.removeItem('cod_usuario'); 
  window.location.href = 'index.html';    
}
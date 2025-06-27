apiBase = "http://localhost:3000/api";
const cod_usuario = localStorage.getItem('cod_usuario');

document.addEventListener('DOMContentLoaded', async () => {
  const aviso = document.getElementById('aviso-dashboard');
  const cardTemp = document.getElementById('card-temp');
  const cardLuzes = document.getElementById('card-luzes');
  const cardPortao = document.getElementById('card-portao');
  const cardGas = document.getElementById('card-gas');

  try {
    const response = await fetch(`${apiBase}/dispositivos?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    let algumVisivel = false;

    if (data.possuiPortao) {
      cardPortao.classList.remove('hidden');
      algumVisivel = true;
    } else {
      cardPortao.classList.add('hidden');
    }

    if (data.possuiSensor) {
      cardTemp.classList.remove('hidden');
      algumVisivel = true;
    } else {
      cardTemp.classList.add('hidden');
    }

    if (data.existe) {
      cardGas.classList.remove('hidden');
      algumVisivel = true;
    } else {
      cardGas.classList.add('hidden');
    }

    if (data.existeLuzes) {
      cardLuzes.classList.remove('hidden');
      algumVisivel = true;
    } else {
      cardLuzes.classList.add('hidden');
    }

    if (algumVisivel) {
      aviso.classList.add('hidden');
    } else {
      aviso.classList.remove('hidden');
    }

    // Atualiza os valores iniciais dos cards
    atualizarTemperaturaDashboard();
    atualizarGasDashboard();
    atualizarLuzesDashboard();
    atualizarPortaoDashboard();

  } catch (err) {
    console.error('Erro ao verificar os dispositivos:', err);
  }
});

function atualizarPortaoDashboard() {
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
    cardStatus.classList.remove('status-on', 'status-off');
  }
}

// Atualiza Temperatura e Umidade
async function atualizarTemperaturaDashboard() {
  try {
    const response = await fetch(`/api/temperatura/ultimas?horas=2&cod_usuario=${cod_usuario}`);
    if (!response.ok) throw new Error('Erro ao buscar temperatura: ' + response.statusText);

    const dados = await response.json();
    if (dados.length === 0) return;

    const ultimo = dados[dados.length - 1];

    const tempElement = document.getElementById('temperatura-dashboard');
    if (tempElement) tempElement.textContent = `${ultimo.temperatura}°C`;

    const statusUmidade = document.getElementById('status-umidade');
    if (statusUmidade) {
      const umidade = ultimo.umidade;
      if (umidade >= 40 && umidade <= 60) {
        statusUmidade.textContent = "Umidade boa";
        statusUmidade.classList.add('status-on');
        statusUmidade.classList.remove('status-off');
      } else if (umidade < 40) {
        statusUmidade.textContent = "Umidade baixa";
        statusUmidade.classList.add('status-off');
        statusUmidade.classList.remove('status-on');
      } else {
        statusUmidade.textContent = "Umidade alta";
        statusUmidade.classList.add('status-on');
        statusUmidade.classList.remove('status-off');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Atualiza Status das Luzes
async function atualizarLuzesDashboard() {
  try {
    const response = await fetch(`/api/luzes/${cod_usuario}`);
    if (!response.ok) throw new Error('Erro ao buscar luzes: ' + response.statusText);

    const dados = await response.json();
    if (!Array.isArray(dados) || dados.length === 0) return;

    const luzesAtivas = dados.filter(luz => luz.estado === 'ligado').length;
    const totalLuzes = dados.length;

    const luzesContainer = document.getElementById('luzes-dashboard');
    if (luzesContainer) luzesContainer.textContent = `${luzesAtivas}/${totalLuzes}`;

  } catch (error) {
    console.error('Erro ao atualizar luzes no dashboard:', error);
  }
}

// Atualiza Status do Gás
async function atualizarGasDashboard() {
  try {
    const response = await fetch(`/api/gas/historico?cod_usuario=${cod_usuario}`);
    if (!response.ok) throw new Error('Erro ao buscar status do gás: ' + response.statusText);

    const dados = await response.json();
    if (!Array.isArray(dados) || dados.length === 0) return;

    const statusAtual = dados[0].status;

    const gasElement = document.getElementById('status-gas-dashboard');
    const statusIndicador = document.getElementById('status-gas-indicador');

    if (statusAtual === 'vazamento') {
      gasElement.textContent = 'Sim';
      statusIndicador.textContent = 'Vazamento';
      statusIndicador.classList.add('status-off');
      statusIndicador.classList.remove('status-on');
    } else {
      gasElement.textContent = 'Não';
      statusIndicador.textContent = 'Seguro';
      statusIndicador.classList.add('status-on');
      statusIndicador.classList.remove('status-off');
    }

  } catch (error) {
    console.error('Erro ao atualizar status do gás:', error);
  }
}

// Atualizações periódicas
setInterval(() => {
  atualizarTemperaturaDashboard();
  atualizarGasDashboard();
  atualizarLuzesDashboard();
  atualizarPortaoDashboard();
}, 5000);

// Logout
function handleLogout() {
  localStorage.removeItem('cod_usuario');
  window.location.href = 'index.html';
}

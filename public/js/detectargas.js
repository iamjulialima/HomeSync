const BASE_API_URL = 'http://192.168.5.10:3000/api/gas';
const cod_usuario = localStorage.getItem('cod_usuario');

let ultimoHistoricoJSON = '';

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR');
}

// Carrega e atualiza histórico do gás
async function carregarDadosGas() {
  try {
    const response = await fetch(`${BASE_API_URL}/historico?cod_usuario=${cod_usuario}`);
    const dados = await response.json();

    if (!Array.isArray(dados)) return;

    const statusAtual = dados.length > 0 ? dados[0].status : 'seguro';
    const statusCard = document.querySelector('.grid .bg-white h3');
    const statusIconDiv = document.querySelector('.grid .bg-white div.h-12');

    if (statusAtual === 'vazamento') {
      statusCard.textContent = 'Vazamento detectado!';
      statusCard.classList.remove('text-green-600');
      statusCard.classList.add('text-red-600');
      statusIconDiv.classList.remove('bg-green-100');
      statusIconDiv.classList.add('bg-red-100');
      statusIconDiv.querySelector('i').classList.remove('fa-check-circle');
      statusIconDiv.querySelector('i').classList.add('fa-exclamation-triangle', 'text-red-600');
    } else {
      statusCard.textContent = 'Seguro';
      statusCard.classList.remove('text-red-600');
      statusCard.classList.add('text-green-600');
      statusIconDiv.classList.remove('bg-red-100');
      statusIconDiv.classList.add('bg-green-100');
      statusIconDiv.querySelector('i').classList.remove('fa-exclamation-triangle', 'text-red-600');
      statusIconDiv.querySelector('i').classList.add('fa-check-circle');
    }

    const historicoFiltrado = dados.filter(l => l.status === 'vazamento');
    const historicoAtualJSON = JSON.stringify(historicoFiltrado);

    if (historicoAtualJSON === ultimoHistoricoJSON) return;

    ultimoHistoricoJSON = historicoAtualJSON;

    const containerHistorico = document.querySelector('.divide-y');
    containerHistorico.innerHTML = '';

    historicoFiltrado.forEach(leitura => {
      const card = document.createElement('div');
      card.className = 'p-5 hover:bg-gray-50 transition-colors';
      card.innerHTML = `
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-1">
            <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
          </div>
          <div class="ml-4 flex-grow">
            <div class="flex justify-between">
              <h4 class="font-bold text-gray-900">Vazamento Detectado</h4>
              <span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">ALERTA</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">Nível do sensor: ${leitura.valor}</p>
            <div class="flex justify-between items-center mt-2">
              <div class="flex items-center text-xs text-gray-500">
                <i class="far fa-clock mr-1"></i>
                <span>${formatarData(leitura.dataHora)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      containerHistorico.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar dados do gás:', error);
  }
}

// Verifica se existe sensor cadastrado
async function verificarSensorGas() {
  try {
    const response = await fetch(`${BASE_API_URL}/existe-sensor?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    const avisoCadastro = document.getElementById('aviso-cadastro');
    const mainContent = document.querySelector('main');

    if (!data.existe) {
      avisoCadastro.classList.remove('hidden');
      mainContent.style.display = 'none';
    } else {
      avisoCadastro.classList.add('hidden');
      mainContent.style.display = 'block';
      carregarDadosGas();
    }
  } catch (error) {
    console.error('Erro ao verificar sensor de gás:', error);
  }
}

// Abrir e fechar modal
const addGasBtn = document.getElementById('add-gas');
const gasModal = document.getElementById('gas-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');

function abrirModal() {
  gasModal.classList.remove('hidden');
}

function fecharModal() {
  gasModal.classList.add('hidden');
}

if (addGasBtn) {
  addGasBtn.addEventListener('click', abrirModal);
}

closeModalBtns.forEach(btn => {
  btn.addEventListener('click', fecharModal);
});

gasModal.addEventListener('click', (e) => {
  if (e.target === gasModal) fecharModal();
});

// Evento para salvar novo sensor via modal
document.getElementById('gas-temp').addEventListener('click', async () => {
  const codigo = document.getElementById('gas-cod').value.trim();
  const descricao = document.getElementById('gas-descricao').value.trim();

  if (!codigo) {
    alert('Informe o código do sensor');
    return;
  }

  try {
    const response = await fetch(`${BASE_API_URL}/sensor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, descricao, cod_usuario })
    });

    if (!response.ok) throw new Error('Erro ao cadastrar sensor');

    alert('Sensor cadastrado com sucesso!');

    fecharModal();
    document.getElementById('gas-cod').value = '';
    document.getElementById('gas-descricao').value = '';
    verificarSensorGas();

  } catch (error) {
    alert('Erro ao cadastrar sensor: ' + error.message);
  }
});

function handleLogout() {
  localStorage.removeItem('cod_usuario');
  window.location.href = 'index.html';
}

// Início
verificarSensorGas();
setInterval(verificarSensorGas, 5000);

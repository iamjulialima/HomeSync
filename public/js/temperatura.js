let ultimoRegistroId = null;  // Controla o último dado recebido

const cod_usuario = localStorage.getItem('cod_usuario');

// Verifica se o usuário tem sensor de temperatura vinculado
async function verificarSensor() {
  try {
    const response = await fetch(`/api/temperatura/sensor?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    const aviso = document.getElementById('aviso-cadastro');
    const conteudo = document.getElementById('conteudo-temperatura');

    if (data.possuiSensor) {
      aviso.classList.add('hidden');
      conteudo.classList.remove('hidden');
      montarGrafico(data.sensor.cod_sensor);  // Já passa o código do sensor pro gráfico
    } else {
      aviso.classList.remove('hidden');
      conteudo.classList.add('hidden');
    }
  } catch (error) {
    console.error('Erro ao verificar sensor:', error);
  }
}

// Busca os dados da API
async function buscarDados() {
  try {
    const response = await fetch(`/api/temperatura/ultimas?horas=2&cod_usuario=${cod_usuario}`);
    if (!response.ok) throw new Error('Erro ao buscar dados.');
    const dados = await response.json();
    return dados;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Formata a hora para exibir no gráfico
function formatarData(dataStr) {
  const data = new Date(dataStr);
  data.setHours(data.getHours() - 3); // Ajuste UTC-3
  return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Monta o gráfico e atualiza a tabela
async function montarGrafico(cod_sensor) {
  console.log('montarGrafico chamado com cod_sensor:', cod_sensor);
  const dados = await buscarDados();
 console.log('Dados recebidos:', dados);

  if (dados.length === 0) {
    console.log('Nenhum dado para mostrar');
    return;
  }


  const ultimo = dados[dados.length - 1];
  if (ultimoRegistroId === ultimo.data_hora) return;
  ultimoRegistroId = ultimo.data_hora;

  const tbody = document.getElementById('schedules-list');
  tbody.innerHTML = '';

  const dadosLimitados = dados.slice(-10).reverse();

  dadosLimitados.forEach((item) => {
    const tr = document.createElement('tr');

    const tdTemp = document.createElement('td');
    tdTemp.textContent = `${item.temperatura}ºC`;
    tdTemp.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

    const tdUmi = document.createElement('td');
    tdUmi.textContent = `${item.umidade}%`;
    tdUmi.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

    const tdData = document.createElement('td');
    const data = new Date(item.data_hora);
    data.setHours(data.getHours() - 3);
    tdData.textContent = data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    tdData.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

    tr.appendChild(tdTemp);
    tr.appendChild(tdUmi);
    tr.appendChild(tdData);
    tbody.appendChild(tr);
  });

  document.getElementById('temp-value').textContent = `${ultimo.temperatura}ºC`;

  const ctx = document.getElementById('temperature-chart').getContext('2d');
  if (window.graficoTemperatura) window.graficoTemperatura.destroy();

  window.graficoTemperatura = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map((item) => formatarData(item.data_hora)),
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: dados.map((item) => item.temperatura),
          borderColor: 'red',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 1,
          yAxisID: 'y1',
        },
        {
          label: 'Umidade (%)',
          data: dados.map((item) => item.umidade),
          borderColor: 'blue',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 1,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
      },
      scales: {
        x: { title: { display: true, text: 'Hora' } },
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Temperatura (°C)' },
          min: 0,
          max: 50,
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Umidade (%)' },
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
        },
      },
    },
  });
}

// Atualização automática
let cod_sensorGlobal = null;
setInterval(() => {
  if (cod_sensorGlobal) montarGrafico(cod_sensorGlobal);
}, 5000);

// Logout
function handleLogout() {
  localStorage.removeItem('cod_usuario');
  window.location.href = 'index.html';
}

// Redireciona para cadastro de sensor
function irParaCadastro() {
  window.location.href = 'dashboard.html';
}

// Inicialização
window.onload = async () => {
  try {
    const response = await fetch(`/api/temperatura/sensor?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    const aviso = document.getElementById('aviso-cadastro');
    const conteudo = document.getElementById('conteudo-temperatura');

    if (data.possuiSensor) {
      aviso.classList.add('hidden');
      conteudo.classList.remove('hidden');
      cod_sensorGlobal = data.sensor.cod_sensor;
      montarGrafico(cod_sensorGlobal);
    } else {
      aviso.classList.remove('hidden');
      conteudo.classList.add('hidden');
    }
  } catch (error) {
    console.error('Erro ao verificar sensor:', error);
  }
};

// Abre o modal
function abrirModalTemperatura() {
  document.getElementById('temp-modal').classList.add('show');
  document.body.classList.add('overflow-hidden');
}

// Fecha o modal
function fecharModalTemperatura() {
  document.getElementById('temp-modal').classList.remove('show');
  document.body.classList.remove('overflow-hidden');
}

// Abre o modal ao clicar no card de adicionar
document.getElementById('add-temp').addEventListener('click', abrirModalTemperatura);

// Eventos dos botões de fechar
document.querySelectorAll('#temp-modal .close-modal').forEach((btn) => {
  btn.addEventListener('click', fecharModalTemperatura);
});

// Botão de salvar o sensor
document.getElementById('save-temp').addEventListener('click', async () => {
  const cod = document.getElementById('temp-cod').value.trim();
  const descricao = document.getElementById('temp-descricao').value.trim();
  const cod_usuario = localStorage.getItem('cod_usuario');

  if (!cod || !descricao) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch('/api/temperatura/sensor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: cod, descricao, cod_usuario })
    });

    if (!response.ok) throw new Error('Erro ao salvar o sensor.');

    alert('Sensor cadastrado com sucesso!');
    fecharModalTemperatura();
    location.reload();
  } catch (error) {
    console.error(error);
    alert('Erro ao cadastrar o sensor.');
  }
});

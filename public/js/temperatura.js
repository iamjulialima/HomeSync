let ultimoRegistroId = null;
const cod_usuario = localStorage.getItem('cod_usuario');
let cod_sensorGlobal = null;

async function verificarSensor() {
  try {
    const response = await fetch(`/api/temperatura/sensor?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    const aviso = document.getElementById('aviso-cadastro');
    const conteudo = document.getElementById('conteudo-temperatura');
    const localizacaoSpan = document.getElementById('localizacao');

    if (data.possuiSensor) {
      aviso.classList.add('hidden');
      conteudo.classList.remove('hidden');
      cod_sensorGlobal = data.sensor.cod_sensor;
      montarGrafico(cod_sensorGlobal);

      if (data.sensor.descricao) {
        localizacaoSpan.textContent = data.sensor.descricao;
      }
    } else {
      aviso.classList.remove('hidden');
      conteudo.classList.add('hidden');
    }
  } catch (error) {
    console.error('Erro ao verificar sensor:', error);
  }
}

async function buscarDados() {
  try {
    const response = await fetch(`/api/temperatura/ultimas?horas=2&cod_usuario=${cod_usuario}`);
    if (!response.ok) throw new Error('Erro ao buscar dados.');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function formatarData(dataStr) {
  const data = new Date(dataStr);
  data.setHours(data.getHours() - 3);
  return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function montarGrafico(cod_sensor) {
  const dados = await buscarDados();
  if (dados.length === 0) return;

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
    tdData.textContent = data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    tdData.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

    tr.append(tdTemp, tdUmi, tdData);
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
      plugins: { legend: { display: true, position: 'top' } },
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

setInterval(() => {
  if (cod_sensorGlobal) montarGrafico(cod_sensorGlobal);
}, 5000);

function handleLogout() {
  localStorage.removeItem('cod_usuario');
  window.location.href = 'index.html';
}

function irParaCadastro() {
  window.location.href = 'dashboard.html';
}

window.onload = () => verificarSensor();

function abrirModalTemperatura() {
  document.getElementById('temp-modal').classList.add('show');
  document.body.classList.add('overflow-hidden');
}

function fecharModalTemperatura() {
  document.getElementById('temp-modal').classList.remove('show');
  document.body.classList.remove('overflow-hidden');
}

document.getElementById('add-temp').addEventListener('click', abrirModalTemperatura);

document.querySelectorAll('#temp-modal .close-modal').forEach((btn) =>
  btn.addEventListener('click', fecharModalTemperatura)
);

document.getElementById('save-temp').addEventListener('click', async () => {
  const cod = document.getElementById('temp-cod').value.trim();
  const descricao = document.getElementById('temp-descricao').value.trim();

  if (!cod || !descricao) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch('/api/temperatura/sensor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: cod, descricao, cod_usuario }),
    });

    if (!response.ok) throw new Error('Erro ao salvar o sensor.');

    alert('Sensor cadastrado com sucesso!');
    fecharModalTemperatura();

    const aviso = document.getElementById('aviso-cadastro');
    const conteudo = document.getElementById('conteudo-temperatura');
    const localizacaoSpan = document.getElementById('localizacao');

    aviso.classList.add('hidden');
    conteudo.classList.remove('hidden');
    localizacaoSpan.textContent = descricao;

    cod_sensorGlobal = cod;
    montarGrafico(cod_sensorGlobal);
  } catch (error) {
    console.error(error);
    alert('Erro ao cadastrar o sensor.');
  }
});

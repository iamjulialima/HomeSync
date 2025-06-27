// Pega o cod_usuario do localStorage
const cod_usuario = localStorage.getItem('cod_usuario');

const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const gateIcon = document.getElementById('gate-icon');
const gateStatus = document.getElementById('gate-status');
const gateVisual = document.getElementById('gate-visual');

let isGateOpen = false;

document.addEventListener('DOMContentLoaded', async () => {
  const aviso = document.getElementById('aviso-cadastro');
  const conteudo = document.querySelector('main');

  try {
    const response = await fetch(`/api/portao/sensor?cod_usuario=${cod_usuario}`);
    const data = await response.json();

    if (data.possuiPortao) {
      aviso.classList.add('hidden');
      conteudo.classList.remove('hidden');
      carregarHistorico();
    } else {
      aviso.classList.remove('hidden');
      conteudo.classList.add('hidden');
    }
  } catch (err) {
    console.error('Erro ao verificar portão:', err);
  }

  // Recupera o status salvo no localStorage e atualiza visual
  const statusSalvo = localStorage.getItem('status_portao');
  if (statusSalvo === 'Aberto') {
    abrirPortaoVisual();
    isGateOpen = true;
  } else {
    fecharPortaoVisual();
    isGateOpen = false;
  }
});

document.getElementById('add-portao').addEventListener('click', () => {
  document.getElementById('portao-modal').classList.add('show');
  document.body.classList.add('overflow-hidden');
});

document.querySelectorAll('#portao-modal .close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('portao-modal').classList.remove('show');
    document.body.classList.remove('overflow-hidden');
  });
});

document.getElementById('save-portao').addEventListener('click', async () => {
  const cod = document.getElementById('portao-cod').value.trim();
  const descricao = document.getElementById('portao-descricao').value.trim();

  if (!cod || !descricao) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch(`/api/portao/sensor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: cod, descricao, cod_usuario })
    });

    if (!response.ok) throw new Error('Erro ao cadastrar portão');

    alert('Portão cadastrado com sucesso!');
    location.reload();
  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar portão.');
  }
});

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('-translate-x-full');
}

function ajustarFusoHorario(dataHoraUTC) {
  const data = new Date(dataHoraUTC);
  data.setHours(data.getHours() - 3); // Ajusta -3h
  return data.toLocaleString('pt-BR'); // Exibe no formato brasileiro
}

// Atualiza visual para portão aberto
function abrirPortaoVisual() {
  gateIcon.classList.remove('fa-lock', 'text-red-500');
  gateIcon.classList.add('fa-lock-open', 'text-green-500');
  gateStatus.textContent = 'Aberto';
  gateVisual.classList.add('animate-pulse');

  setTimeout(() => {
    gateVisual.classList.remove('animate-pulse');
  }, 2000);
}

// Atualiza visual para portão fechado
function fecharPortaoVisual() {
  gateIcon.classList.remove('fa-lock-open', 'text-green-500');
  gateIcon.classList.add('fa-lock', 'text-red-500');
  gateStatus.textContent = 'Fechado';
  gateVisual.classList.add('animate-pulse');

  setTimeout(() => {
    gateVisual.classList.remove('animate-pulse');
  }, 2000);
}

openBtn.addEventListener('click', async () => {
  isGateOpen = true;
  abrirPortaoVisual();

  await fetch(`/api/portao/abrir`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cod_usuario })
  });

  alert("Comando para abrir enviado!");
  carregarHistorico();

  localStorage.setItem('status_portao', 'Aberto');
});

closeBtn.addEventListener('click', async () => {
  isGateOpen = false;
  fecharPortaoVisual();

  await fetch(`/api/portao/fechar`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cod_usuario })
  });

  alert("Comando para fechar enviado!");
  carregarHistorico();

  localStorage.setItem('status_portao', 'Fechado');
});

async function carregarHistorico() {
  try {
    const response = await fetch(`/api/portao/historico?cod_usuario=${cod_usuario}`);
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Erro ao carregar histórico');
      return;
    }
    const dados = await response.json();

    const tabela = document.getElementById('schedules-list');
    tabela.innerHTML = ''; // Limpa a tabela antes

    dados.forEach(item => {
      const tr = document.createElement('tr');

      const tdUsuario = document.createElement('td');
      tdUsuario.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900');
      tdUsuario.textContent = item.usuario;

      const tdDataHora = document.createElement('td');
      tdDataHora.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
      tdDataHora.textContent = ajustarFusoHorario(item.dataHora);

      const tdAcao = document.createElement('td');
      tdAcao.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
      tdAcao.textContent = item.comando;

      tr.appendChild(tdUsuario);
      tr.appendChild(tdDataHora);
      tr.appendChild(tdAcao);

      tabela.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }
}

//btn logout
function handleLogout() {
  localStorage.removeItem('cod_usuario');
  window.location.href = 'login.html';
}
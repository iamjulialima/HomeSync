// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

const apiBase = "http://localhost:3000/api/portao";

// Gate control functionality
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const gateIcon = document.getElementById('gate-icon');
const gateStatus = document.getElementById('gate-status');
const gateVisual = document.getElementById('gate-visual');

let isGateOpen = false;

// Pegando o cod_usuario do localStorage (ou sessionStorage se você usou ele)
const cod_usuario = localStorage.getItem('cod_usuario');


openBtn.addEventListener('click', async () => {
    isGateOpen = true;
    gateIcon.classList.remove('fa-lock', 'text-red-500');
    gateIcon.classList.add('fa-lock-open', 'text-green-500');
    gateStatus.textContent = 'Aberto';
    gateVisual.classList.add('animate-pulse');

    // Envia o cod_usuario junto
    await fetch(`${apiBase}/abrir`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cod_usuario })


    });

    alert("Comando para abrir enviado!");
    carregarHistorico();

    setTimeout(() => {
        gateVisual.classList.remove('animate-pulse');
    }, 2000);
});

closeBtn.addEventListener('click', async () => {
    isGateOpen = false;
    gateIcon.classList.remove('fa-lock-open', 'text-green-500');
    gateIcon.classList.add('fa-lock', 'text-red-500');
    gateStatus.textContent = 'Fechado';
    gateVisual.classList.add('animate-pulse');

    // Envia o cod_usuario junto
    await fetch(`${apiBase}/fechar`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cod_usuario })
    });

    alert("Comando para fechar enviado!");
    carregarHistorico();
    
    setTimeout(() => {
        gateVisual.classList.remove('animate-pulse');
    }, 2000);
});

async function carregarHistorico() {
  try {
    const response = await fetch(`${apiBase}/historico`);
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
      tdDataHora.textContent = new Date(item.dataHora).toLocaleString('pt-BR');

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

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarHistorico);

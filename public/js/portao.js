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

openBtn.addEventListener('click', async () => {
    isGateOpen = true;
    gateIcon.classList.remove('fa-lock', 'text-red-500');
    gateIcon.classList.add('fa-lock-open', 'text-green-500');
    gateStatus.textContent = 'Aberto';
    gateVisual.classList.add('animate-pulse');

    await fetch(`${apiBase}/abrir`, { method: "POST" });
    alert("Comando para abrir enviado!");

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

    await fetch(`${apiBase}/fechar`, { method: "POST" });
    alert("Comando para fechar enviado!");

    setTimeout(() => {
        gateVisual.classList.remove('animate-pulse');
    }, 2000);
});
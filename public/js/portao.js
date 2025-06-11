// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

// Gate control functionality
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const gateIcon = document.getElementById('gate-icon');
const gateStatus = document.getElementById('gate-status');
const gateVisual = document.getElementById('gate-visual');

let isGateOpen = false;

openBtn.addEventListener('click', () => {
isGateOpen = true;
gateIcon.classList.remove('fa-lock', 'text-red-500');
gateIcon.classList.add('fa-lock-open', 'text-green-500');
gateStatus.textContent = 'Aberto';
gateVisual.classList.add('animate-pulse');
            

                
// Remove pulse animation after 2 seconds
    setTimeout(() => {
        gateVisual.classList.remove('animate-pulse');
            }, 2000);
        }, 500);
    

closeBtn.addEventListener('click', () => {
    isGateOpen = false;
    gateIcon.classList.remove('fa-lock-open', 'text-green-500');
    gateIcon.classList.add('fa-lock', 'text-red-500');
    gateStatus.textContent = 'Fechado';
    gateVisual.classList.add('animate-pulse');
            
// Create a log entry for the demo
    setTimeout(() => { 
        // Remove pulse animation after 2 seconds
        setTimeout(() => {
            gateVisual.classList.remove('animate-pulse');
            }, 2000);
        }, 500);
    });
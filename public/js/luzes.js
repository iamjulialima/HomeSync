        // Funcionalidade de trocar de tabs 
        const tabButtons = document.querySelectorAll('.tab-btn'); // seleciona os botoes da tab
        const tabContents = document.querySelectorAll('.tab-content'); // seleciona todo conteudo da aba

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove a classe 'active' de todos os botões e conteúdos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adiciona a classe 'active' ao botão e conteúdo clicado
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        //função para destaque de abas
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.replace('border-blue-500', 'border-transparent'));
            tab.classList.replace('border-transparent', 'border-blue-500');
            });
        });

// -------------------------------------------------------------------------------------------------------------

        // função de cards dinamico

        document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("cards-container");
    const addCard = document.getElementById("add-light");

    const cod_usuario = localStorage.getItem('cod_usuario'); 

    if (!cod_usuario) {
        alert('Usuário não autenticado!');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`/api/luzes/${cod_usuario}`);
        const luzes = await res.json();

        luzes.forEach((luz) => {
            const isOn = luz.estado === 'ligado';
            const intensidadeAtual = luz.intensidade.toLowerCase();
            const cor = isOn ? 'yellow' : 'gray';
            const iconeCor = isOn ? 'text-yellow-400' : 'text-gray-400';

            const cardHTML = `
                <div class="light-card bg-white rounded-xl shadow-md p-6" data-id="${luz.cod_luz}">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-lg text-gray-800">${luz.nome}</h3>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" ${isOn ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div class="flex justify-center mb-6">
                        <div class="w-24 h-24 rounded-full bg-${cor}-100 flex items-center justify-center shadow-inner" id="light-bulb-${luz.cod_luz}">
                            <i class="fas fa-lightbulb ${iconeCor} text-4xl"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button class="edit-light px-3 py-1 text-blue-600 text-sm font-medium">
                            <i class="fas fa-edit mr-1"></i> Editar
                        </button>
                        <button class="delete-light px-3 py-1 text-red-600 text-sm font-medium"> 
                            <i class="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer"></i> Remover
                        </button>
                    </div>
                </div>
            `;

            addCard.insertAdjacentHTML("beforebegin", cardHTML);
        });

        inicializarEventosDosCards();

    } catch (err) {
        console.error("Erro ao carregar luzes:", err);
        container.innerHTML = `<p class="text-red-500">Erro ao carregar luzes</p>`;
    }
});



        //inicializar cards antes de checar eventos
        function inicializarEventosDosCards() {
        document.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', async () => {
            const card = toggle.closest('.light-card');
            const cod_luz = card.dataset.id;
            const cod_usuario = localStorage.getItem('cod_usuario');
            const estado = toggle.checked ? 'ligado' : 'desligado';
            const intensidade = getIntensidadeAtual(card);

            console.log("ID da luz sendo atualizado:", cod_luz); 

            atualizarVisualLampada(card, estado, intensidade);

            await fetch(`/api/luzes/${cod_luz}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado, intensidade, cod_usuario})
            });
            });
        });
        

        // Botão deletar luz
        document.querySelectorAll('.delete-light').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const card = e.target.closest('.light-card');
                const cod_luz = card.dataset.id;

                if (confirm('Tem certeza que deseja remover esta luz?')) {
                    try {
                        const resposta = await fetch(`/api/luzes/${cod_luz}`, {
                            method: 'DELETE'
                        });

                        if (resposta.ok) {
                            card.remove(); // remove visualmente o card
                        } else {
                            alert('Erro ao remover luz.');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Erro de conexão com o servidor.');
                    }
                }
            });
        });


        document.querySelectorAll('.intensity-preset').forEach(button => {
            button.addEventListener('click', async (e) => {
            const card = button.closest('.light-card');
            const cod_luz = card.dataset.id;

            // Visual
            card.querySelectorAll('.intensity-preset').forEach(btn => {
                btn.classList.remove('bg-blue-100', 'text-blue-700');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            button.classList.add('bg-blue-100', 'text-blue-700');
            button.classList.remove('bg-gray-100', 'text-gray-700');

            const intensidade = button.textContent.trim().toLowerCase();
            const estado = card.querySelector('input[type="checkbox"]').checked ? 'ligado' : 'desligado';

            console.log("ID da luz sendo atualizado:", cod_luz); 

            atualizarVisualLampada(card, estado, intensidade);

            await fetch(`/api/luzes/${cod_luz}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado, intensidade })
            });
            });
        });
        }



        //aqui se mexe com o ligar e desligar 

        // Luzes toggle alternar entre ligado/ desligado
        document.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', async () => {
            const card = toggle.closest('.light-card');
            const cod_luz = card.dataset.id;
            console.log("ID da luz sendo atualizado:", cod_luz);

            const estado = toggle.checked ? 'ligado' : 'desligado';
            const intensidade = getIntensidadeAtual(card);

            atualizarVisualLampada(card, estado, intensidade);


            await fetch(`/api/luzes/${cod_luz}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado, intensidade })
            });
        });
        });


        // Intensity botões que alteram a cor da lampada
        document.querySelectorAll('.intensity-preset').forEach(button => {
        button.addEventListener('click', async (e) => {
            const card = button.closest('.light-card');
            const cod_luz = card.dataset.id;

            // Troca visual do botão
            card.querySelectorAll('.intensity-preset').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-700');
            btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            button.classList.add('bg-blue-100', 'text-blue-700');
            button.classList.remove('bg-gray-100', 'text-gray-700');

            const intensidade = button.textContent.trim().toLowerCase();
            const estado = card.querySelector('input[type="checkbox"]').checked ? 'ligado' : 'desligado';

            atualizarVisualLampada(card, estado, intensidade);

            await fetch(`/api/luzes/${cod_luz}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado, intensidade })
            });
        });
        });


        //funçoes auxiliares de intensidade e ligar/ desligar luz 
        function getIntensidadeAtual(card) {
        const selecionado = card.querySelector('.intensity-preset.bg-blue-100');
        return selecionado ? selecionado.textContent.trim().toLowerCase() : 'media';
        }

        function atualizarVisualLampada(card, estado, intensidade) {
        const lightBulb = card.querySelector('[id^="light-bulb"]');
        const icon = lightBulb?.querySelector('i');

        if (!lightBulb || !icon) {
            console.warn("Não foi possível atualizar a lâmpada: elementos não encontrados.");
            return;
        }

        // Limpa estilos anteriores
        lightBulb.classList.remove('bg-gray-200', 'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200');
            icon.classList.remove('text-gray-400', 'text-yellow-200', 'text-yellow-300', 'text-yellow-400');

            // Aplica novos estilos
            if (estado === 'ligado') {
                if (intensidade === 'leve') {
                lightBulb.classList.add('bg-yellow-50');
                icon.classList.add('text-yellow-200');
                } else if (intensidade === 'media') {
                lightBulb.classList.add('bg-yellow-100');
                icon.classList.add('text-yellow-300');
                } else {
                lightBulb.classList.add('bg-yellow-200');
                icon.classList.add('text-yellow-400');
                }
            } else {
                lightBulb.classList.add('bg-gray-200');
                icon.classList.add('text-gray-400');
            }
        }

//---------------------------------------------------------------------------------------------------------------

        // Modal functionality
        const modals = document.querySelectorAll('.modal');
        const closeModalButtons = document.querySelectorAll('.close-modal');

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex'; // ok
                document.body.style.overflow = 'hidden';
            } else {
                console.error(`Modal com id ${modalId} não encontrado.`);
            }
        }


        function closeAllModals() {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }

        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        });

        // Add/Edit Light functionality
        const addLightButton = document.getElementById('add-light');
        const editLightButtons = document.querySelectorAll('.edit-light');
        const saveLightButton = document.getElementById('save-light');
        const lightModalTitle = document.getElementById('light-modal-title');

        addLightButton.addEventListener('click', () => {
            lightModalTitle.textContent = 'Adicionar Nova Luz';
            document.getElementById('light-cod').value = '';
            document.getElementById('light-nome').value = '';
            document.getElementById('light-location').value = 'Térreo';
            openModal('light-modal');
        });

        editLightButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.light-card');
                const title = card.querySelector('h3').textContent;
                
                lightModalTitle.textContent = `Editar ${title}`;
                document.getElementById('light-name').value = title;
                openModal('light-modal');
            });
        });


// --------------------------------------------------------------------------------------------------------


        //botao salvar luz 
        saveLightButton.addEventListener('click', async () => {
        const nome = document.getElementById('light-nome').value.trim();
        const localizacao = document.getElementById('light-location').value;
        const cod_usuario = localStorage.getItem('cod_usuario');

        if (!nome || !localizacao) {
            alert('Preencha todos os campos.');
            return;
        }

        const novaLuz = {
            cod_usuario,
            nome,
            localizacao
};

        try {
            const resposta = await fetch('/api/luzesCriar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaLuz)
            });

            if (resposta.ok) {
                const luzCriada = await resposta.json();
                // Recarrega toda a lista para evitar inconsistências

                alert('Luz Salva com Sucesso!');
                window.location.reload();
                closeAllModals();
            } else {
                alert('Erro ao salvar luz.');
            }
        } catch (error) {
            alert('Erro de conexão com o servidor.');
            console.error(error);
        }
    });


        // Schedule functionality
        const scheduleAction = document.getElementById('schedule-action');
        const intensityContainer = document.getElementById('intensity-container');
        const scheduleIntensitySlider = document.getElementById('schedule-intensity');
        const scheduleIntensityValue = document.getElementById('schedule-intensity-value');
        const repeatOptions = document.querySelectorAll('.repeat-option');
        const saveScheduleButton = document.getElementById('save-schedule');
        const editScheduleButtons = document.querySelectorAll('.edit-schedule');
        const deleteScheduleButtons = document.querySelectorAll('.delete-schedule');

        scheduleAction.addEventListener('change', () => {
            if (scheduleAction.value === 'Ajustar intensidade') {
                intensityContainer.classList.remove('hidden');
            } else {
                intensityContainer.classList.add('hidden');
            }
        });

        scheduleIntensitySlider.addEventListener('input', () => {
            scheduleIntensityValue.textContent = `${scheduleIntensitySlider.value}%`;
        });

        repeatOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                repeatOptions.forEach(opt => {
                    opt.classList.remove('bg-blue-100', 'text-blue-700');
                    opt.classList.add('bg-gray-100', 'text-gray-700');
                });
                e.target.classList.remove('bg-gray-100', 'text-gray-700');
                e.target.classList.add('bg-blue-100', 'text-blue-700');
            });
        });

        saveScheduleButton.addEventListener('click', () => {
            // Here you would save the schedule to your backend
            alert('Agendamento salvo com sucesso!');
            
            // For demo purposes, add to the table
            const action = scheduleAction.value;
            const lights = document.getElementById('schedule-lights').value;
            const date = document.getElementById('schedule-date').value || 'Hoje';
            const time = document.getElementById('schedule-time').value || 'Agora';
            
            const scheduleRow = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${action}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lights}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${time} (${document.querySelector('.repeat-option.bg-blue-100').textContent})</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${document.querySelector('.repeat-option.bg-blue-100').textContent}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href="#" class="edit-schedule text-blue-600 hover:text-blue-900 mr-3">Editar</a>
                        <a href="#" class="delete-schedule text-red-600 hover:text-red-900">Remover</a>
                    </td>
                </tr>
            `;
            
            document.getElementById('schedules-list').insertAdjacentHTML('beforeend', scheduleRow);
            
            // Reset form
            scheduleAction.value = 'Ligar luzes';
            document.getElementById('schedule-lights').value = 'Todas as luzes';
            document.getElementById('schedule-date').value = '';
            document.getElementById('schedule-time').value = '';
            intensityContainer.classList.add('hidden');
            
            // Reattach event listeners to new buttons
            document.querySelectorAll('.edit-schedule').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal('schedule-modal');
                });
            });
            

            //botao remover do programação
            document.querySelectorAll('.delete-schedule').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Tem certeza que deseja remover este agendamento?')) {
                        e.target.closest('tr').remove();
                    }
                });
            });
        });

        editScheduleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('schedule-modal');
            });
        });

        deleteScheduleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja remover este agendamento?')) {
                    e.target.closest('tr').remove();
                }
            });
        });


        // Responsive adjustments
        function handleResize() {
            // You can add any responsive adjustments here if needed
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        //btn logout
function handleLogout() {
    localStorage.removeItem('cod_usuario'); 
    window.location.href = 'login.html';    
  } 
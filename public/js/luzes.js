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



        //aqui se mexe com o ligar e desligar 


        // Luzes toggle alternar entre ligado/ desligado
        const lightToggles = document.querySelectorAll('input[type="checkbox"]');
        lightToggles.forEach((toggle, index) => {
            toggle.addEventListener('change', () => {
                const lightBulb = document.getElementById(`light-bulb-${index + 1}`);
                if (toggle.checked) {
                    lightBulb.classList.remove('bg-gray-200');
                    lightBulb.classList.add('bg-yellow-200');
                    lightBulb.querySelector('i').classList.remove('text-gray-400');
                    lightBulb.querySelector('i').classList.add('text-yellow-400');
                } else {
                    lightBulb.classList.remove('bg-yellow-200', 'bg-yellow-100', 'bg-yellow-50');
                    lightBulb.classList.add('bg-gray-200');
                    lightBulb.querySelector('i').classList.remove('text-yellow-400', 'text-yellow-300', 'text-yellow-200');
                    lightBulb.querySelector('i').classList.add('text-gray-400');
                }
            });
        });



        // Intensity botões que alteram a cor da lampada
        const intensityButtons = document.querySelectorAll('.intensity-preset');
        intensityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove classe ativa de todos os botões no mesmo cartão
                const cardButtons = e.target.closest('.light-card').querySelectorAll('.intensity-preset');
                cardButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-100', 'text-blue-700');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });

                // Adiciona classe ativa ao botão clicado
                e.target.classList.remove('bg-gray-100', 'text-gray-700');
                e.target.classList.add('bg-blue-100', 'text-blue-700');

                // Descobre qual é o card (lâmpada) clicado
                const card = e.target.closest('.light-card');
                const cards = document.querySelectorAll('.light-card');
                const cardIndex = Array.from(cards).indexOf(card);
                const lightBulb = document.getElementById(`light-bulb-${cardIndex + 1}`);

                // Define intensidade com base no texto do botão
                let value = 0;
                const text = e.target.textContent.trim();

                if (text === 'Leve') {
                    value = 30;
                } else if (text === 'Média') {
                    value = 60;
                } else if (text === 'Forte') {
                    value = 100;
                }

                // Aplica a lógica de visual da lâmpada diretamente
                if (value > 0) {
                    lightBulb.querySelector('i').classList.remove('text-gray-400');

                    if (value <= 30) {
                        lightBulb.classList.remove('bg-yellow-200', 'bg-yellow-100');
                        lightBulb.classList.add('bg-yellow-50');
                        lightBulb.querySelector('i').classList.remove('text-yellow-400', 'text-yellow-300');
                        lightBulb.querySelector('i').classList.add('text-yellow-200');
                    } else if (value <= 70) {
                        lightBulb.classList.remove('bg-yellow-200', 'bg-yellow-50');
                        lightBulb.classList.add('bg-yellow-100');
                        lightBulb.querySelector('i').classList.remove('text-yellow-400', 'text-yellow-200');
                        lightBulb.querySelector('i').classList.add('text-yellow-300');
                    } else {
                        lightBulb.classList.remove('bg-yellow-100', 'bg-yellow-50');
                        lightBulb.classList.add('bg-yellow-200');
                        lightBulb.querySelector('i').classList.remove('text-yellow-300', 'text-yellow-200');
                        lightBulb.querySelector('i').classList.add('text-yellow-400');
                    }
                }
            });
        });



        // Modal functionality
        const modals = document.querySelectorAll('.modal');
        const closeModalButtons = document.querySelectorAll('.close-modal');

        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'flex';
            document.body.style.overflow = 'hidden';
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
            document.getElementById('light-name').value = '';
            document.getElementById('light-location').value = 'Sala de Estar';
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

        

        saveLightButton.addEventListener('click', () => {
            // Here you would save the light data to your backend
            alert('Luz salva com sucesso!');
            closeAllModals();
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
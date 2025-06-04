// Tab switching functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.replace('border-blue-500', 'border-transparent'));
            tab.classList.replace('border-transparent', 'border-blue-500');
            });
        });

        // Light toggle functionality
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

        // Intensity slider functionality
        const intensitySliders = document.querySelectorAll('.intensity-slider');
        intensitySliders.forEach((slider, index) => {
            slider.addEventListener('input', () => {
                const value = slider.value;
                const valueDisplay = document.getElementById(`intensity-value-${index + 1}`);
                const lightBulb = document.getElementById(`light-bulb-${index + 1}`);
                
                
                // Update light bulb appearance based on intensity
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

        // Intensity preset buttons
        const intensityButtons = document.querySelectorAll('.intensity-preset');
        intensityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons in the same card
                const cardButtons = e.target.closest('.light-card').querySelectorAll('.intensity-preset');
                cardButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-100', 'text-blue-700');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });
                
                // Add active class to clicked button
                e.target.classList.remove('bg-gray-100', 'text-gray-700');
                e.target.classList.add('bg-blue-100', 'text-blue-700');
                
                // Get the light card index
                const card = e.target.closest('.light-card');
                const cards = document.querySelectorAll('.light-card');
                const cardIndex = Array.from(cards).indexOf(card);
                
                // Update slider based on button text
                const slider = document.getElementById(`intensity-${cardIndex + 1}`);
                const valueDisplay = document.getElementById(`intensity-value-${cardIndex + 1}`);
                
                if (e.target.textContent === 'Leve') {
                    slider.value = 30;
              
                } else if (e.target.textContent === 'Média') {
                    slider.value = 60;
             
                } else if (e.target.textContent === 'Forte') {
                    slider.value = 100;
          
                }
                
                // Trigger input event to update light bulb
                slider.dispatchEvent(new Event('input'));
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
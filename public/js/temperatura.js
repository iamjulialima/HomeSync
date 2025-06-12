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


    document.addEventListener('DOMContentLoaded', function() {
        // Atualizar data e hora
        function updateDateTime() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', options);
            document.getElementById('current-time').textContent = now.toLocaleTimeString('pt-BR');
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Gerar dados de exemplo
        function generateData() {
            // Temperatura (entre 15 e 35)
            const currentTemp = (Math.random() * 20 + 15).toFixed(1);
            const maxTemp = (parseFloat(currentTemp) + Math.random() * 3).toFixed(1);
            const minTemp = (parseFloat(currentTemp) - Math.random() * 3).toFixed(1);
            const avgTemp = ((parseFloat(maxTemp) + parseFloat(minTemp)) / 2).toFixed(1);
            const tempVariation = (parseFloat(maxTemp) - parseFloat(minTemp)).toFixed(1);

            // Umidade (entre 30 e 90)
            const currentHumidity = Math.floor(Math.random() * 60 + 30);
            const maxHumidity = Math.min(100, currentHumidity + Math.floor(Math.random() * 10));
            const minHumidity = Math.max(0, currentHumidity - Math.floor(Math.random() * 10));
            const avgHumidity = Math.floor((maxHumidity + minHumidity) / 2);

            // Índice de calor
            const heatIndex = calculateHeatIndex(currentTemp, currentHumidity);

            // Atualizar os displays
            updateGauge('temp', currentTemp, 15, 35);
            document.getElementById('current-temp').textContent = currentTemp + '°C';
            document.getElementById('max-temp').textContent = maxTemp + '°C';
            document.getElementById('min-temp').textContent = minTemp + '°C';
            
            updateGauge('humidity', currentHumidity, 0, 100);
            document.getElementById('current-humidity').textContent = currentHumidity + '%';
            document.getElementById('max-humidity').textContent = maxHumidity + '%';
            document.getElementById('min-humidity').textContent = minHumidity + '%';
            
            document.getElementById('heat-index').textContent = heatIndex.value.toFixed(1) + '°C';
            document.getElementById('heat-comfort').textContent = heatIndex.comfort;
            document.getElementById('heat-comfort').className = "text-" + heatIndex.color + "-500";
            
            document.getElementById('avg-temp').textContent = avgTemp + '°C';
            document.getElementById('avg-temp-bar').style.width = ((avgTemp - 15) / 20 * 100) + '%';
            
            document.getElementById('avg-humidity').textContent = avgHumidity + '%';
            document.getElementById('avg-humidity-bar').style.width = avgHumidity + '%';
            
            document.getElementById('temp-variation').textContent = tempVariation + '°C';
            document.getElementById('temp-variation-bar').style.width = (parseFloat(tempVariation) / 10 * 100) + '%';

            // Adicionar ao histórico
            addHistoryEntry(currentTemp, currentHumidity, heatIndex);

            // Atualizar gráficos
            updateCharts();
        }

        // Calcular índice de calor (heat index)
        function calculateHeatIndex(temp, humidity) {
            const t = parseFloat(temp);
            const rh = parseFloat(humidity);
            
            if (t < 27 || rh < 40) {
                return { value: t, comfort: "Sem desconforto significativo", color: "green" };
            }
            
            // Fórmula simplificada para índice de calor
            const hi = -8.78469475556 + 1.61139411 * t + 2.33854883889 * rh - 
                      0.14611605 * t * rh - 0.012308094 * t * t - 
                      0.0164248277778 * rh * rh + 0.002211732 * t * t * rh + 
                      0.00072546 * t * rh * rh - 0.000003582 * t * t * rh * rh;
            
            if (hi < 32) {
                return { value: hi, comfort: "Cuidado: Possível fadiga com atividade prolongada", color: "yellow" };
            } else if (hi < 41) {
                return { value: hi, comfort: "Perigo: Possível insolação e cãibras", color: "orange" };
            } else if (hi < 54) {
                return { value: hi, comfort: "Perigo extremo: Insolação iminente", color: "red" };
            } else {
                return { value: hi, comfort: "Perigo extremo: Risco de vida", color: "red" };
            }
        }

        // Atualizar os medidores
        function updateGauge(type, value, min, max) {
            const percent = ((value - min) / (max - min)) * 100;
            let degrees;
            
            if (type === 'temp') {
                degrees = 180 * (percent / 100);
                document.getElementById('temp-arrow').style.transform = `translateX(-50%) rotate(${degrees}deg)`;
                document.getElementById('temp-value').textContent = value + (type === 'temp' ? '°C' : '%');
            } else {
                degrees = 180 * (percent / 100);
                document.getElementById('humidity-arrow').style.transform = `translateX(-50%) rotate(${degrees}deg)`;
                document.getElementById('humidity-value').textContent = value + '%';
            }
        }

        // Histórico de dados
        const historyData = [];
        function addHistoryEntry(temp, humidity, heatIndex) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            historyData.unshift({
                time: timeStr,
                temp: parseFloat(temp),
                humidity: parseFloat(humidity),
                heatIndex: heatIndex.value,
                comfort: heatIndex.comfort,
                color: heatIndex.color
            });
            
            // Manter apenas os últimos 5 registros para a tabela
            if (historyData.length > 5) {
                historyData.pop();
            }
            
            // Atualizar tabela
            updateTable();
            
            // Manter até 24 registros para os gráficos
            if (historyData.length > 24) {
                historyData.splice(24);
            }
        }

        function updateTable() {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = '';
            
            historyData.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.time}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${entry.temp > 30 ? 'text-red-500' : entry.temp < 20 ? 'text-blue-500' : 'text-gray-500'}">${entry.temp.toFixed(1)}°C</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${entry.humidity > 70 ? 'text-blue-500' : entry.humidity < 40 ? 'text-yellow-500' : 'text-gray-500'}">${entry.humidity.toFixed(0)}%</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${entry.color === 'red' ? 'text-red-500' : entry.color === 'orange' ? 'text-orange-500' : entry.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'}">${entry.heatIndex.toFixed(1)}°C</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${entry.color === 'red' ? 'text-red-500' : entry.color === 'orange' ? 'text-orange-500' : entry.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'}">${entry.comfort}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Inicializar gráficos
        let tempChart, humidityChart;
        function initCharts() {
            const tempCtx = document.getElementById('temperature-chart').getContext('2d');
            const humidityCtx = document.getElementById('humidity-chart').getContext('2d');
            
            tempChart = new Chart(tempCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: [],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            min: 10,
                            max: 40
                        }
                    }
                }
            });
            
            humidityChart = new Chart(humidityCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Umidade (%)',
                        data: [],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }

        function updateCharts() {
            const labels = historyData.map(entry => entry.time).reverse();
            const tempData = historyData.map(entry => entry.temp).reverse();
            const humidityData = historyData.map(entry => entry.humidity).reverse();
            
            tempChart.data.labels = labels;
            tempChart.data.datasets[0].data = tempData;
            tempChart.update();
            
            humidityChart.data.labels = labels;
            humidityChart.data.datasets[0].data = humidityData;
            humidityChart.update();
        }

        // Inicializar
        initCharts();
        generateData(); // Primeira leitura
        
        // Atualizar dados a cada 5 segundos
        setInterval(generateData, 5000);
    });

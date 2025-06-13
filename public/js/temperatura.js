document.addEventListener('DOMContentLoaded', function () {
    const historyData = [];

    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', options);
        document.getElementById('current-time').textContent = now.toLocaleTimeString('pt-BR');
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Gráfico de temperatura
    let tempChart;
    function initChart() {
        const tempCtx = document.getElementById('temperature-chart').getContext('2d');
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
    }

    function generateData() {
        const currentTemp = (Math.random() * 20 + 15).toFixed(1);
        const now = new Date();
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        historyData.unshift({
            time: timeStr,
            temp: parseFloat(currentTemp)
        });

        if (historyData.length > 24) {
            historyData.pop();
        }

        updateChart();
    }

    function updateChart() {
        const labels = historyData.map(entry => entry.time).reverse();
        const tempData = historyData.map(entry => entry.temp).reverse();

        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = tempData;
        tempChart.update();
    }

    // Inicializar
    initChart();
    generateData(); // Primeira leitura
    setInterval(generateData, 5000);
});
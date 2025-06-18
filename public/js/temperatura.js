  // Função para buscar os dados da API
  async function buscarDados() {
    try {
      const response = await fetch('/api/temperatura/ultimas?horas=2'); // Use URL relativa
      if (!response.ok) {
        throw new Error('Erro ao buscar dados: ' + response.statusText);
      }
      const dados = await response.json();
      return dados;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Formata a hora para exibir no gráfico
  function formatarData(dataStr) {
    const data = new Date(dataStr);
    data.setHours(data.getHours() - 3); // Ajuste UTC-3
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Função que monta o gráfico e atualiza a tabela de histórico
  async function montarGrafico() {
    const dados = await buscarDados();

    // Atualiza a tabela de histórico
    const tbody = document.getElementById('schedules-list');
    tbody.innerHTML = ''; // Limpa tabela

    const limiteLinhas = 10;
    const dadosLimitados = dados.slice(-limiteLinhas).reverse(); // Pega os últimos 10 e inverte

    dadosLimitados.forEach((item) => {
      const tr = document.createElement('tr');

      // Temperatura
      const tdTemp = document.createElement('td');
      tdTemp.textContent = `${item.temperatura}ºC`;
      tdTemp.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

      // Umidade
      const tdUmi = document.createElement('td');
      tdUmi.textContent = `${item.umidade}%`;
      tdUmi.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

      // Data/Hora (corrigida para UTC-3)
      const tdData = document.createElement('td');
      const data = new Date(item.data_hora);
      data.setHours(data.getHours() - 3); // Corrige o fuso horário
      tdData.textContent = data.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      tdData.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');

      tr.appendChild(tdTemp);
      tr.appendChild(tdUmi);
      tr.appendChild(tdData);

      tbody.appendChild(tr);
    });

    // Atualiza o valor do display da temperatura grande (no gauge)
    const ultimo = dados[dados.length - 1];
    if (ultimo) {
      const tempValue = document.getElementById('temp-value');
      tempValue.textContent = `${ultimo.temperatura}ºC`;
    }

    // Monta o gráfico - destrói gráfico antigo se existir para não sobrepor
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    if (window.graficoTemperatura) {
      window.graficoTemperatura.destroy();
    }

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
            fill: false,
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
            fill: false,
            tension: 0.1,
            pointRadius: 1,
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hora',
            },
          },
          y1: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Temperatura (°C)',
            },
            min: 0,
            max: 50,
          },
          y2: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Umidade (%)',
            },
            min: 0,
            max: 100,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  // Chama o gráfico quando a página carregar
  window.onload = montarGrafico;

  // Atualiza a cada 5 minutos (300000ms)
  setInterval(montarGrafico, 60000);
function formatar(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
} 


async function pegardados() {
    const resposta =  await fetch("/metricas/usuario",{
        method: "GET",
        headers: {"Authentication": "Bearer " + localStorage.getItem("token")}
    })

    const dados = await resposta.json()
    return dados    
} 


function mostrarDados(dados) {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    const graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Horas de Trabalho', 'Horas de Lazar', 'Horas de Sono'],
            datasets: [{
                data: dados,
                backgroundColor: [
                    '#3294D0',  
                    '#0773B5',  
                    '#014976'   
                ],
                borderColor: [
                
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 30,
                        boxHeight: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const valor = context.raw;
                            return `${label}: ${formatar(valor)}`;
                        }
                    }
                }
            }
        }
    });
}

pegardados().then((dados) => {
    const horas = dados[dados.length - 1]
    mostrarDados([
        horas.horas_trabalho ,
        horas.horas_lazer ,
        horas.horas_sono 
    ])   
})



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
            labels: ['Trabalho', 'Sono', 'Lazer'],
            datasets: [{
                label: 'Horas de sono',
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
                }
            }
        }
    })   
}

pegardados().then((dados) => {
    const horas = dados[dados.length - 1]
    mostrarDados([
        horas.horas_trabalho ,
        horas.horas_lazer ,
        horas.horas_sono 
    ])
})
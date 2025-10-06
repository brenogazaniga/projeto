const ctx = document.getElementById('graficoPizza').getContext('2d');
const graficoPizza = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Trabalho', 'Sono', 'Lazer'],
        datasets: [{
            label: 'Horas de sono',
            data: [10, 6, 8],
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

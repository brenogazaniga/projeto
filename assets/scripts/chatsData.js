function formatar(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

async function pegardados() {
  const resposta = await fetch("/metricas/usuario", {
    method: "GET",
    headers: { Authentication: "Bearer " + localStorage.getItem("token") },
  });

  const dados = await resposta.json();
  return dados;
}

function mostrarDados(dados) {
  const ctx = document.getElementById("graficoPizza").getContext("2d");
  const graficoPizza = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Horas de Trabalho", "Horas de Lazer", "Horas de Sono"],
      datasets: [
        {
          data: dados,
          backgroundColor: ["#3294D0", "#0773B5", "#014976"],
          borderColor: [],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 30,
            boxHeight: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const valor = context.raw;
              return `${label}: ${formatar(valor)}`;
            },
          },
        },
      },
    },
  });
}

pegardados().then((dados) => {
  const horas = dados[dados.length - 1];
  mostrarDados([horas.horas_trabalho, horas.horas_lazer, horas.horas_sono]);
});

const finalValue = 50; // valor de equilíbrio (0 a 100)
let currentValue = 0;
const bar = document.getElementById("bar");
const valueText = document.getElementById("valueText");
const statusText = document.getElementById("statusText");

function updateStatus(value) {
  if (value <= 5) {
    statusText.textContent = "Crítico";
    bar.style.background = "linear-gradient(90deg, #f44336, #ff9800)";
  } else if (value <= 10) {
    statusText.textContent = "Muito baixo";
    bar.style.background = "linear-gradient(90deg, #ffeb3b, #ff9800)";
  } else if (value <= 15) {
    statusText.textContent = "A Melhorar";
    bar.style.background = "linear-gradient(90deg, #FE9E4A, #ff9800)";
  } else if (value <= 30) {
    statusText.textContent = "Baixo";
    bar.style.background = "linear-gradient(90deg, #FE9E4A, #ff9800)";
  } else if (value <= 50) {
    statusText.textContent = "Moderado";
    bar.style.background = "linear-gradient(90deg, #FFEB3B, #ff9800)";
  }else if (value <= 70) {
    statusText.textContent = "Bom";
    bar.style.background = "linear-gradient(90deg, #FFEB3B, #ff9800)";
}else if (value <= 85) {
    statusText.textContent = "Muito bom!";
    bar.style.background = "linear-gradient(90deg, #BAF351, #ff9800)";
} else {
    statusText.textContent = "Excelente!!";
    bar.style.background = "linear-gradient(90deg, #4CAF50, #8bc34a)";
  }
}

function animateBar() {
  const step = 1; // quanto aumenta por frame
  const delay = 20; // ms entre frames (~50fps)

  const interval = setInterval(() => {
    if (currentValue >= finalValue) {
      clearInterval(interval);
    } else {
      currentValue += step;
      bar.style.width = currentValue + "%";
      valueText.textContent = currentValue + "%";
      updateStatus(currentValue);
    }
  }, delay);
}

animateBar();

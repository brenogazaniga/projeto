
const inputs = [
  {
    input: document.getElementById("lazer"),
    output: document.getElementById("mostraLazer"),
  },
  {
    input: document.getElementById("sono"),
    output: document.getElementById("mostraSono"),
  },
  {
    input: document.getElementById("trabalho"),
    output: document.getElementById("mostraTrabalho"),
  },
];



addEventListener("DOMContentLoaded", () => {
  document.querySelector(".cadastrar").addEventListener("click", () => {

    const dados = {
      horas_lazer: null,
      horas_sono: null,
      horas_trabalho: null,
    }

    inputs.forEach(({ input, output }) => {
      output.textContent = input.value || "--:--";
    });

    dados.horas_lazer = converter(inputs[0].input.value)
    dados.horas_sono = converter(inputs[1].input.value)
    dados.horas_trabalho = converter(inputs[2].input.value)

    function converter(hora) {
        const partes = hora.split(':');
        const horas = parseInt(partes[0], 10);
        const minutos = parseInt(partes[1], 10);
        return (horas * 60) + minutos;
    }
    console.log("4123541523")
    fetch("/metricas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": "Bearer " + localStorage.getItem("token"),

      },
      body: JSON.stringify(dados)
    })
  })
})

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
pegardados().then((dados) => {
  const horas = dados[dados.length - 1];
  const mostraLazer = document.getElementById("mostraLazer")
  const mostraTrabalho = document.getElementById("mostraTrabalho")
  const mostraSono = document.getElementById("mostraSono")
  mostraLazer.textContent = formatar(horas.horas_lazer)
  mostraSono.textContent = formatar(horas.horas_sono)
  mostraTrabalho.textContent = formatar(horas.horas_trabalho)
});

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
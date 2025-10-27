const input = document.querySelector(".caixa_de_texto");
const botao = document.querySelector(".botao_de_envio");
const areaMensagens = document.querySelector("#mensagens-enviadas");

botao.addEventListener("click", (e) => {
  e.preventDefault();

  const texto = input.value.trim();

  if (texto !== "") {
    const msg = document.createElement("p");
    msg.textContent = "Você: " + texto;
    areaMensagens.appendChild(msg);
    input.value = "";
  }
});
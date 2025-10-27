document.addEventListener("DOMContentLoaded", () => {
  const mensagensContainer = document.querySelector(".mensagens");

  const form =
    document.querySelector(".chatia .conteudo form") ||
    document.querySelector("form#chatia");
  const input = document.getElementById("mensagem_input");

  if (!mensagensContainer || !form || !input) return;

  function temMensagens() {
    return mensagensContainer.querySelectorAll(".mensagem").length > 0;
  }

  let placeholder = mensagensContainer.querySelector(".placeholder");

  if (!placeholder) {
    placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = "Você ainda não tem conversas. Comece agora!";
  }

  function atualizarPlaceholder() {
    if (temMensagens()) {
      const existe = mensagensContainer.contains(placeholder);

      if (existe) mensagensContainer.removeChild(placeholder);

    } else {
        
      if (!mensagensContainer.contains(placeholder))
        mensagensContainer.appendChild(placeholder);
    }
  }

  atualizarPlaceholder();

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const texto = input.value.trim();
    if (texto === "") return;
    const nova = document.createElement("div");
    nova.classList.add("mensagem", "usuario");
    nova.textContent = texto;
    if (mensagensContainer.contains(placeholder)) {
      mensagensContainer.removeChild(placeholder);
    }
    mensagensContainer.appendChild(nova);
    input.value = "";
    mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
    atualizarPlaceholder();
  });

  window.atualizarPlaceholderChat = atualizarPlaceholder;
});

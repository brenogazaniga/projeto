document
  .getElementById("formCadastro")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const mensagem = document.getElementById("mensagem");
    const botao = document.querySelector('button[type="submit"]')

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      mensagem.textContent = "As senhas não coincidem.";
      mensagem.style.color = "red";
      return;
    }

    try {
      botao.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8-79.3 23.6-137.1 97.1-137.1 184.1 0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256 512 397.4 397.4 512 256 512S0 397.4 0 256c0-116 77.1-213.9 182.9-245.4 16.9-5 34.8 4.6 39.8 21.5z"/></svg>`
      botao.classList.add("carregando")
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        mensagem.textContent = "✅ " + dados.mensagem;
        mensagem.style.color = "green";
        document.getElementById("formCadastro").reset();
        window.location.assign("/login");
      } else {
        mensagem.textContent =
          "❌ " + (dados.mensagem || "Erro ao criar usuário");
        mensagem.style.color = "red";
      }
    } catch (err) {
      mensagem.textContent = "Erro ao conectar com o servidor.";
      mensagem.style.color = "red";
    }
  });

  console.log(mensagem);
document
  .getElementById("formCadastro")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const mensagem = document.getElementById("mensagem");

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      mensagem.textContent = "⚠️ As senhas não coincidem.";
      mensagem.style.color = "red";
      return;
    }

    try {
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
      mensagem.textContent = "⚠️ Erro ao conectar com o servidor.";
      mensagem.style.color = "red";
    }
  });

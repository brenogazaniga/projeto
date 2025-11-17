function showModal() {
  let modal = document.querySelector(".back-modal");
  modal.classList.remove("disable");
}

function closeModal() {
  let modal = document.querySelector(".back-modal");
  modal.classList.add("disable");
}

document
  .querySelector("#logout a")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    await fetch("/logout");
    localStorage.removeItem("token");
    window.location.href = "/";
  });


  

addEventListener("DOMContentLoaded", async () => {
  const info = document.querySelector("#infos");
  const resposta = await fetch("/api/usuario", {
    headers: {
      Authentication: "Bearer " + localStorage.getItem("token"),
    },
  });

  const dados = await resposta.json();
  console.log(dados);

  const campos = info.querySelectorAll(".informacoes");
  campos[0].querySelector("dd").innerHTML = dados.email;
  campos[1].querySelector("dd").innerHTML = dados.senha;
  campos[2].querySelector("dd").innerHTML = dados.nome;
});




const fieldMap = {
  email: "email",
  senhaAntiga: "senhaAntiga",
  novaSenha: "senha",
  nome: "nome"
};

async function editarInfos() {
  const novoEmail = document.querySelector("#editar-email")?.value || "";
  const senhaAntiga = document.querySelector("#verificacao-senha-antiga")?.value || "";
  const novaSenha = document.querySelector("#editar-senha")?.value || "";
  const novoNome = document.querySelector("#editar-nome")?.value || "";

  const body = {};

  if (novoEmail) body[fieldMap.email] = novoEmail;
  if (senhaAntiga) body[fieldMap.senhaAntiga] = senhaAntiga;
  if (novaSenha) body[fieldMap.novaSenha] = novaSenha;
  if (novoNome) body[fieldMap.nome] = novoNome;

  try {
    const resposta = await fetch("/api/usuarios/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    });

    const dados = await resposta.json().catch(() => ({}));
    console.log("Resposta editarInfos:", resposta.status, dados);

    if (!resposta.ok) {
      alert(dados.message || "Erro ao atualizar. Código: " + resposta.status);
      return;
    }

    alert("Informações atualizadas com sucesso!");
    document.querySelector("#meuModal")?.classList.remove("aberto");

  } catch (error) {
    console.error("Erro de conexão:", error);
    alert("Erro de conexão. Tente novamente.");
  }
}

document.querySelector("#salvar").addEventListener("click", editarInfos);
// Olho mostrar senha
"*****"


// Abrir e fechar modal
function showModal() {
  let modal = document.querySelector(".back-modal");
  modal.classList.remove("disable");
}

function closeModal() {
  let modal = document.querySelector(".back-modal");
  modal.classList.add("disable");
}

// Botão de logout
document
  .querySelector("#logout a")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    await fetch("/logout");
    localStorage.removeItem("token");
    window.location.href = "/";
  });


  
// Pegando informações do banco de dados e mostrando na tela de configurações
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
  campos[1].querySelector("dd").innerHTML = dados.nome;
});



// Atualização dados do usuário
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

  const resposta = await fetch("/api/usuario", {
    headers: {
      Authentication: "Bearer " + localStorage.getItem("token"),
    },
  });
  const dados = await resposta.json();

  if (novoEmail === dados.email) {
    alert("Mude o email, este já está sendo utilizado");
    return false;
  }

  if (senhaAntiga != dados.senha) {
    alert("Senha antiga incorreta!");
    return false;
  }

  try {
    const respostaPut = await fetch("/api/usuarios/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
    });

    const dadosPut = await respostaPut.json().catch(() => ({}));
    console.log("Resposta editarInfos:", respostaPut.status, dadosPut);

    if (!respostaPut.ok) {
      alert(dadosPut.message || "Erro ao atualizar. Código: " + respostaPut.status);
      return false;
    }

    alert("Informações atualizadas com sucesso!");
    closeModal();
    return true; 
  } catch (error) {
    console.error("Erro de conexão:", error);
    alert("Erro de conexão. Tente novamente.");
    return false;
  }
}

const btnSalvar = document.querySelector("#salvar");
if (btnSalvar) {
  btnSalvar.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const ok = await editarInfos();
    if (ok) {
      location.reload();
    }
  });
}
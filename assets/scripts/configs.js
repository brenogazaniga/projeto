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

  document.querySelector("#salvar").addEventListener("click", editarInfos)
});

async function editarInfos () {
  const nome = document.querySelector("#editar-nome")
  const email = document.querySelector("#editar-email")
  const senha = document.querySelector("#editar-senha")

  const info = document.querySelector("#infos");
  const resposta = await fetch("/api/usuarios", {
    headers: {
      Authentication: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      nome: nome == "" ? null : nome,
      email: email == "" ? null : email,
      senha: senha == "" ? null : senha,
    })
  });

  const dados = await resposta.json();

  const inputEmail = dados.email
  console.log(inputEmail)

  const campos = info.querySelectorAll(".informacoes");
  campos[0].querySelector("dd").innerHTML = dados.email;
  campos[1].querySelector("dd").innerHTML = dados.senha;
  campos[2].querySelector("dd").innerHTML = dados.nome;
}
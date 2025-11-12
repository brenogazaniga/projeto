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

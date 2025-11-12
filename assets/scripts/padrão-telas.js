addEventListener("DOMContentLoaded", async () => {
  const info = document.querySelector("#logo_e_user");
  const resposta = await fetch("/api/usuario", {
    headers: {
      Authentication: "Bearer " + localStorage.getItem("token"),
    },
  });

  const dados = await resposta.json();
  console.log(dados);

  const campos = info.querySelectorAll("#user");
  campos[0].querySelector("p").innerHTML = dados.nome;
});

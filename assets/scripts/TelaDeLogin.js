document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").onsubmit = function (event) {
    event.preventDefault();
    const [email, senha] = document.querySelectorAll("input");

    const dados = {
      email: email.value,
      senha: senha.value,
    };

    //TODO fazer o fetch
    login(dados.email, dados.senha);
  };
});

async function login(email, senha) {
  const resposta = await fetch("/api/login", {
    method: "post",
    body: JSON.stringify({
      email,
      senha,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(resposta);
  const json = await resposta.json();
  console.log(json);

  if (!json.sucesso) {
    alert(json.mensagem);
    return;
  }
  const token = json.token;
  localStorage.setItem("token", token);
  console.log("direcionando");
  window.location.href = "/suporte";
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").onsubmit = function (event) {
    event.preventDefault();
    const [email, senha] = document.querySelectorAll("input");

    const dados = {
      email: email.value,
      senha: senha.value,
    };

    //TODO fazer o fetch
    login(dados.email, dados.senha)
  };
});

async function login(email, senha) {
  const resposta = await fetch("/api/login",{
    method:"post",
    body:JSON.stringify({
      email,
      senha
    }),headers:{
      "Content-Type": "application/json"
    }
  })
  const json = await resposta.json()
  if(json.erro){
    alert(json.mensagem)
    return
  }else{
    const token = json.token
    localStorage.setItem("token", token)
    window.location.assign("/suporte")
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").onsubmit = function (event) {
    event.preventDefault();
    const [email, senha] = document.querySelectorAll("input");

    const dados = {
      email: email.value,
      senha: senha.value,
    };

    //TODO fazer o fetch
  };
});

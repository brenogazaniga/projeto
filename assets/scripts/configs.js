function showModal(){
   let modal = document.querySelector(".back-modal")
   modal.classList.remove("disable")
}

function closeModal(){
  let modal = document.querySelector(".back-modal")
  modal.classList.add("disable")
}

document.querySelector("#logout a").addEventListener("click", async function(event) {
  event.preventDefault(); 
  await fetch("/logout")
  localStorage.removeItem("token"); 
  window.location.href = "/"; 
});

addEventListener("DOMContentLoaded", () => {
  const info = document.querySelector("#infos");
  const campos = info.querySelectorAll(".informacoes");
  
  // Mapeamento dos campos
  const campoEmail = campos[0].querySelector("dd");
  const campoSenha = campos[1].querySelector("dd");
  const campoNome = campos[2].querySelector("dd");
  const olhoIcon = campoSenha.querySelector("img");
  
  // Limpa os campos
  campoEmail.innerText = "";
  campoSenha.innerText = "**********";
  campoNome.innerText = "";
  
  async function carregarDadosUsuario() {
    try {
      const token = localStorage.getItem('token');
      console.log('Token no localStorage:', token); // Depuração
      
      if (!token) {
        alert('Você não está logado. Redirecionando para login.');
        window.location.href = 'login.html'; // Redireciona se não logado
        return;
      }
      
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Status da resposta:', response.status); // Depuração
      
      if (!response.ok) {
        if (response.status === 401) {
          alert('Token inválido ou expirado. Faça login novamente.');
          localStorage.removeItem('token'); // Remove token inválido
          window.location.href = 'login.html';
          return;
        }
        throw new Error(`Erro: ${response.status}`);
      }
      
      const dados = await response.json();
      console.log('Dados recebidos:', dados); // Depuração
      
      campoEmail.innerText = dados.email || "Não informado";
      campoNome.innerText = dados.nome || "Não informado";
      campoSenha.dataset.senhaReal = dados.senha || "";
      
    } catch (error) {
      console.error('Erro:', error);
      campoEmail.innerText = "Erro ao carregar";
      campoSenha.innerText = "Erro ao carregar";
      campoNome.innerText = "Erro ao carregar";
    }
  }
  
  carregarDadosUsuario();
  
  // Funcionalidade do olho
  let senhaVisivel = false;
  olhoIcon.addEventListener("click", () => {
    if (senhaVisivel) {
      campoSenha.innerText = "**********";
      olhoIcon.src = "../assets/img/eye-icon.svg";
    } else {
      campoSenha.innerText = campoSenha.dataset.senhaReal || "Não definida";
      olhoIcon.src = "../assets/img/eye-open-icon.svg";
    }
    senhaVisivel = !senhaVisivel;
  });
});
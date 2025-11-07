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
  
  // Mapeamento dos campos para facilitar o preenchimento
  const campoEmail = campos[0].querySelector("dd"); // Primeiro <dd> é o email
  const campoSenha = campos[1].querySelector("dd"); // Segundo <dd> é a senha
  const campoNome = campos[2].querySelector("dd"); // Terceiro <dd> é o nome
  
  // Elemento do ícone de olho (para mostrar/ocultar senha)
  const olhoIcon = campoSenha.querySelector("img");
  
  // Limpa os campos inicialmente (como no seu código original)
  campoEmail.innerText = "";
  campoSenha.innerText = "**********"; // Mantém mascarado por padrão
  campoNome.innerText = "";
  
  // Função para buscar dados do usuário via API
  async function carregarDadosUsuario() {
    try {
      // Obtém o token de autenticação
      const token = localStorage.getItem('token'); // Ou sessionStorage.getItem('token')
      
      console.log('Token encontrado:', token); // Log para depuração
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login primeiro.');
      }
      
      // Requisição com o token
      const response = await fetch('http://localhost:3000/api/usuarios', { // Usei a URL completa que você mostrou
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajuste se o formato for diferente (ex.: 'Token ${token}')
        },
      });
      
      console.log('Status da resposta:', response.status); // Log para depuração
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const dados = await response.json();
      console.log('Dados recebidos:', dados); // Log para depuração
      
      // Preenche os campos com os dados recebidos
      campoEmail.innerText = dados.email || "Não informado";
      campoNome.innerText = dados.nome || "Não informado";
      
      // Para a senha: armazena a senha real em um atributo data para uso posterior
      campoSenha.dataset.senhaReal = dados.senha || "";
      // Mantém mascarado por padrão
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Exibe mensagens de erro nos campos
      campoEmail.innerText = "Erro ao carregar";
      campoSenha.innerText = "Erro ao carregar";
      campoNome.innerText = "Erro ao carregar";
      
      // Alerta para o usuário
      alert(error.message);
    }
  }
  
  // Chama a função para carregar os dados assim que o DOM carregar
  carregarDadosUsuario();
  
  // Funcionalidade para mostrar/ocultar senha ao clicar no ícone de olho
  let senhaVisivel = false; // Estado inicial: senha oculta
  olhoIcon.addEventListener("click", () => {
    if (senhaVisivel) {
      // Oculta a senha
      campoSenha.innerText = "**********";
      olhoIcon.src = "../assets/img/eye-icon.svg"; // Ícone padrão (olho fechado)
    } else {
      // Mostra a senha real
      campoSenha.innerText = campoSenha.dataset.senhaReal || "Não definida";
      olhoIcon.src = "../assets/img/eye-open-icon.svg"; // Troque para um ícone de olho aberto, se tiver
    }
    senhaVisivel = !senhaVisivel;
  });
});
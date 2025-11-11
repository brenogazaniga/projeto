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
  const info = document.querySelector("#infos")
  info.querySelectorAll(".informacoes").forEach((campo) => {
    campo.querySelector("dd").innerText = "a"
  })
})
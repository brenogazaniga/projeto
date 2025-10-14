addEventListener("DOMContentLoaded", () => {
    document
    .getElementById("chatia")
    .addEventListener("submit", async (e) => {
        const mensagem_user = document.getElementById("mensagem_input").value.trim();
        const conversa = document.querySelector(".mensagens")
         e.preventDefault();


        const mensagem = document.createElement("div")
        mensagem.classList.add("mensagem")
        mensagem.classList.add("usuario")
        mensagem.innerHTML = mensagem_user
        conversa.appendChild(mensagem)
        console.log(mensagem_user)

        document.getElementById("mensagem_input").value = ''
        conversa.scrollTop = conversa.scrollHeight
    })
})

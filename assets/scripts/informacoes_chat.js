addEventListener("DOMContentLoaded", () => {
    document
    .querySelector("form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();
        const mensagem_user = document.getElementById("mensagem_input").value.trim();
        const conversa = document.querySelector(".mensagens")
        
        const mensagem = document.createElement("div")
        mensagem.classList.add("mensagem")
        mensagem.classList.add("usuario")
        mensagem.innerHTML = mensagem_user
        
        conversa.appendChild(mensagem)
        console.log(mensagem_user)
        const token = localStorage.getItem("token")
        fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authentication": `${token}`
            },
            body: JSON.stringify({
                message: mensagem_user
            })            
        }).then(async (r) => {
            const chatiaresposta = await r.json()
            console.log(chatiaresposta)
            const resposta = document.createElement("div");
            resposta.classList.add("mensagem");
            resposta.classList.add("chat");
            resposta.innerHTML = chatiaresposta.reply;
            
            conversa.appendChild(resposta);
            
        })
        
        console.log(token)
        document.getElementById("mensagem_input").value = ''
        conversa.scrollTop = conversa.scrollHeight
    })
})

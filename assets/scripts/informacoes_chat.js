addEventListener("DOMContentLoaded", () => {
    document
    .querySelector("form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = document.querySelector("form");
        const input = document.getElementById("mensagem_input");
        const button = document.querySelector('button[type="submit"]');
        const conversa = document.querySelector(".mensagens")
        const mensagem_user = input.value.trim();

        const mensagem = document.createElement("div")
        mensagem.classList.add("mensagem")
        mensagem.classList.add("chat")
        mensagem.innerHTML = "carregando..."
        conversa.appendChild(mensagem)
        
        button.disabled = true
        input.disabled = true;
        form.classList.add("disabled")

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
            conversa.removeChild(mensagem)
            const resposta = document.createElement("div");
            resposta.classList.add("mensagem");
            resposta.classList.add("chat");
            resposta.innerHTML = chatiaresposta.reply;
            
            button.disabled = false;
            input.disabled = false;
            form.classList.remove("disabled");

            conversa.appendChild(resposta);
            
        })
        
     
        document.getElementById("mensagem_input").value = ''
        conversa.scrollTop = conversa.scrollHeight
    })
})

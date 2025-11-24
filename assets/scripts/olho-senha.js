
  addEventListener("DOMContentLoaded", ()=> {
    document.querySelectorAll(".senha").forEach((senha) => {
      const olho = senha.querySelector(".olho")
      olho.addEventListener("click", () => {
        const olhoestafechado = olho.getAttribute("fechado")
        console.log("clicou")
        if (!!olhoestafechado) {
          olho.setAttribute("fechado", "")
          olho.src = olhoAberto
          senha.querySelector("input")?.setAttribute("type", "password")
          senha.querySelector("dd")?.setAttribute("type", "password")
        } else {
          olho.setAttribute("fechado", true)
          olho.src = olhoFechado
          senha.querySelector("input")?.setAttribute("type", "text")
          senha.querySelector("dd")?.setAttribute("type", "text")
        }

      })
    })
  })
  const olhoFechado = `./assets/img/close-eye-icon.svg`
  const olhoAberto = `./assets/img/eye-icon.svg`
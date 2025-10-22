
  addEventListener("DOMContentLoaded", ()=> {
    document.querySelectorAll(".senha").forEach((senha) => {
      const olho = senha.querySelector(".olho")
      olho.addEventListener("click", () => {
        const olhoestafechado = olho.getAttribute("fechado")
        
        if (!!olhoestafechado) {
          olho.setAttribute("fechado", "")
          olho.innerHTML = olhoAberto
          senha.querySelector("input").setAttribute("type", "password")
        } else {
          olho.setAttribute("fechado", true)
          olho.innerHTML = olhoFechado
          senha.querySelector("input").setAttribute("type", "text")
        }

      })
    })
  })
  const olhoFechado = `<img src="./assets/img/close-eye-icon.svg">`
  const olhoAberto = `<img src="./assets/img/eye-icon.svg">`
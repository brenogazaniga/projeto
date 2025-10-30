
document.addEventListener("DOMContentLoaded", () => {
    const aside = document.querySelector("aside")
    const hamburguer = document.querySelector(".hamburguer")

    hamburguer.addEventListener("click", () => {
        aside.classList.toggle("show")
    })
})

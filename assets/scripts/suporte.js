document.querySelectorAll(".botao").forEach((el) => {
  el.addEventListener("click", () => {
    el.closest("div").classList.toggle("maior")

    console.log(el.closest("div"))
  })
})
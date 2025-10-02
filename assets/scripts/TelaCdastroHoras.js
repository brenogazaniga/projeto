const inputs = [
  {
    input: document.getElementById("lazer"),
    output: document.getElementById("mostraLazer"),
  },
  {
    input: document.getElementById("sono"),
    output: document.getElementById("mostraSono"),
  },
  {
    input: document.getElementById("trabalho"),
    output: document.getElementById("mostraTrabalho"),
  },
];

inputs.forEach(({ input, output }) => {
  input.addEventListener("input", () => {
    output.textContent = input.value || "--:--";
  });
});

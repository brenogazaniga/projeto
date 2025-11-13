function formatar(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

async function pegardados() {
  const resposta = await fetch("/metricas/usuario", {
    method: "GET",
    headers: { Authentication: "Bearer " + localStorage.getItem("token") },
  });

  const dados = await resposta.json();
  return dados;
}

function mostrarDados(dados) {
  const ctx = document.getElementById("graficoPizza").getContext("2d");
  const graficoPizza = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Horas de Trabalho", "Horas de Lazer", "Horas de Sono"],
      datasets: [
        {
          data: dados,
          backgroundColor: ["#3294D0", "#0773B5", "#014976"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 30,
            boxHeight: 20,
            font: { size: 17, family: "Arial", weight: "bold" },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const valor = context.raw;
              return `${label}: ${formatar(valor)}`;
            },
          },
        },
      },
    },
  });
}

// 🎯 Função que calcula o índice de equilíbrio (0–100)
function calcularEquilibrio(horasTrabalho, horasLazer, horasSono) {
  const t = horasTrabalho / 60;
  const l = horasLazer / 60;
  const s = horasSono / 60;

  const pesoSono = 0.45;
  const pesoTrabalho = 0.35;
  const pesoLazer = 0.20;

  function calcularNota(valor, ideal, minSaudavel, maxSaudavel) {
    if (valor < minSaudavel) {
      const diff = minSaudavel - valor;
      return Math.max(0, 100 - diff * 20);
    } else if (valor > maxSaudavel) {
      const diff = valor - maxSaudavel;
      return Math.max(0, 100 - diff * 25);
    } else {
      const diffIdeal = Math.abs(valor - ideal);
      return Math.max(85, 100 - diffIdeal * 10);
    }
  }

  const notaSono = calcularNota(s, 8, 6.5, 9);
  const notaTrabalho = calcularNota(t, 8, 6, 9);
  const notaLazer = calcularNota(l, 4, 2, 6);

  let indice =
    notaSono * pesoSono + notaTrabalho * pesoTrabalho + notaLazer * pesoLazer;

  const total = t + l + s;
  if (total < 12) indice -= 15;
  if (total > 24) indice -= (total - 24) * 5;

  indice = Math.round(Math.min(100, Math.max(0, indice)));

  let feedback = "";

  if (s < 6) feedback += "Você está dormindo pouco. Isso prejudica sua recuperação mental e física. ";
  else if (s > 9) feedback += "Você está dormindo mais que o ideal, tente equilibrar com mais atividades ativas. ";

  if (t > 9) feedback += "Você está trabalhando demais, o que pode levar à fadiga e estresse. ";
  else if (t < 6) feedback += "Poucas horas de trabalho podem indicar falta de foco ou rotina irregular. ";

  if (l < 2) feedback += "Você quase não está reservando tempo para lazer — isso é essencial para o equilíbrio emocional. ";
  else if (l > 6) feedback += "Você está tendo muito lazer, tente equilibrar melhor com suas responsabilidades. ";

  if (feedback === "") feedback = "Excelente! Você está mantendo um estilo de vida equilibrado. Continue assim! 💪";

  return { indice, feedback };
}

// 🆕 Gera sugestões personalizadas de hobby e alimentação
function gerarSugestoes(indice) {
  let sugestoes = [];
  let comidas = [];

  if (indice < 40) {
    sugestoes = [
      "Tire um tempo para desconectar-se das telas.",
      "Experimente técnicas de respiração ou meditação guiada.",
      "Converse com um amigo de confiança ou terapeuta.",
      "Faça pausas curtas durante o trabalho para alongar e respirar.",
    ];
    comidas = [
      "Aveia e banana (aumentam serotonina).",
      "Peixes como salmão e sardinha (ricos em ômega-3).",
      "Castanhas e nozes (melhoram o foco e o humor).",
      "Chá de camomila ou maracujá para relaxar.",
    ];
  } else if (indice < 70) {
    sugestoes = [
      "Faça caminhadas leves ao ar livre após o trabalho.",
      "Reserve 30 minutos do dia para um hobby prazeroso.",
      "Tente manter horários fixos para dormir e acordar.",
      "Escreva em um diário sobre seu dia e gratidões.",
    ];
    comidas = [
      "Frutas cítricas (vitamina C ajuda no sistema nervoso).",
      "Arroz integral ou batata-doce (liberam energia aos poucos).",
      "Iogurte natural (bom para o intestino e humor).",
      "Chás calmantes como camomila ou erva-doce.",
    ];
  } else {
    sugestoes = [
      "Continue praticando seus hábitos saudáveis!",
      "Inclua uma atividade social ou voluntária na semana.",
      "Aprenda algo novo (instrumento, idioma ou arte).",
      "Aproveite o lazer sem culpa — você merece!",
    ];
    comidas = [
      "Frutas vermelhas (antioxidantes potentes).",
      "Abacate (ajuda a regular o cortisol).",
      "Peixes e vegetais verdes (ótimos para energia mental).",
      "Mantenha-se hidratado — beba bastante água!",
    ];
  }

  const sugestao = sugestoes[Math.floor(Math.random() * sugestoes.length)];
  const comida = comidas[Math.floor(Math.random() * comidas.length)];

  return { sugestao, comida };
}

// ======== BARRA DE EQUILÍBRIO =========
let currentValue = 0;
const bar = document.getElementById("bar");
const valueText = document.getElementById("valueText");
const statusText = document.getElementById("statusText");
const statusExplicaca = document.getElementById("explicacao-indice");

function updateStatus(value) {
  if (value <= 5) {
    statusText.textContent = "Crítico";
    bar.style.background = "linear-gradient(90deg, #f44336, #ff9800)";
  } else if (value <= 10) {
    statusText.textContent = "Muito baixo";
    bar.style.background = "linear-gradient(90deg, #ffeb3b, #ff9800)";
  } else if (value <= 15) {
    statusText.textContent = "A Melhorar";
    bar.style.background = "linear-gradient(90deg, #FE9E4A, #ff9800)";
  } else if (value <= 30) {
    statusText.textContent = "Baixo";
    bar.style.background = "linear-gradient(90deg, #FE9E4A, #ff9800)";
  } else if (value <= 50) {
    statusText.textContent = "Moderado";
    bar.style.background = "linear-gradient(90deg, #FFEB3B, #ff9800)";
  } else if (value <= 70) {
    statusText.textContent = "Bom";
    bar.style.background = "linear-gradient(90deg, #FFEB3B, #ff9800)";
  } else if (value <= 85) {
    statusText.textContent = "Muito bom!";
    bar.style.background = "linear-gradient(90deg, #BAF351, #ff9800)";
  } else {
    statusText.textContent = "Excelente!!";
    bar.style.background = "linear-gradient(90deg, #4CAF50, #8bc34a)";
  }
}

function animateBar(finalValue) {
  const step = 1;
  const delay = 25;
  const interval = setInterval(() => {
    if (currentValue >= finalValue) clearInterval(interval);
    else {
      currentValue += step;
      bar.style.width = currentValue + "%";
      valueText.textContent = currentValue + "%";
      updateStatus(currentValue);
    }
  }, delay);
}

// ======== EXECUÇÃO PRINCIPAL =========
pegardados().then((dados) => {
  const horas = dados[dados.length - 1];
  const { indice, feedback } = calcularEquilibrio(
    horas.horas_trabalho,
    horas.horas_lazer,
    horas.horas_sono
  );

  mostrarDados([horas.horas_trabalho, horas.horas_lazer, horas.horas_sono]);
  currentValue = 0;
  animateBar(indice);

  document.getElementById("explicacao-indice").textContent = feedback;

  // 🆕 Adiciona sugestões e alimentação
  const { sugestao, comida } = gerarSugestoes(indice);
  document.getElementById("sugestao").innerHTML = `💡 <strong>Sugestão:</strong> ${sugestao}`;
  document.getElementById("alimentacao").innerHTML = `🥗 <strong>Dica de Alimentação:</strong> ${comida}`;
});

// ======== MENSAGENS ALEATÓRIAS =========
const mensagens = [
  { sintoma: "Cansaço extremo e persistente.", causa: "Excesso de carga de trabalho e falta de descanso adequado.", explicacao: "Quando o corpo e a mente não têm tempo suficiente para se recuperar, o cansaço se torna constante — um dos primeiros sinais de alerta para o burnout." },
  { sintoma: "Dificuldade de concentração.", causa: "Estresse contínuo e sobrecarga mental.", explicacao: "A mente sobrecarregada perde a capacidade de focar em tarefas simples, tornando o trabalho mais difícil e frustrante." },
  { sintoma: "Irritabilidade e mudanças de humor.", causa: "Falta de equilíbrio entre vida pessoal e profissional.", explicacao: "Quando o tempo para relaxar é reduzido, o estresse se acumula e afeta diretamente as emoções e os relacionamentos." },
  { sintoma: "Insônia ou sono de má qualidade.", causa: "Preocupações excessivas com o trabalho e tensão constante.", explicacao: "A mente agitada impede o corpo de relaxar, dificultando o sono e acelerando o esgotamento físico e mental." },
  { sintoma: "Queda de produtividade.", causa: "Sobrecarga de tarefas e falta de motivação.", explicacao: "O cansaço crônico reduz o rendimento e aumenta a sensação de ineficiência, o que reforça ainda mais o estresse." },
  { sintoma: "Dores de cabeça e tensão muscular.", causa: "Ansiedade e acúmulo de estresse.", explicacao: "O corpo reage fisicamente ao excesso de pressão, resultando em dores recorrentes e sensação de rigidez." },
  { sintoma: "Sentimento de fracasso ou impotência.", causa: "Exigência pessoal elevada e falta de reconhecimento.", explicacao: "A busca constante por resultados sem retorno emocional leva à desmotivação e à perda de autoestima." },
  { sintoma: "Falta de interesse em atividades que antes eram prazerosas.", causa: "Exaustão emocional e distanciamento afetivo.", explicacao: "Quando a energia mental está baixa, até os momentos de lazer perdem o sentido, sinalizando um desgaste profundo." },
  { sintoma: "Dificuldade em tomar decisões.", causa: "Sobrecarga cognitiva e falta de descanso mental.", explicacao: "O cérebro esgotado perde clareza e agilidade para avaliar situações, gerando insegurança e indecisão." },
  { sintoma: "Isolamento social.", causa: "Cansaço extremo e desejo de evitar interações.", explicacao: "A exaustão leva ao afastamento de amigos e familiares, o que agrava a sensação de solidão e aumenta o risco de burnout." },
];

const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
document.getElementById("sintoma").innerHTML = `<strong>Sintoma:</strong> ${mensagem.sintoma}`;
document.getElementById("causa").innerHTML = `<strong>Causa:</strong> ${mensagem.causa}`;
document.getElementById("explicacao").innerHTML = mensagem.explicacao;

// 🌿 Frases motivacionais mais longas e inspiradoras
const frasesMotivacionais = [
  "Respire fundo. A vida não é uma corrida, é uma caminhada. Dê o seu ritmo ao caminho e aprecie o processo, mesmo nos dias mais lentos.",
  "Nem sempre o progresso é visível. Às vezes, o simples fato de continuar tentando já é um ato de coragem e crescimento.",
  "Você não precisa ser produtivo o tempo todo. Cuidar de si mesmo, descansar e respirar também são formas de evoluir.",
  "A calma é uma força. Em meio ao caos, quem mantém o equilíbrio conquista mais do que quem se apressa.",
  "Você não está atrasado. Está exatamente no ponto do seu próprio tempo. Aprenda a respeitar o seu ritmo.",
  "Ser gentil consigo mesmo é uma das formas mais poderosas de transformar a sua vida — e o seu mundo ao redor.",
  "Tudo o que você busca lá fora começa dentro de você. Cuide da mente, e o resto naturalmente encontra o seu lugar.",
  "Permita-se desacelerar. O descanso não é perda de tempo, é recarregar a energia para continuar com mais clareza e propósito.",
  "Não há problema em pedir ajuda, em pausar ou em recomeçar. O equilíbrio não é perfeição, é honestidade com o que você sente.",
  "Mesmo nos dias difíceis, lembre-se: você já superou muito para chegar até aqui. Isso por si só é motivo de orgulho.",
  "Sua paz interior é seu maior patrimônio. Proteja-a, mesmo que isso signifique dizer 'não' a coisas que tiram sua energia.",
  "Pequenas atitudes de autocuidado feitas com constância valem mais do que grandes mudanças feitas sem amor por si mesmo.",
];

// Escolhe uma frase aleatória
const fraseAleatoria = frasesMotivacionais[Math.floor(Math.random() * frasesMotivacionais.length)];

// Exibe no HTML
document.getElementById("motivacional").innerHTML = ` <em>${fraseAleatoria}</em>`;

// Animação suave na entrada da frase
setTimeout(() => {
  document.getElementById("motivacional").classList.add("show");
}, 400);

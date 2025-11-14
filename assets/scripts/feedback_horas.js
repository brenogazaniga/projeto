// Nova função: carrega previsões de produtividade
async function carregarPrevisaoProdutividade() {
  const userId = getCookie("userId");
  if (!userId) {
    document.querySelector(".previsao").textContent =
      "Faça login para ver a previsão de produtividade.";
    return;
  }

  try {
    const resposta = await fetch(
      `/api/horas?userId=${userId}`
    );
    if (!resposta.ok) throw new Error("Erro ao carregar dados");

    const dados = await resposta.json();
    const previsao = gerarPrevisaoProdutividade(dados);
    document.querySelector(".previsao").innerHTML = previsao;
  } catch (error) {
    document.querySelector(".previsao").textContent =
      "Erro ao carregar previsão: " + error.message;
  }
}

// Função auxiliar: gera previsão baseada nas horas
function gerarPrevisaoProdutividade(dados) {
  const horas_sono = dados.horas_sono / 60;
  const horas_trabalho = dados.horas_trabalho / 60;
  const horas_lazer = dados.horas_lazer / 60;

  let previsao = "Com base nas suas horas registradas, ";

  // Lógica de previsão baseada em sono
  if (horas_sono < 7) {
    previsao +=
      "amanhã você estará muito cansado e pode ter dificuldade para se concentrar no trabalho ou estudos. Considere priorizar mais descanso hoje à noite.";
  } else if (horas_sono >= 7 && horas_sono <= 9) {
    previsao +=
      "amanhã você acordará energizado e pronto para uma produtividade alta. Mantenha essa rotina!";
  } else {
    previsao +=
      "amanhã você pode se sentir preguiçoso ou com excesso de energia acumulada. Tente equilibrar com atividades leves.";
  }

  // Adicionar impacto do trabalho
  if (horas_trabalho < 4) {
    previsao +=
      " Como teve pouco tempo de trabalho hoje, amanhã pode ser um dia de recuperação e planejamento.";
  } else if (horas_trabalho >= 4 && horas_trabalho <= 8) {
    previsao +=
      " Seu equilíbrio de trabalho parece bom, então amanhã deve ser produtivo sem exaustão.";
  } else {
    previsao +=
      " Com tanto trabalho hoje, amanhã você pode sentir fadiga e precisar de pausas extras.";
  }

  // Adicionar impacto do lazer
  if (horas_lazer < 1) {
    previsao +=
      " A falta de lazer pode causar estresse, então reserve tempo para relaxar amanhã.";
  } else if (horas_lazer >= 1 && horas_lazer <= 3) {
    previsao +=
      " Seu tempo de lazer está equilibrado, ajudando na recuperação mental para amanhã.";
  } else {
    previsao +=
      " Muito lazer pode desequilibrar sua rotina, então foque em responsabilidades amanhã.";
  }

  return previsao;
}

async function carregarFeedbackHoras() {
  const userId = getCookie("userId");
  if (!userId) {
    document.querySelector(".recomendacoes").textContent =
      "Erro: Usuário não logado. Faça login para ver o feedback.";
    return;
  }

  try {
    const resposta = await fetch(
      `/api/horas?userId=${userId}`
    );
    if (!resposta.ok) {
      throw new Error("Erro ao carregar dados");
    }

    const dados = await resposta.json();

    const mensagens = gerarMensagensFeedback(dados);

    document.querySelector(".recomendacoes").innerHTML = mensagens;
  } catch (error) {
    document.querySelector(".recomendacoes").textContent =
      "Erro ao carregar feedback: " + error.message;
  }
}

function gerarMensagensFeedback(dados) {
  const horas_sono = dados.horas_sono / 60;
  const horas_trabalho = dados.horas_trabalho / 60;
  const horas_lazer = dados.horas_lazer / 60;

  let mensagensHTML = "<ul>";

  mensagensHTML +=
    "<li><strong>Sono:</strong> " +
    obterMensagem("sono", horas_sono) +
    "<br><br></li>"; // Adicionado <br><br> para espaço vazio

  mensagensHTML +=
    "<li><strong>Trabalho:</strong> " +
    obterMensagem("trabalho", horas_trabalho) +
    "<br><br></li>"; // Adicionado <br><br> para espaço vazio

  mensagensHTML +=
    "<li><strong>Lazer:</strong> " +
    obterMensagem("lazer", horas_lazer) +
    "<br><br></li>"; // Adicionado <br><br> para espaço vazio

  mensagensHTML += "</ul>";
  return mensagensHTML;
}

function obterMensagem(tipo, horas) {
  if (isNaN(horas) || horas < 0) return "Dados inválidos.";

  if (tipo === "sono") {
    if (horas < 7)
      return "Você dormiu menos do que o ideal. Tente ajustar sua rotina para garantir de 7 a 9 horas de sono por noite. Um bom descanso é essencial para manter o foco e o bom humor durante o dia.";
    else if (horas >= 7 && horas <= 9)
      return "Ótimo! Sua rotina de sono está dentro do ideal. Continue priorizando o descanso e evite telas e cafeína antes de dormir para garantir uma boa qualidade de sono.";
    else
      return "Dormir demais também pode indicar cansaço acumulado ou falta de energia. Observe como você se sente e tente manter uma rotina de sono mais regular.";
  } else if (tipo === "trabalho") {
    if (horas < 4)
      return "Você teve pouco tempo de produtividade hoje. Tudo bem descansar, mas tente manter uma rotina de trabalho consistente para alcançar seus objetivos.";
    else if (horas >= 4 && horas <= 8)
      return "Excelente equilíbrio! Você dedicou um bom tempo ao trabalho sem exagerar. Lembre-se de fazer pequenas pausas e cuidar da sua saúde mental.";
    else if (horas > 8 && horas < 16)
      return "Cuidado com o excesso de trabalho! Tente equilibrar com momentos de lazer e descanso. Trabalhar muito pode reduzir sua produtividade a longo prazo.";
    else
      return "Uau! Isso é tempo demais de trabalho. Seu corpo e sua mente precisam de pausas. Descanse, respire e reserve tempo para você — isso também é produtividade.";
  } else if (tipo === "lazer") {
    if (horas < 1)
      return "Você quase não teve tempo de lazer hoje. Separar um momento para si mesmo é importante para aliviar o estresse e manter o equilíbrio mental.";
    else if (horas >= 1 && horas <= 3)
      return "Perfeito! Você dedicou um bom tempo ao lazer sem exagerar. Continue equilibrando suas obrigações com atividades que te fazem bem.";
    else
      return "Cuidado para o lazer não ocupar tempo demais do seu dia. Tente equilibrar melhor entre diversão, descanso e responsabilidades.";
  }
  return "Tipo desconhecido.";
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

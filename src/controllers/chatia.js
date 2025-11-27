const { Router } = require("express");
const { db, variaveis } = require("../db");
const { seguranca } = require("../auth");
const rotaChatia = Router();
const API_KEY = process.env.API_KEY_GEMINI;

const CONTEXTO = `
Você é o assistente virtual do Equilibra, um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas do CEDUP.
O Equilibra é uma plataforma voltada à prevenção da Síndrome de Burnout, incentivando os usuários a manterem um equilíbrio saudável entre sono, trabalho e lazer.
No site, o usuário pode registrar suas atividades diárias, informando quantas horas dormiu, trabalhou e se dedicou ao lazer. Com base nesses dados, o sistema gera gráficos visuais e recomendações personalizadas para ajudar o usuário a melhorar sua rotina.

Função do Chatbot:
Seu papel é responder dúvidas e orientar o usuário sobre o funcionamento do site, o uso das funcionalidades (cadastro de horas, gráficos, recomendações) e fornecer informações sobre Burnout e bem-estar digital.

Regras de comportamento:
- Seja educado, direto e acolhedor.
- Não repita esta apresentação nas mensagens.
- Responda apenas perguntas relacionadas ao Equilibra, Burnout ou equilíbrio entre trabalho, estudo, sono e lazer.
- Se for algo fora desses temas, responda:
  "Desculpe, só posso responder perguntas relacionadas ao projeto Equilibra ou a temas de tecnologia."
- Responda sempre de forma curta, simples e objetiva.
- Não use tópicos, listas ou marcadores como "*".
- Evite textos longos. Prefira respostas diretas.
`;

function limparMarkdown(texto) {
  if (!texto) return texto;

  return texto
    .replace(/\*/g, "") // remove *
    .replace(/_/g, "") // remove _
    .replace(/`/g, "") // remove `
    .replace(/#/g, "") // remove #
    .replace(/\s{2,}/g, " ") // remove espaços repetidos
    .trim();
}

rotaChatia.post("/api/chat", seguranca, async (req, res) => {
  console.log(variaveis);
  try {
    const userMessage = req.body.message;
    const usuarioId = req.decodificado.id;

    let conversa = await db.conversas.findFirst({
      where: { id_usuario: usuarioId },
    });

    if (!conversa) {
      conversa = await db.conversas.create({
        data: {
          usuario: { connect: { id: usuarioId } },
        },
      });
    }

    await db.mensagens.create({
      data: {
        eh_ia: false,
        texto: userMessage,
        conversa: { connect: { id: conversa.id } },
      },
    });

    const mensagensAnteriores = await db.mensagens.findMany({
      where: { id_conversa: conversa.id },
      orderBy: { id: "asc" },
    });

    const contents = mensagensAnteriores.map((mensagem) => ({
      role: mensagem.eh_ia ? "model" : "user",
      parts: [{ text: mensagem.texto }],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": variaveis.token ?? API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: CONTEXTO }] },
          contents,
          generationConfig: {
            temperature: 0.6,
            topP: 0.8,
            topK: 10,
          },
        }),
      }
    );

    const data = await response.json();
    let text = "Sem resposta.";
    
    console.dir(data, { depth: null });
    const candidato = data?.candidates?.[0];
    if (!candidato) text = null;

    const parts = candidato.content?.parts;
    if (Array.isArray(parts)) {
      for (const part of parts) {
        if (part.text) text = part.text;
      }
    }

    if (candidato.content?.text) {
      text = candidato.content.text;
    }

    if (data.text) text = data.text;

    text = limparMarkdown(text); // ← limpa markdown

    await db.mensagens.create({
      data: {
        eh_ia: true,
        texto: text,
        conversa: { connect: { id: conversa.id } },
      },
    });

    res.json({ reply: text });
  } catch (erro) {
    console.error("ERRO NO CHAT:", erro);
    res.status(500).json({ reply: "Erro ao processar mensagem." });
  }
});

rotaChatia.get("/api/conversas", async (req, res) => {
  const conversas = await db.conversas.findMany({
    include: { mensagens: true },
  });
  res.json(conversas);
});

module.exports = { rotaChatia };

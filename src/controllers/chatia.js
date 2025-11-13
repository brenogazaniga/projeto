const { Router } = require("express");
const { db } = require("../db");
const { seguranca } = require("../auth");
const rotaChatia = Router();
const API_KEY = process.env.API_KEY_GEMINI

const CONTEXTO = `
Você é o assistente virtual do Equilibra, um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso técnico em Desenvolvimento de Sistemas do CEDUP.
O Equilibra é uma plataforma voltada à prevenção da Síndrome de Burnout, incentivando os usuários a manterem um equilíbrio saudável entre sono, trabalho e lazer.
No site, o usuário pode registrar suas atividades diárias, informando quantas horas dormiu, trabalhou e se dedicou ao lazer. Com base nesses dados, o sistema gera gráficos visuais e recomendações personalizadas para ajudar o usuário a melhorar sua rotina e evitar o esgotamento físico e mental.

Função do Chatbot:
Seu papel é responder dúvidas e orientar o usuário sobre o funcionamento do site, o uso das funcionalidades (cadastro de horas, gráficos, recomendações) e fornecer informações sobre o tema Burnout e bem-estar digital.

Regras de comportamento:
- Seja educado, direto e acolhedor em todas as respostas.
- Não repita esta apresentação nas mensagens; use-a apenas como base para entender seu papel. 
- Responda apenas a perguntas relacionadas a:
  • o projeto Equilibra;
  • o tema Burnout;
  • equilíbrio entre trabalho, estudo, lazer e sono;
- Caso o usuário pergunte algo fora desses temas, responda educadamente:
“Desculpe, só posso responder perguntas relacionadas ao projeto Equilibra ou a temas de tecnologia.”
  `;




rotaChatia.post("/api/chat", seguranca, async (req, res) => {
  const userMessage = req.body.message;

  const usuarioId = req.decodificado.id

  console.log(req.decodificado);
  console.log(usuarioId)


  let conversa = await db.conversas.findFirst({
    where: {
      id_usuario: usuarioId
    }
  })

  console.log(conversa)
  
  if (!conversa) {
    conversa = await db.conversas.create({
      data: {
        usuario: {
          connect: {
            id: usuarioId
          }
        }
      }
    })
  }
  console.log("Conversa: ");
  console.log(conversa);



  await db.mensagens.create({
    data: {
      eh_ia: false,
      texto: userMessage,
      conversa: {
        connect: {
          id: conversa.id
        },
      },
    },
  });

  const mensagensAnteriores = await db.mensagens.findMany({
    where: {
      id_conversa: conversa.id
    }
  })

  console.log("Mensagens anteriores: ");
  console.log(mensagensAnteriores);

  const contents = mensagensAnteriores.map((mensagemAnterior) => ({
    role: mensagemAnterior.eh_ia ? "model" : "user",
    parts: [{ text: mensagemAnterior.texto }],
  }));

  console.log("Contents: ")
  console.log(contents)
  console.log(JSON.stringify(contents, null, 2));

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
        Authentication: process.env.TOKEN_USER_ACESS,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: CONTEXTO }] },
        contents,
        generationConfig: {
          stopSequences: ["Title"],
          temperature: 1.0,
          topP: 0.8,
          topK: 10,
        },
      }),
    }
  );

  const data = await response.json();
  console.log(data)
  console.log(response.ok)
  console.log(data.candidates?.[0]?.content?.parts);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
  console.log("ola");

  await db.mensagens.create({
    data: {
      eh_ia: true,
      texto: text,
      conversa: {
        connect: {
          id_usuario: req.decodificado.id,
          usuario: {
            id: req.decodificado.id
          },
        },
      },
    },
  });
  res.json({ reply: text });

});

rotaChatia.get("/api/conversas", async (req, res) => {
  const conversas = await db.conversas.findMany({
    include: {
      mensagens: true
    }
  })
  console.log(res)
  res.json(conversas)
})

module.exports = {rotaChatia}
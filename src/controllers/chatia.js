const { Router } = require("express");
const { db } = require("../db");
const { seguranca } = require("../auth");
const rotaChatia = Router();
const API_KEY = "AIzaSyB9WWATTL7ZDSsdculUxvPPgoBvAUT0iA8"

const CONTEXTO = `
Você é um assistente virtual do site Equilibra, equilibra é um projeto desenvolvido como TCC do curso tecnico de desenvlvimento de sistemas do cedup,
o site equilibra é um site visado a prevenção da sindrome de burnout. O usuario pode cadastrar o que ele fez no dia. Ele cadastra horas de sono, trabalho e lazer.
Com base nessas informações, o site cria cria gráficos visuais, recomedações para que o usuario melhore sua rotina   
Responda APENAS perguntas relacionadas a esses temas.
Se o usuário perguntar algo fora disso, diga educadamente que só pode falar sobre tecnologia.
`



rotaChatia.post("/api/chat", seguranca, async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" ,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
        "Authentication": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzYwOTc4ODk5fQ.UZZjNXiarRrJ9qVDmeyEQ-tJI0Z7EKxK-2q6QXj0wbo"
    },
      body: JSON.stringify({
        
        "system_instruction": { parts: [{ text: CONTEXTO }] },
        "generationConfig": {
          "stopSequences": [
            "Title"
          ],
          "temperature": 1.0,
          "topP": 0.8,
          "topK": 10
        },
        contents: [
          { parts: [{ text: userMessage }] }
        ],
      }),
    }
  );
  const data = await response.json();
  console.log(data)
  console.log(response.ok)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
  console.log("ola");
  
  const conversa = await db.conversas.findFirst({
    where: {
      id_usuario: req.decodificado.id
    }
  })

  if (!conversa) {
    await db.conversas.create({
      data: {
        usuario: {
          connect: {
            id: req.decodificado.id
          }
        }
      }
    })
  }
  
  await db.mensagens.create({
    data: {
      eh_ia: false,
      texto: userMessage,
      conversa: {
        connect: {
          id_usuario: req.decodificado.id,
          usuario: {
            id: req.decodificado.id,
          },
        },
      },
    },
  });

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
  await db.mensagens

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
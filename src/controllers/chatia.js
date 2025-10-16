const { Router } = require("express");
const { db } = require("../db");
const rotaChatia = Router();
const API_KEY = "AIzaSyDgkFS61goKQXFqMfX1xLZ7FrdCx-Cx5Fs"

const CONTEXTO = `
Você é um assistente virtual do site Equilibra, equilibra é um projeto desenvolvido como TCC do curso tecnico de desenvlvimento de sistemas do cedup,
o site equilibra é um site visado a prevenção da sindrome de burnout. O usuario pode cadastrar o que ele fez no dia. Ele cadastra horas de sono, trabalho e lazer.
Com base nessas informações, o site cria cria gráficos visuais, recomedações para que o usuario melhore sua rotina   
Responda APENAS perguntas relacionadas a esses temas.
Se o usuário perguntar algo fora disso, diga educadamente que só pode falar sobre tecnologia.
`

rotaChatia.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

console.log("OIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" ,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
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
  res.json({ reply: text });
  await db.mensagens

});

module.exports = {rotaChatia}
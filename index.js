const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieparser = require("cookie-parser");

const { rotaUsuario } = require("./src/controllers/usuario");
const { rotaMetrica } = require("./src/controllers/metricas");
const { rotaPaginas } = require("./src/controllers/paginas");
const { rotaLogin } = require("./src/controllers/login");
const { rotaChatia } = require("./src/controllers/chatia");

const { db } = require("./src/db");

const server = express();
server.use(express.static(path.join(__dirname, "assets")));
server.use("/assets", express.static("assets"));
server.use(cors());
server.use(cookieparser());
server.use(express.json());
server.use(express.static(path.join(__dirname, "./pages/TelaCadastro")));
server.use(express.static(path.join(__dirname, "./pages/TelaDeLogin")));
server.use(rotaUsuario);
server.use(rotaMetrica);
server.use(rotaPaginas);
server.use(rotaLogin);
server.use(rotaChatia);
server.get("/teste", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages/oauth.html"));
    
});

// NOVA ROTA: Buscar horas de um usuário (adicione isso)
server.get("/api/horas", async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) {
    return res.status(400).json({ error: "userId é obrigatório" });
  }

  try {
    const metrica = await db.metricas_diarias.findFirst({
      where: { id_usuario: userId },
      orderBy: { timestamp: "desc" },
    });

    if (!metrica) {
      return res
        .status(404)
        .json({ error: "Nenhuma métrica encontrada para este usuário" });
    }

    res.json({
      horas_trabalho: metrica.horas_trabalho,
      horas_lazer: metrica.horas_lazer,
      horas_sono: metrica.horas_sono,
    });
  } catch (error) {
    console.error("Erro ao buscar horas:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

server.get("/teste", (req, res)=>{
  return res.json(200)
})

server.listen(3000, () => console.log("> Rodando"));

db.usuario.findMany().then((usuarios) => console.log(usuarios));

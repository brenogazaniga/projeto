const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieparser = require("cookie-parser");

const { rotaUsuario } = require("./controllers/usuario");
const { rotaMetrica } = require("./controllers/metricas");
const { rotaPaginas } = require("./controllers/paginas");
const { rotaLogin } = require("./controllers/login");
const { rotaChatia } = require("./controllers/chatia");

const { db } = require("./db");

const server = express();
server.use(express.static(path.join(__dirname, "assets")));
server.use("/assets", express.static("assets"));
server.use(cors());
server.use(cookieparser());
server.use(express.json());
server.use(express.static(path.join(__dirname, "../pages/TelaCadastro")));
server.use(express.static(path.join(__dirname, "../pages/TelaDeLogin")));
server.use(rotaUsuario);
server.use(rotaMetrica);
server.use(rotaPaginas);
server.use(rotaLogin);
server.use(rotaChatia);

// NOVA ROTA: Buscar horas de um usuário (ex: GET /api/horas?userId=1)
server.get("/api/horas", async (req, res) => {
  const userId = parseInt(req.query.userId); // Pega o ID do usuário da URL
  if (!userId) {
    return res.status(400).json({ error: "userId é obrigatório" });
  }

  try {
    // Busca a métrica mais recente do usuário (ajuste se for em outra tabela)
    const metrica = await db.metrica.findFirst({
      where: { userId: userId },
      orderBy: { id: "desc" }, // Pega o último registro (assumindo que há um campo 'id')
    });

    if (!metrica) {
      return res
        .status(404)
        .json({ error: "Nenhuma métrica encontrada para este usuário" });
    }

    // Retorna as horas em JSON
    res.json({
      horas_trabalhadas: metrica.horas_trabalhadas,
      horas_lazer: metrica.horas_lazer,
      horas_sono: metrica.horas_sono,
    });
  } catch (error) {
    console.error("Erro ao buscar horas:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

server.listen(3000, () => console.log("> Rodando"));

// Teste do banco (opcional, remove depois)
db.usuario.findMany().then((usuarios) => console.log(usuarios));

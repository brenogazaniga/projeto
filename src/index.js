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
server.get("/teste", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/oauth.html"));
    
});

server.listen(3000, () => console.log("> Rodando"));

db.usuario.findMany ().then(usuarios => console.log(usuarios))

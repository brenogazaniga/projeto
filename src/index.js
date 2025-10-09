const express = require("express");
const path = require("path");
const cors = require("cors");

const { rotaUsuario } = require("./controllers/usuario");
const { rotaMetrica } = require("./controllers/metricas");
const { rotaPaginas } = require("./controllers/paginas");
const { rotaChatia } = require("./controllers/chatia");

const server = express();
server.use(express.static(path.join(__dirname, "assets")));
server.use("/assets", express.static("assets"));
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "../pages/TelaCadastro")));
server.use(rotaUsuario);
server.use(rotaMetrica);
server.use(rotaPaginas);
server.use(rotaChatia);
server.listen(3001, () => console.log("> Rodando"));

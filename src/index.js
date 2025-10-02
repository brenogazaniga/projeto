const express = require("express");
const path = require("path");

const { rotaUsuario } = require("./controllers/usuario");
const { rotaMetrica } = require("./controllers/metricas");
const { rotaPaginas } = require("./controllers/paginas");

const server = express();
server.use(express.static(path.join(__dirname, "assets")));
server.use("/assets", express.static("assets"));
server.use(express.json());
server.use(rotaUsuario);
server.use(rotaMetrica);
server.use(rotaPaginas);

server.listen(3001, () => console.log("> Rodando"));

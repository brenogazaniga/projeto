const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieparser = require("cookie-parser");

const { rotaUsuario } = require("./controllers/usuario");
const { rotaMetrica } = require("./controllers/metricas");
const { rotaPaginas } = require("./controllers/paginas");
const { rotaLogin } = require("./controllers/login");
const { rotaChatia } = require("./controllers/chatia");

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

<<<<<<< HEAD
server.listen(3000, () => console.log("> Rodando"));
=======
server.use(rotaChatia);
server.listen(3001, () => console.log("> Rodando"));
>>>>>>> cc2885c073a183a9ab782132c0977c17b2cab446

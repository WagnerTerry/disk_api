const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
//const bodyParser = require("body-parser"); agora pode usar o express.json()

app.use(cors());
app.use(express.json()); // json de entrada no body

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }

  next();
});

const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");
const rotaUsuarios = require("./routes/usuarios");
const rotaPizzas = require("./routes/pizzas");
const rotaClientes = require("./routes/clientes");

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));


app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);
app.use("/usuarios", rotaUsuarios);
app.use("/pizzas", rotaPizzas);
app.use("/clientes", rotaClientes);

app.use((req, res, next) => {
  const erro = new Error("Não encontrado");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;

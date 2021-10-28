const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

const PedidosController = require("../controllers/pedidos-controller");

router.get("/", PedidosController.getPedidos);

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "select * from produtos where id_produto = ?",
      [req.body.id_produto],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error });
        }
        if (result.length === 0) {
          return res.status(404).send({
            mensagem: "Produto não encontrado",
          });
        }

        conn.query(
          "insert into pedidos (id_produto, quantidade) values (?,?)",
          [req.body.id_produto, req.body.quantidade],
          (error, result, fields) => {
            conn.release();
            if (error) {
              return res.status(500).send({ error: error });
            }
            const response = {
              mensagem: "O pedido foi criado",
              pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                  tipo: "GET",
                  descricao: "Retorna todos os pedidos",
                  url: "http://localhost:3000/pedidos",
                },
              },
            };
            res.status(201).send({
              response,
            });
          }
        );
      }
    );
  });
});

router.get("/:id_pedido", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "select * from pedidos where id_pedido = ?;",
      [req.params.id_pedido],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error });
        }
        if (result.length === 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado pedido com esse ID",
          });
        }
        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "delete from pedidos where id_pedido = ?",
      [req.body.id_pedido],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: "Pedido removido com sucesso",
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;

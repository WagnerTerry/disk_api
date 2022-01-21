const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
    select * from Caixa
    `,
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          quantidade_pedido: results.length,
          fluxo_caixa: results.map((caixa) => {
            return {
              codigo_pedido: caixa.codigo_pedido,
              data: caixa.datas,
              hora: caixa.hora,
              cliente: caixa.nome_cliente,
              pizza: caixa.nome_pizza,
              bairro: caixa.bairro,
              entregador: caixa.entregador,
              situacao: caixa.situacao,
              valor: caixa.valor,
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
      insert into Caixa
      (datas, hora, nome_cliente, nome_pizza, bairro, entregador, situacao, valor)
      values (?,?,?,?,?,?,?,?)
      `,
      [
        req.body.datas,
        req.body.hora,
        req.body.nome_cliente,
        req.body.nome_pizza,
        req.body.bairro,
        req.body.entregador,
        req.body.situacao,
        req.body.valor,
      ],
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ response });
        }
        const response = {
          mensagem: "Caixa salva com sucesso",
          registroCadastrado: {
            codigo_caixa: results.insertId,
            datas: req.body.datas,
            hora: req.body.hora,
            nome_cliente: req.body.nome_cliente,
            nome_pizza: req.body.nome_pizza,
            bairro: req.body.bairro,
            entregador: req.body.entregador,
            situacao: req.body.situacao,
            valor: req.body.valor,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

module.exports = router;

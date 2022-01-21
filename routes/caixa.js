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
        return res.status(200).send( response );
      }
    );
  });
});

module.exports = router;

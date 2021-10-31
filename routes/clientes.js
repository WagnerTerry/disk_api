const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(`select * from Clientes`, (error, results) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error });
      }
      const response = {
        quantidade_cliente: results.length,
        clientes: results.map((cliente) => {
          return {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            cep: cliente.cep,
            logradouro: cliente.logradouro,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            observacoes: cliente.observacoes,
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

module.exports = router;

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
            codigo_cliente: cliente.codigo_cliente,
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

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `insert into Clientes
      (nome, telefone, cep, logradouro, bairro, cidade, observacoes)
      values (?,?,?,?,?,?,?);
      `,
      [
        req.body.nome,
        req.body.telefone,
        req.body.cep,
        req.body.logradouro,
        req.body.bairro,
        req.body.cidade,
        req.body.observacoes,
      ],
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: "Cliente cadastrado com sucesso!",
          clienteCadastrado: {
            codigo_cliente: results.insertId,
            nome: req.body.nome,
            telefone: req.body.telefone,
            cep: req.body.cep,
            logradouro: req.body.logradouro,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            observacoes: req.body.observacoes,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

router.put("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
    UPDATE Clientes SET nome = ?, telefone = ?, cep = ?,
    logradouro = ?, bairro = ?, cidade = ?, observacoes = ? 
    WHERE codigo_cliente = ?
    `,
      [
        req.body.nome,
        req.body.telefone,
        req.body.cep,
        req.body.logradouro,
        req.body.bairro,
        req.body.cidade,
        req.body.observacoes,
        req.body.codigo_cliente,
      ],
      (error, results, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }

        const response = {
          mensagem: "Cliente atualizado com sucesso",
          clienteAtualizado: {
            codigo_cliente: req.body.codigo_cliente,
            nome: req.body.nome,
            telefone: req.body.telefone,
            cep: req.body.cep,
            logradouro: req.body.logradouro,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            observacoes: req.body.observacoes,
          },
        };

        return res.status(202).send(response);
      }
    );
  });
});

router.delete("/:codigo_cliente", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
    delete from Clientes where codigo_cliente = ?
    `,
      [req.params.codigo_cliente],
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: "Cliente excluído com sucesso",
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;

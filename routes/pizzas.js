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
    select 
      Pizzas.codigo_pizza, Pizzas.nome, 
      Grupos.codigo_grupo, Grupos.nome_grupo
    from Pizzas
    inner join Grupos
    on Grupos.codigo_grupo = Pizzas.codigo_grupo 
     ;`,
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          total_pizzas: results.length,
          pizzas: results.map((pizza) => {
            return {
              codigo_pizza: pizza.codigo_pizza,
              nome: pizza.nome,
              codigo_grupo: pizza.codigo_grupo,
              nome_grupo: pizza.nome_grupo,
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
      `insert into Pizzas (nome, codigo_grupo) values (?,?)`,
      [req.body.nome, req.body.codigo_grupo],
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }

        const response = {
          mensagem: "Pizza inserida com sucesso",
          produtoCriado: {
            codigo_pizza: results.insertId,
            nome: req.body.nome,
            codigo_grupo: req.body.codigo_grupo,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

router.get("/grupos", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(`select * from Grupos;`, (error, results, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error });
      }
      const response = {
        total_grupos: results.length,
        grupos: results.map((grupo) => {
          return {
            codigo_grupo: grupo.codigo_grupo,
            nome_grupo: grupo.nome_grupo,
            preco_pequena: grupo.preco_pequena,
            preco_grande: grupo.preco_grande,
            preco_familia: grupo.preco_familia,
            preco_gigante: grupo.preco_gigante,
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

module.exports = router;

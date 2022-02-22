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
      Pizzas.codigo_pizza, Pizzas.nome_pizza, Pizzas.ativo,
      Grupos.codigo_grupo, Grupos.nome_grupo, Grupos.preco_pequena,
      Grupos.preco_grande, Grupos.preco_familia, Grupos.preco_gigante
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
              nome_pizza: pizza.nome_pizza,
              ativo: pizza.ativo,
              codigo_grupo: pizza.codigo_grupo,
              nome_grupo: pizza.nome_grupo,
              preco_pequena: pizza.preco_pequena,
              preco_grande: pizza.preco_grande,
              preco_familia: pizza.preco_familia,
              preco_gigante: pizza.preco_gigante,
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
      `insert into Pizzas (nome_pizza, ativo, codigo_grupo) values (?,?,?)`,
      [req.body.nome_pizza, req.body.ativo, req.body.codigo_grupo],
      (error, results) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }

        const response = {
          mensagem: "Pizza inserida com sucesso",
          produtoCriado: {
            codigo_pizza: results.insertId,
            nome_pizza: req.body.nome_pizza,
            ativo: req.body.ativo,
            codigo_grupo: req.body.codigo_grupo,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

router.delete(`/:codigo_pizza`, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
      delete from Pizzas where codigo_pizza = ?
    `,
      [req.params.codigo_pizza],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: "Pizza excluída com sucesso",
        };

        return res.status(202).send(response);
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

router.post("/grupos", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
    insert into Grupos (nome_grupo, preco_pequena, preco_grande, preco_familia, preco_gigante, codigo_grupo)
    values (?,?,?,?,?,?)
    `,
      [
        req.body.nome_grupo,
        req.body.preco_pequena,
        req.body.preco_grande,
        req.body.preco_familia,
        req.body.preco_gigante,
        req.body.codigo_grupo,
      ],
      (error, results, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }

        const response = {
          mensagem: "Grupo cadastrado com sucesso",
          grupoCriado: {
            codigo_grupo: results.insertId,
            nome_grupo: req.body.nome_grupo,
            preco_pequena: req.body.preco_pequena,
            preco_grande: req.body.grande,
            preco_familia: req.body.preco_familia,
            preco_gigante: req.body.preco_gigante,
          },
        };

        return res.status(201).send(response);
      }
    );
  });
});

router.delete("/grupos/:codigo_grupo", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
      delete from Grupos where codigo_grupo = ?
    `,
      [req.params.codigo_grupo],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error });
        }
        const response = {
          mensagem: "Grupo excluído com sucesso",
        };

        return res.status(202).send(response);
      }
    );
  });
});

router.get("/bebidas", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(`select * from Bebidas;`, (error, results) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error });
      }
      const response = {
        bebidas: results.map((bebida) => {
          return {
            codigo_bebida: bebida.codigo_bebida,
            sabor: bebida.sabor,
            valor: bebida.valor,
            tamanho: bebida.tamanho,
            litro: bebida.litro,
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

router.post("/bebidas", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send(error);
    }
    conn.query(
      `
      insert into Bebidas (sabor, valor, tamanho, litro)
      values (?,?,?,?)
      `,
      [req.body.sabor, req.body.valor, req.body.tamanho, req.body.litro],
      (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        const response = {
          mensagem: "Bebida cadastrada com sucesso",
          bebidaCadastrada: {
            codigo_bebida: result.insertId,
            sabor: req.body.sabor,
            valor: req.body.valor,
            tamanho: req.body.tamanho,
            litro: req.body.litro,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require("../middleware/login"); // protegendo rota com token

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
});

// RETORNA OS PRODUTOS
router.get("/", (req, res, next) => {
  // res.status(200).send({
  //   mensagem: "Get Produtos",
  // });
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM produtos;", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      // Boas práticas API bem documentada
      const response = {
        quantidade: result.length,
        produtos: result.map((prod) => {
          return {
            id_produto: prod.id_produto,
            nome: prod.nome,
            preco: prod.preco,
            imagem_produto: prod.imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produtos",
              url: "http://localhost:3001/produtos/" + prod.id_produto,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
});

// INSERE OS PRODUTOS
router.post(
  "/",
  login.obrigatorio,
  upload.single("produto_imagem"),
  (req, res, next) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }

      conn.query(
        "INSERT INTO produtos (nome, preco, imagem_produto ) VALUES (?,?,?)",
        [req.body.nome, req.body.preco, req.file.path],
        (error, result, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
          const response = {
            mensagem: "Produto inserido com sucesso",
            produtoCriado: {
              id_produto: result.id_produto,
              nome: req.body.nome,
              preco: req.body.preco,
              imagem_produto: req.file.path,
              request: {
                tipo: "POST",
                descricao: "Insere um produto",
                url: "http://localhost:3001/produtos",
              },
            },
          };
          res.status(201).send({ response });
        }
      );
    });
  }
);

// BUSCA O PRODUTO POR ID
router.get("/:id_produto", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ?;",
      [req.params.id_produto],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length === 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado produtocom este ID",
          });
        }
        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            imagem_produto: result[0].imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3001/produtos",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
});

// ATUALIZA PRODUTO
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?",
      [req.body.nome, req.body.preco, req.body.id_produto],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          mensagem: "Produto alterado com sucesso",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3001/produtos" + req.body.id_produto,
            },
          },
        };

        res.status(202).send({ response });
      }
    );
  });
});

// APAGA PRODUTO
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE from produtos WHERE id_produto = ?",
      [req.body.id_produto],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          mensagem: "Produto removido com sucesso",
        };

        res.status(202).send({ response });
      }
    );
  });
});

module.exports = router;

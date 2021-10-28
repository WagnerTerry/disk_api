const mysql = require("../mysql").pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    // CONSULTANDO VARIAS TABELAS NUMA QUERY
    conn.query(
      `SELECT pedidos.id_pedido,
        pedidos.quantidade,
        produtos.id_produto,
        produtos.preco
        FROM pedidos
        INNER JOIN produtos
        ON produtos.id_produto = pedidos.id_produto;`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          total_pedidos: result.length,
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedido,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco,
              },
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes de um pedido específico",
                url: "http://localhost:3001/pedidos/" + pedido.id_pedido,
              },
            };
          }),
        };
        res.status(200).send(response);
      }
    );
  });
};

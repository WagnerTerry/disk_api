const mysql = require("../mysql").pool;

exports.getCaixa = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      `
            select * from Caixa
            `,
      (error, results) => {
        if (error) {
          return res.status(500).send({ error });
        }
        conn.release();
        const response = {
          quantidade_pedido: results.length,
          fluxo_caixa: results.map((caixa) => {
            return {
              codigo_pedido: caixa.codigo_pedido,
              numero_pedido: caixa.numero_pedido,
              datas: caixa.datas,
              hora: caixa.hora,
              nome_cliente: caixa.nome_cliente,
              nome_pizza: caixa.nome_pizza,
              bairro: caixa.bairro,
              entregador: caixa.entregador,
              pagamento: caixa.pagamento,
              observacao: caixa.observacao,
              valor: caixa.valor,
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
};

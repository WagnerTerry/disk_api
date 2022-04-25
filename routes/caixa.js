const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

const CaixaController = require("../controllers/caixa-controller");

router.get("/", CaixaController.getCaixa);

// SEM CONTROLLER
// router.get("/", (req, res, next) => {
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       return res.status(500).send({ error });
//     }
//     conn.query(
//       `
//     select * from Caixa
//     `,
//       (error, results) => {
//         conn.release();
//         if (error) {
//           return res.status(500).send({ error });
//         }
//         const response = {
//           quantidade_pedido: results.length,
//           fluxo_caixa: results.map((caixa) => {
//             return {
//               codigo_pedido: caixa.codigo_pedido,
//               numero_pedido: caixa.numero_pedido,
//               datas: caixa.datas,
//               hora: caixa.hora,
//               nome_cliente: caixa.nome_cliente,
//               nome_pizza: caixa.nome_pizza,
//               bairro: caixa.bairro,
//               entregador: caixa.entregador,
//               pagamento: caixa.pagamento,
//               observacao: caixa.observacao,
//               valor: caixa.valor,
//             };
//           }),
//         };
//         return res.status(200).send(response);
//       }
//     );
//   });
// });

router.post("/", CaixaController.cadastroCaixa)
  // mysql.getConnection((error, conn) => {
  //   if (error) {
  //     return res.status(500).send({ error });
  //   }
  //   conn.query(
  //     `
  //     insert into Caixa
  //     (numero_pedido, datas, hora, nome_cliente, nome_pizza, bairro, entregador, pagamento, observacao, valor)
  //     values (?,?,?,?,?,?,?,?,?,?)
  //     `,
  //     [
  //       req.body.numero_pedido,
  //       req.body.datas,
  //       req.body.hora,
  //       req.body.nome_cliente,
  //       req.body.nome_pizza,
  //       req.body.bairro,
  //       req.body.entregador,
  //       req.body.pagamento,
  //       req.body.observacao,
  //       req.body.valor,
  //     ],
  //     (error, results) => {
  //       conn.release();
  //       if (error) {
  //         return res.status(500).send({ error });
  //       }
  //       const response = {
  //         mensagem: "Registro salvo com sucesso",
  //         registroCadastrado: {
  //           codigo_pedido: results.insertId,
  //           numero_pedido: req.body.numero_pedido,
  //           datas: req.body.datas,
  //           hora: req.body.hora,
  //           nome_cliente: req.body.nome_cliente,
  //           nome_pizza: req.body.nome_pizza,
  //           bairro: req.body.bairro,
  //           entregador: req.body.entregador,
  //           pagamento: req.body.pagamento,
  //           observacao: req.body.observacao,
  //           valor: req.body.valor,
  //         },
  //       };
  //       return res.status(201).send(response);
  //     }
  //   );
  // });

router.delete("/deleteAll", CaixaController.apagarTodosRegistros)
  // mysql.getConnection((error, conn) => {
  //   if (error) {
  //     return res.status(500).send({ error });
  //   }
  //   conn.query(
  //     `
  //     TRUNCATE TABLE Caixa;
  //   `,
  //     (error, results) => {
  //       if (error) {
  //         return res.status(500).send({ error });
  //       }
  //       const response = {
  //         mensagem: "Todos os registros foram apagados",
  //       };
  //       return res.status(202).send(response);
  //     }
  //   );
  // });

router.delete("/:codigo_pedido", CaixaController.deletarRegistro)

module.exports = router;

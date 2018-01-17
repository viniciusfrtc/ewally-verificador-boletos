const express = require('express');
const validacao = require('../model/validacao-body.js');
const calculos = require('../model/calculos-bancarios.js');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('bancarios');
});

router.post('/teste', (req, res) => {
// validação do input do usuário usando o Joi (model/validacao-body), para certificar
// que o que vai ser trabalhado nas funções são Strings que contenham somente
// números. Caso não atenda a isso, ele recebe a mensagem de erro: "Insira os números corretamente nos campos!".
  validacao.bancarios(req.body)
  .then((body) => {

// Teste dos 3 dígitos verificadores da linha digitável. Caso não esteja correto,
// o usuário recebe a mensagem de erro: "Os dígitos verificadores da linha digitável não conferem!".
    let testeDV1 = calculos.checarDV(req.body.campo1a, req.body.campo1b);
    let testeDV2 = calculos.checarDV(req.body.campo2a, req.body.campo2b);
    let testeDV3 = calculos.checarDV(req.body.campo3a, req.body.campo3b);

    if (testeDV1 && testeDV2 && testeDV3) {

// Gero o código de barras de acordo com o formato da documentação, e testo para ver se
// o dígito verificador dele está correto. Caso não esteja, o usuário recebe a
// mensagem de erro: "O dígito verificador do código de barras não confere".
      let codBar = calculos.gerarCodBar(body);

      if(calculos.checarCodBar(codBar)) {

// Ao chegar neste ponto, significa que tanto os DVs da linha digitável quanto o DV do
// código de barras foi validado. Eu gero as informações pedidas (valor, código de barras
// e data de vencimento) em um formato legível e envio ao usuário num alert box de sucesso.
// Caso o valor do boleto seja zero, eu envio uma mensagem de erro: "O valor do título bancário é menor que zero".
        let dados = calculos.dataVencimentoEValor(req.body.campo5.substr(0,4), req.body.campo5.substr(4,10));

        dados.codBar = codBar;

        if(dados.valor <= 0) {
          res.render('bancarios',{erro: true, descricao: 'O valor do título bancário é menor que zero'});
        } else {
          res.render('bancarios',{sucesso: true, dados: dados});
        };

      } else {
        // o DV do código de barras não confere
        res.render('bancarios',{erro: true, descricao: 'O dígito verificador do código de barras não confere!'});
      };

    } else {
      // algum DV da linha digitável não confere
      res.render('bancarios',{erro: true, descricao: 'Os dígitos verificadores da linha digitável não conferem!'});
    };
  })
  .catch((e) => {
    // erro de validação do req.body
    console.log(e);
    if(e.isJoi) {
      e = 'Insira os números corretamente nos campos!';
    };

    res.render('bancarios',{erro: true, descricao: e});

  });

});

module.exports = router;

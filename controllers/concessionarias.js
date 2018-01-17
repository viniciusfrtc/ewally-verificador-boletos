const express = require('express');
const validacao = require('../model/validacao-body.js');
const calculos = require('../model/calculos-concessionarias.js');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('concessionarias');
});

router.post('/teste', (req, res) => {
// validação do input do usuário usando o Joi (model/validacao-body), para certificar
// que o que vai ser trabalhado nas funções são Strings que contenham somente
// números. Caso não atenda a isso, ele recebe a mensagem de erro: "Insira os números corretamente nos campos!".
console.log(req.body);
  validacao.concessionarias(req.body)
  .then((body) => {
// Teste do dígito correspondente a qual módulo da documentação deve ser usado pra validar os dígitos,
// verificadores. Caso este dígito seja inválido, o usuário recebe a mensagem de
// erro: "O título é inválido (identificador de valor efetivo/referência inválido)!".

    let moduloDAC;
    if (body.campo1[2] == '6' || body.campo1[2] =='7') {
      moduloDAC = 10;
    } else if (body.campo1[2] == '8' || body.campo1[2] =='9') {
      moduloDAC = 11;
    };

    if (moduloDAC) {
// Teste dos dígitos verificadores da linha digitável. Caso algum não seja válido, o usuário recebe a
// mensagem de erro: "Os dígitos verificadores da linha digitável não conferem!".
      let dv1 = calculos.checarDV(body.campo1, body.campo1dv, moduloDAC);
      let dv2 = calculos.checarDV(body.campo2, body.campo2dv, moduloDAC);
      let dv3 = calculos.checarDV(body.campo3, body.campo3dv, moduloDAC);
      let dv4 = calculos.checarDV(body.campo4, body.campo4dv, moduloDAC);

      if (dv1 && dv2 && dv3 && dv4) {

        let codBar = body.campo1 + body.campo2 + body.campo3 + body.campo4;
// Após gerar o código de barras, valido seu dígito verificador. Caso não seja válido, o usuário
// recebe a mensagem de erro: "O dígito verificador do código de barras não confere".
        if(calculos.checarDV((codBar.substr(0, 3) + codBar.substr(4, 40)), codBar[3], moduloDAC)) {
          let dados = calculos.dataVencimentoEValor(codBar);

          dados.codBar = codBar;

// Se o usuário marcou que o boleto não possui data de vencimento, sobrescrevo o vencimento gerado
// automaticamente por "-".
          if(!req.body.data) {
            dados.vencimento = '-';
          }
// Se o valor do boleto for 0, envio a mensagem de erro: "O valor do título bancário é menor que zero".
          if(dados.valor <= 0) {
            res.render('concessionarias',{erro: true, descricao: 'O valor do título bancário é menor que zero'});
          } else {
            res.render('concessionarias',{sucesso: true, dados: dados});
          };

        } else {
          res.render('concessionarias',{erro: true, descricao: 'O dígito verificador do código de barras não confere!'});
        };

      } else {
        res.render('concessionarias',{erro: true, descricao: 'Os dígitos verificadores da linha digitada não conferem!'});
      };

    } else {
      res.render('concessionarias',{erro: true, descricao: 'O título é inválido (identificador de valor efetivo/referência inválido)!'});
    };


  })
  .catch((e) => {
    if(e.isJoi) {
      console.log(e);
      e = 'Insira os números corretamente nos campos!';
    } else {
    };

    res.render('concessionarias',{erro: true, descricao: e});

  });

});

module.exports = router;

const calculosBancarios = {
// Checagem dos dígitos verificadores da linha digitável, um for que percorre o
// string de trás pra frente multiplicando cada elemento e aplicando a regra pra
// encontrar o dígito. Retorna um booleano dizendo se o D.V.confere ou não com o
// inserido pelo usuário.
  checarDV: (campoA, campoB) => {

    let campoCompleto = campoA + campoB.substr(0,campoB.length-1);
    let dv = campoB[campoB.length-1];

    let dvTeste = 0;
    let multiplicador = 2;

    for (let indice = campoCompleto.length - 1; indice >= 0; indice--) {

      dvTeste += Number(campoCompleto[indice]) * multiplicador;

      if (Number(campoCompleto[indice]) * multiplicador > 9) {
        dvTeste -= 9;
      }

      if (multiplicador == 2){
        multiplicador--;
      } else {
        multiplicador++;
      };

    };

    dvTeste = (Math.ceil(dvTeste/10) * 10) - dvTeste;

    if (dv == dvTeste) {
      return true;
    } else {
      return false;
    }

  },
// Nesta função faço a reorganização e soma de todas as strings inseridas pelo
// usuário para ficar no formato do código de barras descrito na documentação.
  gerarCodBar: (campos) => {

    let bancoEMoeda = campos.campo1a.substr(0, 4);

    let dvCodBar = campos.campo4;

    let vencEValor = campos.campo5;

    let pos20a24 = campos.campo1a[campos.campo1a.length-1] + campos.campo1b.substr(0, campos.campo1b.length-1);

    let pos25a34 = campos.campo2a + campos.campo2b.substr(0, campos.campo2b.length-1);

    let pos35a44 = campos.campo3a + campos.campo3b.substr(0, campos.campo3b.length-1);

    return (bancoEMoeda + dvCodBar + vencEValor + pos20a24 + pos25a34 + pos35a44);
  },
// Checagem utilizando uma lógica parecida com a checagem do dígito verificador da
// linha digitável, seguindo todas as regras da metodologia de verificação. 
  checarCodBar: (codBar) => {

    let codBarSemDV = codBar.substr(0, 4) + codBar.substr(5, 39);

    let dvCodBar = Number(codBar[4]);

    let dvTeste = 0;

    let multiplicador = 2;

    for (let indice = 42; indice >= 0; indice--) {

      dvTeste += Number(codBarSemDV[indice]) * multiplicador;

      if (multiplicador == 9) {
        multiplicador = 2;
      } else {
        multiplicador++;
      };

    };

    dvTeste = 11 - (dvTeste%11);



    if (dvTeste == 0 || dvTeste > 9) {
      dvTeste = 1;
    };

    if (dvTeste == dvCodBar) {
      return true;
    } else {
      return false;
    };

  },

// Apenas manipulo a data para somar o número de dias em relação a data-base e
// transformo o valor do boleto em número para formatar os centavos.
  dataVencimentoEValor: (data, valor) => {

    let dataInicial = new Date("10/07/1997");

    let dataFinal = new Date(dataInicial);

    dataFinal.setDate(dataFinal.getDate() + Number(data));

    let valorFinal = Number(valor)/100;

    return {vencimento: `${dataFinal.getDate()}/${dataFinal.getMonth()+1}/${dataFinal.getFullYear()}`, valor: valorFinal};
  }

};

module.exports = calculosBancarios;

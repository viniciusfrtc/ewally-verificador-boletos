const calculosConcessionarias = {

// Como as metodologias de validação dos dígitos verificadores são iguais tanto
// para a linha digitável quanto para o código de barras, uso somente uma função
// que aplica diferentes regras de acordo com a regra do segmento (moduloDAC,
// segundo dígito do código de barras que já é mensurado anteriormente).

  checarDV: (campo, dv, moduloDAC) => {

    let dvTeste = 0;
    let multiplicador = 2;

    for (let indice = campo.length - 1; indice >= 0; indice--) {

      dvTeste += Number(campo[indice]) * multiplicador;

      if (moduloDAC == 10){

        if ((Number(campo[indice]) * multiplicador) > 9) {
          dvTeste -= 9;
        };

        if (multiplicador == 2) {
          multiplicador--;
        } else {
          multiplicador++;
        };


      };

      if (moduloDAC == 11) {

        if (multiplicador == 9) {
          multiplicador = 2;
        } else {
          multiplicador++;
        };

      };

    };


    if(moduloDAC == 10) {
      dvTeste = (Math.ceil(dvTeste/10) * 10) - dvTeste;
    };

    if(moduloDAC == 11) {

      dvTeste = dvTeste%11;

      if (dvTeste == 1) {
        dvTeste = 0;
      } else if (dvTeste == 10) {
        dvTeste = 1;
      };

    };


    // console.log(dv, dvTeste);
    if (dv == dvTeste) {
      return true;
    } else {
      return false;
    }

  },

// Para pegar o vencimento e valor no código de barras, vejo o segmento (segundo dígito),
// pois se ele for 6 significa que o CNPJ do beneficiário está no código de barras e,
// consequentemente, a data que deveria estar inicialmente a partir do 20o. dígito foi
// empurrada 7 posições para a frente. A data é simplesmente recortada do código de barras
// com o substr e posiciono cada elemento de forma legível.
  dataVencimentoEValor: (codBar) => {

    let venc, valor, valorCodBar;

    if (codBar[1] == '6') {
      venc = codBar.substr(26, 8);
    } else {
      venc = codBar.substr(19, 8);
    };

    valor = Number(codBar.substr(4, 11))/100;

    return {vencimento: `${venc[7]+venc[6]}/${venc[5]+venc[4]}/${venc[0]+venc[1]+venc[2]+venc[3]}`, valor: valor};
  }

};

module.exports = calculosConcessionarias;

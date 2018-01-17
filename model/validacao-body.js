const Joi = require('joi');

// Toda a validação do req.body força que o input do usuário gere
// somente strings de números, no tamanho correto, para que
// a manipulação em todas as análises subsequentes esteja
// garantida.

const bancariosSchema = Joi.object().keys({
  campo1a: Joi.string().regex(/^[0-9]{5}$/).required(),
  campo1b: Joi.string().regex(/^[0-9]{5}$/).required(),
  campo2a: Joi.string().regex(/^[0-9]{5}$/).required(),
  campo2b: Joi.string().regex(/^[0-9]{6}$/).required(),
  campo3a: Joi.string().regex(/^[0-9]{5}$/).required(),
  campo3b: Joi.string().regex(/^[0-9]{6}$/).required(),
  campo4: Joi.string().regex(/^[0-9]{1}$/).required(),
  campo5: Joi.string().regex(/^[0-9]{14}$/).required()
});

const concessionariasSchema = Joi.object().keys({
  campo1: Joi.string().regex(/^[0-9]{11}$/).required(),
  campo1dv: Joi.string().regex(/^[0-9]{1}$/).required(),
  campo2: Joi.string().regex(/^[0-9]{11}$/).required(),
  campo2dv: Joi.string().regex(/^[0-9]{1}$/).required(),
  campo3: Joi.string().regex(/^[0-9]{11}$/).required(),
  campo3dv: Joi.string().regex(/^[0-9]{1}$/).required(),
  campo4: Joi.string().regex(/^[0-9]{11}$/).required(),
  campo4dv: Joi.string().regex(/^[0-9]{1}$/).required(),
  data: Joi.string()
});



const bancarios = (body) => {
  return new Promise ( (resolve, reject) => {
    Joi.validate(body, bancariosSchema)
    .then((validatedBody) => {
      resolve(validatedBody);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

const concessionarias = (body) => {
  return new Promise ( (resolve, reject) => {
    Joi.validate(body, concessionariasSchema)
    .then((validatedBody) => {
      resolve(validatedBody);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports = {
  bancarios: bancarios,
  concessionarias: concessionarias
};

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');


//Importando rotas
const bancarios = require('./controllers/bancarios');
const concessionarias = require('./controllers/concessionarias');



// Gerar a aplicação
const app = express();

// Configurar o handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middlewares
app.use(bodyParser.urlencoded());



// Rotas
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/bancarios', bancarios);
app.use('/concessionarias', concessionarias);

//Inicializar o servidor
app.listen(3000, () => {
  console.log('Servidor inicializado');
});

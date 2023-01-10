const cors = require('cors');
const express = require('express');
const app = express();
const port = 3005;
const routes = require('./api/route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, function() {
  console.log('Serveur ecoute sur le port: ' + port);
});

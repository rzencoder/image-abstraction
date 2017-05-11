//Requirements
const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app is now listening');
});

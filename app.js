//Requirements
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const search = require('./models/search');
const app = express();
require('dotenv').config();

mongoose.connect('mongodb://localhost/shortUrls' || process.env.MONGOLAB_URI);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app is now listening');
});

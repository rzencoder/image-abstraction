//Requirements
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app is now listening');
});

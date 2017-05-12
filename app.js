//Requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const searchData = require('./models/search');
const request = require('request');
const app = express();
require('dotenv').config();

const NUM_PAGE_RESULTS = 10;
const API_KEY = process.env.GOOGLE_API_KEY;
const API_CX = process.env.GOOGLE_CX;
const SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';
const SEARCH_TYPE = 'image';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/imageSearch' );

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

//Redirect to static page
app.get('/', (req, res) => {
  res.render('index');
});

//Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});

//Handle search request
app.get('/search/:search*', (req, res) => {
  let searchQuery = req.params.search;

  //Save search to db
  saveQuery(searchQuery);

  //Add query to google api
  //Default offset unless given with query
  let offset = 1;
  if (req.query.offset){
   offset = parseInt(req.query.offset) * NUM_PAGE_RESULTS;
  }

  //Compose url with query terms and constants
  let url = searchString(searchQuery, offset);

  //Use api and display results
  imageSearch(url, function(result){
   result ? res.send(result) : res.send('Error searching for query');
  });
});

//Handle history lookup
app.get('/history', (req, res) => {
  getRecentQueries(queryArray => {
    queryArray ? res.send(queryArray) : res.send({error: "Unable to retrieve last ten queries."});
  });
});

//Save query to db
function saveQuery(query) {
  let data = new searchData({
               query: query,
               time: new Date().toString()
             });
   data.save(error => {
     if (error) {
       console.log('Error saving to database');
     }
   });
}

//Search for last 10 queries
function getRecentQueries(callback){
  searchData.find({}, '-_id query time', (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      if (result.length >= 10) {
        result = result.slice(result.length - 10);
      }
      callback(result);
    }
  });
}

//Request data from google api
function imageSearch(url, callback){
  request.get(url, (err, res) => {
    if (err) {
      callback('Error searching for query');
    }
    else {
      //Parse data and iterate through and display relevant information
      let results = JSON.parse(res.body);
      if (results.items) {
        let images = [];
        results.items.forEach(item => {
          images.push({
            "title": item.title,
            "url": item.link,
            "context": item.image.contextLink
          });
        });
        callback(images);
      }
    }
  });
}

//Construct url for api
function searchString(query, offset){
  return SEARCH_URL +
    "?key=" + API_KEY +
    "&cx=" + API_CX +
    "&searchType=image" +
    "&q=" + query +
    "&start=" + offset;
}

//Listen on given port for heroku deployment
app.listen(process.env.PORT || 3000, function() {
  console.log('app is now listening')
});

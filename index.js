var express = require('express');
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/words', {native_parser: true});
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/words', function(req, res) {
    var db = req.db;
    db.collection('wordlist').find().toArray(function(err, items) {
        res.json(items);
    });
});

app.get('/addWord', function(req, res) {
    var db = req.db;
    db.collection('wordlist').insert({
        word: req.query.word
    }, function(err, doc) {
        res.json('inserted');
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

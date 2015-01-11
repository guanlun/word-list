var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/words', {native_parser: true});
var app = express();

app.set('port', (process.env.PORT || 5000));

// use bodyParser to handle POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up mongodb
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/wordList', function(req, res) {
    var db = req.db;
    db.collection('wordlist').find().toArray(function(err, items) {
        res.json(items);
    });
});

app.post('/wordList', function(req, res) {
    var db = req.db;

    db.collection('wordlist').insert({
        list_name: req.body.list_name,
        words: []
    }, function(err, result) {
        if (err) {
            if (err.code == 11000) {
                res.status(500).send({ message: 'Duplicated list name' });
            }
        }
        res.json(result);
    });
});

app.post('/word', function(req, res) {
    var db = req.db;
    var listName = req.body.list_name;
    var word = req.body.word;

    db.collection('wordlist').update({ list_name: listName }, {
        $push: {
            words: {
                title: word.title,
                meaning: word.meaning
            }
        }
    }, function(err, result) {
        res.json(result);
    }); 
});

app.post('/updateWord', function(req, res) {
    var db = req.db;
    var listName = req.body.list_name;
    var origTitle = req.body.orig_word.title;
    var newWord = req.body.new_word

    db.collection('wordlist').update(
        {
            list_name: listName,
            'words.title': origTitle
        },
        {
            $set: {
                'words.$': newWord
            }
        },
        function(err, result) {
            res.json(result);
        }
    );
});

app.post('/deleteWord', function(req, res) {
    var db = req.db;
    var listName = req.body.list_name;

    db.collection('wordlist').update({ list_name: listName }, {
        $pull: {
            words: { title: req.body.title }
        }
    }, function(err, result) {
        res.json(result);
    });
});

app.get('/insertData', function(req, res) {

});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});


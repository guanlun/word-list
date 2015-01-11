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

    db.collection('counters').findAndModify(
        { _id: 'word_list' },
        [],
        { $inc: { sequence: 1 } },
        {},
        function(err, result) {
            db.collection('wordlist').insert({
                _id: result.sequence,
                list_name: req.body.list_name,
                words: []
            }, function(err, result) {
                res.json(result);
            });
        }
    );

});

app.post('/word', function(req, res) {
    var db = req.db;
    var listId = req.body.listId;
    var word = req.body.word;

    db.collection('counters').findAndModify(
        { _id: 'word' },
        [],
        { $inc: {sequence: 1 } },
        {},
        function(err, result) {
            db.collection('wordlist').update({ _id: listId }, {
                $push: {
                    words: {
                        _id: result.sequence,
                        title: word.title,
                        meaning: word.meaning
                    }
                }
            }, function(err, result) {
                res.json(result);
            }); 
        }
    );

});

app.post('/deleteWord', function(req, res) {
    var db = req.db;
    var listId = req.body.listId;
    db.collection('wordlist').update({ _id: listId }, {
        $pull: {
            words: { _id: req.body.id }
        }
    }, function(err, result) {
        res.json(result);
    });
});

app.get('/insertData', function(req, res) {
db.collection('counters').findAndModify(
    { _id: 'word_list' },
    [],
    { $inc: { sequence: 1 } },
    {},
    function(err, result) {
        db.collection('wordlist').insert({
            _id: result.sequence,
            list_name: 'Word List 5',
            words: [
                { title: "contented", meaning: "心满意足的" },
                { title: "contention", meaning: "争论" },
                { title: "contentious", meaning: "好辩的" },
                { title: "contest", meaning: "表示怀疑" },
                { title: "contiguous", meaning: "接近的" },
                { title: "continent", meaning: "自制的" },
                { title: "contingent", meaning: "意外的，视情况而定的" },
                { title: "contort", meaning: "扭曲" },
                { title: "contraband", meaning: "违禁品" },
                { title: "contravene", meaning: "违背" },
                { title: "contrite", meaning: "悔过的" },
                { title: "contrive", meaning: "计划，设计" },
                { title: "contrived", meaning: "做作的" },
                { title: "controvert", meaning: "驳斥" },
                { title: "contumacious", meaning: "违抗的" },
                { title: "conundrum", meaning: "谜语，难题" },
                { title: "convalesce", meaning: "康复" },
                { title: "convalescent", meaning: "康复中的" },
                { title: "conversant", meaning: "精通的" },
                { title: "converse", meaning: "逆向的" },
                { title: "conviction", meaning: "坚信" },
                { title: "convivial", meaning: "狂欢的" },
                { title: "conviviality", meaning: "爱交际的性格" },
                { title: "convoke", meaning: "召集" },
                { title: "convoluted", meaning: "旋绕的，费解的" },
                { title: "convulse", meaning: "震动，震惊" },
                { title: "convulsion", meaning: "骚动，痉挛" },
                { title: "coop", meaning: "鸡笼" },
                { title: "copious", meaning: "丰富多产的" },
                { title: "cornucopia", meaning: "丰收羊角" },
                { title: "coronation", meaning: "加冕" },
                { title: "corporeal", meaning: "肉体的，物质的" },
                { title: "corpuscle", meaning: "细胞" },
                { title: "corral", meaning: "畜栏" },
                { title: "correspondent", meaning: "记者，符合的" },
                { title: "corroborate", meaning: "支持，证实" },
                { title: "corrode", meaning: "腐蚀" },
                { title: "corrosive", meaning: "腐蚀性的" },
                { title: "corrugate", meaning: "起皱纹" },
                { title: "cosmic", meaning: "宇宙的" },
                { title: "cosmopolitan", meaning: "世界主义者" },
                { title: "cosset", meaning: "宠爱，溺爱" },
                { title: "coterie", meaning: "小团体" },
                { title: "coterminous", meaning: "毗邻的" },
                { title: "cougar", meaning: "美洲豹" },
                { title: "countenance", meaning: "支持，容忍，表情" },
                { title: "counterbalance", meaning: "其平衡作用" },
                { title: "counterfeit", meaning: "伪造" },
                { title: "countermand", meaning: "撤回，取消" },
                { title: "counterproductive", meaning: "事与愿违的" },
                { title: "coup", meaning: "意外成功的行动" },
                { title: "court", meaning: "献殷勤" },
                { title: "covenant", meaning: "契约" },
                { title: "covert", meaning: "秘密的" },
                { title: "covet", meaning: "妄想" },
                { title: "cow", meaning: "威胁" },
                { title: "cower", meaning: "畏缩" },
                { title: "coy", meaning: "腼腆的" },
                { title: "cozen", meaning: "哄骗" },
                { title: "crab", meaning: "抱怨" },
                { title: "crabbed", meaning: "暴躁的" },
                { title: "cram", meaning: "塞满，临时抱佛脚" },
                { title: "cramp", meaning: "夹子，夹紧" },
                { title: "cranky", meaning: "怪癖的，任性的，不稳的" },
                { title: "crass", meaning: "愚钝的，粗糙的" },
                { title: "crate", meaning: "板条箱" },
                { title: "cravat", meaning: "领结" },
                { title: "craven", meaning: "懦弱的" },
                { title: "craving", meaning: "强烈的愿望" },
                { title: "crease", meaning: "折痕" },
                { title: "credence", meaning: "信任" },
                { title: "credulous", meaning: "轻信的" },
                { title: "crescendo", meaning: "渐强，高潮" },
                { title: "crest", meaning: "山顶，浪尖" },
                { title: "crestfallen", meaning: "挫败的" },
                { title: "cringe", meaning: "畏缩" },
                { title: "cringing", meaning: "谄媚的" },
                { title: "critique", meaning: "批评性的分析" },
                { title: "croak", meaning: "蛙鸣，抱怨" },
                { title: "crochet", meaning: "针织物" },
                { title: "crockery", meaning: "陶器" },
                { title: "cronyism", meaning: "任人唯亲" },
                { title: "crook", meaning: "使弯曲，钩状物" },
                { title: "cross", meaning: "生气的" },
                { title: "crouch", meaning: "蹲伏" },
                { title: "crucial", meaning: "决定性的" },
                { title: "crudity", meaning: "粗糙，生硬" },
                { title: "crumb", meaning: "碎屑，面包屑" },
                { title: "crumble", meaning: "弄碎" },
                { title: "crumple", meaning: "弄皱" },
                { title: "crutch", meaning: "拐杖，支撑" },
                { title: "crux", meaning: "关键，症结" },
                { title: "cryptic", meaning: "神秘的" },
                { title: "cub", meaning: "幼兽，无经验的" },
                { title: "cue", meaning: "暗示" },
                { title: "culinary", meaning: "厨房的，烹调的" },
                { title: "culmination", meaning: "顶点，结果" },
                { title: "culpable", meaning: "有罪的，受谴责的" },
                { title: "cultivate", meaning: "讨好" },
                { title: "cultivated", meaning: "种植的，有修养的" },
                ]
            },
            function(err, result) {
                res.json(result);
            });
        }
    );
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});


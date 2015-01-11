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
    var newWord = req.body.new_word;

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
    db.collection('wordlist').insert(
        [
            {
                list_name: 'Word List 5',
                words: [
                    { title: "bibliophile", meaning: "爱书者" },
                    { title: "bicker", meaning: "为小事争吵" },
                    { title: "bifurcate", meaning: "分叉" },
                    { title: "bigot", meaning: "偏执者" },
                    { title: "bile", meaning: "愤怒" },
                    { title: "bilk", meaning: "躲债" },
                    { title: "billowy", meaning: "波浪一样的" },
                    { title: "biped", meaning: "两足动物" },
                    { title: "blanch", meaning: "洗白" },
                    { title: "bland", meaning: "情绪稳定" },
                    { title: "blandishment", meaning: "奉承" },
                    { title: "blasphemy", meaning: "亵渎" },
                    { title: "blazon", meaning: "纹章" },
                    { title: "bleak", meaning: "寒冷阴郁" },
                    { title: "blemish", meaning: "亵渎" },
                    { title: "blithe", meaning: "快乐的" },
                    { title: "blooming", meaning: "精力旺盛的" },
                    { title: "blotch", meaning: "斑点" },
                    { title: "blowhard", meaning: "吹牛逼" },
                    { title: "blunder", meaning: "犯大错" },
                    { title: "blurb", meaning: "简介，广告" },
                    { title: "blurt", meaning: "脱口而出" },
                    { title: "bog", meaning: "沼泽" },
                    { title: "boggle", meaning: "猥琐不前" },
                    { title: "bogus", meaning: "假的" },
                    { title: "boisterous", meaning: "喧闹的" },
                    { title: "bolster", meaning: "资瓷" },
                    { title: "bolt", meaning: "螺栓" },
                    { title: "bombast", meaning: "吹嘘" },
                    { title: "bondage", meaning: "奴役，束缚" },
                    { title: "bonnet", meaning: "圆帽" },
                    { title: "boon", meaning: "天赐的恩惠" },
                    { title: "boor", meaning: "粗俗的人" },
                    { title: "bootless", meaning: "无用的" },
                    { title: "bouquet", meaning: "花束，芳香" },
                    { title: "bourgeois", meaning: "市侩的" },
                    { title: "bout", meaning: "一阵" },
                    { title: "brace", meaning: "支撑，稳固" },
                    { title: "bracing", meaning: "令人振奋的" },
                    { title: "brag", meaning: "吹嘘" },
                    { title: "braggadocio", meaning: "吹牛的人" },
                    { title: "braggart", meaning: "吹牛的人" },
                    { title: "braid", meaning: "穗，编辫子" },
                    { title: "brandish", meaning: "威胁性地挥舞" },
                    { title: "brash", meaning: "性急的" },
                    { title: "brassy", meaning: "厚脸皮的" },
                    { title: "brat", meaning: "熊孩子" },
                    { title: "bravado", meaning: "虚张声势" },
                    { title: "bravura", meaning: "华美的" },
                    { title: "brazen", meaning: "厚脸皮的" },
                    { title: "bridle", meaning: "抑制，控制" },
                    { title: "brisk", meaning: "敏捷的" },
                    { title: "bristle", meaning: "毛发，竖起，发怒" },
                    { title: "brittle", meaning: "易碎的" },
                    { title: "broach", meaning: "提出讨论" },
                    { title: "broker", meaning: "经纪人" },
                    { title: "bromide", meaning: "平庸的人或话，镇静剂" },
                    { title: "brood", meaning: "孵蛋，冥想" },
                    { title: "browbeat", meaning: "吓唬" },
                    { title: "bruit", meaning: "散布谣言" },
                    { title: "brunt", meaning: "影响，冲击" },
                    { title: "brusque", meaning: "唐突鲁莽的" },
                    { title: "buck", meaning: "反对" },
                    { title: "bucolic", meaning: "乡村的" },
                    { title: "budge", meaning: "移动一点" },
                    { title: "buffoon", meaning: "粗俗的人" },
                    { title: "bumptious", meaning: "傲慢的" },
                    { title: "bungle", meaning: "笨拙地做" },
                    { title: "burgeon", meaning: "迅速发展" },
                    { title: "burlesque", meaning: "滑稽喜剧" },
                    { title: "burnish", meaning: "磨光" },
                    { title: "bust", meaning: "半身像" },
                    { title: "buttress", meaning: "拱墙，支持" },
                    { title: "cabal", meaning: "政治阴谋集团" },
                    { title: "cacophony", meaning: "难听的声音" },
                    { title: "cadet", meaning: "军校学生" },
                    { title: "cadge", meaning: "乞讨，占便宜" },
                    { title: "cajole", meaning: "哄骗" },
            ]
        },

            {
                list_name: 'Word List 6',
                words: [
                    { title: "calculated", meaning: "蓄谋的" },
                    { title: "caldron", meaning: "大锅" },
                    { title: "calipers", meaning: "双脚规" },
                    { title: "callous", meaning: "结块" },
                    { title: "callow", meaning: "未成熟的" },
                    { title: "calumniate", meaning: "诽谤" },
                    { title: "calumny", meaning: "诽谤" },
                    { title: "cameo", meaning: "生动刻画" },
                    { title: "canary", meaning: "金丝雀，女歌星" },
                    { title: "candid", meaning: "率直的" },
                    { title: "candor", meaning: "率直" },
                    { title: "cane", meaning: "拐杖" },
                    { title: "canine", meaning: "狗的" },
                    { title: "canny", meaning: "精明的" },
                    { title: "canon", meaning: "静电" },
                    { title: "canonical", meaning: "宗教经典的" },
                    { title: "canopy", meaning: "蚊帐" },
                    { title: "cant", meaning: "斜坡，隐语" },
                    { title: "cantankerous", meaning: "脾气暴躁好争吵的" },
                    { title: "canto", meaning: "诗篇" },
                    { title: "canvass", meaning: "拉选票" },
                    { title: "capillary", meaning: "毛细血管" },
                    { title: "capitulate", meaning: "有条件投降" },
                    { title: "caprice", meaning: "变化无常，任性" },
                    { title: "capricious", meaning: "变化无常的，任性的" },
                    { title: "captious", meaning: "吹毛求疵的" },
                    { title: "captivate", meaning: "吸引" },
                    { title: "carafe", meaning: "玻璃瓶" },
                    { title: "carapace", meaning: "甲壳" },
                    { title: "carcinogen", meaning: "致癌物" },
                    { title: "cardinal", meaning: "最重要的" },
                    { title: "caress", meaning: "抚摸" },
                    { title: "careworn", meaning: "饱经风霜的" },
                    { title: "caricature", meaning: "讽刺画" },
                    { title: "carnivorous", meaning: "食肉的" },
                    { title: "carol", meaning: "赞歌" },
                    { title: "carouse", meaning: "狂饮" },
                    { title: "carp", meaning: "吹毛求疵" },
                    { title: "carrion", meaning: "腐肉" },
                    { title: "cartographer", meaning: "绘制地图者" },
                    { title: "caste", meaning: "社会等级" },
                    { title: "castigate", meaning: "惩治" },
                    { title: "cataclysm", meaning: "灾难" },
                    { title: "catalyst", meaning: "催化剂" },
                    { title: "categorical", meaning: "绝对的，分类的" },
                    { title: "catharsis", meaning: "净化" },
                    { title: "catholic", meaning: "普遍的，宽厚的" },
                    { title: "caucus", meaning: "高层会议" },
                    { title: "caulk", meaning: "填塞缝隙" },
                    { title: "caustic", meaning: "腐蚀性的" },
                    { title: "caveat", meaning: "警告" },
                    { title: "cavil", meaning: "吹毛求疵" },
                    { title: "cavity", meaning: "洞" },
                    { title: "cavort", meaning: "欢跃" },
                    { title: "cede", meaning: "割让" },
                    { title: "celestial", meaning: "天体的，天上的" },
                    { title: "centaur人头马", meaning: "undefined" },
                    { title: "centurion", meaning: "百夫长" },
                    { title: "ceramic", meaning: "陶瓷制品" },
                    { title: "cerebral", meaning: "大脑的，深思的" },
                    { title: "certitude", meaning: "确定" },
                    { title: "cessation", meaning: "终止" },
                    { title: "cession", meaning: "割让" },
                    { title: "chafe", meaning: "擦热，激怒" },
                    { title: "chaff", meaning: "谷壳" },
                    { title: "chagrin", meaning: "失望懊恼" },
                    { title: "chalice", meaning: "大酒杯" },
                    { title: "chameleon", meaning: "变色龙" },
                    { title: "chapel", meaning: "小教堂" },
                    { title: "char", meaning: "烧焦" },
                    { title: "charade", meaning: "字谜游戏" },
                    { title: "charisma", meaning: "魅力" },
                    { title: "charlatan", meaning: "江湖骗子" },
                    { title: "charter", meaning: "特权，豁免权" },
                    { title: "chary", meaning: "小心谨慎的" },
                    { title: "chastes", meaning: "贞洁的" },
                    { title: "chastise", meaning: "惩罚" },
                    { title: "cherubic", meaning: "胖乎乎可爱的" },
                    { title: "chicanery", meaning: "诡计" },
                    { title: "chide", meaning: "指责" },
                    { title: "chimera", meaning: "神话怪物" },
                    { title: "chisel", meaning: "凿" },
                    { title: "chivalrous", meaning: "骑士精神的" },
                    { title: "choleric", meaning: "暴躁的" },
                    { title: "choreography", meaning: "舞蹈" },
            ]
        },

            {
                list_name: 'Word List 7',
                words: [
                    { title: "chromosome", meaning: "染色体" },
                    { title: "chuckle", meaning: "轻声笑" },
                    { title: "churl", meaning: "粗鄙之人" },
                    { title: "cinder", meaning: "余烬" },
                    { title: "cipher", meaning: "不重要的人" },
                    { title: "circuitous", meaning: "绕圈子的" },
                    { title: "circulate", meaning: "循环，发行流通" },
                    { title: "circumference", meaning: "周围" },
                    { title: "circumlocution", meaning: "绕圈子" },
                    { title: "circumscribe", meaning: "限制" },
                    { title: "circumstantial", meaning: "无关紧要的" },
                    { title: "circumvent", meaning: "迂回，规避" },
                    { title: "cistern", meaning: "蓄水池" },
                    { title: "civility", meaning: "彬彬有礼" },
                    { title: "clairvoyance", meaning: "超人的洞察力" },
                    { title: "clam", meaning: "蛤蜊" },
                    { title: "clamor", meaning: "喧闹" },
                    { title: "clamp", meaning: "钳子，钳住" },
                    { title: "clandestine", meaning: "暗中从事的" },
                    { title: "clannish", meaning: "门户之间的" },
                    { title: "clasp", meaning: "扣子，紧握" },
                    { title: "cleft", meaning: "缝隙" },
                    { title: "clemency", meaning: "温和，仁慈" },
                    { title: "clement", meaning: "温和的，仁慈的" },
                    { title: "climax", meaning: "顶点" },
                    { title: "clinch", meaning: "钉死，确定" },
                    { title: "cling", meaning: "抓紧不放" },
                    { title: "clinical", meaning: "冷静客观的" },
                    { title: "clipper", meaning: "快船，剪刀" },
                    { title: "clique", meaning: "小派别" },
                    { title: "clog", meaning: "堵塞" },
                    { title: "cloister", meaning: "修道院" },
                    { title: "clot", meaning: "凝结" },
                    { title: "cloture", meaning: "辩论终结" },
                    { title: "cloudburst", meaning: "暴雨" },
                    { title: "clout", meaning: "用手打，权力" },
                    { title: "cloying", meaning: "甜腻的" },
                    { title: "coagulant", meaning: "凝结剂" },
                    { title: "coagulate", meaning: "凝结" },
                    { title: "coalesce", meaning: "联合" },
                    { title: "coarsen", meaning: "使粗糙" },
                    { title: "cob", meaning: "玉米棒子，天鹅" },
                    { title: "cobbler", meaning: "补鞋匠" },
                    { title: "cocoon", meaning: "茧" },
                    { title: "coda", meaning: "尾声" },
                    { title: "coddle", meaning: "溺爱，悉心照料" },
                    { title: "codify", meaning: "编成法典" },
                    { title: "coeval", meaning: "同年代的" },
                    { title: "cogent", meaning: "有说服力的" },
                    { title: "cogitate", meaning: "慎重思考" },
                    { title: "cognizance", meaning: "认识" },
                    { title: "cognizant", meaning: "认识的" },
                    { title: "colander", meaning: "过滤器" },
                    { title: "collage", meaning: "拼贴画" },
                    { title: "collate", meaning: "校对" },
                    { title: "collateral", meaning: "平新的，担保品" },
                    { title: "collected", meaning: "淡定的" },
                    { title: "colloquium", meaning: "讨论会" },
                    { title: "collude", meaning: "串通" },
                    { title: "colonnade", meaning: "柱廊" },
                    { title: "colossal", meaning: "巨大的" },
                    { title: "colossus", meaning: "巨人" },
                    { title: "coltish", meaning: "小马一样不受约束的" },
                    { title: "comatose", meaning: "昏迷的" },
                    { title: "comedienne", meaning: "喜剧演员" },
                    { title: "comely", meaning: "动人的" },
                    { title: "comity", meaning: "礼仪" },
                    { title: "commemorate", meaning: "几年" },
                    { title: "commensurate", meaning: "同样大小的" },
                    { title: "commingle", meaning: "混合" },
                    { title: "commodious", meaning: "宽敞的" },
                    { title: "commotion", meaning: "动乱" },
                    { title: "commune", meaning: "公社，亲切交谈" },
                    { title: "compatriot", meaning: "同胞" },
                    { title: "compel", meaning: "强迫" },
                    { title: "compendium", meaning: "概略" },
            ]
        },

            {
                list_name: 'Word List 8',
                words: [
                    { title: "complacency", meaning: "满足，安心" },
                    { title: "complaisance", meaning: "殷勤，彬彬有礼" },
                    { title: "complaisant", meaning: "顺从的，讨好的" },
                    { title: "compliant", meaning: "顺从的" },
                    { title: "composed", meaning: "淡定的，沉着的" },
                    { title: "compost", meaning: "混合肥料" },
                    { title: "composure", meaning: "沉着自若" },
                    { title: "compulsion", meaning: "强迫，冲动" },
                    { title: "compunction", meaning: "懊悔，良心不安" },
                    { title: "conceal", meaning: "隐藏" },
                    { title: "concede", meaning: "承认，让步" },
                    { title: "conceit", meaning: "自负" },
                    { title: "conceive", meaning: "构想，怀孕" },
                    { title: "concerto", meaning: "协奏曲" },
                    { title: "concession", meaning: "让步" },
                    { title: "conciliate", meaning: "安抚，调和" },
                    { title: "conciliatory", meaning: "安抚的，调和的" },
                    { title: "conclave", meaning: "秘密会议" },
                    { title: "concomitant", meaning: "伴随而来的" },
                    { title: "concord", meaning: "公约，和睦" },
                    { title: "concur", meaning: "意见相同" },
                    { title: "concussion", meaning: "脑震荡" },
                    { title: "condescend", meaning: "屈尊以对，轻慢" },
                    { title: "condone", meaning: "宽恕，原谅" },
                    { title: "conducive", meaning: "有助于的" },
                    { title: "conduct", meaning: "领导，引导" },
                    { title: "conduit", meaning: "引水道" },
                    { title: "confection", meaning: "甜食" },
                    { title: "confederacy", meaning: "联盟" },
                    { title: "confer", meaning: "讨论，赠与" },
                    { title: "confide", meaning: "吐露，倾诉" },
                    { title: "configuration", meaning: "轮廓" },
                    { title: "confine", meaning: "限制" },
                    { title: "confiscate", meaning: "充公" },
                    { title: "conflagration", meaning: "大火" },
                    { title: "conflate", meaning: "合并" },
                    { title: "conformist", meaning: "遵守习俗的人" },
                    { title: "confound", meaning: "使迷惑" },
                    { title: "congeal", meaning: "冻结，凝固" },
                    { title: "congenial", meaning: "意气相投的，性情好的" },
                    { title: "conglomerate", meaning: "聚成团" },
                    { title: "congruent", meaning: "一致的，全等的" },
                    { title: "congruous", meaning: "一致的，全等的" },
                    { title: "conifer", meaning: "针叶树" },
                    { title: "conjecture", meaning: "猜测" },
                    { title: "conjoin", meaning: "使结合" },
                    { title: "conjunction", meaning: "连词，联合" },
                    { title: "conjure", meaning: "召唤，想起" },
                    { title: "connive", meaning: "纵容，共谋" },
                    { title: "connoisseur", meaning: "鉴赏家" },
                    { title: "conscience", meaning: "良心" },
                    { title: "conscript", meaning: "征召" },
                    { title: "consensus", meaning: "意见一致" },
                    { title: "consequential", meaning: "自以为是的" },
                    { title: "conservatory", meaning: "温室，音乐学院" },
                    { title: "consign", meaning: "托运，托管" },
                    { title: "consonant", meaning: "调和的，一致的" },
                    { title: "conspicuous", meaning: "显著的" },
                    { title: "constellation", meaning: "星座" },
                    { title: "consternation", meaning: "惊骇" },
                    { title: "constituent", meaning: "成分，选民" },
                    { title: "constitution", meaning: "体质（人）" },
                    { title: "constitutional", meaning: "本质的" },
                    { title: "constrict", meaning: "收缩，压缩" },
                    { title: "construe", meaning: "解释，翻译" },
                    { title: "consul", meaning: "领事" },
                    { title: "consummate", meaning: "完全的，完善的" },
                    { title: "contain", meaning: "阻止" },
                    { title: "containment", meaning: "阻止" },
                    { title: "contemplate", meaning: "深思" },
                    { title: "contemptible", meaning: "令人轻视的" },
                    { title: "contemptuous", meaning: "鄙视的" },
                    { title: "contend", meaning: "争夺，主张" },
            ]
        },

            {
                list_name: 'Word List 9',
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

        ],
        function(err, result) {
            res.json(result);
        }
    );

});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});


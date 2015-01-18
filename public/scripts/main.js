
var wordListApp = angular.module('wordListApp', ['ngRoute']);

wordListApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/word_list', {
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
    })
    .when('/word_list/:id', {
        templateUrl: 'templates/list.html',
        controller: 'mainCtrl'
    });
}]);

wordListApp.service('wordListSrvc', function($http, $q) {
    function getWordLists() {
        var request = $http({
            method: 'get',
            url: 'wordList'
        });
        return (request.then(suc, err));
    }

    function createWordList(listName) {
        var request = $http({
            method: 'post',
            url: 'wordList',
            data: {
                list_name: listName
            }
        });
        return (request.then(suc, err));
    }

    function insertWord(wordData) {
        var request = $http({
            method: 'post',
            url: 'word',
            data: wordData
        });
        return (request.then(suc, err));
    }

    function updateWord(updateData) {
        var request = $http({
            method: 'post',
            url: 'updateWord',
            data: updateData
        });
        return (request.then(suc, err));
    }

    function deleteWord(wordData) {
        var request = $http({
            method: 'post',
            url: 'deleteWord',
            data: wordData
        });
        return (request.then(suc, err));
    }

    function suc(res) {
        console.log(res);
        return (res.data);
    }

    function err(res) {
        return $q.reject(res.data);
    }

    return ({
        getWordLists: getWordLists,
        createWordList: createWordList,
        insertWord: insertWord,
        updateWord: updateWord,
        deleteWord: deleteWord,
    });
});

wordListApp.controller('mainCtrl', function($scope, $routeParams, wordListSrvc) {
    $scope.wordLists = [];
    $scope.currListName = '';

    $scope.editing = false;
    $scope.focusedWord = null;

    $scope.shouldFilterOnImportance = false;
    $scope.searchFocused = false;
    $scope.currView = 'list';

    $scope.randomWordList = [];

    $scope.$on('$routeChangeSuccess', function(ev, current, pre) {
        $scope.currListName = current.params.id;
    });

    $scope.refreshWordLists = function() {
        wordListSrvc.getWordLists().then(function(wordLists) {
            $scope.wordLists = wordLists;
        });
    };

    $scope.importantFilter = function(word) {
        if ($scope.shouldFilterOnImportance) {
            return word.important;
        }
        return true;
    };

    $scope.toggleFilter = function() {
        $scope.shouldFilterOnImportance = !$scope.shouldFilterOnImportance;
    };

    $scope.toggleSearchInput = function() {
        $scope.shouldShowSearchInput = !$scope.shouldShowSearchInput;
    }

    $scope.shuffleWords = function() {
        var words = $scope.getCurrWordList();
        for (var i = 0; i < words.length; i++) {
            var randIdx = Math.floor(Math.random() * words.length);
            var tmp = words[i];
            words[i] = words[randIdx];
            words[randIdx] = tmp;
        }
    };

    $scope.setWordFocused = function(word) {
        $scope.focusedWord = word;
    };

    $scope.isFocusedWord = function(word) {
        return word === $scope.focusedWord;
    };

    $scope.createWordList = function(listName) {
        $scope.wordLists.push({
            list_name: listName,
            words: []
        });

        wordListSrvc.createWordList(listName).then(
            function(data) {
                console.log(data);
            }, function(err) {
                alert(err.message);
                $scope.wordLists.pop();
            }
        );
    };

    $scope.insertWord = function(title, meaning) {
        var word = {
            title: title,
            meaning: meaning
        }

        $scope.getCurrWordList().push(word);

        wordListSrvc.insertWord({
            list_name: $scope.currListName,
            word: word
        }).then(function(data) {
            console.log(data);

            // TODO: check if success
            $scope.focusedWord = word;
            $('html, body').animate({
                scrollTop: $(document).height()
            }, 200);
            $('.new-word-form .form-group input.title').val('').focus();
            $('.new-word-form .form-group input.meaning').val('');
        });
    };

    $scope.openEditModal = function(word) {
        $scope.editing = true;
        $scope.origWord = word;
        $scope.titleEditing = word.title;
        $scope.meaningEditing = word.meaning;
    };

    $scope.closeEditModal = function() {
        $scope.editing = false;
        $scope.origWord = "";
        $scope.titleEditing = "";
        $scope.meaningEditing = "";
    };

    $scope.updateWord = function(newTitle, newMeaning) {
        var newWord = {
            title: newTitle,
            meaning: newMeaning
        };

        var currList = $scope.getCurrWordList();
        var idx = currList.indexOf(_.findWhere(currList, $scope.origWord));
        currList[idx] = newWord;

        wordListSrvc.updateWord({
            list_name: $scope.currListName,
            orig_word: $scope.origWord,
            new_word: newWord
        }).then(function(data) {
            console.log(data);
        });

        $scope.closeEditModal();
    };

    $scope.markImportant = function(word) {
        word.important = !word.important;

        wordListSrvc.updateWord({
            list_name: $scope.currListName,
            orig_word: word,
            new_word: word
        }).then(function(data) {
            console.log(data);
        });
    };

    $scope.googleTranslate = function(word) {
        // window.location = 'https://translate.google.com/#en/zh-CN/' + word.title;
        window.location = 'http://www.merriam-webster.com/dictionary/' + word.title;
    };

    $scope.deleteWord = function(title) {
        var currList = $scope.getCurrWordList();
        var idx = currList.indexOf(_.findWhere(currList, { title: title }));
        currList.splice(idx, 1);

        wordListSrvc.deleteWord({
            list_name: $scope.currListName,
            title: title
        }).then(function(data) {
            console.log(data);
        });
    };

    $scope.generateRandomWordList = function() {
    };

    $scope.getCurrWordList = function() {
        if ($scope.wordLists.length != 0) {
            if ($scope.currListName == 'random') {
                return $scope.randomWordList;
            } else {
                return _.findWhere($scope.wordLists, {
                    list_name: $scope.currListName
                }).words;
            }
        }
    };

    $scope.refreshWordLists();
});


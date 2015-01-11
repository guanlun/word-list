
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

wordListApp.service('wordListSrvc', function($http) {
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

    function deleteWord(wordData) {
        var request = $http({
            method: 'post',
            url: 'deleteWord',
            data: wordData
        });
        return (request.then(suc, err));
    }

    function suc(res) {
        return (res.data);
    }

    function err(res) {
        return $q.reject(res.data.message);
    }

    return ({
        getWordLists: getWordLists,
        createWordList: createWordList,
        insertWord: insertWord,
        deleteWord: deleteWord
    });
});

wordListApp.controller('mainCtrl', function($scope, $routeParams, wordListSrvc) {
    $scope.wordLists = [];
    $scope.currListId = 0;

    $scope.editing = false;

    wordListSrvc.getWordLists().then(function(wordLists) {
        $scope.wordLists = wordLists;
    });

    $scope.$on('$routeChangeSuccess', function(ev, current, pre) {
        $scope.currListId = parseInt(current.params.id);
    });

    $scope.createWordList = function(listName) {
        wordListSrvc.createWordList(listName)
        .then(function(data) {
            console.log(data);
        });
    };

    $scope.insertWord = function(title, meaning) {
        var word = {
            title: title,
            meaning: meaning
        }

        $scope.getCurrWordList().push(word);

        wordListSrvc.insertWord({
            listId: $scope.currListId,
            word: word
        }).then(function(data) {
            console.log(data);
        });
    };

    $scope.openEditModal = function() {
        $scope.editing = true;
    }

    $scope.updateWord = function(index) {
        $scope.editing = false;
        console.log(index);
        // console.log($scope.wordLists[$scope.currListId].words[index]);
    };

    $scope.deleteWord = function(id) {
        var currList = $scope.getCurrWordList();
        var idx = currList.indexOf(_.findWhere(currList, { _id: id }));
        currList.splice(idx, 1);

        wordListSrvc.deleteWord({
            listId: $scope.currListId,
            id: id
        }).then(function(data) {
            console.log(data);
        });
    }

    $scope.getCurrWordList = function() {
        if ($scope.wordLists.length != 0) {
            return _.findWhere($scope.wordLists, { _id: $scope.currListId }).words;
        }
    };

});


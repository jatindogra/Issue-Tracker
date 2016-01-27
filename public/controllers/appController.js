var issueTracker = angular.module('issueTracker',[]);

issueTracker.controller('appCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.getIssues = function(){

    var repoUrl = $scope.repoUrl; //Getting repository url from U

    var check = repoUrl.startsWith('http');
    if(check != true){
      repoUrl = 'https://'.concat(repoUrl);
    }

    var splitRepoUrl = repoUrl.split('/');

    //get request to the node.js on the route /api/issues
    $http.get('/api/issues', {params:{"username": splitRepoUrl[3], "reponame": splitRepoUrl[4]}}).success(function(data){
      $scope.countOfIssues = data.countOfIssues;
      $scope.countOfIssuesInLastDay = data.countOfIssuesInLastDay;
      $scope.countOfIssuesInBetween = data.countOfIssuesInBetween;
      $scope.countOfIssuesOld = data.countOfIssuesOld;
    });
  }
}]);

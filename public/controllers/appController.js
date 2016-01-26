var issueTracker = angular.module('issueTracker',[]);

issueTracker.controller('appCtrl', ['$scope', function($scope) {
  $scope.greeting = 'Hola from controller!';
}]);

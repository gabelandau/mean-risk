// Angular application
app = angular.module('risk', []);

app.controller('brothers', function($scope, $http) {
    $http.get('http://localhost:3000/api/v1/brothers').then(function(response) {
        $scope.brothers = response.data.brothers;
    });
});

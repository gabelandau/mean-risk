// Angular application
app = angular.module('risk', []);

app.controller('brothers', function($scope, $http) {
    $scope.addSuccess = true;

    $http.get('/api/v1/brothers').then(function(response) {
        $scope.brothers = response.data.brothers;
    });

    $scope.addPoint = function(index) {
        $scope.brothers[index].points += 1;
    }

    $scope.subPoint = function(index) {
        $scope.brothers[index].points -= 1;
    }

    $scope.addBrother = function() {
        $http({
            method: 'post',
            url: '/api/v1/brother',
            data: {
                'name': $scope.add.name,
                'initiation_number': $scope.add.initiation_number,
                'points': $scope.add.points,
                'executive_council': $scope.add.executive_council,
                'coop': $scope.add.coop,
                'senior': $scope.add.senior
            }
        }).
        then(function(response) {
            $scope.addSuccess = false;
        });
    }
});

// Angular application
app = angular.module('risk', []);

app.controller('brothers', function($scope, $http) {
    // Default values and variable initialization
    $scope.addSuccess = true;
    $scope.addFail = true;
    $scope.editFail = true;
    $scope.editSuccess = true;

    $scope.draft = [];
    $scope.draft.sober = 2;
    $scope.draft.driver = 2;
    $scope.draft.extra = 0;
    $scope.draft.door = 1;

    // GET brothers for table
    $http.get('/api/v1/brothers').then(function(response) {
        $scope.brothers = response.data.brothers;

        for (var x = 0; x < $scope.brothers.length; x++) {
            if ($scope.brothers[x].coop == true || $scope.brothers[x].senior == true || $scope.brothers[x].executive_council == true) {
                $scope.brothers[x].exempt = "Yes"
            } else {
                $scope.brothers[x].exempt = ""
            }
        }
    });

    // Adds point to brother
    $scope.addPoint = function() {
        $scope.edit.points += 1;
    }

    // Subtracts point from brother
    $scope.subPoint = function() {
        $scope.edit.points -= 1;
    }

    // Clears data and messages from add brother form
    $scope.clearAddForm = function() {
        $scope.addSuccess = true;
        $scope.addFail = true;
        $scope.add = null;
    }

    // Clears data and messages from edit brother form
    $scope.clearEditForm = function() {
        $scope.editSuccess = true;
        $scope.editFail = true;
        $scope.edit = null;
    }

    // Add brother to database
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
            if (response.status == 200) {
                $scope.addSuccess = false;
            } else {
                $scope.addFail = false;
            }
        });
    }

    // Opens edit brother form and contains functions to edit brothers
    $scope.openEditBrotherForm = function(index) {
        $scope.edit = [];
        $scope.edit.name = $scope.brothers[index].name;
        $scope.edit.initiation_number = $scope.brothers[index].initiation_number;
        $scope.edit.points = $scope.brothers[index].points;
        $scope.edit.executive_council = $scope.brothers[index].executive_council;
        $scope.edit.senior = $scope.brothers[index].senior;
        $scope.edit.coop = $scope.brothers[index].coop;
        $scope.showEditForm = true;

        // Delete brother
        $scope.deleteBrother = function() {
            $http.delete('/api/v1/brother/' + $scope.edit.initiation_number).then(function(response) {
                console.log(response);
            });
        }

        // Edit brother
        $scope.editBrother = function() {
            $http({
                method: 'put',
                url: '/api/v1/brother/' + $scope.edit.initiation_number,
                data: {
                    'name': $scope.edit.name,
                    'points': $scope.edit.points,
                    'executive_council': $scope.edit.executive_council,
                    'coop': $scope.edit.coop,
                    'senior': $scope.edit.senior
                }
            }).
            then(function(response) {
                if (response.status == 200) {
                    $scope.editSuccess = false;
                } else {
                    $scope.editFail = false;
                }
            });
        }
    }
});

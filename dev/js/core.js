// Angular application
app = angular.module('risk', []);

/**
* This is the primary controller for this angular application.
* It provides functions and calculations for managing the brothers
* and running the draft system.
*
* It also interfaces with the Express API to store and retrieve
* brother information from the Mongo database.
*/
app.controller('brothers', function($scope, $http) {
    // Default values and variable initialization
    $scope.addSuccess = true;
    $scope.addFail = true;
    $scope.editFail = true;
    $scope.editSuccess = true;
    $scope.draftStatus = true;

    $scope.draft = [];
    $scope.draft.sober = 2;
    $scope.draft.driver = 2;
    $scope.draft.extra = 0;
    $scope.draft.door = 1;

    // GET brothers for table
    $http.get('/api/v1/brothers').then(function(response) {
        $scope.brothers = response.data.brothers;
        console.time("concatenation");

        runExemptions($scope.brothers);

        $scope.exempt_brothers = [];
        separateArrays($scope.brothers, $scope.exempt_brothers);

        shuffle($scope.brothers);

        $scope.brothers.sort(function (a, b) {
            if (a.points > b.points) return 1;
            if (a.points < b.points) return -1;
            return 0;
        });

        var tester = $scope.brothers[0].points;
        var increment = 1;

        for (var x = 0; x < $scope.brothers.length; x++) {
            if ($scope.brothers[x].points == tester) {
                $scope.brothers[x].draft_order = increment;
            }
            else {
                tester = $scope.brothers[x].points;
                increment++;
                $scope.brothers[x].draft_order = increment;
            }
        }

        console.timeEnd("concatenation");
    });

    // Add brother to database via POST request
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

    /**
    * This function is used to open a form which allows users
    * to edit the brothers in the database. It also extends
    * other functions used in the front-end interface
    */
    $scope.openEditBrotherForm = function(status, index) {
        $scope.edit = [];

        if (status == 'draftable') {
            $scope.edit.name = $scope.brothers[index].name;
            $scope.edit.initiation_number = $scope.brothers[index].initiation_number;
            $scope.edit.points = $scope.brothers[index].points;
            $scope.edit.executive_council = $scope.brothers[index].executive_council;
            $scope.edit.senior = $scope.brothers[index].senior;
            $scope.edit.coop = $scope.brothers[index].coop;
        } else {
            $scope.edit.name = $scope.exempt_brothers[index].name;
            $scope.edit.initiation_number = $scope.exempt_brothers[index].initiation_number;
            $scope.edit.points = $scope.exempt_brothers[index].points;
            $scope.edit.executive_council = $scope.exempt_brothers[index].executive_council;
            $scope.edit.senior = $scope.exempt_brothers[index].senior;
            $scope.edit.coop = $scope.exempt_brothers[index].coop;
        }

        $scope.showEditForm = true;

        // Delete brother via DELETE request
        $scope.deleteBrother = function() {
            $http.delete('/api/v1/brother/' + $scope.edit.initiation_number).then(function(response) {
                console.log(response);
            });
        }

        // Edit brother via PUT request
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

    $scope.runDraft = function() {
        $scope.drafted = null;
        $scope.draftStatus = true;
        $scope.drafted = [];

        var sober = parseInt($scope.draft.sober);
        var door = parseInt($scope.draft.door);
        var driver = parseInt($scope.draft.driver);
        var extra = parseInt($scope.draft.extra);

        for (var x = 0; x < (sober + door + driver + extra); x++) {
            $scope.drafted[x] = $scope.brothers[x].name;
        }

        shuffle($scope.drafted);

        for (var x = 0; x < $scope.drafted.length; x++) {
            if (x < sober) {
                $scope.drafted[x] = "Sober Monitor: " + $scope.drafted[x];
            } else if (x < sober + driver) {
                $scope.drafted[x] = "Driver: " + $scope.drafted[x];
            } else if (x < sober + door + driver) {
                $scope.drafted[x] = "Doorman: " + $scope.drafted[x];
            } else {
                $scope.drafted[x] = "Extra: " + $scope.drafted[x];
            }
        }

        $scope.draftStatus = false;
    }

    $scope.clearDraft = function() {
        $scope.draft.sober = 2;
        $scope.draft.door = 1;
        $scope.draft.driver = 2;
        $scope.draft.extra = 0;

        $scope.drafted = null;
        $scope.draftStatus = true;
    }

    /**
    *    Front-end functionality
    *    These functions are used by the pug templates to provide
    *    a more smooth, easy to use interface.
    */
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
});

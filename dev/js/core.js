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

        // $scope.brothers.max_points = 0;
        // for (var x = 0; x < $scope.brothers.length; x++) {
        //     if ($scope.brothers[x].points > $scope.brothers.max_points) {
        //         $scope.brothers.max_points = $scope.brothers[x].points;
        //     }
        // }
        //
        // $scope.brothers.total_missed_points = 0;
        // for (var x = 0; x < $scope.brothers.length; x++) {
        //     $scope.brothers[x].missed_points = $scope.brothers.max_points - $scope.brothers[x].points;
        //     $scope.brothers.total_missed_points += $scope.brothers[x].missed_points;
        // }
        //
        // for (var x = 0; x < $scope.brothers.length; x++) {
        //     $scope.brothers[x].chance = $scope.brothers[x].missed_points / $scope.brothers.total_missed_points;
        //     $scope.brothers[x].chance_display = Math.round(($scope.brothers[x].missed_points / $scope.brothers.total_missed_points) * 1000) / 10;
        // }

        console.timeEnd("concatenation");
        console.log("Max total points: " + $scope.brothers.max_points);
        console.log("Max missed points: " + $scope.brothers.total_missed_points);
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
        var sober = $scope.draft.sober;
        var door = $scope.draft.door;
        var driver = $scope.draft.driver;
        var extra = $scope.draft.extra;
        $scope.drafted = [];

        var total = sober + door + driver + extra;

        for (var x = 0; x < total; x++) {
            if (x < sober) {
                $scope.drafted[x] = "Sober Monitor: " + $scope.brothers[x].name;
            }
            else if (x < sober + driver) {
                $scope.drafted[x] = "Driver: " + $scope.brothers[x].name;
            }
            else if (x < sober + driver + door) {
                $scope.drafted[x] = "Doorman: " + $scope.brothers[x].name;
            }
            else {
                $scope.drafted[x] = "Extra: " + $scope.brothers[x].name;
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

var transformSvc = function ($q, $filter) {

    var years = ['2011','2012','2013'];

    var teams = {
    };

    var service = {
        gamesForYear: gamesForYear,
        gameRowsAsObjects:gameRowsAsObjects,
        years: years
    };

    function gamesForYear(games, year) {
        //todo: fix hardcoded row index ref
        return $filter('filter')(games, function (row) { return row[3] == year; })
    }



    return service;

};

transformSvc.$inject = ['$q','$filter'];

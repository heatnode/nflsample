var LandingCtrl = function ($scope, qbData, transform, charts) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        title: 'there are those who call me landing',
        //todo: fix hardcode
        selectedQB: qbData.selectedQB, 
        selectedYear: '2011'
    };

    self.headers = [];
    self.qbOptions = qbData.options;
    self.yearOptions = transform.years;
    self.games = [];
    self.chart = charts.getChart('cmpOverAttempts');

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.games = result.games;
            self.headers = result.header;
            //self.gamesForYear = $filter('filter')(self.games, function (row) { return row[3] == '2011'; });
            self.gamesForYear = transform.gamesForYear(result.rows, self.model.selectedYear);
            var test = transform.gameRowsAsObjects(self.gamesForYear, self.headers);
            console.log(test);
            charts.updateChart(self.chart, self.gamesForYear);
        });
    }

    self.changeYear = function (year) {
        if (self.games.length) {
            self.gamesForYear = transform.gamesForYear(self.games, year);
            charts.updateChart(self.chart, self.gamesForYear);
        }
    }

    //$scope.$on('qbDataSvc:updated', function () {
    //    self.games = qbData.dataset.rows;
    //    self.gamesForYear = $filter('filter')(self.games, function (row) { return row[3] == '2011'; });
    //    updateChartData();
    //});
     
    



//end chart stuff


}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'qbDataSvc', 'transformSvc', 'chartSvc'];

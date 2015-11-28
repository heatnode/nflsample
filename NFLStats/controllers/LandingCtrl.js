var LandingCtrl = function ($scope, qbData, transform, charts) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        title: 'there are those who call me landing',
        //todo: fix hardcode
        selectedQB: qbData.selectedQB, 
        selectedYear: '2011',
        selectedType: 'cmpOverAttempts'
    };

    self.headers = [];
    self.qbOptions = qbData.options;
    self.yearOptions = transform.years;
    self.chartOptions = charts.charts;

    self.games = [];
    self.chart = charts.getChart('cmpOverAttempts');

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.games = result.games;
            self.headers = result.header;
            self.qbImgSrc = result.qbImgSrc;
            self.gamesForYear = transform.gamesForYear(self.games, self.model.selectedYear);

            charts.updateChart(self.chart, self.gamesForYear);
        });
    }

    self.changeYear = function (year) {
        if (self.games.length) {
            self.gamesForYear = transform.gamesForYear(self.games, year);
            charts.updateChart(self.chart, self.gamesForYear);
        }
    }

    $scope.$watch(
            function watchSelections(scope) {
                // Return the "result" of the watch expression.
                return self.model.selectedType;
            },
            function handleSelections(newValue, oldValue) {
                if (self.games.length) {
                    self.chart.statType = newValue;
                    //self.chart = charts.getChart(newValue);
                    charts.updateChart(self.chart, self.gamesForYear);
                }
            }
        );

    //$scope.$watch('self.model.selectedType', function (newVal, oldVal) {
    //    console.log(newVal);
    //    console.log(oldVal);
    //});

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

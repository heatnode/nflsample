var QBPerformanceCtrl = function ($scope, qbData, transform, charts) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        //todo: fix hardcode
        selectedQB: qbData.selectedQB, 
        selectedYear: '2013',
        selectedType: 'cmpPctLine',
        selectedWeek: null,
        weekDetails: null
    };

    //self.summary = { header: [], rows: [] };
    self.summary = {};
    self.headers = [];
    self.qbOptions = qbData.options;
    self.yearOptions = transform.years;
    self.chartOptions = charts.charts;

    self.games = [];
    self.chart = charts.getChart(self.model.selectedType);

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.model.weekDetails = null;
            self.dataset = result;
            self.games = result.rows;
            self.headers = result.header;
            self.qbImgSrc = result.qbImgSrc;
            self.dsForYear = transform.gamesForYear(self.dataset, self.model.selectedYear);

            self.summary = transform.getQBSummary(self.dataset);
            charts.updateChart(self.chart, self.dsForYear);
        });
    }

    self.changeYear = function (year) {
        if (self.games.length) {
            self.dsForYear = transform.gamesForYear(self.dataset, year);
            charts.updateChart(self.chart, self.dsForYear);
        }
    }

    self.showColumn = function(idx, dataset){
        return (dataset.displayCols.indexOf(idx) != -1);
    }

    self.selectWeek = function (row) {
        self.model.selectedWeek = row;
        self.model.weekDetails = transform.getDetailsForWeek(self.dsForYear, row);
    }

    $scope.$on('tooltip:updated', function (week, w) {
//        angularEvent.targetScope.$parent.event = event;
  //      angularEvent.targetScope.$parent.$digest();
        console.log(w);
    });

    $scope.$watch(
            function watchSelections(scope) {
                // Return the "result" of the watch expression.
                return self.model.selectedType;
            },
            function handleSelections(newValue, oldValue) {
                if (self.games.length) {
                    self.chart.statType = newValue;
                    //self.chart = charts.getChart(newValue);
                    charts.updateChart(self.chart, self.dsForYear);
                }
            }
        );

    



//end chart stuff


}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
QBPerformanceCtrl.$inject = ['$scope', 'qbDataSvc', 'transformSvc', 'chartSvc'];

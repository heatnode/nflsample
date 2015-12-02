var QBPerformanceCtrl = function ($scope, qbData, transform, charts) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        selectedQB: null, 
        selectedYear: '2015',
        selectedType: 'cmpPctLine',
        selectedWeek: null,
        weekDetails: null,
        showSecondaryChart: true
    };
    self.summary = {};
    self.dataset = null;
    self.qbOptions = qbData.options;
    self.yearOptions = transform.years;
    self.chartOptions = charts.charts;
    self.chart = charts.getChart(self.model.selectedType);

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.model.weekDetails = null;
            self.dataset = result;
            self.dsForYear = transform.gamesForYear(self.dataset, self.model.selectedYear);
            self.summary = transform.getQBSummary(self.dataset);
            var sumop = transform.getOpponentSummary(self.dataset);
            console.log(sumop);
            charts.updateChart(self.chart, self.dsForYear);
        });
    }

    self.changeYear = function (year) {
        if (self.dataset) {
            self.model.weekDetails = null;
            self.dsForYear = transform.gamesForYear(self.dataset, year);
            charts.updateChart(self.chart, self.dsForYear);
        }
    }
    
    self.selectWeek = function (row) {
        self.model.selectedWeek = row;
        self.model.weekDetails = transform.getDetailsForWeek(self.dsForYear, row);
    }
    
    //todo: review
    $scope.$watch(
            function watchSelections(scope) {
                // Return the "result" of the watch expression.
                return self.model.selectedType;
            },
            function handleSelections(newValue, oldValue) {
                if (self.dataset) {
                    self.chart.statType = newValue;
                    //self.chart = charts.getChart(newValue);
                    charts.updateChart(self.chart, self.dsForYear);
                }
            }
        );

    self.showColumn = function (idx, dataset) {
        return (dataset.displayCols.indexOf(idx) != -1);
    }

}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
QBPerformanceCtrl.$inject = ['$scope', 'qbDataSvc', 'transformSvc', 'chartSvc'];

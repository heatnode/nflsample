var QBPerformanceCtrl = function ($scope, qbData, transform, charts) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        //selections
        selectedQB: null, 
        selectedYear: '2015',
        selectedType: 'cmpPYAAllYears',
        selectedWeek: null,
        weekDetails: null,
        showSecondaryChart: true
    };
    //datasets
    self.summary = null;
    self.dataset = null;
    //options
    self.qbOptions = qbData.options;
    self.yearOptions = transform.years;
    self.chartOptions = charts.charts;
    //charts
    self.chart = charts.getChart(self.model.selectedType);
    self.chartSecondary = charts.getChart('cmpPctBarAllYears');

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.model.weekDetails = null;
            self.dataset = result;
            self.dsForYear = transform.gamesForYear(self.dataset, self.model.selectedYear);
            self.summary = transform.getQBSummary(self.dataset);
            //var sumop = transform.getOpponentSummary(self.dataset);
            //todo: how  to pick all years?
            //charts.updateChart(self.chart, self.dsForYear);
            charts.updateChart(self.chart, self.summary);
            charts.updateChart(self.chartSecondary, self.summary);
        });
    }

    self.changeYear = function (year) {
        if (self.dataset) {
            self.model.weekDetails = null;
            self.dsForYear = transform.gamesForYear(self.dataset, year);
            charts.updateChart(self.chart, self.dsForYear);
            charts.updateChart(self.chartSecondary, self.summary);
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

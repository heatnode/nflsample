var QBPerformanceCtrl = function ($scope, qbData, transform, charts) {

    var self = this;
    //todo: create new chart type "Summary or Overview" which will go back to 
    //the double chart view
    //also, create an option that says whether to show weekly stuff or not based on given chart

    //selections
    self.selections = {
        QB: null, 
        year: '2015',
        selectedType: 'cmpPctLine',
        selectedWeek: null,
        weekDetails: null,
        showSecondaryChart: false
    };

    //options
    self.options = {
        qbs: qbData.options,
        years: transform.years,
        charts: charts.charts
    }

    //datasets
    self.data = {
        summaryDS:null,
        fullDS: null,
        yearDS: null
    }

    //charts
    self.chart = charts.getChart(self.selections.selectedType);
    self.chartSecondary = charts.getChart('cmpPctBarAllYears');

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.selections.weekDetails = null;
            self.data.fullDS = result;
            self.data.yearDS = transform.gamesForYear(self.data.fullDS, self.selections.year);
            self.data.summaryDS  = transform.getQBSummary(self.data.fullDS);
            //var sumop = transform.getOpponentSummary(self.data.fullDS);
            //todo: how  to pick all years?
            //charts.updateChart(self.chart, self.data.yearDS);
            charts.updateChart(self.chart, self.data.yearDS);
            charts.updateChart(self.chartSecondary, self.data.summaryDS);
        });
    }

    self.changeYear = function (year) {
        if (self.data.fullDS) {
            self.selections.weekDetails = null;
            self.data.yearDS = transform.gamesForYear(self.data.fullDS, year);
            charts.updateChart(self.chart, self.data.yearDS);

            charts.updateChart(self.chartSecondary, self.data.summaryDS);
        }
    }

    self.changeChart = function (chartType) {
        if (self.data.fullDS) {
            self.chart.statType = chartType;
            charts.updateChart(self.chart, self.data.yearDS);
        }
    }
    
    
    self.selectWeek = function (row) {
        self.selections.selectedWeek = row;
        self.selections.weekDetails = transform.getDetailsForWeek(self.data.yearDS, row);
    }
    
    //todo: review
    //$scope.$watch(
    //        function watchSelections(scope) {
    //            // Return the "result" of the watch expression.
    //            return self.selections.selectedType;
    //        },
    //        function handleSelections(newValue, oldValue) {
    //            if (self.data.fullDS) {
    //                self.chart.statType = newValue;
    //                //self.chart = charts.getChart(newValue);
    //                charts.updateChart(self.chart, self.data.yearDS);
    //            }
    //        }
    //    );

    self.showColumn = function (idx, dataset) {
        return (dataset.displayCols.indexOf(idx) != -1);
    }

}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
QBPerformanceCtrl.$inject = ['$scope', 'qbDataSvc', 'transformSvc', 'chartSvc'];

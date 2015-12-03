var QBPerformanceCtrl = function ($scope, qbData, transform, charts) {

    var self = this;
    //todo: create new chart type "Summary or Overview" which will go back to 
    //the double chart view
    //also, create an option that says whether to show weekly stuff or not based on given chart
    //special purpose summary entry
    var summaryDef = {
        label: "Summary Charts",
        dataType: "yearly",
        key: "cmpPctAllYears",
        keySecondary: "cmpPYAAllYears",
        isSummaryDef:true
    };
    //selections
    self.selections = {
        QB: null, 
        year: '2015',
        //selectedDef: 'cmpPctLine',
        selectedDef:summaryDef,
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
    
    self.options.charts.push(summaryDef);

    //datasets
    self.data = {
        summaryDS:null,
        fullDS: null,
        yearDS: null
    }

    //charts
    self.chart = charts.getChart(self.selections.selectedDef.key);
    self.chartSecondary = charts.getChart('cmpPctAllYears');

    self.changeQB = function (qb) {
        qbData.setQB(qb).then(function (result) {
            self.selections.weekDetails = null;
            self.data.fullDS = result;
            self.data.yearDS = transform.gamesForYear(self.data.fullDS, self.selections.year);
            self.data.summaryDS  = transform.getQBSummary(self.data.fullDS);
            updateCharts();
        });
    }

    self.changeYear = function (year) {
        if (self.data.fullDS) {
            self.selections.weekDetails = null;
            self.data.yearDS = transform.gamesForYear(self.data.fullDS, year);
            updateCharts();
        }
    }

    self.changeChart = function (key) {
        if (self.data.fullDS) {
            updateCharts();
        }
    }


    function updateCharts() {
        var def = self.selections.selectedDef;
        var ds = (def.dataType == 'weekly') ? self.data.yearDS : self.data.summaryDS;
        self.chart.key = def.key;
        charts.updateChart(self.chart, ds);
        if (def.isSummaryDef) {
            self.chartSecondary.key = def.keySecondary;
            //only uses summary data for now
            charts.updateChart(self.chartSecondary, self.data.summaryDS);
        }
    }
    
    
    self.selectWeek = function (row) {
        self.selections.selectedWeek = row;
        self.selections.weekDetails = transform.getDetailsForWeek(self.data.yearDS, row);
    }

    //used for chart drilldown
    $scope.$on('chartSvc:summaryBarClick', function (e, key, year) {
        //find def by key so we can select it
        //debugger;
        var def = self.options.charts.filter(function (o) {
            return o.key == key;
        })[0];
        self.selections.selectedDef = def;
        self.selections.year = year;
        $scope.$apply();
        //kind of side-effecty but this will update the chart as well
        self.changeYear(year);
    });
    
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

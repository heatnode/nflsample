var LandingCtrl = function ($scope, qbData, $filter) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.model = {
        title: 'there are those who call me landing',
        selectedQB: qbData.selectedQB
    };

    self.qbOptions = qbData.options;
    self.games = [];

    self.changeQB = function (qb) {
        qbData.setQB(qb);
    }

    $scope.$on('qbDataSvc:updated', function () {
        self.games = qbData.dataset.rows;
        self.gamesForYear = $filter('filter')(self.games, function (row) { return row[3] == '2011'; });
        updateChartData();
    });

    //chart stuff
    /* Chart options */
    //self.options = { /* JSON data */ };

    /* Chart data */
    //self.chartData = { /* JSON data */ }
    self.chart = {};
    self.chart.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
            }
        }
    };

    function updateChartData() {
        var values = [];
        for (var i = 0; i < 16; i++) {
            var weekData = {
                "label": "Week " + (i + 1),
                "value": self.gamesForYear[i][11]
            }
            values.push(weekData);
        }
        //first number is attempts, second is completions
        //note newData is an array
        var newData = [{
            key: "Completions",
            values: values
        }];
        //debugger;
        self.chart.api.updateWithData(newData);

        //debugger;
        //self.chart.api.update();
        //self.chart.api.refresh();
        //$scope.$apply()
    }

    self.chart.data = [];
    //    {
    //        key: "Cumulative Return",
    //        values: [
    //            {
    //                "label": "A",
    //                "value": -29.765957771107
    //            },
    //            {
    //                "label": "B",
    //                "value": 0
    //            },
    //            {
    //                "label": "C",
    //                "value": 32.807804682612
    //            },
    //            {
    //                "label": "D",
    //                "value": 196.45946739256
    //            },
    //            {
    //                "label": "E",
    //                "value": 0.19434030906893
    //            },
    //            {
    //                "label": "F",
    //                "value": -98.079782601442
    //            },
    //            {
    //                "label": "G",
    //                "value": -13.925743130903
    //            },
    //            {
    //                "label": "H",
    //                "value": -5.1387322875705
    //            }
    //        ]
    //    }
    //]

//end chart stuff


}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'qbDataSvc','$filter'];

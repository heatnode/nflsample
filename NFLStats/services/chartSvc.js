var chartSvc = function ($q, $filter) {

    //var charts = Object.keys(chartTypeDefs);

    var service = {
        getChart: getChart,
        updateChart: updateChartData
        //change: change
    }
    var chartTypeDefs = {
        cmpOverAttempts: { 
            updateDataFn: updateCmpOverAtt,
            options: {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    stacked: true,
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
            }
        },
        cmpPctLine: {
            updateDataFn: updateCmpPctLine,
            options: {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    //x: function (d) { return d.x; },
                    //y: function (d) { return d.y; },
                    x: function (d) {  return d.label; },
                    y: function (d) { return d.value; },
                    showValues:true,
                    valueFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    useInteractiveGuideline: true,
                    dispatch: {
                        stateChange: function (e) { console.log("stateChange"); },
                        changeState: function (e) { console.log("changeState"); },
                        tooltipShow: function (e) { console.log("tooltipShow"); },
                        tooltipHide: function (e) { console.log("tooltipHide"); }
                    },
                    xAxis: {
                        axisLabel: 'Week'
                    },
                    yAxis: {
                        axisLabel: 'Completion Percentage',
                        axisLabelDistance: -10
                    },
                    callback: function (chart) {
                        console.log("!!! lineChart callback !!!");
                    }
                },
                title: {
                    enable: true,
                    text: 'Title for Line Chart'
                },
                subtitle: {
                    enable: true,
                    text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                    css: {
                        'text-align': 'center',
                        'margin': '10px 13px 0px 7px'
                    }
                },
                caption: {
                    enable: true,
                    html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                    css: {
                        'text-align': 'justify',
                        'margin': '10px 13px 0px 7px'
                    }
                }
            }
        }
    }

    service.charts = Object.keys(chartTypeDefs);

    function getChart(statChartType) {
        var chart = {
            data: [],
            options: chartTypeDefs[statChartType].options,
            statType: statChartType
        };
        return chart;
    }


    function updateChartData(chart, games) {
        chart.data = chartTypeDefs[chart.statType].updateDataFn(games);
        chart.options = chartTypeDefs[chart.statType].options;
        //chart.api.updateWithData(newData);
        //updateWithOptions(options)	Update chart with new options json.
        //updateWithData(data)
        chart.api.refreshWithTimeout(5);
    }

    function updateCmpPctLine(games) {
        var cmpPctSeries = {
            key: "Completion Percentage",
            values: []
        };

        games.forEach(function (game) {
            //var label = "Week " + game.week;
            var label = game.week;
            cmpPctSeries.values.push({
                label: label,
                value: game.CmpPct
            })
        })

        //first number is attempts, second is completions
        //note newData is an array
        return [cmpPctSeries];
    }



    function updateCmpOverAtt(games) {
        
        var cmpSeries = {
            key: "Completions",
            values: []
        };

        var attmpSeries = {
            key: "Attempts",
            values: []
        }

        games.forEach(function (game) {
            var label = "Week " + game.week;
            attmpSeries.values.push({
                label: label,
                value: game.Att
            })

            cmpSeries.values.push({
                label: label,
                value: game.Cmp
            });
        })

        //first number is attempts, second is completions
        //note newData is an array
        return [cmpSeries, attmpSeries];
    }

    return service;

};

chartSvc.$inject = ['$q', '$filter'];

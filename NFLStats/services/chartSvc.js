var chartSvc = function ($q, $filter) {

    var charts = ['compOverAttempts', 'compPctLine'];

    var service = {
        getChart: getChart,
        updateChart: updateChartData,
    };

    var chartTypeOptions = {
        'cmpOverAttempts': {
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
        },
        'cmpPctLine': {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
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

    function getChart(statType) {
        var chart = {
            data: [],
            options: chartTypeOptions[statType],
            statType: statType
        };
        return chart;
    }


    function updateChartData(chart, games) {
        console.log(chart.statType);
        var cmpSeries = {
            key: "Completions",
            values: []
        };

        var attmpSeries = {
            key: "Attempts",
            values: []
        }

        //todo: clean up
        for (var i = 0; i < 16; i++) {
            var label = "Week " + games[i][4];
            attmpSeries.values.push({
                label: label,
                value: games[i][10]
            })

            cmpSeries.values.push({
                label: label,
                value: games[i][11]
            });
        }
        //first number is attempts, second is completions
        //note newData is an array
        var newData = [cmpSeries, attmpSeries];
        chart.api.updateWithData(newData);
    }

    return service;

};

chartSvc.$inject = ['$q', '$filter'];

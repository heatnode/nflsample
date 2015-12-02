var chartSvc = function ($rootScope, $filter) {

    //var charts = Object.keys(chartTypeDefs);

    var service = {
        getChart: getChart,
        updateChart: updateChartData
        //change: change
    }
    
    var defaultOptions = { 
        //noData: "Please select a quarterback",
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

    var chartTypeDefs = {
        cmpOverAttempts: { 
            updateDataFn: updateCmpOverAtt,
            options: {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    showControls:false,
                    stacked: true,
                    //stackOffset:"expand",
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    legend: {
                        updateState: false,
                        dispatch: {
                            legendClick: function (d, i) {
                                // chartTypeDefs.cmpOverAttempts.options.chart.yAxis.axisLabel = 'test';
                                // console.log(chartTypeDefs.cmpOverAttempts.options.chart.yAxis.axisLabel);
                            }
                        }
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,
                    valueFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'Weeks'
                    },
                    yAxis: {
                        axisLabel: 'Attempts',
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
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues:true,
                    valueFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    interactiveLayer: {
                        tooltip:{
                            headerFormatter: function (hdr) {
                                //todo: bit of a hack here
                                //if (this.selectedWeek != hdr) {
                                //    this.selectedWeek = hdr;
                                //    $rootScope.$broadcast('tooltip:updated', hdr);
                                //}
                                return "Week " + hdr;
                            }
                            //contentGenerator: function (data) {
                            //    $rootScope.$broadcast('tooltip:updated');
                            //    chartTypeDefs.cmpOverAttempts.options.chart.yAxis.axisLabel
                            //    return 
                            //}
                            //    //console.log(data);
                            //    //console.log(key);
                            //    //debugger;
                            //    //return '<h3>' + key + '</h3>' + '<p>' + y + '</p>';
                            //    //return '<div class="tooltip"><h3>yuck</h3><div>this is my custom content</div><hr><p><strong>test</strong> 45';
                            //    }
                            }
                    },
                    useInteractiveGuideline: true,
                    forceX:[0],
                    xAxis: {
                        axisLabel: 'Week'
                    },
                    yAxis: {
                        axisLabel: 'Completion %',
                        axisLabelDistance: -10
                    }
                }
            }
        },
        cmpPctLineBad: {
            updateDataFn: updateLinePlusBar,
            options: {
                chart: {
                    type: 'linePlusBarChart',
                    //type: 'multiChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 50,
                        bottom: 40,
                        left: 50
                    },
                    focusEnable:false,
                    //x: function (d) { return d.x; },
                   // y: function (d) { return d.y; },
                   // x: function (d) { return d.label; },
                  //  y: function (d) { return d.value; },
                    showValues: true,
                    valueFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    //interactiveLayer: {
                    //    tooltip: {
                    //        contentGenerator: function (data) {
                    //            console.log(data);
                    //            return 'this is my custom content';
                    //        }
                    //    }
                    //},
                    useInteractiveGuideline: true,
                    forceX: [0],
                    bars: {
                        forceX: [0,18],
                        //forceY: [0],
                        //yDomain: [0, 25]
                    },
                    lines: {
                        forceX: [0,18],
                        //forceY: [0],
                        //yDomain: [0, 100]
                    },
                    // Set min, max values of axis
                   // yDomain1:[0, 100],
                    //yDomain2:[0, 25],
                    xAxis: {
                        axisLabel: 'Week',
                        //tickFormat: function(d) {
                        //    // I didn't feel like changing all the above date values
                        //    // so I hack it to make each value fall on a different date
                        //    return 'weeke ' + d.label;
                        //}
                        //tickFormat: function (d) {
                        //    // I didn't feel like changing all the above date values
                        //    // so I hack it to make each value fall on a different date
                        //    console.log(d);
                        //    return d.label;
                        //}
                    },
                    yAxis1: {
                        axisLabel: 'Completion %',
                        axisLabelDistance: -10

                    },
                    yAxis2: {
                        axisLabel: 'Yds attempt',
                        axisLabelDistance: -10
                        //tickFormat: function (d) {
                        //    // I didn't feel like changing all the above date values
                        //    // so I hack it to make each value fall on a different date
                        //    return d.label;
                        //}
                    },
                    //chart.yAxis1.tickFormat(d3.format(',.1f'));
                    //chart.yAxis2.tickFormat(d3.format(',.1f'));
                    callback: function (chart) {
                        console.log("!!! lineChart callback !!!");
                    }
                }
            }
        }
    }

    service.charts = Object.keys(chartTypeDefs);

    return service;  

    function getChart(statChartType) {
        var chart = {
            data: [],
            options: chartTypeDefs[statChartType].options,
            statType: statChartType
        };
        return chart;
    }


    function updateChartData(chart, ds) {
        chart.data = chartTypeDefs[chart.statType].updateDataFn(ds);
        chart.options = chartTypeDefs[chart.statType].options;
        chart.api.refreshWithTimeout(5);
    }

    function updateLinePlusBar(ds) {
        var cmpPctSeries = {
            key: "Completion %",
            values: [],
        };

        var ydsAttSeries = {
            key: "Yds per Attempt",
            values: [],
            bar: true,
        };

        var weekIdx = ds.getIndex("week");
        var cmpPctIdx = ds.getIndex("CmpPct");
        var ydAttIdx = ds.getIndex("PYA");

        ds.rows.forEach(function (row) {
            //var label = "Week " + game.week;
            var label = row[weekIdx];
            cmpPctSeries.values.push({ x: label, y: row[cmpPctIdx] });
            ydsAttSeries.values.push({x: label, y: row[ydAttIdx]});
        })

        return [ydsAttSeries, cmpPctSeries];
    }


    function updateCmpPctLine(ds) {
        var cmpPctSeries = {
            key: "Completion %",
            values: [] 
        };

        var weekIdx = ds.getIndex("week");
        var cmpPctIdx = ds.getIndex("CmpPct");

        ds.rows.forEach(function (row) {
            //var label = "Week " + row[weekIdx];
            var label = row[weekIdx];
            cmpPctSeries.values.push({
                label: label,
                value: row[cmpPctIdx]
            })
        })

        //first number is attempts, second is completions
        //note newData is an array
        return [cmpPctSeries];
    }

    function updateCmpOverAtt(ds) {
        
        var cmpSeries = {
            key: "Completions",
            values: []
        };

        var incmpSeries = {
            key: "Incompletions",
            values: []
        }

        var weekIdx = ds.getIndex("week");
        var cmpIdx = ds.getIndex("Cmp");
        var attIdx = ds.getIndex("Att");

        ds.rows.forEach(function (row) {
            var label = "Week " + row[weekIdx];
            incmpSeries.values.push({
                label: label,
                value: row[attIdx] - row[cmpIdx]
            })

            cmpSeries.values.push({
                label: label,
                value: row[cmpIdx]
            });
        })

        return [cmpSeries, incmpSeries];
    }



};

chartSvc.$inject = ['$rootScope', '$filter'];

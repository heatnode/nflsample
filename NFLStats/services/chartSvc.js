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
        },
         allYearColors: d3.scale.category20b().domain([2011, 2012, 2013, 2014, 2015])
    }

    var chartTypeDefs = {
        cmpOverAttempts: {
            label: "Completions/Att by Week",
            dataType:"weekly",
            updateDataFn: updateCmpOverAtt,
            options: {
                chart: {
                    height: 450,
                    duration: 200,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,

                    type: 'multiBarChart',
                    legend: {
                        updateState: false
                    },
                    showControls: false,
                    stacked: true,
                    //stackOffset:"expand",
                    
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
            label: "Completion % by Week",
            dataType: "weekly",
            updateDataFn: updateCmpPctLine,
            options: {
                chart: {
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,

                    type: 'lineChart',
                    interactiveLayer: {
                        tooltip:{
                            headerFormatter: function (hdr) {
                                return "Week " + hdr;
                            }
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
        //year charts 
        cmpPctAllYears: {
            label: "Completion % by Year",
            dataType: "yearly",
            updateDataFn: updateCmpPctBarAllYears,
            options: {
                chart: {

                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,

                    type: 'discreteBarChart',
                    height: 400, //todo: slightly diff
                    color: function (o, pos) { return defaultOptions.allYearColors(o.label); },
                    interactiveLayer: {
                        tooltip: {
                            headerFormatter: function (hdr) {
                                return "Year " + hdr;
                            }
                        }
                    },
                    useInteractiveGuideline: true,
                    yDomain: [45, 75],
                    xDomain: [2011, 2012, 2013, 2014, 2015],
                    xAxis: {
                        axisLabel: 'Year'
                    },
                    yAxis: {
                        axisLabel: 'Completion %',
                        axisLabelDistance: -10
                    }
                }
            }
        },

        cmpPYAAllYears: {
            label: "Pass Yds by Year",
            dataType: "yearly",
            updateDataFn: updatePYABarAllYears,
            options: {
                chart: {
                    
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,
                    //todo: note: exactly like other year except for label on y and ydomain
                    type: 'discreteBarChart',
                    height: 400,
                    color: function (o, pos) { return defaultOptions.allYearColors(o.label); },
                    valueFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    interactiveLayer: {
                        tooltip: {
                            headerFormatter: function (hdr) {
                                return "Year " + hdr;
                            }
                        }
                    },
                    useInteractiveGuideline: true,
                    xDomain:[2011,2012,2013,2014,2015],
                    xAxis: {
                        axisLabel: 'year'
                    },
                    yAxis: {
                        axisLabel: 'Pass Yards Per Attempt',
                        axisLabelDistance: -10
                    },
                    callback: function (c) {
                        d3.selectAll(".nv-bar").on('click', function (e) {
                            console.log(e);
                        });
                    }
                }
            }
        }
    }
    
    service.charts = Object.keys(chartTypeDefs).map(function (key) {
        var chartDetailObj = {
            label: chartTypeDefs[key].label,
            dataType: chartTypeDefs[key].dataType,
            key: key
        }
        return chartDetailObj;
    });

    return service;  

    function getChart(key) {
        var chart = {
            data: [],
            options: chartTypeDefs[key].options,
            key: key
        };
        return chart;
    }


    function updateChartData(chart, ds) {
        chart.data = chartTypeDefs[chart.key].updateDataFn(ds);
        chart.options = chartTypeDefs[chart.key].options;
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

    //refactor with above and the bar one
    //todo: just take in summary dataset insetad of yearly
    function updateCmpPctLineAllYears(ds) {
        var cmpPctSeries = {
            key: "Completion %",
            values: []
        };

        var gdIdx = ds.getIndex("gameDate");
        var cmpPctIdx = ds.getIndex("CmpPct");

        ds.rows.forEach(function (row) {
            //yuck
            var label = row[gdIdx].substring(0, 10).replace(/-/g, "");
            console.log(label);
            cmpPctSeries.values.push({
                label: label,
                value: row[cmpPctIdx]
            })
           // console.log(label)
        })

        //invert the order by year
        //cmpPctSeries.values.sort(function (a, b) {
        //    return a.value > b.value;
        //});

        return [cmpPctSeries];
    }

    //refactor with above
    //todo: just take in summary dataset insetad of yearly
    function updateCmpPctBarAllYears(ds) {
        var cmpPctSeries = {
            key: "Completion %",
            values: []
        };

        var yearIdx = ds.getIndex("Year");
        var cmpPctIdx = ds.getIndex("CmpPct");

        ds.rows.forEach(function (row) {
            var label = row[yearIdx];
            cmpPctSeries.values.push({
                label: label,
                value: row[cmpPctIdx]
            })
        })

        //invert the order by year
        cmpPctSeries.values.sort(function (a, b) {
            return a.value > b.value;
        });

        return [cmpPctSeries];
    }

    //refactor with above
    //todo: just take in summary dataset insetad of yearly
    function updatePYABarAllYears(ds) {
        var cmpPctSeries = {
            key: "Pass Yards Per Attempt",
            values: []
        };

        var yearIdx = ds.getIndex("Year");
        var pyaIdx = ds.getIndex("PYA");

        ds.rows.forEach(function (row) {
            var label = row[yearIdx];
            cmpPctSeries.values.push({
                label: label,
                value: row[pyaIdx]
            })
        })
        //debugger;
        //invert the order by year
        cmpPctSeries.values.sort(function (a, b) {
            return a.value > b.value;
        });

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

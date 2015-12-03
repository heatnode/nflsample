var chartSvc = function ($rootScope, $filter) {

    //var charts = Object.keys(chartTypeDefs);

    var service = {
        getChart: getChart,
        updateChart: updateChartData
        //change: change
    }

    //shared options across charts
    function basicChartOptions() {
        return {
            height: 400,
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
        }
    }

    function summaryChartOptions(targetkey) {
        var basic = basicChartOptions();
        var allYearColors = d3.scale.category20b().domain([2011, 2012, 2013, 2014, 2015]);

        var summary = {
            type: 'discreteBarChart',
            height: 400, //todo: slightly diff
            color: function (o, pos) { return allYearColors(o.label); },
            discretebar: {
                dispatch: { 
                    elementClick: function (e) {
                        var year = e.data.label;
                        $rootScope.$broadcast('chartSvc:summaryBarClick',targetkey, year);
                    },
                }
            },
            xAxis: {
                axisLabel: 'Year'
            }
        }
        return angular.merge(basic, summary);
    }

    var chartTypeDefs = {
        cmpOverAttempts: {
            label: "Completions/Att by Week",
            dataType:"weekly",
            updateDataFn: updateCmpOverAtt,
            options: {
                title: {
                    enable: true,
                    text: 'Completions and Incompletions (Total Attempts) for each week'
                },
                chart: angular.merge(basicChartOptions(), {
                    type: 'multiBarChart',
                    legend: {
                        updateState: false
                    },
                    showControls: false,
                    stacked: true,
                    xAxis: {
                        axisLabel: 'Weeks'
                    },
                    yAxis: {
                        axisLabel: 'Attempts',
                        axisLabelDistance: -10
                    }
                })
            }
        },
        cmpPctLine: {
            label: "Completion % by Week",
            dataType: "weekly",
            updateDataFn: updateCmpPctLine,
            options: {
                title: {
                    enable: true,
                    text: 'Completion Percentage by week'
                },
                chart: angular.merge(basicChartOptions(), {
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
                })
            }
        },
        cmpPYALine: {
            label: "Pass Yds/Att by Week",
            dataType: "weekly",
            updateDataFn: updatePYALine,
            options: {
                title: {
                    enable: true,
                    text: 'Passing Yards per Attept by Week'
                },
                chart: angular.merge(basicChartOptions(), {
                    type: 'lineChart',
                    interactiveLayer: {
                        tooltip: {
                            headerFormatter: function (hdr) {
                                return "Week " + hdr;
                            }
                        }
                    },
                    useInteractiveGuideline: true,
                    forceX: [0],
                    yDomain:[0,15],
                    xAxis: {
                        axisLabel: 'Week'
                    },
                    yAxis: {
                        axisLabel: 'Pass Yards Per Attempt',
                        axisLabelDistance: -10
                    }
                })
            }
        },
        //year charts 
        cmpPctAllYears: {
            label: "Completion % by Year",
            dataType: "yearly",
            updateDataFn: updateCmpPctBarAllYears,
            options: {
                title: {
                    enable: true,
                    text: 'Completion Percentage by Year'
                },
                chart: angular.merge(summaryChartOptions('cmpPctLine'), {
                    yDomain: [45, 75],
                    xDomain: [2011, 2012, 2013, 2014, 2015],
                    yAxis: {
                        axisLabel: 'Completion %',
                        axisLabelDistance: -10
                    }
                })
            }
        },

        cmpPYAAllYears: {
            label: "Pass Yds/Att by Year",
            dataType: "yearly",
            updateDataFn: updatePYABarAllYears,
            options: {
                title: {
                    enable: true,
                    text: 'Passing Yards per Attept by Year'
                },
                chart: angular.merge(summaryChartOptions('cmpPYALine'), {
                    xDomain:[2011,2012,2013,2014,2015],
                    yAxis: {
                        axisLabel: 'Pass Yards Per Attempt',
                        axisLabelDistance: -10
                    }
                })
            }
        }
    }
    
    //return array that contains objects that describe the chart definitions
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

    
    function updatePYALine(ds) {
        return updateWeekLineData(ds, "Pass Yards Per Attempt", "PYA");
    }

    function updateCmpPctLine(ds) {
        return updateWeekLineData(ds, "Completion %", "CmpPct");
    }

    function updateWeekLineData(ds, key, stat) {
        var series = {
            key: key,
            values: []
        };

        var weekIdx = ds.getIndex("week");
        var statIdx = ds.getIndex(stat);

        ds.rows.forEach(function (row) {
            var label = row[weekIdx];
            series.values.push({
                label: label,
                value: row[statIdx]
            })
        })
        return [series];
    }

    //function updateCmpPctLine(ds) {
    //    var cmpPctSeries = {
    //        key: "Completion %",
    //        values: [] 
    //    };

    //    var weekIdx = ds.getIndex("week");
    //    var cmpPctIdx = ds.getIndex("CmpPct");

    //    ds.rows.forEach(function (row) {
    //        //var label = "Week " + row[weekIdx];
    //        var label = row[weekIdx];
    //        cmpPctSeries.values.push({
    //            label: label,
    //            value: row[cmpPctIdx]
    //        })
    //    })

    //    //first number is attempts, second is completions
    //    //note newData is an array
    //    return [cmpPctSeries];
    //}

    //refactor with above and the bar one
    //todo: just take in summary dataset insetad of yearly
    //function updateCmpPctLineAllYears(ds) {
    //    var cmpPctSeries = {
    //        key: "Completion %",
    //        values: []
    //    };

    //    var gdIdx = ds.getIndex("gameDate");
    //    var cmpPctIdx = ds.getIndex("CmpPct");

    //    ds.rows.forEach(function (row) {
    //        //yuck
    //        var label = row[gdIdx].substring(0, 10).replace(/-/g, "");
    //        console.log(label);
    //        cmpPctSeries.values.push({
    //            label: label,
    //            value: row[cmpPctIdx]
    //        })
    //       // console.log(label)
    //    })

    //    //invert the order by year
    //    //cmpPctSeries.values.sort(function (a, b) {
    //    //    return a.value > b.value;
    //    //});

    //    return [cmpPctSeries];
    //}

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

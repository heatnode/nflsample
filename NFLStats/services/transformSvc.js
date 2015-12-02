var transformSvc = function ($filter, stats) {

    var years = ['2011','2012','2013'];

    var teams = {
    };

    var service = {
        gamesForYear: gamesForYear,
        getQBSummary: getQBSummary,
        getDetailsForWeek:getDetailsForWeek,
        years: years,
        addLookup:addLookup
    };

    return service;

    function getDetailsForWeek(ds, week) {
        //var week = ds.rows[0];
        var detailsObj = {
            data: {},
            gameDateString: $filter('date')(new Date(week[ds.getIndex('gameDate')]),'MM/dd/yyyy'),
            opponentImage: week[ds.getIndex('opponentImage')],
            teamImage: week[ds.getIndex('teamImage')],
            qbName: week[ds.getIndex('fullName')]
        };
        var indexToIgnore = [0, 1, 2,5,7,9];
        ds.header.forEach(function (hdrObj, idx) {
            //if this is NOT in the list of ignored indexes
            if (indexToIgnore.indexOf(idx) == -1) {
                //try for desc or fall back to name
                var key = hdrObj.name || hdrObj.label; 
                detailsObj.data[key] = week[idx];
            }
        })
        
        return detailsObj;
    }

    function gamesForYear(ds, year) {
        var filteredDs = angular.copy(ds);
        filteredDs.rows = $filter('filter')(filteredDs.rows, function (row) { return row[filteredDs.getIndex('seasonYear')] == year; })
        //todo: not sure where to set this
        filteredDs.displayCols = [4, 8, 10, 14, 15, 19, 20];
        //filteredDs.displayCols = [4, 8, 10,11,12,13, 14,15,16,17,18, 19, 20];
        return filteredDs;
    }

    function getQBSummary(dataset) {
        var summaryDataSet = {
            header: [{ label: 'Year' }, { label: 'PsYds', name:'Passing Yards' }, { label: 'Att' }, { label: 'Cmp' }],
            rows: [],
            displayCols:[0,1,4,5]
        }
        var cmpIdx = dataset.getIndex("Cmp");
        var attIdx = dataset.getIndex("Att");
        var pyIdx = dataset.getIndex("PsYds");
        //could make this a little smarter
        years.forEach(function (year) {
            var yearDS = gamesForYear(dataset, year);

            var tots = yearDS.rows.reduce(function (sumObj, row) {
                sumObj.PsYds = sumObj.PsYds + row[pyIdx];
                sumObj.Att = sumObj.Att + row[attIdx];
                sumObj.Cmp = sumObj.Cmp + row[cmpIdx];
                return sumObj;
            }, { PsYds: 0, Att: 0, Cmp: 0 });
            summaryDataSet.rows.push([year, tots.PsYds, tots.Att, tots.Cmp]);
        });

        //invert the order by year
        summaryDataSet.rows.sort(function (a, b) {
            return a[0] < b[0];
        });
        addLookup(summaryDataSet);
        stats.AddCmpPctToDataSet(summaryDataSet);
        stats.AddYdsPerAttToDataSet(summaryDataSet);
        return summaryDataSet;
    }

    function addLookup(dataset) {
        //add function that gets the index based on the label 
        //seems to be like a key for the data
        dataset.getIndex = function (label) {
            var retval = null;
            this.header.some(function (el, idx) {
                if (el.label === label) {
                    retval = idx;
                    return true;
                }
            });
            return retval;
        }
    }

};

transformSvc.$inject = ['$filter', 'statSvc'];

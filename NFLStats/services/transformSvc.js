var transformSvc = function ($filter, stats) {

    var years = ['2011','2012','2013'];

    var teams = {
    };

    var service = {
        gamesForYear: gamesForYear,
        getQBSummary:getQBSummary,
        years: years,
        addLookup:addLookup
    };

    return service;

    function gamesForYear(ds, year) {
        var filteredDs = angular.copy(ds);
        filteredDs.rows = $filter('filter')(filteredDs.rows, function (row) { return row[filteredDs.getIndex('seasonYear')] == year; })
        return filteredDs;
    }

    function getQBSummary(dataset) {
        var summaryDataSet = {
            header: [{ label: 'Year' }, { label: 'PsYds' }, { label: 'Att' }, { label: 'Cmp' }],
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
        //var hdrmap = {};
        //dataset.header.forEach(function (val, idx) {
        //    hdrmap[val.label] = idx;
        //});

        //dataset.val = function (row, label) {
        //    var idx = hdrmap[label];
        //    return row[idx];
        //}
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

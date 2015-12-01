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

    function gamesForYear(games, year) {
        return $filter('filter')(games, function (game) { return game['seasonYear'] == year; })
    }

    function getQBSummary(dataset) {
        var summaryDataSet = {
            header: [{ label: 'Year' }, { label: 'PsYds' }, { label: 'Att' }, { label: 'Cmp' }],
            rows:[]
        }
        //could make this a little smarter
        years.forEach(function (year) {
            var games = gamesForYear(dataset.games, year);
            var tots = games.reduce(function (sumObj, cur) {
                sumObj.PsYds = sumObj.PsYds + cur.PsYds;
                sumObj.Att = sumObj.Att + cur.Att;
                sumObj.Cmp = sumObj.Cmp + cur.Cmp;
                return sumObj;
            }, { PsYds: 0, Att: 0, Cmp: 0 });
            summaryDataSet.rows.push([year, tots.PsYds, tots.Att, tots.Cmp]);
        });
        //invert the order by year
        summaryDataSet.rows.sort(function (a, b) {
            return a[0] < b[0];
        });

        //stats.AddCmpPctToDataSet(dataset);
        //stats.AddYdsPerAttToDataSet(dataset);

        addLookup(summaryDataSet);
        return summaryDataSet;
    }

    function addLookup(dataset) {
        var hdrmap = {};
        dataset.header.forEach(function (val, idx) {
            hdrmap[val.label] = idx;
        });

        dataset.val = function (row, label) {
            var idx = hdrmap[label];
            return row[idx];
        }
    }

};

transformSvc.$inject = ['$filter', 'statSvc'];

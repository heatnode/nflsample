var statSvc = function () {

    var service = {
        AddCmpPctToDataSet: AddCmpPctToDataSet,
        AddYdsPerAttToDataSet: AddYdsPerAttToDataSet
    };

    return service;

    function AddCmpPctToDataSet(dataset) {
        AddStatToDataSet(dataset, 'CmpPct', CalcCmpPct);
    }

    function AddYdsPerAttToDataSet(dataset) {
        AddStatToDataSet(dataset, 'PsYdsAtt', CalcYdsPerAtt);
    }
    
    function AddStatToDataSet(ds, name, statfn) {
        var statname = name;
        ds.header.push({ label: name });
        //todo: fix this hack
        if (ds.years) {
            ds.years.forEach(function (tp) {
                tp[statname] = statfn(tp);
            });
        } else {
            ds.games.forEach(function (game) {
                game[statname] = statfn(game);
            });
        }
    }
    //timePeriod could be game, year, qtr
    function CalcCmpPct(timePeriod) {
        var result = timePeriod.Att && (timePeriod.Cmp / timePeriod.Att) * 100;
        return Math.round(result);
    }

    function CalcYdsPerAtt(timePeriod) {
        var result = timePeriod.Att && (timePeriod.PsYds / timePeriod.Att);
        return result.toFixed(2);
    }

};

//transformSvc.$inject = ['$filter'];
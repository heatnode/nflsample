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
        AddStatToDataSet(dataset, 'PYA', CalcYdsPerAtt);
    }
    
    function AddStatToDataSet(ds, name, statfn) {
        var statname = name;
        ds.header.push({ label: name });
        //todo: fix this hack
        //if (ds.years) {
        //    ds.years.forEach(function (tp) {
        //        tp[statname] = statfn(tp);
        //    });
        //} else {
        //    ds.games.forEach(function (game) {
        //        game[statname] = statfn(game);
        //    });
        //}
        ds.rows.forEach(function (row) {
            row.push(statfn(ds, row));
            //game[statname] = ;
        });
    }
    //timePeriod could be game, year, qtr
    function CalcCmpPct(ds, timePeriod) {
        var result = timePeriod[ds.getIndex("Att")] && (timePeriod[ds.getIndex("Cmp")] / timePeriod[ds.getIndex("Att")]) * 100;
        return Math.round(result);
    }

    function CalcYdsPerAtt(ds, timePeriod) {
        var result = timePeriod[ds.getIndex("Att")] && (timePeriod[ds.getIndex("PsYds")] / timePeriod[ds.getIndex("Att")]);
        return result.toFixed(2);
    }

};

//transformSvc.$inject = ['$filter'];
var statSvc = function () {

    var service = {
        AddCmpPctToDataSet: AddCmpPctToDataSet,
        AddYdsPerAttToDataSet: AddYdsPerAttToDataSet
    };

    return service;

    function AddCmpPctToDataSet(dataset) {
        var hdrObj = { label: 'CmpPct', name: 'Completion Percentage' };
        AddStatToDataSet(dataset, hdrObj, CalcCmpPct);
    }

    function AddYdsPerAttToDataSet(dataset) {
        var hdrObj = { label: 'PYA', name: 'Pass Yards/Attempt' };
        AddStatToDataSet(dataset, hdrObj, CalcYdsPerAtt);
    }
    
    function AddStatToDataSet(ds, hdrObj, statfn) {
        var statname = hdrObj.label;
        ds.header.push(hdrObj);
        ds.rows.forEach(function (row) {
            row.push(statfn(ds, row));
        });
    }
    //timePeriod could be game, year, qtr
    function CalcCmpPct(ds, timePeriod) {
        var result = timePeriod[ds.getIndex("Att")] && (timePeriod[ds.getIndex("Cmp")] / timePeriod[ds.getIndex("Att")]) * 100;
        //return Math.round(result);
        return result.toFixed(1);
    }

    function CalcYdsPerAtt(ds, timePeriod) {
        var result = timePeriod[ds.getIndex("Att")] && (timePeriod[ds.getIndex("PsYds")] / timePeriod[ds.getIndex("Att")]);
        return result.toFixed(2);
    }

};

//transformSvc.$inject = ['$filter'];
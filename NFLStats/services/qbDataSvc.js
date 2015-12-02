var qbDataSvc = function ($http, stats, transform) {

    var qbDataSources = {
        "Tom Brady": "nfl-1870523.json",
        "Andy Dalton": "nfl-2223207.json",
        "Tony Romo": "nfl-1949528.json"
    };

    var service = {
        dataset: null,
        selectedQB: null,
        options: Object.keys(qbDataSources),//no point in exposing the data side of datasource
        setQB: setQB
    };

    function setQB(qb) {
        var datasetFile = qbDataSources[qb];
        service.selectedQB = qb;
        return loadData(datasetFile);
    }

    function loadData(datasetFile) {
        var url = 'json/' + datasetFile;
        return $http.get(url).then(function (result) {
            var dataset = {
                header: result.data.header,
                rows: result.data.rows
            }
            //decorate dataset with new stats and lookup
            transform.addLookup(dataset);
            stats.AddCmpPctToDataSet(dataset);
            stats.AddYdsPerAttToDataSet(dataset);
            dataset.qbImgSrc = dataset.rows[0][dataset.getIndex("playerImage")]
            service.dataset = dataset;
            return service.dataset;
        }).catch(function (err) {
            console.log(err);
        });
    }

    return service;

};

qbDataSvc.$inject = ['$http', 'statSvc','transformSvc'];

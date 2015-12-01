var qbDataSvc = function ($http, $rootScope, stats, transform) {

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
                games: gameRowsAsObjects(result.data.rows, result.data.header),
                gamerows:result.data.rows
            }
            //debugger;
            //decorate dataset with new stats and lookup
            transform.addLookup(dataset);
            stats.AddCmpPctToDataSet(dataset);
            stats.AddYdsPerAttToDataSet(dataset);
            dataset.qbImgSrc = dataset.val(dataset.gamerows[0],"playerImage");
            service.dataset = dataset;
            $rootScope.$broadcast('qbDataSvc:updated');
            return service.dataset;
        }).catch(function (err) {
            console.log(err);
        });
    }

    //todo: consdier if this should moved to transform
    function gameRowsAsObjects(games, headers) {
        var gamesWithRowAsObj = games.map(function (row) {
            var rObj = {};
            row.forEach(function (val, idx) {
                var key = headers[idx].label;
                rObj[key] = val;
            });
            return rObj;
        });
        return gamesWithRowAsObj;
    }


    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    return service;

};

qbDataSvc.$inject = ['$http', '$rootScope', 'statSvc','transformSvc'];

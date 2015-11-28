var qbDataSvc = function ($http, $rootScope, $q) {

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
                games: gameRowsAsObjects(result.data.rows, result.data.header)
            }
            //decorate dataset with new stats
            AddCmpPctToDataSet(dataset);
            AddYdsPerAttToDataSet(dataset);
            dataset.qbImgSrc = dataset.games[0].playerImage;
            service.dataset = dataset;
            $rootScope.$broadcast('qbDataSvc:updated');
            return service.dataset;
        }).catch(function (err) {
            console.log(err);
        });
    }

    //todo: consider if this stuff should be statservice or something
    function AddCmpPctToDataSet(dataset) {
        AddStatToDataSet(dataset, 'CmpPct', CalcCmpPct);
    }

    function AddYdsPerAttToDataSet(dataset) {
        AddStatToDataSet(dataset, 'PsYdsAtt', CalcYdsPerAtt);
    }

    
    function AddStatToDataSet(ds, name, statfn) {
        var statname = name;
        ds.header.push({ label: name });
        ds.games.forEach(function (game) {
            game[statname] = statfn(game)
        });
    }

    function CalcCmpPct(game) {
        var result = game.Att && (game.Cmp / game.Att)*100
        return Math.round(result);
    }

    function CalcYdsPerAtt(game) {
        var result = game.Att && (game.PsYds / game.Att)
        return result.toFixed(2);
    }
    

    //todo: consdier if this should move to transform
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

qbDataSvc.$inject = ['$http', '$rootScope', '$q'];

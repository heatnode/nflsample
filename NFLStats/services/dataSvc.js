var qbDataSvc = function ($http, $rootScope, $q) {

    var service = {};
    
    $http.get('/json/nfl-1870523.json').then(function (res) {
        debugger;
        $scope.todos = res.data;
        $rootScope.$broadcast('dbservicedata:updated');
    });

    return service;

};

qbDataSvc.$inject = ['$http', '$rootScope', '$q'];

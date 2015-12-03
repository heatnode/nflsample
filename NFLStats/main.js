var MattSample = angular.module('MattSample', ['ngRoute', 'nvd3', 'nya.bootstrap.select', 'ui.bootstrap']);

MattSample.factory('statSvc', statSvc);
MattSample.factory('qbDataSvc', qbDataSvc);
MattSample.factory('transformSvc', transformSvc);
MattSample.factory('chartSvc', chartSvc);
MattSample.controller('QBPerformanceCtrl', QBPerformanceCtrl);
MattSample.directive('activeLink', activeLink);
MattSample.filter('firstUpper', function () {
    return function (input, scope) {
        return input ? input.substring(0, 1).toUpperCase() + input.substring(1) : "";
    }
});


var configFunction = function ($routeProvider) {
    $routeProvider.
        when('/qbperf', {
            templateUrl: 'views/qbperformance.html'
        })
        .when('/dev', {
            templateUrl: 'views/devnotes.html'
        })
        .when('/help', {
            templateUrl: 'views/help.html'
        })
        .otherwise({
            redirectTo: 'qbperf'
        });
}
configFunction.$inject = ['$routeProvider'];

MattSample.config(configFunction);

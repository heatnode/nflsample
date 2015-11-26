var MattSample = angular.module('MattSample', ['ngRoute', 'nvd3']);

MattSample.factory('qbDataSvc', qbDataSvc);
MattSample.controller('LandingCtrl', LandingCtrl);
MattSample.filter('firstUpper', function () {
    return function (input, scope) {
        return input ? input.substring(0, 1).toUpperCase() + input.substring(1) : "";
    }
});


var configFunction = function ($routeProvider) {
    $routeProvider.
        when('/landing', {
            templateUrl: 'views/landing.html',
        })
        .otherwise({
            redirectTo: 'landing'
        });
}
configFunction.$inject = ['$routeProvider'];

MattSample.config(configFunction);

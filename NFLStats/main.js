﻿var MattSample = angular.module('MattSample', ['ngRoute']);

MattSample.factory('qbDataSvc', qbDataSvc);
//Manatee.factory('syncSvc', syncSvc);
//Manatee.factory('notify', notify);

//Manatee.controller('LandingCtrl', LandingCtrl);
//Manatee.controller('SyncCtrl', SyncCtrl);
//Manatee.controller('ObjectListCtrl', ObjectListCtrl);
//Manatee.controller('AlertCtrl', AlertCtrl);
//Manatee.controller('ModalInstanceCtrl', ModalInstanceCtrl);
//Manatee.controller('EditorModalCtrl', EditorModalCtrl);
//Manatee.controller('CkeditorCtrl', CkeditorCtrl);

//Manatee.directive('activeLink', activeLink);
//Manatee.directive('detailElement', detailElement);
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
        .when('/sync', {
            templateUrl: 'views/sync.html',
        })
        .when('/list', {
            templateUrl: 'views/objectlist.html',
        })
        .when('/test', {
            templateUrl: 'views/testzone.html',
        })
        .otherwise({
            redirectTo: 'landing'
        });
}
configFunction.$inject = ['$routeProvider'];

MattSample.config(configFunction);

﻿var LandingCtrl = function ($scope, qbData) {

    var self = this; //for controller as syntax later
    //use "controller as" syntax

    self.info = {
        //hasidb: db.indexedDB,
        //hasws: db.webSQL,
        title: 'i am a title'
    }

}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
LandingCtrl.$inject = ['$scope', 'qbDataSvc'];

'use strict';
var mediaApp = angular.module('mediaApp', ['onsen.directives','ngResource', 'ui.router']);


mediaApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'partial-home.html'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('login', {
            // we'll get to this in a bit  
            url: '/login',
            templateUrl: 'login.html'
     
        });
        
});

mediaApp.run(function() {
	console.log('running');
});

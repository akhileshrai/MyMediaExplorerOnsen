'use strict';

/* Services */

mediaApp.factory('ParseUser', function($resource){

    return {
    	loggedInCheck : function loggedInCheck() {
    		
			var loggedIn = false;
			if(Parse.User.current()) {
		        loggedIn = true;
		    }
	        return loggedIn;
    	}
    };
 
});

mediaApp.config(function($httpProvider) {
     $httpProvider.defaults.useXDomain = true;
       delete $httpProvider.defaults.headers
        .common['X-Requested-With'];
});

mediaApp.factory('RestService', function($resource){
	var appId = 'ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire';
	var clientKey = 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L';
	var javaKey = 'xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous';
	var restKey = 'nWAWHHoIsNnDHF5GsXPserWai9qZgttYDAfUzsjn';
	///1/classes/<className>/<objectId>
	return $resource('https://api.parse.com/1/classes/Interests' , null, {
            get: {
            	//method: 'GET',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': restKey
                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
                }
            },
            'post': {
            	method: 'POST',
                headers: {
                    'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': restKey
                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
                }
            },
            'query': {
            	method: 'GET',
   	            isArray: false, 
                headers: {
   	            	'X-Parse-Application-Id': appId,
                    'X-Parse-REST-API-Key': restKey
                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
                }
            }
       });
	
	
	
});

mediaApp.factory('LoginService', function($resource){
	var appId = 'ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire';
	var clientKey = 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L';
	var javaKey = 'xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous';
	var restKey = 'nWAWHHoIsNnDHF5GsXPserWai9qZgttYDAfUzsjn';
	return $resource('https://api.parse.com/1/users', null, {
		'post': {
        	method: 'POST',
        	//withCredentials: true,
        	headers: {
            	'X-Parse-Application-Id': appId,
            	'X-Parse-REST-API-Key': restKey/*,
            	'X-Parse-Revocable-Session': 1 ,
            	'Content-Type': 'application/json'*/
                     //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
        	}
		}
    });
	
	
});



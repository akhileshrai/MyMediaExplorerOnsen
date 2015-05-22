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
mediaApp.factory('User', function($q, LoginService){
	var outigoer = new Object;
	
	return {
		current: function(){
			return outigoer;
		},
		logOut: function(){ console.log('logged outish');},
		logIn: function(){
			var fbLogged = new $q.defer();//Parse.Promise();
			
			fbLogged.promise.then(function(authData) {
				console.log('After resolve...');
				outigoer.authData = authData;
				console.log(authData);
				console.log(authData['sessionToken']);
				console.log(authData.get('sessionToken'));
		
				})
				.then(function() {
					console.log('setting picture');
					/*
					var authData = outigoer.authData;
					console.log(authData);*/
					facebookConnectPlugin.api('/me', null, function(response) {
						outigoer.name = response.name;
						/*userObject.set('email', response.email);
						userObject.save();*/		
						console.log('got name');
						console.log(response.name);
						
					}, function(error) {
						console.log(error);
					});
					/*
					facebookConnectPlugin.api('/me/picture', null, function(response) {
						userObject.set('profilePicture', response.data.url);
						userObject.save();
						$scope.user = Parse.User.current();
						$scope.$apply();
						console.log(Parse.User.current());
		
						console.log('applying to scope');
					}, function(error) {console.log(error);});*/
					
					setTimeout(function() {
						navOut.popPage();   
						console.log(navOut.getPages());
					}, 1000);
		
				}, function(error) {
					console.log(error);
			});
			 
			var fbLoginSuccess = function(response) {
				if (!response.authResponse) {
					fbLoginError("Cannot find the authResponse");
					return;
				}
				var expDate = new Date(new Date().getTime() + response.authResponse.expiresIn * 1000).toISOString();
		        
		        var authData = new String;
		
				authData =	{
								authData: { 
									facebook:{	
										id : String(response.authResponse.userID),	
										access_token : response.authResponse.accessToken,	
										expiration_date : expDate
									}
								}
							};
				//fbLogged.resolve(authData);
				var loggedInRest = LoginService.post(authData, function(){ 
					console.log('logged in the user through rest!!!');
				});
				
				
				fbLogged.resolve(loggedInRest);
				fbLoginSuccess = null;
				console.log(authData);
				console.log('finished getting fb data');
			
				
				
			
			};
		
			var fbLoginError = function(error) {
				fbLogged.reject(error);
			};
			facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);
		
					
		}
				
	};
	
	
});


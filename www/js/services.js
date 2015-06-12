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

mediaApp.factory('RestService', function($resource, User){
	var appId = 'ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire';
	var javaKey = 'xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous';
	var restKey = 'nWAWHHoIsNnDHF5GsXPserWai9qZgttYDAfUzsjn';
	var user=User.current();
	///1/classes/<className>/<objectId>
	return { 
		url: function (url, whereField, includeField, keys, callback) {
;			return $resource('https://api.parse.com/1/classes/'+url , null, {
            	'get': {
            	//method: 'GET',
	                headers: {
	                    'X-Parse-Application-Id': appId,
	                    'X-Parse-REST-API-Key': restKey,
	                    'X-Parse-Session-Token': user.sessionToken                    
	                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
	                },
	                params: {
	                	where:whereField,
	                	include:includeField,
	                	keys:keys
	                }
	                
            	},
            	'post': {
	            	method: 'POST',
	                headers: {
	                    'X-Parse-Application-Id': appId,
	                    'X-Parse-REST-API-Key': restKey
	                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
	                }
	            }
            });
		}
	};
            
/*            
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
                    'X-Parse-REST-API-Key': restKey,
                    'X-Parse-Session-Token': user.sessionToken
                    //'X-Parse-Client-Key': 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L'
                }
            }
       });*/
	
	
	
});
/*
mediaApp.factory('UserService', function($resource){
		var appId = 'ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire';
	var clientKey = 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L';
	var javaKey = 'xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous';
	var restKey = 'nWAWHHoIsNnDHF5GsXPserWai9qZgttYDAfUzsjn';

	return $resource('https://api.parse.com/1/users', null, {
		'post': {
        	method: 'POST',
        	headers: {
            	'X-Parse-Application-Id': appId,
            	'X-Parse-REST-API-Key': restKey
        	}
		},
		'get': {
        	method: 'POST',
        	headers: {
            	'X-Parse-Application-Id': appId,
            	'X-Parse-REST-API-Key': restKey
            	
        	}
		}
    });
	
	
});*/
mediaApp.factory('User', function($q, $resource){
	var outigoer = new Object;
	var appId = 'ESYJJY7x9hxzJ4s8U3n51EqZHTGqk4OSeasZ3Ire';
	var clientKey = 'cTU0uIWlMvtFK1ToyK819lwJsTLzDsaJ6QxZFP8L';
	var javaKey = 'xLxyiGvPwxP0Mad2FTFH3Nkztju3PglxEB5kcous';
	var restKey = 'nWAWHHoIsNnDHF5GsXPserWai9qZgttYDAfUzsjn';

	
	return {
		
		
		url: function (url, whereField, includeField, keys, callback) {
			//return $resource('https://api.parse.com/1/classes/'+url , null, {
			return $resource('https://api.parse.com/1/users/'+url, null, {
				'post': {
		        	method: 'POST',
		        	headers: {
		            	'X-Parse-Application-Id': appId,
		            	'X-Parse-REST-API-Key': restKey
		        	}
				},
				'put': {
		        	method: 'PUT',
		        	headers: {
		            	'X-Parse-Application-Id': appId,
		            	'X-Parse-REST-API-Key': restKey
	                    , 'X-Parse-Session-Token': outigoer.sessionToken                    
		        	}
				},
				'get': {
		        	method: 'GET',
		        	headers: {
		            	'X-Parse-Application-Id': appId,
		            	'X-Parse-REST-API-Key': restKey
		            	//,'X-Parse-Session-Token': outigoer.sessionToken                    

		        	},
		        	params: {
	                	where:whereField,
	                	include:includeField,
	                	keys:keys
	                }
				}
		    });
		},

		current: function(){
			outigoer.profilePicture=localStorage.getItem('profilePicture');
			outigoer.name = localStorage.getItem('name');
			outigoer.sessionToken = localStorage.getItem('sessionToken');
			outigoer.objectId = localStorage.getItem('objectId');
			outigoer.authData = localStorage.getItem('authData');
			return outigoer;
		},
		loggedInCheck: function() {
			if (outigoer.sessionToken) {
				return true;
			}
			else return false;
		},
		logOut: function(){ 
			localStorage.removeItem('profilePicture');
			localStorage.removeItem('name');
			localStorage.removeItem('sessionToken');
			localStorage.removeItem('objectId');
			localStorage.removeItem('authData');

			console.log('logged outish');},
		logIn: function(){
			var self = this;
			/*var fbLogged = new $q.defer();//Parse.Promise();
			
			fbLogged.promise.then(function() {
					console.log('setting picture');

					facebookConnectPlugin.api('/me', null, function(response) {
						localStorage.setItem('name', response.name);
					}, function(error) {console.log(error);	});
					
					facebookConnectPlugin.api('/me/picture', null, function(response) {
						localStorage.setItem('profilePicture', response.data.url);
					}, function(error) {console.log(error);});
					
					setTimeout(function() {
						navOut.popPage();   
					}, 1000);
		
				}, function(error) {
					//console.log(error);
					return error;
			});*/
			 
			var fbLoginSuccess = function(response) {
				console.log('fbsuccess', response);
				if (!response.authResponse) {
					fbLoginError("Cannot find the authResponse");
					//outigoer.authdata="cannot find the authresponse";
					return;
				}

				facebookConnectPlugin.api('/me?fields=name,picture', null, function(response) {
						//localStorage.setItem('authData', 'Step 2 Reached'+ JSON.stringify(response));
						console.log('authData', 'Step 2 Reached'+ JSON.stringify(response));
						outigoer.name = response.name;
						outigoer.profilePicture = response.picture.data.url;
						localStorage.setItem('name', outigoer.name);
						localStorage.setItem('profilePicture', outigoer.profilePicture);

					}, function(error) {console.log(error);	});

				var expDate = new Date(new Date().getTime() + response.authResponse.expiresIn * 1000).toISOString();
		        
		        var authData = new String;


		
				authData =	{
								authData: { 
									facebook:{	
										id : String(response.authResponse.userID),	
										access_token : response.authResponse.accessToken,	
										expiration_date : expDate
									}
								},
						};
							
				
				//Get name and profile picture

				var loggedInRest = self.url('',null,null,null).post(authData, function(response){ 
					outigoer.sessionToken = response.sessionToken;
					outigoer.objectId = response.objectId;
					localStorage.setItem('sessionToken', response.sessionToken);
					localStorage.setItem('objectId', response.objectId);
				
					console.log('yes this works too');
					
					/*
					facebookConnectPlugin.api('/me?fields=name,picture', null, function(response) {
						//localStorage.setItem('authData', 'Step 2 Reached'+ JSON.stringify(response));
						console.log('authData', 'Step 2 Reached'+ JSON.stringify(response));
						outigoer.name = response.name;
						outigoer.profilePicture = response.picture.data.url;
						localStorage.setItem('name', outigoer.name);
						localStorage.setItem('profilePicture', outigoer.profilePicture);

					}, function(error) {console.log(error);	});*/
					
					/*facebookConnectPlugin.api('/me/picture', null, function(response) {
						//localStorage.setItem('authData', 'Step 3 Reached'+ JSON.stringify(response));
						console.log('authData', 'Step 3 Reached'+ JSON.stringify(response));
						localStorage.setItem('profilePicture', response.data.url);
					}, function(error) {console.log(error);});*/
					
					setTimeout(function() {
						navOut.popPage();   
					}, 1000);

					console.log(response);
				});
				
				loggedInRest.$promise.then( function(value) {
					//var self = this;

					var fbData = new String();
					fbData = {name: outigoer.name, profilePicture: outigoer.profilePicture};
								
						
					var userData = self.url(outigoer.objectId, null, null, null).put(fbData, function(response) {
						console.log ("updated user");
					});
				});
				
			
				//fbLogged.resolve(loggedInRest);
				fbLoginSuccess = null;
				
			
			};
			
		
			var fbLoginError = function(error) {
				localStorage.setItem('authData', 'fbLogin Error');
				//fbLogged.reject(error);
				return error;
			};
			try {
				facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);
		   	}
		    catch (e) {
		    	return "Facebook couldn't connect";
		    };
		    //console.log(fbLog);
			
		}
				
	};
	
	
});


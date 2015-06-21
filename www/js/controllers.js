'use strict';

mediaApp.controller('AboutCtrl', function($scope) {
	$scope.sendMail = function() {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about Media Explorer...", "Please send me more details.", "hollyschinsky@gmail.com", null, null, false, null, null);
		} else {
			location.href = 'mailto:?subject=Question about media explorer&body=';
		}
	};

	$scope.linkTo = function(link) {
		console.log("Link to " + link);
		var ref = window.open(link, '_blank', 'location=yes');
	};
});

mediaApp.controller('SettingsCtrl', function($scope, SettingsService) {
	$scope.navTitle = "Settings";
	$scope.volume = "20";
	$scope.audio = "on";
	$scope.video = "on";
	$scope.maxResults = 50;

	$scope.changeNumResults = function() {
		console.log("Results set to " + this.maxResults);
		$scope.maxResults = this.maxResults;
		SettingsService.set('maxResults', this.maxResults);
	};
});

mediaApp.controller('SearchCtrl', function($scope, MediaService, $location, SettingsService, $rootScope) {
	$scope.request = {};
	$scope.showFlag = false;
	$scope.mediaTypes = {};
	$scope.mediaTypes.type = 'all';

	if (SettingsService.get('sortBy'))
		$rootScope.sortBy = SettingsService.get('sortBy');
	else
		$rootScope.sortBy = "artistName";

	if (SettingsService.get('filterTerm'))
		$rootScope.filterTerm = SettingsService.get('filterTerm');
	else
		$rootScope.filterTerm = "";

	var doSearch = function(query) {
		var type = $scope.mediaTypes.type;
		if (type == "all")
			type = "";
		if (query != null) {
			// Pass in the query string, the media type and the # of results to return (from SettingsService)
			MediaService.search(query, type, SettingsService.get('maxResults')).then(function(resp) {
				$scope.mediaResults = resp;
				console.log("Result Count " + $scope.mediaResults.resultCount);
				$scope.mediaResults = resp;

				if ($scope.mediaResults.resultCount == 0)
					$scope.infoTxt = 'No matching results found';
			});
		}
	};

	$scope.search = function() {
		$scope.infoTxt = null;
		// If they used the advanced sort criteria, get it now
		if (SettingsService.get('sortBy'))
			$scope.sortBy = SettingsService.get('sortBy');
		if (SettingsService.get('filterTerm'))
			$scope.filterTerm = SettingsService.get('filterTerm');
		doSearch($scope.request.query);
	};

	$scope.checkMedia = function(item) {
		if (item.kind === 'song' || item.kind === 'music-video') {
			$scope.openPlayModal(item);
			$scope.infoTxt = null;
		} else
			$scope.infoTxt = 'No suitable player available for the selected media type.';
	};

	$scope.openPlayModal = function(item) {
		SettingsService.set('url', item.previewUrl);
		if (item.trackName != null)
			SettingsService.set('title', item.trackName);
		else
			SettingsService.set('title', item.collectionName);

		SettingsService.set('kind', item.kind);
		SettingsService.set('artist', item.artistName);

		$scope.ons.screen.presentPage('playModalNav.html');
	};

	$scope.openSortModal = function() {
		$scope.ons.screen.presentPage('sortModalNav.html');
	};
});

mediaApp.controller('PlayMediaCtrl', function($scope, SettingsService) {
	console.log("Kind " + this.kind);
	$scope.kind = SettingsService.get('kind');
	$scope.title = SettingsService.get('title');
	$scope.artist = SettingsService.get('artist');
	$scope.url = SettingsService.get('url');

	$scope.closePlayModal = function() {
		$scope.playModal.hide();
	};
});

mediaApp.controller('SortCtrl', function($scope, SettingsService, $rootScope) {
	$scope.filterTerm = "";

	if (SettingsService.get('sortBy'))
		$scope.sortBy = SettingsService.get('sortBy');
	else
		$scope.sortBy = "artistName";

	$scope.saveSort = function() {
		console.log("This filter " + $scope.filterTerm + " sort " + $scope.sortBy);
		/* BAD PRACTICE NOTED (using $rootScope) :) */
		$rootScope.sortBy = $scope.sortBy;
		$rootScope.filterTerm = $scope.filterTerm;
		SettingsService.set('filterTerm', $scope.filterTerm);
		SettingsService.set('sortBy', $rootScope.sortBy);
		$scope.ons.screen.dismissPage();
	};
});


mediaApp.controller('Categories', function($scope, User, RestService) {
 

	console.log("controller user:");
	$scope.loggedIn = User.loggedInCheck();
	

	if (!$scope.loggedIn){
		console.log('got here but didnt do shit');
		navOut.pushPage('login.html');
	}
	else {
		$scope.user = User.current();
		console.log ($scope.user);	
	}
	
	
	$scope.options = {};



	var menuDisplay =	function(results, userInterests) {
			$scope.resultQuery = 'Results length:' + results.length;
			$scope.interests = results;
			var categcount = -1;
			var categ = '';
			var options = [];
			var interest_array = [];
			var check = 'checked';
			var menu = {
				id : 0,
				title : [],
				interests : [],
				toggle : ''
			};
			var interest_checked = {};
			
			if (!userInterests) userInterests = [];
			
			var formatted = {};
			for (var i = 0; i < results.length; i++) {
				interest_checked = {};
				interest_checked.Interest = results[i].Interest;
				interest_checked.objectId = results[i].objectId; 
				interest_checked.isChecked = (userInterests.indexOf(results[i].objectId) > -1) ? true:false;//'checked':'';
				console.log(results[i].objectId, userInterests.indexOf(results[i].objectId), interest_checked.isChecked);

				
				if (! (results[i].Category in formatted)){
					formatted[results[i].Category]= [interest_checked];
				}
				else {
					formatted[results[i].Category].push(interest_checked);
				}
				



			}
			//console.log(options);
			console.log(formatted);
			//$scope.options = options;
			$scope.options = formatted;
			
			//Football.setChecked(true);

			//$scope.$apply();
		};/*,
		error : function(error) {
			alert("Network seems offside :/" + error.code + error.message)
		}
	});*/
    var restCategs = RestService.url('Interests').get({}, function() {
    	console.log('rest ran');
    	//console.log(restCategs);
    	
  	});
  	console.log(restCategs);
  	restCategs.$promise.catch(function() {
  		console.log('hi catch!');
  	});
  	
  	restCategs.$promise.then (function (value){
  		
	  		var userPrefs = User.url($scope.user.objectId, null,'userPrefs','userPrefs.Interest').get({}, function() {
	  			var interestArray = [];
	  			for (var i=0; i<userPrefs.userPrefs.length; i++){
	  				interestArray.push(userPrefs.userPrefs[i].objectId);
	  			} 
	  			menuDisplay(restCategs.results, interestArray);
	  		});
	
	  		
	  		
	  		
  				
  		}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  	});
  	
  	
  	$scope.submitChanges = function() {
  		console.log($scope.options);
  		var options = $scope.options;
  		var userInterestsChanged = [];
  		var interestArray = [];
  		
  		for (var categIndex in options) {
  			
  			var interestObject = options[categIndex];
  			for (var interestIndex in interestObject) {
  				var interestNew = interestObject [interestIndex];
  				if (interestNew.isChecked) {
  					userInterestsChanged.push(interestNew.objectId);
					interestArray.push({"__type":"Pointer","className":"Interests", "objectId":interestNew.objectId});

  				}
  				
  			}
  			
  		
  		}
  		
  		console.log(interestArray);
  		//var parsePrefs = {"userPrefs":userInterestsChanged};

		var userArray =  {"__op":"Add", "objects":interestArray};

		//var interestRelation = {"__type":"Pointer","className":"Interests", "objectId":$scope.selectedItem.objectId };
		//var eventDate = {"__type":"Date", "iso":$scope.eventDate.toISOString()};
		var prefsToSave = {'userPrefs':interestArray}; 

  		
  		
  		var userPref = User.url($scope.user.objectId, null,null,null).put(prefsToSave, function() {
  			console.log(userPref);
  		}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		});
  		

  		
  		
  		
  	};

  	
  	



});

mediaApp.controller('LoginCtrl', function LoginCtrl($scope, User) {

	$scope.loginStatus = false;
       
	if (!$scope.user) {
		console.log('user is blank so assigning parse');
		//$scope.user = Parse.User.current();
		$scope.user = User.current();
		console.log(User.current());

	
	}


	$scope.FB_login = function() {
		$scope.loginStatus = User.logIn();
		console.log("Current USer");
		$scope.user = User.current();
		//$scope.$apply();
		console.log($scope.user);
		

		
	};
	$scope.logout = function() {
          console.log('Logout');
          User.logOut();
          $scope.user = null;
    };
    


});

mediaApp.controller('restCtrl', function restCtrl($scope, RestService) {
	console.log(RestService);
	
	var entry = RestService.url('Interests').get(function() {
    	console.log ('Entry:');
    	console.log(entry);
  	});
	console.log('rest api testing begins!');
	

	
});


mediaApp.controller('createEvent', function restCtrl($scope, RestService, User) {
	console.log('Create Controller Entered');
	var outigoer = User.current();
	
	
	//Initialise all inputs
	$scope.eventDate = new Date(2015, 9, 22);
	$scope.usersNeeded = 1;
	$scope.groupsNeeded = 1;
	$scope.submitReady = false; 
	$scope.minDate = new Date();
	console.log($scope.minDate.toDateString);
       	
    //$scope.ISOdate = ;
    //$scope.eventDescription = "A";
	
	//var tosave = {'Id':5, 'Category':'Adventure', 'Interest':'Rock Climbing', 'blah':'blah'};
	//{"opponents":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"Player","objectId":"Vx4nudeWn"}]}}
	//-d '{"opponents":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"Player","objectId":"Vx4nudeWn"}]}}' \
	// Creator (r),  Description, Interest (R), Location, Map, Type, eventDate, 
	//var userRelation =  {"__op":"AddRelation", "objects":[{"__type":"Pointer","className":"_User", "objectId":"0LxcyWcbvv" }]};
	
	
	Array.prototype.unique = function() {
	    var unique = [];
	    for (var i = 0; i < this.length; i++) {
	        if (unique.indexOf(this[i]) == -1) {
	            unique.push(this[i]);
	        }
	    }
	    return unique;
	};
	
	var keys = 'Interest,Category';
	var restCategs = RestService.url('Interests',null,null,keys).get({ id: $scope.id }, function() {
		//$scope.interests = restCategs.results;
		console.log(restCategs.results);
		$scope.submitReady = true;
		//$scope.$apply();
  	}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		}
  	);
  	
  	var userPrefs = User.url(outigoer.objectId, null,'userPrefs','userPrefs.Interest').get({}, function() {
			//console.log(userPrefs, restCategs);
  			//menuDisplay(restCategs.results, userPrefs.userPrefs);
  			$scope.interests = userPrefs.userPrefs;
  			console.log(userPrefs);	
  		}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		});
	
	
	$scope.selectedItem = "Sports";

	$scope.createEvent = function() {
		console.log($scope.eventDescription);
		//console.log($scope.selectedItem.Interest, $scope.selectedItem.objectId);
		var eventDesc = $scope.eventDescription;
		var userArray =  {"__op":"Add", "objects":[{"__type":"Pointer","className":"_User", "objectId":outigoer.objectId }]};
		var interestRelation = {"__type":"Pointer","className":"Interests", "objectId":$scope.selectedItem.objectId };
		var eventDate = {"__type":"Date", "iso":$scope.eventDate.toISOString()};
		var tosave = {'Creators':userArray, 'Description':$scope.eventDescription,'Interest': interestRelation, 'eventDate':eventDate, 'usersNeeded':parseInt($scope.usersNeeded), 'groupsNeeded':parseInt($scope.groupsNeeded)}; 
		console.log(tosave);
		//console.log (eventDesc);
		
		var result = RestService.url('Events').post(tosave, function() {
			console.log ('Saving Event:');
	    	console.log(result);
		});
	};

	
});

mediaApp.controller('myEvents', function restCtrl($scope, RestService, User) {
	console.log('My Events Entered');
	var outigoer = User.current();
	console.log(outigoer);
	//var tosave = {'Id':5, 'Category':'Adventure', 'Interest':'Rock Climbing', 'blah':'blah'};
	//{"opponents":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"Player","objectId":"Vx4nudeWn"}]}}
	//-d '{"opponents":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"Player","objectId":"Vx4nudeWn"}]}}' \
	// Creator (r),  Description, Interest (R), Location, Map, Type, eventDate, 
	
	//var getRelation =  '{"$relatedTo":{"object":{"__type":"Pointer","className":"Interest","objectId":"IOf48bKdFY"},"key":"Interest"}}';
	//var getRelation =  '{"Creator":{"__type":"Pointer","className":"_User","objectId":"'+outigoer.objectId+'"}}';
	
	
	
	
	var whereFilter = '{"Creators":{"__type":"Pointer","className":"_User","objectId":"'+outigoer.objectId+'"}}'; 
	var includeFields = 'Creators,Interest';
	var keys = 'Description,Creators.name,Interest.Interest,Interest.Category';
	//var interestRelation = {"__op":"AddRelation", "objects":[{"__type":"Pointer","className":"Interests", "objectId":"IOf48bKdFY" }]};
	//var tosave = {'Creator':userRelation, 'Description':'This is the event','Interest': interestRelation};
	 
	var result = RestService.url('Events', whereFilter, includeFields, keys).get(function() {
		console.log ('Relation found:'+ outigoer.objectId);
    	console.log(result);
    	$scope.myEvents = result.results;
    	
	}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		}
	);	
	
	
});
mediaApp.controller('allEvents', function restCtrl($scope, RestService, User) {
	console.log('All Events Entered');
	$scope.user = User.current();
	//console.log(outigoer);
	

	

		
	var userPrefs = User.url($scope.user.objectId, null,'userPrefs','userPrefs.Interest').get({}, function() {
			//console.log(userPrefs, restCategs);
  			//menuDisplay(restCategs.results, userPrefs.userPrefs);
  		}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		});
			
	
	//var interestRelation = {"__op":"AddRelation", "objects":[{"__type":"Pointer","className":"Interests", "objectId":"IOf48bKdFY" }]};
	//var tosave = {'Creator':userRelation, 'Description':'This is the event','Interest': interestRelation}; 
	userPrefs.$promise.then (function (result){
		var userPrefs = result.userPrefs;
		var wherePrefs = []; //userPrefs;
		
		for (var userPref in userPrefs) {
			var pointerPref = {"__type":"Pointer","className":"Interests","objectId":userPrefs[userPref].objectId};
			//pointerPref.objectId = userPrefs[userPref];
			//wherePrefs.push(pointerPref);
			wherePrefs[userPref] = pointerPref;
			//wherePrefs[userPref].objectId = userPrefs[userPref];
			console.log(wherePrefs[userPref]);
			
		}
		//var whereFilter = '{"Interest":{"__type":"Pointer","className":"Interests","objectId":"'+userPrefs.userPrefs+'"}}'; //'';//'{"Creators":{"$nin":[{"__type":"Pointer","className":"_User","objectId":"'+outigoer.objectId+'" }]}}';
		var whereFilter = {"Interest":{"$in":wherePrefs}};
				console.log(whereFilter);

		
		var includeFields = 'Creators,Interest';
		var keys = 'Description,Creators.name,Interest.Interest,Interest.Category';
		
		
		var result = RestService.url('Events', whereFilter, includeFields, keys).get(function() {
			//console.log ('Relation found:'+ outigoer.objectId);
	    	console.log(result);
	    	$scope.myEvents = result.results;
	    	
		}, function (value) {
  			//alert('Your connection is offside');
  			$scope.netAlert = 'Check your connection!';
  		});	
	
	});
});


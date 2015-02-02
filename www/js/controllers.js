'use strict';

mediaApp.controller('AboutCtrl', function($scope) {
	$scope.sendMail = function() {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about Media Explorer...", "Please send me more details.", "hollyschinsky@gmail.com", null, null, false, null, null);
		} else {
			location.href = 'mailto:?subject=Question about media explorer&body=';
		}
	}

	$scope.linkTo = function(link) {
		console.log("Link to " + link);
		var ref = window.open(link, '_blank', 'location=yes');
	}
})

mediaApp.controller('SettingsCtrl', function($scope, SettingsService) {
	$scope.navTitle = "Settings";
	$scope.volume = "20";
	$scope.audio = "on";
	$scope.video = "on";
	$scope.maxResults = 50;

	$scope.changeNumResults = function() {
		console.log("Results set to " + this.maxResults)
		$scope.maxResults = this.maxResults;
		SettingsService.set('maxResults', this.maxResults);
	};
})

mediaApp.controller('SearchCtrl', function($scope, MediaService, $location, SettingsService, $rootScope) {
	$scope.request = {};
	$scope.showFlag = false;
	$scope.mediaTypes = {};
	$scope.mediaTypes.type = 'all';

	if (SettingsService.get('sortBy'))
		$rootScope.sortBy = SettingsService.get('sortBy')
	else
		$rootScope.sortBy = "artistName";

	if (SettingsService.get('filterTerm'))
		$rootScope.filterTerm = SettingsService.get('filterTerm')
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
	}

	$scope.checkMedia = function(item) {
		if (item.kind === 'song' || item.kind === 'music-video') {
			$scope.openPlayModal(item);
			$scope.infoTxt = null;
		} else
			$scope.infoTxt = 'No suitable player available for the selected media type.'
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
	}

	$scope.openSortModal = function() {
		$scope.ons.screen.presentPage('sortModalNav.html');
	}
})

mediaApp.controller('PlayMediaCtrl', function($scope, SettingsService) {
	console.log("Kind " + this.kind);
	$scope.kind = SettingsService.get('kind');
	$scope.title = SettingsService.get('title');
	$scope.artist = SettingsService.get('artist');
	$scope.url = SettingsService.get('url');

	$scope.closePlayModal = function() {
		$scope.playModal.hide();
	}
})

mediaApp.controller('SortCtrl', function($scope, SettingsService, $rootScope) {
	$scope.filterTerm = "";

	if (SettingsService.get('sortBy'))
		$scope.sortBy = SettingsService.get('sortBy')
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
	}
})


mediaApp.controller('Categories', function($scope) {
	console.log("Got to this Category controller");
	$scope.resultQuery = 'HI';
	//$scope. = SettingsService.get('kind');
	$scope.options = {};

	var Category = Parse.Object.extend("Interests");
	var query = new Parse.Query(Category);

	//query.equalTo('Category', 'Sports');
	query.find({
		success : function(results) {
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
			for (var i = 0; i < results.length; i++) {
				//header = interest.get('Category');
				//console.log (results[i].attributes);

				//console.log(menu, categcount)
				if (categ != results[i].attributes.Category) {
					menu = {
						id : 0,
						title : [],
						interests : [],
						toggle : ''
					};

					//START NEW CATEGORY
					interest_array = [];
					menu.title.push(results[i].attributes.Category)
					categcount += 1;
					categ = results[i].attributes.Category;

					//console.log(categ);
					//options[i]['Interests'].push(results[i].attributes.Interest);
				}
				interest_array.push({
					name : results[i].attributes.Interest,
					checked : check
				})
				//menu.interests.checked=categcount%2;
				menu.interests[0] = (interest_array);
				menu.id = (results[i].attributes.Id);
				menu.toggle = false;
				check = '';

				console.log(menu)

				options[categcount] = menu;

				/*while (header!=interest["Category"]) {
				 console.log('header inside');
				 }*/
			}
			console.log(options);
			$scope.options = options;

			$scope.$apply();
		},
		error : function(error) {
			alert("Network seems offside :/" + error.code + error.message)
		}
	})

})

mediaApp.controller('LoginCtrl', function LoginCtrl($scope) {
	console.log('hi ctrl');
	var fbLogged = new Parse.Promise();
	if (!$scope.user) {
		$scope.user = Parse.User.current();
	
	
	}
	
	var fbLoginSuccess = function(response) {
		if (!response.authResponse) {
			fbLoginError("Cannot find the authResponse");
			return;
		}
		var expDate = new Date(new Date().getTime() + response.authResponse.expiresIn * 1000).toISOString();

		var authData = {
			id : String(response.authResponse.userID),
			access_token : response.authResponse.accessToken,
			expiration_date : expDate
		}
		fbLogged.resolve(authData);
		fbLoginSuccess = null;
		console.log(response);
	};

	var fbLoginError = function(error) {
		fbLogged.reject(error);
	};

	$scope.FB_login = function() {
		console.log('Login');
		if (!window.cordova) {
			//facebookConnectPlugin.browserInit('353205054847621');
		}
		facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

		fbLogged.then(function(authData) {
			console.log('Promised');
			return Parse.FacebookUtils.logIn(authData);
		}).then(function(userObject) {
			var authData = userObject.get('authData');
			facebookConnectPlugin.api('/me', null, function(response) {
				console.log('step1');
				userObject.set('name', response.name);
				userObject.set('email', response.email);
				userObject.save();
				
			}, function(error) {
				console.log(error);
			});
			facebookConnectPlugin.api('/me/picture', null, function(response) {
				userObject.set('profilePicture', response.data.url);
				userObject.save();
				$scope.user = Parse.User.current();
				$scope.$apply();
			}, function(error) {console.log(error);}
			);
			console.log('go home');
		}, function(error) {
			console.log(error);
		});
		
		//console.log(userObject);
		console.log(Parse.User.current());
	
	};
	$scope.logout = function() {
          console.log('Logout');
          Parse.User.logOut();
          $scope.user = null;
    };
    


});


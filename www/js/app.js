angular.module('R8eor', ['ionic', 'ngRoute', 'ionic.contrib.ui.tinderCards', 'R8eor.controllers'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})
.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "partials/menu.html",
				controller: 'AppCtrl'
			})

			.state('app.search', {
				url: "/search",
				views: {
					'menuContent': {
						templateUrl: "partials/search.html"
					}
				}
			})

			.state('app.browse', {
				url: "/browse",
				views: {
					'menuContent': {
						templateUrl: "partials/browse.html"
					}
				}
			})
			.state('app.playlists', {
				url: "/playlists",
				views: {
					'menuContent': {
						templateUrl: "partials/playlists.html",
						controller: 'PlaylistsCtrl'
					}
				}
			})

			.state('app.single', {
				url: "/playlists/:playlistId",
				views: {
					'menuContent': {
						templateUrl: "partials/player.html",
						controller: 'PlayerCtrl'
					}
				}
			});
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/playlists');
	})
//	['$routeProvider', function ($routeProvider) {
//    $routeProvider.
//    when('/', {
//      templateUrl: 'partials/player.html',
//      controller: 'PlayerCtrl',
//			//resolve: {
//			//	Id: function(){
//			//		return Media.get();
//			//	}
//			//}
//    }).
//    when('/latest', {
//      templateUrl: 'partials/player.html',
//      controller: 'PlayerCtrl',
//			//resolve: {
//			//	library: function (Media) {
//			//		return Media.get();
//			//	}
//			//}
//    }).
//    otherwise({ redirectTo: '/' });
//}])
//
.directive('noScroll', function() {

	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {

			$element.on('touchmove', function(e) {
				e.preventDefault();
			});
		}
	}
})

.service('Playlist', ['$http', '$q', function ($http, $q) {
  return {get: function (params) {
    var deferred = $q.defer();
		console.log(params.playlist);
    $http.get('http://hypem.com/playlist/' + params.playlist + '/all/json/' + params.pagenum + '/data.json')
    .success(function (data) {
      deferred.resolve(data);
    })
    .error(function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  }};
}])

.service('Media', ['$http', '$q', function ($http, $q) {
  return {get: function (id) {
    var deferred = $q.defer();
    $http.get('http://hypem-server.herokuapp.com/?mediaid=' + id)
    .success(function (data) {
      deferred.resolve(data);
    })
    .error(function (e) {
      deferred.reject(e);
    });
    return deferred.promise;
  }};
}])

.service('Async', ['$window', function ($window) {
  return $window.async;
}]);





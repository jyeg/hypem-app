angular.module('HypeM', ['ionic', 'ngRoute', 'ionic.contrib.ui.tinderCards'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'partials/player.html',
      controller: 'PlayerCtrl'
    }).
    when('/latest', {
      templateUrl: 'partials/player.html',
      controller: 'PlayerCtrl'
    }).
    otherwise({ redirectTo: '/' });
}])

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
}])

.controller('PlayerCtrl',
['$scope','Playlist', '$routeParams', '$document', 'Media', '$window', 'Async', 'TDCardDelegate',
function ($scope, Playlist, $routeParams, $document, Media, $window, Async,  TDCardDelegate) {
  var addToQueue = function(songs, cb) {
    var pending = [];
    for (var key in songs){
			//console.log(songs);ngs) {
      if (songs.hasOwnProperty(key) && angular.isObject(songs[key])) {
        pending.push(songs[key]);
      }
    }

    Async.map(pending, function (song, callback) {
      Media.get(song.mediaid).then(function (media) {
        song.url = media.url;
        callback(null, song);
      }).catch (function (e) {
        callback(e);
      });
    }, function (e, mutated) {
      queue = queue.concat(mutated);
      cb();
    });
  };

  var getPlaylist = function (cb) {
    Playlist.get({playlist: $routeParams.playlist || 'popular', pagenum: currentPage}).then(function(songs) {
      currentPage++;
      addToQueue(songs, function () {
        cb();
      });
    }).catch(function(e) {
      cb();
    });
  };

  $scope.playerControl = function () {
    if (!$scope.isPlaying) {
      if (audio.getAttribute('src') === null) {
        setPlayer();
      }
      audio.play();
      $scope.isPlaying = true;
    } else {
      audio.pause();
      $scope.isPlaying = false;
    }
  };

  $scope.nextSong = function () {
    currentSongIdx++;
    setPlayer();
    audio.play();
    $scope.isPlaying = true;
    if (currentSongIdx > 0 && currentSongIdx % 20 === 0) {
      getPlaylist(function () {
        console.log('updated!');
      });
    }
  };

  $scope.previousSong = function () {
    if (currentSongIdx > 0 ) {
      currentSongIdx--;
      setPlayer();
      audio.play();
      $scope.isPlaying = true;
    }
  };

  var setPlayer = function () {
    console.log(queue[currentSongIdx]);
    $scope.ArtistImage = queue[currentSongIdx].thumb_url_artist;
    $scope.ArtistName = queue[currentSongIdx].artist;
    $scope.SongName = queue[currentSongIdx].title;
    $scope.Cover = queue[currentSongIdx].thumb_url_large;
    audio.src = queue[currentSongIdx].url;
  };

  $scope.ArtistImage = null;
  $scope.ArtistName = null;
  $scope.SongName = null;
  $scope.Cover = null;
  $scope.isPlaying = false;
	$scope.startTime = 30;
	$scope.playlist = [];
  var currentSongIdx = 0;
  var queue = [];
  var currentPage = 1;
  var audio = $window.document.getElementById('player');
  //init
  getPlaylist(function () {
    $scope.playerControl();
  });

  audio.addEventListener('ended', function () {
    $scope.$apply($scope.nextSong());
  });

	$scope.cardDestroyed = function(index) {
		//$scope.cards.splice(index, 1);
	};

	$scope.addCard = function() {
		//var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
		//newCard.id = Math.random();
		//$scope.cards.push(angular.extend({}, newCard));
	};
	$scope.cardSwipedLeft = function(index) {
		console.log('LEFT , indexSWIPE');
		$scope.nextSong();
	};
	$scope.cardSwipedRight = function(index) {
		console.log('RIGHT SWIPE', index);
		$scope.nextSong();
	};

}]);

//.controller('CardsCtrl', function($scope, TDCardDelegate, Playlist) {
//	console.log('CARDS CTRL');
//	var cardTypes = [
//		{ image: 'https://pbs.twimg.com/profile_images/546942133496995840/k7JAxvgq.jpeg' },
//		{ image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png' },
//		{ image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg' },
//	];
//
//	$scope.cards = Array.prototype.slice.call(cardTypes, 0);
//
//	$scope.cardDestroyed = function(index) {
//		$scope.cards.splice(index, 1);
//	};
//
//	$scope.addCard = function() {
//		var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
//		newCard.id = Math.random();
//		$scope.cards.push(angular.extend({}, newCard));
//	}
//})
//
//	.controller('CardCtrl', function($scope, TDCardDelegate, Playlist) {
//		$scope.cardSwipedLeft = function(index) {
//			console.log('LEFT SWIPE');
//			$scope.addCard();
//		};
//		$scope.cardSwipedRight = function(index) {
//			console.log('RIGHT SWIPE');
//			$scope.addCard();
//		};
//	});

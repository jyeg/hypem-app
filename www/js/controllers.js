angular.module('R8eor.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('partials/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


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
					$scope.Library = $scope.Library.concat(mutated);
					queue = queue.concat(mutated);
					cb();
				});
			};

			var getPlaylist = function (cb) {
				Playlist.get({playlist: $routeParams.playlist || 'popular', pagenum: currentPage}).then(function(songs) {
					currentPage++;
					addToQueue(songs, function () {
						// playerControl is CB
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
				$scope.Id = currentSongIdx;
				audio.src = queue[currentSongIdx].url;
			};

			$scope.ArtistImage = null;
			$scope.ArtistName = null;
			$scope.SongName = null;
			$scope.Cover = null;
			$scope.Id = null;
			$scope.isPlaying = false;
			$scope.startTime = 30;
			$scope.Library = [];
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
				console.log('LEFT SWIPE', index);
				$scope.nextSong();
			};
			$scope.cardSwipedRight = function(index) {
				console.log('RIGHT SWIPE', index);
				$scope.nextSong();
			};

		}]);
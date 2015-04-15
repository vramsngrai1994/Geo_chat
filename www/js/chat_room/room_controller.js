(function(angular) {
  'use strict';

  angular.module('geo_chat')
    .controller('CreateRoomCtrl', ['$scope', '$cordovaGeolocation', 'uiGmapGoogleMapApi', '$timeout','$ionicLoading', '$ionicModal', 'RoomService', '$state', CreateRoomCtrl]);
  function CreateRoomCtrl($scope, $cordovaGeolocation, uiGmapGoogleMapApi, $timeout, $ionicLoading, $ionicModal, RoomService, $state) {
    var defaultForm = {
        name: "",
        private: "",
        range: ""
      };
     $scope.rooms = [];
    //Get location of user
    var posOptions = {timeout: 1000, enableHighAccuracy: true};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(getLocationSuccess, getLocationError);
      //location for displaying the map and create new room
      function getLocationSuccess(position) {
        $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude:  position.coords.longitude
        },
        zoom: 14
        };
      }

      function getLocationError(err) {
        console.log(err);
      }

    setTimeout(getLocationSuccess, 0);

    //Create Room
    $scope.newRoom = {};

    $scope.createRoom = function () {
      if ( $scope.newRoom.name === undefined || $scope.newRoom.name === ''){
        $scope.errorMes = "*Room name is required";
      }
      else if ( $scope.newRoom.range === undefined || $scope.newRoom.range === '' ){
        $scope.errorMes = "*Range is required";
      }
      else {
        startLoading();
        var pushRoomData = {
              name:  $scope.newRoom.name,
              private:  $scope.newRoom.private,
              range:  $scope.newRoom.range,
              location: [$scope.map.center.latitude, $scope.map.center.longitude]
            };
        switch ( $scope.newRoom.private){
          case undefined:
            pushRoomData.private = false;
            pushRoomData.range = $scope.newRoom.range;
            RoomService.createRoom(pushRoomData)
              .then(stopLoading);
            break;
          case !undefined:
            pushRoomData.private =  $scope.newRoom.private;
            pushRoomData.range =  $scope.newRoom.range;
            RoomService.createRoom(pushRoomData)
              .then(stopLoading);
            break;
        }
      }
      $scope.newRoom = defaultForm;

    };
    //stop loading icon
     function startLoading() {
      $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="spinner-balanced">Your Room is creating</ion-spinner>'
      });
    }
    function stopLoading() {
      $ionicLoading.hide();
    }
    // Querying the room


    $scope.options = {scrollwheel: false};


  }
}(window.angular));
angular
  .module('anguweathar', ['ngAnimate'])
  .config(($routeProvider) => {
    $routeProvider
      .when('/', {
        controller: 'RootCtrl',
        templateUrl: '/partials/root.html',
      })
      .when('/weather/:zipcode', {
        controller: 'RadarCtrl',
        templateUrl: '/partials/weather.html',
      })
  })
  .controller('RootCtrl', function ($scope, $location) {
    console.log('I am a RootCtrl')
    $scope.gotoWeather = () => $location.url(`/weather/${$scope.zip}`)
  })
  .controller('RadarCtrl', function ($scope, $routeParams, radarFactory) {
    console.log('I am a RadarCtrl')

    radarFactory
      .getWeather($routeParams.zipcode)
      .then((radar) => {
        $scope.radar = radar.
      })
  })
  .factory('radarFactory', ($http) => {
    return {
      getWeather (zipcode) {
        return $http
          .get(`http://api.wunderground.com/api/3a28b6f833d0da5f/animatedradar/animatedsatellite/q/${zipcode}.gif?num=6&delay=50&interval=30`)
          .then((response) => ({
            })
          )
          console.log(data)
      },
    }
  })

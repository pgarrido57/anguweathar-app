angular
  .module('anguweathar', ['ngRoute'])
  .config(($routeProvider) => {
    console.log('Config executing')

   firebase.initializeApp({
    apiKey: "AIzaSyCflBsrxMHZxlDL0zsQwS5bfyks0L1-Z8A",
    authDomain: "anguweathar.firebaseapp.com",
    databaseURL: "https://anguweathar.firebaseio.com",
    storageBucket: "anguweathar.appspot.com",
    messagingSenderId: "865465243971"
    })

const checkForAuth = {
      checkForAuth ($location) {
        // http://stackoverflow.com/questions/37370224/firebase-stop-listening-onauthstatechanged
        const authReady = firebase.auth().onAuthStateChanged(user => {
          authReady()
          if (!user) {
            $location.url('/')
          }
        })
      }
    }

    $routeProvider
      .when('/', {
        controller: 'RootCtrl',
        templateUrl: '/partials/root.html',
      })
      .when('/weather/:zipcode', {
        controller: 'WeatherCtrl',
        templateUrl: '/partials/weather.html',
        resolve: checkForAuth
        // resolve takes an object with a function inside
        // https://docs.angularjs.org/api/ngRoute/provider/$routeProvider#when
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: '/partials/login.html',
      })
  })
  .controller('RootCtrl', function ($scope, $location) {
    console.log('I am a RootCtrl')
    console.log('Current user', firebase.auth().currentUser)
    $scope.gotoWeather = () => $location.url(`/weather/${$scope.zip}`)
  })
  .controller('WeatherCtrl', function ($scope, $routeParams, weatherFactory) {
    console.log('I am a WeatherCtrl')
    console.log('Current user', firebase.auth().currentUser)

    weatherFactory
      .getWeather($routeParams.zipcode)
      .then((weather) => {
        $scope.temperature = weather.temp
        $scope.city = weather.city
        $scope.localTime = weather.localTime
        $scope.time = weather.time
        $scope.condition = weather.condition
        $scope.humidity = weather.humidity
        $scope.feelsLike = weather.feelsLike
        $scope.wind = weather.wind
        $scope.pressureMB = weather.pressureMB
        $scope.pressureIN = weather.pressureIN
        $scope.dewpoint = weather.dewpoint
        $scope.heat = weather.heat
        $scope.chill = weather.chill
        $scope.visibility = weather.visibility
        $scope.precip = weather.precip
        $scope.lat = weather.lat
        $scope.long = weather.long
        $scope.elevation = weather.elevation
      })
  })
  .controller('LoginCtrl', function ($scope, $location, authFactory) {
    $scope.login = () => authFactory
      .login($scope.email, $scope.password)
      .then(() => $location.url('/'))
  })
  .factory('weatherFactory', ($http) => {
    return {
      getWeather (zipcode) {
        return $http
          .get(`http://api.wunderground.com/api/3a28b6f833d0da5f/conditions/q/${zipcode}.json`)
          .then((response) => ({
              temp: response.data.current_observation.temperature_string,
              city: response.data.current_observation.display_location.full,
              localTime: response.data.current_observation.local_time_rfc822,
              time: response.data.current_observation.observation_time,
              condition:response.data.current_observation.weather,
              humidity: response.data.current_observation.relative_humidity,
              feelsLike:response.data.current_observation.feelslike_string,
              wind: response.data.current_observation.wind_string,
              pressureMB: response.data.current_observation.pressure_mb,
              pressureIN: response.data.current_observation.pressure_in,
              dewpoint: response.data.current_observation.dewpoint_string,
              heat: response.data.current_observation.heat_index_string,
              chill: response.data.current_observation.windchill_string,
              visibility: response.data.current_observation.visibility_mi,
              precip: response.data.current_observation.precip_1hr_string,
              lat: response.data.current_observation.observation_location.latitude,
              long: response.data.current_observation.observation_location.longitude,
              elevation: response.data.current_observation.observation_location.elevation,
            })
          )
      },
    }
  })
  .factory('authFactory', ($q) => {
    return {
      login (email, pass) {
        // converts native ES6 promise to angular promise so no $scope.$apply needed
        return $q.resolve(firebase.auth().signInWithEmailAndPassword(email, pass))
      },
      getUserId () {
        return firebase.auth().currentUser.uid
      }
    }
  })

  /* eslint no-undef: "off" */
(function () {
  'use strict'
  angular
    .module('iCook4meApp')
    .factory('AuthFact', AuthFact)

  function AuthFact ($http, $q, $rootScope, $location, StorageFact, jwtHelper) {
    return {
      login,
      register,
      logout,
      isLoggedIn,
      setCredentials
    }

    // Handlers functions
    function login (credentials) {
      const url = '/auth/login'
      return $http.post(url, credentials)
        .then(response => response.data.token)
        .then(token => {
          StorageFact.saveToken(token)
          return token
        })
    }

    function register (credentials) {
      const url = '/auth/register'
      return $http.post(url, credentials)
        .then($location.path('/login'))
    }

    function logout () {
      delete $rootScope.loggedUser
      StorageFact.removeToken()
    }

    function isLoggedIn () {
      const token = StorageFact.readToken()
      if (!token) return false
      const tokenPayload = jwtHelper.decodeToken(token)
      return !(jwtHelper.isTokenExpired(token))
    }

    function setCredentials (token) {
      var tokenPayload = jwtHelper.decodeToken(token)
      $rootScope.loggedUser = tokenPayload
    }
  }
})()

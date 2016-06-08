angular.module('starter.controllers').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $state) {
  var vm = this;
  if(localStorage.user != null) {
    $state.go('app.sensors');
  }

  // Perform the login action when the user submits the login form
  $scope.loginFacebook = function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      localStorage.token = token;
      localStorage.user = user;

      console.log('Login Facebook Successfully');
      $state.go('app.sensors');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("Error : " + errorCode + " - " + errorMessage);
    });
  };

  $scope.loginGoogle = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      localStorage.token = token;
      localStorage.user = user;

      console.log('Login Google Successfully');
      $state.go('app.sensors');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("Error : " + errorCode + " - " + errorMessage);
    });
  };

  $scope.logout = function () {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  };
}

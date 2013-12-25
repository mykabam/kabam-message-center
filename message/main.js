//=require kabam-core-web-frontend/public/vendor/textAngular/textAngular.min.js
//= require_self
//= require ./services.js
//= require ./controllers.js
//= require ./states.js

angular.module('kabam.messages.states', ['kabam.states']);
angular.module('kabam.messages.services', ['ngGrid', 'ui.router']);
angular.module('kabam.messages.controllers', ['kabam.messages.services', 'textAngular']);

angular.module('kabam.messages', [
  'kabam.messages.states',
  'kabam.messages.controllers',
  'kabam.messages.services'
]);
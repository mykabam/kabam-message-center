//= require_self
//= require ./services.js
//= require ./controllers.js
//= require ./states.js

angular.module('kabam.messages.states', ['kabam.states']);
angular.module('kabam.messages.services', []);
angular.module('kabam.messages.controllers', ['kabam.messages.services']);

angular.module('kabam.messages', [
    'kabam.messages.states',
    'kabam.messages.controllers',
    'kabam.messages.services'
]);
kabam.use('kabam.messages');
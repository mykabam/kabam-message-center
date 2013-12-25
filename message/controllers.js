var messagesControllers = angular.module('kabam.messages.controllers',
    ['kabam.messages.services', 'textAngular', 'ui.bootstrap', 'ui.select2']);

messagesControllers.controller('MessagesListCtrl', [
  '$scope', 'Restangular', 'MessageService', 'page',
  function($scope, Restangular, MessageService, page) {
    $scope.isChecked = false;

    /**
     * get message to the lists
     */
    MessageService.getMessages(page).then(function(messages) {
      $scope.messages = messages;
    });

    $scope.$on('new-message', function(event, newMessage) {
      $scope.messages.push(newMessage);
    });

    /**
     * toogle select all / none
     * @param boolean onOff
     */
    $scope.toogleCheck = function(onOff) {
      $scope.isChecked = onOff;
    };
  }
]);

messagesControllers.controller('MessagesComposeCtrl', [
  '$scope', '$http', '$log', 'authService', 'notificationService',
  function($scope, $http, $log, authService, notificationService) {
    //TODO - change api
    //change to auto complete
    //this is demo
    $http.get('/api/users').success(function(response) {
      $scope.recipients = response;
    });

    $scope.sendMessage = function() {
      var msgObj = {
        subject: $scope.replyMessage.subject,
        recipient: $scope.message.ownerId,
        message: $scope.replyMessage.message,
        mainMessageId: message._id
      };
      //send message
      MessageService.postMessage(msgObj).then(function(result) {
        if (result.status) {
          //emit to this user
          var to = message.sender;

          $scope.$emit('backend', {action: 'notify:sio',
            message: 'You have a new message from ' + authService.user.email,
            user: to,
            type: 'message'
          });

          notificationService.success('Message has sent');

          //reset form
          $scope.replyMessage.subject = '';
          $scope.replyMessage.message = '';
        }
      });
    };
  }
]);


messagesControllers.controller('MessagesReplyCtrl', [
  '$scope', '$http', 'Restangular', 'MessageService', 'authService',
  'notificationService', 'message',
  function($scope, $http, Restangular, MessageService, authService, notificationService, message) {
    //TODO - get dynamic message ID
    $scope.message = message;

    $scope.sendMessage = function() {
      var msgObj = {
        subject: $scope.replyMessage.subject,
        recipient: $scope.message.ownerId,
        message: $scope.replyMessage.message,
        mainMessageId: message._id
      };
      //send message
      MessageService.postMessage(msgObj).then(function(result) {
        if (result.status) {
          //emit to this user
          var to = message.sender;

          $scope.$emit('backend', {action: 'notify:sio',
                        message: 'You have a new message from ' + authService.user.email,
                        user: to,
                        type: 'message'
                      });

          notificationService.success('Message has sent');

          //reset form
          $scope.replyMessage.subject = '';
          $scope.replyMessage.message = '';
        }
      });
    };
  }
]);
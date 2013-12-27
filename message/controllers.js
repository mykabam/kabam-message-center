var messagesControllers = angular.module('kabam.messages.controllers',
    ['kabam.messages.services', 'textAngular', 'ui.bootstrap', 'ui.select2']);

messagesControllers.controller('MessagesListCtrl', [
  '$scope', '$filter', '$state', 'Restangular', 'MessageService', 'notificationService',
  'page', 'totalMessages',
  function($scope, $filter, $state, Restangular, MessageService, notificationService, page, totalMessages) {
    var PAGE_SIZE = 2;

    $scope.isChecked = false;

    /**
     * list of checkboxes
     */
    $scope.selected = [];

    /**
     * total mesage in list
     */
    $scope.totalMessages = parseInt(totalMessages);

    /**
     * total Page
     */
    $scope.totalPage = 0;
    /**
     * current active page
     */
    $scope.currentPage = 0;

    $scope.nextPage = 0;
    $scope.prevPage = 0;

    /**
     * get message to the lists
     */
    MessageService.getMessages(page).then(function(messages) {
      //add checked property to these model
      //
      for(i = 0; i < messages.length; i++){
        messages[i].checked = false;
      }

      $scope.messages = messages;

      //init page size
      $scope.totalPage = Math.ceil($scope.totalMessages / PAGE_SIZE);
      //get offset
      if(page < $scope.totalPage){
        $scope.nextPage = parseInt(page)+1;
      }else{
        $scope.nextPage = parseInt($scope.totalPage);
      }

      if(page > 1){
        $scope.prevPage = parseInt(page) - 1;
      }else{
        $scope.prevPage = 1;
      }
    });

    $scope.$on('new-message', function(event, newMessage) {
      $scope.messages.push(newMessage);
    });

    /**
     * toogle select all / none
     * @param boolean onOff
     */
    $scope.toogleCheck = function(onOff) {
      for(i = 0; i < $scope.messages.length; i++){
        $scope.messages[i].checked = onOff;
      }

      if(onOff){
        $scope.selected = $scope.messages;
      }else{
        $scope.selected = [];
      }
    };

    /**
     * toogle selected item
     */
    $scope.checkValue = function(){
      $scope.selected = [];
      var selectedItems = $filter('filter')($scope.messages, { checked: true });

      angular.forEach(selectedItems, function (message, index) {
          $scope.selected.push(message);
      });
    };

    /**
     * delete selected messages
     */
    $scope.deleteMessages = function(){
      if($scope.selected.length > 0){
        //TODO - acsync

        var count = 0;
        for(i = 0; i < $scope.selected.length; i++){
          MessageService.deleteMessage($scope.selected[i]._id).then(function(response){
            count++;
          });
        }

        notificationService.success('Messages deleted.');

      }else{
        //empty selected items, just skip
        notificationService.error('No message selected.');
      }
    };

    /**
     * Mark mesage is read or unread
     * @param boolean readOrUnread
     */
    $scope.markRead = function(readOrUnread){
      if($scope.selected.length > 0){
        angular.forEach($scope.selected, function(message){
          message.readingStatus = readOrUnread;
        });

        MessageService.putMessage($scope.selected[0]);
      }else{
        //no message is selected
        notificationService.success('No message selected.');
      }
    };
  }
]);

messagesControllers.controller('MessagesComposeCtrl', [
  '$scope', '$http', 'Restangular', 'MessageService', 'authService', 'notificationService',
  function($scope, $http, Restangular, MessageService, authService, notificationService) {
    //TODO - change api
    //change to auto complete
    //this is demo
    $http.get('/api/rest/users').success(function(response){
      $scope.recipients = response;
    });

    $scope.sendMessage = function() {
      var msgObj = {
        subject: $scope.composeMessage.subject,
        recipient: $scope.composeMessage.recipient,
        message: $scope.composeMessage.message,
        //mainMessageId: message._id
      };

      //send message
      MessageService.postMessage(msgObj).then(function(result) {
        if (result.status) {
          //emit to this user
          var to = $scope.composeMessage.recipient;

          $scope.$emit('backend', {action: 'notify:sio',
            message: 'You have a new message from ' + authService.user.email,
            user: to,
            type: 'message'
          });

          notificationService.success('Message has sent');

          //reset form
          $scope.composeMessage.subject = '';
          $scope.composeMessage.message = '';
        }
      });
    };
  }
]);


messagesControllers.controller('MessagesReplyCtrl', [
  '$scope', 'Restangular', 'MessageService', 'authService',
  'notificationService', 'message',
  function($scope, Restangular, MessageService, authService, notificationService, message) {
    //TODO - get dynamic message ID
    $scope.message = message;

    //if message status is unread, we change to readed
    if(!message.readingStatus){
      message.readingStatus = true;
      MessageService.putMessage(message);
    }

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

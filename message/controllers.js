var messagesControllers = angular.module('kabam.messages.controllers', []);

messagesControllers.controller('MessagesListCtrl', [
  '$scope', '$http',
  function($scope, $http) {
    $http.get('/messages')
      .success(function(response){
        $scope.messages = response;
      })
      .error(function(response){
        alert('Error!');
      });

    $scope.$on('new-message', function(event, newMessage){
      $scope.messages.push(newMessage);
    });
  }

]);

messagesControllers.controller('MessagesComposeCtrl', [
  '$scope', '$http', '$log','authService', 'notificationService',
  function($scope, $http, $log, authService, notificationService) {
    //TODO - change api
    //this is demo
    $http.get('/api/rest/users').success(function(response){
      $scope.recipients = response;
    });

    $scope.sendMessage = function(){
      //TODO - validate params before call API
      $http.post('/messages', {
        subject : $scope.message.subject,
        recipient : $scope.message.recipients,
        message : $scope.message.message
      })
        .success(function(response){
          //sent mail successfully
          if(response.status){
            //emit to this user
            var id = $scope.message.recipients;
            var to = _.find($scope.recipients, { _id: id });

            $scope.$emit('backend', { action: 'notify:sio',
                                      message: 'You have a new message from ' + authService.user.email,
                                      user: to,
                                      type: 'message'
                                    });

            notificationService.success('Message has sent');

            $scope.message.subject = '';
            $scope.message.message = '';
          }
        })
        .error(function(response){
          console.log(response)
        });
    };
  }
]);


messagesControllers.controller('MessagesReplyCtrl', [
  '$scope', '$http', '$log','authService', 'notificationService',
  function($scope, $http, $log, authService, notificationService, messageId) {
		//TODO - get dynamic message ID

		$scope.messageId = '52ac0765f8cd96625e00002a';
		$http.get('/messages/'+$scope.messageId).success(function(response){
			$scope.message = response;
		})
		  .error(function(){
			  notificationService.success('Error');
		  });

    $scope.sendMessage = function(){
      $http.post('/messages', {
        subject : $scope.replyMessage.subject,
        recipient : $scope.message.ownerId,
        message : $scope.replyMessage.message
      })
        .success(function(response){
          //sent mail successfully
          if(response.status){
            //emit to this user
            var to = $scope.message.sender;

            $scope.$emit('backend', { action: 'notify:sio',
                                      message: 'You have a new message from ' + authService.user.email,
                                      user: to,
                                      type: 'message'
                                    });

            notificationService.success('Message has sent');

            $scope.replyMessage.subject = '';
            $scope.replyMessage.message = '';
          }
        })
        .error(function(response){
          console.log(response)
        });
    };
  }
]);

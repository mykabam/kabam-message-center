angular.module('kabam.messages.states', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('messages', {
                url: "/messages",
                templateUrl: "/assets/message/views/list.html",
                controller: 'MessagesListCtrl'
            })
            .state('composeMessage', {
                url: "/message/compose",
                templateUrl: "/assets/message/views/compose.html",
                controller: 'MessagesComposeCtrl'
            })
			.state('replyMessage', {
				url: "/message/reply/:id",
                templateUrl: "/assets/message/views/reply.html",
                controller: 'MessagesReplyCtrl',
				resolve: {	
					messageId : function($stateParams) {
						console.log($stateParams.id);
						 return $stateParams.id;
					 }
				}
			})
    });

angular.module('kabam.messages.states').config([
  'kabamStatesProvider',
  function(kabamStatesProvider) {
    kabamStatesProvider
    .push([
      {
        name: 'messages',
        url: "/messages",
        templateUrl: "/assets/message/views/list.html",
        controller: 'MessagesListCtrl',
        resolve: {
          page: function() {
            return 1;
          }
        }
      },
      {
        name: 'composeMessage',
        url: '/message/compose',
        templateUrl: '/assets/message/views/compose.html',
        controller: 'MessagesComposeCtrl'
      },
      {
        name: 'replyMessage',
        url: '/message/reply/:id',
        templateUrl: '/assets/message/views/reply.html',
        controller: 'MessagesReplyCtrl',
        resolve: {
          message: function(MessageService, $stateParams) {
            return MessageService.getMessage($stateParams.id);
          }
        }
      }
    ]);
  }
]);
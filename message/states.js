angular.module('kabam.messages.states').config([
  'kabamStatesProvider',
  function(kabamStatesProvider) {
    kabamStatesProvider
    .push([
      {
        name: 'messages',
        url: "/messages/:page",
        templateUrl: "/assets/message/views/list.html",
        controller: 'MessagesListCtrl',
        resolve: {
          page: function($stateParams) {
            //if page param is null or not numerical, set to 1
            return !isNaN(parseInt($stateParams.page)) && isFinite($stateParams.page) ?
                    parseInt($stateParams.page) : 1;
          },
          totalMessages : function(MessageService){
            return MessageService.getTotalMessages();
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
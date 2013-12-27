var messageServices = angular.module('kabam.messages.services');
/**
 * rewrite baseurl of default restangular
 */
messageServices.factory('MessageRestangular', [
  'Restangular',
  function(Restangular){
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/');
    });
  }
]);

messageServices.factory('MessageService', [
  'MessageRestangular', '$http', '$q',
  function(MessageRestangular, $http) {

    var _messageService = MessageRestangular.all('messages');

    return {
      /**
       * get total mesasges belongs to current user
       * @returns
       */
      getTotalMessages : function(){
        return _messageService.customGET('total').then(function(response){
          if(response.total){
            return response.total;
          }else{
            return 0;
          }
        });
      },
      /**
       * get all messages from api
       */
      getMessages: function(page) {
        return _messageService.getList({page : page}).then(function(messageCollection){
          return messageCollection;
        });
      },
      /**
       * get single message
       */
      getMessage: function(id) {
        return _messageService.get(id);
      },
      /**
       * reply or compose a new message
       */
      postMessage: function(message) {
        return _messageService.post(message).then(function(response){
          return response;
        });
      },

      /**
       * edit a message
       *
       */
      putMessage : function(message){
        return message.put().then(function(response){
          return response;
        });
      },

      /**
       * delete sepecified message
       * @param string id message id
       * @returns response from server
       */
      deleteMessage : function(id){
        return _messageService.one(id).remove();
      }
    };
  }
]);
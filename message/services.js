var messageServices = angular.module('kabam.messages.services');

messageServices.factory('Message', [
  'Restangular',
  function(Restangular) {
    return Restangular.all('Message');
  }
]);

messageServices.factory('MessageService', [
  'Restangular', '$http',
  function(Restangular, $http) {
    var _messageService = Restangular.all('Message');

    return {
      getMessages: function(page) {
        return $http.get('/messages', {params: {page: page}}).then(function(response) {
          for (i = 0; i < response.data.length; i++) {
            if (response.data[i].readingStatus != null && response.data[i].readingStatus) {
              response.data[i].readingStatus = 'Readed';
            } else {
              response.data[i].readingStatus = 'Unread';
            }
          }
          return response.data;
        });
      },
      getMessage: function(id) {
        return $http.get('/messages/' + id).then(function(response) {
          return response.data;
        });
      },
      /**
       * reply or compose a new message
       */
      postMessage: function(message) {
        return $http.post('/messages', message).then(function(response) {
          return response.data;
        });
      }
    };
  }
]);
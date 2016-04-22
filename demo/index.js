angular.module('demoApp', ['ftv.popinConnection']);
angular.module('demoApp').controller('DemoController', ['$scope','$rootScope', 'popinConnectionService', function($scope, $rootScope, popinConnectionService) {
    $scope.showPopIn = function(){
        popinConnectionService.showModal();
    };

    $rootScope.$on('open-popin', function(){
        alert('Event "open-popin" is triggered');
    });

    $rootScope.$on('close-popin', function(){
        alert('Event "close-popin" is triggered');
    });
}]);

angular.module('demoApp', ['ftv.popinConnection']);
angular.module('demoApp').controller('DemoController', ['$scope', 'popinConnectionService', function($scope, popinConnectionService) {
    $scope.showPopIn = function(){
        popinConnectionService.showModal();
    };
}]);

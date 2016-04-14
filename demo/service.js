angular.module('ftv.popinConnection', [
    'ftv.components.popinGeneric'
])

.service('popinConnectionService', ['popinGenericService', function(popinGenericService) {
    this.showModal = function() {
        return popinGenericService.showModal({
            templateUrl: "/demo/service.html",
            controller: 'PopinDemoController',
            cssModifier: 'demoPopin'
        });
    };
}])

.controller('PopinDemoController', ['$scope', '$window','close', function ($scope, $window, close) {
    $scope.connection = function() {
        close();
        // do something here
    };

    $scope.registration = function() {
        close();
        // do something here
    };
}]);

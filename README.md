# Ftv::Components::Popin generic

Angular module to make popin easily. It provide a service to build popin with a basic style.

## Get sources

```
git clone git@gitlab.ftven.net:team-infini/ftv-angular-popin-generic.git 
```

## Required dependencies

- [npm](https://nodejs.org/)
- [gem](https://rubygems.org/)

## How to use

Include javascript and style

```
<script src="dist/component.js"></script>
<link rel="stylesheet" href="dist/component.css">
```

Create a module and inject the component

``` 
var module = angular.module('ftv.popinConnection', [
    'ftv.components.popinGeneric'
]);
```

Create a service to handle your popin

```
module.service('popinConnectionService', ['popinGenericService', function(popinGenericService) {
    this.showModal = function() {
        return popinGenericService.showModal({
            templateUrl: "/demo/service.html",
            controller: 'PopinDemoController',
            cssModifier: 'demoPopin'
        });
    };
}])
```

Create a controller for the popin service.

```
module.controller('PopinDemoController', ['$scope', 'close', function ($scope, close) {
    $scope.connection = function() {
        // do something here
        close(); //then, close the popin
    };
}]);
```

In you app, inject your popin service ```ftv.popinConnection``` and trigger ```showModal``` to display the popin.

```
angular.module('demoApp', ['ftv.popinConnection']);
angular.module('demoApp').controller('DemoController', ['$scope', 'popinConnectionService', function($scope, popinConnectionService) {
    $scope.showPopIn = function(){
        popinConnectionService.showModal();
    };
}]);
```

In your template, add a button and call ```showPopIn()``` method.

```
<button ng-click="showPopIn()">Click to show the popin</button>
```

## Options

* templateUrl: template to display inside the layout
* controller: controller use inside popin
* cssModifier: css class that identify popin

## Event

* open-popin: when popin is opened
* close-popin: when popin is closed

## Build process

```
sudo apt-get install ruby ruby-dev gem
npm install -g gulp

npm install
sudo gem install compass

gulp build
```

## Development build for front web only

```
gulp build-dev-watch
```

## Demo

```
npm install -g http-server
gulp build
http-server
```

Open [demo](http://127.0.0.1:8080/demo.html)

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 France Télévisions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('ftv.components.popinGeneric', [
    'ftv.components.popinGeneric.templates'
])

.factory('popinModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$templateCache',
        function ($document, $compile, $controller, $http, $rootScope, $q, $templateCache) {

            //  Get the body of the document, we'll add the modal to this.
            var body = $document.find('body');

            function ModalService() {

                var self = this;

                //  Returns a promise which gets the template, either
                //  from the template parameter or via a request to the
                //  template url parameter.
                var getTemplate = function (template, templateUrl) {
                    var deferred = $q.defer();
                    if (template) {
                        deferred.resolve(template);
                    } else if (templateUrl) {
                        // check to see if the template has already been loaded
                        var cachedTemplate = $templateCache.get(templateUrl);
                        if (cachedTemplate !== undefined) {
                            deferred.resolve(cachedTemplate);
                        }
                        // if not, let's grab the template for the first time
                        else {
                            $http({method: 'GET', url: templateUrl, cache: true})
                                .then(function (result) {
                                    // save template into the cache and return the template
                                    $templateCache.put(templateUrl, result.data);
                                    deferred.resolve(result.data);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                        }
                    } else {
                        deferred.reject("No template or templateUrl has been specified.");
                    }
                    return deferred.promise;
                };

                self.showModal = function (options) {

                    //  Create a deferred we'll resolve when the modal is ready.
                    var deferred = $q.defer();

                    //  Validate the input parameters.
                    var baseControllerName = options.baseController;
                    if (!baseControllerName) {
                        deferred.reject("No controller has been specified.");
                        return deferred.promise;
                    }

                    var controllerName = options.controller;

                    //  Get the actual html of the template.
                    getTemplate(options.template, options.layoutUrl)
                        .then(function (template) {

                            //  Create a new scope for the modal.
                            var modalScope = $rootScope.$new();
                            modalScope.templateUrl = options.templateUrl;

                            modalScope.classes = {
                                'ftvPopin': true
                            };
                            if (options.cssModifier) {
                                modalScope.classes['ftvPopin--' + options.cssModifier] = true;
                            }

                            //  Create the inputs object to the controller - this will include
                            //  the scope, as well as all inputs provided.
                            //  We will also create a deferred that is resolved with a provided
                            //  close function. The controller can then call 'close(result)'.
                            //  The controller can also provide a delay for closing - this is
                            //  helpful if there are closing animations which must finish first.
                            var closeDeferred = $q.defer();
                            var inputs = {
                                $scope: modalScope,
                                close: function (result, delay) {
                                    $rootScope.$emit('close-popin');
                                    if (delay === undefined || delay === null) delay = 0;
                                    window.setTimeout(function () {
                                        //  Resolve the 'close' promise.
                                        closeDeferred.resolve(result);

                                        //  We can now clean up the scope and remove the element from the DOM.
                                        modalScope.$destroy();
                                        modalElement.remove();

                                        //  Unless we null out all of these objects we seem to suffer
                                        //  from memory leaks, if anyone can explain why then I'd
                                        //  be very interested to know.
                                        inputs.close = null;
                                        deferred = null;
                                        closeDeferred = null;
                                        modal = null;
                                        inputs = null;
                                        modalElement = null;
                                        modalScope = null;
                                    }, delay);
                                }
                            };

                            //  If we have provided any inputs, pass them to the controller.
                            if (options.inputs) {
                                for (var inputName in options.inputs) {
                                    inputs[inputName] = options.inputs[inputName];
                                }
                            }

                            //  Parse the modal HTML into a DOM element (in template form).
                            var modalElementTemplate = angular.element(template);

                            //  Compile then link the template element, building the actual element.
                            //  Set the $element on the inputs so that it can be injected if required.
                            var linkFn = $compile(modalElementTemplate);
                            var modalElement = linkFn(modalScope);
                            inputs.$element = modalElement;

                            //  Create the base controller, explicitly specifying the scope to use.
                            var modalBaseController = $controller(baseControllerName, inputs);

                            // if controller exist, use it, else, use bas controller
                            var modalController;
                            if (controllerName) {
                                modalController = $controller(controllerName, inputs);
                            }

                            //  Finally, append the modal to the dom.
                            if (options.appendElement) {
                                // append to custom append element
                                options.appendElement.append(modalElement);
                            } else {
                                // append to body when no custom append element is specified
                                body.append(modalElement);
                            }

                            //  We now have a modal object...
                            var modal = {
                                scope: modalScope,
                                element: modalElement,
                                close: closeDeferred.promise,
                                baseController: modalBaseController,
                                controller: modalController
                            };

                            //  ...which is passed to the caller via the promise.
                            deferred.resolve(modal);

                        })
                        .then(function() {
                            $rootScope.$emit('open-popin');
                        }, function (error) { // 'catch' doesn't work in IE8.
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };

            }

            return new ModalService();
        }])

.service('popinGenericService', ['popinModalService', function(popinModalService) {
    this.showModal = function(options) {
        return popinModalService.showModal({
            layoutUrl: "/popinGeneric/index.html",
            baseController: "popinGenericController",
            templateUrl: options.templateUrl,
            controller: options.controller,
            cssModifier: options.cssModifier
        });
    };
}])

.controller('popinGenericController', ['$scope', 'close', function ($scope, close) {
    $scope.close = function() {
        close();
    };

    // keep popin open when clicking in content.
    $scope.stillOpen = function ($event) {
        $event.stopPropagation();
    };
}]);

angular.module("ftv.components.popinGeneric.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/popinGeneric/index.html","<div ng-class=\"classes\" ng-click=\"close()\"><div class=\"ftvPopin__wrapper\" ng-click=\"stillOpen($event)\"><ng-include src=\"templateUrl\"></ng-include></div></div><div class=\"ftvPopinOverlay\"></div>");}]);
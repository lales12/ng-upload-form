/**
 *  
 */

(function () {
    'use strict';

    angular.module('ngJqueryForm', []).directive('ngJqueryForm',
        function(){
            return {
                restrict: 'EA',
                template: "<input type='file' name='{{formScope.name}}[]' ng-model='files' id='{{formScope.id}}' enctype='multipart/form-data' multiple><label for",

                scope: {
                    ngJqueryFormAction:     '@',
                    ngJqueryFormName:       '@',
                    ngJqueryFormId:         '@',
                    ngJqueryFormClear:      '=',
                    ngJqueryFormSend:       '=',
                    ngJqueryFormFiles:      '=',
                    ngJqueryFormProgress:   '=',
                    ngJqueryFormError:      '='
                },
                link: function ($scope, $element, $attrs){
                    var url, uploadProgress, writeError, writeSuccess;

                    $scope.formScope = {};
                    $element.change( function () {
                        if ( $attrs.ngJqueryFormFiles ) {
                            $scope.$apply(function() {
                                angular.forEach($element.formToArray(), function (file) {
                                    $scope.ngJqueryFormFiles.push(file.value);
                                })
                            })
                        }
                    });


                    if ( $attrs.ngJqueryFormAction ) {
                        url = $scope.ngJqueryFormAction;
                    }
                    if ( $attrs.ngJqueryFormProgress ) {
                        $scope.ngJqueryFormProgress = 0;
                    }   
                    if ( $attrs.ngJqueryFormFiles ) {
                        $scope.ngJqueryFormFiles = [];
                    }
                    if ( $attrs.ngJqueryFormId ) {
                        $scope.formScope.id = $scope.ngJqueryFormId;
                    } else {
                        $scope.formScope.id = 'files';
                    }
                    if ( $attrs.ngJqueryFormName ) {
                        $scope.formScope.name = $scope.ngJqueryFormName;
                    } else {
                       $scope.formScope.name = "files"; 
                    }

                    // miramos si esta el atributo definido y si lo esta lo lincamos 
                    // con nuestra funcion
                    if ( $attrs.ngJqueryFormSend ) {
                        $scope.ngJqueryFormSend = function () {
                            
                            $element.ajaxForm({
                                url: url,
                                type: 'POST',
                                uploadProgress: uploadProgress,
                                success: function (response, status) {
                                    writeSuccess(response, status);
                                },
                                error: function (response, status) {
                                    writeError(response, status);
                                }
                            });

                            $element.submit();
                        }
                    }

                    if ($attrs.ngJqueryFormClear){
                        $scope.ngJqueryFormClear = function () {
                            $element.resetForm();
                            $scope.ngJqueryFormFiles = [];
                        }
                    }

                    uploadProgress = function (event, position, total, percentComplete) {
                        $scope.$apply(function () {
                            if( $scope.ngJqueryForm )
                            $scope.ngJqueryFormProgress = percentComplete;
                        })
                    };

                    writeError = function (msg) {
                        $scope.$apply(function () {
                            if( $attrs.ngJqueryFormError ) {
                                $scope.ngJqueryFormError(arguments);
                            }
                        })
                    };

                    writeSuccess = function () {
                        $scope.$apply(function () {
                            if( $attrs.ngJqueryFormSuccess ) {
                                $scope.ngJqueryFormSuccess(arguments);
                            }
                        })
                    } 
                }
            }
        }
    )
})()
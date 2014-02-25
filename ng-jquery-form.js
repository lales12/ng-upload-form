/**
 *  
 */

(function () {
    'use strict';

    angular.module('ngJqueryForm', []).directive('ngJqueryForm',
        function(){
            return {
                restrict: 'EA',
                template: "<label for='{{formScope.id}}' class='btn btn-default'>Selecionar archivo</label><input type='file' class = 'hide' name='{{formScope.name}}[]' ng-model='files' id='{{formScope.id}}' enctype='multipart/form-data' multiple><input type='hidden' name='recipients[]' value='{{formScope.email}}' ng-model='model.email'><input type='hidden' name='subject' value='Sing Document' ng-model='model.email'>",

                scope: {
                    ngJqueryFormAction:     '@',
                    ngJqueryFormName:       '@',
                    ngJqueryFormId:         '@',
                    ngJqueryFormClear:      '=',
                    ngJqueryFormSend:       '=',
                    ngJqueryFormFiles:      '=',
                    ngJqueryFormProgress:   '=',
                    ngJqueryFormError:      '=',
                    ngJqueryFormSuccess:    '=',
                    ngJqueryFormHeader:     '=',
                    ngJqueryFormEmail:      '='
                },

                link: function ($scope, $element, $attrs, $watch){
                    var url, progress, writeError, writeSuccess, clearFiles;

                    $scope.formScope = {};

                    $element.change( function () {
                        if ( $attrs.ngJqueryFormFiles ) {
                            $scope.$apply(function() {
                                angular.forEach($element.formToArray(), function (file) {
                                    console.log(file);
                                    if ( file.type ===  "file" ) {
                                        if ( file.value.type === "application/pdf" ) { 
                                            $scope.ngJqueryFormFiles.push(file.value);
                                        } else {
                                            if( $attrs.ngJqueryFormError ) {
                                                $scope.ngJqueryFormError('', {'code' : -601});
                                            }
                                        }
                                    }
                                })
                            })
                        }
                    });

                    if ( $attrs.ngJqueryFormAction ) {
                        url = $scope.ngJqueryFormAction;
                    }
                    if ( $attrs.ngJqueryFormProgress ) {
                        $scope.ngJqueryFormProgress ;
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
                            if ( $attrs.ngJqueryFormEmail ) {
                                $scope.ngJqueryFormProgress = true;
                                $scope.formScope.email = $scope.ngJqueryFormEmail;

                                if ( $scope.formScope.email !== "" && $scope.ngJqueryFormFiles.length > 0) {
                                    setTimeout(function (){
                                        $element.ajaxForm({
                                            url: url,
                                            type: 'POST',
                                            headers: $scope.ngJqueryFormHeader,
                                            beforeSubmit: function (){
                                                progress(true);
                                                return true;
                                            },
                                            uploadProgress: function (event, position, total, percentComplete) {
                                                console.log("el progress es");
                                                console.log(total);
                                                console.log(position);
                                                console.log(percentComplete);
                                                progress(percentComplete)
                                                
                                            },
                                            success: function (response, status) {
                                                writeSuccess(response, status);
                                            },
                                            error: function (response, status) {
                                                writeError(response, status);
                                            }
                                        });
                                        $element.submit();
                                    }, 500);
                                } else {
                                    if( $attrs.ngJqueryFormError ) {
                                        if($scope.ngJqueryFormFiles.length === 0){
                                            $scope.ngJqueryFormError('', {'code' : 405});
                                        } else {
                                            $scope.ngJqueryFormError('', {'code' : 404});
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if ($attrs.ngJqueryFormClear){
                        $scope.ngJqueryFormClear = clearFiles;
                    }

                    clearFiles = function () {
                        $element.resetForm();
                        $scope.ngJqueryFormFiles = [];
                    }
                    progress = function (percentComplete) {
                        $scope.$apply(function () {
                            $scope.ngJqueryFormProgress = percentComplete;
                            console.log($scope.ngJqueryFormProgress);
                        })
                    };

                    writeError = function (response, status) {
                        $scope.$apply(function () {
                            if( $attrs.ngJqueryFormError ) {
                                $scope.ngJqueryFormError(response, status);
                            }
                        })
                    };

                    writeSuccess = function (response, status) {
                        $scope.$apply(function () {
                            if( $attrs.ngJqueryFormSuccess ) {
                                $scope.ngJqueryFormSuccess(response, status);
                            }
                        })
                    } 
                }
            }
        }
    )
})()
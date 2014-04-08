/**
 *  
 */

(function () {
    'use strict';

    angular.module('ngJqueryForm', []).directive('ngJqueryForm',
        function(){
            return {
                restrict: 'EA',
                template: "<label for='{{formScope.id}}' class='btn btn-default''>{{formScope.labelContent}}</label><input type='file' class = 'hide' name='{{formScope.name}}[]' ng-model='files' id='{{formScope.id}}' enctype='multipart/form-data' multiple><input type='hidden' name='recipients[]' value='{{formScope.email}}' ng-model='model.email'><input type='hidden' name='subject' value='{{formScope.subject}}' ng-model='model.email'>",

                scope: {
                    ngJqueryFormAction:     '@',
                    ngJqueryFormName:       '@',
                    ngJqueryFormLabel:      '@',
                    ngJqueryFormId:         '@',
                    ngJqueryFormSubject:    "@",
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
                                $scope.ngJqueryFormFiles = [];
                                angular.forEach($element.formToArray(), function (file) {
                                    if ( file.type ===  "file" ) {

                                        $scope.ngJqueryFormFiles.push(file.value);

                                    }
                                });
                            });
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
                    if ( $attrs.ngJqueryFormLabel ) {
                        $scope.formScope.labelContent = $scope.ngJqueryFormLabel;
                    } else {
                        $scope.formScope.labelContent = 'Select file';
                    }
                    if ( $attrs.ngJqueryFormSubject ) {
                        $scope.formScope.subject = $scope.ngJqueryFormSubject;
                    } else {
                        $scope.formScope.subject = "Sign request";
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

                                $scope.formScope.email = $scope.ngJqueryFormEmail;

                                if ( $scope.formScope.email !== "" && $scope.ngJqueryFormFiles.length > 0) {
                                    $scope.ngJqueryFormProgress = true;
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
                                                progress(percentComplete);
                                            },
                                            success: function (response, status) {
                                                writeSuccess(response, status);
                                                progress(false);
                                            },
                                            error: function (response, status) {
                                                writeError(status, response);
                                                progress(false);
                                            }
                                        });
                                        $element.submit();
                                    }, 500);
                                } else {
                                    if( $attrs.ngJqueryFormError ) {
                                        if($scope.ngJqueryFormFiles.length === 0){
                                            $scope.ngJqueryFormError('', {'status' : 405});
                                        } else {
                                            $scope.ngJqueryFormError('', {'status' : 404});
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
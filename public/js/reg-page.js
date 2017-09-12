        var app = angular.module("main",[]);
        app.controller ("regCtrl",function($scope,$http,$interval){
            $scope.user_id = "";
            $scope.pw="";
            $scope.pw2="";
            $scope.email="";
            $scope.captcha='';
            $scope.nameTaken;
            $scope.emailTaken;
            $scope.captchaCorrect;
            $scope.timerName = null;
            $scope.timerEmail = null;
            $scope.timerCaptcha = null;
            $scope.regSuccess = false;
            $scope.checkName = function(){
                $scope.timerName = null;
                $http.post("/reg/checkName",JSON.stringify({user_id : $scope.user_id}),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function(res){
                        $scope.nameTaken = (res.length == 0? false : true);
                });
            };
            $scope.checkEmail = function(){
                $scope.timerEmail = null;
                $http.post("/reg/checkEmail",{email : $scope.email}).success(function(res){
                        $scope.emailTaken = (res.length == 0? false : true);
                });
            };
            $scope.checkCaptcha = function(){
                $scope.timerCaptcha = null;
                $http.post("/reg/checkCaptcha",{validcode:$scope.captcha}).success(function(res){
                        //console.log(res);
                        $scope.captchaCorrect = (res == 0? false : true);
                });
            };
            // call checkName after 2s, prevent rapid request to burden server
            $scope.delayCheckName = function(){
                if(!$scope.timerName){
                    $scope.timerName = true;
                    $interval($scope.checkName,1000,1);
                }
            };
            $scope.delayCheckEmail = function(){
                if(!$scope.timerEmail && !$scope.regForm.email.$error.email){
                    $scope.timerEmail = true;
                    $interval($scope.checkEmail,1000,1);
                }
            };
            $scope.delayCheckCaptcha = function(){
                if(!$scope.timerCaptcha){
                    $scope.timerCaptcha = true;
                    $interval($scope.checkCaptcha,1000,1);
                }
            };
            $scope.register = function(){
                var regInfo =  {user_id : $scope.user_id, password : $scope.pw, email:$scope.email};
                $http.post('/reg/',regInfo).success(function(res){
                    $scope.regSuccess = true;
                });
                return false;
            }
        });
        
        function resendCaptcha(){
            $.get('/login/captcha',function(res){
                $('#captchaImg').attr('src',"data:image/png;base64," + res);
            });
        }
        
        function redirectToLoginPage(){
            window.location = '/';
        }
        
        $(function() {
            $("input").on({
               keydown: function(e) {
                  if (e.which === 32)
                     return false;
               },

               change: function() {
                  this.value = this.value.replace(/\s/g, "");
               }
                });
        });
        
        
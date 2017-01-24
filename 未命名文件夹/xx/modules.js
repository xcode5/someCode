(function () {

    /**
     * 游戏区服模拟数据
     *
     */

	var wapMainDomain = 'http://m.cgamex.com/static/js/m.cgamex.com';
	
    var app = angular.module('app', []);

    /**
     * 滚动图
     */
    app.controller('SliderBox', function ($scope) {

    });

    app.controller('Nav', function ($scope) {
        $scope.showLoginBtn = Common.Cookie.GetCookie(Configs.WebSite.CookieName) == null ||
            Common.Cookie.GetCookie(Configs.WebSite.CookieName) == undefined ||
            Common.Cookie.GetCookie(Configs.WebSite.CookieName) == "";
        $scope.userName = Common.Cookie.GetCookie(Configs.WebSite.CookieName);

    })

    /**
     * 注册控制器
     */
    app.controller('Register', function ($scope) {

        $('#uname').focus();

        $scope.user = {
            uname: null,
            passwd: null,
            repasswd: null
        };

        $scope.doReg = function () {
            Common.Ajax.RequestAjax(
                Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=152&username=" + encodeURI($scope.user.uname) + "&password=" + $scope.user.passwd,
                {},
                "jsonp",
                true,
                function (data) {
                    Common.Layer.CloseAll();
                    if (data[0].code != 1) {
                        Common.Layer.ShowAlertNoTitle(data[0].message, Common.Style.AlertWarning);
                    } else {
                        Common.Layer.ShowAlertNoTitle("注册成功,即将为您跳转.", Common.Style.AlertSuccess, function () {
                            Common.Ajax.RequestAjax(
                                Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=153&username=" + encodeURI($scope.user.uname) + "&password=" + $scope.user.passwd,
                                {},
                                "jsonp",
                                true,
                                function (data) {
                                    Common.Layer.CloseAll();
                                    if (data[0].code != 1) {
                                        Common.Layer.ShowAlertNoTitle(data[0].message, Common.Style.AlertWarning);
                                    } else {
                                        Common.Layer.ShowAlertNoTitle("登录成功,即将为您跳转.", Common.Style.AlertSuccess, function () {
                                        	var href = new String(window.location.href);
                                            window.location.href = href.indexOf(wapMainDomain) > 0 ? '/user/' : '/m/user/';
                                        });
                                    }
                                }
                            )
                        });
                    }
                }
            )
        };

    });

    /**
     * 登录控制器
     */
    app.controller('Login', function ($scope,$location) {


      if($location.$$absUrl.indexOf("http://m.cgamex.com/static/js/login.html")>-1) {//如果检测到时登录界面的话，就直接进行跳转到用户中心界面

          if (Common.Cookie.GetCookie(Configs.WebSite.CookieName) != null && Common.Cookie.GetCookie(Configs.WebSite.CookieName) != undefined && Common.Cookie.GetCookie(Configs.WebSite.CookieName) != "") {
        	  var href = new String(window.location.href);
              window.location.href = href.indexOf(wapMainDomain) > 0 ? '/user/' : '/m/user/';
          }
      }

        $('#uname').focus();

        $scope.user = {
            uname: null,
            passwd: null
        };
        $scope.doLogin = function () {
            Common.Ajax.RequestAjax(
                Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=153&username=" + encodeURI($scope.user.uname) + "&password=" + $scope.user.passwd,
                {},
                "jsonp",
                true,
                function (data) {
                    Common.Layer.CloseAll();
                    if (data[0].code != 1) {
                        Common.Layer.ShowAlertNoTitle(data[0].message, Common.Style.AlertWarning);
                    } else {
                        if($location.$$absUrl.indexOf("http://m.cgamex.com/static/js/cps.html")>-1) {
                            Common.Layer.ShowAlertNoTitle("登录成功", Common.Style.AlertSuccess, function () {
                                window.location.reload();
                            });
                        }else {
                            Common.Layer.ShowAlertNoTitle("登录成功,即将为您跳转.", Common.Style.AlertSuccess, function () {
                            	var href = new String(window.location.href);
                                window.location.href = href.indexOf(wapMainDomain) > 0 ? '/user/' : '/m/user/';
                            });
                        }
                    }
                }
            )
        }

    })

    /**
     * 用户中心控制器
     */
    app.controller('UserInfo', function ($scope, $http) {

        //$scope.userInfo = {coin:0,name:'正在获取...'};


        $scope.name = '正在获取...';
        $scope.coin = 0;

        if (Common.Cookie.GetCookie(Configs.WebSite.CookieName)) {
            $scope.name = Common.Cookie.GetCookie(Configs.WebSite.CookieName);
        } else {
        	var href = new String(window.location.href);
            window.location.href = href.indexOf(wapMainDomain) > 0 ? 'http://m.cgamex.com/user/login.html' : 'http://m.cgamex.com/m/user/login.html';
        }

        var getConsumeLogUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=157&callback=JSON_CALLBACK";
        $http.jsonp(getConsumeLogUrl).success(function (response) {
            $scope.logs = response[0].data;
        }).error(function () {
            Common.Layer.ShowAlertNoTitle("网络繁忙,请稍后再试.", Common.Style.AlertError, null)
        });

        var getUerInfoUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=156&callback=JSON_CALLBACK";
        $http.jsonp(getUerInfoUrl).success(function (data, status, header, config) {

            data = data[0].data;

            $scope.coin = data.coin;

            console.log(data);


        }).error(function () {
            Common.Layer.ShowAlertNoTitle("网络繁忙,请稍后再试.", Common.Style.AlertError, null)
        });

        $scope.logOut = function () {
            var logOutUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=155&callback=JSON_CALLBACK";
            $http.jsonp(logOutUrl).success(function (response) {
                var data = response[0];
                if (data.code != 1) {
                    Common.Layer.ShowAlertNoTitle(data.message, Common.Style.AlertWarning, null)
                } else {
                    Common.Layer.ShowAlertNoTitle("安全退出账号.", Common.Style.AlertSuccess, function () {
                    	var href = new String(window.location.href);
                        window.location.href = href.indexOf(wapMainDomain) > 0 ? '/' : '/m/';
                    })
                }
            }).error(function () {
                Common.Layer.ShowAlertNoTitle("网络繁忙,请稍后再试.", Common.Style.AlertError, null)
            })
        }

    })


    /**
     * 充值控制器
     */
    app.controller('Pay', function ($scope, $location, $http) {
        /*
         参数：
         1:支付账号
         2:支付方式
         2.1:网银
         2.2:支付宝
         2.3:微信
         2.4:点卡
         3:支付游戏
         4:支付游戏的区服(必须要有游戏id这个才有用)
         5:支付金额
         */
        $('#uName').focus();

        //获取参数数组
        var parameterArray = $location.search();
        var userName = parameterArray.username;//账号
        var payType = parameterArray.paytype;//支付方式
        var payToType = parameterArray.paytotype;//支付到
        var gameId = parameterArray.gameid;//游戏编号
        var serverId = parameterArray.serverid;//区服编号
        var payMoney = parameterArray.paymoney;//充值金额

        //获取充值类型
        var findPayTypeById = $.Enumerable.From(Configs.Pay.PayType)
            .Where(function (p) {
                return p.TypeId == payType
            }).ToArray();

        //获取游戏列表
        var findGameById = Common.System.QueryGameInfoById(gameInfo, gameId);


        //获取当前游戏的区服列表
        var findServerById = null
        if (findGameById.length > 0) {
            findServerById = Common.System.QueryServerById(findGameById[0], serverId);
        }

        var payTypeObjFromParameter = findPayTypeById[0];//根据URL参数获取到的充值方式对象

        var gameInfoObjFromParameter = findGameById[0];

        var serverInfoObjFromParameter = findServerById ? findServerById[0] : null;

        var cardInfo = Common.System.GetCardMoneyByCardId(Configs.Pay.DefaultCardType)[0];

        $scope.payTypes = Configs.Pay.PayType;//充值类型表

        $scope.payMoneyDefine = Configs.Pay.PayMoney;//充值金额表

        $scope.payToTypeDefine = Configs.Pay.PayToType;//充值到..列表

        $scope.cardTypeDefine = Configs.Pay.CardMoney;//卡类充值类型列表

        $scope.cardInfo = cardInfo;//默认的充值卡类型的信息表

        $scope.isCardPay = false;//是否是卡类支付，默认不是

        $scope.isPayToGame = Configs.Pay.DefaultPayToType != 2;//是否默认到C币充值，如果是C币充值

        $scope.isPayToGameServer = false;//是否有区服

        $scope.defaultRoleId = 0;

        $scope.userInfo = null;//玩家在C的账号信息

        $scope.trueMoney = 0;

        $scope.canSubmit = false;

        //表单model
        $scope.payParameter = {
            userName: userName,
            payType: payType && payTypeObjFromParameter ? parseInt(payType) : Configs.Pay.DefaultPayType,
            gameInfo: gameInfoObjFromParameter ? gameInfoObjFromParameter : null,
            serverInfo: serverInfoObjFromParameter ? serverInfoObjFromParameter : null,
            roleInfo: [
                {roleid: 0, rolename: "请选择您要充值的角色"}
            ],
            payMoney: payMoney ? parseInt(payMoney) : null,
            defaultPayMoney: Configs.Pay.DefaultPayMoney,
            defaultPayToType: payToType == null ? Configs.Pay.DefaultPayToType : parseInt(payToType),
            defaultCardType: Configs.Pay.DefaultCardType,
            defaultCardMoney: Configs.Pay.DefaultCardMoney,
            cardAccount: null,
            cardPass: null
        };

        if (Common.Cookie.GetCookie(Configs.WebSite.CookieName)) {
            $scope.payParameter.userName = Common.Cookie.GetCookie(Configs.WebSite.CookieName);

        }

        //点击选择游戏，弹出选择游戏框
        $scope.showSelectGameLayer = function () {
            Common.System.ShowSelectGameLayer(gameInfo);
        }

        //弹出选择区服框
        $scope.showSelectServerLayer = function () {
            var gameId = $('input#gameId').data('gameid');
            if (gameId != null && gameId != undefined && gameId != '') {
                Common.System.ShowSelectServerLayer(gameId);
            }
        }

        //获取玩家账号信息。
        $scope.getUserInfo = function () {
            if ($scope.payParameter.userName != '' && $scope.payParameter.userName != null && $scope.payParameter.userName != undefined) {
                var findUidUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=151&username=" + encodeURI($scope.payParameter.userName) + "&callback=?"
                Common.Ajax.RequestAjax(findUidUrl, null, "json", false, function (data) {
                    var userInfo = data[0];
                    if (userInfo.code == 1) {
                        $scope.userInfo = userInfo.data;
                        $scope.canSubmit = true;
                        $scope.$apply();
                        Common.Layer.CloseAll();
                    } else {
                        $scope.canSubmit = false;
                        $scope.$apply();
                        Common.Layer.ShowAlertNoTitle('账号不存在.请确认后重新输入.', '', function () {
                            Common.Layer.CloseAll();
                            $('#uName').focus();
                        });
                    }
                });
            }
        }

        //获取游戏角色信息
        $scope.getRoleInfo = function () {

            if ($scope.payParameter.userName == null || $scope.payParameter.userName == "" || $scope.payParameter.userName == null == undefined) {
                Common.Layer.ShowAlertNoTitle('请输入充值账号', '', function () {
                    $('#uName').focus();
                    $scope.canSubmit = false;
                });
                return;
            }

            if ($scope.payParameter.defaultPayToType != 1)
                return;

            var gameId = $('input#gameId').data('gameid');
            var serverId = $('input#serverId').data('serverid');

            if (gameId == null || gameId == undefined || gameId == "") {
                $scope.showSelectGameLayer();
                return;
            }
            if ((serverId == null || serverId == undefined || serverId == "") && $scope.isPayToGameServer) {

                console.log($scope.isPayToGameServer);
                $scope.showSelectServerLayer();
                return;
            }


            Common.Ajax.RequestAjax(Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=1101&username=" +
                encodeURI($scope.payParameter.userName) +
                "&gameid=" +
                gameId +
                "&serverid=" +
                serverId +
                "&callback=?", null, 'jsonp', true, function (data) {
                var result = data[0];
                if (result.code != 1) {
                    Common.Layer.ShowAlertNoTitle('没有找到角色，请在游戏中创建角色', '', function () {
                        $scope.defaultRoleId = 0;
                        $scope.payParameter.roleInfo = [
                            {roleid: 0, rolename: "请选择您要充值的角色"}
                        ];
                        $scope.canSubmit = false;
                        $scope.$apply();
                        Common.Layer.CloseAll();
                    });
                } else {
                    $scope.defaultRoleId = result.data[0].roleid;
                    $scope.payParameter.roleInfo = result.data;
                    $scope.canSubmit = true;
                    $scope.$apply();
                    Common.Layer.CloseAll();
                }
            })

        }


        //提交充值，这里要做全套的客户端验证
        $scope.submitPay = function () {


            if ($scope.payParameter.userName == '' || $scope.payParameter.userName == null || $scope.payParameter.userName == undefined) {
                Common.Layer.ShowAlertNoTitle('账号输入错误,请重新输入.', '', function () {
                    $('#uName').focus();
                })
                return;
            }
            //var findUidUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=151&username=" + encodeURI($scope.payParameter.userName)
            //
            //
            //
            //Common.Ajax.RequestAjax(findUidUrl,null,"jsonp",true,function(data){
            //    aa = data;
            //    Common.Layer.CloseAll();
            //})


            // $scope.getUserInfo();

            // var w = window;
            //Common.Ajax.RequestAjax(findUidUrl, null, "json", false, function (data) {
            // var userInfo = data[0];
            // if (userInfo.code == 1) {
            // $scope.userInfo = userInfo.data;
            //Common.Layer.CloseAll();
            var gameId = $('input#gameId').data('gameid');

            var serverId = $('input#serverId').data('serverid');

            var payModel = $scope.payParameter;

            var $gameInfo = null;

            var $serverInfo = null;

            if ($scope.isPayToGame) {//充值到游戏才会需要验证
                $gameInfo = Common.System.QueryGameInfoById(gameInfo, gameId);

                if ($gameInfo != null && $gameInfo.length > 0 && $gameInfo != undefined) {
                    $scope.payParameter.gameInfo = $gameInfo[0];

                } else {
                    // w.close();
                    Common.Layer.ShowAlertNoTitle('请选择要充值的游戏', '', function () {
                        $scope.canSubmit = false;
                        Common.System.ShowSelectGameLayer(gameInfo);
                    })
                    return;
                }

                $serverInfo = Common.System.QueryServerById($gameInfo[0], serverId);


                if ($scope.isPayToGameServer) {//如果选服区域被隐藏，就不需要验证是否选择了区服。

                    if ($serverInfo != null && $serverInfo.length > 0 && $serverInfo != undefined) {
                        $scope.payParameter.serverInfo = $serverInfo[0];
                    } else {
                        //w.close();
                        Common.Layer.ShowAlertNoTitle('请选择您要充值游戏的区服', '', function () {
                            $scope.canSubmit = false;
                            Common.System.ShowSelectServerLayer(gameId);
                        })
                        return;
                    }
                }

                if ($scope.defaultRoleId < 1) {
                    // w.close();
                    $scope.canSubmit = false;
                    Common.Layer.ShowAlertNoTitle('请选择充值角色', '', null);
                    return;
                }
            }

            if ($scope.isCardPay) {//如果是充值卡支付需要验证 :是否输入了卡号跟密码
                if (payModel.cardAccount == null || payModel.cardAccount == '' || payModel.cardAccount == undefined
                    || payModel.cardAccount.length < 10) {
                    Common.Layer.ShowAlertNoTitle('请输入充值卡号,至少为10位.', '', function () {
                        $scope.canSubmit = false;
                        //  w.close();
                        $('#cardAccount').focus();
                    })
                    return;
                }
                if (payModel.cardPass == null || payModel.cardPass == '' || payModel.cardPass == undefined ||
                    payModel.cardPass.length < 8) {
                    Common.Layer.ShowAlertNoTitle('请输入充值卡号,至少为8位.', '', function () {
                        $scope.canSubmit = false;
                        // w.close();
                        $('#cardPass').focus();
                    })
                    return;
                }
            }

            var _truePayMoney = $scope.payParameter.defaultPayMoney;

            var cardParameter = '';

            if ($scope.payParameter.payMoney != null && $scope.payParameter.payMoney >= 6 && $scope.payParameter.payMoney != undefined) {
                _truePayMoney = $scope.payParameter.payMoney;
            }

            if ($scope.payParameter.payType == 104) {
                _truePayMoney = $scope.payParameter.defaultCardMoney;
                cardParameter += "&cardtype=" + payModel.defaultCardType + "&cardnumber=" + payModel.cardAccount + "&cardpassword=" + payModel.cardPass;
            }

            if (_truePayMoney < 6) {
                // w.close();
                $scope.canSubmit = false;
                Common.Layer.ShowAlertNoTitle('充值金额不低于6元', '', null);
                return;
            }

            $scope.trueMoney = _truePayMoney;

            _truePayMoney = _truePayMoney * 100;

            var outorderid = Common.Tools.GetOrderNum() + $scope.userInfo.userid;

            var payUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=251&username=" +
                encodeURI($scope.payParameter.userName) +
                "&appid=" +
                gameId +
                "&target=" +
                $scope.payParameter.defaultPayToType +
                "&paytype=" +
                $scope.payParameter.payType +
                "&money=" +
                _truePayMoney +
                "&outorderid=" +
                outorderid +
                "&serverid=" +
                serverId +
                "&role=" +
                $scope.defaultRoleId +
                cardParameter;

            if ($scope.payParameter.payType == 103) {
                var html = "<p style='background-color: #d9534f;padding: 3px;margin-right: 5px; border-radius: .25em;color: #fff; font-weight: 600;'>";
                html += "支付方法：截屏或者长按保存图片-微信扫一扫右上角点击从相册选取二维码"
                html += "</p>";

                html += "<p>";
                html += "<img src='" + payUrl + "'/>";
                html += "</p>";
                Common.System.ShowOrderState(html, outorderid);
                return;
            }

            if ($scope.payParameter.payType == 104) {//卡类支付，无需跳转
                Common.Ajax.RequestAjax(payUrl, null, "jsonp", true, function (data) {
                    data = data[0];
                    if (data.code != 1) {
                        Common.Layer.ShowAlertNoTitle(data.message, '', function () {
                            Common.Layer.CloseAll();
                        });

                    } else {
                        var html = "<p>";
                        html += "<h1 class='ordertip'>订单提交成功。</h1>";
                        html += "</p>";
                        Common.System.ShowOrderState(html, outorderid);
                    }
                })
                return;
            }


            window.open(payUrl);
            var html = "<p>";
            html += "<h1 class='ordertip'>订单提交成功。</h1>";
            html += "</p>";
            Common.System.ShowOrderState(html, outorderid);

            /*
             Common.Ajax.RequestAjax(payUrl, null, "jsonp", true, function (data) {

             console.log(data);
             if (data.indexOf('alipaysubmit')>-1) {
             var html = "<p>";
             html += "<h1 class='ordertip'>订单提交成功。</h1>";
             html += "</p>";
             Common.System.ShowOrderState(html, outorderid);

             } else {
             Common.Layer.ShowAlertNoTitle(data.message, '', function () {
             Common.Layer.CloseAll();
             });
             }
             })
             */


            //window.open(payUrl);
            // w.location = payUrl;


            /*

             } else {
             Common.Layer.ShowAlertNoTitle('账号不存在.请确认后重新输入.', '', function () {
             w.close();
             Common.Layer.CloseAll();
             $('#uName').focus();
             });
             }
             });
             */


        }

        //监听支付方式是否发生改变，如果改变，针对不同的支付方式呈现不同控件
        $scope.$watch('payParameter.payType', function (newValue, oldValue) {
            if (newValue == 101 || newValue == 102 || newValue == 103) {
                $scope.isCardPay = false;
            } else {
                //卡类支付
                $scope.isCardPay = true;
            }
        })

        //当切换充值到目标
        $scope.$watch('payParameter.defaultPayToType', function (newValue, oldValue) {
            if (newValue != 1) {
                $scope.isPayToGame = false;
            } else {
                $scope.isPayToGame = true;

            }
        })

        //当切换不同运营商的卡类时
        $scope.$watch('payParameter.defaultCardType', function (newValue, oldValue) {
            $scope.cardInfo = Common.System.GetCardMoneyByCardId(newValue)[0];
        })

        //当输入金额发生改变的时候
        $scope.$watch('payParameter.payMoney', function (newValue, oldValue) {
            if (newValue == null || newValue < 6 || newValue == undefined) {
                $scope.canSubmit = false;
            } else {
                $scope.canSubmit = true;
            }
        })
    })


    /**
     * 简单支付
     */
    app.controller('SimplePay', function ($scope, $location, $http) {

        //获取参数数组
        var parameterArray = $location.search();
        var accId = parseInt(parameterArray.userid);//账号
        var payType = parameterArray.paytype;//支付方式
        var payToType = 1;//默认支付到游戏
        var gameId = parseInt(parameterArray.gameid);//游戏编号
        var payMoney = parseInt(parameterArray.money);//充值金额
        $scope.outorderid = parameterArray.outorderid//游戏单号
        $scope.role = parameterArray.role//角色信息，一般为ID
        $scope.ext1 = parameterArray.ext1;
        $scope.ext2 = parameterArray.ext2;

        $scope.canSubmit = true;//是否可以提交

        var selfGameInfo = Common.System.QueryGameInfoById(gameInfo, gameId);

        if (selfGameInfo == null || selfGameInfo == undefined) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('不存在当前游戏，游戏ID：' + gameId, Common.Style.AlertError, null);
            return;
        }

        var serverId = selfGameInfo[0].servertype == 2 ? 0 : parameterArray.serverid;//区服编号,不为2，serverid必须要传递，否则不能继续了。

        if (isNaN(accId) || accId == null || accId == undefined || accId < 1) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('账号ID格式错误.', Common.Style.AlertError, null);
            return;
        }

        if (isNaN(gameId) || gameId == null || gameId == undefined || gameId < 1) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('游戏ID格式错误.', Common.Style.AlertError, null);
            return;
        }

        if (isNaN(serverId) || serverId == null || serverId == undefined) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('区服ID格式错误.', Common.Style.AlertError, null);

            console.log(serverId);
            return;
        }
        if($scope.outorderid==null||$scope.outorderid==undefined||$scope.outorderid==''){
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('请传入正确的充值订单信息.', Common.Style.AlertError, null);
        }
        if ($scope.role == null || $scope.role == undefined || $scope.role == '') {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('请传入正确的游戏角色信息.', Common.Style.AlertError, null);
        }

        if (selfGameInfo.length < 1) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('不存在当前游戏.', Common.Style.AlertError, null);
            return;
        }

        $scope.GameInfo = selfGameInfo[0];//获取到游戏对象
        $scope.hasServer = false;//是否有区服
        $scope.ServerInfo = null;//获取区服对象

        if (serverId > 0 && !isNaN(serverId)) {
            var selfServerInfo = Common.System.QueryServerById(selfGameInfo[0], serverId);

            if (selfServerInfo.length < 1) {
                $scope.canSubmit = false;
                Common.Layer.ShowAlertNoTitle('当前游戏不存在该区服.', Common.Style.AlertError, null);
                return;
            }
            $scope.ServerInfo = selfServerInfo[0];
            $scope.hasServer = true;

        }

        if (isNaN(payMoney) || payMoney == null || payMoney == undefined || payMoney < 100) {
            $scope.canSubmit = false;
            Common.Layer.ShowAlertNoTitle('充值金额不能小于1', Common.Style.AlertError, null);
            return;
        }
        
        $scope.PayMoney = payMoney;//充值金额
        $scope.OrderNum = $scope.outorderid;//订单编号


        /**
         * 提交充值
         * @param payType
         */
        $scope.submitPay = function (payTypeId) {

            var payTypes = Configs.Pay.PayType;

            var payTypeInfo = $.Enumerable.From(payTypes)
                .Where(function (p) {
                    return p.TypeId == payTypeId;
                }).ToArray();

            if (payTypeInfo.length < 1 || payTypeId == 104) {
                Common.Layer.ShowAlertNoTitle('支付方式错误,请刷新页面重新提交.', Common.Style.AlertError, null);
                return;
            }

            var payUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=251&username=&userid=" +
                accId +
                "&appid=" +
                gameId +
                "&target=" +
                payToType +
                "&paytype=" +
                payTypeId +
                "&money=" +
                $scope.PayMoney +
                "&outorderid=" +
                $scope.OrderNum +
                "&serverid=" +
                serverId +
                "&role=" +
                $scope.role +
                "&ext1=" +
                $scope.ext1 +
                "&ext2=" +
                $scope.ext2;


            if (payTypeId == 103) {
                var html = "<p style='background-color: #d9534f;padding: 3px;margin-right: 5px; border-radius: .25em;color: #fff; font-weight: 600;'>";
                html += "支付方法：截屏或者长按保存图片-微信扫一扫右上角点击从相册选取二维码"
                html += "</p>";

                html += "<p>";
                html += "<img src='" + payUrl + "'/>";
                html += "</p>";
                Common.System.SimpleShowOrderState(html, $scope.OrderNum);
                return;
            }

            window.open(payUrl);
            var html = "<p>";
            html += "<h1 class='ordertip'>订单提交成功。</h1>";
            html += "</p>";
            Common.System.SimpleShowOrderState(html, $scope.OrderNum);

        }


    })


    /**
     * CPS界面
     */
    app.controller('CpsGameCtrl',function($scope, $location){
        var parameterArray = $location.search();
        var gameId = parseInt(parameterArray.gameid);

        gameInfo = $.Enumerable.From(gameInfo)
            .Where(function (p) {
                return p.apptype == Configs.WebSite.AppType;
            }).ToArray();


        console.log(gameInfo);

        console.log( Configs.WebSite.AppType);
        $scope.GameList = gameInfo;

        var selfGameInfo = Common.System.QueryGameInfoById(gameInfo,gameId);


        $scope.EnterGame =function(gameId){
            Common.System.CpsEnterGame(gameId,true);
        }

        if(selfGameInfo.length>0){
            Common.System.CpsEnterGame(gameId,false)
        }else{
            console.debug('没有找到当前游戏，ID：'+gameId);
        }
    })

    /**
     * 自定义验证规则
     */
        //验证密码一致
    app.directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val() === $(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        };
    }])
})();
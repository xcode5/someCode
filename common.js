var Common = {
    //弹窗组件
    Layer: {
        ShowAlert: function (title, content) {
            layer.open({
                title: [title],
                content: content,
                shadeClose: false
            })
        },
        ShowAlertNoTitle: function (content, style, end) {
            layer.open({
                content: content,
                shadeClose: false,
                time: 2,
                style: style,//'background-color:#09C1FF; color:#fff; border:none;',
                end: end
            })
        },
        ShowPageLayer: function (content, style) {
            layer.open({
                type: 1,
                shadeClose: false,
                content: content,
                anim: 0,
                style: style
            });
        },
        ShowConfirm: function (content, action) {
            layer.open({
                title: '提示',
                content: content,
                btn: ['确认', '取消'],
                yes: function (index) {
                    action;
                    layer.close(index);
                },
                no: function (index) {
                    layer.close(index);
                }
            });
        },
        ShowLoading: function () {
            layer.open({type: 2, shadeClose: false});
        },
        CloseAll: function () {
            layer.closeAll()
        }
    },
    Ajax: {
        RequestAjax: function (url, data, dataType, isAsync, success) {
            $.ajax({
                url: url,
                type: "POST",
                timeout: 10 * 60,
                cache: false,
                data: data,
                async: isAsync,
                dataType: dataType,
                beforeSend: function () {
                    Common.Layer.ShowLoading();
                },
                error: function (xr, ts, et) {
                    Common.Layer.CloseAll();
                    Common.Layer.ShowAlertNoTitle('网络繁忙,请稍后再试![Code:' + xr.status + ']', Common.Style.AlertError);
                },
                success: success
            });
        },
        SimpleAjax: function (url, dataType) {
            var data = $.ajax({url: url, async: false, cache: false, dataType: dataType}).responseText;
            return eval('(' + data + ')');
        }
    },
    Style: {
        AlertInfo: "background-color:#5bc0de; color:#fff; border:none;",
        AlertWarning: "background-color:#ec971f; color:#fff; border:none;",
        AlertError: "background-color:#ff0000; color:#fff; border:none;",
        AlertSuccess: "background-color:#5cb85c; color:#fff; border:none;"
    },
    Cookie: {
        GetCookie: function (cookieName) {
            return $.cookie(cookieName)
        }
    },
    System: {
        GetParamVal: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;

        },
        ShowSelectGameLayer: function (data) {
            var html = '';
            html += "<div class='alert alert-danger show_page_title' role='alert'>请选择充值的游戏</div>";
            html += "<div>"
            for (var i = 0; i < data.length; i++) {
                var bgColor = data[i].gameid % 2 == 0 ? "button-primary" : "button-highlight"
                html += "<a style='width: 48%;' onclick='Common.System.SelectGame(this)' data-gameid='" + data[i].gameid + "' class='button " + bgColor + " button-rounded button-tiny gamebtn'>" + data[i].game_name + "</a>";
            }
            html += "</div>"
            Common.Layer.ShowPageLayer(html, 'width:90%;min-height:90%;');
        },
        ShowOrderState: function (content, orderid) {
            var html = '';
            html += "<div class='alert alert-success show_page_title' role='alert'>订单提交成功</div>";
            html += "<div id='order_content' style='text-align: center;'>";
            html += content;
            html += "</div>";
            html += "<p>" +
                "<button onclick=\"Common.System.QueryOrder('" + orderid + "') \"" +
                "class='button button-caution button-rounded button-large f-white dis-b btn-block'>" +
                "订单查询" +
                "</button></p>";
            html += "<p style='margin-top: 15px;'>" +
                "<button onclick=\"Common.Layer.CloseAll() \"" +
                "class='button button-primary button-rounded button-large f-white dis-b btn-block'>" +
                "关闭" +
                "</button></p>"
            Common.Layer.ShowPageLayer(html, 'width:95%;min-height:95%;');

        },
        SimpleQueryOrder: function (orderid) {
            var url = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=252&outorderid=" + orderid + "&callback=?";

            Common.Ajax.RequestAjax(url, null, "jsonp", true, function (data) {

                var orderNum = $('#orderNum').text();
                var gameName = $('#gameName').text();
                var serverName = $('#serverName').text();
                var payAmount = $('#payAmount').text();

                //console.log(orderModel.roleInfo[0].roleid==0);


                var html = '';
                html += "<p><label class='label-primary'>充值订单：</label><label class='label-info'>" + orderNum + "</label></p>";
                html += "<p><label class='label-primary'>充值游戏：</label><label class='label-info'>" + gameName + "</label></p>";
                html += "<p><label class='label-primary'>充值区服：</label><label class='label-info'>" + serverName + "</label></p>";
                html += "<p><label class='label-primary'>充值金额：</label><label class='label-info'>" + payAmount + "</label></p>";

                html += "<p><label class='label-primary'>订单状态：</label><label id='orderStatus' class='label-warning'>正在充值,请稍等....</label></p>";
                $('#order_content').html(html);
                if (data[0].data.state) {
                    $('#orderStatus').removeClass().addClass('label-success').text('充值成功.');
                } else {
                    $('#orderStatus').removeClass().addClass('label-danger').text('充值失败.');
                }

            })
            var loaddingIndex = $('.layermbox:last').attr('index');

            layer.close(loaddingIndex);


        },
        SimpleShowOrderState: function (content, orderid) {
            var html = '';
            html += "<div class='alert alert-success show_page_title' role='alert'>订单提交成功</div>";
            html += "<div id='order_content' style='text-align: center;'>";
            html += content;
            html += "</div>";
            html += "<p>" +
                "<button onclick=\"Common.System.SimpleQueryOrder('" + orderid + "') \"" +
                "class='button button-caution button-rounded button-large f-white dis-b btn-block'>" +
                "订单查询" +
                "</button></p>";
            html += "<p style='margin-top: 15px;'>" +
                "<button onclick=\"Common.Layer.CloseAll() \"" +
                "class='button button-primary button-rounded button-large f-white dis-b btn-block'>" +
                "关闭" +
                "</button></p>"
            Common.Layer.ShowPageLayer(html, 'width:95%;height:95%;');

        },
        QueryOrder: function (orderid) {
            var url = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=252&outorderid=" + orderid + "&callback=?";
            var appElement = document.querySelector('[ng-controller=Pay]');
            var $scope = angular.element(appElement).scope();

            $scope.$apply();
            var orderModel = $scope.payParameter;
            Common.Ajax.RequestAjax(url, null, "jsonp", true, function (data) {

                var userName = $('#uName').val();
                var gameName = $('#gameId').val();
                var serverName = $('#serverId').val();
                userName = userName == null || userName == '' ? '无' : userName;
                gameName = gameName == null || gameName == '' ? '无' : gameName;
                serverName = serverName == null || serverName == '' ? '无' : serverName;

                //console.log(orderModel.roleInfo[0].roleid==0);

                var roleName = '无'
                if (orderModel.roleInfo[0].roleid != 0) {
                    roleName = orderModel.roleInfo[0].rolename;
                }

                var html = "<p><label class='label-primary'>充值账号：</label><label class='label-info'>" + userName + "</label></p>";
                html += "<p><label class='label-primary'>充值游戏：</label><label class='label-info'>" + gameName + "</label></p>";
                html += "<p><label class='label-primary'>充值区服：</label><label class='label-info'>" + serverName + "</label></p>";
                html += "<p><label class='label-primary'>充值金额：</label><label class='label-info'>" + $scope.trueMoney + "</label></p>";
                html += "<p><label class='label-primary'>充值角色：</label><label class='label-info'>" + roleName + "</label></p>";
                html += "<p><label class='label-primary'>充值订单：</label><label class='label-info'>" + orderid + "</label></p>";
                html += "<p><label class='label-primary'>订单状态：</label><label id='orderStatus' class='label-warning'>正在充值,请稍等....</label></p>";
                $('#order_content').html(html);
                if (data[0].data.state) {
                    $('#orderStatus').removeClass().addClass('label-success').text('充值成功.');
                } else {
                    $('#orderStatus').removeClass().addClass('label-danger').text('充值失败.');
                }

                $scope.$apply();


            })
            var loaddingIndex = $('.layermbox:last').attr('index');

            layer.close(loaddingIndex);
        },
        ShowSelectServerLayer: function (gameId) {

            if (gameId == '' || gameId == null || gameId == undefined) {

                Common.System.ShowSelectGameLayer(gameInfo)
                return;
            }

            var selfGameInfo = $.Enumerable.From(gameInfo)
                .Where(function (p) {
                    return p.gameid == gameId;
                }).ToArray();

            var serverInfo = selfGameInfo[0].serverlist;

            var html = '';
            html += "<div class='alert alert-success show_page_title' role='alert'>请选择充值的区服</div>";
            html += "<div>"
            for (var i = 0; i < serverInfo.length; i++) {
                var bgColor = serverInfo[i].serverid_our % 2 == 0 ? "button-primary" : "button-highlight"
                html += "<a style='width: 48%;' onclick='Common.System.SelectServer(this)' data-serverid='" + serverInfo[i].serverid_our + "' class='button " + bgColor + " button-rounded button-tiny gamebtn'>" + serverInfo[i].servername + "</a>";
            }
            html += "</div>"
            Common.Layer.ShowPageLayer(html, 'width:90%;height:90%;');
        },
        QueryGameInfoById: function (gameInfo, gameId) {
            return $.Enumerable.From(gameInfo)
                .Where(function (p) {
                    return p.gameid == gameId;
                }).ToArray();
        },
        QueryServerById: function (gameInfo, serverId) {
            return $.Enumerable.From(gameInfo.serverlist)
                .Where(function (p) {
                    return p.serverid_our == serverId;
                }).ToArray();
        },
        SelectGame: function (ele) {

            // var oldGameId = $('input#gameId').data('gameid');//获取原始的游戏ID，由此判断是否需要弹出选择区服层
            var newGameId = $(ele).data('gameid');


            $('input#gameId').val($(ele).text());
            $('input#gameId').data('gameid', newGameId);


            Common.Layer.CloseAll();

            // console.log(oldGameId+'-------'+newGameId);

            //if(oldGameId!=newGameId){


            var gameById = Common.System.QueryGameInfoById(gameInfo, newGameId);

            var appElement = document.querySelector('[ng-controller=Pay]');
            var $scope = angular.element(appElement).scope();
            if (gameById[0].servertype != 2) {
                $scope.isPayToGameServer = true;
                $scope.$apply();
                $('#selServer').show(0);
                Common.System.ShowSelectServerLayer(newGameId);

            } else {
                $scope.isPayToGameServer = false;
                $scope.getRoleInfo();
                $('#selServer').hide(0);
                $scope.$apply();
            }

            //console.log($scope.isPayToGameServer);

            // }
        },
        SelectServer: function (ele) {
            $('input#serverId').val($(ele).text());
            $('input#serverId').data('serverid', $(ele).data('serverid'));
            Common.Layer.CloseAll();

            //这里操作需要调用Angular Controller内部的方法跟字段
            var appElement = document.querySelector('[ng-controller=Pay]');
            var $scope = angular.element(appElement).scope();

            //获取到scope之后需要去查询角色接口，来返回数据，并且双向数据绑定。

            $scope.getRoleInfo();
            $scope.$apply();


            //查询角色数据

            //验证是否有数据

            //没数据直接让玩家创建角色

            //有数据将数据同步到PayController


        },
        GetCardMoneyByCardId: function (cardId) {
            return $.Enumerable.From(Configs.Pay.CardMoney)
                .Where(function (p) {
                    return p.type_id == parseInt(cardId);
                }).ToArray();
        },
        Sleep: function (num) {
            var tempDate = new Date();

            while ((new Date() - tempDate) < num) {
                try {
                    $.ajax({
                        url: "about:blank",
                        type: "POST",
                        timeout: 10 * 60,
                        cache: false,
                        data: data,
                        async: false,
                        dataType: "json",

                    });
                }
                catch (e) {
                    ;
                }
            }
            return;
        },
        EnterGame: function (gameId) {
            var gameObj = Common.System.QueryGameInfoById(gameInfo, gameId);
            if (gameObj.length > 0) {
                gameObj = gameObj[0];
                if ($.cookie(Configs.WebSite.CookieName)) {
                    var fullEnterGameUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=1201&from=h5&gameid=" + gameObj.gameid;
                    window.open(fullEnterGameUrl);
                } else {
                    Common.Layer.ShowAlertNoTitle("请先登录账号,再进入游戏.", null, null);
                }
            }
            else {
                Common.Layer.ShowAlertNoTitle("没有找到当前游戏", "", null);
            }

        },
        CpsEnterGame: function (gameId, isNewTab) {
            var gameObj = Common.System.QueryGameInfoById(gameInfo, gameId);
            if (gameObj.length > 0) {
                gameObj = gameObj[0];
                if ($.cookie(Configs.WebSite.CookieName)) {
                    var fullEnterGameUrl = Configs.WebSite.ApiUrl + "/index.php?r=dispatchWeb/index&cmd=1201&from=h5&gameid=" + gameObj.gameid;
                    if (isNewTab) {
                        window.open(fullEnterGameUrl);
                    } else {
                        window.location.href = fullEnterGameUrl;
                    }
                } else {
                    $("#cps_login_box").modal({keyboard: false, backdrop: "static"});
                    Common.Layer.ShowAlertNoTitle("请先登录账号,再进入游戏.", null, null);
                }
            }
            else {
                Common.Layer.ShowAlertNoTitle("没有找到当前游戏", "", null);
            }
        }
    },
    Tools: {
        ArrayToJson: function (arr) {
            var json = {};
            for (var i = 0; i < arr.length; i++) {
                json[i] = arr[i];
            }
            return json;
        },
        IsToday: function (str) {
            return (new Date().toDateString() === new Date(str).toDateString());
        },
        GetNowFormatDateTime: function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hours = date.getHours()
            var min = date.getMinutes();
            var sec = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            var currentDate = date.getFullYear()
                + seperator1
                + month
                + seperator1
                + strDate
                + " "
                + hours
                + seperator2
                + min
                + seperator2
                + sec;
            return currentDate;
        },
        GetOrderNum: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var ss = date.getMilliseconds();
            if (month < 10) {
                month = "0" + month;
            }
            var day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var hour = date.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            var min = date.getMinutes();
            if (min < 10) {
                min = "0" + min;
            }
            var sec = date.getSeconds();
            if (sec < 10) {
                sec = "0" + sec;
            }
            return "" + year + month + day + hour + min + sec + ss;
        }
    }
}



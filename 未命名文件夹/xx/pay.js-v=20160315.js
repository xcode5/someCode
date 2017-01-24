var userInfo = [];
//接口地址
//var serverUrl = "http://i.local.sifuba.net/";//test



var payToType = window.location.href.toLowerCase().indexOf("http://www.cgamex.com/static/scripts/webgame_pay.html") > 0 || window.location.href.toLowerCase().indexOf("http://www.cgamex.com/static/scripts/cps_pay.html") > 0 ? 1 : 0;

var gameInfo = Enumerable.From(gameListObj)
    .Where(function (x) {
        return x.can_pay == true
    })
    .ToArray();


cardTypeObj = Enumerable.From(payCfgObj)
    .Where(function (y) {
        return y.is_show;
    })
    .OrderBy(function (x) {
        return x.type_id;
    }).ToArray();

normalTypeObj = Enumerable.From(payCfgObj)
    .Where(function (y) {
        return !y.is_show;
    }).ToArray();


var GetPayCfgMoneyByType = function (typeId) {
    var typeObj = Enumerable.From(payCfgObj)
        .Where(function (x) {
            return x.type_id == typeId;
        }).ToArray();
    return typeObj;
}

cmTypeObj = GetPayCfgMoneyByType(0);
ucTypeObj = GetPayCfgMoneyByType(1);
ctTypeObj = GetPayCfgMoneyByType(2);

var queryOrderTimer;


$(function () {

    //渲染卡类类型模板
    var cardTypeHtml = $("#pay_card_type_temp").render(cardTypeObj);
    $("#sel-card-type div.cardtypecheck").html(cardTypeHtml);

    //电信卡充值金额模板
    var ctCardPayMoneyHtml = $("#ct_pay_money_temp").render(ctTypeObj[0].items);
    $("#ct_pay_money").html(ctCardPayMoneyHtml);

    //移动卡充值金额模板
    var cmCardPayMoneyHtml = $("#cm_pay_money_temp").render(cmTypeObj[0].items);
    $("#cm_pay_money").html(cmCardPayMoneyHtml);

    //联通卡充值金额模板
    var ucCardPayMoneyHtml = $("#uc_pay_money_temp").render(ucTypeObj[0].items);
    $("#uc_pay_money").html(ucCardPayMoneyHtml);


    //渲染正常充值的充值金额模板
    var normalTypehTML = $("#normal_pay_money_temp").render(normalTypeObj[0].items);
    $("#normal_pay_money").html(normalTypehTML);


    //当玩家选择了卡类充值之后处理
    $("input[name='pay_type']").on("ifClicked", function (event) {
        var target = $(this).val();
        if (target == "104") {
            //这里是卡类支付
            $("#sel-card-type,#input-card-info").show(0);
            $(".pay_money_list").hide(0);
            $("#cm_pay_money").show(0);
            $('#cm_pay_money_100').iCheck('check');


        } else {
            $("#sel-card-type,#input-card-info").hide(0);
            $(".pay_money_list").hide(0);
            $("#normal_pay_money").show(0);
            $('#pay_money_100').iCheck('check');
        }
    });

    //当玩家选择充值到哪里的时候UI随着隐藏不必要的一些控件，并且在最后提交的时候也补需要验证
    $("input[name='payto']").on("ifClicked", function (event) {
        var target = $(this).val();
        if (target == "1") {
            //这里是为游戏支付
            $("#sel-game-server").show(0);
        }
        if (target == "2" || target == "3") {
            $("#sel-game-server").hide(0);
        }
    });

    $("input[name='pay_card_type']").on("ifClicked", function (event) {
        var target = $(this).val();
        switch (target) {
            case "0":
                $('#cm_pay_money_100').iCheck('check');
                $(".pay_money_list").hide(0);
                $("#cm_pay_money").show(0);
                break;
            case "1":
                $('#uc_pay_money_100').iCheck('check');
                $(".pay_money_list").hide(0);
                $("#uc_pay_money").show(0);
                break;
            case "2":
                $('#ct_pay_money_100').iCheck('check');
                $(".pay_money_list").hide(0);
                $("#ct_pay_money").show(0);
                break;
            default:
                $("#normal_pay_money").show(0);
                $('#pay_money_100').iCheck('check');
        }
    })


    $('input[type="radio"]').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });

    $('#payuname').focus();

    //充值icheck的样式
    $('input[type="radio"]').iCheck('uncheck');
    $('#pay_money_100').iCheck('check');
    $('#pay_to_game').iCheck('check');
    $("#pay_zfb").iCheck('check');
    //$("#sel-game-server").hide(0);//默认隐藏
    //默认选择移动的卡
    $("#card_0").iCheck('check');

    //校验用户
    $("#payuname").blur(function () {
        var payName = $.trim($(this).val());
        if (payName == "" || payName == null || payName == undefined) {
            $("#payuname").focus();
            Tips("请输入要充值的账号");
        } else {
            FindUserInfo(payName, function () {
                $("#serverTips").removeClass("label-danger").addClass("label-success").text("正在验证账号,请稍后....");
            }, function (data) {
                userInfo = data[0];
                if (userInfo.code == 1) {
                    $("#uid").val(userInfo.data.userid);
                    $("#serverTips").removeClass("label-danger").addClass("label-success").text("账号存在，请继续填写下一步信息");
                    var gameId = $.trim($("#sel-game").data("gameid"));
                    var serverId = $.trim($("#sel-sid").data("sid"));
                    if (!$("#sel-game-server").is(":hidden")) {
                        if (gameId != "" && gameId != undefined && serverId != "" && serverId != undefined) {
                            if ($("#role_list").is(":hidden")) {
                                GetRoles(payName, gameId, serverId)
                            }
                        }
                    }
                } else {
                    Tips(userInfo.message);
                }

            })
        }

    }).focus(function () {
        userInfo = [];
        $("#uid").val('');
    });

    //在登录状态下向服务端请求账号信息
    if ($.trim($('#payuname').val()) != null && $.trim($('#payuname').val()) != "") {
        FindUserInfo($.trim($('#payuname').val()), null, function (data) {
            userInfo = data[0];
            if (userInfo.code == 1) {
                $("#uid").val(userInfo.data.userid);
            }
        });
    }

    $("#btn-sel-order").click(function () {
        $(".pay_request-modal").modal("hide");
        $("#s_uname").text($("#payuname").val());
        $("#s_game").text($("#sel-game").val());
        $("#s_server").text($("#sel-sid").val());
        $("#s_rolename").text($("#role_list select").find("option:selected").text());
        $("#s_orderid").text($("#outorder").val());
        var payMoney = parseInt($.trim($('input[name="pay_money"]:checked').val()));
        var customMoney = parseInt($("#other_money").val());

        $("#s_status").text("正在努力为您请求,请稍后....").removeClass("label-danger").removeClass("label-success");

        var payType = $.trim($('input[name="pay_type"]:checked').val());
        var money = payMoney;
//        console.debug(payMoney);
//        console.debug(customMoney);

        if (!isNaN(customMoney) && customMoney > 0) {
            money = customMoney;
        }
        $("#s_money").text(money);


        $(".select_order_modal").modal({keyboard: false});

        var timesRun = -2;

        var timer = 1 * 1000;

        if (payType == 104) {
            timesRun = 0;
            timer = 10 * 1000;
        }

        console.debug(timesRun);


        queryOrderTimer = setInterval(function () {
            timesRun += 1;
            if (timesRun === 4) {
                clearInterval(queryOrderTimer);
            }
            GetOrderStatus($('#outorder').val(), timesRun)
        }, timer);
//
    });


    $("form")[0].reset();

    if (payToType > 0) {
        //产生页游的游戏列表
        BuildWebGameList();
    } else {
        BuildGameList();
    }


    $("#other_money").blur(function () {
        var customMoney = parseInt($("#other_money").val());
        var re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(customMoney) || customMoney < 1) {
            $('input[name="pay_money"]').iCheck('uncheck');
            $('#pay_money_100').iCheck('check');
        } else {
            //
            $('input[name="pay_money"]').iCheck('uncheck');
        }
    });


    //选择区服调用bootstrap modal框
    $("#sel-game").focus(function () {
        $(".sel-game-modal").modal({keyboard: false});
    });


    //当选游戏modal关闭之后操作
    $('.sel-game-modal').on("hide.bs.modal", function (e) {
        var sname = $.trim($("#sel-game").val());
        var gameid = $.trim($("#sel-game").data("gameid"));
        if (sname != undefined && sname != "" && gameid != undefined && gameid != "") {
            if (payToType > 0) {
                BuildWebGameServerList(gameid);
            } else {
                BuildServerList(gameid);
            }
            $(".sel-sid-modal").modal({keyboard: false});
        }
    })


    if ($.cookie(cookie_name) != null && $.cookie(cookie_name) != "" && $.cookie(cookie_name) != undefined && $.cookie(cookie_name) != "null") {
        $("#payuname").val($.cookie(cookie_name));
        $("#repayuname").val($.cookie(cookie_name));

    }

})


/*
 var  SetCardTypeTpl = function(){
 //渲染卡类模板
 var cardTypeHtml = $("#pay_card_type").render(cardTypeObj);
 $("#sel-card-type div.cardtypecheck").html(cardTypeHtml);
 }
 */


//选择游戏之后
var CheckGame = function (ele) {
    $("#sel-game").val($.trim($(ele).text())).data("gameid", $.trim($(ele).data("gameid")));
    $('.sel-game-modal').modal('hide');
}

//选择区服之后
var CheckServer = function (ele) {
    $("#sel-sid").val($.trim($(ele).text())).data("sid", $.trim($(ele).data("sid")));
    var payUser = $.trim($("#payuname").val());
    var gameId = $.trim($("#sel-game").data("gameid"));
    var serverId = $.trim($("#sel-sid").data("sid"));
    $('.sel-sid-modal').modal('hide');
    GetRoles(payUser, gameId, serverId);
}

//生成手游游戏列表
var BuildGameList = function () {
    var html = $("#game_list_temp").render(gameInfo);

    $("#game_list ul").html(html);
    //})
}

//生成页游游戏列表
var BuildWebGameList = function () {
    var html = $("#game_list_temp").render(gameInfo);

    $("#game_list ul").html(html);
}

//生成手游区服列表
var BuildServerList = function (gameid) {
    var html = '';
    var serverInfo = Enumerable.From(gameInfo)
        .Where(function (x) {
            return x.gameid == gameid
        })
        .ToArray();
    var html = $("#server_list_temp").render(serverInfo[0].serverlist);

    $("#server_list ul").html(html);
};

//生成页游区服列表
var BuildWebGameServerList = function (gameid) {
    var html = '';
    var serverInfo = Enumerable.From(gameInfo)
        .Where(function (x) {
            return x.game_id == gameid
        })
        .ToArray();
    var html = $("#server_list_temp").render(serverInfo[0].serverlist);

    $("#server_list ul").html(html);
};

//执行充值操作
var PayAction = function () {


    var payName = $.trim($("#payuname").val());
    var rePayName = $.trim($("#repayuname").val());
    var gameId = $.trim($("#sel-game").data("gameid"));
    var gameName = $.trim($("#sel-game").val());
    var serverId = $.trim($("#sel-sid").data("sid"));
    var serverName = $.trim($("#sel-sid").val());
    var roleId = $.trim($("#role_list select").val());
    var payType = $.trim($('input[name="pay_type"]:checked').val());
    var payMoney = parseInt($.trim($('input[name="pay_money"]:checked').val()));
    var customMoney = parseInt($("#other_money").val());
    var uid = $.trim($("#uid").val());
    var target = parseInt($.trim($('input[name="payto"]:checked').val()));
    var cardType = parseInt($.trim($('input[name="pay_card_type"]:checked').val()));

    //console.debug("支付类型" + payType);
    //console.debug("充值到" + target);
    //console.debug("支付金额" + payMoney);
    //console.debug("卡类型" + cardType);

    //return;

    if (payName == "" || payName == null || payName == undefined) {
        $("#payuname").focus();
        Tips("请输入要充值的账号");
        return;
    }
    if (rePayName == "") {
        Tips("请再次输入要充值的账号");
        $("#repayuname").focus();
        return;
    }
    if (payName != rePayName) {
        Tips("两次输入账号不一致");
        $("#repayuname").focus();
        return;
    }

    if (uid == "" || uid == undefined || uid < 10000) {
        //console.debug(findUidResult);
        Tips("获取账号数据失败，请重新输入账号");
        $("#payuname").focus();
        return;
    }
    if (!$("#sel-game-server").is(":hidden")) {
        if (gameId == "" || gameId == undefined) {
            Tips("请选择您要充值的游戏");
            $("#sel-game").focus();
            return;
        }
        if (serverId == "" || serverId == undefined) {
            Tips("请选择您要充值的游戏，并且选择对应区服");
            $("#sel-game").focus();
            return;
        }
        if (isNaN(roleId) || roleId == null || roleId == "" || roleId == undefined || roleId < 1) {
            Tips("请选择您要充值的角色");
            return;
        }
    }


    if (payType == "" || payType == undefined) {
        Tips("请选择您的支付方式");
        $("#pay_zfb").attr("checked");
        return;
    }
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (payMoney && ((!re.test(payMoney) || payMoney < 10)) || (customMoney && (!re.test(customMoney) || customMoney < 1))) {
        Tips("请选择或者输入合法的充值金额");
        $('#pay_money_100').iCheck('check');
        return;
    }

    var money = payMoney;

    if (customMoney) {
        money = customMoney;
    }


    var cardParame = "";//卡类参数

    if (payType == 104)//如果选中了卡类充值
    {
        var cardNumber = $.trim($("#card_acc").val());
        var cardPass = $.trim($("#card_pass").val());

        var cardConfigObj = GetPayCfgMoneyByType(cardType)[0];

        if (cardNumber.length < cardConfigObj.card_acc_len) {
            Tips(cardConfigObj.name + "的卡号至少为:<a style='color: #fff;'>" + cardConfigObj.card_acc_len + "</a>位");
            return;
        }
        if (cardPass.length < cardConfigObj.card_pass_len) {
            Tips(cardConfigObj.name + "的密码至少为:<a style='color: #fff;'>" + cardConfigObj.card_pass_len + "</a>位");
            return;
        }

        money = payMoney;//不用管自定义输入的值
        cardParame += "&cardtype=" + cardType + "&cardnumber=" + cardNumber + "&cardpassword=" + cardPass;
    }

    if (target == 1 && money < 6) {
        Tips("游戏充值金额不能低于6元");
        return;
    }

    money = money * 100;

    var outorderid = GetDateTime() + $("#uid").val();
    $("#outorder").val(outorderid);
    $("#serverTips").removeClass("label-danger").addClass("label-success").text("正在充值..");
    var payUrl = serverUrl + "/index.php?r=dispatchWeb/index&cmd=251&username=" +
        payName +
        "&appid=" +
        gameId +
        "&target=" +
        target +
        "&paytype=" +
        payType +
        "&money=" +
        money +
        "&outorderid=" +
        outorderid +
        "&serverid=" +
        serverId +
        "&role=" +
        roleId +
        cardParame;
    //console.debug(payUrl);

    //return;

    //如果微信支付，直接弹窗里显示扫描二维码
    $("#pay_request_erweima img").attr("src", webServerUrl + '/static/images/loading.gif');
    if (payType == 103) {
        $("div .modal-dialog").css("top", '10%');
        $("#pay_request_success").css("display", "none");
        $("#pay_request_erweima").css("display", "block");
        $(".pay_request-modal").modal({keyboard: false, backdrop: "static"});
        $("#pay_request_erweima img").attr("src", payUrl);
        return;
    }
    //如果是卡类支付，不需要跳转
    if (payType == 104) {
        AjaxRequest(payUrl + "&callback=?", null,
            function (data) {
                var data = data[0];
                if (data.code == 1) {
                    $("div .modal-dialog").css("top", '25%');
                    $("#pay_request_erweima").css("display", "none");
                    $("#pay_request_success").css("display", "block");
                    $(".pay_request-modal").modal({keyboard: false, backdrop: "static"});
                } else {
                    Tips(data.message);
                }
            });//直接发AJAX请求即可

        return;
    }

    //其它方式显示设置
    $("div .modal-dialog").css("top", '25%');
    $("#pay_request_erweima").css("display", "none");
    $("#pay_request_success").css("display", "block");
    $(".pay_request-modal").modal({keyboard: false, backdrop: "static"});
    window.open(payUrl);
}


var AjaxRequest = function (url, beforeSend, success) {
    $.ajax({
        url: url,
        type: "get",
        timeout: 20000,
        async: true,
        cache: false,
        data: [],
        dataType: "json",
        beforeSend: beforeSend,
        success: success
    });
}

var FindUserInfo = function (payName, berofeSend, success) {
    var findUidUrl = serverUrl + "/index.php?r=dispatchWeb/index&cmd=151&username=" + payName + "&callback=?"
    AjaxRequest(findUidUrl, berofeSend, success);
}

var GetOrderStatus = function (payOrder, time) {
    var url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=252&outorderid=" + payOrder + "&callback=?";
    AjaxRequest(url, function () {
        $("#s_status").text("正在努力为您请求,请稍后....")
    }, function (data) {
        if (data[0].data.state) {
            clearInterval(queryOrderTimer);
            $("#s_status").text("充值成功").removeClass("label-danger").addClass("label-success");
        } else {
            if (time > -1 && time < 4) {
                time = time + 1;
                //$("#s_status").text("正在进行第" + time + "次尝试。");
                $("#s_status").text("正在充值,请稍后....")
            } else {
                clearInterval(queryOrderTimer);
                $("#s_status").text("充值失败").removeClass("label-success").addClass("label-danger");
            }
        }
    })
}

var GetRoles = function (payUser, gameId, serverId) {
    var url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=1101&username=" +
        payUser +
        "&gameid=" +
        gameId +
        "&serverid=" +
        serverId +
        "&callback=?";
    if (payUser == null || payUser == "" || payUser == undefined) {
        Tips("请输入要充值的账号");
        $("#payuname").focus();
        return;
    }
    $.getJSON(url, function (backdata) {
        //console.info(backdata);
        var result = backdata[0];
        if (result.code != 1) {
            // console.debug(result.code);
            $("#serverTips").show(0).text(result.message);
            var arr = [{
                "roleid": -1,
                "rolename": "请选择角色"
            }];
            var html = $("#role_list_temp").render(arr);
            $("#role_list select").html(html);
        } else {
            if (result.data.length < 1) {
                Tips("角色不存在，请先创建");
                var arr = [{
                    "roleid": -1,
                    "rolename": "请选择角色"
                }];
                var html = $("#role_list_temp").render(arr);
                $("#role_list select").html(html);
            } else {
                $("#role_list").show(0);
                var arr = [{
                    "roleid": -1,
                    "rolename": "请选择角色"
                }];
                $.each(result.data, function (i, v) {
                    arr.push(v);
                })
                var html = $("#role_list_temp").render(arr);
                $("#role_list select").html(html);
            }
        }
    })
}

var Tips = function (msg) {
    $("#serverTips").removeClass("label-success").addClass("label-danger").html(msg);
};




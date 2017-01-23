var GetDateTime = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
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
    return "" + year + month + day + hour + min + sec;
};

var OpenDialog = function (ele) {
    var obj = $("#" + ele);
    obj.dialog({
        modal: true,
        resizable: false
    });
};

var get_query_parame = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

var reg_msg_show = function (msg) {
    $(".reg_msg").removeClass("label-success").addClass("label-danger");
    $(".reg_msg").html(msg).css({'display': "block"});
}

var reg_msg_hide = function () {
    $(".reg_msg").html().css({'display': "none"});
}

var login_msg_show = function (msg) {
    $(".login_msg").removeClass("label-success").addClass("label-danger");
    $(".login_msg").html(msg).css({'display': "block"});
}

var login_msg_hide = function () {
    $(".login_msg").html().css({'display': "none"});
}

var set_login_cookie = function (user_name) {
    $.cookie(cookie_name, user_name);
}

var remove_login_cookie = function () {
    $.cookie(cookie_name, null);  //删除cookie
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    $("a.login_btn").click(function () {
        //$(".login_modal").modal({keyboard: false});
    });
    $("a.reg_btn").click(function () {
        //$(".reg_modal").modal({keyboard: false});
    });

    $(".submit_reg_btn a").click(function () {
        //register();
    })

    $(".submit_login_btn a").click(function () {
        //login();
    })

    $(".logout_btn").click(function () {
        /*$url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=155&callback=?"
        $.getJSON($url, function (data) {
                console.debug(data);
                if (data[0].code != 1) {
                    reg_msg_show(data[0].message);
                } else {
                    window.location.reload();
                }
            }
        )*/


    })


    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=156&callback=?"
    /*$.getJSON($url, function (data) {
            //console.debug(data);
            $('div.user_info p em.user_coin').text("正在查询...");
            if (data[0].code != 1) {
                $('div.user_info p em.user_coin').text(data[0].message)
            } else {
                $('div.user_info p em.user_coin').text(data[0].data.coin)
            }
        }
    )*/

    if (window.location.href.indexOf('r7game.com/detail.html') > -1) {
    	var gameid = get_query_parame('gameid');
    	if(gameid == null){
    		reg_msg_show("暂无游戏");
    		return false;
    	}
    	
        $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=1105&gameid=" + gameid + "&callback=?";
        $.getJSON($url, function (data) {

            if (data[0].code != 1) {
                reg_msg_show(data[0].message);
            } else {
                var data = data[0].data;
                console.log(data)
                $('#classname').text(data.classname);
                $('#introduce').html(data.introduce==""?"暂时没有福利介绍":data.introduce);
                $('#summary').text(data.summary==""?"暂时没有游戏介绍":data.summary);
                $('#giftintroduce').text(data.giftintroduce==""?"暂时没有游戏礼包内容":data.giftintroduce);
                $("#game_icon").attr('src', data.icon);
                $("#size").text(data.size);
                $("#game_name").text(data.gamename);
                $("#download_count").text(data.download);
                var img_list = "";
                for (var i = 0; i < data.imagelist.length; i++) {
                    img_list += "<li><img src='" + data.imagelist[i] + "'/></li>";
                }
                $("#img_list").append(img_list);
                jQuery(".focusBox").slide({
                    mainCell: ".pic",
                    effect: "fold",
                    autoPlay: true,
                    delayTime: 600,
                    trigger: "click",
                    startFun: function (i, c) {
                        $(" .all").html(c);
                        $(" .index").html(i + 1);
                    }
                });
                $("#game_icon").attr('src', data.icon);
                var download_url = ""
                if (data.urlapk != "" && data.urlapk != null) {
                    download_url += "<a href=\"" + data.urlapk + "\" class=\"button button-caution button-pill ml5\">Android下载</a>";
                }
                if (data.urlios != "" && data.urlios != null) {
                    download_url += " <a href=\"" + data.urlios + "\" class=\"button button-primary button-pill ml5\">AppStore下载</a>"
                }
                if (data.urlios2 != "" && data.urlios2 != null) {
                    download_url += "<a href=\"" + data.urlios2 + "\" class=\"button button-action button-pill ml5\">iOS越狱下载</a>"
                }
                $("#download_url").append(download_url);
            }
        });
    }


    //$('div.user_info p em.user_name').text($.cookie(cookie_name))


    $('a.weichart_qrcode_swich').hover(function () {
        $('a.weichart_qrcode').css("display", "block");
    }, function () {
        $('a.weichart_qrcode').css("display", "none");
    })

});

document.onkeydown = function (event_e) {
    if (window.event)
        event_e = window.event;
    var int_keycode = event_e.charCode || event_e.keyCode;
    if (int_keycode == 13) {
        if ($(".reg_modal").is(":visible")) {//注册框显示的时候
            register();
        } else if ($(".login_modal").is(":visible")) {//登录框显示的时候
            login();
        }
    }
}


var get_spread_url = function () {
    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=1102&callback=?"
    $.getJSON($url, function (data) {
            if (data[0].code != 1) {
                $(".spread_url").val(data[0].message);
            } else {
                $(".spread_url").val(data[0].data.url);
                $("#inputCopyBtn").show(0);
            }
        }
    )
}

var get_consume_log = function () {
    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=157&callback=?"
    $.getJSON($url, function (data) {
            var $html = "";
            if (data[0].code != 1) {
                $html = "<tr class=\"danger\"> <td colspan='3'>" + data[0].message + "</td></tr>"
            } else {
                var $log_data = data[0].data
                $.each($log_data, function (i, v) {
                    if (v.coin < 0) {
                        $html += "<tr class=\"danger\">"
                    } else {
                        $html += "<tr class=\"success\">"
                    }
                    $html += "<td>" + v.date + "</td>";
                    $html += "<td>" + v.coin + "</td>";
                    $html += "<td>" + v.detail + "</td>";
                    $html += "</tr>";
                });

            }
            $('.consume_log tbody').html("").append($html);
        }
    )
}


var register = function () {
    var user_name = $("#reg_username").val();
    var pass = $("#reg_pass").val();
    var re_pass = $("#reg_re_pass").val();

    if (user_name.length < 6 || user_name.length > 20) {
        reg_msg_show("账号不合法，长度为6-20位");
        return;
    }
    if (pass.length < 6 || pass.length > 20) {
        reg_msg_show("密码不合法，长度为6-20位");
        return;
    }
    if (pass != re_pass) {
        reg_msg_show("两次密码输入不一致");
        return;
    }
    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=152&username=" + user_name + "&password=" + pass + "&callback=?"
    $.getJSON($url, function (data) {
            if (data[0].code != 1) {
                reg_msg_show(data[0].message);
            } else {
                reg_msg_show("注册成功")
                $(".reg_msg").removeClass("label-danger").addClass("label-success");
                //set_login_cookie(user_name);
                //setInterval("window.location.reload()", 1000);
                if (window.location.href.toLowerCase().indexOf("web_game") > 0 || window.location.href.toLowerCase().indexOf("cps") > 0) {
                    window.location.reload();
                } else {
                    window.location.href = "http://www.cgamex.com/static/scripts/user.html";
                }
            }
        }
    )
}

var login = function () {
    var user_name = $("#login_username").val();
    var pass = $("#login_pass").val();
    if (user_name.length < 6 || user_name.length > 20) {
        login_msg_show("账号不合法，长度为6-20位");
        return;
    }
    if (pass.length < 6 || pass.length > 20) {
        login_msg_show("密码不合法，长度为6-20位");
        return;
    }
    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=153&username=" + user_name + "&password=" + pass + "&callback=?"
    $.getJSON($url, function (data) {
            if (data[0].code != 1) {
                login_msg_show(data[0].message);
            } else {
                login_msg_show("登录成功")
                $(".login_msg").removeClass("label-danger").addClass("label-success");
                //set_login_cookie(user_name);
                //setInterval("window.location.reload()", 1000);
                if (window.location.href.toLowerCase().indexOf("web_game") > 0 || window.location.href.toLowerCase().indexOf("cps") > 0) {
                    window.location.reload();
                } else {
                    window.location.href = "http://www.cgamex.com/static/scripts/user.html";
                }
            }
        }
    )
}


var get_web_game_list = function () {
    var gameInfoObj = Enumerable.From(gameListObj).ToArray();
    // .OrderBy(function(x){x.})

    //console.debug(gameInfoObj);
    return gameInfoObj;
}

//进入游戏，如果没有登录弹出登录框
var enter_game = function (gameid, serverid) {
    var _gameInfo = get_web_game_list(gameid)[0];

    if (_gameInfo) {
        if ($.cookie(cookie_name)) {
            var fullEnterGameUrl = serverUrl + "/index.php?r=dispatchWeb/index&cmd=1201&gameid=" + _gameInfo.game_id + "&serverid=" + serverid;
            window.open(fullEnterGameUrl);
        } else {
            $(".login_modal").modal({keyboard: false});
        }
    }
};

var get_gamewebinfo_byid = function (gameid) {
    var gameInfoObj = get_web_game_list();
    gameInfoObj = Enumerable.From(gameInfoObj)
        .Where(function (x) {
            return x.game_id == gameid;
        })
        .ToArray();
    return gameInfoObj;
}


/**
 * 下载
 * @param 游戏ID
 */
var down_fun = function (gameId) {
    var selfGameInfo = Enumerable.From(gameListObj)
        .Where(function (x) {
            return x.gameid == gameId;
        })
        .ToArray()[0];
    if (selfGameInfo == null || selfGameInfo == undefined || selfGameInfo == "") {
        console.log("没有找到GAMEID=" + gameId + "的游戏");
    } else {
        if (selfGameInfo.url_ios1 == "" && selfGameInfo.url_ios2 == "") {
            window.open(selfGameInfo.url_apk);
        } else {
            $(".down-package-modal .modal-title").text(selfGameInfo.game_name + "-下载");
            var downBtnHtml = "<li><a href=\"" + selfGameInfo.url_apk + "\" target='_blank' class=\"button button-rounded button-primary \">Android下载</a></li>";
            if (selfGameInfo.url_ios1 != "") {
                downBtnHtml += "<li><a href=\"" + selfGameInfo.url_ios1 + "\" target='_blank' class=\"button button-rounded button-highlight\">AppStore下载</a></li>"
            }
            if (selfGameInfo.url_ios2 != "") {
                downBtnHtml += "<li><a href=\"" + selfGameInfo.url_ios2 + "\" target='_blank' class=\"button button-rounded button-caution\">iOS越狱下载</a></li>"
            }
            //div.dpm{top:30%;}
            $("#down_package_url_list ul").html(downBtnHtml);

            var windowHeight = $(window).height();
            var modalHeight = $("div.dpm").height();

            $("div.dpm").css({"top": windowHeight / 4});

            $(".down-package-modal").modal();
        }
    }
}

var select_game_by_type = function (type) {
    //仅适用于all.html界面的筛选

    type = parseInt(type);

    var count = 0;
    $('ul.game-list-ul-list li').show(0);
    $('ul.game-list-ul-list li').each(function (i, e) {
        if (type !== $(e).data('type')) {
            $(e).hide(0);
        } else {
            count++;
        }
    })
    console.log(count)
    var liId = '#type' + type;
    $('div.game-cate-select-inner ul li').removeClass('current');
    $(liId).addClass('current');
    if (count <= 0) {
        $('.no_game').show();
    }
    else {
        $('.no_game').hide();
    }

}
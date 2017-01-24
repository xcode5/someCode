var allhead ="";

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
        $(".login_modal").modal({keyboard: false});
    });
    $("a.reg_btn").click(function () {
        $(".reg_modal").modal({keyboard: false});
    });

    $(".submit_reg_btn a").click(function () {
        register();
    })

    $(".submit_login_btn a").click(function () {
        login();
    })

    $(".logout_btn").click(function () {
        $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=155&callback=?"
        $.getJSON($url, function (data) {
                console.debug(data);
                if (data[0].code != 1) {
                    reg_msg_show(data[0].message);
                } else {
                    window.location.reload();
                }
            }
        )


    })


    $url = serverUrl + "/index.php?r=dispatchWeb/index&cmd=156&callback=?"
    $.getJSON($url, function (data) {
            //console.debug(data);
            $('div.user_info p em.user_coin').text("正在查询...");
            if (data[0].code != 1) {
                $('div.user_info p em.user_coin').text(data[0].message)
            } else {
                $('div.user_info p em.user_coin').text(data[0].data.coin)
            }
        }
    )

    if (window.location.href.indexOf('detail.html') > -1) {
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
  
  $('div.user_info p em.user_name').text($.cookie(cookie_name))


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
                    window.location.href = "user.html";
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
                    window.location.href = "user.html";
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


function get_pictures_201(picId) {
    var fileTag=picId.split(".");
    var fileTag2=fileTag[0].substring(6,fileTag[0].length);
    
    var url = "http://img.static.sifuba.net/game/"+fileTag2+"/" + fileTag2 + "_201x201.png";
    var url1 = "http://img.static.sifuba.net/game/"+fileTag2+"/" + fileTag2 + "_201X201.png";
    
    document.write("<img id='game_icon' data-bd-imgshare-binded='1' src='"+url+"' onerror=\"javascript:this.src='"+url1+ "'\">");
}

function get_move_pictures(picId) {
    var fileTag=picId.split(".");
    var fileTag2=fileTag[0].substring(6,fileTag[0].length);
    //alert(fileTag2);
    var url = "http://img.static.sifuba.net/game/"+fileTag2+"/";
    var pic1 = url+"1.jpg";
    var pic2 = url+"2.jpg";
    var pic3 = url+"3.jpg";
    var pic4 = url+"4.jpg";
    document.write("<ul class='pic pis-re txa-c' id='img_list' style='position: relative; width: 690px; height: 511px;'><li style='position: absolute; width: 660px; left: 0px; top: 0px; display: none;'><img src='"+pic1+"'></li><li style='position: absolute; width: 660px; left: 0px; top: 0px; display: list-item;'><img src='"+pic2+"'></li><li style='position: absolute; width: 660px; left: 0px; top: 0px; display: none;'><img src='"+pic3+"'></li><li style='position: absolute; width: 660px; left: 0px; top: 0px; display: none;'><img src='"+pic4+"'></li></ul> <a class='prev' href='javascript:void(0)'></a> <a class='next' href='javascript:void(0)'></a>");

}

var allhead = ["<!--通用头部 开始-->",
               "<div class=\"top_out\">",
               "    <div class=\"top_menu\">",
               "        <div class=\"top_menu_in\">",
               "            <div class=\"top_menu_in_l\">",
               "                <ul class=\"navlist\">",
               "                    <li><a target=\"_blank\" href=\"index.htm\">为顺利领取手游礼包请在本站下载的app内注册<font color=\"#0000ff\">全新账号</font>,以后玩本站其他手游时均无需再次注册.<font color=\"#0000ff\">客服Q:303059970.</font></a></li>",
               "                    ",
               "                    ",
               "                    <li><span style=\"text-decoration:underline\"><a target=\"_blank\" href=\"http://cdn2.lp.sifuba.net/100000011076/100000011076_1000_b7ac36344212d947dd0b6f79654e485e.apk\">本站APP</a></span></li>",
               "                    ",
               "                    ",
               "                </ul>",
               "            </div>",
               "            <div class=\"top_menu_in_r\">",
               "                ",
               "                <div id=\"session_false\">",
               "                    <!--<script type=\"text/javascript\">",
               "                        if ($.cookie(cookie_name) != null && $.cookie(cookie_name) != \"\" && $.cookie(cookie_name) != undefined && $.cookie(cookie_name) != \"null\") {",
               "                            document.write(\"<div class=\'reg_logb\'><a class=\'welcome\'>欢迎您：</a><a class=\'auth_name\' href=\'user.html\'/*tpa=http://r7.cgamex.com/user.html*/>\"+$.cookie(cookie_name)+\"</a>|<a class=\'logout_btn\' href=\'javascript:void(0);\'></a></div>\");",
               "                        }else{",
               "                            document.write(\"<div class=\'reg_logb\'><a href=\'javascript:void(0);\' class=\'login_btn\'></a>|<a href=\'javascript:void(0);\' class=\'reg_btn\'></a></div>\");",
               "                        }",
               "                    </script>-->",
               "                    ",
               "                </div>",
               "            </div>",
               "        </div>",
               "    </div>",
               "</div>",
               "<script type=\"text/javascript\">",
               "    ",
               "    var browser={",
               "        versions:function(){",
               "            var u = navigator.userAgent, app = navigator.appVersion;",
               "            return {//移动终端浏览器版本信息",
               "                trident: u.indexOf(\'Trident\') > -1, //IE内核",
               "                presto: u.indexOf(\'Presto\') > -1, //opera内核",
               "                webKit: u.indexOf(\'AppleWebKit\') > -1, //苹果、谷歌内核",
               "                gecko: u.indexOf(\'Gecko\') > -1 && u.indexOf(\'KHTML\') == -1, //火狐内核",
               "                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端",
               "                ios: !!u.match(/\/\/(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端",
               "                               android: u.indexOf(\'Android\') > -1 || u.indexOf(\'Linux\') > -1, //android终端或者uc浏览器",
               "                               iPhone: u.indexOf(\'iPhone\') > -1 || u.indexOf(\'Mac\') > -1, //是否为iPhone或者QQHD浏览器",
               "                               iPad: u.indexOf(\'iPad\') > -1, //是否iPad",
               "                               webApp: u.indexOf(\'Safari\') == -1 //是否web应该程序，没有头部与底部",
               "                               };",
               "                               }(),",
               "                               language:(navigator.browserLanguage || navigator.language).toLowerCase()",
               "                               }",
               "                               ",
               "                               if(browser.versions.ios||browser.versions.android||browser.versions.mobile){",
               "                               //window.location.href = \"http://r7.cgamex.com/m\";",
               "                               }",
               "                               ",
               "                               //console.log(\"语言版本: \"+browser.language);",
               "                               //console.log(\" 是否为移动终端: \"+browser.versions.mobile);",
               "                               //console.log(\" ios终端: \"+browser.versions.ios);",
               "                               //console.log(\" android终端: \"+browser.versions.android);",
               "                               //console.log(\" 是否为iPhone: \"+browser.versions.iPhone);",
               "                               //console.log(\" 是否iPad: \"+browser.versions.iPad);",
               "                               //console.log(navigator.userAgent);",
               "</script>",
               "<div class=\"clear\"></div>",
               "<div class=\"game_nav\">",
               "    <div class=\"game_nav_inner\">",
               "        <ul>",
               "            <li nav_flag=\"youxizhongxin\" class=\"yx_cur\"><a href=\"index1.html\" title=\"游戏\">&nbsp;&nbsp;&nbsp;游戏</a></li>",
               "												<li nav_flag=\"fenlei\"><a href=\"all.html\" title=\"分类\">分类</a></li>",
               "                                                <li nav_flag=\"kaifu\" class=\"has_sub\">",
               "                                                    <a href=\"kf.html\" title=\"开服\">开服</a>",
               "                                                </li>",
               "								</ul>",
               "    </div>",
               "</div>",
               "<script type=\"text/javascript\">",
               "    $(function () {",
               "      $(\"li.has_sub\").hover(function () {",
               "                            $(this).children(\"ul\").slideDown(0);",
               "                            }, function () {",
               "                            $(this).children(\"ul\").slideUp(0);",
               "                            })",
               "      });",
               "    </script>",
               "<!-- 登录窗口相关 -->",
               "<div class=\"clear\"></div>",
               "<div class=\"modal login_modal\" role=\"dialog\">",
               "    <div class=\"modal-dialog modal-sm\">",
               "        <div class=\"modal-content\">",
               "            <div class=\"modal-header\">",
               "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">",
               "                    <span aria-hidden=\"true\">×</span>",
               "                </button>",
               "                <h4 class=\"modal-title\">登录C游账号</h4>",
               "            </div>",
               "            <div class=\"modal-body\">",
               "                <form class=\"login_form\">",
               "                    <div class=\"form-group\">",
               "                        <label for=\"login_username\">账号</label> <input type=\"email\" class=\"form-control\" id=\"login_username\" placeholder=\"请输入C游账号\">",
               "                            </div>",
               "                    <div class=\"form-group\">",
               "                        <label for=\"login_pass\">密码</label> <input type=\"password\" class=\"form-control\" id=\"login_pass\" placeholder=\"请输入C游密码\">",
               "                            </div>",
               "                    <div class=\"submit_login_btn\">",
               "                        <a href=\"javascript:void(0);\" class=\"button button-primary  button-rounded\">立即登录</a> <a href=\"javascript:void(0);\" id=\"btn_to_reg\" class=\"button button-caution button-pill button-small ml5\">快速注册</a>",
               "                    </div>",
               "                    <a class=\"label label-danger login_msg\"></a>",
               "                </form>",
               "            </div>",
               "        </div>",
               "    </div>",
               "</div>",
               "<div class=\"modal reg_modal\" role=\"dialog\">",
               "    ",
               "</div>",
               "<script type=\"text/javascript\">",
               "    if (get_query_parame(\"init\") == \"reg\") {",
               "        $(\".reg_modal\").modal({",
               "                              keyboard : false",
               "                              });",
               "    } else if (get_query_parame(\"init\") == \"login\") {",
               "        $(\".login_modal\").modal({",
               "                                keyboard : false",
               "                                });",
               "    }",
               "$(function() {",
               "		$(\"li.has_sub\").hover(function() {",
               "                              $(this).children(\"ul\").slideDown(100);",
               "                              }, function() {",
               "                              $(this).children(\"ul\").slideUp(100);",
               "                              })",
               "  ",
               "		$(\"#btn_to_login\").on(\"click\", function() {",
               "                              $(\".reg_msg\").hide(0);",
               "                              $(\".login_msg\").hide(0);",
               "                              $(\".reg_modal\").modal(\"hide\");",
               "                              $(\".login_modal\").modal({",
               "                                                      keyboard : false",
               "                                                      });",
               "                              })",
               "  ",
               "		$(\"#btn_to_reg\").on(\"click\", function() {",
               "                            $(\".reg_msg\").hide(0);",
               "                            $(\".login_msg\").hide(0);",
               "                            $(\".login_modal\").modal(\"hide\");",
               "                            $(\".reg_modal\").modal({",
               "                                                  keyboard : false",
               "                                                  });",
               "                            })",
               "  });",
               "    </script>",
               "<!-- 登录窗口相关结束 -->",
               "<div class=\"modal down-package-modal\" tabindex=\"-1\" role=\"dialog\">",
               "    <div class=\"modal-dialog modal-sm dpm\">",
               "        <div class=\"modal-content\">",
               "            <div class=\"modal-header\">",
               "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">",
               "                    <span aria-hidden=\"true\">×</span></button>",
               "                <h4 class=\"modal-title\">-选择下载</h4>",
               "            </div>",
               "            <div id=\"down_package_url_list\" class=\"modal-body\">",
               "                <ul>",
               "                    ",
               "                    ",
               "                </ul>",
               "            </div>",
               "        </div>",
               "    </div>",
               "</div>",
               "<!--通用头部 结束-->",
               ].join("");


//=============================================
var allhead_in=["<!--通用底部 开始-->",
 "<div id=\"footer\">",
 "    <div class=\"footer-cr-fl-out\">",
 "        <div class=\"footer-cr-fl-inner\">",
 "            <div class=\"index-aboutus\">",
 "                <a href=\"\" rel=\"nofollow\">家长监护</a>&nbsp;",
 "                | 玩家QQ群 574365795",
 "                <!--",
 "                 |<a href=\"javascript:;\" rel=\"nofollow\">免责声明</a>",
 "                 |<a href=\"javascript:;\" rel=\"nofollow\">网站地图</a>",
 "                 |<a href=\"javascript:;\" rel=\"nofollow\">关键词索引</a>",
 "                 |<a href=\"javascript:;\" rel=\"nofollow\">",
 "                 -->",
 "            </div>",
 "            <div class=\"copyright\">抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</div>",
 "            <div class=\"copyright\">",
 "                <script type=\"text/javascript\">",
 "                    if(window.location.href.toLowerCase().indexOf(\"sifuba.net\") > 0){",
 "                        document.write(",
 "                                       \'<span></span><span></span>sifuba.net<span></span>版权所有<span></span>\'",
 "                                       + \'<a href=\"\" target=\"_blank\">粤ICP备15065634-1号</a><span></span>\'",
 "                                       + \'<a target=\"_blank\" href=\"\"><img width=\"20px\" height=\"25px\" src=\"http://www.cgamex.com/static/images/icon_gov.gif\" data-bd-imgshare-binded=\"1\"></a><span></span>\'",
 "                                       + \'<a target=\"_blank\" href=\"http://sq.ccm.gov.cn:80/ccnt/sczr/service/business/emark/toDetail/dc57d55dc2e24928a50caee177aba3b5\"><img width=\"25px\" height=\"25px\" src=\"http://www.cgamex.com/static/images/wenwangwen.png\" data-bd-imgshare-binded=\"1\"></a><span></span>\'",
 "                                       + \'\'",
 "                                       );",
 "                    }else{",
 "                        document.write(",
 "                                       \'<span></span><span></span>cgamex.com<span></span>版权所有<span></span>\'",
 "                                       + \'<a href=\"\" target=\"_blank\">粤ICP备16030268号</a><span></span>\'",
 "                                       + \'<a target=\"_blank\" href=\"\"><img width=\"25px\" height=\"25px\" src=\"http://www.cgamex.com/static/images/wenwangwen.png\" data-bd-imgshare-binded=\"1\"></a><span></span>\'",
 "                                       + \'\'",
 "                                       );",
 "                    }",
 "                ",
 "                    </script><a href=\"\" target=\"\"></a>",
 "                ",
 "                <!-- script type=\"text/javascript\">",
 "                 var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \"https://\" : \"http://\");",
 "                 document.write(unescape(\"%3Cspan id=\'cnzz_stat_icon_1256376982\'%3E%3C/span%3E%3Cscript src=\'\" + cnzz_protocol + \"s11.cnzz.com/z_stat.php%3Fid%3D1256376982%26show%3Dpic1\' type=\'text/javascript\'%3E%3C/script%3E\"));",
 "                 </script-->",
 "                <script type=\"text/javascript\">",
 "                    var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \" https://\" : \" http://\");",
 "                    document.write(unescape(\"%3Cspan id=\'cnzz_stat_icon_1260239884\'%3E%3C/span%3E%3Cscript src=\'\" + cnzz_protocol + \"s4.cnzz.com/z_stat.php%3Fid%3D1260239884%26show%3Dpic1\' type=\'text/javascript\'%3E%3C/script%3E\"));",
 "                    </script><span id=\"cnzz_stat_icon_1260239884\"><a href=\"http://www.cnzz.com/stat/website.php?web_id=1260239884\" target=\"_blank\" title=\"站长统计\"><img border=\"0\" hspace=\"0\" vspace=\"0\" src=\"./otherjs/pic1.gif\" data-bd-imgshare-binded=\"1\"></a></span><script src=\"./otherjs/z_stat.php\" type=\"text/javascript\"></script><script src=\"./otherjs/core.php\" charset=\"utf-8\" type=\"text/javascript\"></script>",
 "                <!--公司名字--><span></span>",
 "            </div>",
 "        </div>",
 "    </div>",
 "</div>",
 "<script type=\"text/javascript\">",
 "    $(function(){",
 "      var selfNavFlag = $(\"#navFlag\").val();",
 "      console.log(selfNavFlag);",
 "      ",
 "      $(\".game_nav ul li\").each(function () {",
 "                                if($(this).attr(\"nav_flag\")==selfNavFlag){",
 "                                $(this).addClass(\"yx_cur\");",
 "                                return false;",
 "                                }",
 "                                })",
 "      });",
 "    </script>",
 "<script>",
 "    window._bd_share_config={\"common\":{\"bdSnsKey\":{},\"bdText\":\"\",\"bdMini\":\"2\",\"bdMiniList\":false,\"bdPic\":\"\",\"bdStyle\":\"0\",\"bdSize\":\"16\"},\"slide\":{\"type\":\"slide\",\"bdImg\":\"4\",\"bdPos\":\"left\",\"bdTop\":\"101.5\"},\"image\":{\"viewList\":[\"qzone\",\"tsina\",\"tqq\",\"renren\",\"weixin\"],\"viewText\":\"分享到：\",\"viewSize\":\"32\"},\"selectShare\":{\"bdContainerClass\":null,\"bdSelectMiniList\":[\"qzone\",\"tsina\",\"tqq\",\"renren\",\"weixin\"]}};with(document)0[(getElementsByTagName(\'head\')[0]||body).appendChild(createElement(\'script\')).src=\'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=\'+~(-new Date()/36e5)];",
 "    </script>",
 "<!--通用底部 结束-->",
 "<div class=\"bdshare-slide-button-box bdshare-slide-style-l4\" style=\"top: 101px; width: 0px; z-index: 99999; left: 0px;\" data-bd-bind=\"1484267053767\"><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bdshare-slide-button\" style=\"right: -24px;\"></a><div class=\"bdshare-slide-list-box\" style=\"width: 0px; display: none;\"><div class=\"bdshare-slide-top\">分享到</div><div class=\"bdshare-slide-list\"><ul class=\"bdshare-slide-list-ul\" style=\"width: 226px;\"></ul></div><div class=\"bdshare-slide-bottom\" style=\"width: 226px;\"><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"slide-more\" data-cmd=\"more\">更多...</a></div></div></div><iframe frameborder=\"0\" id=\"bdSharePopup_selectshare1484267053775bg\" class=\"bdselect_share_bg\" style=\"display:none;\" src=\"./otherjs/saved_resource.html\"></iframe><div id=\"bdSharePopup_selectshare1484267053775box\" style=\"display: none;\" share-type=\"selectshare\" class=\"bdselect_share_box\" data-bd-bind=\"1484267053774\"><div class=\"selectshare-mod-triangle\"><div class=\"triangle-border\"></div><div class=\"triangle-inset\"></div></div><div class=\"bdselect_share_head\"><span>分享到</span><a href=\"http://www.baidu.com/s?wd=&amp;tn=SE_hldp08010_vurs2xrp\" class=\"bdselect_share_dialog_search\" target=\"_blank\"><i class=\"bdselect_share_dialog_search_i\"></i><span class=\"bdselect_share_dialog_search_span\">百度一下</span></a><a class=\"bdselect_share_dialog_close\"></a></div><div class=\"bdselect_share_content\"><ul class=\"bdselect_share_list bdshare-button-style0-16\"><div class=\"bdselect_share_partners\"><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_qzone\" data-cmd=\"qzone\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_tsina\" data-cmd=\"tsina\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_tqq\" data-cmd=\"tqq\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_renren\" data-cmd=\"renren\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_weixin\" data-cmd=\"weixin\"></a></div><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" class=\"bds_more\" data-cmd=\"more\"></a></ul></div></div><div id=\"bdimgshare_1484267053783\" class=\"sr-bdimgshare sr-bdimgshare-list sr-bdimgshare-32 sr-bdimgshare-black\" style=\"height:48px;line-height:38px;font-size:14px;width:autopx;display:none;\" data-bd-bind=\"1484267053783\"><div class=\"bdimgshare-bg\"></div><div class=\"bdimgshare-content bdsharebuttonbox bdshare-button-style0-32\"><label class=\"bdimgshare-lbl\">分享到：</label><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_qzone\" data-cmd=\"qzone\" hidefocus=\"\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_tsina\" data-cmd=\"tsina\" hidefocus=\"\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_tqq\" data-cmd=\"tqq\" hidefocus=\"\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_renren\" data-cmd=\"renren\" hidefocus=\"\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_weixin\" data-cmd=\"weixin\" hidefocus=\"\"></a><a href=\"http://r7.cgamex.com/detail.html?gameid=10154#\" onclick=\"return false;\" class=\"bds_more\" data-cmd=\"more\" hidefocus=\"\"></a></div></div>"].join("");

function readHTMLHead(){
    
    document.write(allhead);
}

function readHTMLBottom(){
    
    document.write(allhead_in);
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
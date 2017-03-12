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
    //$(".reg_msg").html().css({'display': "none"});
}

var login_msg_show = function (msg) {
    //$(".login_msg").removeClass("label-success").addClass("label-danger");
   // $(".login_msg").html(msg).css({'display': "block"});
}

var login_msg_hide = function () {
    //$(".login_msg").html().css({'display': "none"});
}

var set_login_cookie = function (user_name) {
    //$.cookie(cookie_name, user_name);
}

var remove_login_cookie = function () {
    //$.cookie(cookie_name, null);  //删除cookie
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  
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
                //console.log(data)
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




var fuli = ["此游戏请注册r8开头账号登录领取福利-上线送vip6、6888元宝、9999银两、388888铜钱。   ",
 "每档首充2倍；充值任意金游戏内自动返利50%元宝、不限次数！  ",
 "新手奖励送豪礼！每日登录奖励3000元宝；   ",
 "每日签到获取百万铜钱、银两、藏宝图、高级药品；vip玩家双倍领取奖励！  ",
 "在线获取大量铜钱、双倍经验丹、炼化装备材料、藏宝图等大量物品；    ",
 "冲级送大礼，送元宝、魂石、铜钱、蟠桃、炼化装备材料.赶快和小伙伴来冲级吧！   ",
 "每周一至周日上午11:00-21:00大量福利任务，和小伙伴组队收获满满一箩筐福利！    ",
 "每周限购低至1折；   ",
 "购买月卡立即获得5000元宝、3000vip值，每日领取3000元宝；    "].join("");


var fuli301 = ["此游戏请注册r8开头账号登录领取上线福利：上线送vip5，11888钻石，100W金币！送紫色F大BO妹，价值999大礼包。    ",
 "首充档位：每档首充4倍！充值任意金额，领取女神橙色“斗人”，至尊装备，20W金币！    ",
 "每日签到：每天登录游戏签到领取每日福利翻3倍！    ",
 "登录送礼：累计登录游戏资源翻4倍！钻石领不停！累计7天领取橙色终极武器！    ",
 "在线奖励：在线奖励送大量能量源，体力，金币等！    ",
 "成长计划：购买成长计划，即可获得海量钻石返还！    ",
 "开服狂欢：达到一定的等级或战力，即可领取钻石！    ",
 "普天同庆：全服玩家指定VIP等级满足要求时，各VIP等级玩家即可领取对应的奖励，每个档次的奖励可重复领取！！！    ",
 "每周限时：每周礼包限时限量抢购，最低2.5折！    ",
 "时装：美少女小伙伴，时装换换换~ 3D视觉惊爆你的眼球！！    "].join("");

var fuli302 = ["此游戏请注册r8开头账号登录领取福利-上线送vip6、11888元宝、500万银币、首充礼包、橙色神将关羽，高级招募令；    ",
 "每档首充2倍（第一笔充值3倍，仅限一个档位，建议充值大额度）    ",
 "在线礼包送元宝、银两、武将，满屏银两宝箱，考验你手速的时候到了！    ",
 "累计登录返利、连续登录送橙色神将赵云、橙色神装方天画戟套装！    ",
 "次充送董卓、吕布、关羽的攻击缘分宝物赤兔马、元宝等高级材料；    ",
 "完成成就任务领取大量元宝；    ",
 "开服狂欢免费送元宝、最强名将包可在吕布、周瑜、司马懿选择其中一个神将；    ",
 "离线收益系统，让您随时随地自由畅享轻游戏。"].join("");

var fuli303 = ["此游戏请注册r8开头账号登录领取福利-上线送vip5，元宝*8888，铜钱*100W，VIP每日礼包；    ",
               "每档首充3倍，每档续充赠送50%元宝      ",
               "首充任意金额送最强近战英雄-阿飞，孤魂剑，铜钱*10W，体力*150；   ",
               "开服礼包豪礼送不停，登陆2天立即送高防御英雄-郭嵩阳，第3天送橙色英雄-李寻欢；第4天送元宝*1888，第7天赠送橙色战靴，第8天送元宝*3888；   ",
               "成功通关新关卡立即赠送英雄碎片，集齐碎片可召唤武林第一美女-林诗音；    ",
               "每日在线领取大量元宝，铜钱，物品；    ",
               "7日红包有礼，每日消费元宝的10%会存入红包，第二天可领取昨日消费元宝的10%；    ",
               "升级，关卡通关，侠客培养完成任务即可获赠大量元宝；    ",
               "30元月卡：购买立赠6000元宝 每日可领2000元宝     ",
               "68元季卡：购买立赠13600元宝 每日可领2000元宝    ",
               "98元吉祥卡：购买立赠19600元宝 每日可领3000元宝      ",
               "298元至尊卡：购买立赠59600元宝 每日可领5000元宝     ",
               "同时购买所有卡片：每天可领取12000元宝。      ",
               "成长基金全民福利，已买玩家共享豪华大礼，购买人数越多奖励越丰厚； ",
               "更多高福利活动，等你来参与！               ",
               "全新一代巅峰3D即时战斗武侠RPG手游，男神焦恩俊倾情代言，十八年回忆经典《小李飞刀》电视剧正版授权！多样玩法，超爽体验，已获数十万玩家喜爱与支持！你的江湖，由你打造！男神焦恩俊与新生代女星赖雨濛倾情代言！ -明星侠客大收集，百余侠客、千种组合、万般策略！ -3V3侠客大乱斗，超爽战斗。"].join("");

var fuli304 = "游戏采用Unity3D引擎制作，360°自由操控游戏画面，体验最顶级的画面质感，欣赏英雄每个细节！"+
"战斗中玩家可以随意移动，手动释放技能，掌握战机，打断技能，瞬间逆袭，完爆BOSS！3V3实时对战，热血沸腾，一触即发！"+
"人族诸神，兽族勇士，精灵法师，地狱魔王齐助阵，助你潇洒闯四方！顶级英雄任意组合，享受战斗乐趣！独特的装备合成系统，合出你的专属装备！专属特技助你一臂之力！陷阱，陨石，天雷，冰雪让你应接不暇，四族英雄来助阵，还有神秘支线关卡，享受探索乐趣！"+
"领取方式：游戏悬浮窗-领取礼包码-游戏活动-礼包兑换-输入礼包码"+
"礼包内容：金币*50000；钻石*1000；极品经验果*30 "+
"上线送vip4、钻石*6888、铜币*100W、vip1-4等级礼包；"+
"首充任意金额，送完美的A级3★维纳斯、橙色装备、优质经验果、金币16W，助你所向披靡！"+
"每档首充双倍，每档续充送50%（例如：玩家购买了10元首充档位之后，再次购买10元档位才赠送50%，每个档位的首充档是没有50%赠送的）"+
"每日登录可获得大量钻石，登录七天可以获得3★死亡先知；"+
"完成7日目标，可获取装备、大量宝石、金币、技能书宝箱等物品；"+
"超值返利基金三种基金任您选购，迷你基金600钻石，超值返利100%，优质基金6000钻石，超值返利200%，至尊基金12000钻石，超值返利300%，只能三选一喔！"+
"每日签到送大量优质物品（钻石、宝石袋、英雄/契约卷轴、经验果、金币袋、体力等）签到第三天送A级齐天大圣，连续签到可获得高级齐天大圣碎片；"+
"单笔充值、累计充值领取大量超神物品，A级3★橙色英雄-荒神；橙色装备套装等；"+
"完成等级达人、装备强化、闯关达人、星辰收集、英雄图鉴任务，可领取大量奖励；"+
"完成每日任务，成就可获取大量高品质物品！ 领取方式：游戏活动-礼包兑换-输入礼包码。礼包码找客服索取。礼包内容：金币*50000；钻石*1000；极品经验果*30。";

var fuli305 = "一款武侠风格浓厚的新一代自由手游，古色古香的江湖，带你领略最正统武侠的魅力。游戏采用自动回合制，六大风格迥异的角色模型可供选择，三大阵营可自由入驻。玩家可以自由决定角色的发展历程，亲手打造专属极品装备，更能自创各种各样的武学，有百余种特色侠客等你去收集，游戏内丰富的活动，勇夺百胜、华山论剑、国库献器、宝刀屠龙、聚宝灵树等刺激好玩的游戏玩法，将给你一个全新的自由武侠世界！上线vip5、金票*8888、银两*100W，小喇叭*200 （邮件领取）"+
"每档首充2倍，充值任意金额送橙色英雄-龙姑娘、强化石*10、高级屠龙刀*5、银锭*10W；"+
"每日签到可领取60金票，登录奖励每日领取好礼，vip专属物品，每登录5天可领取100金票，"+
"累计登录2天送橙色英雄-任教主；累计登录5天送高级物品的稀有材料-南海奇精；累计登录9天送橙色英雄-冲虚真人；累计登录15天送橙色高级屠龙刀；累计登录25天送橙色赏善罚恶令；"+
"购买月卡即可获得5250金票，每天上线领取1200金票；"+
"日常活动：祭神、华山论剑、闯关、勇夺百胜、暗影迷宫可获取大量威望、经验、银锭、橙色屠龙刀、熔炼石、强化石；"+
"限时活动：世界BOSS、龙舟争霸、组队副本、仗剑天涯可获得大量经验、银锭、残页、威望、橙色神秘物品，快来挑战吧！"+
"完成每日活跃可领取金票、银两、小喇叭等活跃奖励；"+
"帮派战、帮派聚宝盆、帮派BOSS可获取大量物品、活力等；"+
"阵营战：边境决战、征战沙场、武林盟主，快来一决高低！礼包内容：南海奇精 *10、中级屠龙刀*20、高级屠龙刀*20、白银招募令*20、黄金招募令*10、大袋银两 *10  "+
"领取方式：头像-礼包码兑换。礼包码找客服索取";

var fuli306 = "《烈火传》是2017最火爆的传奇网游，热血回忆依旧，万人攻沙，争霸皇城。采用全新PK引擎和社交系统、超稳定的经济系统加上强大的战斗系统。神秘副本，强大装备，土城pk，带你重回最经典的传奇盛世。======礼包介绍====="+
" 领取礼包：游戏悬浮窗-礼包领取礼包码-精彩活动-新区活动-新手助力"+
"礼包内容：金币50000，双倍宝典（绑）*3，天工神符（绑）（30%），斩妖令大包（绑）"+
"=========上线送vip5、绑定元宝*8888、金币*100W、送vip1-vip5福利大礼包；"+
"===充值比例1:200，每档永久2倍；（第二倍在精彩活动-特惠活动-充值有礼领取第二倍元宝和物品）"+
"===首充任意金额送价值18888元宝豪华大礼包，三大职业神器、元宝领不停！"+
"===周卡：仅需700元宝：每日领取中级宝石袋*1、绑定金*50W、攻击+100（每天1小时）；"+
"===月卡：9.3折仅需2800元宝：每日领取中级宝石袋子*3、成就令牌*2、绑定金*150W、攻击+300（每天1小时）；"+
"===半年卡：8.8折仅需1W6元宝，每日领取中级宝石袋*5、成就令牌*3、绑定金*200W、攻击+300（每日1小时）、免费清洗红名1次；"+
"===每日签到第一天就送橙色吸血鬼武器，还有大量高级材料，金币等你来领取！"+
"===登录7天即可领取价值1988元道具，不花钱就能爽！"+
"===成就系统：初入江湖、刻苦修炼、等级达人、屠魔达人、财富积累、熔炼大师，活跃大人；可获取成就点数兑换牛逼称号！"+
"===新区冲刺豪礼：（游戏内领取奖励：精彩活动-新区冲刺）"+
"===活动时间：开服7天（开服当天算第一天）"+
"===强化之力：全服第一穿着强化+9装备，即可获得75000元宝（只在穿着或强化已穿着装备时检查强化装备数量）；"+
"===元神升级：将元神提升至要求的等级，则可领取奖励；全服最先将元神提升至10级的前3名玩家，则可领取大量元宝；"+
"===神力升级：将神力提升至要求的等级，则可领取奖励；全服最先将神力提升至5级的前3名玩家，则可领取大量元宝；"+
"===扬名立万：获得要求的某一称号，则可领取奖励；全服最先获得“百胜天师”称号的前3名玩家，则可领取大量元宝；"+
"===散人天堂，激情PK，千人城战，重温热血激情之旅！"+
"===史上福利最火爆，活动最丰富的游戏！赶快和小伙伴们来血战到底！";

/**
 * 下载
 * @param 游戏ID
 */
var down_fun = function (gameId) {
    
    if (gameId == "300") {
        alert(fuli);
    }
    
    if (gameId == "301") {
        alert(fuli301);
    }
    
    if (gameId == "302") {
        alert(fuli302);
    }
    
    if (gameId == "303") {
        alert(fuli303);
    }
    
    if (gameId == "304") {
        alert(fuli304);
    }
    
    if (gameId == "305") {
        alert(fuli305);
    }
    
    if (gameId == "306") {
        alert(fuli306);
    }
    var selfGameInfo = Enumerable.From(gameListObj)
        .Where(function (x) {
            return x.gameid == gameId;
        })
        .ToArray()[0];
    if (selfGameInfo == null || selfGameInfo == undefined || selfGameInfo == "") {
        //console.log("没有找到GAMEID=" + gameId + "的游戏");
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
    //console.log(count)
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
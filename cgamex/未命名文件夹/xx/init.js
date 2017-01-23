//返回顶部
$(window).scroll(function () {
    if ($(window).scrollTop() >= 100) {
        $("#top").slideDown();
    } else {
        $("#top").slideUp();
    }
});
$("#top").on("click", function () {
    $("html,body").animate({"scrollTop": 0}, "slow");
});
$("a").on("click", function () {
	if((isWeixin()) && new String(this.href).toLowerCase().indexOf(".apk") > 0){
		alert("请点击右上角-浏览器打开-下载");
	}
	
	return true;
});
$("body").on("click", function (e) {
        e.stopPropagation();
        $(".sub-nav").slideUp();
});
$('.head .list-nav').on('click', function (e) {
    e.stopPropagation();//阻止当前事件冒泡传递
    $('ul.sub-nav').slideToggle();
})

var ua = window.navigator.userAgent.toLowerCase();
if ((ua.match(/MicroMessenger/i) == 'micromessenger') &&
    (window.location.href.toLowerCase().indexOf("http://m.cgamex.com/static/js/pay.html") > -1 || window.location.href.toLowerCase().indexOf("http://m.cgamex.com/static/js/pay_direct.html") > -1)) {
    Common.Layer.ShowPageLayer("<h2 style='text-align: center; margin-top: 50%;'>请直接在浏览器打开！</h2>", "width:100%;height:100%; color:#ff4351; filter:alpha(opacity=70);-moz-opacity:0.7;-khtml-opacity: 0.7;opacity: 0.7;");
}

function isWeixin(){
	var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

function isQQ(){
	var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MQQBrowser/i) == 'mqqbrowser'){
        return true;
    }else{
        return false;
    }
}

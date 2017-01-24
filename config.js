var serverUrl = "http://i.cgamex.com/";
var webServerUrl = "http://www.cgamex.com/";
var cookie_name = "username";

if(window.location.href.toLowerCase().indexOf("http://www.cgamex.com/static/scripts/sifuba.net") > 0){
	serverUrl = "http://i.sifuba.net/";
}


/*
 这里暂时未启用，还是用上面的配置方式
 */
var Configs = {
    ServeruRL: "http://i.cgamex.com/",//接口地址
    CookieName: "username"//Cookie名
};
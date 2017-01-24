var Configs = {
    WebSite: {
        IsShowSlideBox: true,//是否显示滚屏图
        ApiUrl: "http://i.cgamex.com/",//接口地址
        CookieName: "username",//用户登录cookie名
        AppType:4//当前应用读取游戏的类型
    },
    Pay: {
        PayType: [
            //支付方式paytype：101支付宝，102网银，103微信，104充值卡
            {
                TypeId: 101,
                TypeName: '支付宝'
            },
            {
                TypeId: 102,
                TypeName: '网银'
            },
            {
                TypeId: 103,
                TypeName: '微信'
            },
            {
                TypeId: 104,
                TypeName: '充值卡'
            }
        ],
        PayMoney: [
            {
                Item: 10,
                Desc: '充值10元'
            },
            {
                Item: 50,
                Desc: '充值50元'
            },
            {
                Item: 100,
                Desc: '充值100元'
            },
            {
                Item: 300,
                Desc: '充值300元'
            },
            {
                Item: 500,
                Desc: '充值500元'
            },
            {
                Item: 1000,
                Desc: '充值1000元'
            },
            {
                Item: 2000,
                Desc: '充值2000元'
            },
            {
                Item: 3000,
                Desc: '充值3000元'
            },
            {
                Item: 5000,
                Desc: '充值5000元'
            }

        ],
        PayToType:[
            {
                TypeVal:1,
                TypeName:"充值游戏"
            },
            {
                TypeVal:2,
                TypeName:"充值C币"
            },
            {
                TypeVal:3,
                TypeName:"合作付款"
            }
        ],
        CardMoney:[
            {
                "name": "电信充值卡",
                "type_id": 2,
                "card_acc_len": 10,
                "card_pass_len": 8,
                "pay_type": "104",
                "is_show": true,
                "items": [
                    {
                        "item_name": "电信20元",
                        "item_amount": 20
                    },
                    {
                        "item_name": "电信30元",
                        "item_amount": 30
                    },
                    {
                        "item_name": "电信50元",
                        "item_amount": 50
                    },
                    {
                        "item_name": "电信100元",
                        "item_amount": 100
                    },
                    {
                        "item_name": "电信300元",
                        "item_amount": 300
                    },
                    {
                        "item_name": "电信500元",
                        "item_amount": 500
                    }
                ]
            },
            {
                "name": "移动充值卡",
                "type_id": 0,
                "card_acc_len": 10,
                "card_pass_len": 8,
                "pay_type": "104",
                "is_show": true,
                "items": [
                    {
                        "item_name": "移动10元",
                        "item_amount": 10
                    },
                    {
                        "item_name": "移动20元",
                        "item_amount": 20
                    },
                    {
                        "item_name": "移动30元",
                        "item_amount": 30
                    },
                    {
                        "item_name": "移动50元",
                        "item_amount": 50
                    },
                    {
                        "item_name": "移动100元",
                        "item_amount": 100
                    },
                    {
                        "item_name": "移动200元",
                        "item_amount": 200
                    },
                    {
                        "item_name": "移动300元",
                        "item_amount": 300
                    },
                    {
                        "item_name": "移动500元",
                        "item_amount": 500
                    }
                ]
            },
            {
                "name": "联通充值卡",
                "type_id": 1,
                "card_acc_len": 10,
                "card_pass_len": 8,
                "pay_type": "104",
                "is_show": true,
                "items": [
                    {
                        "item_name": "联通20元",
                        "item_amount": 20
                    },
                    {
                        "item_name": "联通30元",
                        "item_amount": 30
                    },
                    {
                        "item_name": "联通50元",
                        "item_amount": 50
                    },
                    {
                        "item_name": "联通100元",
                        "item_amount": 100
                    },
                    {
                        "item_name": "联通200元",
                        "item_amount": 200
                    },
                    {
                        "item_name": "联通300元",
                        "item_amount": 300
                    },
                    {
                        "item_name": "联通500元",
                        "item_amount": 500
                    }
                ]
            }
        ],
        DefaultPayType: 101,//默认支付宝
        DefaultPayMoney: 100,//默认100元支付金额
        DefaultPayToType:1,//默认充值C币充值
        DefaultCardType:0,//默认卡类为移动
        DefaultCardMoney:100
    }
};

if(window.location.href.toLowerCase().indexOf("http://m.cgamex.com/static/js/sifuba.net") > 0){
	Configs.WebSite.ApiUrl =  "http://i.sifuba.net/";
}

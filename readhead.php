<?php
    $action=$_GET['action'];
    
    
    $formatted = file_get_contents("allhead.html") ;
    $formatted1 = str_replace("\n"," ",$formatted);
    //$formatted1 = str_replace("\"","'",$formatted1);
    
    //echo "document.write('".$formatted1."');n";
    
    if($_GET["action"]=="head")
    {
    }
    else
    {
        
    }
    /*$handle = fopen('allhead.html', 'r');
     while(!feof($handle)){
     $xxx = fgets($handle, 1024);
     echo "document.write('".$xxx."');";
     }
     fclose($handle);*/
    
    //echo "document.write(\"xxxxxxxxxxxxxxxxxxx\");";
    ?>
value="<?php echo $formatted1;?>"
document.write(value);

[{"gameid":"10156","apptype":"1","servertype":"0","game_name":"\u68a6\u5e7b\u62e9\u5929","can_pay":true,"url_apk":"http:\/\/cdn2.lp.sifuba.net\/100000011076\/100000011076_10156_42e5dd0938dc261668a2953d70efae37.apk","url_ios1":"","url_ios2":""},
<li id="type1"><a title="休闲模拟" href="javascript:select_game_by_type(1)">休闲模拟</a></li>
<li id="type2"><a title="即时战斗" href="javascript:select_game_by_type(2)">即时战斗RPG</a></li>
<li id="type3"><a title="动作横版" href="javascript:select_game_by_type(3)">动作横版</a></li>
<li id="type4"><a title="射击游戏" href="javascript:select_game_by_type(4)">射击游戏</a></li>
<li id="type5"><a title="冒险游戏" href="javascript:select_game_by_type(5)">冒险游戏</a></li>
<li id="type6"><a title="体育竞技" href="javascript:select_game_by_type(6)">体育竞技</a></li>
<li id="type7"><a title="策略塔防" href="javascript:select_game_by_type(7)">策略塔防</a></li>
<li id="type8"><a title="卡牌" href="javascript:select_game_by_type(8)">卡牌</a></li>
<li id="type9"><a title="棋牌娱乐" href="javascript:select_game_by_type(9)">棋牌娱乐</a></li>
<li id="type10"><a title="回合制" href="javascript:select_game_by_type(10)">回合制</a></li>
<li id="type11"><a title="挂机放置" href="javascript:select_game_by_type(11)">挂机放置</a></li>
<li id="type12"><a title="其它"
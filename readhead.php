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

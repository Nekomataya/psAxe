/*
    nas psAxe　splash and install panel
    2014/11/25 Nekomataya/kiyo
  
  basePath は機能拡張のcontentRootを指す
  起動時にフォルダ構成を確認してパスを修正する
  機能拡張パネルからの呼び出し専用スクリプト
*/
//
//CEP (CC or CC2014)で初期化 
var basePath=File($.fileName).parent.parent.parent.fullName;
var mySplash=basePath+"/res/psAXEsplash.png";
var myInstall=basePath+"/psAxeInstall/nasPsAxeInstall.jsx";
//CSX (CS6 or CC)を検出時はパスを更新
if(File(basePath).name=="HTML"){
  basePath=File(basePath).parent.fullName;
	mySplash=basePath+"/res/psAXEsplash.png";
	myInstall=basePath+"/HTML/psAxeInstall/nasPsAxeInstall.jsx";
}

w=new Window("dialog","nas psAxe",[512,128,1024,640]);
/*
var goInstall= function(){$.evalFile(basePath+"/nasPsAxeInstall.jsx");this.parent.close()};
var goUninstall= function(){$.evalFile(myInstallFolder+"/nasPsAxeInstall.jsx");this.parent.close()};
*/
myImg=w.add("image",[0,0,512,365],mySplash);
myButton01=w.add("button",[128,378,384,402],"Install");
myText01=w.add("staticText",[64,410,448,434],"click Install button please! for setup your psAXE\n\n\n");

myButton01.onClick=function(){$.evalFile(myInstall);this.parent.close()};

myText02=w.add("staticText",[64,490,448,512],"photoshop animation tools by nekomataya / kiyo 2014");
//インストールロケーション取得

var myInstallFolder=Folder.userData.fullName+"/nas";

//すでに１回以上インストールされている場合は選択的にインストール・アンインストールを行う
if(File(myInstallFolder).exists){
    myButton02=w.add("button",[128,434,384,458],"Install/Uninstall");
    myText01.text=" ";
    myButton01.text="OK";
    myButton01.onClick=function(){this.parent.close()};
    myButton02.onClick=function(){
        if(File(myInstallFolder+"/nasPsAxeInstall.jsx").exists)
        {
            $.evalFile(myInstallFolder+"/nasPsAxeInstall.jsx");
        }else{
            $.evalFile(myInstall);
        }
    };
}
w.show();

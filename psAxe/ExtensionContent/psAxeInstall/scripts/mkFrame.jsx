/*
	スクリプト指定でテンプレートのキーワードを置き換えて
	指定のフレームepsを生成する
	adobe汎用

$Id:$
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
/*
	あらかじめ引数付でコールされた場合は、デフォルト値に引数をマージしてファイルを保存する
	引数なしの場合はインタラクティブUIを提示する
引数は順位依存
arguments[0]	
arguments[1]	保存ファイルパス (自動設定 BWmmWxH.eps)
arguments[2]	baseWidth ("254 mm")
arguments[3]	aspectW   (16)
arguments[4]	aspectH	  (9)
arguments[5]	pegOffsetX ("0 mm")
arguments[6]	pegOffsetY ("104 mm")
arguments[7]	pegOffertR (0)
arguments[8]	
*/

//引数オブジェクトが存在しない場合仮のオブジェクトでエラーを回避する
try{if(arguments[0]){;};}catch(ERR){var arguments=new Array();}
//==================== ターゲットパスを取得しておく
//alert(arguments[0] +":"+ Folder.current.path)

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトを使用
	 var nasFolderPath = new File($.fileName).parent.path +"/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasFolderPath = Folder.userData.fullName + "/nas/";
}
//	alert(nasFolderPath)
//	nasライブラリを前提としない、単独で動作するスクリプトである。

try{
//app オブジェクトがあればAdobeScript環境と判断する。エラーがでれば、たぶんHTMLブラウザってことで
if(app){;};}catch(ERR){	abortProcess("Adobe環境から起動してください。");}

var nas_buildFrame=new Object();//

	nas_buildFrame.savePath       =nasFolderPath+"lib/resource/Frames";//
	nas_buildFrame.baseWidth      =254;//10in
	nas_buildFrame.aspectW        =16;
	nas_buildFrame.aspectH        =9;//frame aspect
	nas_buildFrame.pegOffsetX     =0;//センタからの左右オフセット(mm)
	nas_buildFrame.pegOffsetY     =104;//センタからの上限オフセット(mm)
	nas_buildFrame.pegOffsetR     =0;//回転オフセット(degrees)
	nas_buildFrame.baseResolution =(200/2.54) ;//standrd Resolution(dpc)
	nas_buildFrame.debug          =false;//actionLog


//引数あれば有るだけデフォルト値と置き換え
	if(arguments.length>1){
	 var props=["(skip)","savePath","baseWidth","aspectW","aspectH","pegOffsetX","pegOffsetY","pegOffertR"];
	 for(var ix=1;ix<arguments.length;ix++){nas_buildFrame[props[ix]]=arguments[ix]};
	}

//簡易識別
var isWindows=($.os.match(/windows/i))?true:false;//windowsフラグ
nas_buildFrame.sourceFile=new File(nasFolderPath+"lib/resource/Frames/frameTemplate.ps");
///Applications/Adobe%20Photoshop%20CS6/Presets/Scripts

//簡易GUIライブラリを搭載する。
var LineFeed=(isWindows)?"\x0d\x0a":"\x0d";//改行コード設定

// GUI Setup
//簡易GUIライブラリ
	var leftMargin=12;
	var rightMargin=24;
	var topMargin=2;
	var bottomMargin=24;
	var leftPadding=8;
	var rightPadding=8;
	var topPadding=2;
	var bottomPadding=2;
	var colUnit=120;
	var lineUnit=24;
	var quartsOffset=(isWindows)? 0:4;
function nasGrid(col,line,width,height){
	left=(col*colUnit)+leftMargin+leftPadding;
	top=(line*lineUnit)+topMargin+topPadding;
	right=left+(width*colUnit)-rightPadding;
	bottom=(height <= lineUnit)?top+(height*lineUnit)-bottomPadding-quartsOffset:top+(height*lineUnit)-bottomPadding;
		return [left,top,right,bottom];
}
//
 if(nas_buildFrame.debug){alert(nas_buildFrame.sourceFile.fsName);}

/*

 */

//パラメータ置換
nas_buildFrame.pathReplace=function(myString)
{
	myString = myString.replace(/\%PAPERWIDTH\%/g  ,Math.ceil(parseFloat(this.baseWidth)*1.2*72/25.4));
	myString = myString.replace(/\%PAPERHEIGHT\%/g ,Math.ceil(parseFloat(this.pegOffsetY)*2*72/25.4));
	myString = myString.replace(/\%FRAMENAME\%/g   ,this.saveFile.name);
	myString = myString.replace(/\%BASEWIDTH\%/g   ,this.baseWidth);
	myString = myString.replace(/\%ASPECTH\%/g     ,this.aspectH);
	myString = myString.replace(/\%ASPECTW\%/g     ,this.aspectW);
	myString = myString.replace(/\%FRAMEOFFSET\%/g ,this.pegOffsetY);
return myString;
}
//置換つきファイル複写
nas_buildFrame.copyScriptWithReplace= function(readfile,writefile)
{
	if (readfile.exists && readfile.name.match(/\.ps$/i)){
		var myOpenfile = new File(readfile.fsName);
		myOpenfile.open("r");
		myContent = myOpenfile.read();
//alert(myContent);
		if (writefile && writefile.name.match(/\.eps$/i)){
			var myWritefile = new File(writefile.fsName);
			myWritefile.open("w");
			myWritefile.write(this.pathReplace(myContent));
			myWritefile.close();
		}else{	return false    }
		return true;
	}else {
		return false;
	};
}

//保存パス作成　引数がなければ現在のライブラリのフレームフォルダに書き加える。
//
	nas_buildFrame.saveFile= new File( nas_buildFrame.savePath+"/"+
					nas_buildFrame.baseWidth.toString()+"mm"+
					nas_buildFrame.aspectW+"x"+
					nas_buildFrame.aspectH+".eps");//
                    
function updateName(){
	nas_buildFrame.saveFile= new File( nas_buildFrame.savePath+"/"+
					nas_buildFrame.baseWidth.toString()+"mm"+
					nas_buildFrame.aspectW+"x"+
					nas_buildFrame.aspectH+".eps");//
     nas_buildFrame.w.etxName.text=nas_buildFrame.saveFile.name;
 }
//条件が成立していたらUI表示して編集可能に
	if(true){
		nas_buildFrame.w=new Window(
			"dialog",
			"フレームデータを保存します。",
			[240,240,240+colUnit*5+leftMargin+rightMargin,240+lineUnit*6+topMargin+bottomMargin]
		);
		  nas_buildFrame.w.etxSP=nas_buildFrame.w.add("staticText",nasGrid(0,0,4,1),nas_buildFrame.savePath);
		  nas_buildFrame.w.etxName=nas_buildFrame.w.add("editText",nasGrid(0,1,4,1),nas_buildFrame.saveFile.name);
		  nas_buildFrame.w.chgSP=nas_buildFrame.w.add("button",nasGrid(4,1,1,1),"Save");

		  nas_buildFrame.w.lblBW=nas_buildFrame.w.add("staticText",nasGrid(0,2,1,1),"Width(mm)");
		  nas_buildFrame.w.etxBW=nas_buildFrame.w.add("editText",nasGrid(1,2,1,1),nas_buildFrame.baseWidth);
		  nas_buildFrame.w.pfxBW=nas_buildFrame.w.add("staticText",nasGrid(2,2,1,1),"mm");

		  nas_buildFrame.w.lblFA=nas_buildFrame.w.add("staticText",nasGrid(0    ,3,1,1     ),"Aspect(W:H)");
		  nas_buildFrame.w.etxAW=nas_buildFrame.w.add("editText",nasGrid(1    ,3,1,1     ),nas_buildFrame.aspectW);
		  nas_buildFrame.w.lblAT=nas_buildFrame.w.add("staticText",nasGrid(2     ,3,.25,1  ),":");
		  nas_buildFrame.w.etxAH=nas_buildFrame.w.add("editText",nasGrid(2.25 ,3,1,1     ),nas_buildFrame.aspectH);

           nas_buildFrame.w.lblPO=nas_buildFrame.w.add("staticText",nasGrid(0,4,1,1),"Pegbar offset");
		  nas_buildFrame.w.etxPY=nas_buildFrame.w.add("editText",nasGrid(1,4,1,1),nas_buildFrame.pegOffsetY);
		  nas_buildFrame.w.lblPY=nas_buildFrame.w.add("staticText",nasGrid(2,4,.5,1),"mm");

           nas_buildFrame.w.memo=nas_buildFrame.w.add("staticText",nasGrid(2,6,4,1),"*[esc] key for exit");
/*
		  nas_buildFrame.w.etxPX=nas_buildFrame.w.add("editText",nasGrid(1,4,1,1),nas_buildFrame.pegOffsetX);
		  nas_buildFrame.w.lblPX=nas_buildFrame.w.add("staticText",nasGrid(2,4,.5,1),"mm");
//		  nas_buildFrame.w.etxPR=nas_buildFrame.w.add("editText",nasGrid(3,4,1,1),nas_buildFrame.pegOffsetR);
*/
        nas_buildFrame.w.etxBW.onChange=function(){
            if(this.text!=nas_buildFrame.baseWidth){
                nas_buildFrame.baseWidth=(this.text*1);
                updateName();
            }
        }
        nas_buildFrame.w.etxAW.onChange=function(){
            if(this.text!=nas_buildFrame.aspectW){
                nas_buildFrame.aspectW=(this.text*1);
                updateName();
            }
        }
        nas_buildFrame.w.etxAH.onChange=function(){
            if(this.text!=nas_buildFrame.aspectH){
                nas_buildFrame.aspectH=(this.text*1);
                updateName();
            }
        }
        nas_buildFrame.w.etxPY.onChange=function(){
            if(this.text!=nas_buildFrame.pegOffsetY){
                nas_buildFrame.pegOffsetY=(this.text*1);
                updateName();
            }
        }
    nas_buildFrame.w.chgSP.onClick=function(){
        //保存ターゲットが、すでに存在するなら警告
        var doSave=true;
        if(nas_buildFrame.saveFile.exists){
	　   doSave=confirm(nas_buildFrame.saveFile.fullName+"\nが、すでにあります。上書き保存して良いですか？",true,"ファイル保存")
        }
        if(doSave){
            nas_buildFrame.baseWidth+=" mm";
            nas_buildFrame.pegOffsetY+=" mm";
            nas_buildFrame.copyScriptWithReplace(nas_buildFrame.sourceFile,nas_buildFrame.saveFile);
            this.parent.close();
        }
//           alert(nas_buildFrame.sourceFile +">>>"+ nas_buildFrame.saveFile+"\n"+doSave);
 
    }


/*
*/
		nas_buildFrame.w.show();
	}


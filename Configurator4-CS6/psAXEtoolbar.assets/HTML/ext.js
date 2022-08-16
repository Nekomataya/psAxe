/*	 paAxe ver 1.0 1.1 共用　extension html start-up scrpt 2015 06-29
	psAxe ver 1.1.5  用にチューニング　2016 02-04
CC以降のHTML CEP環境とそれ以前のCSX環境を見分けるために window.__adobe_cep__オブジェクトの有無をチェックする
このスクリプトはCS6-CS2015エクステンション共用
psAxe ToolBar用

*/
var extVer="1.1.0";//バージョンごとにこの値を書き換えること
var isCEP={};
alert(appHost.platform);
try{ isCEP=(window.__adobe_cep__)?true:false;}catch(er){isCEP = false;}

var eVentCount=0;
function onLoaded(){
	chgTooltip(false);
	chgPnl(0);//メニューバーの初期化
	if(isCEP) {
//CEP環境用
    var csInterface =new CSInterface();

    var appName = csInterface.hostEnvironment.appName;

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
    psHtmlDispatch();//再ロード抑制
	}else{
    document.getElementById('LLSelector').style.display="none";//CSX環境で使用不能なドロップダウンリストを非表示にする
    addEventListener('ThemeChangedEvent', onAppThemeColorChanged);
    //CSX環境では戻り値は無い CSX環境では起動時にテーマチェンジイベントが発生するがCEP環境では初回イベントは無い模様
    // Define event handler
	}
//　extensionVersionをライブラリに設定
	doScript('app.nas.Version.psAxeToolbar="psAxeToolbar:'+extVer+'";');//バージョントレーラーにエクステンションバージョンを設定
//	chgTab("PTHhandle");//tab初期化
	applyHostLocale();//locale取得して反映

if(extVer>="1.1.0"){applyHostProp();}//プロパティ初期化
}

/*======= パネルの再ロードを抑制する ==========*/
function psHtmlDispatch(){
	var event = new CSEvent();
	event.type = "com.adobe.PhotoshopPersistent";
	event.scope = "APPLICATION";
	event.extensionId = window.__adobe_cep__.getExtensionId();
	new CSInterface().dispatchEvent(event);
}
/*=======================================*/
/*	ホストアプリケーションのロケールを取得して画面に反映させる	*/
function applyHostLocale(){
 if(isCEP){
	evalScript('getApplicationResult("app.nas.locale");',function(myLocale){nas.LangPack.chgLocale(myLocale)}); 	
 }else{
	var myLocale=getApplicationResult('app.nas.locale');nas.LangPack.chgLocale(myLocale);
 }
//	adjustSpacer();
}
/*	インターフェース上のスイッチで初期化の必要な物を初期化する	*/
function syncProp(){
 if(isCEP){
	 evalScript('if((typeof app.nas !="undefined")){getApplicationResult([app.nas.axe.skipFrames,app.nas.axe.useOptKey,app.nas.axe.focusMove,app.nas.axeCMC.getAnimationMode()])}else{getApplicationResult(false)}',function(currentStatus){
		 if(! currentStatus){return false}
		 myStatus=currentStatus.split(",");
	document.getElementById("moveSpanDuration").value=nas.Frm2FCT(myStatus[0],3,0);
	document.getElementById("vtUseOpt").innerHTML=(myStatus[1])? "o":"✓";
	document.getElementById("vtFocus").innerHTML  =(myStatus[2])? "f":"✓";
	if(myStatus[3]=="timelineAnimation"){
		document.getElementById("vtControl").style.display="inline";document.getElementById("afControl").style.display="none";
	}else{
	document.getElementById("vtControl").style.display="none";document.getElementById("afControl").style.display="inline";
	}
	 });
 }else{
	 if(getApplicationResult('(typeof app.nas=="undefined")')) return false;
document.getElementById("moveSpanDuration").value=nas.Frm2FCT(getApplicationResult("app.nas.axe.skipFrames"),3,0);
document.getElementById("vtUseOpt").innerHTML=(getApplicationResult("app.nas.axe.useOptKey"))? "o":"✓";
document.getElementById("vtFocus").innerHTML  =(getApplicationResult("app.nas.axe.focusMove"))? "f":"✓";
var myMode=getApplicationResult("if((app.documents.length)&&(app.activeDocument)){app.nas.axeCMC.getAnimationMode()}else{false}");
if(myMode=="timelineAnimation"){
	document.getElementById("vtControl").style.display="inline";document.getElementById("afControl").style.display="none";
}else{
	document.getElementById("vtControl").style.display="none";document.getElementById("afControl").style.display="inline";
}
 }
}
/*=======================================*/
/*	ホストアプリケーションのインストール状態を取得して可能ならプロパティの同期を行う*/
function applyHostProp(){
 if(isCEP){
	evalScript('getApplicationResult("app.nas.libNotInstalled");',function(myResult){if(! myResult){syncProp();}}); 	
 }else{
	var myNoInstall=getApplicationResult('app.nas.libNotInstalled');if(! myNoInstall){syncProp();};
 }
}
/*=======================================*/
	if(isCEP){
/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
//eVentCount++;
    //Update the background color of the panel
// alert( appSkinInfo.panelBackgroundColor); //CEPではcolorプロパティを持ったオブジェクトが来る
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
//    document.body.bgColor = toHex(panelBackgroundColor);
    document.body.style.backgroundColor = toHex(panelBackgroundColor);
    document.body.style.color=reverseColor(appSkinInfo.panelBackgroundColor.color);

//document.getElementById("resultBox").innerHTML+=nas.colorStr2Ary(document.body.style.backgroundColor)+"\n";
if(nas.colorStr2Ary(document.body.style.backgroundColor)[1]<0.5){
document.styleSheets[1].addRule(".iconButton","background-image:url(images/nas-ui-icons432x432px.png);");
//document.getElementById("psAxeLogo").src="images/psAxe.png";
	}else{
document.styleSheets[1].addRule(".iconButton","background-image:url(images/nas-ui-icons432x432pxIVS.png);");
//document.getElementById("psAxeLogo").src="images/psAxeIVS.png";
	}

//    document.styleSheets[1].addRule("#fixedHeader","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");

    document.styleSheets[1].addRule(".iconButton","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
    document.styleSheets[1].addRule("button.fw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
    document.styleSheets[1].addRule("button.hw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
    document.styleSheets[1].addRule("button.qw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
    document.styleSheets[1].addRule("A","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
}
	} else {
//for CSX
function updateThemeWithAppSkinInfoCSX(appSkinInfo) {
//eVentCount++;
// change the content to match the current scheme
// alert( appSkinInfo.panelBackgroundColor); CSXでは１６進文字列（＃なし）が来る

document.body.style.backgroundColor = "#"+appSkinInfo.panelBackgroundColor;
document.body.style.color=reverseColor(Hex2Color(appSkinInfo.panelBackgroundColor));

//document.getElementById("resultBox").innerHTML+=nas.colorStr2Ary("#"+document.body.bgColor)[1]+"\n";
if(nas.colorStr2Ary(document.body.style.backgroundColor)[1]<0.5){
document.styleSheets[1].addRule(".iconButton","background-image:url(images/nas-ui-icons432x432px.png);");
//document.getElementById("psAxeLogo").src="images/psAxe.png";
	}else{
document.styleSheets[1].addRule(".iconButton","background-image:url(images/nas-ui-icons432x432pxIVS.png);");
//document.getElementById("psAxeLogo").src="images/psAxeIVS.png";
	}
//document.styleSheets[1].addRule("#fixedHeader","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");

document.styleSheets[1].addRule(".iconButton","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[1].addRule("button.fw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[1].addRule("button.hw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[1].addRule("button.qw","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[1].addRule("A","background-color:"+document.body.style.backgroundColor+";color:"+document.body.style.color+";");
}
updateThemeWithAppSkinInfo=updateThemeWithAppSkinInfoCSX;
	};

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
  //  if(!(stylesheet instanceof CSSStyleSheet)){stylesheet = document.styleSheets[1]};

    if (stylesheet) {
        stylesheet = stylesheet.sheet;
           if( stylesheet.addRule ){
               stylesheet.addRule(selector, rule);
           } else if( stylesheet.insertRule ){
               stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
           }
    }
}


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return "#" + hex;
}

function onAppThemeColorChanged(event) {
//alert("changed");
    // Should get a latest HostEnvironment object from application.
	if(isCEP){
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
	}else{
    // for CSX
    var skinInfo = event.appSkinInfo;
	}
    updateThemeWithAppSkinInfo(skinInfo);
}

/*	画面サイズの変更時等にシートボディのスクロールスペーサーを調整する
	固定ヘッダとフッタの高さをスクロールスペーサーと一致させる
	2010.08.28
	引数なし
 */
function adjustSpacer() {
    var headHeight=document.getElementById("fixedHeader").clientHeight;
    var myOffset=0;
	document.getElementById("scrollSpaceHd").style.height=(headHeight-myOffset)+"px";
}
/*
Hex2Color(hexString);

	result RGBcolorObject

シンプルなカラーオブジェクトを返す関数を書く
引数はhex形式の文字列"#"ありと無しを両方受け取る
返すものは無名のカラーオブジェクト0-255で正規化した　abgrオブジェクト
無効な引数が入った場合は、無条件で {"alpha":255,"green":0,"blue":0,"red":0} を返す
アルファチャンネルは常に255(=1.0)を返す　指定はできない

*/

function Hex2Color(hexString){
  hexString=(hexString.toString().replace(/[^0123456789ABCDEF]/ig,"")+"000000");
return {"alpha":255,"green":parseInt(hexString.slice(2,4),16),"blue":parseInt(hexString.slice(4,6),16),"red":parseInt(hexString.slice(0,2),16)};
}


	if(isCEP){
/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}

function onClickButton(ppid) {
    if(ppid == "FLPR"){
    	var jsfl = 'fl.createDocument(); fl.getDocumentDOM().addNewText({left:100, top:100, right:300, bottom:300} , "Hello Flash!" ); ';
    	evalScript(jsfl);
    } else {
    	var extScript = "$._ext_" + ppid + ".run()";
		evalScript(extScript);
	}
}

	}
/**
 * in psAxe common function
 * 
 * 
 * 
 * 
 * 
 */
// doAxeScript(scriptFileName,arg) 第二オプションは引数配列
function doAxeScript(myName,myArg){
	if(!(myArg==void(0))&&(!(myArg instanceof Array))){myArg=[myArg];}
	
	if(isCEP){
    var csInterface = new CSInterface();
    var axeRoot = csInterface.getSystemPath(SystemPath.USER_DATA) + "/nas/scripts/axe/";
		if(myArg){
    csInterface.evalScript('arguments='+JSON.stringify(myArg)+';$.evalFile("'+axeRoot+myName+'.jsx")');//引数あり
		}else{
    csInterface.evalScript('$.evalFile("'+axeRoot+myName+'.jsx")');//引数なし
		}
	}else{
    var myLocation='Folder.userData.fullName+ "/nas/scripts/axe/';
		if(myArg){
    _AdobeInvokeScript('arguments='+JSON.stringify(myArg)+';$.evalFile('+myLocation+myName+'.jsx");');//引数あり
		}else{
    _AdobeInvokeScript('$.evalFile('+myLocation+myName+'.jsx");');//引数なし
		}
	}
}

function doScript(cmd){
	if(isCEP){
    new CSInterface().evalScript(cmd, null);
	}else{
    _AdobeInvokeScript(cmd);
	}
}

function doCurrentScript(myName){
	if(isCEP){
    new CSInterface().evalScript(myName+".jsx", null);
	}else{
    _AdobeInvokeScriptFile(myName+ ".jsx");
	}
}

afcSetDly=function(myTime){
var myExpression='';
myExpression += 'var desc = new ActionDescriptor();';
myExpression += 'var ref = new ActionReference();';
myExpression += 'ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" )  );';
myExpression += 'desc.putReference( charIDToTypeID( "null" ), ref );';
myExpression += 'var desc2 = new ActionDescriptor();';
myExpression += 'desc2.putDouble( stringIDToTypeID( "animationFrameDelay" ) ,'
myExpression += myTime.toString(); 
myExpression +=' );';
myExpression += 'desc.putObject( charIDToTypeID( "T   " ), stringIDToTypeID( "animationFrameClass" ), desc2 );';
myExpression += 'executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );';

	doScript(myExpression);
}

//ツール切替コマンド
function chgTool(myCommand){
	if(! myCommand){return false};
//alert(myCommand);
var myEx='ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try{';

switch (myCommand){
//ツール切り換え(CharID)
case "PcTl":
case "PbTl":
case "ErTl":
case "GrTl":
myEx+=' var idslct = charIDToTypeID( "slct" );'
myEx+="     var desc = new ActionDescriptor();";
myEx+=' var idNull = charIDToTypeID( "null" );';
myEx+="       var ref = new ActionReference();";
myEx+='       var idTl = charIDToTypeID("';
myEx+= myCommand;
myEx+='" );'
myEx+="        ref.putClass( idTl );";
myEx+="    desc.putReference( idNull, ref );";
myEx+='	executeAction( idslct, desc, DialogModes.NO );';
//myEx+='	executeAction( charIDToTypeID( "slct" ), desc, DialogModes.ALL );';

break;
//ツール切り換え(StringID)
case "moveTool":
case "rotateTool":
case "bucketTool":
case "marqueeRectTool":
case "marqueeEllipTool":
case "lassoTool":
case "magicWandTool":
case "rulerTool":

case "penTool":
case "freeformPenTool":
case "addKnotTool":
case "deleteKnotTool":
case "convertKnotTool":
case "directSelectTool":
case "quickSelectTool":
case "pathComponentSelectTool":
default:
myEx+=' var idslct = charIDToTypeID( "slct" );'
myEx+='    var desc = new ActionDescriptor();';
myEx+=' var idNull = charIDToTypeID( "null" );';
myEx+='      var ref = new ActionReference();';
myEx+='       var idTool = stringIDToTypeID( "';
myEx+= myCommand;
myEx+='" );';
myEx+='               ref.putClass( idTool );';
myEx+='     desc.putReference( idNull, ref );';
myEx+='var iddontRecord = stringIDToTypeID( "dontRecord" );'
myEx+='desc.putBoolean( iddontRecord, true );'
myEx+='var idforceNotify = stringIDToTypeID( "forceNotify" );'
myEx+='desc.putBoolean( idforceNotify, true );'
myEx+='executeAction( idslct, desc, DialogModes.NO );';
break;
}
myEx+='} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};';

	doScript(myEx);
};

//ツール切替部分を抽出

function doPref(){
	if(isCEP){
    var csInterface = new CSInterface();
    var myPref = csInterface.getSystemPath(SystemPath.USER_DATA) + "/nas/scripts/nasPrefPs.jsx";
    csInterface.evalScript('$.evalFile("' + myPref + '")');
	}else{
    var myPref='Folder.userData.fullName+ "/nas/scripts/nasPrefPs.jsx"';
    doScript('$.evalFile('+myPref+');');
	}
}

function doInstall(){
	if(isCEP){
    var csInterface = new CSInterface();
    var myInstall = csInterface.getSystemPath(SystemPath.EXTENSION) + "/psAxeInstall/scripts/psAxeSplash.jsx";
    csInterface.evalScript('$.evalFile("' + myInstall + '")');	
	}else{
    doCurrentScript("HTML/psAxeInstall/scripts/psAxeSplash");
	}
}
//アクティブレイヤ名からラベル部分を抽出して返す 戻り値が無いのでCEP環境のみで有効
	if(isCEP){
function getCurrentLabel(currentName){
    var csInterface = new CSInterface();
    var myLayerName=currentName;
	csInterface.evalScript('(function(result){return result;})((app.documents.length)?app.activeDocument.activeLayer.name:"=no document=");' , function(layerName){document.getElementById('myLabel').value =  layerName;});
	return myLayerName;
}
	}else{
function getCurrentLabelCSX(currentName){
	if(_Adobe){
		currentName=_Adobe.JSXInterface.call("eval","app.activeDocument.activeLayer.name");
	}
	document.getElementById('myLabel').value =  currentName;
}
getCurrentLabel=getCurrentLabelCSX;
	}
//ラベルをレイヤ及びレイヤセットに設定する
function setLabel(myLabel,myOption){
    switch (myOption){
case "swap":
case "selection":
case "auto":
	doAxeScript("setLabel",[myLabel,myOption]);	
break;
case "add":
	var myScript = 'app.activeDocument.activeLayer.name+="'+myLabel+'"';
	doScript(myScript);	
break;
case "remove":
	var myScript = 'if(app.activeDocument.activeLayer.name.match(/(.*)\\'+myLabel+'$/)){app.activeDocument.activeLayer.name=RegExp.$1;}';
	doScript(myScript);	
break;
default :
	doScript('(function(myLabel){if((app.documents.length)&&(app.activeDocument.activeLayer.name!=myLabel))app.activeDocument.activeLayer.name=myLabel})("'+myLabel+'");');
    }
}
if(! isCEP){
//CSX(-CS6)専用アプリケーションエンジンのリザルト取得関数
function getApplicationResult(myProp){return _Adobe.JSXInterface.call("eval",myProp)}
}

//UIパネル切替部分

var pnlCount=5;//パネルの数
var myID=0;
/*
	パネル切替操作をタブ形式に変更する
	現在セレクトされているタブの以外の背景をグレーにする
 */
chgPnl=function(kwd){
	if(! kwd){kwd="0"}
	switch(kwd){
case	"next":myID=(myID+1)%pnlCount;
	break;
case	"back":myID=(myID-1)%pnlCount;
	break;
case	"frst":myID=0;
	break;
case	"end":myID=pnlCount-1;
	break;
default	: myID=parseInt(kwd);if(myID===NaN){myID=0};myID=myID%pnlCount
	}
	for (pnlID=0;pnlID<pnlCount;pnlID++){
		if (pnlID==myID){
			document.getElementById("pnl"+pnlID).style.display="inline";
			document.getElementById("pnlChg"+pnlID).style.backgroundColor=document.body.style.backgroundColor;
		}else{
			document.getElementById("pnl"+pnlID).style.display="none";
			document.getElementById("pnlChg"+pnlID).style.backgroundColor="gray";
		}
	}
	if(kwd=="0"){syncProp()}
}

//UIタブメニュー切替部分
/*タブメニューは排他　ただし[ctrl]同時押しで単独操作可能*/
var myTabID=[["PTHhandle","path"],["FRMhandle","preview"],["XPShandle","xps"],["LNMhandle","layerName"],["LYRhandle","documents"],["TRChandle","trace"],["DBGCons","debug"]];
//var myTabID=[["PTHhandle","path"],["FRMhandle","preview"],["LNMhandle","layerName"],["LYRhandle","documents"],["TRChandle","trace"],["DBGCons","debug"]];

chgTab=function(kwd){
	if (!kwd) return;
if(event.shiftKey){
//単独操作
	var myTarget=document.getElementById(kwd);
	var myTargetButton=event.target;
	if(myTarget.style.display=="none"){
	    myTarget.style.display="inline";
	    myTargetButton.style.backgroundColor="gray";
	}else{
	    myTarget.style.display="none";
	    myTargetButton.style.backgroundColor=document.body.style.backgroundColor;
	}
}else{
    for(var hID=0;hID<myTabID.length;hID++){
	var myTarget=document.getElementById(myTabID[hID][0]);
	var myTargetButton=document.getElementById("buttonTab_"+myTabID[hID][1]);
//トグル操作
	if(kwd==myTabID[hID][0]){
		if(myTarget.style.display=="none") myTarget.style.display="inline";		
//		if(myTargetButton.style.backgroundColor=="black") 
myTargetButton.style.backgroundColor="gray";		
//myTargetButton.disabled=true;
	}else{
		if(myTarget.style.display=="inline") myTarget.style.display="none";		
//		if(myTargetButton.style.backgroundColor=="gray") 
myTargetButton.style.backgroundColor=document.body.style.backgroundColor;		
//myTargetButton.disabled=false;
	}
    }
}
	if(kwd=="FRMhandle"){syncProp()}
}
/*	chgTooltip(status)
//	ツールチップ表示切替
*/
var myTooltip=true;
// ツールチップ初期化
/*	effect: "fade",          // エフェクト
	fadeOutSpeed: "fast",    // フェードアウト速度
	predelay: 3000,
        delay:300,
*/
    $( function() {
var myToolTips=["#pnl0","#pnl1","#pnl2","#pnl3","#pnl4",];
for (var tid=0;tid<myToolTips.length;tid++){
        $(myToolTips[tid]).tooltip( {
        position: {
            my: "center top",
            at: "center bottom",
            track:true,
        }
    } );
 }
    } );

function chgTooltip(status){
	if(typeof(status)=="undefined") status=(myTooltip)?false:true;
   if(status){
    $( function() {
var myToolTips=["#pnl0","#pnl1","#pnl2","#pnl3","#pnl4",];
for (var tid=0;tid<myToolTips.length;tid++){
        $(myToolTips[tid]).tooltip({disabled:false});
 }
    } );
    document.getElementById("tltp").style.backgroundColor="#808080";
    myTooltip=true;
   }else{
    $( function() {
var myToolTips=["#pnl0","#pnl1","#pnl2","#pnl3","#pnl4",];
for (var tid=0;tid<myToolTips.length;tid++){
        $(myToolTips[tid]).tooltip({disabled:true});
 }
    } );
    document.getElementById("tltp").style.backgroundColor=document.body.style.backgroundColor;
    myTooltip=false;
   }
 return myTooltip;
}
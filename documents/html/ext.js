//CS2014以降のHTML CEP環境とそれ以前のCSX環境を見分けるために window.__adobe_cep__オブジェクトの有無をチェックする
//このスクリプトはCS6-CS2014エクステンション共用
var isCEP={};
try{ isCEP=(window.__adobe_cep__)?true:false;}catch(er){isCEP = false;}

function onLoaded(){
	if(isCEP) {
//CEP環境用
    var csInterface =new CSInterface();

    var appName = csInterface.hostEnvironment.appName;

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	}else{
//    chgPnl(0);//メニューバーの初期化
    document.getElementById('LLSelector').style.display="none";//CSX環境で使用不能なドロップダウンリストを非表示にする
    addEventListener('ThemeChangedEvent', onAppThemeColorChanged);
    //CSX環境では戻り値は無い CSX環境では起動時にテーマチェンジイベントが発生するがCEP環境では初回イベントは無い模様
    // Define event handler

	}
}


	if(isCEP){
/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);
        
    document.body.style.color=reverseColor(appSkinInfo.panelBackgroundColor);

    document.styleSheets[0].addRule("button.fw","background-color:#"+document.body.bgColor+";color:"+document.body.style.color+";");
    document.styleSheets[0].addRule("button.hw","background-color:#"+document.body.bgColor+";color:"+document.body.style.color+";");
    document.styleSheets[0].addRule("button.qw","background-color:#"+document.body.bgColor+";color:"+document.body.style.color+";");
    document.styleSheets[0].addRule("A","background-color:#"+document.body.bgColor+";color:"+document.body.style.color+";");
}
	} else {
//for CSX
function updateThemeWithAppSkinInfoCSX(appSkinInfo) {
// change the content to match the current scheme
document.body.bgColor=appSkinInfo.panelBackgroundColor;
document.body.style.color=reverseColor(Hex2Color(appSkinInfo.panelBackgroundColor));

document.styleSheets[0].addRule("button.fw","background-color:#"+appSkinInfo.panelBackgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[0].addRule("button.hw","background-color:#"+appSkinInfo.panelBackgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[0].addRule("button.qw","background-color:#"+appSkinInfo.panelBackgroundColor+";color:"+document.body.style.color+";");
document.styleSheets[0].addRule("A","background-color:#"+appSkinInfo.panelBackgroundColor+";color:"+document.body.style.color+";");
}
updateThemeWithAppSkinInfo=updateThemeWithAppSkinInfoCSX;
	};



function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
  //  if(!(stylesheet instanceof CSSStyleSheet)){stylesheet = document.styleSheets[0]};

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

function doScript(cmd,myArg){
	if(!(myArg===void(0))&&(!(myArg instanceof Array))){myArg=[myArg];}

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

function getApplicationResult(myProp){return _Adobe.JSXInterface.call("eval",myProp)}


//UIパネル切替部分

var pnlCount=4;//パネルの数
var myID=0;

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
		}else{
			document.getElementById("pnl"+pnlID).style.display="none";
		}
	}
}
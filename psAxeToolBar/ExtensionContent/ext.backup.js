
function onLoaded() {
    var csInterface = new CSInterface();
	
    
    var appName = csInterface.hostEnvironment.appName;
    if(appName != "FLPR"){
    	loadJSX();
    }    
    
    var appNames = ["PHXS"];
    for (var i = 0; i < appNames.length; i++) {
        var name = appNames[i];
        if (appName.indexOf(name) >= 0) {
           var btn = document.getElementById("btn_" + name);
           if (btn)
                btn.disabled = false;
        }
    }
    

    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	
}



/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
	
    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);
        
    var styleId = "ppstyle";
    
    var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
    
    if(appName == "PHXS"){
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", "border-radius:3px;");
	}
	if(appName == "PHXS" || appName == "PPRO" || appName == "PRLD") {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// NOTE: Below theme related code are only suitable for Photoshop.                            //
		// If you want to achieve same effect on other products please make your own changes here.    //
		////////////////////////////////////////////////////////////////////////////////////////////////
		
	    
	    var gradientBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
	    var gradientDisabledBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
	    var boxShadow = "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
	    var boxActiveShadow = "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";
	    
	    var isPanelThemeLight = panelBackgroundColor.red > 127;
	    var fontColor, disabledFontColor;
	    var borderColor;
	    var inputBackgroundColor;
	    var gradientHighlightBg;
	    if(isPanelThemeLight) {
	    	fontColor = "#000000;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -90) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, 54) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
	    } else {
	    	fontColor = "#ffffff;";
	    	disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
	    	borderColor = "border-color: " + toHex(panelBackgroundColor, -45) + ";";
	    	inputBackgroundColor = toHex(panelBackgroundColor, -20) + ";";
	    	gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
	    }
	    
	
	    //Update the default text style with pp values
	    
	    addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
	    addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);    
	    addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
	    addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
	    addRule(styleId, "[disabled]", gradientDisabledBg);
	    addRule(styleId, "[disabled]", disabledFontColor);
	    addRule(styleId, "input[type=text]", "padding:1px 3px;");
	    addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor) + ";";
	    addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
	    addRule(styleId, "input[type=text]:focus", "color: #000000;");
	    
	} else {
		// For AI, ID and FL use old implementation	
		addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + reverseColor(panelBackgroundColor) + "; background-color:" + toHex(panelBackgroundColor, 20));
	    addRule(styleId, "button", "border-color: " + toHex(panelBgColor, -50));
	}
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
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
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 



    
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


/**
 * psAXe is 
 * 
 * 
 * 
 * 
 * 
 */
// doAxeScript(scriptFileName)
function doAxeScript(myName){
    var csInterface = new CSInterface();
    var axeRoot = csInterface.getSystemPath(SystemPath.USER_DATA) + "/nas/scripts/axe/";
    csInterface.evalScript('$.evalFile("'+axeRoot+myName+'.jsx")');
}

function doScript(cmd){
	new CSInterface().evalScript(cmd, null);
}

function doCurrentScript(myName){
	new CSInterface().evalScript(myName+".jsx", null);
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

	new CSInterface().evalScript(myExpression, null);
}

//ツール切替コマンド
function chgTool(myCommand){
	if(! myCommand){return false};

var myEx='ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try{';

switch (myCommand){
//ツール切り換え(CharID)
case "PcTl":
case "ErTl":
myEx+="     var desc = new ActionDescriptor();";
myEx+=' var idNull = charIDToTypeID( "null" );';
myEx+="       var ref = new ActionReference();";
myEx+='       var idTl = charIDToTypeID("';
myEx+= myCommand;
myEx+='" );'
myEx+="        ref.putClass( idTl );";
myEx+="    desc.putReference( idNull, ref );";
myEx+='	executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );';

break;
//ツール切り換え(StringID)
case "moveTool":
case "rotateTool":
case "bucketTool":
case "marqueeRectTool":
case "lassoTool":
case "magicWandTool":
case "rulerTool":

case "penTool":
case "freeformPenTool":
case "addKnotTool":
case "deleteKnotTool":
case "convertKnotTool":
case "directSelectTool":
case "pathComponentSelectTool":
default:
myEx+='    var desc = new ActionDescriptor();';
myEx+=' var idNull = charIDToTypeID( "null" );';
myEx+='      var ref = new ActionReference();';
myEx+='       var idTool = stringIDToTypeID( "';
myEx+= myCommand;
myEx+='" );';
myEx+='               ref.putClass( idTool );';
myEx+='     desc.putReference( idNull, ref );';
myEx+='executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );';
break;
}
myEx+='} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};';
	new CSInterface().evalScript(myEx, null);

};

//ツール切替部分を抽出

function doPref(){
    var csInterface = new CSInterface();
    var myPref = csInterface.getSystemPath(SystemPath.USER_DATA) + "/nas/scripts/nasPrefPs.jsx";
    csInterface.evalScript('$.evalFile("' + myPref + '")');
}

function doInstall(){
    var csInterface = new CSInterface();
    var myInstall = csInterface.getSystemPath(SystemPath.EXTENSION) + "/psAxeInstall/scripts/psAxeSplash.jsx";
    csInterface.evalScript('$.evalFile("' + myInstall + '")');	
}

//アクティブレイヤ名からラベル部分を抽出して返す
function getCurrentLabel(currentName){
    var csInterface = new CSInterface();
    var myLayerName=currentName;
	csInterface.evalScript('(function(result){return result;})((app.documents.length)?app.activeDocument.activeLayer.name:"=no document=");' , function(layerName){document.getElementById('myLabel').value =  layerName;});
	return myLayerName;
}
//ラベルをレイヤ及びレイヤセットに設定する
function setLabel(myLabel,myOption){
    var csInterface = new CSInterface();

    
    switch (myOption){
case "swap":
case "selection":
case "auto":
    var myScript = csInterface.getSystemPath(SystemPath.USER_DATA) + "/nas/scripts/axe/setLabel.jsx";
    csInterface.evalScript('arguments=["'+myLabel+'","'+myOption+'"];$.evalFile("' + myScript + '");');	
break;
case "add":
	var myScript = 'app.activeDocument.activeLayer.name+="'+myLabel+'"';
	csInterface.evalScript(myScript);	
break;
case "remove":
	var myScript = 'if(app.activeDocument.activeLayer.name.match(/(.*)\\'+myLabel+'$/)){app.activeDocument.activeLayer.name=RegExp.$1;}';
	csInterface.evalScript(myScript);	
break;
default :
	csInterface.evalScript('(function(myLabel){if(app.activeDocument.activeLayer.name!=myLabel)app.activeDocument.activeLayer.name=myLabel})("'+myLabel+'");');
}
    


}

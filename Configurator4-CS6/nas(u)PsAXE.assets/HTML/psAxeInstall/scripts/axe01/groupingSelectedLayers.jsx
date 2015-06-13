/*
	選択レイヤをグループ化してプロパティウインドウを呼び出す
*/
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
//=========================== レイヤからグループ
 var id1010 = stringIDToTypeID( "groupLayersEvent" );
 var desc190 = new ActionDescriptor();
 var id1011 = charIDToTypeID( "null" );
 var ref149 = new ActionReference();
 var id1012 = charIDToTypeID( "Lyr " );
 var id1013 = charIDToTypeID( "Ordn" );
 var id1014 = charIDToTypeID( "Trgt" );
 ref149.putEnumerated( id1012, id1013, id1014 );
 desc190.putReference( id1011, ref149 );
 executeAction( id1010, desc190, DialogModes.NO ); 
 //===========================グルーピングされたレイヤから名前を推測して変更
 var myLayers=app.activeDocument.activeLayer;
 var myName=myLayers.layers[0].name.replace(/[-_\ ]?[0-9]*$/,"");
 myLayers.name=myName;
 //===========================レイヤプロパティを呼び出す
/*
CS6以降　レイヤプロパティが呼べない様なので自前のウインドウでリネームを行う
リネームなしの版も考慮
また　プロパティ様のUIはライブラリに編入したほうが良いかも

promptのほうがコーディング早そう…

 var id1030 = charIDToTypeID( "slct" );
 var desc194 = new ActionDescriptor();
 var id1031 = charIDToTypeID( "null" );
 var ref153 = new ActionReference();
 var id1032 = charIDToTypeID( "Mn  " );
 var id1033 = charIDToTypeID( "MnIt" );
 var id1034 = charIDToTypeID( "LyrO" );
 ref153.putEnumerated( id1032, id1033, id1034 );
 desc194.putReference( id1031, ref153 );
 executeAction( id1030, desc194, DialogModes.ALL ); 
*/
//"レイヤ名を確認してください。"
var newName=prompt(nas.localize(nas.uiMsg.confirmLayerName),myLayers.name,"change Name?");

if((newName!=myName)&&(newName)&&(newName.length)){myLayers.name=newName};

} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}


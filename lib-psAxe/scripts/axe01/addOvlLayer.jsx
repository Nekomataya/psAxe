/*
	アクティブレイヤの上に修正（注釈）用レイヤをつける
	
動画番号を更新しないで注釈ポストフィックスを加える
用紙色は、指定パラメータを設ける
*/

	var nas=app.nas;

//add newLayer for animation drawing
//記録してある色と背景色を照合して、異なっていたら背景色を変更
var myColor=new SolidColor();
	myColor.rgb.red  =Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][0]*255);
	myColor.rgb.green=Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][1]*255);
	myColor.rgb.blue =Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][2]*255);
if (app.backgroundColor!=myColor){app.backgroundColor=myColor};//背景色変更はUNDO対象外
	myColor.opacity  =Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][3]*100);
//新規レイヤ追加して
var currentLayer=app.activeDocument.activeLayer;
var newName=currentLayer.name+"+";
//名前に番号がない場合は01を付加する
//if(newName.match(/^\D+$/)){newName+="001";};
var wasFold=(
 (app.activeDocument.activeLayer.parent.typename=="Document") &&
 (app.activeDocument.activeLayer.typename=="LayerSet")
 )?true:false;
var myDocLayers=(wasFold)?app.activeDocument.activeLayer:app.activeDocument.activeLayer.parent;
//	新規修正レイヤ作成
var myUndoStr=nas.localize(nas.uiMsg["addNewOvl"]);
var myExcute="";
myExcute+="myDocLayers.artLayers.add();";//この操作でアクティブレイヤ移動
myExcute+="app.activeDocument.selection.selectAll();";
if(myColor.opacity){
myExcute+="app.activeDocument.selection.fill(app.backgroundColor,ColorBlendMode.NORMAL,myColor.opacity);";
}
myExcute+="if(wasFold){";
myExcute+="app.activeDocument.activeLayer.move(currentLayer,ElementPlacement.PLACEATBEGINNING)}else{"
myExcute+="app.activeDocument.activeLayer.move(currentLayer,ElementPlacement.PLACEBEFORE)};"
myExcute+="app.activeDocument.activeLayer.name=newName;";
myExcute+="if(nas.axe.newLayerTpr){app.activeDocument.activeLayer.opacity=nas.axe.onsOpc*100};";

	if((app.documents.length)&&(activeDocument.suspendHistory)){
		activeDocument.suspendHistory(myUndoStr,myExcute);
	}else{
		eval(myExcute);
	}

//レイヤ名を変更する場合のアルゴリズム見直し

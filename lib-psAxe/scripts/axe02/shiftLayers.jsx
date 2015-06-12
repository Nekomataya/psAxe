//shiftLyers.jsx レイヤセットのメンバーを定数シフトする
/*
	スライダで数値指定を行って最短距離に変換、その後実際のレイヤをシフトする
	count数を設定してレイヤを移動するルーチン（試験）　あとでスライダをつけること
*/
	nas=app.nas

//=====================================================レイヤシフト関数ライブラリへ移行するほうがよいかも
function shiftLayers(shiftCount){
//shiftCountは整数　0は判定してリターン（移動がないので）
 if(!shiftCount){shiftCount=0;};
 if(shiftCount==0){return};
 var idx=0;
 var myDocLayers=app.activeDocument.activeLayer.parent;
 var mxId=myDocLayers.layers.length;
 //シフトカウントを最小移動へ変換
// alert(shiftCount);
 shiftCount=shiftCount%mxId;
if(Math.abs(shiftCount)>(mxId/2)){shiftCount=(shiftCount<0)?(mxId+shiftCount):-(mxId-shiftCount)};
// alert(shiftCount);
 while(myDocLayers.layers[idx]!=app.activeDocument.activeLayer){idx++};
 app.activeDocument.activeLayer=myDocLayers.layers[(idx+mxId-shiftCount)%mxId];
 if(shiftCount>0){
  while (shiftCount>0){ myDocLayers.layers[myDocLayers.layers.length-1].move(myDocLayers.layers[0],ElementPlacement.PLACEBEFORE);shiftCount--; }
 }else{
  while (shiftCount<0){myDocLayers.layers[0].moveToEnd(app.activeDocument.activeLayer.parent);shiftCount++; }
 }
//activate TopLayer
for(var idx=0;idx<myDocLayers.layers.length;idx++){if(myDocLayers.layers[idx].visible){app.activeDocument.activeLayer=myDocLayers.layers[idx];break;}};
}
//ラベル数値部カウント関数 補助部分は数えないよ　でも小数部は数えるかも？
function countLabelNum(myLabel){
	if (myLabel.match(/([0-9]+)/)){return RegExp.$1 *1;}else{return 0;}
}
//==================================================
if((app.documents.length)&&(app.version.split(".")[0]>9)){
var myDocLayers=app.activeDocument.activeLayer.parent;
var maxLayers=myDocLayers.layers.length;
//カレントオフセットを探る
var currentOffset=0;
var prV=countLabelNum(myDocLayers.layers[0].name);
var myNames=new Array();
for(var cIx=0;cIx<maxLayers;cIx++){myNames.push(myDocLayers.layers[cIx].name)};
for(var cIx=1;cIx<maxLayers;cIx++){
	var crV=countLabelNum(myDocLayers.layers[cIx].name);
	if((crV-prV)>=(maxLayers-1)){currentOffset=(cIx-1);break;}else{if(cIx==(maxLayers-1)){currentOffset=cIx;break;}else{prV=crV;continue;}}
}
var shiftCount=0;
//=====================================UI

var w=nas.GUI.newWindow("dialog","JUMP",6,3);
w.myLabel=nas.GUI.addComboBox(w,myNames,myNames[0],0,0,3,1);
w.cnBt=nas.GUI.addButton(w,"cancel",3,0,1.5,1);
w.okBt=nas.GUI.addButton(w,"G O !",4.5,0,1.5,1);
w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,1,6,2,true,"index",currentOffset+1,1,maxLayers);
//コンボボックスのセレクトは即移動・名前の入力は新規作成だけど今日は保留
w.myLabel.onChange=function(){
//	alert(this.selected)
	if(this.selected != null){
		shiftLayers (-this.selected);
//		if((maxLayers/2)>this.selected){shiftLayers (-this.selected)}else{shiftLayers (maxLayers-this.selected)}
		this.parent.close();
	}else{
		alert("ここで新規名称のレイヤを作成する予定だけど、あとで書きます。今日はナシ　2011.05.23");
	}
}
w.mySlider.onChange=function(){
		this.set(Math.round(this.value),0,true);
		//alert((maxLayers-Math.round(this.value)+currentOffset)%maxLayers);
		this.parent.myLabel.select((maxLayers-this.value+currentOffset+1)%maxLayers);
}
w.okBt.onClick=function(){shiftLayers (-this.parent.myLabel.selected);this.parent.close();}
w.cnBt.onClick=function(){this.parent.close();}
w.show();
//=================================
}else{
if(app.version.split(".")[0]<=9){alert("This script does not work with Photoshop CS2")}
}

//xLink (同期レイヤ送り)には未対応なので注意　2011 05.31
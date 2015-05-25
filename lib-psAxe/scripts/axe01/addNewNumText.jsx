/* addNewNumText.jsx
 add textLayer for Title/CUT#/TC
 optional Frame & registermark
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
	nas=app.nas;
// in case we double clicked the file
	app.bringToFront();

if(app.documents.length==0){
	alert(localize(nas.uiMsg["noDocument"]));
}else{
//ライブラリを読み込み
	nas=app.nas;

//ドキュメント情報からドキュメント名を作成する
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+nas.Zf(nas.axe.dmCurrent[1],2)+ "c" +nas.Zf(nas.axe.dmCurrent[2],3)

if(nas.axe.dmDialog){
//ダイアログを出力してドキュメントの指定条件を取得
	var w=nas.GUI.newWindow("dialog","現在のドキュメントにタイトルテキストを追加",9,9,320,240);

 w.lb0 = nas.GUI.addStaticText(w,"ファイル名",0,0,2,1);
// w.fileName= nas.GUI.addEditText(w,nas.incrStr(currentName),2,0,5,1);
 w.fileName= nas.GUI.addEditText(w,currentName,2,0,5,1);

 w.lb1 = nas.GUI.addStaticText(w,"制作#." ,0,1,2,.75);
 w.lb2 = nas.GUI.addStaticText(w,"CUT#." ,2.25,1,2,.75);
 w.lb3 = nas.GUI.addStaticText(w,"( TIME )" ,4.5,1,2,0.75);

 w.opusNumber= nas.GUI.addEditText(w,nas.Zf(nas.axe.dmCurrent[1],2),0.75,1,1,1);
   w.opusInc= nas.GUI.addButton(w,"+",1.45 ,1,0.6,1);
   w.opusDec= nas.GUI.addButton(w,"-",1.75,1,0.6,1);

 w.cutNumber= nas.GUI.addEditText(w,nas.axe.dmCurrent[2].toString(),3,1,1,1);
   w.cutInc= nas.GUI.addButton(w,"+",3.7 ,1,0.6,1);
   w.cutDec= nas.GUI.addButton(w,"-",4   ,1,0.6,1);

 w.timeText= nas.GUI.addEditText(w,nas.Frm2FCT(nas.FCT2Frm(nas.axe.dmCurrent[3]),3),5.5,1,1.5,1);
   w.secInc= nas.GUI.addButton(w,"+1",4.8  ,2,.75,1);
   w.secDec= nas.GUI.addButton(w,"-1",5.25,2,.75,1);
   w.frmInc= nas.GUI.addButton(w,"+6",5.8  ,2,.75,1);
   w.frmDec= nas.GUI.addButton(w,"-6",6.25,2,.75,1);

　w.imPanel=nas.GUI.addPanel(w,"フレーム",0,3,7,6); 

w.imPanel.lb0 = nas.GUI.addStaticText(w.imPanel,"タイトル:",0,0.5,2,1);
w.imPanel.selectTT=nas.GUI.addComboBox(w.imPanel,nas.workTitles.names(0),nas.workTitles.selected,2,0.5,4,1)

w.imPanel.lb1 = nas.GUI.addCheckBox(w.imPanel,":フレーム",0,2,3,1);
w.imPanel.lb1.value=false;
w.imPanel.selectIM=nas.GUI.addDropDownList(w.imPanel,nas.inputMedias.names(0),nas.workTitles.selectedRecord[3],3,2,4,1);

w.imPanel.lb3 = nas.GUI.addCheckBox(w.imPanel,":タップ",0,3,3,1);
w.imPanel.lb3.value =false;
w.imPanel.selectRM=nas.GUI.addDropDownList(w.imPanel,nas.registerMarks.names(0),nas.registerMarks.selected,3,3,4,1);

//=========================
 w.okBt=nas.GUI.addButton(w,"OK",7,0,2,1);
 w.cnBt=nas.GUI.addButton(w,"キャンセル",7,1,2,1);
//=============　コントロールメソッド
//タイトルセレクタ更新　各コントロール更新してドキュメント名を作成
w.imPanel.selectTT.onChange=function(){
 nas.workTitles.select(this.selected);//選択タイトルを切り替える？
 nas.axe.dmCurrent[0]=nas.workTitles.selected;
 this.parent.parent.fileName.update();
 this.parent.selectIM.items[nas.workTitles.selectedRecord[3]].selected=true;
}

//IMセレクタ更新　各コントロール更新してドキュメント名を作成
w.imPanel.selectIM.onChange=function(){
 nas.inputMedias.select(this.selection.index);
 nas.RESOLUTION=nas.inputMedias.selectedRecord[3]/2.540;//dpc
}
//タップセレクタ更新
w.imPanel.selectRM.onChange=function(){
 nas.registerMarks.select(this.selection.index);
}
//ファイル名更新（一方通行で）
w.fileName.update=function(){
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+this.parent.opusNumber.text+"c"+this.parent.cutNumber.text;
this.text=currentName;
}
//値上下ボタン
w.opusInc.onClick=function(){this.parent.opusNumber.text=nas.Zf(nas.incrStr(this.parent.opusNumber.text),2);this.parent.opusNumber.onChange();};
w.opusDec.onClick=function(){this.parent.opusNumber.text=nas.Zf(nas.incrStr(this.parent.opusNumber.text,-1),2);this.parent.opusNumber.onChange();};
w.cutInc.onClick=function(){this.parent.cutNumber.text=nas.Zf(nas.incrStr(this.parent.cutNumber.text),3);this.parent.cutNumber.onChange();};
w.cutDec.onClick=function(){this.parent.cutNumber.text=nas.Zf(nas.incrStr(this.parent.cutNumber.text,-1),3);this.parent.cutNumber.onChange();};

w.secInc.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)+Number(nas.FRATE),3);};
w.secDec.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)-Number(nas.FRATE),3);};
w.frmInc.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)+6,3);};
w.frmDec.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)-6,3);};
//opusNo.cutNo更新
w.opusNumber.onChange=function(){this.parent.fileName.update();};
w.cutNumber.onChange=function(){this.parent.fileName.update();};
w.timeText.onChange=function(){this.text=nas.Frm2FCT(nas.FCT2Frm(this.text),3);};


//=======================================作成
 w.okBt.onClick=function(){
  var myName=w.fileName.text;
//オプションにしたがってドキュメントを整形

/*	 存在しない場合のみレイヤセット"Frames"を作成	*/
try {
	var myFrameSet=app.activeDocument.layerSets.getByName("Frames")
}catch(er){
	var myFrameSet=app.activeDocument.layerSets.add();
	myFrameSet.name="Frames";
}
//移動の必要があれば[Frames]を最上位へ
if(app.activeDocument.layers.length >1){myFrameSet.move(app.activeDocument,ElementPlacement.PLACEATBEGINNING)};

//フレームセットにレジスタ画像とフレームを読み込み(チェックがなければスキップ)
var currentUnitBase=app.preferences.rulerUnits;//控える
app.preferences.rulerUnits=Units.MM;
if(w.imPanel.lb3.value==true){
//レジスタ
  var myPegFile=new File(nasLibFolderPath+"resource/Pegs/"+nas.registerMarks.selectedRecord[1]);
  myPegLayer=nas.axeAFC.placeEps(myPegFile);
  myPegLayer.translate("0 px",-1*myPegLayer.bounds[1]);//上辺へはっつけ
  myPegLayer.name="peg";
  myPegLayer.move(myFrameSet,ElementPlacement.PLACEATEND);
}else{
//ダミーのタップレイヤをつける＝boundsを持った空オブジェクト
　var myPegLayer=new Object();
　myPegLayer.bounds=[
		app.activeDocument.width*0.1,
		new UnitValue("0mm"),
		app.activeDocument.width*0.9,
		new UnitValue("25mm")	
　]
}
if(w.imPanel.lb1.value==true){
//100フレーム枠を読み込み
  var myFrameFile=new File(nasLibFolderPath+"resource/Frames/"
	+nas.inputMedias.selectedRecord[1]+"mm"
	+nas.inputMedias.selectedRecord[2].replace(/\//,"x")
	+".eps"
  );
  myFrameLayer=nas.axeAFC.placeEps(myFrameFile);
//フレーム配置　今日はセンタリングのみで左右はパス 20110820
var myOffset=(((myFrameLayer.bounds[3]-myFrameLayer.bounds[1])/2)+myFrameLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
  myFrameLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を
  myFrameLayer.name="frame";
//
  myFrameLayer.move(myFrameSet,ElementPlacement.PLACEATEND);
}
if(true){
//各種テキストを配置
var myTextLayer=myFrameSet.artLayers.add();//レイヤ追加
var myTextOffsetX=(((myTextLayer.bounds[2]-myTextLayer.bounds[0])/2)+myTextLayer.bounds[0]).as("mm");
var myTextOffsetY=(((myTextLayer.bounds[3]-myTextLayer.bounds[1])/2)+myTextLayer.bounds[1]).as("mm");
  myTextLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myTextLayer.textItem.contents = nas.workTitles.selectedRecord[1]+" #"+this.parent.opusNumber.text;
  myTextLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myTextLayer.bounds[0]).as("mm")+0)+" mm" ),
	new UnitValue(((myPegLayer.bounds[3]-myTextLayer.bounds[1]).as("mm")+5)+" mm" )
  );//タップ位置を基準に調整
var myCutLayer=myFrameSet.artLayers.add();//レイヤ追加
  myCutLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myCutLayer.textItem.contents = "c# "+this.parent.cutNumber.text;
  myCutLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myCutLayer.bounds[0]).as("mm")+120)+" mm" ),
	new UnitValue(((myPegLayer.bounds[3]-myCutLayer.bounds[1]).as("mm")+5)+" mm" )
  );//タップ位置を基準に調整
//  myCutLayer.translate(new UnitValue(120+" mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm"))+" mm"));//タップからの距離を
var myTimeLayer=myFrameSet.artLayers.add();//レイヤ追加
  myTimeLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myTimeLayer.textItem.contents = "( "+this.parent.timeText.text+" )" ;
  myTimeLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myTimeLayer.bounds[0]).as("mm")+200)+" mm"),
	new UnitValue(((myPegLayer.bounds[3]-myTimeLayer.bounds[1]).as("mm")+5)+" mm")
  );//タップ位置を基準に調整
//  myTimeLayer.translate(new UnitValue("200 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm"))+" mm"));//タップからの距離を

	app.preferences.rulerUnits = Units.POINTS;
  myTextLayer.textItem.size = 32;//32ポ
  myCutLayer.textItem.size = 32;//32ポ
  myTimeLayer.textItem.size = 24;//24ポ

	//バグが発生した場合指定ポイント数と異なるデータが返るのでそれを判定
if (Math.round(myTextLayer.textItem.size.as("point"))!=32){
  nas.PSCCFontSizeFix.setFontSizePoints( myTextLayer, 32);//32ポ
  nas.PSCCFontSizeFix.setFontSizePoints( myCutLayer, 32);//32ポ
  nas.PSCCFontSizeFix.setFontSizePoints( myTimeLayer, 24);//24ポ
};

}
app.preferences.rulerUnits=currentUnitBase;//復帰

//	app.activeDocument.activeLayer=startupLayer;

//nas.axe.dmCurrent 更新
	nas.axe.dmCurrent=[nas.workTitles.selected,this.parent.opusNumber.text,this.parent.cutNumber.text,this.parent.timeText.text];
if(bootFlag){nas.writePrefarence(["nas.axe","nas.RESOLUTION","nas.workTitles.selected","nas.registerMarks.selected" ]);}
//alert(nas.axe.dmCurrent)
	this.parent.close();
};
 w.cnBt.onClick=function(){this.parent.close();};
/*
 w.tsBt.onClick=function(){;};
 w.isBt.onClick=function(){;};
*/
w.show();
}
}
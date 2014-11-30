//=======================================タイムシート画像を作る
/*
	暫定版画像タイムシート用

タイトルのみDBから取得して カット番号と秒数は手書きで
用紙の色は、今回は白

*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
//Photoshop用ライブラリ読み込み

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
var includeLibs=[nasLibFolderPath+"config.js"];//読み込みライブラリを格納する配列

if(! app.nas){
//iclude nasライブラリに必要な基礎オブジェクトを作成する
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
//	ライブラリのロード　CS2-5用
//==================== ライブラリを登録して事前に読み込む
/*
	includeLibs配列に登録されたファイルを順次読み込む。
	登録はパスで行う。(Fileオブジェクトではない)
	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む

＝＝＝　ライブラリリスト（以下は読み込み順位に一定の依存性があるので注意）
　config.js"		一般設定ファイル（デフォルト値書込）このルーチン外では参照不能
  nas_common.js		AE・HTML共用一般アニメライブラリ
  nas_GUIlib.js		Adobe環境共用GUIライブラリ
  nas_psAxeLib.js	PS用環境ライブラリ
  nas_prefarenceLib.js	Adobe環境共用データ保存ライブラリ

  nasXpsStore.js	PSほかAdobe汎用XpsStoreライブラリ(AE用は特殊)
  xpsio.js		汎用Xpsライブラリ
  mapio.js		汎用Mapライブラリ
  lib_STS.js		Adobe環境共用STSライブラリ
  dataio.js		Xpsオブジェクト入出力ライブラリ（コンバータ部）
  fakeAE.js		中間環境ライブラリ
  io.js			りまぴん入出力ライブラリ
  psAnimationFrameClass.js	PS用フレームアニメーション操作ライブラリ
  xpsQueue.js		PS用Xps-FrameAnimation連携ライブラリ
*/
includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
];
//=====================================　Application Objectに参照をつける
	app.nas=nas;
	bootFlag=true;
}else{
	//alert("object nas exists")
	nas=app.nas;
includeLibs.push(nasLibFolderPath+"config.js");//configのみ加えて参照可能に
	bootFlag=false;
};

/*	ライブラリ読み込み
ここで必要なライブラリをリストに加えてから読み込みを行う
*/

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
includeLibs.push(nasLibFolderPath+"psCCfontFix.js");

for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile ファンクションがあれば実行する
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile が存在しないバージョンではevalにファイルを渡す
		var scriptFile = new File(myScriptFileName);
		if(scriptFile.exists){
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}
//=====================================保存してあるカスタマイズ情報を取得
if(bootFlag){nas.readPrefarence();nas.workTitles.select();}
//=====================================
//+++++++++++++++++++++++++++++++++ここまで共用
function checkSelection(){var flg = true;try {activeDocument.selection.translate(0,0);}catch(e){flg = false;};return flg;}
//ドキュメント情報からドキュメント名を作成する
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+nas.Zf(nas.axe.dmCurrent[1],2)+"c"+nas.Zf(nas.axe.dmCurrent[2],3);
//var clipB=($.fileName.match(/addNewDocument/))? false:true;//クリップボードモードをファイル名で判定
var clipB=true
//	アクティブドキュメントから選択範囲をコピー
if(clipB){
if(checkSelection()){
    activeDocument.selection.copy(true);
}else{
    clipB=false;//選択範囲がないのでモードを通常作成に
}
}

//ダイアログを出力してドキュメントの指定条件を取得
if(clipB){
	var w=nas.GUI.newWindow("dialog","選択範囲から新規タイムシート(画像)ドキュメントを作成",9,9,320,240);
}else{
	var w=nas.GUI.newWindow("dialog","新規タイムシート(画像)ドキュメントを作成します",9,9,320,240);
}
 w.lb0 = nas.GUI.addStaticText(w,"ファイル名",0,0,2,1);
// w.fileName= nas.GUI.addEditText(w,nas.incrStr(currentName),2,0,5,1);
 w.fileName= nas.GUI.addEditText(w,currentName,2,0,5,1);

 w.lb1 = nas.GUI.addStaticText(w,"制作#.",0,1,2,.75);
 w.lb2 = nas.GUI.addStaticText(w,"CUT#.",2.25,1,2,.75);
 w.lb3 = nas.GUI.addStaticText(w,"( TIME )",4.5,1,2,0.75);

 w.opusNumber= nas.GUI.addEditText(w,nas.Zf(nas.axe.dmCurrent[1],2),0.75,1,1,1);
   w.opusInc= nas.GUI.addButton(w,"+",1.45 ,1,0.6,1);
   w.opusDec= nas.GUI.addButton(w,"-",1.75,1,0.6,1);

// w.cutNumber= nas.GUI.addEditText(w,nas.incrStr(nas.axe.dmCurrent[2].toString()),3,1,1,1);
 w.cutNumber= nas.GUI.addEditText(w,nas.axe.dmCurrent[2].toString(),3,1,1,1);
   w.cutInc= nas.GUI.addButton(w,"+",3.7 ,1,0.6,1);
   w.cutDec= nas.GUI.addButton(w,"-",4   ,1,0.6,1);

 w.timeText= nas.GUI.addEditText(w,nas.Frm2FCT(nas.FCT2Frm(nas.axe.dmCurrent[3]),3),5.5,1,1.5,1);
   w.secInc= nas.GUI.addButton(w,"+1",4.8  ,2,.75,1);
   w.secDec= nas.GUI.addButton(w,"-1",5.25,2,.75,1);
   w.frmInc= nas.GUI.addButton(w,"+6",5.8  ,2,.75,1);
   w.frmDec= nas.GUI.addButton(w,"-6",6.25,2,.75,1);

// w.titleCB= nas.GUI.addEditText(w,nas.workTitles.names(0),nas.workTitles.selected,2,0,4,1);
　w.edPanel=nas.GUI.addPanel(w,"編集",0,3,7,6); 

w.edPanel.lb0 = nas.GUI.addStaticText(w.edPanel,"タイトル（テンプレート）:",0,0.5,2,1);
w.edPanel.selectTT=nas.GUI.addComboBox(w.edPanel,nas.workTitles.names(0),nas.workTitles.selected,2,0.5,4,1)

w.edPanel.lb1 = nas.GUI.addStaticText(w.edPanel,"背景色:",0,2,3,1).justify="right";
w.edPanel.selectCl=nas.GUI.addDropDownList(w.edPanel,nas.axe.lyBgColors,1,3,2,3,1);
//w.edPanel.SP = nas.GUI.addStaticText(w.edPanel,"==================================================================================================================",0,1,2,1);
//====================================================
/*
w.edPanel.lb1 = nas.GUI.addStaticText(w.edPanel,"標準フレーム:",0,2,3,1).justify="right";
w.edPanel.selectIM=nas.GUI.addDropDownList(w.edPanel,nas.inputMedias.names(0),nas.workTitles.selectedRecord[3],3,2,4,1);
w.edPanel.lb2 = nas.GUI.addStaticText(w.edPanel,"用紙 :",0,3,3,1).justify="right";
w.edPanel.selectDP=nas.GUI.addDropDownList(w.edPanel,nas.paperSizes.names(0),nas.paperSizes.selected,3,3,4,1);
w.edPanel.lb3 = nas.GUI.addStaticText(w.edPanel,"タップ:",0,4,3,1).justify="right";
w.edPanel.selectRM=nas.GUI.addDropDownList(w.edPanel,nas.registerMarks.names(0),nas.registerMarks.selected,3,4,4,1);
w.edPanel.lb4 = nas.GUI.addStaticText(w.edPanel,"初期ワークセット(レイヤセット):",0,5,3,1).justify="right";
w.edPanel.selectWS=nas.GUI.addDropDownList(w.edPanel,["なし","フレームのみ","フレーム+1(A)","フレーム+2(A,B)","フレーム+3(A,B,C)","フレーム+4(A,B,C,D)"],3,3,5,4,1);
 */




//w.edPanel.lbWIDTH = nas.GUI.addStaticText(w.edPanel,"幅:",1,6,2,1).justify="right";
//w.edPanel.lbHEIGHT = nas.GUI.addStaticText(w.edPanel,"高:",1,7,2,1).justify="right";
w.edPanel.lbRESOLUTION = nas.GUI.addStaticText(w.edPanel,"解像度:",1,3,2,1).justify="right";

//w.edPanel.etWIDTH = nas.GUI.addEditText(w.edPanel,Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px")),3,6,2,1);
//w.edPanel.etHEIGHT = nas.GUI.addEditText(w.edPanel,Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px")),3,7,2,1);
w.edPanel.etRESOLUTION = nas.GUI.addEditText(w.edPanel,"200",3,3,2,1);
//解像度の標準値を nas.RESOLUTIONから外すほうが良い
//w.edPanel.pstWIDTH = nas.GUI.addStaticText(w.edPanel,"pixel",5,6,2,1);
//w.edPanel.pstHEIGHT = nas.GUI.addStaticText(w.edPanel,"pixel",5,7,2,1);
w.edPanel.pstRESOLUTION = nas.GUI.addStaticText(w.edPanel,"dpi",5,3,2,1);

w.edPanel.lbx = nas.GUI.addStaticText(w.edPanel,"データモードはRGB/8bit深度固定です。",0,4,6,1);

//=========================
 w.okBt=nas.GUI.addButton(w,"OK",7,0,2,1);
 w.cnBt=nas.GUI.addButton(w,"キャンセル",7,1,2,1);
/*
 w.tsBt=nas.GUI.addButton(w,"タイトルを保存",7,2,2,1).enabled=false;
 w.isBt=nas.GUI.addButton(w,"入力メディアを保存",7,3,2,1).enabled=false;
*/
//=============　コントロールメソッド
//タイトルセレクタ更新　各コントロール更新してドキュメント名を作成
w.edPanel.selectTT.onChange=function(){
 nas.workTitles.select(this.selected);//選択タイトルを切り替える？
 nas.axe.dmCurrent[0]=nas.workTitles.selected;
 this.parent.parent.fileName.update();
// this.parent.selectIM.items[nas.workTitles.selectedRecord[3]].selected=true;
}
/*
//カラーセレクタ更新
w.edPanel.selectCl.onChange=function(){
 alert(this.selection.index);
}
//IMセレクタ更新　各コントロール更新してドキュメント名を作成
w.edPanel.selectIM.onChange=function(){
 nas.inputMedias.select(this.selection.index);
 nas.RESOLUTION=nas.inputMedias.selectedRecord[3]/2.540;//dpc
w.edPanel.etWIDTH.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px"));
w.edPanel.etHEIGHT.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px"));
w.edPanel.etRESOLUTION.text = nas.Dpi();//nas.inputMedias.selectedRecord[3];
}
//用紙セレクタ更新　各コントロール更新してドキュメント名を作成
w.edPanel.selectDP.onChange=function(){
//alert(nas.RESOLUTION)
 nas.paperSizes.select(this.selection.index);
w.edPanel.etWIDTH.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px"));
w.edPanel.etHEIGHT.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px"));
//w.edPanel.etRESOLUTION.text = nas.inputMedias.selectedRecord[3];
}
//タップセレクタ更新
w.edPanel.selectRM.onChange=function(){
 nas.registerMarks.select(this.selection.index);
}
    
 */
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

var myMsg="";
myMsg+="RGB:8bit/pxel";
myMsg+=nas.GUI.LineFeed;
myMsg+="=====";

 w.notice=nas.GUI.addStaticText(w,myMsg,7,5,2,4);

//解像度が直接変更された場合、nas.RESOLUTIONを更新?
 w.edPanel.etRESOLUTION.onChange=function(){
	if(isNaN(this.text)){
		this.text=nas.Dpi();return;
	}else{
		nas.RESOLUTION=this.text/2.540;
	}
 }
//=======================================作成
 w.okBt.onClick=function(){
 //A3縦位置固定　解像度は特に変更が無ければ200dpi
  var myResolution=this.parent.edPanel.etRESOLUTION.text*1;
  var myWidth=Math.floor((29.7/2.54)*myResolution)+" px";
  var myHeight=Math.floor((42/2.54)*myResolution)+" px";
  var myName=w.fileName.text+"xps";
  var myLayerCounts=2;//変換サボってるけどインデックスがレイヤセット数
//指定の名前で新しいドキュメントを作成
  myNewDocument=app.documents.add(
	myWidth,myHeight,myResolution,myName,
	NewDocumentMode.RGB,DocumentFill.BACKGROUNDCOLOR,
	1,BitsPerChannelType.EIGHT,
  )
//オプションにしたがってドキュメントを整形
/*	初期レイヤを背景レイヤから通常レイヤへ変換	*/
var startupLayer=myNewDocument.layers[0];
startupLayer.isBackgroundLayer=false;
//用紙の色を付ける
var myColor=new SolidColor();
	myColor.rgb.red  =Math.floor(nas.axe.lyBgColors[this.parent.edPanel.selectCl.selection.index][1][0]*255);
	myColor.rgb.green=Math.floor(nas.axe.lyBgColors[this.parent.edPanel.selectCl.selection.index][1][1]*255);
	myColor.rgb.blue =Math.floor(nas.axe.lyBgColors[this.parent.edPanel.selectCl.selection.index][1][2]*255);
myNewDocument.selection.selectAll();
myNewDocument.selection.fill (myColor);
myNewDocument.selection.deselect();

/*	レイヤセットを作成	*/
 if(myLayerCounts>0){
  var myWorkSets=[];
  for(var lys=0;lys<myLayerCounts;lys++){myWorkSets.push(myNewDocument.layerSets.add());myWorkSets[lys].name=["Frames","Sheet"][lys];};
 }
//if(myLayerCounts>1){startupLayer.move(myWorkSets[1],ElementPlacement.INSIDE)};

	startupLayer.name="BackDrop";
//移動の必要があれば[Frames]を最上位へ
if(myLayerCounts>1){myWorkSets[0].move(app.activeDocument,ElementPlacement.PLACEATBEGINNING)};

//フレームセットにレジスタ画像とフレームを読み込み(フレームセットがない場合はスキップ)
var currentUnitBase=app.preferences.rulerUnits;//控える
app.preferences.rulerUnits=Units.MM;
if(myLayerCounts>0){
/*
//レジスタ
  var myPegFile=new File(nasLibFolderPath+"resource/Pegs/"+nas.registerMarks.selectedRecord[1]);
  myRuleLayer=nas.axeAFC.placeEps(myPegFile);
  myRuleLayer.translate("0 px",-1*myRuleLayer.bounds[1]);//上辺へはっつけ
  myRuleLayer.name="peg";
*/
//シート罫線を読み込み
  var myRuleFile=new File(nasLibFolderPath+"resource/timeSheet6sA3.eps");
  myRuleLayer=nas.axeAFC.placeEps(myRuleFile);
  myRuleLayer.blendMode=BlendMode.MULTIPLY;
var myOffset=(((myRuleLayer.bounds[3]-myRuleLayer.bounds[1])/2)+myRuleLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
//  myRuleLayer.translate(new UnitValue("0 mm"),new UnitValue(((myRuleLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を
  myRuleLayer.name="rule";
  myRuleLayer.move(myWorkSets[0],ElementPlacement.PLACEATEND);

//各種テキストを配置
var myTextLayer=myWorkSets[0].artLayers.add();//レイヤ追加
var myTextOffsetX=(((myTextLayer.bounds[2]-myTextLayer.bounds[0])/2)+myTextLayer.bounds[0]).as("mm");
var myTextOffsetY=(((myTextLayer.bounds[3]-myTextLayer.bounds[1])/2)+myTextLayer.bounds[1]).as("mm");
  myTextLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myTextLayer.textItem.contents = nas.workTitles.selectedRecord[1]+" #"+this.parent.opusNumber.text;
  myTextLayer.translate(
	new UnitValue(((myRuleLayer.bounds[0]-myTextLayer.bounds[0]).as("mm")+7)+" mm"),
	new UnitValue(((myRuleLayer.bounds[3]-myTextLayer.bounds[1]).as("mm")-394)+" mm")
  );//タップ位置を基準に調整
var myCutLayer=myWorkSets[0].artLayers.add();//レイヤ追加
  myCutLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myCutLayer.textItem.contents = "c# "+this.parent.cutNumber.text;
  myCutLayer.translate(
	new UnitValue(((myRuleLayer.bounds[0]-myCutLayer.bounds[0]).as("mm")+122)+" mm"),
	new UnitValue(((myRuleLayer.bounds[3]-myCutLayer.bounds[1]).as("mm")-394)+" mm")
  );//タップ位置を基準に調整


//  myCutLayer.translate(new UnitValue(120+" mm"),new UnitValue(((myRuleLayer.bounds[3]/2).as("mm"))+" mm"));//タップからの距離を
var myTimeLayer=myWorkSets[0].artLayers.add();//レイヤ追加
  myTimeLayer.kind = LayerKind.TEXT;//テキストレイヤに変換
  myTimeLayer.textItem.contents = "( "+this.parent.timeText.text+" )";
  myTimeLayer.translate(
	new UnitValue(((myRuleLayer.bounds[0]-myTimeLayer.bounds[0]).as("mm")+170)+" mm"),
	new UnitValue(((myRuleLayer.bounds[3]-myTimeLayer.bounds[1]).as("mm")-396)+" mm")
  );//タップ位置を基準に調整
//  myTimeLayer.translate(new UnitValue("200 mm"),new UnitValue(((myRuleLayer.bounds[3]/2).as("mm"))+" mm"));//タップからの距離を
/**/

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

//
  myRuleLayer.move(myWorkSets[0],ElementPlacement.PLACEATEND);
}
app.preferences.rulerUnits=currentUnitBase;//復帰
    var newSheetLayer=myWorkSets[1].artLayers.add ();
    newSheetLayer.name="Sheet1";
//	app.activeDocument.activeLayer=startupLayer;
	app.activeDocument.activeLayer=newSheetLayer;

//ここでペーストして位置を調整する
if(clipB){
  var myPicture=app.activeDocument.paste();
  myPicture.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を
}
//nas.axe.dmCurrent 更新
	nas.axe.dmCurrent=[nas.workTitles.selected,this.parent.opusNumber.text,this.parent.cutNumber.text,this.parent.timeText.text];
if(bootFlag){nas.writePrefarence(["nas.axe","nas.RESOLUTION","nas.workTitles.selected","nas.registerMarks.selected"]);}
//alert(nas.axe.dmCurrent)
	this.parent.close();
};
 w.cnBt.onClick=function(){this.parent.close();};
/*
 w.tsBt.onClick=function(){;};
 w.isBt.onClick=function(){;};
*/
w.show();

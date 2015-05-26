/* onsPref
	透過プリファレンス
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
// in case we double clicked the file
	app.bringToFront();

//Photoshop用ライブラリ読み込み

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas/lib=nas/lib/");
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
//	alert("object nas exists")
	nas=app.nas;
	bootFlag=false;
};


/*	ライブラリ読み込み
ここで必要なライブラリをリストに加えてから読み込みを行う
*/
	if(false){
includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	};
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

//=====================================UI
var uix=(app.version.split(".")[0]>9)
var w=nas.GUI.newWindow("dialog","レイヤ設定",6,10);
 w.cbOpc=nas.GUI.addCheckBox(w,"新規レイヤを透過",0,0,3,1);///新規レイヤを半透明で作るか不透明で作るか
 w.cbOpc.value=nas.axe.newLayerTpr;
if(uix){
 w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,0.5,6,2,true,"不透過率",nas.axe.onsOpc*100,0,100,true);
 w.mySlider.onChange=function(){this.set(Math.floor(this.value),0,true);}
}else{
 w.opSPX=nas.GUI.addStaticText(w,"%（不透過率）",1,1,2,1);//
 w.opSPC=nas.GUI.addEditText(w,nas.axe.onsOpc*100,0,1,1,1);//
}


//=========新規動画背景色選択
w.colorSPC=nas.GUI.addPanel(w,"新規レイヤの背景色",0,2.2,6,2);
for(var ix=0;ix<nas.axe.lyBgColors.length;ix++){
	w["rbl"+ix]=nas.GUI.addRadioButton(w.colorSPC,nas.axe.lyBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	w["rbl"+nas.axe.lyBgColor].value=true;
//=========修正用紙色選択
w.colorSPCovl=nas.GUI.addPanel(w,"修正レイヤの背景色",0,3.9,6,2);
for(var ix=0;ix<nas.axe.ovlBgColors.length;ix++){
	w["rbo"+ix]=nas.GUI.addRadioButton(w.colorSPCovl,nas.axe.ovlBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	w["rbo"+nas.axe.ovlBgColor].value=true;

//====================================================　layers interlocking
/*　レイヤセット連動プロパティの取得
　レイヤセット連動の条件は、
	ドキュメントが存在すること
	ドキュメント第一階層にレイヤセットが2つ以上存在すること。(Document.layers.length>=2)
	PhotoshopのバージョンがCS4(11)以上であること（プロパティ設定ができない)
	現状保留（常にfalse）
*/
var myWSnames=[];mySelectedOptions=[];
//alert(app.version.split(".")[0]>10);

if(	(false)&&
	(app.version.split(".")[0]>10)&&
	(app.documents.length)&&
	(app.activeDocument)&&
	(app.activeDocument.layerSets.length>1)
){
//呼び出し時点のターゲットレイヤセットを取得する
/*	ターゲットレイヤセットは第一階層で、かつレイヤセットであること
	
*/
var myDocLayers=(
	(app.activeDocument.activeLayer.parent.typename=="Document")&&
	(app.activeDocument.activeLayer.typename=="LayerSet")
)? app.activeDocument.activeLayer:app.activeDocument.activeLayer.parent;
if(myDocLayers.xLinks==undefined){
//プロパティが存在しなければデフォルトの空配列で初期化
  myDocLayers.xLinks=mySelectedOptions
}else{
//プロパティがあれば現状を取得
  mySelectedOptions=myDocLayers.xLinks
};
	for (var idx=0;idx<app.activeDocument.layerSets.length;idx++){
		myWSnames.push(app.activeDocument.layerSets[idx].name)
//alert(app.activeDocument.layerSets[idx].interlocked)
//		if(app.activeDocument.layerSets[idx].interlocked){
//			mySelectedOptions.push(idx)
//		}else{
//			app.activeDocument.layerSets[idx].interlocked=false;
//		}
	}
}else{
		myWSnames.push("連動可能なレイヤセットはありません");
		mySelectedOptions.push(false);
}
var myMsgIL="レイヤセット連動"+nas.GUI.LineFeed+"レイヤセットごとに設定します。"+nas.GUI.LineFeed+"保存はされません。";//

 w.interlockLabel=nas.GUI.addStaticText(w,myMsgIL,0,6,2,3);//
 w.interlocking=nas.GUI.addListBoxO(w,myWSnames,mySelectedOptions,2,6,4,3,{multiselect:true});
if(myWSnames.length>1){w.interlocking.enabled=true;}else{w.interlocking.enabled=false;}
//====================================================
 w.cnBt=nas.GUI.addButton(w,"cancel",1.5,9,1.5,1);
 w.rtBt=nas.GUI.addButton(w,"Reset",3,9,1.5,1);
 w.okBt=nas.GUI.addButton(w,"O K",4.5,9,1.5,1);
//
//
w.cnBt.onClick=function(){this.parent.close()};
w.rtBt.onClick=function(){
	this.parent.cbOpc.value=nas.axe.newLayerTpr;
if(uix){
	this.parent.mySlider.set(Math.floor(nas.axe.onsOpc*100));
}else{
	this.parent.opSPC.text=(Math.floor(nas.axe.onsOpc*100));
}
	this.parent["rb"+nas.axe.lyBgColor].value=true;
};

w.okBt.onClick=function(){

	if(w.cbOpc.value!=nas.axe.newLayerTpr){nas.axe.newLayerTpr=w.cbOpc.value};
if(uix){
	if(w.mySlider.value!=(nas.axe.onsOpc*100)){nas.axe.onsOpc=(w.mySlider.value/100)};
}else{
	if((w.opSPC.text/100)!=nas.axe.onsOpc){nas.axe.onsOpc=(w.opSPC.text/100)};
}
	for(var rix=0;rix<nas.axe.lyBgColors.length;rix++){if(w["rbl"+rix].value){if(rix != nas.axe.lyBgColor){nas.axe.lyBgColor=rix};break;}};
	for(var rix=0;rix<nas.axe.ovlBgColors.length;rix++){if(w["rbo"+rix].value){if(rix != nas.axe.ovlBgColor){nas.axe.ovlBgColor=rix};break;}};
	nas.writePrefarence("nas.axe");

//連動情報はドキュメントに直接書き込んで保存はなし
//if(!app.activeDocument.interlocked){app.activeDocument.interlocked=new Array();}
if(myWSnames.length>1){
	myDocLayers.xLinks=[];//初期化
	for(var idx=0;idx<myWSnames.length;idx++){
 if(w.interlocking.items[idx].selected){myDocLayers.xLinks.push(idx)}
	}
}
	this.parent.close();
}

w.show();
//=================================
//
//delete w;



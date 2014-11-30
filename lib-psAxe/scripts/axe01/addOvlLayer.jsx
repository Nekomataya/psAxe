/*
	アクティブレイヤの上に修正（注釈）用レイヤをつける
	
動画番号を更新しないで注釈ポストフィックスを加える
用紙色は、指定パラメータを設ける
*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
//ドキュメントは必要なのでドキュメントがなければ全体をスキップ
if((app.documents.length>0)&&(app.activeDocument)){
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
	//alert("object nas exists")
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
}
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
//add newLayer for animation drawing
//記録してある色と背景色を照合して、異なっていたら背景色を変更
var myColor=new SolidColor();
	myColor.rgb.red  =Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][0]*255);
	myColor.rgb.green=Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][1]*255);
	myColor.rgb.blue =Math.floor(nas.axe.ovlBgColors[nas.axe.ovlBgColor][1][2]*255);
if (app.backgroundColor!=myColor){app.backgroundColor=myColor};//背景色変更はUNDO対象外
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

var myUndoStr="新規修正レイヤ作成"
var myExcute="";
myExcute+="myDocLayers.artLayers.add();";//この操作でアクティブレイヤ移動
myExcute+="app.activeDocument.selection.selectAll();";
myExcute+="app.activeDocument.selection.fill(app.backgroundColor);";
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
}
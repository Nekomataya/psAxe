// EPS Open Options:
//Photoshop用ライブラリ読み込み
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
//===========保存してあるカスタマイズ情報を取得(オブジェクトが既存の場合はスキップ)
if(bootFlag){nas.readPrefarence();nas.workTitles.select();}
//=====================================
//+++++++++++++++++++++++++++++++++ここまで共用
//フレームセット内にシート罫線を読み込み(フレームセットがない場合はスキップ)

var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
var currentUnitBase=app.preferences.rulerUnits;//控える
app.preferences.rulerUnits=Units.MM;

if(true){
//レジスタ
  var myRuleFile=new File(nasLibFolderPath+"resource/timeSheet6sA3.eps");
  var myRuleLayer=nas.axeAFC.placeEps(myRuleFile);//この関数が曲者
  myRuleLayer.name="Sheet-Rule";//上記の関数の実行後に最初にDOM操作したオブジェクトは取り消しを受けている
/*リネームをしなかった場合はレイヤの読み込み自体がUNDOされて読み込んだはずのレイヤが喪失してエラーが発生する*/
  myRuleLayer.translate("5 mm",-1*myRuleLayer.bounds[1]+7);//上辺へはっつけ

//罫線配置
var myOffset=(((myRuleLayer.bounds[3]-myRuleLayer.bounds[1])/2)+myRuleLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];

  myRuleLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);

  //フレーム格納レイヤセットがある場合のみそちらへ移動
if(myTargetSet){
    myRuleLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
  if(!bootFlag){
    myRuleLayer.name="rule";
  }
}else{
//===========================================
//レジスタ画像を読み込んで画像上辺へ移動
  var myRuleFile=new File(nasLibFolderPath+"resource/timeSheet6sA3.eps");

 var myRuleLayer=nas.axeAFC.placeEps(myRuleFile);
myRuleLayer.name="rule";
myRuleLayer.translate(new UnitValue("0 px"),-1*myPegLayer.bounds[1]);//上辺へはっつけ


//フレーム格納レイヤセットがある場合のみそちらへ移動
var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
if(myTargetSet){
  myPegLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
    myPegLayer.name="Rule";
}
//ルーラーユニット復帰
app.preferences.rulerUnits=currentUnitBase;//復帰


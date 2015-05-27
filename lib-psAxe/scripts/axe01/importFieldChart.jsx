/*フィールドチャート読込スクリプト
nasライブラリ領域にあるフィールドチャートを読み込み、フレームフォルダに読みこみます
2015.05.17	Nekomataya / kiyo
*/
// EPS Open Options:
//Photoshop用ライブラリ読み込み CS6以降
if(app.nas){
//	alert("object nas exists")
	nas=app.nas;
	bootFlag=false;
var nasLibFolderPath =  Folder.nas.fullName+"/lib/";
}else{
/*
	基本的なライブラリのロードは、psAxe環境の初期化で行われるが
	ショートカットキーで呼び出されたスクリプトはスコープが異なるため
	以下のような最初期化を必要とする
	すでにapp.nasオブジェクトが存在する場合はそちらを利用して
	このロード部分は使用されない
*/
var includeLibs=[];//読み込みライブラリを格納する配列
//iclude nasライブラリに必要な基礎オブジェクトを作成する
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
var nasLibFolderPath =  nas.baseLocation+"/lib/";
//	ライブラリのロード　CS6-CC用
//==================== ライブラリを登録して事前に読み込む
/*
	includeLibs配列に登録されたファイルを順次読み込む。
	登録はパスで行う。(Fileオブジェクトではない)
	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む
＝＝＝　ライブラリリスト(以下は読み込み順位に一定の依存性があるので注意 上から順に適用のこと)
  config.js		一般設定ファイル（デフォルト値書込）このルーチン外では参照不能
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
  nas_axeEventHandler.js	イベントハンドラ（拡張用）
	nasLibFolderPath+"nas_axeEventHandler.js",
  xpsQueue.js		PS用Xps-FrameAnimation連携ライブラリ
*/
includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
];
/*	ライブラリ読み込み
以下ここで必要なライブラリのみをリストに加えてから読み込みを行う

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");//タイムシート関連ライブラリ
includeLibs.push(nasLibFolderPath+"xpsio.js");//同上
includeLibs.push(nasLibFolderPath+"mapio.js");//同上
includeLibs.push(nasLibFolderPath+"lib_STS.js");//同上
includeLibs.push(nasLibFolderPath+"dataio.js");//同上
includeLibs.push(nasLibFolderPath+"fakeAE.js");//同上 AEエクスプレッション互換ライブラリ
includeLibs.push(nasLibFolderPath+"io.js");//同上
includeLibs.push(nasLibFolderPath+"xpsQueue.js");//シート適用関連ライブラリ
includeLibs.push(nasLibFolderPath+"messages.js");//他言語化リソース
*/
includeLibs.push(nasLibFolderPath+"psCCfontFix.js");//フォントバグ対応コマンド

for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	//$.evalFile ファンクションで実行する
		$.evalFile(myScriptFileName);
}
//=====================================保存してあるカスタマイズ情報を取得
nas.readPrefarence();nas.workTitles.select();
//=====================================startup
//=====================================　Application Objectに参照をつける
	app.nas=nas;
	bootFlag=true;
 }
//+++++++++++++++++++++++++++++++++ここまで共用

//フレームセットにフィールドチャート画像をセット(フレームセットがない場合ドキュメントに直接配置)

var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
var currentUnitBase=app.preferences.rulerUnits;//控える
var currentActiveLayer=app.activeDocument.activeLayer ;//控える
app.preferences.rulerUnits=Units.MM;

if(true){
  try{
  	//ドキュメント内部にペグレイヤが存在する場合はそれを参照
    var myPegLayer=myTargetSet.artLayers.getByName("peg");
    var myFrameLayer=myTargetSet.artLayers.getByName("frame");
      }catch(err){
 	//存在しない場合はダミーを作成
 	var myPegLayer=new Object();
 	myPegLayer.bounds=[0,0,new UnitValue(0),new UnitValue(0)];
 	var myFrameLayer=new Object();
 	myFrameLayer.bounds=[0,0,app.activeDocument.width,app.activeDocument.height];
  }
//フィールドチャートを選定
//11in 14in 16in ドキュメント幅よりも小さくその中で最も大きなものを選定
var docWidth=Math.floor(app.activeDocument.width.as("in"));
var myWidth=11;
for(var w =0;w<2;w++){if([16,14][w]<=docWidth){myWidth=[16,14][w];break;}};
// alert(nasLibFolderPath+"resorce/FieldCharts/fieldChart"+myWidth.toString()+"F.eps");
 var myFieldChart=new File(nasLibFolderPath+"resource/FieldCharts/fieldChart"+myWidth.toString()+"F.eps");

//セット
  var  myFieldChartLayer=nas.axeAFC.placeEps(myFieldChart);//読み込んでオブジェクト取得

//フレーム配置　今日はセンタリングのみで左右はパス 20110820
  var myOffset=(((myFrameLayer.bounds[3]-myFrameLayer.bounds[1])/2)+myFrameLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
  myFieldChartLayer.name="fieldChart";//この操作が取り消し対象ダミー（あとでもう一度実行する）
  myFieldChartLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を設定


//レイヤのプロパティ調製
  myFieldChartLayer.opacity=20;
  myFieldChartLayer.blendMode=BlendMode.DIFFERENCE;
//フレーム格納レイヤセットがある場合のみそちらへ移動
if(myTargetSet){
    myFieldChartLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
  if(!bootFlag){
    myFieldChartLayer.name="fieldChart";
  }
}
//ルーラーユニット復帰
app.preferences.rulerUnits=currentUnitBase;//復帰
//アクティブレイヤ
app.activeDocument.activeLayer=currentActiveLayer;//復帰


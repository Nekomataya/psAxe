/*	リファレンスチャートを読み込む
nas リファレンスチャートは、スキャナ等で実物のアニメーション素材をデジタイズした際のリファレンスです
このスクリプトで読み込むデータはリファレンスの原稿データです
実際に取り込んだリファレンスと比較してデジタイズの精度の確認にご利用下さい
2015.05.17	Nekomataya / kiyo
*/
//Photoshop用ライブラリ読み込み CS6以降
if(app.nas){
	//alert("object nas exists")
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
//==============================　Application Objectに参照をつける
	app.nas=nas;
	bootFlag=true;
/*	ライブラリ読み込み
以下ここで必要なライブラリのみをリストに加えてから読み込みを行う

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");//タイムシート関連ライブラリ
includeLibs.push(nasLibFolderPath+"xpsio.js");//同上
includeLibs.push(nasLibFolderPath+"mapio.js");//同上
includeLibs.push(nasLibFolderPath+"lib_STS.js");//同上
includeLibs.push(nasLibFolderPath+"dataio.js");//同上
includeLibs.push(nasLibFolderPath+"fakeAE.js");//同上 AEエクスプレッション互換ライブラリ
includeLibs.push(nasLibFolderPath+"io.js");//同上
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");//旧ライブラリ互換用ラッパ
includeLibs.push(nasLibFolderPath+"xpsQueue.js");//シート適用関連ライブラリ
includeLibs.push(nasLibFolderPath+"messages.js");//他言語化リソース
includeLibs.push(nasLibFolderPath+"psCCfontFix.js");//フォントバグ対応コマンド
*/
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

//フレームセットに試験中のRefereneceChart画像をセット(フレームセットがない場合ドキュメントに直接配置)

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

//リファレンスチャートを選定
/*
サイズ指定がない場合はドキュメントサイズと比較してなるべく収まりそうな最も大きなものを選定
サイズは A4L横 A3F縦 A3L横 B4L横
先に横寸をチェックして閾値で４段評価
	NOP,(A4L,A3F),B4L,A3L
次に縦寸を見て５段評価
	NOP,A4L,B4L,A3L,A3F
小さすぎる場合は何もせずに終了

本日は判定パス　指定も無視してA4Lを利用します
*/

var docWidth=Math.floor(app.activeDocument.width.as("mm"));
var docHeight=Math.floor(app.activeDocument.height.as("mm"));

var myPaper="A4L";
 var myReferenceChart=new File(nasLibFolderPath+"resource/Reference/refSheet"+myPaper+".eps");
//セット
  var  myReferenceChartLayer=nas.axeAFC.placeEps(myReferenceChart);//読み込んでオブジェクト取得
//配置　今日はセンタリングのみで左右はパス 20110820
  var myOffset=(((myFrameLayer.bounds[3]-myFrameLayer.bounds[1])/2)+myFrameLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
  myReferenceChartLayer.name="referenceChart";//この操作が取り消し対象ダミー（あとでもう一度実行する）
  myReferenceChartLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を設定


//レイヤのプロパティ調製
  myReferenceChartLayer.opacity=100;
//  myReferenceChartLayer.blendMode=BlendMode.DIFFERENCE;
//フレーム格納レイヤセットがある場合のみそちらへ移動
if(myTargetSet){
    myReferenceChartLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
  if(!bootFlag){
    myReferenceChartLayer.name="referenceChart";
  }
}
//ルーラーユニット復帰
app.preferences.rulerUnits=currentUnitBase;//復帰
//アクティブレイヤ
app.activeDocument.activeLayer=currentActiveLayer;//復帰


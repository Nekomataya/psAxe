/*	リファレンスチャートを読み込む
nas リファレンスチャートは、スキャナ等で実物のアニメーション素材をデジタイズした際のリファレンスです
このスクリプトで読み込むデータはリファレンスの原稿データです
実際に取り込んだリファレンスと比較してデジタイズの精度の確認にご利用下さい
2015.05.17	Nekomataya / kiyo
*/
//Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
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
 var myReferenceChart=new File(Folder.nas.fullName+"/lib/resource/Reference/refSheet"+myPaper+".eps");
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


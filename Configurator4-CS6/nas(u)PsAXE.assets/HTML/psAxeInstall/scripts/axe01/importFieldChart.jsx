/*フィールドチャート読込スクリプト
nasライブラリ領域にあるフィールドチャートを読み込み、フレームフォルダに読みこみます
2015.05.17	Nekomataya / kiyo
*/
// EPS Open Options:
/Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
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
 var myFieldChart=new File(Folder.nas.fullName+"/lib/resource/FieldCharts/fieldChart"+myWidth.toString()+"F.eps");

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


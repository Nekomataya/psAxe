// EPS Open Options:
//Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
}
//+++++++++++++++++++++++++++++++++ここまで共用
//フレームセットにレジスタ画像とフレームを読み込み(フレームセットがない場合はドキュメントのルートトレーラーにセット)

var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
var currentUnitBase=app.preferences.rulerUnits;//控える
var currentActiveLayer=app.activeDocument.activeLayer ;//控える
app.preferences.rulerUnits=Units.MM;

if(true){
//レジスタ
  var myPegFile=new File(Folder.nas.fullName+"/lib/resource/Pegs/"+nas.registerMarks.selectedRecord[1]);
  var myPegLayer=nas.axeAFC.placeEps(myPegFile);//この関数が曲者
  myPegLayer.name="peg";//上記の関数の実行後に最初にDOM操作したオブジェクトは取り消しを受けている
/*リネームをしなかった場合はレイヤの読み込み自体がUNDOされて読み込んだはずのレイヤが喪失してエラーが発生する*/
  myPegLayer.translate("0 mm",-1*myPegLayer.bounds[1]);//上辺へはっつけ
//100フレーム枠を読み込み
  var myFrameFile=new File(Folder.nas.fullName+"/lib/resource/Frames/"
	+nas.inputMedias.selectedRecord[1]+"mm"
	+nas.inputMedias.selectedRecord[2].replace(/\//,"x")
	+".eps"
  );
//セット
  var  myFrameLayer=nas.axeAFC.placeEps(myFrameFile);//ポイント
//フレーム配置　今日はセンタリングのみで左右はパス 20110820
  var myOffset=(((myFrameLayer.bounds[3]-myFrameLayer.bounds[1])/2)+myFrameLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
  myFrameLayer.name="frame";//この操作が取り消し対象ダミー
  myFrameLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を
//フィールドチャートはオプションで取り込み
if(false){
//フィールドチャートを選定
//11in 14in 16in ドキュメント幅よりも小さくその中で最も大きなものを選定
var docWidth=Math.floor(app.activeDocument.width.as("in"));
var myWidth=11;
for(var w =0;w<2;w++){if([16,14][w]<=docWidth){myWidth=[16,14][w];break;}};
//alert(Folder.nas.fullName+"/lib/resorce/FieldCharts/fieldChart"+myWidth.toString()+"F.eps");
 var myFieldChart=new File(Folder.nas.fullName+"/lib/resource/FieldCharts/fieldChart"+myWidth.toString()+"F.eps");
//セット
  var  myFieldChartLayer=nas.axeAFC.placeEps(myFieldChart);//ポイント
//フレーム配置　今日はセンタリングのみで左右はパス 20110820
  myFieldChartLayer.name="fieldCart";//この操作が取り消し対象ダミー
  myFieldChartLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//タップからの距離を設定
}

//レイヤのプロパティ調製
  if(nas.axe.frameOpc){myFrameLayer.opacity=20;};
  if(nas.axe.pegBlend){myPegLayer.blendMode=BlendMode.DIFFERENCE;};
  if(nas.axe.withFldCht){myFieldChartLayer.blendMode=BlendMode.DIFFERENCE;};
//フレーム格納レイヤセットがある場合のみそちらへ移動
if(myTargetSet){
    myFrameLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
//    myFieldChartLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
    myPegLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
  if(!bootFlag){
    myPegLayer.name="peg";
    myFrameLayer.name="frame";
//    myFieldChartLayer.name="fieldCart";
  }
}else{
//===========================================
//レジスタ画像を読み込んで画像上辺へ移動
  var myPegFile=new File(Folder.nas.fullName+"/lib/resource/Pegs/"+nas.registerMarks.selectedRecord[1]);

 var myPegLayer=nas.axeAFC.placeEps(myPegFile);
myPegLayer.name="peg";
myPegLayer.translate(new UnitValue("0 px"),-1*myPegLayer.bounds[1]);//上辺へはっつけ


//フレーム格納レイヤセットがある場合のみそちらへ移動
var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
if(myTargetSet){
  myPegLayer.move(myTargetSet,ElementPlacement.PLACEATBEGINNING);
}
    myPegLayer.name="peg";
}
//ルーラーユニット
app.preferences.rulerUnits=currentUnitBase;//復帰
//アクティブレイヤ
app.activeDocument.activeLayer=currentActiveLayer;//復帰
if(false){
/*
	タップ画像を読み込む
指定されたインデックスのタップ画像をライブラリから読み込んでフレームフォルダに配置する。
ターゲットの解像度を確認して同じ解像度で指定されたタップ（レジスタ）画像を開く。

画像サイズがタップに対して小さすぎる場合、または拡張オプションがある場合はドキュメントを拡張する
Pegプロパティ
PegType.NOPEG
PegType.CORNER
PegType.DOUBLEPOINT
PegType.ACADEMY
type	0P,1P,2P,3P
offsetX	0mm
offsetY (frameHeight/2)+3cm (1in ?)
rotation 0d
parentFrame DrawingFrame
0d:上タップ、90d:右横タップ、180d:下タップ、270d:左横タップ　タップ配置＝数値で 時計回り
ペグのプロパティを持たせないと正確な配置ができないので注意

張り込み手順は以下のとおりで
ドキュメント情報取得
情報を一致させてテンプレート開く
ペグのプロパティに合わせてテンプレート回転
配置を割り出し
ペースト後に移動が必要か否か判定
ペースト
必要なら移動（BITMAP）モードでは貼付け時点で見切れるのでパスしても良い？
*/
/*
function Pegbar(myParent,barType,myRotation,myOffset){
	if(! myParent){myParent=new DrawingFrame};
	if(! barType){barType=3};//タイプ０があるのでこればよくない
	if(! myRotation){myRotation=newRotation};
	if(! myOffset){myOffset=new Offset};
	this.type=barType;
	this.parent=myParent;
	this.parent.pegbar=this;
	this.rotation=myRotation;
	this.offsetX=;
	this.offsetY=;
}
var myPegbar=new Pegbar(3);
 //myPeg.rotation=0;
 //myPeg.offsetY=0
*/
var myTarget=app.activeDocument;
var myTemplates=[
	"peg2p1.eps",
	"peg2p2.eps",
	"peg2p3.eps",
	"peg3p1.eps",
	"peg3p2.eps",
	"peg3p3.eps"
]
/*
var epsOpts = new EPSOpenOptions();
	epsOpts.antiAlias = true;
	epsOpts.mode = eval("Open"+myTarget.mode.toString());
// other modes - GRAYSCALE, LAB, or RGB
	epsOpts.resolution = myTarget.resolution; // pixels per inch
	epsOpts.constrainProportions = true;
// if constrainProportions == true you can only set the width, but if you don't set both Photoshop will throw a missing value error
	epsOpts.width = new UnitValue(1800, 'px' );
	epsOpts.height =  new UnitValue(1800, 'px' );
// height is ingored unless constrainProportions == false
*/
//↓こんな風に使うらしい　なるほど
if (myTarget.mode==DocumentMode.BITMAP){
	var myFile=new File(Folder.nas.fullName+"/lib/resource/Pegs/peg3p.eps");
	var myOpt=new EPSOpenOptions();
	myOpt.mode = OpenDocumentMode.GRAYSCALE;
	myOpt.resolution=myTarget.resolution;
	myOpt.antiAlias=false;
}else{
	var myFile=new File(Folder.nas.fullName+"/lib/resource/Pegs/peg3p.eps");
	var myOpt=new EPSOpenOptions();
	myOpt.mode = eval("Open"+myTarget.mode.toString());
	myOpt.resolution=myTarget.resolution;
	myOpt.antiAlias=true;
}
var tempDoc=app.open(myFile,myOpt);

var pegBounds=tempDoc.artLayers[0].bounds;//バウンスを取得
//ターゲットとテンプレートのサイズ差を取得（とりあえず横だけ）
var myShift=Math.floor((myTarget.width.as("px")-tempDoc.width.as("px"))/2);
var mySelectRegion=[[pegBounds[0].as("px")+myShift,pegBounds[1].as("px")],[pegBounds[2].as("px")+myShift,pegBounds[1].as("px")],[pegBounds[2].as("px")+myShift,pegBounds[3].as("px")],[pegBounds[0].as("px")+myShift,pegBounds[3].as("px")]];
//選択リジョンをドキュメント中央にする
//var myCenter=[Math.floor(myTarget.width.as("px")/2),Math.floor(myTarget.height.as("px")/2)];
//var mySelectRegion=[add(myCenter,[-100,-100]),add(myCenter,[-100,100]),add(myCenter,[100,100]),add(myCenter,[100,-100])];
tempDoc.layers[0].copy();//クリップボードへ転送
tempDoc.close(SaveOptions.DONOTSAVECHANGES);//保存せずにクロース
	myTarget.selection.select(mySelectRegion,SelectionType.REPLACE);//リジョンを選択　ドキュメント単位で左端がマッチ
//	myTarget.selection.select([[200,0],[500,0],[500,100],[200,100]],SelectionType.INTERSECT);//リジョンを選択　ドキュメント単位で左端がマッチ
var myPegLayer=myTarget.paste();//ターゲットノ最上位に貼り付け
 myPegLayer.name="peg";

	myTarget.selection.select(mySelectRegion,SelectionType.REPLACE);//リジョンを選択　ドキュメント単位で左端がマッチ
}
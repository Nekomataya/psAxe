// EPS Open Options:
//Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
}
//+++++++++++++++++++++++++++++++++ここまで共用
//フレームセット内にシート罫線を読み込み(フレームセットがない場合はスキップ)

var myTargetSet=app.activeDocument;

try{myTargetSet=app.activeDocument.layerSets["Frames"];}catch(err){;};
var currentUnitBase=app.preferences.rulerUnits;//控える
app.preferences.rulerUnits=Units.MM;

if(true){
//レジスタ
  var myRuleFile=new File(Folder.nas.fullName+"/lib/resource/timeSheet6sA3.eps");
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
  var myRuleFile=new File(Folder.nas.fullName+"/lib/resource/timeSheet6sA3.eps");

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


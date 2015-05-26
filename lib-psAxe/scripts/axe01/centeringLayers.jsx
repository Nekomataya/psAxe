//レイヤをセンタリングするプロシジャ
//
var myLayer=app.activeDocument.activeLayer;
if(true){
//画面中心座標
var destPos=[app.activeDocument.width/2,app.activeDocument.height/2];
}else{
//フレーム中心座標
if(app.activeDocument.layers.getByName("Frames")){
	var myPegLayer=app.activeDocument.layers.getByName("Frames").artLayers.getByName("peg");
	var myPegHeight=(myPegLayer.bounds[3]-myCutLayer.bounds[1]);
}else{
	var myPegLayer=false;
	var myPegHeight=new UnitValue("0 mm")
}
var destPos=[
	app.activeDocument.width/2,
	(myPegHeight/2)+new UnitValue(nas.inputMedias.selectedRecord[7]+" mm")
]
}
//センタリング
  myLayer.translate(
	destPos[0]-((myLayer.bounds[2]-myLayer.bounds[0])/2+myLayer.bounds[0]),
	destPos[1]-((myLayer.bounds[3]-myLayer.bounds[1])/2+myLayer.bounds[1])
  );




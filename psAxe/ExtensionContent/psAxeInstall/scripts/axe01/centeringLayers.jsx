//���C�����Z���^�����O����v���V�W��
//
var myLayer=app.activeDocument.activeLayer;
if(true){
//��ʒ��S���W
var destPos=[app.activeDocument.width/2,app.activeDocument.height/2];
}else{
//�t���[�����S���W
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
//�Z���^�����O
  myLayer.translate(
	destPos[0]-((myLayer.bounds[2]-myLayer.bounds[0])/2+myLayer.bounds[0]),
	destPos[1]-((myLayer.bounds[3]-myLayer.bounds[1])/2+myLayer.bounds[1])
  );




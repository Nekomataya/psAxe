//shiftLyersB.jsx ���C���Z�b�g�̃����o�[���������V�t�g����
	//�I�����C���擾
if(app.documents.length){
var myUndo="���V�t�g";varmyAction="";
var myDocLayers=(
 (app.activeDocument.activeLayer.parent.typename=="Document") &&
 (app.activeDocument.activeLayer.typename=="LayerSet")
 )? app.activeDocument.activeLayer:app.activeDocument.activeLayer.parent;
 
var xLinks=(myDocLayers.xLinks)? myDocLayers.xLinks:[];//�v���p�e�B���Ȃ��ꍇ�͏����l��
 var subMotionLayers=new Array();
 if((myDocLayers.typename!="Document")&&(xLinks.length)){
	for(var ix=0;ix<xLinks.length;ix++){if(app.activeDocument.layers[xLinks[ix]]===myDocLayers){continue}
		subMotionLayers.push(app.activeDocument.layers[xLinks[ix]])
	}
}
//�I�����C�������K�w�ł����C���Z�b�g�������ꍇ�̓t�H�[���_�E�����đ���Ώۂ���K�w������i���̑���~�X�͗ǂ�����̂Ńg���b�v���Ă����j�@�t�H�[���_�E���������ă��C����0�̃g���[���[�𑀍삷��\�����o���̂ł���Ƀg���b�v
myAction="if(myDocLayers.layers.length>1){var mxId=myDocLayers.layers.length-1; app.activeDocument.activeLayer=myDocLayers.layers[mxId];myDocLayers.layers[mxId].move(myDocLayers.layers[0],ElementPlacement.PLACEBEFORE);if(subMotionLayers.length){for(var lx=0;lx<subMotionLayers.length;lx++){if(subMotionLayers[lx].layers.length){subMotionLayers[lx].layers[subMotionLayers[lx].layers.length-1].move(subMotionLayers[lx].layers[0],ElementPlacement.PLACEBEFORE);}}}}";
if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{eval(myAction)}
}
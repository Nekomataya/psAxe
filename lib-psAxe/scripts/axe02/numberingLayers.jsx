/*
	�I�����C���̃g���[���[�����i���o�����O����;3���ԍ�
*/
var myLayers=app.activeDocument.activeLayer;
if(myLayers.typename =="ArtLayer"){myLayers=myLayers.parent};
var currentNumber=1;
for(var ix=myLayers.layers.length-1;ix>=0;ix--){
	myLayers.layers[ix].name=myLayers.name+("00000").slice(0,3-currentNumber.toString().length)+currentNumber.toString();
	currentNumber++;
}

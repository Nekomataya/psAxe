//�g���[�����̍ł���̕\�����C�����A�N�e�B�u�ɂ���
if(app.documents.length){
var myUndo="�\�����C�����A�N�e�B�u";var myAction="";
var myDocLayers=app.activeDocument.activeLayer.parent;
myAction="for(var idx=0;idx<myDocLayers.layers.length;idx++){if(myDocLayers.layers[idx].visible){app.activeDocument.activeLayer=myDocLayers.layers[idx];break;}};";

if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
}

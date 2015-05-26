//トレーラ内の最も上の表示レイヤをアクティブにする
if(app.documents.length){
var myUndo="表示レイヤをアクティブ";var myAction="";
var myDocLayers=app.activeDocument.activeLayer.parent;
myAction="for(var idx=0;idx<myDocLayers.layers.length;idx++){if(myDocLayers.layers[idx].visible){app.activeDocument.activeLayer=myDocLayers.layers[idx];break;}};";

if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
}

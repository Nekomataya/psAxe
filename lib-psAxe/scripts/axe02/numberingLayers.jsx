/*
	選択レイヤのトレーラー内をナンバリングする;3桁番号
*/
var myLayers=app.activeDocument.activeLayer;
if(myLayers.typename =="ArtLayer"){myLayers=myLayers.parent};
var currentNumber=1;
for(var ix=myLayers.layers.length-1;ix>=0;ix--){
	myLayers.layers[ix].name=myLayers.name+("00000").slice(0,3-currentNumber.toString().length)+currentNumber.toString();
	currentNumber++;
}

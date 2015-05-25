/*
	オニオンスキン処理３枚(2枚透過)
	ons3.jsx
	アクティブレイヤの存在するレイヤセット内で処理
	最も上の表示レイヤをキーにする
	実行後はキーレイヤをアクティブにする。
*/
nas=app.nas;

var myOpc=nas.axe.onsOpc*100;
var myDocLayers=app.activeDocument.activeLayer.parent.layers;
var myCount=2;
for(var idx=0;idx<myDocLayers.length;idx++){
	if(myDocLayers[idx].visible){keyIndex=idx;
	var TRp=(myDocLayers[idx].opacity>=100);
	break;
	}
};
for(myOffset=0;myOffset<myCount;myOffset++){
	if((keyIndex+myOffset-1)<myDocLayers.length){
		myDocLayers[keyIndex+myOffset].opacity=(TRp)?myOpc:100;
	}
};
if(((keyIndex+myOffset+1)<myDocLayers.length)&&(myDocLayers[keyIndex+myOffset+1].opacity < 100)){myDocLayers[keyIndex+myOffset+1].opacity=100;}
app.activeDocument.activeLayer=myDocLayers[keyIndex];

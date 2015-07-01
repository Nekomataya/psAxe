/*
		Photoshop　レイヤぱらぱら
	アクティブレイヤのあるレイヤコレクションをパラパラできるようにするよ
	簡易アニメチェックにどうぞ。色塗りのパカ探しとか。指パラみたいなもんです。
	photoshopのアニメ機能を使うのでCS2以上が必要です
*/
	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　フリップアイテム数が1以下なら終了
	//選択レイヤ取得
if((app.activeDocument.activeLayer.parent.typename=="Document") && (app.activeDocument.activeLayer.typename=="LayerSet")){
	var myLayers=app.activeDocument.activeLayer.layers;
}else{
	var myLayers=app.activeDocument.activeLayer.parent.layers;
}
		if(myLayers.length<=1){exFlag=false;};
	}
//アプリケーションにnasオブジェクトがあれば使用　なければ処理中断
	if(app.nas){ nas=app.nas;}else{exFlag=false;}

	if(exFlag){
//=========================================main 
		//表示初期化 
		//アニメーションテーブル初期化
		nas.axeAFC.initFrames();
		//選択レイヤの表示を初期化(最も下のレイヤのみ表示してほかをオフ)
		for(var ix=0;ix<myLayers.length;ix++){myLayers[ix].visible=(ix==(myLayers.length-1))?true:false;}
//rootトレーラのレイヤ数を控える
var myRootCount=app.activeDocument.layers.length;
		//第二フレーム以降を表示を切り替えつつアニメフレームに登録
		for(var idx=myLayers.length-1;idx>0;idx--){
			nas.axeAFC.duplicateFrame();//作る（フォーカス移動）
if(myRootCount<app.activeDocument.layers.length){
//ルート第一レイヤを捨ててモードを切り替える
 app.activeDocument.layers[0].remove();
//=======================================================animationNewLayerPerFrame
 var descANPF = new ActionDescriptor();
 var refANPF = new ActionReference();
 refANPF.putEnumerated( charIDToTypeID( "Mn  " ), charIDToTypeID( "MnIt" ), stringIDToTypeID( "animationNewLayerPerFrame" ) );
 descANPF.putReference( charIDToTypeID( "null" ), refANPF );
 executeAction( charIDToTypeID( "slct" ), descANPF, DialogModes.NO );
}
			myLayers[idx].visible=false;
			myLayers[idx-1].visible=true;
		}

//==============================================================
nas.axeAFC.selectFrame(1);//最後に第一フレームにフォーカスしておく


	}else{alert(nas.localize(nas.uiMsg["noLayers"]));};//"展開するレイヤがありません"

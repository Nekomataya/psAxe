/*
	選択レイヤをアニメーションフレームへ展開する。主にプレビュー用だが需要は高そう
*/
	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){exFlag=false;}
//アプリケーションにnasオブジェクトがあれば使用　なければ処理中断
	if(app.nas){ nas=app.nas;
 //選択レイヤ取得
		var myLayers=nas.axeCMC.getItemsById(nas.axeCMC.getSelectedItemId());
//起動時にレイヤコレクションの状態を確認　フリップアイテム数が1以下なら終了
		if(myLayers.length<=1){exFlag=false;};
	}else{exFlag=false;}
	if(exFlag){
//=========================================main
		//表示初期化 
		//アニメーションテーブル初期化
		nas.axeAFC.initFrames();
//rootトレーラのレイヤ数を控える
var myRootCount=app.activeDocument.layers.length;
		//選択レイヤの表示を初期化(全て表示オフ)(取得を逆順にしたのでここ変更)
		for(var ix=0;ix<myLayers.length;ix++){myLayers[ix].visible=(ix==(myLayers.length-1))?true:false;}


		//第二フレーム以降を表示を切り替えつつアニメフレームに登録
		for(var idx=1;idx<myLayers.length;idx++){
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
			myLayers[idx].visible=true;
			myLayers[idx-1].visible=false;
		}

//==============================================================
selectFrame(1);//最後に第一フレームにフォーカスしておく


	}else{alert(localize(nas.uiMsg["noLayers"]));}
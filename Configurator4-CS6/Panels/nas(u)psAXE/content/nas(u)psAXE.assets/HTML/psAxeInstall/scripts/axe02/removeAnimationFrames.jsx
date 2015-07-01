/*(アニメフレームの削除)
	フレームアニメーションを初期化する
*/
//Photoshop用ライブラリ読み込み
	nas=app.nas;

//+++++++++++++++++++++++++++++++++ここまで共用
ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");
try{
		//アニメーションテーブル初期化
		//アニメウィンドウを初期化する＞要するに全て消す
		nas.axeAFC.initFrames();//初期化
//	アニメーションフレームを削除する目的がドキュメントの初期化なので、
//	ここでフレームの全表示とオニオンスキンのクリアを行う
		var myDocLayers=app.activeDocument.activeLayer.parent.layers;
		for(var idx=0;idx<myDocLayers.length;idx++){
		 var myTarget=myDocLayers[idx];
//visibleプロパティがfalseのオブジェクトは他のプロパティ操作がロックされるのでvisibleの操作を先行
		if(myTarget.visible!=true){myTarget.visible=true};
		if(myTarget.opacity!=100.0){myTarget.opacity=100.0};
		}
		app.activeDocument.activeLayer=myDocLayers[0];//全表示したので0番をアクティブ

} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};


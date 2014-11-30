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
	if(exFlag){

//アニメウインドウ操作関数　現状取得ができないのはヘボいが今のトコはカンベン　後で整理する
/*
	復帰は不要でトレーラー内部の表示状態だけセットするスクリプトをまず作る
	フレームは初期化！
*/
setDly=function(myTime){
// =======================================================アニメーションウィンドウの最初のフレームの遅延を設定
var idsetd = charIDToTypeID( "setd" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
	
    var idT = charIDToTypeID( "T   " );
        var desc2 = new ActionDescriptor();
        var idanimationFrameDelay = stringIDToTypeID( "animationFrameDelay" );
        desc2.putDouble( idanimationFrameDelay, myTime );
    var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
    desc.putObject( idT, idanimationFrameClass, desc2 );
executeAction( idsetd, desc, DialogModes.NO );
}
dupulicateFrame=function(){
// =======================================================フレーム複製
var idDplc = charIDToTypeID( "Dplc" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDplc, desc, DialogModes.NO );
}
selectFrame=function(idx){
// =======================================================フレーム選択(1/6)
var idslct = charIDToTypeID( "slct" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        ref.putIndex( idanimationFrameClass, idx );
    desc.putReference( idnull, ref );
var M=executeAction( idslct, desc, DialogModes.NO );
}
selectFramesAll=function(){
// =======================================================フレーム全選択
var idanimationSelectAll = stringIDToTypeID( "animationSelectAll" );
    var desc = new ActionDescriptor();
executeAction( idanimationSelectAll, desc, DialogModes.NO );
}
removeSelection=function(){
// =======================================================選択フレーム削除
var idDlt = charIDToTypeID( "Dlt " );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDlt, desc, DialogModes.NO );
}
//アニメーションフレームをアクティブにする（正逆順送り）セレクトとアクティブが別概念のようなので注意だ
activateFrame=function(kwd){
//kwd = Nxt ,Prevs,Frst(各４バイト)
var idanimationFrameActivate = stringIDToTypeID( "animationFrameActivate" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
		var idX = charIDToTypeID( kwd );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idX );
    desc.putReference( idnull, ref );
executeAction( idanimationFrameActivate, desc, DialogModes.NO );
}
//=======================================================アニメーションフレームをクリア（初期化）
initFrames=function(){
var idDlt = charIDToTypeID( "Dlt " );
 var desc = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref = new ActionReference();
 var idanimationClass = stringIDToTypeID( "animationClass" );
 var idOrdn = charIDToTypeID( "Ordn" );
 var idTrgt = charIDToTypeID( "Trgt" );
 ref.putEnumerated( idanimationClass, idOrdn, idTrgt );
 desc.putReference( idnull, ref );
 executeAction( idDlt, desc, DialogModes.ALL );
}


//=========================================main 
		//表示初期化 
		//アニメーションテーブル初期化
		initFrames();
		//選択レイヤの表示を初期化(最も下のレイヤのみ表示してほかをオフ)
		for(var ix=0;ix<myLayers.length;ix++){myLayers[ix].visible=(ix==(myLayers.length-1))?true:false;}
//rootトレーラのレイヤ数を控える
var myRootCount=app.activeDocument.layers.length;
		//第二フレーム以降を表示を切り替えつつアニメフレームに登録
		for(var idx=myLayers.length-1;idx>0;idx--){
			dupulicateFrame();//作る（フォーカス移動）
if(myRootCount<app.activeDocument.layers.length){
//ルート第一レイヤを捨ててモードを切り替える
 app.activeDocument.layers[0].remove();
//=======================================================animationNewLayerPerFrame
 var idslct = charIDToTypeID( "slct" );
 var desc195 = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref172 = new ActionReference();
 var idMn = charIDToTypeID( "Mn  " );
 var idMnIt = charIDToTypeID( "MnIt" );
 var idanimationNewLayerPerFrame = stringIDToTypeID( "animationNewLayerPerFrame" );
 ref172.putEnumerated( idMn, idMnIt, idanimationNewLayerPerFrame );
 desc195.putReference( idnull, ref172 );
 executeAction( idslct, desc195, DialogModes.NO );
}
//			alert(this.playList[idx]);
			myLayers[idx].visible=false;
			myLayers[idx-1].visible=true;
		}

//==============================================================
selectFrame(1);//最後に第一フレームにフォーカスしておく


	}else{alert("なんだかパタパタするものが無いみたい");}
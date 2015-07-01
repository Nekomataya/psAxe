/*(レイヤ名ラベル部分を変更)
引数がない場合は何もせずに終了
ドキュメントがない、アクティブレイヤがないなどのケースもなにもせずに復帰
指定文字列が現在のレイヤ名と一致している場合は処理をスキップする
*/
//arguments=[];
//arguments.push("DDD",true);
//alert (arguments.length);
if(app.documents.length)
{
/* 最初に引数を取得　引数はarguments配列の内容を確認*/
var myLabel;		//undefで初期化
var myLabelOpt=false;	//falseで初期化

try{
myLabel=arguments[0];
myLabelOpt=arguments[1];
}catch(er){}
if(myLabel !== void(0)){

	var getSelectedLayers=function(){ 
		//限定動作　背景レイヤが含まれているときにはエラーだけどとりあえず無視 選択レイヤがない場合もエラーだけどそれも無視
//--------------------------------------レイヤからグループ
 var idGrp = stringIDToTypeID( "groupLayersEvent" );
 var descGrp = new ActionDescriptor();
 var refGrp = new ActionReference();
 refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
 descGrp.putReference(charIDToTypeID( "null" ), refGrp );
 executeAction( idGrp, descGrp, DialogModes.ALL );//外部関数にして呼び出しすると妙に遅いので注意だ
//差分を取得してフレーム数を取得
//================== トレーラーのレイヤ数を取得
var resultLayers=new Array();
for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
// =================== UNDOバッファを使用して復帰
var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var id10 = charIDToTypeID( "HstS" );
        var id11 = charIDToTypeID( "Ordn" );
        var id12 = charIDToTypeID( "Prvs" );  
        ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
executeAction( id8, desc5, DialogModes.NO );
return resultLayers;
//選択レイヤの復帰はしない(不要)
}

/*
汎用的にすべてのレイヤをフラットモデルで返す関数の方がベンリそうである。なにかと
と。いうわけで書く
ドキュメントというよりトレーラ単位

	getAllLayers(trailer)
	引数	:レイヤコレクション Document.layers または LayerSets.layers
	戻り値	:そのトレーラ配下のレイヤをフラットな配列で

トレーラ自身は含まない
レイヤトレーラを引数に再帰的に
この方式だと配列のインデックスが反転するので注意
上から０番

インデックスはどうも意味がなくなったようでござんす　2014/11/03
*/
function getAllLayers(myTrailer){
	var myResult=new Array();//戻り値ローカルに
	for(var layerId=0;layerId < myTrailer.length;layerId++){
		//	レイヤをリザルトに積む
		myResult.push(myTrailer[layerId]);
		//	さらにレイヤがトレーラだった場合 再帰呼び出しをかけてリザルトを結合
		//　cs4ではLayerSetのインスタンス比較できないtypenameを比較
		if((myTrailer[layerId].typename=="LayerSet")&&(myTrailer[layerId].layers.length)){
//            alert("detect no empty LayerSet " + myTrailer[layerId].name);
			myResult=myResult.concat(getAllLayers(myTrailer[layerId].layers));
		}
	}
//	各要素に現状の反転IDをのっける(後で使える)
	for(var idx=0;idx<myResult.length;idx++){
        myResult[idx].index=(myResult.length-idx-1);
        };
//	フラットなレイヤトレーラ配列を返す
	return myResult;
}

function addSelect(lyNm)
{
//名前指定に変更　どうもIDは使わないほうが良さそう
//追加選択(Shit+Ctrl+Click)
//これ違う　Ctrl+Click　が必要
//Indexは数値下から順に0からレイヤ数-1　まで
//Ｉｎｄｅｘは整数下から順で1からレイヤ数まで（CS4 CS3と５は未確認） 
//if(app.version.split(".")[0]>10){TslIndex++;};
    var idSlct = charIDToTypeID( "slct" );
    var slctDescriptor = new ActionDescriptor();
    var idNull = charIDToTypeID( "null" );
    var LyrRef = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
//    	LyrRef.putIndex( idLyr, TslIndex );
   	LyrRef.putName( idLyr, lyNm );
    	slctDescriptor.putReference( idNull, LyrRef );
    var siMod = stringIDToTypeID( "selectionModifier" );
    var siModType = stringIDToTypeID( "selectionModifierType" );
//    var idAddSlct = stringIDToTypeID( "addToSelectionContinuous" );
    var idAddSlct = stringIDToTypeID( "addToSelection" );
    	slctDescriptor.putEnumerated( siMod, siModType, idAddSlct );
    var idMkVs = charIDToTypeID( "MkVs" );
    	slctDescriptor.putBoolean( idMkVs, false );
    executeAction( idSlct, slctDescriptor, DialogModes.NO );
}

//Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
}
//+++++++++++++++++++++++++++++++++ここまで共用


// var allLayers=getAllLayers(app.activeDocument.layers);
//復帰用インデックスを振るために空で実行する意味が消失したようです　IDがレイヤ構成の見た目と一致せずに不定になっているのでアウト

//第二引数オプションがtrueの場合のみ以下を実行（選択レイヤを処理）
/*
    分岐　オプションtrue/false
	アクティブレイヤが第一階層のレイヤセットだった場合は、レイヤセットのラベルを可能なら変更して　レイヤセット内のレイヤ名のラベル部分を更新　２ステップ複数ファイル
	アクティブレイヤが第一階層のアートレイヤだった場合は、そのレイヤのラベル部分のみを更新　１ステップ
	それ以外の場合は、親レイヤトレーラーのラベルを更新してその内包するレイヤ名を更新　２ステップ複数ファイル
	オプションありの場合とターゲットの取得方法が異なる
	引数の末尾が数値の場合はハイフンを追加する
	ターゲットの選定が異なるが、処理は同じなので処理部分を抽出して調整
 */
switch(myLabelOpt){
case "selection":
//var myTargetLayers=getSelectedLayers();//現在の選択レイヤを取得　ただし同一トレーラー内のレイヤのみが取得可能
try{
var myTargetLayers=nas.axeCMC.getItemsById(nas.axeCMC.getSelectedItemId());
//新ライブラリによる取得。背景・レイヤセットも取れる背景のみの場合はやはり失敗
}catch(er){
var myTargetLayers=[];
}
break;
case "auto":
var myTargetLayers=[];
	  if(app.activeDocument.activeLayer.parent.typename == "Document"){
		//第一階層
		if ((app.activeDocument.activeLayer.typename == "LayerSet")&&(app.activeDocument.activeLayer.layers.length)){
			//第一階層のレイヤセットで内包レイヤがある
		  for(var idx=0;idx<app.activeDocument.activeLayer.layers.length;idx++){
			myTargetLayers.push(app.activeDocument.activeLayer.layers[idx]);
			}
 	            myTargetLayers.push(app.activeDocument.activeLayer);
		}
	  }else{
		//第二階層以下なので親とその内包レイヤをターゲットにセット
		  for(var idx=0;idx<app.activeDocument.activeLayer.parent.layers.length;idx++){
			myTargetLayers.push(app.activeDocument.activeLayer.parent.layers[idx]);
			}
		     myTargetLayers.push(app.activeDocument.activeLayer.parent);
	　}
break;
case "swap":
 var myTargetLayers=[];
		     myTargetLayers.push(app.activeDocument.activeLayer);

  }

if(myTargetLayers.length){

//実処理
   for (var ix=0;ix<myTargetLayers.length;ix++){
if ((myTargetLayers[ix].typename=="LayerSet")&&(myTargetLayers[ix].parent.typename == "Document")){
        if(myTargetLayers[ix].name!=myLabel){myTargetLayers[ix].name=myLabel};
}else{
       var spLt=(myLabel.match(/\d$/))?"-":"";
       if(myTargetLayers[ix].name.match(/^(.*[^\d])?(\d+)([^0-9]?.*)$/)){
           if(myTargetLayers[ix].name!=(myLabel+spLt+RegExp.$2+RegExp.$3)){myTargetLayers[ix].name=myLabel+spLt+RegExp.$2+RegExp.$3} ;
       }else{
           if(myTargetLayers[ix].name!=myLabel){myTargetLayers[ix].name=myLabel };
       };     
}
   }
		if(false){
	for (var ix=0;ix<myTargetLayers.length;ix++){
//addSelect(myTargetLayers[ix].name);
	}
		}
}
}
 }
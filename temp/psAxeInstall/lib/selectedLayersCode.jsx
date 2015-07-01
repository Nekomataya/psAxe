/*
	　複数レイヤの選択を支援する関数イロイロ
*/
/*
むつかしい

えーっと
Photoshopのレイヤのリンク状態は、レイヤセット発生以来かなり(あやしげに)複雑なので互換の構造を作るのがキモになりそう?

リンクの挙動を見るかぎりは、3.0のころの最初のレイヤのリンクとデータ互換のあるフラットモデルのようです。
その上にレイヤセットで発生するリンクと類似する(一部同一の)動作を似たような構造でオーバーライドさせているカンジに見えます。

スクリプト側から見える状況は、むかしのフラットモデルのままなのでこの状況の再現をしてあげればなんとなく済みかなぁ。

ポイントを並べると

現在のリンク状況を模したオブジェクトを作ってそこにリンク状態を記録する


	保存する情報は、レイヤオブジェクトへの参照
	リンク情報自体がフラットなモデルなので格納用オブジェクトは単純な配列で良い
	最初に当たったレイヤからレイヤを記録するので最初にチェック済みか否かの判定が必要
	フラットなトレーラはあるのか?>ない 少なくともでてない
	再帰的に処理するファンクションが必要

結局書いてしまった。2008/11/12

*/
/*	countSelectedLayers
	選択レイヤの数をカウントする.
	選択レイヤをグループ化してグループ内のレイヤ数をカウントして返す
	Ｕｎｄｏバッファで復帰する
*/
countSelectedLayers=function(){
	var myLayers=getAllLayers(app.activeDocument.layers);//フラットモデルを別に取得
//--------------------------------------レイヤからグループ
 var idGrp = stringIDToTypeID( "groupLayersEvent" );
 var descGrp = new ActionDescriptor();
 var refGrp = new ActionReference();
 refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
 descGrp.putReference(charIDToTypeID( "null" ), refGrp );
 executeAction( idGrp, descGrp, DialogModes.ALL );//外部関数にして呼び出しすると妙に遅いので注意だ
//差分を取得してフレーム数を取得
//================== トレーラーのレイヤ数を取得
var currentLayerCounts=app.activeDocument.activeLayer.layers.length;
var resultLayers=new Array();
for (var ix=0;ix<currentLayerCounts;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
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

//復帰の際は0番をターゲットにして1番以降をリンクさせる。
if(resultLayers.length>1){
	for(var subLayerId=0;subLayerId < resultLayers.length;subLayerId++){
		alert(resultLayers[subLayerId].index)
			addSelect(resultLayers[subLayerId].index);
		}
}
return resultLayers;
//return currentLayerCounts;
}

/*
	LinkSelLys()
	選択されたレイヤをリンクする
*/
function LinkSelLys()
{//tryかけて失敗を判定する(できるか？)
//選択レイヤーをリンク付け
    var lID1 = stringIDToTypeID( "linkSelectedLayers" );
    var lDesc1 = new ActionDescriptor();
    var lID2 = charIDToTypeID( "null" );
    var lRef1 = new ActionReference();
    var lID3 = charIDToTypeID( "Lyr " );
    var lID4 = charIDToTypeID( "Ordn" );
    var lID5 = charIDToTypeID( "Trgt" );
    lRef1.putEnumerated( lID3, lID4, lID5 );
    lDesc1.putReference( lID2, lRef1 );
    executeAction( lID1, lDesc1, DialogModes.ALL );
}
//******************************************************************************

function UnLinkSelLys()
{
//選択レイヤーのリンク解除
    var uID1 = stringIDToTypeID( "unlinkSelectedLayers" );
    var uDesc1 = new ActionDescriptor();
    var uID2 = charIDToTypeID( "null" );
    var uRef1 = new ActionReference();
    var uID3 = charIDToTypeID( "Lyr " );
    var uID4 = charIDToTypeID( "Ordn" );
    var uID5 = charIDToTypeID( "Trgt" );
    uRef1.putEnumerated( uID3, uID4, uID5 );
    uDesc1.putReference( uID2, uRef1 );
    executeAction( uID1, uDesc1, DialogModes.NO );

}
//******************************************************************************

function addSelect(TslIndex)
{
//追加選択(Shit+Ctrl+Click)
//Indexは数値下から順に0からレイヤ数-1　まで
//Ｉｎｄｅｘは整数下から順で1からレイヤ数まで（CS4 CS3と５は未確認） 
//if(app.version.split(".")[0]>10){TslIndex++;};
    var oID12 = charIDToTypeID( "slct" );
    var oDesc3 = new ActionDescriptor();
    var oID13 = charIDToTypeID( "null" );
    var oRef3 = new ActionReference();
    var oID14 = charIDToTypeID( "Lyr " );
    oRef3.putIndex( oID14, TslIndex );
    oDesc3.putReference( oID13, oRef3 );
    var oID15 = stringIDToTypeID( "selectionModifier" );
    var oID16 = stringIDToTypeID( "selectionModifierType" );
    var oID17 = stringIDToTypeID( "addToSelectionContinuous" );
    oDesc3.putEnumerated( oID15, oID16, oID17 );
    var oID18 = charIDToTypeID( "MkVs" );
    oDesc3.putBoolean( oID18, false );
    executeAction( oID12, oDesc3, DialogModes.NO );

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
*/
function getAllLayers(myTrailer){
	var myResult=new Array();//戻り値ローカルに
	for(
		var layerId=0;
		layerId < myTrailer.length;
		layerId++
	){
		//	レイヤをリザルトに積む
		myResult.push(myTrailer[layerId]);
		//	さらにレイヤがトレーラだった場合 再帰呼び出しをかけてリザルトを結合
		//　cs4ではLayerSetのインスタンス比較できないtypenameを比較
		if((myTrailer[layerId].typeName=="LayerSet")&&(myTrailer[layerId].layers.length)){
			myResult=myResult.concat(getAllLayers(myTrailer[layerId].layers));
		}
	}
//	各要素に現状の反転IDをのっける(後で使える)
	for(var idx=0;idx<myResult.length;idx++){myResult[idx].index=(myResult.length-idx-1);};
//	フラットなレイヤトレーラ配列を返す
	return myResult;
}
/*
	getLinkePattern(myTrailer)
	引数	:レイヤトレーラ
	戻り値	:リンク状態配列
*/
function getLinkePattern(myTrailer){
	var targetLayers=getAllLayers(myTrailer);

	var myLinks=new Array();//リンク情報格納用配列を初期化
		myLinks.linkGroupId=0;//便宜上のリンクグループID初期値
		myLinks.checkedLayers=new Array();//チェック済みのレイヤ参照
		myLinks.isChecked=function(myLayer){
		//	引数がチェック済みか否か判定
			var myResult=false;
			for(var lid=0;lid<this.checkedLayers.length;lid++){
				if(this.checkedLayers[lid]===myLayer){myResult=true;break;}
			}
			return myResult;
		}
/*
	フラットモデルレイヤトレーラをチェックしてリンク配列を保存
*/
for(
	var layerId=0;
	layerId < targetLayers.length;
	layerId++
){
	if((targetLayers[layerId].linkedLayers.length)&&(! myLinks.isChecked(targetLayers[layerId]))){
		myLinks[myLinks.linkGroupId]=new Array();
//	未チェックでリンク相手が存在する場合、まず該当レイヤ自体を登録
		myLinks[myLinks.linkGroupId].push(targetLayers[layerId]);
		myLinks.checkedLayers.push(targetLayers[layerId]);
//	リンクのあるレイヤをリンク配列から記録
		for(
			var subLayerId=0;
			subLayerId < targetLayers[layerId].linkedLayers.length;
			subLayerId++
		){
			myLinks[myLinks.linkGroupId].push(targetLayers[layerId].linkedLayers[subLayerId]);
			//配列にレイヤをプッシュ
			myLinks.checkedLayers.push(targetLayers[layerId].linkedLayers[subLayerId]);
			//チェック配列にレイヤをプッシュ
		}
		myLinks.linkGroupId++;//インクリメント
	}
}

	return	myLinks;
}
/*
	getSelectedLayers(myDocument)
	引数	:ドキュメントオブジェクト 省略時はアクティブドキュメント
	戻り値	:選択されたレイヤの配列 非選択状態では空配列が戻る
*/

function getSelectedLayers(myDocument){
	var mySelectedLayers=new Array()//リザルト配列;
	var myLayers=getAllLayers(myDocument.layers);//フラットモデルを別に取得

	var mySelectedLayers=countSelectedLayers();//セレクト取得
//復帰の際は0番をターゲットにして1番以降をリンクさせる。
		for(var subLayerId=1;subLayerId < mySelectedLayers;subLayerId++){
			mySelectedLayers[subLayerId].link(mySelectedLayers[0]);
		}
	return mySelectedLayers;
	var selectedCount=countSelectedLayers();//セレクト数判定
if(selectedCount>1){

var origLinks=getLinkePattern(myDocument.layers);//最初のリンク状態を記録

var checkBoard=new Array(myLayers.length);

	UnLinkSelLys();//選択レイヤのリンクを解除

for(var idx=0;idx<myLayers.length;idx++){
	if(myLayers[idx].linkedLayers.length){
		checkBoard[idx]=false;
	}else{
		checkBoard[idx]=true;
	};
}


	LinkSelLys();//選択部分のリンクを作る
for(var idx=0;idx<myLayers.length;idx++){
	if((myLayers[idx].linkedLayers.length)&&(checkBoard[idx])){
		mySelectedLayers.push(myLayers[idx]);
	};
}

	UnLinkSelLys();//選択レイヤのリンクを解除

/*
	もとのリンクを再生
*/
	for(
		var layerId=0;
		layerId < origLinks.length;
		layerId++
	){
//復帰の際は0番をターゲットにして1番以降をリンクさせる。
		for(var subLayerId=1;subLayerId < origLinks[layerId].length;subLayerId++){
			origLinks[layerId][subLayerId].link(origLinks[layerId][0]);
		}
	};
//壊れた選択状態を復帰
//indexは　idxから計算　length-index
for(var idx=0;idx<mySelectedLayers.length;idx++){addSelect(mySelectedLayers[idx].index);}
}else{
//	alert("noMultiSelectedLayers");
	mySelectedLayers.push(app.activeDocument.activeLayer);
}
return mySelectedLayers;
}

/*
	LinkSelLys()
	引数	:なし
	戻り値	:なし
		現在選択されているレイヤをリンクに

	UnLinkSelLys()
	引数	:なし
	戻り値	:なし
		現在選択されているレイヤのリンクを解除

	addSelect(TslIndex)
	引数	:レイヤID（下から順）
	戻り値	:なし
		レイヤを選択状態にする

	getAllLayers(trailer)
	引数	:レイヤコレクション Document.layers または LayerSets.layers
	戻り値	:指定コレクション以下のすべてのレイヤを含む配列
		指定のトレーラ配下のレイヤをフラットな配列で返す。
		Layer.indexプロパティが追加されていますが、このindexが有効なのは
		指定のレイヤトレーラがDocument.layersの場合のみです。
		LayerSet.layersを指定した場合は、無効な値が付加されます。
		
	getLinkePattern(myTrailer)
	引数	:レイヤトレーラ
	戻り値	:リンク状態配列
		現在のリンク状態を配列で返す。
		[[Layer,Layer,Layer],[Layer,Layer]]
		配列の要素は呼び出し時点で相互に連結されたレイヤへの参照の配列です。

	getSelectedLayers(myDocument)
	引数	:ドキュメントオブジェクト 省略時はアクティブドキュメント
	戻り値	:選択されたレイヤの配列 非選択状態では空配列が戻る
		現在選択されているレイヤへの参照が格納された配列
		それぞれの要素にはindexプロパティが付加されている。
		このindexはアクション操作を行う際にレイヤインデックスとして使用可能です。
		（addSelect()の引数として使用可能）

このプログラムは関数の集合なのでご使用の際は以下の部分を切り取ってご使用くださいね
*/
// テスト用使用参考例
/*
	以下のように現在選択中のレイヤを配列で取得
	元来のレイヤオブジェクトに加えてindexプロパティが上乗せされている
	indexの値はファイルを下側から順に０で開始して１づつ増加する番号
	
*/
if(true){
var mySelectedLayers=countSelectedLayers();
myText="selectedLayers:\n";
for(var idx=0;idx<mySelectedLayers.length;idx++){
	myText+=idx.toString()+"\t:";
	myText+=mySelectedLayers[idx].toString()+"\t";
	myText+=mySelectedLayers[idx].index+"\n";
};
alert(myText);
}

//alert(countSelectedLayers());
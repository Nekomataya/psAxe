/*(レイヤ名末尾の数値部分を繰り下げ)
*/
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
	for(var idx=0;idx<myResult.length;idx++){
        myResult[idx].index=(myResult.length-idx-1);
        };
//	フラットなレイヤトレーラ配列を返す
	return myResult;
}

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

var allLayers=getAllLayers(app.activeDocument.layers);//復帰用インデックスを振るために空で実行

var myTargetLayers=getSelectedLayers();


if(myTargetLayers.length){
	if(! app.nas){
//iclude nasライブラリに必要な基礎オブジェクトを作成する
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
//	ライブラリのロード
//==================== ライブラリを登録して事前に読み込む
/*
	includeLibs配列に登録されたファイルを順次読み込む。
	登録はパスで行う。(Fileオブジェクトではない)
	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む
*/
if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
var includeLibs=[nasLibFolderPath+"config.js",nasLibFolderPath+"nas_common.js"];
for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile ファンクションがあれば実行する
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile が存在しないバージョンではevalにファイルを渡す
		var scriptFile = new File(myScriptFileName);
		if(scriptFile.exists){
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}
	}else{
	nas=app.nas;
	}
	for (var ix=0;ix<myTargetLayers.length;ix++){
myTargetLayers[ix].name=nas.incrStr(myTargetLayers[ix].name,-1,true);
        for(var aix=0;aix<allLayers.length;aix++){
            if(myTargetLayers[ix]===allLayers[aix]){myTargetLayers[ix].index=allLayers[aix].index;break;}
        }
	}
var Xid=[];
	for (var ix=0;ix<myTargetLayers.length;ix++){
//alert(myTargetLayers[ix].index);
addSelect(myTargetLayers[ix].index);
Xid.push(myTargetLayers[ix].index);
	}
alert(Xid.toSource())
}
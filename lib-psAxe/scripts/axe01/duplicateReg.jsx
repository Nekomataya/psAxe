/*	duplicateReg.jsx
	レジスタマークを選択レイヤに貼り付けるスクリプト
	レジスタの画像はドキュメント内にあらかじめレイヤとして読み込んでおく必要がある
	基本は、///frame/peg この名前以外の場合はリストから選択する
	レジスタレイヤを選択された各レイヤの上に複製して統合。モード、透明度には手をつけない
	
	読み込みは別のスクリプトまたは手作業
*/
if(app.documents.length){
	var myTarget=app.activeDocument;
	getSelectedLayers=function(){ 
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
//選択レイヤの復帰はしない
}
 //テンプレートの取得
 	var myTempalte=false;
	for (var ix=0;ix<myTarget.layers.length;ix ++){
		if(
		 (myTarget.layers[ix].name=="peg")&&(
		  (myTarget.layers[ix].kind==LayerKind.NORMAL)||
		  (myTarget.layers[ix].kind==LayerKind.SMARTOBJECT)
		 )
		){
		//ドキュメント第一階層のノーマル（スマートオブジェクト）レイヤで名前が"peg"
			myTempalte=myTarget.layers[ix];break;
		}
		if(myTarget.layers[ix].name.match(/(frames?|フレーム)/i)){
		//ドキュメント第二階層の"peg"レイヤでノーマル（スマートオブジェクト）レイヤ
		try{myTempalte=myTarget.layers[ix].layers.getByName("peg");}catch(err){myTempalte=false;}
		if(
		 (myTempalte)&&(
		  (myTempalte.kind==LayerKind.NORMAL)||
		  (myTempalte.kind==LayerKind.SMARTOBJECT)
		 )
		){break;}

		}
	}
	if(myTempalte){
		//選択レイヤ取得
		var myLayers=getSelectedLayers();
        var myUndo="タップ貼付";var myAction="";
			//ノーマルレイヤ時のみ処理 ペグレイヤ自体ならスキップ
myAction="for (var ix=0;ix<myLayers.length;ix ++){if((myLayers[ix].kind==LayerKind.NORMAL)&&(myLayers[ix]!==myTempalte)){var myLayerOpc=myLayers[ix].opacity;if (myLayerOpc<100){myLayers[ix].opacity=100.0;};var myPegLayer=myTempalte.duplicate(myLayers[ix],ElementPlacement.PLACEBEFORE);var newLayer=myPegLayer.merge();newLayer.opacity=myLayerOpc;}};"
if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
	}else{
	alert(nas.localize({en:"no peg(register) layer found!",ja:"タップ（トンボ）レイヤを取得できませんでした"}));
	}
}else{
    alert("no Documents")
}
/*(レイヤ名末尾の数値部分を繰り上げ)
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
//	CS3以降は　$.fileNameオブジェクトがあるのでローションフリーにできる
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
myTargetLayers[ix].name=nas.incrStr(myTargetLayers[ix].name,1,true);
	}
}
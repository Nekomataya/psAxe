/*lineSplit.jsx
	彩色用にレイヤを前処理する(トレース前処理)

	線画を分離して黒成分と、色彩成分のレイヤに分けて配置します。
	白部分は背景成分として除去されます。

	起動時のドキュメントの表示状態を合成して、各成分に分離後ドキュメントの最上位に配置します。
	画像の状態には手をつけませんが、多数の新規レイヤが発生します。
	可能な限り線画１レイヤの状態で実行することをお勧めします。

*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();

  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){

/*
	アプリケーションフォルダに Pixel Bender Files フォルダの有無をチェックして
	Pixel Bender Kernel が使用可能なPhotoshopか否か判定する
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}

// exPBK = false; //試験用

//共通処理//彩色用に統合画像をバッファに取る。
app.activeDocument.selection.selectAll();
app.activeDocument.selection.copy(!((app.activeDocument.layers.length==1)&&(app.activeDocument.activeLayer.isBackgroundLayer)));
var myLayer=app.activeDocument.paste();

myLayer.name="ColorLayer";
var myCopy=myLayer.duplicate();
myCopy.name="myCopy";

//ターゲットは自動的にアクティブになるはずだが、一応アクティベートする

app.activeDocument.activeLayer=myCopy;

if(exPBK)
{
// =======================================================PixelBenderフィルタ(pbk)
/*	applyPbk(myPBK,knlName,[[control,value]],dialog)
引数
	myPBK	フィルタ記述 カテゴリ+フィルタ名(文字列)
	control	コントロール記述(文字列)
	value	コントロールの値(数値)
	dialog	ダイアログモード(文字列 "ALL""ERROR""NO")[省略可]
戻り値
	特になし(undefeined)
	pixel bender karnel　をスクリプトから適用する関数
	引数myPBKはカーネルファイル又はファイルパスで
	存在しないカーネルファイルが指定された場合は、動作をスキップ
*/
applyPbk=function(myPBK,knlName,fVA,dMode){
 if(! dMode){dMode="NO"}
 if(! dMode.match(/(ALL|ERROR)/)){dMode="NO";};
 if(! fVA){fVA=[];}
 if(! knlName ) knlName=false;
 if(!(myPBK instanceof(File))){myPBK=new File(myPBK);};//ファイルオブジェクトでなければ新規ファイル

	if((myPBK.exists)&&(knlName)){
// =======================================================pbk適用(パラメタあり)
var idPbPl = charIDToTypeID( "PbPl" );//pbk識別文字列
    var descPbk = new ActionDescriptor();//アクションディスクリプタを作る

    var idKnNm = charIDToTypeID( "KnNm" );//KarNel NaMe
    descPbk.putString( idKnNm, knlName );//カーネル識別名設定(たぶんUndoの識別名のみ)

    var idGpuY = charIDToTypeID( "GpuY" );//GPU使用フラグ(現在使用側に固定　判定して調整は多分必要　引数制御か？)
    descPbk.putBoolean( idGpuY, true );//同設定

    var idLIWy = charIDToTypeID( "LIWy" );//不明な識別子
    descPbk.putBoolean( idLIWy, true );//同設定 - これは決め打ちで残す

    var idFPth = charIDToTypeID( "FPth" );//ファイルパス識別子
    descPbk.putString( idFPth, myPBK.fsName );//ファイルパス設定
//パラメタがある数だけ繰り返して設定　現在パラメタの種別はFloatのみで決め打ち(汎用性なし)
//idは自動生成 アルファベット1巡で打ち止め
//aa,ab,ac,ad,ae~と連続
 var exText=new Array();
 for(var ix=0;ix< fVA.length;ix++){
   var myChar="abcdefghijklmnopqrstuvwxyz".charAt(ix);
   var idPN = charIDToTypeID( "PNa"+myChar );//パラメタ名＋id
   descPbk.putString( idPN, fVA[ix][0] );//パラメタ名設定
   var idPT = charIDToTypeID( "PTa"+myChar );//パラメタに関する何かの識別子+id
   descPbk.putInteger( idPT, 0 );//整数で０を設定している　とりあえずコピー
   var idPF = charIDToTypeID( "PFa"+myChar );//実際にかけたいパラメタの識別子
   descPbk.putDouble( idPF, fVA[ix][1] );//適用パラメタ
 }
 executeAction( idPbPl, descPbk, DialogModes[dMode] );
	}
}
// =======================================================
//nasライブラリパスの取得
if($.fileName){
//	$.fileNameオブジェクトがあれば使用する
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}

/*
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk",
"traceK",
[
["saturation",2.500000],
["backgroundClip",100.000000],
["lineIntensity",20.000000]
],
"NO"
)
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceAll.pbk","traceAll",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk","traceK",[],"ALL");
*/
//applyPbk(nasLibFolderPath+"PixelBenderKernel/traceY.pbk","trace_Y",[["hueOffset",0.],["hueRange",0.3],["strThreshold",20.0],["backgroundClip",100.0],["lineIntensity",0.]],"ALL");
/*
	スキャンライン調整は、
	背景色にバックグラウンドの代表色 / 前景色に主線の暗い部分
	を設定して実行すること
(colorParams.bgc.i/255)*0.9 をバックグラウンドクリップ
((255+colorParams.fgc.i)/512)　をライン強度する
	彩度パラメータは両方の指定色の彩度の大きい方を3倍程度に拡張してしきい値とする

*/
/*
alert([
["saturation",(colorParams.bgc.m+colorParams.fgc.m)*2],
["backgroundClip",(colorParams.bgc.i/255.)*90.],
["lineIntensity",(colorParams.fgc.i+255)/512]
])
*/
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk","traceK",[],"NO");

}else{
// =======================================================通常フィルタ(8BM)
/*	applyFilter(filterDescription,[[control,value]],dialog)
引数
	filterDescription	フィルタ記述 カテゴリ+フィルタ名(文字列)
	control	コントロール記述(文字列)
	value	コントロールの値(数値)
	dialog	ダイアログモード(文字列 "ALL""ERROR""NO")[省略可]
戻り値
	特になし(undefeined)
 */
applyFilter=function(fD,fVA,dMode){
if (fVA instanceof Array){
if (! dMode){dMode="NO";};
if (! dMode.match(/(ALL|ERROR)/)){dMode="NO";};
	var actionID = stringIDToTypeID(fD);
	var myDescription = new ActionDescriptor();
	var id=new Array();

	for(idx=0;idx<fVA.length;idx++){
		id[idx] = charIDToTypeID( fVA[idx][0]);
		myDescription.putInteger( id[idx], fVA[idx][1]);
	}
	myMode=eval("DialogModes."+dMode);
	executeAction( actionID, myDescription, myMode );
}else{return false;};//
};
// ===========================================================使用サンプル

/*
applyFilter("psPaint trace_B...",[["cTl0",127],["cTl1",127],["cTl2",127],["cTl3",255],["cTl4",0]]);
applyFilter("psPaint traceK...",[["cTl0",32],["cTl1",255],["cTl2",0]]);
applyFilter("psPaint thin000",[],"NO");

applyFilter("psPaint borderFill",[],)
applyFilter("psPaint traceAll",[],);
applyFilter("psPaint traceK...",[["cTl0",127],["cTl1",127],["cTl2",127]]);

*/
//var xs=Math.floor(((s/1024)+0.5)*256);

applyFilter("psPaint traceK...",[],"NO");
}
//kレイヤをカラーレイヤに差分合成して黒線成分を除去する

var myWhite=new SolidColor();
    myWhite.rgb.red=255;
    myWhite.rgb.green=255;
    myWhite.rgb.blue=255;
var myLine=myCopy.duplicate();
myLine.name="K";
app.activeDocument.activeLayer=myCopy;
app.activeDocument.selection.selectAll();
app.activeDocument.selection.fill (myWhite, ColorBlendMode.DARKEN, 100)
myCopy.blendMode=BlendMode.DIFFERENCE;
var myColorLayer=myCopy.merge();
myColorLayer.invert();

//カラーレイヤを透明化する
if(exPBK){
	applyPbk(nasLibFolderPath+"PixelBenderKernel/traceAll.pbk","traceAll",[],"NO");
}else{
	applyFilter("psPaint traceAll",[],);
}

}

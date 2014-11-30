// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();

/*
	applyPbk(myPBK,knlName,[[control,value]],dialog)
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
//idは自動生成だけどアルファベット1巡で打ち止めとしておく
var exText=new Array();
for(var ix=0;ix< fVA.length;ix++){
	var myChar="abcdefghijklmnopqrstuvwxyz".charAt(ix);
    var idPN = charIDToTypeID( "PNa"+myChar );//パラメタ名＋id
    descPbk.putString( idPN, fVA[ix][0] );//パラメタ名設定
exText.push([idPN, fVA[ix][0] ]);
    var idPT = charIDToTypeID( "PTa"+myChar );//パラメタに関する何かの識別子+id
    descPbk.putInteger( idPT, 0 );//整数で０を設定している　とりあえずコピー
exText.push([idPT, 0]);
   var idPF = charIDToTypeID( "PFa"+myChar );//実際にかけたいパラメタの識別子
    descPbk.putDouble( idPF, fVA[ix][1] );//適用パラメタ
exText.push([idPF, fVA[ix][1]]);
}
//以下パラメタ数分だけ繰り返し
//id　は aa,ab,ac,ad,ae~と連続
//alert(exText);
executeAction( idPbPl, descPbk, DialogModes[dMode] );


	}
}
if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}

if(true){
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk",
"traceK",
[
["saturation",2.500000],
["backgroundClip",100.000000],
["lineIntensity",20.000000]
],
"ALL"
)
}else{
//Photoshop用ライブラリパス生成

//var includeLibs=[nasLibFolderPath+"config.js"];//読み込みライブラリを格納する配列

applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin001.pbk","thin001",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin002.pbk","thin002",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin003.pbk","thin003",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin001.pbk","thin001",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin002.pbk","thin002",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin003.pbk","thin003",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin001.pbk","thin001",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin002.pbk","thin002",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin003.pbk","thin003",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin001.pbk","thin001",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin002.pbk","thin002",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin003.pbk","thin003",);
applyPbk(nasLibFolderPath+"PixelBenderKernel/punchOutRed.pbk","punchOutRed",);
}

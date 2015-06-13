/*
	レイヤ画像を細線化する
	単機能フィルタを連続実行することで細線化を行なっている。
	レイヤはRGBモードであること。
	黒白２値化は行わないので、あらかじめ２値化を行なっておくこと。
	psPaintプラグインがあらかじめインストールされていること
	
*/

/*
	ピクセルベンダーが、実行可能な場合はそちらを優先的に使用する。
	アプリケーションフォルダに Pixel Bender Files フォルダの有無をチェックして
	Pixel Bender Kernel が使用可能なPhotoshopか否か判定する
	CS6以降は、PixelBenderが非サポートとなるので注意
	ベータ版では実行可能だった。
	ベータ版でこの機能を使用するためには、判別のためだけにフォルダを設置しておくこと。
	(空フォルダで良い)2012.05.05

*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}


if(exPBK){
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
var myExecute="";
for (var ix=0;ix<3;ix++){
myExecute+="applyPbk(\""+nasLibFolderPath+"PixelBenderKernel/thin000.pbk\",\"thin000\",);";
myExecute+="applyPbk(\""+nasLibFolderPath+"PixelBenderKernel/thin001.pbk\",\"thin001\",);";
myExecute+="applyPbk(\""+nasLibFolderPath+"PixelBenderKernel/thin002.pbk\",\"thin002\",);";
myExecute+="applyPbk(\""+nasLibFolderPath+"PixelBenderKernel/thin003.pbk\",\"thin003\",);";
}
myExecute+="applyPbk(\""+nasLibFolderPath+"PixelBenderKernel/punchOutRed.pbk\",\"punchOutRed\",);";

app.activeDocument.suspendHistory (nas.localize({en:"thin line",ja:"画像細線化"}), myExecute ); 
}else{
/* こんな関数か?
	applyFilter(filterDescription,[[control,value]],dialog)
引数
	filterDesctiotion	フィルタ記述 カテゴリ+フィルタ名(文字列)
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
	if(app.version.split(".")[0]<10){
	 executeAction( actionID, myDescription, myMode );
	}else{
	 var idFltr = charIDToTypeID( "Fltr" );
	 var desc3 = new ActionDescriptor();
	 var idUsng = charIDToTypeID( "Usng" );
	 desc3.putString( idUsng, fD.split(" ")[1] );
	 executeAction( idFltr, desc3, myMode);
	}
}else{return false;};//
}
var myExecute="";

for (var ix=0;ix<3;ix++){
myExecute+="applyFilter(\"psPaint thin000\",[],\"NO\");"
myExecute+="applyFilter(\"psPaint thin001\",[],\"NO\");"
myExecute+="applyFilter(\"psPaint thin002\",[],\"NO\");"
myExecute+="applyFilter(\"psPaint thin003\",[],\"NO\");"
}
myExecute+="applyFilter(\"psPaint punchOutRed\",[],\"NO\");"
if(app.activeDocument.suspendHistory){
app.activeDocument.suspendHistory (nas.localize({en:"line thinning",ja:"画像細線化"}), myExecute ); 
}else{
eval(myExecute);
}
};

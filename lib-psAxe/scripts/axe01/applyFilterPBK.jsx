/*
	Photoshopスクリプト
	スクリプトからpixel benderフィルタを実行するスクリプトテンプレート
	2012.08.20
 */

// スクリプトをダブルクリックで実行するためのおまじない。不要なら削除してね
// #target photoshop
// 実行時にPotoshopを最前面にする。上の擬似命令を削除した場合はこの下も多分不要
app.bringToFront();
//ドキュメントがなかったりレイヤが選択されていなかったら実行しない
  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){

/*
	アプリケーションフォルダ内の "Pixel Bender Files" フォルダの有無をチェックして
	Pixel Bender が使用可能なPhotoshopか否か判定する
	CS4-5で有効
	裏技としてCS6でpixel Benderフィルタを使用する場合は、
		下のexPBKフラグをtrueに固定する
		又は手作業で上記のフォルダ（カラでOK）を作成しといて下さい。
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}

//exPBK = true;//強制的に実行する
//exPBK = false;//実行しない
if(exPBK)
{
// =======================================================PixelBenderフィルタ(pbk)
/*	applyPbk(myPBK,knlName,[[control,value]],dialog)
引数
	myPBK	フィルタファイルへのパス（文字列）
	knlName	カーネル名（カーネルの記述と一致している必要がある）
	control	コントロール記述(文字列)[省略するとデフォルトの値で実行される]
	value	コントロールの値(数値)[省略するとデフォルトの値で実行される]
	dialog	ダイアログモード(文字列 "ALL""ERROR""NO")[省略可]
戻り値
	特になし(undefeined)
	pixel bender karnel　をスクリプトから適用する関数
	引数myPBKはカーネルファイル又はファイルパスで
	存在しないカーネルファイルが指定された場合は、動作をスキップ

この関数にピクセルベンダーフィルタの位置を与えて実行します。
CS4-5のピクセルベンダーギャラリー経由でフィルタを実行すると、
決まったフォルダの中のフィルタしか実行できませんが、スクリプトから実行する場合はどこにあっても
良いようです。

ダイアログの呼び出しは、CS6では基本的に無効です。
CS6でフィルタを実行する場合は、dialogModes.NOで呼び出して下さい。

実行例
（パラメータ指定）

applyPbk(nasLibFolderPath+"PixelBenderKernel/traceY.pbk","trace_Y",[["hueOffset",0.],["hueRange",0.3],["strThreshold",20.0],["backgroundClip",100.0],["lineIntensity",0.]],"ALL");

applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk",
"traceK",
[
["saturation",2.500000],
["backgroundClip",100.000000],
["lineIntensity",20.000000]
],
"NO"
);

パラメータを指定しない場合はカラの配列を指定しておいて下さい。

applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceAll.pbk","traceAll",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk","traceK",[],"ALL");

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
//pixelBender カーネルの位置を指定して実行
/*
	CS4-5ではダイアログを使用することが可能、その場合はピクセルベンダーギャラリのダイアログが出てくる
	CS6でダイアログを呼ぶと油彩ペイントのダイアログが出現して、油彩エフェクトが適用されます。
	CS6で油彩エフェクト以外のフィルタをつかう場合は、必ず"dialogModes.NO"で
*/
applyPbk(app.path.fullName+"/Pixel Bender Files/hole.pbk","Hole",[],"NO");

}
  }

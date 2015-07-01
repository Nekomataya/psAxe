/* applyFilterAA.jsx
	Photoshopスクリプト
	アニメーションの線画にAnti Aliasフィルタを適用します。

	OLM Smoother と pixelBenderフィルタを選別して利用します。
	このスクリプトの利用には以下のいずれかのフィルタが必要です。
	フィルタは、psAxeパッケージに含まれていませんので、各自入手して下さい。

	このスクリプトで使用するピクセルベンダーカーネルは
	Adobeエクスチェンジで入手可能です。
	再頒布のライセンス及びエクスチェンジの性質を考えてpsAxeパッケージには含まれておりませんので
	ご自身でインストールをお願いします。

pixelBenderが利用可能な方

	MLAA
	（または　SmartAA等）
http://www.adobe.com/cfusion/exchange/index.cfm?searchfield=anti+alias&search_exchange=26&search_category=-1&search_license=&search_rating=&search_platform=0&search_pubdate=&Submit=Search&num=10&startnum=1&event=search&sort=0&dummy_tmpfield=

Adobeエクスチェンジ内のダウンロードコーナーで入手可能です。Photoshop CS4 以降で利用可能です。

CS2,3 またはピクセルベンダーをご利用でない方は、以下のプラグインが使用可能です。

	OLM Smoother(for photoshop)
http://www.olm.co.jp/rd/technology/tools/?lang=ja

	アニメーション制作会社OLM様のサイトで無償でダウンロード可能です。
	メールアドレスの登録が必要です。

*/


  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){
/*
	ダイアログの表示を指定できます。
	フィルタのパラメータは、デフォルトで決め打ちです。
	ただし、OLM Smootherを使用する場合は、現在のところダイアログモードを"NO"に設定しても
	ダイアログを表示する状態でコンパイルされているようですので、こちらの設定は無効になります。
*/
	var myDialogModes ="NO";//YES/NO/ALL の三種が設定可能です。
	var usePB         =false;//pixelBenderが使用可能ならピクセルベンダーを使用する。falseにするとOLM Smootherを使用
/*
	CS4-5では、アプリケーションフォルダに Pixel Bender Files フォルダの有無をチェックして
	Pixel Bender Kernel が使用可能か否か判定する。
	CS6では無条件にPixel Bender が使用可能
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}

if((exPBK)&&(usePB))
{
// =======================================================PixelBenderフィルタ(pbk)
/*	applyPbk(myPBK,knlName,[[control,value]],dialog)
引数
	myPBK	ファイルオブジェクト又はファイルパス
	knlName	カーネル識別子
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
	}else{
//ファイルが存在しないか又は識別子が一致していない
alert("pixelBenderKernel not exists or wrong id");
	}
}
// =======================================================
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";

//applyPbk(nasLibFolderPath+"PixelBenderKernel/SmartAA.pbk","SmartAA",[],myDialogModes);
	applyPbk(nasLibFolderPath+"PixelBenderKernel/MLAA.pbg","MLAA",[],myDialogModes);


}else{
// =======================================================Smoother (OLM Smoother使用)
var idFltr = charIDToTypeID( "Fltr" );
    var desc10 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
var Smoother=($.os.indexOf("Windows")>=0)? "OLM Smoother...":"OLM Smoother";
    desc10.putString( idUsng, Smoother );
executeAction( idFltr, desc10, DialogModes[myDialogModes] );
}
  }

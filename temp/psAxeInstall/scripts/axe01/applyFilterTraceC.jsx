/*
	Photoshopスクリプト
	スクリプトからフィルタを実行するテンプレート

	PBKが使用可能なら優先して使用
 */

  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){

/*	前景色/背景色からpsPaint互換色値を取得	*/
psPcolor=function(r,g,b){
		if(!r) {this.r=0.}else{this.r=r};
		if(!g) {this.g=0.}else{this.g=g};
		if(!b) {this.b=0.}else{this.b=b};

		this.i=(76*this.r+150*this.g+29*this.b)/255;;
		this.u=this.b-this.i;
		this.v=this.r-this.i;
		this.s=1024.*180. * (Math.atan2(this.v,this.u)/Math.PI)/360.;
		this.m=Math.sqrt(this.u*this.u+this.v*this.v);
	}

var colorParams=new Object;
	colorParams.fgc=new psPcolor(
		app.foregroundColor.rgb.red,
		app.foregroundColor.rgb.green,
		app.foregroundColor.rgb.blue
	);
	colorParams.bgc=new psPcolor(
		app.backgroundColor.rgb.red,
		app.backgroundColor.rgb.green,
		app.backgroundColor.rgb.blue
	);
//===========================識別オブジェクト
targetParams=({
	P:{
		filterSig:"psPaint trace_P...",
		pbkName:"PixelBenderKernel/traceP.pbk",
		pbkSig:"trace_P",
		centerHue:149
	},
	R:{
		filterSig:"psPaint trace_R...",
		pbkName:"PixelBenderKernel/traceR.pbk",
		pbkSig:"trace_R",
		centerHue:307
	},
	Y:{
		filterSig:"psPaint trace_Y...",
		pbkName:"PixelBenderKernel/traceY.pbk",
		pbkSig:"trace_Y",
		centerHue:487
	},
	GY:{
		filterSig:"psPaint trace_GY...",
		pbkName:"PixelBenderKernel/traceGY.pbk",
		pbkSig:"trace_GY",
		centerHue:557
	},
	G:{
		filterSig:"psPaint trace_G...",
		pbkName:"PixelBenderKernel/traceG.pbk",
		pbkSig:"trace_G",
		centerHue:680
	},
	C:{
		filterSig:"psPaint trace_C...",
		pbkName:"PixelBenderKernel/traceC.pbk",
		pbkSig:"trace_C",
		centerHue:870
	},
	B:{
		filterSig:"psPaint trace_B...",
		pbkName:"PixelBenderKernel/traceB.pbk",
		pbkSig:"trace_B",
		centerHue:921
	}
});

//ターゲットセンタ色相
var targetColor="C";
var targetCenterHue=targetParams[targetColor].centerHue;
var myOffset=colorParams.fgc.s-targetCenterHue;

/*
	アプリケーションフォルダに Pixel Bender Files フォルダの有無をチェックして
	Pixel Bender Kernel が使用可能なPhotoshopか否か判定する
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}

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
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";

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
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceY.pbk","trace_Y",[["hueOffset",0.],["hueRange",0.3],["strThreshold",20.0],["backgroundClip",100.0],["lineIntensity",0.]],"ALL");
*/
applyPbk(nasLibFolderPath+targetParams[targetColor].pbkName,targetParams[targetColor].pbkSig,[
	["hueOffset",myOffset],
	["hueRange",100.0],
	["strThreshold",(((colorParams.bgc.m)*9)+colorParams.fgc.m)/182],
	["backgroundClip",(colorParams.bgc.i/255.)*90],
	["lineIntensity",(colorParams.fgc.i+255.)/512]
],"NO");

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
var xs=Math.floor(((colorParams.fgc.s/1024))*256);
var xss=Math.floor(((colorParams.bgc.m)*9+colorParams.fgc.m)/1.40);
//彩度閾値をバックグラウンドの2倍でなくターゲットカラーとバックグラウンドの間に置く処置が必要
/*
(バックグラウンド彩度*9+ターゲット彩度)/10
*/
applyFilter(targetParams[targetColor].filterSig,[
	["cTl0",Math.floor(myOffset%256)+127],
	["cTl1",255],
	["cTl2",xss],
	["cTl3",Math.floor((colorParams.bgc.i)*.9)],
	["cTl4",Math.floor((colorParams.fgc.i+255.)/2)]
],"ALL");
}
  }

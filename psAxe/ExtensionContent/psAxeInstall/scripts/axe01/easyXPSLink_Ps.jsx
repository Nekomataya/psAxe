/*(仮設版XPSリンカ)
 *
 *	Nekomataya/kiyo	2005.11.15
 *		XPSシートをAEドキュメントジションに適用します。
 *		暫定試験版です。[読み込みのみ]2006.05.11
 *	バグ(Macのみedittextの不備) 対応
 *	AE7でAERemapのシートが読み込めなかったバグに対処 2006/11/12
 *		読み込み障害の対応版(検出のみ)
 *	AE CS3 カラセル処理時にエラー停止する現象に対処	2009/08/21
 * 	自動セルの推測部分をレタスのセルに仮対応	2009/08/21
 *	既存のXPSオブジェクトがあれば再初期化しないように変更
 *	プロジェクト内のタイムシートの読み書きに部分対応
 *	（明示的にタイムラインのないレイヤに対する仮タイムラインを実装）
 *	シートをプロジェクト内に保存する機能を実装中なのでイロイロ機能追加中　2009/10/10
 Photoshopに移植　２０１１　０３
 起動初期化時に現在オープンされているドキュメントの同ロケーションにあるXPS(のみ)をオープンしてストアに格納することに
 初期状態でのアクティブドキュメントをセレクタ上でアクティブにする。
 */

//	モジュール情報設定
var myFilename=("$RCSfile: easyXPSLink_Ps.jsx,v $").split(":")[1].split(",")[0];
var myFilerevision=("$Revision: 1.5 $").split(":")[1].split("$")[0];
var exFlag=true;
var moduleName="easyXPS";//モジュール名で置き換えてください。
//Photoshop用ライブラリ読み込み

	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
	var includeLibs=[nasLibFolderPath+"config.js"];//読み込みライブラリを格納する配列

if(! app.nas){
//iclude nasライブラリに必要な基礎オブジェクトを作成する
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
//	ライブラリのロード　CS2-5用
//==================== ライブラリを登録して事前に読み込む
/*
	includeLibs配列に登録されたファイルを順次読み込む。
	登録はパスで行う。(Fileオブジェクトではない)
	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む

＝＝＝　ライブラリリスト（以下は読み込み順位に一定の依存性があるので注意）
　config.js"		一般設定ファイル（デフォルト値書込）このルーチン外では参照不能
  nas_common.js		AE・HTML共用一般アニメライブラリ
  nas_GUIlib.js		Adobe環境共用GUIライブラリ
  nas_psAxeLib.js	PS用環境ライブラリ
  nas_prefarenceLib.js	Adobe環境共用データ保存ライブラリ

  nasXpsStore.js	PSほかAdobe汎用XpsStoreライブラリ(AE用は特殊)
  xpsio.js		汎用Xpsライブラリ
  mapio.js		汎用Mapライブラリ
  lib_STS.js		Adobe環境共用STSライブラリ
  dataio.js		Xpsオブジェクト入出力ライブラリ（コンバータ部）
  fakeAE.js		中間環境ライブラリ
  io.js			りまぴん入出力ライブラリ
  xpsQueue.js		PS用Xps-FrameAnimation連携ライブラリ
*/
includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
];
//=====================================　Application Objectに参照をつける
	app.nas=nas;
	bootFlag=true;
}else{
	//alert("object nas exists")
	nas=app.nas;
	bootFlag=false;
};

/*	ライブラリ読み込み
ここで必要なライブラリをリストに加えてから読み込みを行う
*/

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");

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
//=====================================保存してあるカスタマイズ情報を取得
if(bootFlag){nas.readPrefarence();nas.workTitles.select();}
//=====================================
//+++++++++++++++++++++++++++++++++ここまで共用

//==================================================================main
var XPS=new Xps(4,72);
var isAdobe=true;
nas.XPSStore=new XpsStore();

			if(false){
//二重初期化防止トラップ
try{
	if(nas.Version)
	{	nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;
	
		try{
if(nas[moduleName]){
	nas[moduleName].show();
	exFlag=false;
}else{
nas[moduleName]=new Object();
}
		}catch(err){
nas[moduleName]=new Object();}
	}
}catch(err){
	alert("nasライブラリが必要です。\nnasStartup.jsx を実行してください。");
	exFlag=false;
}
			}else{
//デバッグ中は二重起動防止トラップは邪魔なのでパス。フィックスした時は入れ換え
nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;
nas[moduleName]=new Object();
			}

if((app.documents.length)&&(exFlag)){
/*
	edittextに初期状態で256バイトでペーストや手入力が打ち止めになる現象がある。
	スクリプトでのデータ追加を行うと動的にメモリが確保されているようなので、
	これは、edittextに無理やり空白を追加してフラッシュするメソッド。
	このバグが解消したら不要。	引数はループ回数。1回アタリ1kb
*/

//代用マップ初期化
var MAP=new Map(3);
/*
	仮モジュール初期化
 */

//	alert(MAP.toSource());
//XPS初期化
//	りまぴん互換用ダミーオブジェクト
var MSIE=false;
var xUI=new Array();
	xUI.blmtd=BlankMethod;
	xUI.blpos=BlankPosition;
	xUI.timeShift=TimeShift;
	xUI.keyMethod=KEYMethod;
	xUI.aeVersion=AEVersion;
	xUI.fpsF=FootageFramerate;
	xUI.Selection=[0,0];
	xUI.spinValue=3;
	xUI.Select=[1,0];
	xUI.spin=function(sv){this.spinValue=(isNaN(sv))?this.spinValue:sv;};
//	xUI.put=function(stream){alert("put :"+ stream);};
	xUI.put=function(stream){
		for(lyrs=0;lyrs<stream.split("\n").length;lyrs++)
		{
			kyLyr=stream.split("\n")[lyrs].split(",");
			for(frms=0;frms<kyLyr.length;frms++)
			{
				if(lyrs<XPS.xpsBody.length && frms < XPS[0].length)
				{
					XPS[lyrs+1][frms]=kyLyr[frms];
				}
			}
		}
	};

/*
	xUI.=;
	xUI.=;
	xUI.=;
	xUI.=;
*/
//	var XPS=new Object();
//	XPS=new_XPS(SheetLayers,nas.FCT2Frm(Sheet));
//	MAP=new Map(SheetLayers);
//var XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
/*	立ち上げ時にXPSオブジェクトがすでに存在する場合は、そのデータを引き継ぐのでここでの初期化は不要
	プロジェクトのＸＰＳバッファはnas立ち上げ時に初期化するのが望ましいと思うよ
 */
try{var myXPS=XPS}catch(err){
	XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
}
//	ダミーマップを与えて情報取り込み

//XPS.getMap(MAP);


//コントロール上のXPSデータをXPSオブジェクトに展開 展開後に再書き出し

function updateXPS(){
XPSbody=nas.easyXPS.sheetView.text.replace(/(\r\n?|\n)/g,"\n");
	if(XPS.readIN(XPSbody)){
		nas.easyXPS.sheetView.clear();
//読み込み成功した場合だけコントロールをクリア(いただきます)
		return true;
	}else{
		return false;
	}
}
function updateControl()
{
//メモリ上のXPSデータを文字列でコントロールに反映

/*	表示をシートサマリーに変更(仮)
	if(isWindows){
nas.easyXPS.sheetView.text=XPS.toString().replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
	}else{
nas.easyXPS.sheetView.text=XPS.toString(";").replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
	}
*/
//var XPSSummary="nasTIME-SHEET 0.4"+nas.GUI.LineFeed;
var XPSSummary="#--- nas.XPSSummary (for TEST) ---#"+nas.GUI.LineFeed;
if(true)
{
XPSSummary+="TITLE\t:"+XPS.title+"\tOPUS\t:"+XPS.opus+nas.GUI.LineFeed;
XPSSummary+="SUB_TITLE\t:"+XPS.subtitle+nas.GUI.LineFeed;
XPSSummary+="SCENE/CUT\t:"+XPS.scene+"\t/\t"+XPS.cut+nas.GUI.LineFeed;
XPSSummary+="TIME\t:(\t"+XPS.getTC(XPS.time())+"\t)"+nas.GUI.LineFeed;
XPSSummary+="TRIN\t:"+XPS.trin.toString()+"\t/TROUT\t:"+XPS.trout.toString()+nas.GUI.LineFeed;
XPSSummary+="FRAME_RATE\t:"+XPS.framerate+" fps"+nas.GUI.LineFeed;
XPSSummary+="CREATE_USER\t:"+XPS.create_user+nas.GUI.LineFeed;
//XPSSummary+="UPDATE_USER\t:"+XPS.update_user+nas.GUI.LineFeed;
XPSSummary+="CREATE_TIME\t:"+XPS.create_time;
//XPSSummary+="UPDATE_TIME\t:"+XPS.update_time+nas.GUI.LineFeed;
//	レイヤ別プロパティをストリームに追加
	var Lprops=["option","link","name"];
	for (prop in Lprops)
	{
		var propName=Lprops[prop];
		var lineHeader=(propName=="name")? 
		nas.GUI.LineFeed+'[CELL\tN' : nas.GUI.LineFeed+'[' + propName + '\t';
		XPSSummary+=lineHeader;
	for (id=0;id<XPS.layers.length;id++)
	{
		XPSSummary+="\t"+XPS["layers"][id][propName];
	}
	XPSSummary+='\t]';//
		}
XPSSummary+="=============================================== memo:"+nas.GUI.LineFeed;
XPSSummary+=XPS.memo.replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
}else{
XPSSummary+="##MAPPING_FILE="+XPS.mapfilr+nas.GUI.LineFeed;
XPSSummary+="##TITLE="+XPS.title+nas.GUI.LineFeed;
XPSSummary+="##SUB_TITLE="+XPS.subtitle+nas.GUI.LineFeed;
XPSSummary+="##OPUS="+XPS.opus+nas.GUI.LineFeed;
XPSSummary+="##SCENE="+XPS.scene+nas.GUI.LineFeed;
XPSSummary+="##CUT=" +XPS.cut+nas.GUI.LineFeed;
XPSSummary+="##TIME="+XPS.getTC(XPS.time())+nas.GUI.LineFeed;
XPSSummary+="##TRIN="+XPS.trin.toString()+nas.GUI.LineFeed;
XPSSummary+="##TROUT="+XPS.trout.toString()+nas.GUI.LineFeed;
XPSSummary+="##CREATE_USER="+XPS.create_user+nas.GUI.LineFeed;
XPSSummary+="##UPDATE_USER="+XPS.update_user+nas.GUI.LineFeed;
XPSSummary+="##CREATE_TIME="+XPS.create_time+nas.GUI.LineFeed;
XPSSummary+="##UPDATE_TIME="+XPS.update_time+nas.GUI.LineFeed;
XPSSummary+="##FRAME_RATE="+XPS.framerate+nas.GUI.LineFeed;
	XPSSummary+="####################################"
//	レイヤ別プロパティをストリームに追加
	var Lprops=["sizeX","sizeY","aspect","lot","blmtd","blpos","option","link","name"];
	for (prop in Lprops)
	{
		var propName=Lprops[prop];
		var lineHeader=(propName=="name")? 
		nas.GUI.LineFeed+'[CELL\tN' : nas.GUI.LineFeed+'[' + propName + '\t';
		XPSSummary+=lineHeader;
	for (id=0;id<XPS.layers.length;id++)
	{
		XPSSummary+="\t"+XPS["layers"][id][propName];
	}
	XPSSummary+='\t]';//
		}
XPSSummary+=nas.GUI.LineFeed+"[END]"+nas.GUI.LineFeed;
XPSSummary+=XPS.memo.replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
}
nas.easyXPS.sheetView.text=XPSSummary;

	nas.easyXPS.sheetView.chgFlag=false;

//edFlag=(nas.easyXPS.sheetView.chgFlag)?"◎":"　";//"\["+edFlag+"\] : "+
//nas.easyXPS.XPSTLSelector.text=[XPS.title,XPS.opus,XPS.subtitle,XPS.scene,XPS.cut].join("/");//ボタン書換え
//nas.easyXPS.XPSTLSelector.enabled=(nas.easyXPS.sheetView.chgFlag)?true:false;
nas.easyXPS.updateButton.text=XPS.getIdentifier();//ボタン書換え
nas.easyXPS.updateButton.enabled=(nas.easyXPS.sheetView.chgFlag)?true:false;
//セレクタの配列書き換え。
var newOptions=new Array();
newOptions.push("<no-select>");
newOptions.push("[BG/BOOK]");
for (idx=0;idx<XPS.layers.length;idx++){newOptions.push(XPS.layers[idx].name);};
	for (idx=0;idx<5;idx++){
	nas.easyXPS.LayerLink[idx].Button.text="<no-select>";
	nas.easyXPS.LayerLink[idx].Button.options=newOptions;
	}
}
//リンク先自動判定
function guessLink(string)
{if(XPS.layers.length){
//BG/LO/をスキップ
	if(string.match(/(^[-_].*|bg|lo|book)/i)){return 1;}

//検査(完全一致はやめた　冒頭一致で後ろの文字列は主に数値として許容)
	for (Xid=0;Xid<XPS.layers.length;Xid++){
		var Label=new RegExp("^"+XPS.layers[Xid].name+".*$","i");
	if(string.match(Label)){return(Xid+2);}
	}
	return 0;
}else{return 0;}}
//レイヤリンク
function goLink()
{
//操作対象ドキュメントがないときはリターン
	if(nas.easyXPS.DocSelector.selected<=0){return false;};
//操作対象ドキュメント取得
		var selectedDocId=nas.easyXPS.DocSelector.value.match(/\[\s(\d+)\s\]/)[1]*1;
		app.activeDocument=app.documents[selectedDocId];
//以下で選択ドキュメントのアニメフレームをビルド
	app.activeDocument.buildPsQueue=_buildPsQueue;
	app.activeDocument.setView=_setView;
	var myTimlineOrder=new Array();
	for(var tix=nas.easyXPS.lyrSelector.Links.length-1;tix>=0;tix--){
		myTimlineOrder.push((nas.easyXPS.lyrSelector.Links[tix]==1)?-1:nas.easyXPS.lyrSelector.Links[tix]-1);
		//timelineID=0
	}
	var ffo=nas.easyXPS.ffoButton.value;
	var myQF=app.activeDocument.buildPsQueue(XPS,myTimlineOrder,ffo);
	
		//表示初期化
		//アニメーションテーブル初期化
		//アニメウィンドウを初期化する＞要するに全て消す
		nas.axeAFC.dupulicateFrame();//一個複製して最低２個のフレームにする（エラー回避）
		nas.axeAFC.selectFramesAll();//全選択
		nas.axeAFC.removeSelection();//削除
//==============================================================
		//第一（キー）フレームを設定
		var myIndex=myQF[0].index;
		var myDuration=myQF[0].duration/XPS.framerate;//継続フレームを時間に変換
		app.activeDocument.setView(myQF[0]);
		nas.axeAFC.setDly(myDuration);
		//第二フレーム以降をループ設定
		for(var idx=1;idx<myQF.length;idx++){
			nas.axeAFC.dupulicateFrame();//作る（フォーカス移動）
		myDuration=myQF[idx].duration/XPS.framerate;//継続フレームを時間に変換
		app.activeDocument.setView(myQF[idx]);
		nas.axeAFC.setDly(myDuration);
		}
	//第一フレームへ移動
	nas.axeAFC.selectFrame(1);
/*選択ドキュメントをライズする動作は、セレクタの変更時に処理済*/

}

//ファイルからシート読み込み()
function getSheet(sheetFile)
{
	var myContent="";
	if(sheetFile){
		var myOpenfile = new File(sheetFile.fsName);
		myOpenfile.encoding="UTF8";
		myOpenfile.open("r");
		myContent = myOpenfile.read();
//		alert(myContent);
		if(myContent.length==0){alert("Zero Length!");}
		myOpenfile.close();

			if(XPS.readIN(myContent)){return true;
		}else{alert(XPS.errorMsg[XPS.errorCode]);return false;};

	}else{
		if(isWindows)
		{
			var mySheetFile = File.openDialog("読み込むタイムシートを選んでください","timeSheetFile(*.xps;*.ard;*.tsh;*.sts):*.XPS;*.ard;*.tsh;*.sts");
		}else{
			var mySheetFile = File.openDialog("読み込むタイムシートを選んでください","");
		}
		if (! mySheetFile){return false;};
		if (mySheetFile.name.match(/^[a-z_\-\#0-9]+\.(xps|ard|tsh|sts)$/i))
		{
			var myOpenfile = new File(mySheetFile.fsName);
			myOpenfile.open("r");
			if (mySheetFile.name.match(/\.sts$/i))
			{
				myContent = STS2XPS(myOpenfile).replace(/(\r\n?|\n)/g,"\n");
			}else{
				myOpenfile.encoding="UTF8";
				myContent = myOpenfile.read();
			}
			myOpenfile.close();
			
			if(XPS.readIN(myContent))
			{
				if(! isNaN(nas.XPSStore.getLength())){
					nas.XPSStore.select(0)
				}
				updateControl();
				nas.easyXPS.XPSTLSelector.init();
			}else{
				alert(XPS.errorMsg[XPS.errorCode]);
			};
	return true;
		}else {
	alert("タイムシートファイルを選択してください。")
	return false;
		};
	}
}

//シート書き出し
function saveSheet()
{
if (! nas.easyXPS.sheetView.text){alert("保存するデータがありません");return false;}
if(isWindows)
{
	var mySavefile = File.saveDialog("書き出しのファイル名を指定してください","nasXPSheet(*.xps):*.XPS");
}else{
	var mySavefile = File.saveDialog("書き出しのファイル名を指定してください","");
}
if(! mySavefile){return};
if(mySavefile.exists)
{
if(! confirm("同名のファイルがすでにあります.\n上書きしてよろしいですか?")){return false;};
}

if (mySavefile && mySavefile.name.match(/^[a-z_\-\#0-9]+\.xps$/i)){
var myOpenfile = new File(mySavefile.fsName);
	myOpenfile.open("w");
	myOpenfile.write(XPS.toString());
//	myOpenfile.write(nas.easyXPS.sheetView.text);
	myOpenfile.close();
}else {
	alert("タイムシートファイルを選択してください。")
	return false;
};
}
//プロジェクトからシート読み込み()
function popSheet()
{
	if(nas.XPSStore.getLength())
		{
			if(! nas.XPSStore.toString()){nas.XPSStore.setBody();}
			if(confirm ("XPSStoreからシートを取得します")){var myIndex=nas.XPSStore.pop();nas.otome.writeConsole("poped XPSStore:"+myIndex+" : "+nas.XPSStore.selected.name)};
			return;
		}
}

//プロジェクトにシート書き出し
function pushSheet()
{
	if(! isNaN(nas.XPSStore.getLength()))
	{
		if(! nas.XPSStore.toString()){nas.XPSStore.setBody();}
		if(confirm ("XPSStoreにシートを(書戻)保存します\n変更がなければ何もしません")){nas.XPSStore.push();}
		return;
	}
}
/*
 *	現在編集中のプロジェクトをスキャンして
 *	必要な情報を入手するサブプロシジャ
 *
 *	戻り値はオブジェクト
 *		リソース共用のため、AEプロジェクトを拡張して乙女タグをぶら下げる。
 *		乙女タグは、可能なら初期化時点で、ダメでも必要になるたび。
 *
 */
//グローバルオブジェクト 現在のプロジェクトの状態を記録する
	var thisProject = new Object();

function checkComp()
{
	if (app.documents.length==0) {
		//開いているプロジェクトが無い
		alert("no documents open");return false;
	}else{
//		thisProject初期化
		thisProject.documents	=new Array();
		for(var docIndex=0;docIndex<app.documents.length;docIndex++){
			thisProject.documents.push(app.documents[docIndex]);
//			app.documets[docIndex].index=docIndex;//操作用仮index増設
		}
	}
return true;
}
//
checkComp();
//ドキュメント配下のタイムライン相当のレイヤセットをスキャンしてレイヤごとの属性を返す（シート付けが可能かどうかの観点）
//
function checkLayer()
{
	for (var idx=0;idx<thisProject.documents.length;idx++){
		thisProject.documents[idx].isStill=new Array();
		for(Lid=1;Lid<=thisProject.documents[idx].layers.length;Lid++){
//各ドキュメント一段目のトレーラーのみ検査 調整レイヤ以外は有効
//isComp/Footage?
/*	レイヤソースによる分類
	Layer.source.type
				Comp/Footage
	Layer.source.mainSource.type
				Footage.solidSource
				Footage.fileSource(movie)
				Footage.fileSource(stil)
 */
		thisProject.documents[idx].isStill.push();
		}
	}
}

//ドキュメントセレクタ初期化(ドキュメントサーチしてオプションの再セット)
function initDocSelector_(){
	thisProject.documents=app.documents//選択対象のアイテムを全抽出
//
		new_options=new Array();
		new_options.push("<ドキュメント選択>");//国際化リソース注意
//		var currentEntry=0;
			for (idx=0;idx<thisProject.documents.length;idx++){
					myEntry="\[\x20"+idx+"\x20\]\x20\x20"+thisProject.documents[idx].name;
					new_options.push(myEntry);
//					if(thisProject.documents[idx]===app.activeDocument){currentEntry=idx}
				}
//			if(thisProject.documents[idx] == app.project.activeItem){activeSelect=idx;};
			this.options=new_options;//オプションセット
//			this.select(currentEntry);
	return;
}
//
function chgDocSelect_(){
	this.init();//再初期化

	if (this.options.length<=1)
	{
		this.select(0);
		this.parent.lyrSelector.init();
		return;
	}else {
//コール時点のドキュメント数が1の場合無条件で選択
//コール時点のドキュメント数が2以上の場合は、オプションセレクタに選択用の配列を渡して引数に1加えて使う

		var nextSelect=((this.selected+1)%this.options.length)?(this.selected+1)%this.options.length:1;
//			泥臭いけどとりあえず0スキップで対処
//			var nextSelect=mySelection;
//			this.select(nextSelect);
			this.select(
				nas.GUI.selectOptions(
					this.options.slice(1,this.options.length),
					this.selected-1,
					this
				)+1
			);
			this.parent.lyrSelector.init();
			app.activeDocument=app.documents[this.selected-1];
			return;
	}
/*
	if (this.selected==0){
	}else{
		if(app.project==null){this.select(0);};
		this.select(1+(this.selected%(this.options.length-1)));
	}
//ドキュメントを切り換えたので、レイヤセレクタを更新
this.parent.lyrSelector.init();
*/
}
// GUI Setup
/*	基本機能というか。ボタン

*	クリップボード書き出し
*	クリップボード読み込み
このふたつは廃止 クリップボード操作系のオブジェクトはなかった
危険だからねぇ

ファイルオープン
保存
*	名前を付けて保存(保存で代用)

フィールドクリア

プロジェクトへ保存
プロジェクトから読み出し

ビルド
タイミング取得

シート選択
ドキュメント選択
レイヤ関連づけ
レイヤセレクタ作成>スクロールバーのプロパティとメソッドで実装

*/
//------- GUI設定・スタートアップ -------
//ウィンドウ位置レストア
	var myLeft=(nas.GUI.winOffset["easyXPS"])?
		nas.GUI.winOffset["easyXPS"][0]:nas.GUI.dafaultOffset[0];
	var myTop=(nas.GUI.winOffset["easyXPS"])?
		nas.GUI.winOffset["easyXPS"][1]:nas.GUI.dafaultOffset[1];

// window初期化
	nas.easyXPS= nas.GUI.newWindow("dialog","仮設XPSリンカ nas(u) tools (Nekomataya/2011)",8,21,myLeft,myTop);
// ファイルコントロール
	nas.easyXPS.loadButton=nas.GUI.addButton(nas.easyXPS,"シート開く",0,1,2,1);
	nas.easyXPS.saveButton=nas.GUI.addButton(nas.easyXPS,"シート保存",2,1,2,1);
//	nas.easyXPS.saveAsButton=nas.GUI.addButton(nas.easyXPS,"SAVE as",4,1,2,1);
//	nas.easyXPS.clearSheetButton=nas.GUI.addButton(nas.easyXPS,"clearSheet",6,1,2,1);

//	nas.easyXPS.getCBButton=nas.GUI.addButton(nas.easyXPS,"getClipBoard",0,2,2,1);
//	nas.easyXPS.putCBButton=nas.GUI.addButton(nas.easyXPS,"putClipBoard",2,2,2,1);
	nas.easyXPS.readPjButton=nas.GUI.addButton(nas.easyXPS,"ストア読出",4,1,2,1);
	nas.easyXPS.writePjButton=nas.GUI.addButton(nas.easyXPS,"ストア書込",6,1,2,1);
//メッセージウェル
	nas.easyXPS.messageWell=nas.GUI.addStaticText(nas.easyXPS,"シートを読み込むか、ペーストしてください",0,2.3,4,0.8)
//シート更新ボタン
	nas.easyXPS.updateButton=nas.GUI.addButton(nas.easyXPS,"<sheetName>",4,2,4,1);
// タイムシート表示
	nas.easyXPS.sheetView=nas.GUI.addEditText(nas.easyXPS," ",0,3,8,7);
		nas.easyXPS.sheetView.addBuf=nas.GUI.addBuf_;
		nas.easyXPS.sheetView.multiline=true;
		nas.easyXPS.sheetView.backupText=" ";
		nas.easyXPS.sheetView.chgFlag=false;
		
nas.easyXPS.sheetView.clear= function ()
{this.text="";this.backupText="";this.chgFlag=false;};
nas.easyXPS.sheetView.onChange = function ()
{
		if(! this.chgFlag)
		{	this.chgFlag=true;
//edFlag=(nas.easyXPS.sheetView.chgFlag)?"◎":"　";//"\["+edFlag+"\] : "+
nas.easyXPS.updateButton.text=XPS.getIdentifier();//ボタン書換え
nas.easyXPS.updateButton.enabled=(this.chgFlag)?true:false;

			this.backupText=this.text
		}else{
		};
};

// シートセレクタ
	nas.easyXPS.XPSTLSelector=nas.GUI.addSelectButton(nas.easyXPS,"[　] <無題>",0,0,10,8,1);

// ドキュメントセレクタ
nas.easyXPS.DocSelector=nas.GUI.addSelectButton(nas.easyXPS,"<ファイル選択>",0,0,11,8,1);
// リンクブラウザ ダミーデータ
	dummyLayers =new Array();
	dummyLayers=["","","","",""];
// リンクブラウザ
	nas.easyXPS.LayerLink =new Array();

for (idx=0;idx<dummyLayers.length;idx++){
	nas.easyXPS.LayerLink[idx]=new Object();
	nas.easyXPS.LayerLink[idx].Button=nas.GUI.addSelectButton(nas.easyXPS,"<no-select>",0,0,12+idx,2,1);
	nas.easyXPS.LayerLink[idx].Button.options=["<no-select>","A","B","C","D","E","F"];
//	nas.easyXPS.LayerLink[idx].lyNames=nas.GUI.addEditText(nas.easyXPS,"===",2,12+idx,5.6,1);
	nas.easyXPS.LayerLink[idx].lyNames=nas.easyXPS.add("edittext",nas.GUI.Grid(2,12+idx,5.6,1,nas.easyXPS),dummyLayers[idx],{readonly:true});
}
// スクロールバー(レイヤセレクタ)
 	nas.easyXPS.lyrSelector=nas.GUI.addScrollBar(nas.easyXPS,0,0,0,7,12,5,"right");

// セレクタ ラベル
nas.easyXPS.lb0=nas.GUI.addStaticText(nas.easyXPS,"(SHEET)",0,17,2,1);
nas.easyXPS.lb0.justify="center";
nas.easyXPS.lb1=nas.GUI.addStaticText(nas.easyXPS,"(LAYER)",2,17,5,1);
nas.easyXPS.lb1.justify="center";

// リンクコマンドボタン
	nas.easyXPS.linkButton=nas.GUI.addButton(nas.easyXPS,"シートをドキュメントへ適用",0,18,4,1);
//	nas.easyXPS.readButton=nas.GUI.addButton(nas.easyXPS,"ドキュメントからシートを作成",4,18,4,1);
//フルフレームオプション
	nas.easyXPS.ffoButton=nas.GUI.addCheckBox(nas.easyXPS,"全フレーム出力",4,18,4,1);

//ストア操作
	nas.easyXPS.addSheet=nas.GUI.addButton(nas.easyXPS,"ストアに追加",0,19,2,1);
	nas.easyXPS.viewSheet=nas.GUI.addButton(nas.easyXPS,"シート全表示",2,19,2,1);
	nas.easyXPS.removeSheet=nas.GUI.addButton(nas.easyXPS,"カレントシート削除",4,19,2,1);
	nas.easyXPS.infoSheet=nas.GUI.addButton(nas.easyXPS,"シート情報",6,19,2,1);
	
//	ファンクションボタン
	nas.easyXPS.cluButton=nas.GUI.addButton(nas.easyXPS,"バッファ初期化",0,20,2,1);
	nas.easyXPS.clbButton=nas.GUI.addButton(nas.easyXPS,"ウェル消去",2,20,2,1);
	nas.easyXPS.tstButton=nas.GUI.addButton(nas.easyXPS,"再表示",4,20,2,1);
	nas.easyXPS.closeButton=nas.GUI.addButton(nas.easyXPS,"close",6,20,2,1);

//GUI-FunctionSetup
//	ボタンファンクション割り付け
for (idx=0;idx<5;idx++){
//	nas.easyXPS.LayerLink[idx].Button.onClick=function(){alert(this.text);};
//		nas.easyXPS.LayerLink[idx].lyNames.justify="left";
	nas.easyXPS.LayerLink[idx].Button.id= idx;
	nas.easyXPS.LayerLink[idx].Button.onClick= function(){this.parent.lyrSelector.chgLink(this.id)};
}
//	上段ドキュメント関連
//	nas.easyXPS.loadButton.onClick= function(){getSheet();nas.easyXPS.DocSelector.onClick();};
	nas.easyXPS.loadButton.onClick= function(){getSheet();nas.easyXPS.lyrSelector.init();};
	nas.easyXPS.saveButton.onClick= function(){saveSheet();};
//	nas.easyXPS.saveAsButton.onClick= function(){saveSheet();};
//	nas.easyXPS.clearSheetButton.onClick= function(){this.parent.sheetView.clear();};
//	nas.easyXPS.getCBButton.onClick=function(){alert("まだです。");};
//	nas.easyXPS.putCBButton.onClick=function(){alert("まだ書いてませんです。");};
	nas.easyXPS.readPjButton.onClick = function (){popSheet();nas.easyXPS.lyrSelector.init();updateControl();};
//	nas.easyXPS.readPjButton.enabled = false;
	nas.easyXPS.writePjButton.onClick = function (){pushSheet();};
//	nas.easyXPS.writePjButton.enabled = false;
	nas.easyXPS.updateButton.onClick = function (){
		if(this.parent.sheetView.chgFlag){if(updateXPS()){updateControl();}};
		//	nas.easyXPS.DocSelector.onClick();
			nas.easyXPS.lyrSelector.init();
	};

//	中段コマンド
//	nas.easyXPS.XPSTLSelector.onClick = function (){alert("temp")}

	nas.easyXPS.linkButton.onClick = function (){goLink();};
//	nas.easyXPS.readButton.onClick = function (){alert("できるといいよね");};
//	nas.easyXPS.readButton.enabled = false;

	nas.easyXPS.DocSelector.onClick = chgDocSelect_;
	nas.easyXPS.DocSelector.init = initDocSelector_;
//　ストア操作
	nas.easyXPS.addSheet.onClick=function()
	{
		nas.XPSStore.add();
		this.parent.XPSTLSelector.init();
		updateControl();
	};
	nas.easyXPS.viewSheet.onClick=function()
	{
		this.parent.sheetView.text=XPS.toString()
	};
	nas.easyXPS.removeSheet.onClick=function()
	{
		if(nas.XPSStore.getLength()){
			nas.XPSStore.remove();
			this.parent.XPSTLSelector.init();
			updateControl();
			if(nas.otomeFEP.uiPanel){nas.otomeFEP.uiPanel.reloadInfo()}
		}else{
			alert("タイムシートがストアにありません")
		}
	};
	nas.easyXPS.infoSheet.onClick=function()
	{
		var myInfo=nas.XPSStore.getInfo();
		nas.easyXPS.sheetView.clear();
		nas.easyXPS.sheetView.text=["name:"+myInfo.name,"date:"+myInfo.modified,"size:"+myInfo.length].join(nas.GUI.LineFeed);
	};

//	下段ファンクションボタン
	nas.easyXPS.cluButton.onClick = function ()
	{
//var XPS=new Object();
	XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
//	ダミーマップを与えて情報取り込み
	XPS.getMap(new Map(SheetLayers));
		updateControl();
	};
	nas.easyXPS.clbButton.onClick = function (){nas.easyXPS.sheetView.clear();};
	nas.easyXPS.tstButton.onClick = function (){updateControl();};
	nas.easyXPS.closeButton.onClick = function (){this.parent.close();};
// ドキュメントセレクタにドキュメントを与えて処理対象ならそのドキュメントを選択
	nas.easyXPS.DocSelector.setDoc=function(myDoc)
	{
		if(! myDoc){return false;}
		for(var idx=0;idx<app.documents.length;idx++){
//			var myIndex=this.options[idx].match(/\[\s(\d+)\s\]/)[1]*1;
			if(myDoc===app.documents[idx]){
				this.select(idx+1);
				return true;
			}
		}
		return false;
	}
//	シートセレクタ初期化
{
	nas.easyXPS.XPSTLSelector.init=function()
	{
		var myOptions=new Array();
		myOptions.push("<<　------------ no  selected ------------　>>");//0番
		for(var idx=1;idx<=nas.XPSStore.getLength();idx++){
			var myXps=nas.XPSStore.get(idx);
			myOptions.push("[ "+idx+" ] "+[myXps.title,myXps.opus,myXps.subtitle,myXps.scene,myXps.cut].join("/"));
		}
		this.options=myOptions;
		if(nas.XPSStore.selected){this.select(nas.XPSStore.selected.index);}else{this.select(0);}
	}
	nas.easyXPS.XPSTLSelector.onChange=function()
	{
		nas.XPSStore.pop(this.selected);
		updateControl();
		this.parent.lyrSelector.init();
	}
}

//	レイヤセレクタ初期化
{
//5段(固定)分・初期化
//	var activeLayerLot=0;//グローバルだった どひー
//	nas.easyXPS.lyrSelector.Layers=new Array();//クリア
//	nas.easyXPS.lyrSelector.Links=new Array();

nas.easyXPS.lyrSelector.init=function()
{
	if(this.parent.DocSelector.selected==0)
	{
		var activeLayerLot=0;
		this.Layers=new Array();//クリア
		this.Links=new Array();
		this.minvalue=0;
		this.maxvalue=0;
		this.value=0;
		this.chgSRB();
	}else{
		var selectedDocId=this.parent.DocSelector.value.match(/\[\s(\d+)\s\]/)[1]*1;
//		var activeDoc=thisProject.documents[this.parent.DocSelector.selected-1];
		activeDoc=app.documents[selectedDocId];
//		alert(selectedLyId);
//		var activeLayerLot=thisProject.documents[selectedLyId].layers.length;
		activeLayerLot=activeDoc.layers.length;

		this.Layers=new Array(activeLayerLot);
		this.Links=new Array(activeLayerLot);
			for (idx=0;idx<activeLayerLot;idx++){
this.Layers[idx]="\[\x20"+(idx).toString()+"\x20\]\x20\x20"+activeDoc.layers[idx].name;
this.Links[idx]=guessLink(activeDoc.layers[idx].name);//接続リンクを推測。マッチなければ0で初期化

			}
	this.minvalue=0;
	this.maxvalue=(activeLayerLot>5)?(activeLayerLot-5):0;
	this.value=(activeLayerLot>5)?(activeLayerLot-5):0;
//	this.activePoint=(activeLayerLot>5)?(activeLayerLot-5):0;
	this.chgSRB();
	}
};

	nas.easyXPS.lyrSelector.chgSRB=function()
{
for(idx=0;idx<5;idx++){
		if(idx<this.Layers.length){
	this.parent.LayerLink[idx].lyNames.text=this.Layers[idx+Math.round(this.value)];
	this.parent.LayerLink[idx].Button.select(this.Links[idx+Math.round(this.value)]);
		}else{
	this.parent.LayerLink[idx].lyNames.text="";
	this.parent.LayerLink[idx].Button.select(0);
		}
}
};
	nas.easyXPS.lyrSelector.onChange=function(){this.chgSRB()};

	nas.easyXPS.lyrSelector.chgLink=function(btid)
{//ボタン押した
	if((btid+this.value)< this.Layers.length){
//	this.parent.LayerLink[btid].Button.select("next");
	var myLocation=nas.GUI.screenLocation(this.parent.LayerLink[btid].Button);
	this.parent.LayerLink[btid].Button.select(nas.GUI.selectOptions(
		this.parent.LayerLink[btid].Button.options,
		this.parent.LayerLink[btid].Button.selected,
		this.parent.LayerLink[btid].Button
	));
	this.Links[btid+this.value]=this.parent.LayerLink[btid].Button.selected;
	}
};
}
//	イベント設定
//	nas.easyXPS.sheetView.onChange = function (){alert("change");};
//	ウィンドウ位置保存
	nas.easyXPS.onMove=function(){
nas.GUI.winOffset["easyXPS"] =
[ nas["easyXPS"].bounds[0],nas["easyXPS"].bounds[1]];
	}
	
//	GUI設定終了/表示

//			nas.easyXPS.show();

			nas.easyXPS.sheetView.addBuf(20);
//			nas.easyXPS.sheetView.text="<<初期化中>>";


//理由はわからないが初期状態だと256bでペーストが打ち止めになるのでスクリプト側からedittextの拡張をかけてあります。20kb分
			updateControl();

//			nas.easyXPS.show();
}
//main
/*	Psでは起動時にXPSStoreが存在するので判定は不要
		現在のドキュメントのパスを周回して読み込んで登録
		シートセレクタを更新
		アクティブドキュメントと同名同ロケーションのシートがあればそれにフォーカス
 */

/* 
 *	nas-カレントフォルダにタイムシートが存在すれば、読み込む
	リクエストあり・素材(レイヤフッテージ)を基点にシートを検索する機能
 *複数存在する場合は、カレントフォルダ名に一致したものがあればそれを
 *なければ、システムソートで読み込む。(将来は、設定ファイル数読み込み)
 *対応フォーマットは XPS/ARD/TSH/STS
 * STSのみバイナリファイルなので動作を分岐
 **  起動時にカレントアイテムがドキュメントならドキュメントを選択する動作を追加
 */
if((app.documents.length)&&(app.activeDocument.name.match(/.*\.psd$/i))){}
if(app.documents.length){
	var targetFolders=new Array();
	targetFolders.hasEntry=function(Fl){
		for(var ix=0;ix<this.length;ix++){if(Fl.fullName==this[ix].fullName){return true}};
		return false;
	}
	//フォルダをユニークカウント
	for(var fidx=0;fidx<app.documents.length;fidx++){
		//重複フォルダ・ファイルを読みこまない(変更後に保存していないファイルは対象外になるがそれはそれでしょうがない)
		if(app.documents[fidx].saved){
			if(! (targetFolders.hasEntry(app.documents[fidx].path)) ){targetFolders.push(app.documents[fidx].path)}
		}
	}

	//フォルダが存在する場合は、中のXPS総ざらい
	for(var fidx=0;fidx<targetFolders.length;fidx++){
		var files = targetFolders[fidx].getFiles(); //内包エントリ取得
			var mySheets=new Array();//シートエントリ
		for(myEntry in files){
			if(files[myEntry].name.match(/.*\.(xps|ard|tsh|sts)/i)){mySheets.push(files[myEntry])};
		};
		if(mySheets.length)
		{	//シートあれば…なければスキップ
			//読み込み対象シートを絞らずに全て読み込んでストアにaddする
			var currentXPSId=0
			for(myIx in mySheets){
				var myReadXPS=mySheets[myIx];
				//alert(myReadXPS.parent.fullName)
				if(getSheet(myReadXPS)){
				if(
					(myReadXPS.name.replace(/\..+$/,"")==app.activeDocument.name.replace(/\..+$/,""))&&
					(myReadXPS.parent.fullName==app.activeDocument.path.fullName)
				){
					currentXPSId=myIx+1;
				}
					nas.XPSStore.add()
				};				
			}
		}
	}
nas.XPSStore.select(currentXPSId)
updateControl();

//	立ち上げ時にアクティブアイテムを選択した状態で開始する様に変更
		nas.easyXPS.XPSTLSelector.init();
		nas.easyXPS.DocSelector.init();
		nas.easyXPS.DocSelector.setDoc(app.activeDocument);//アクティブドキュメントを選択
		nas.easyXPS.lyrSelector.init();
		
		nas.easyXPS.show();


//	読み込み不良は未対処(07/04/02)
}else{
	var msg="ドキュメントがありません";
	alert(msg);
}



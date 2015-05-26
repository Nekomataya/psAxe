/*(各種設定)
 *	nasPsPref.jsx
 *
 *	プリファレンスパネル まだまだ変わるよ 暫定版
 *	直接	lib/config.js
 *		lib/nas_axeLib.js を書き換えれば何でもかけますよ、と
 *	Photoshop用に暫定的に改装　2011 06 25
 */

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
//Photoshop用ライブラリ読み込み

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
var includeLibs=[];//読み込みライブラリを格納する配列

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
  psAnimationFrameClass.js	PS用フレームアニメーション操作ライブラリ
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
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
includeLibs.push(nasLibFolderPath+"messages.js");
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

//オブジェクト識別文字列生成 
var myFilename=("$RCSfile: nasPrefPs.jsx,v $").split(":")[1].split(",")[0];
var myFilerevision=("$Revision: 1.1 $").split(":")[1].split("$")[0];
var exFlag=true;
var moduleName="Pref";//モジュール名で置き換えてください。
//二重初期化防止トラップ
try{
	if(nas.Version)
	{	nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;
		try{
if(nas[moduleName]){
//	nas.Pref.show();
//	再初期化トリガーはモジュールごとに適正なコマンドに置き換えてください。
	exFlag=true;
}else{
	nas[moduleName]=new Object();
}
		}catch(err){
	nas[moduleName]=new Object();
		}
	}
}catch(err){
	alert("nasライブラリが必要です。\nnasStartup.jsx を実行してください。");
	exFlag=false;
}


if(exFlag){
//		初期化

//		サブプロシジャ

// システム設定に置いたウィンドウオフセット取得。
	myLeft=(nas.GUI.winOffset["Pref"])?
	nas.GUI.winOffset["Pref"][0] : nas.GUI.dafaultOffset[0];
	myTop=(nas.GUI.winOffset["Pref"])?
	nas.GUI.winOffset["Pref"][1] : nas.GUI.dafaultOffset[1];
// ------ GUIセットアップ ---------
//WindowSetup	これはダイアログがよかろう…と思うよ。
//ダイアログはパレットとオブジェクトの扱いがちがーう
	nas.Pref=nas.GUI.newWindow("dialog","Preference",9,20,myLeft,myTop);
//コントロール定義
//メインコントロール

// TAB設定
	nas.GUI.setTabPanel(nas.Pref,["一般環境","メディア設定","動作設定","作画設定"],0,0,9,19);

//各タブにコントロールを配置
//	タブパネル０/一般環境設定
/*
config.js関連　斧・りまぴん共通部分(nas)
*/
	nas.GUI.addStaticText(nas.Pref.tabPanel[0],localize(nas.uiMsg["Name"]),0,1,2,1).justify="right";
//	nas.GUI.addStaticText(nas.Pref.tabPanel[0],localize({en:"name"}),0,1,2,1).justify="right";
	nas.Pref.tabPanel[0].Uname=nas.GUI.addEditText(nas.Pref.tabPanel[0],"",2,1,2,1);

	nas.GUI.addStaticText(nas.Pref.tabPanel[0],"基準解像度",0,2,2,1).justify="right";
	nas.Pref.tabPanel[0].bResolution=nas.GUI.addEditText(nas.Pref.tabPanel[0],"",2,2,2,1);

	nas.GUI.addStaticText(nas.Pref.tabPanel[0],"フレームレート",0,3,2,1).justify="right";
	nas.Pref.tabPanel[0].fRate=nas.GUI.addEditText(nas.Pref.tabPanel[0],"",2,3,2,1);

	nas.GUI.addStaticText(nas.Pref.tabPanel[0],"シート1枚の長さ",0,4,2,1).justify="right";
	nas.Pref.tabPanel[0].stLength=nas.GUI.addEditText(nas.Pref.tabPanel[0],"",2,4,2,1);

//タイトル編集
//	nas.GUI.addStaticText(nas.Pref.tabPanel[0],"作品タイトル登録",0,9,3,1);

/*
	作業タイトルDB更新インターフェース
*/

//プリセットリスト
	nas.Pref.tabPanel[0].TitleSelector=
		nas.GUI.addPanel(nas.Pref.tabPanel[0],"作品タイトル登録",0.2,8,8.5,9);
//編集コントロール登録
	nas.Pref.tabPanel[0].TitleSelector.init=function(){
	this.list=
		nas.GUI.addListBox(this,nas.workTitles.names("all"),nas.workTitles.selected,0.5,3.5,7,4);
//タイトル
	this.titleId=
		nas.GUI.addStaticText(this,"( "+nas.workTitles.selected+" )",0.3,1.6,0.7,1);
	this.titleId.justify="right";

//ロングプレフィクス
	this.myTitle=
		nas.GUI.addEditText(this,nas.workTitles.selectedName,1,1.5,4,1);
	this.myPrefix=
		nas.GUI.addEditText(this,nas.workTitles.selectedRecord[1],5,1.5,2,1);
//ショートプレフィクス
	this.myCode=
		nas.GUI.addEditText(this,nas.workTitles.selectedRecord[2],7,1.5,1,1);
//IM
	this.linkIM=
		nas.GUI.addSelectButton(this,nas.inputMedias.names(),nas.workTitles.selectedRecord[3],1,2.5,3,1);
//OM
	this.linkOM=
		nas.GUI.addSelectButton(this,nas.outputMedias.names(),nas.workTitles.selectedRecord[4],4,2.5,3,1);


//データ操作コントロール
	this.addEntry=
		nas.GUI.addButton(this,"新規登録",2.5,0.4,2,1);
	this.delEntry=
		nas.GUI.addButton(this,"削除",4.5,0.4,2,1);
	this.chgEntry=
		nas.GUI.addButton(this,"更新",6.5,0.4,2,1);
	}
nas.Pref.tabPanel[0].TitleSelector.init();

//編集コントロール再登録
	nas.Pref.tabPanel[0].TitleSelector.reInit=function(){
//	nas.workTitles.select();
	this.list.setOptions(nas.workTitles.names("all"),nas.workTitles.selected);
//タイトル
	this.titleId.text="( "+nas.workTitles.selected+" )";
//ロングプレフィクス
	this.myTitle.text=nas.workTitles.selectedName;
	this.myPrefix.text=nas.workTitles.selectedRecord[1];
//ショートプレフィクス
	this.myCode.text=nas.workTitles.selectedRecord[2];
//IM
	this.linkIM.options=nas.inputMedias.names();
	this.linkIM.select(nas.workTitles.selectedRecord[3]);
//OM
	this.linkOM.options=nas.outputMedias.names();
	this.linkOM.select(nas.workTitles.selectedRecord[4]);
}

//画面アップデート
nas.Pref.tabPanel[0].TitleSelector.update = function()
{
	this.titleId.text	="( "+nas.workTitles.selected+" )";
	this.myTitle.text	=nas.workTitles.selectedRecord[0];
	this.myPrefix.text	=nas.workTitles.selectedRecord[1];
	this.myCode.text	=nas.workTitles.selectedRecord[2];
	this.linkIM.select(nas.workTitles.selectedRecord[3]);
	this.linkOM.select(nas.workTitles.selectedRecord[4]);
	if(nas.Pref.tabPanel[1].MediaList){
		nas.Pref.tabPanel[1].MediaList.update();
		nas.Pref.tabPanel[1].oMediaList.update();
	}
	if(this.list.selected!=nas.workTitles.selected){
		this.list.check(nas.workTitles.selected)
	nas.inputMedias.select(nas.workTitles.selectedRecord[3]);
	nas.outputMedias.select(nas.workTitles.selectedRecord[4]);
//セレクタでタイトルを切り替えるタイミングで同時に入出力メディアはタイトルのものにリセットされるべき　201010128	
		}

	this.addEntry.enabled=false;
	this.chgEntry.enabled=false;
}

//nas.Pref.tabPanel[0].TitleSelector.update();

nas.Pref.tabPanel[0].init=function()
{
	this.Uname.text=nas.CURRENTUSER;
	this.bResolution.text=nas.Dpi();
	this.fRate.text=nas.FRATE;
	this.stLength.text=nas.Frm2FCT(nas.SheetLength*nas.FRATE,3);
	nas.workTitles.select();
	this.TitleSelector.reInit();
	this.TitleSelector.update();
}

nas.Pref.tabPanel[0].init();
//=========================================================タブパネル１/メディア登録
//フレーム用

//プリセットリスト
	nas.Pref.tabPanel[1].MediaList=
			nas.GUI.addPanel(nas.Pref.tabPanel[1],"入力メディア編集",0.2,0,8.5,9.);

//編集コントロール登録
	nas.Pref.tabPanel[1].MediaList.init=function()
	{
	this.list=
		nas.GUI.addListBox(this,nas.inputMedias.names("all"),nas.inputMedias.selected,0.5,3.5,7,4);

	this.imId=
		nas.GUI.addStaticText(this,"( "+nas.inputMedias.selected+" )",0.3,1.6,0.7,1);
	this.imId.justify="right";

	this.imName=
		nas.GUI.addEditText(this,nas.inputMedias.selectedName,1,1.5,3,1);
	this.imWidth=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[1],4,1.5,1,1);


	this.imFrameRatio=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[2],5,1.5,1,1);
	this.imResolution=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[3],6,1.5,1,1);
	this.imFrameRate=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[4],7,1.5,1,1);

	this.imPegID=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[5],4,2.5,1,1);
	this.imPegX=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[6],5,2.5,1,1);
	this.imPegY=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[7],6,2.5,1,1);
	this.imPegR=
		nas.GUI.addEditText(this,nas.inputMedias.selectedRecord[8],7,2.5,1,1);

//データ操作コントロール
	this.addEntry=
		nas.GUI.addButton(this,"新規登録",2.5,0.4,2,1);
	this.delEntry=
		nas.GUI.addButton(this,"削除",4.5,0.4,2,1);
	this.chgEntry=
		nas.GUI.addButton(this,"更新",6.5,0.4,2,1);
	}
nas.Pref.tabPanel[1].MediaList.init();

//編集コントロール再登録
	nas.Pref.tabPanel[1].MediaList.reInit=function()
	{
	nas.inputMedias.select();
	this.list.setOptions(nas.inputMedias.names("all"),nas.inputMedias.selected);

	this.imId.text="( "+nas.inputMedias.selected+" )";
	this.imName.text=nas.inputMedias.selectedName;
	this.imWidth,text=nas.inputMedias.selectedRecord;
	this.imFrameRatio.text=nas.inputMedias.selectedRecord[2];
	this.imResolution.text=nas.inputMedias.selectedRecord[3];
	this.imFrameRate.text=nas.inputMedias.selectedRecord[4];
	this.imPegID.text=nas.inputMedias.selectedRecord[5];
	this.imPegX.text=nas.inputMedias.selectedRecord[6];
	this.imPegY.text=nas.inputMedias.selectedRecord[7];
	this.imPegR.text=nas.inputMedias.selectedRecord[8];
	}
//画面アップデート
nas.Pref.tabPanel[1].MediaList.update = function()
{
	this.imId.text	="( "+nas.inputMedias.selected+" )";
	this.imName.text	=nas.inputMedias.selectedRecord[0];
	this.imWidth.text	=nas.inputMedias.selectedRecord[1];
	this.imFrameRatio.text	=nas.inputMedias.selectedRecord[2];
	this.imResolution.text	=nas.inputMedias.selectedRecord[3];
	this.imFrameRate.text	=nas.inputMedias.selectedRecord[4];
	this.imPegID.text	=nas.inputMedias.selectedRecord[5];
	this.imPegX.text	=nas.inputMedias.selectedRecord[6];
	this.imPegY.text	=nas.inputMedias.selectedRecord[7];
	this.imPegR.text	=nas.inputMedias.selectedRecord[8];

	if(this.list.selected!=nas.inputMedias.selected){this.list.check(nas.inputMedias.selected);}

	this.addEntry.enabled=false;
	this.chgEntry.enabled=false;

	nas.Pref.tabPanel[0].bResolution.text=nas.Dpi();
	nas.Pref.tabPanel[0].fRate.text=nas.FRATE;
}

//nas.Pref.tabPanel[1].MediaList.update();

// 出力メディアDB

//	nas.GUI.addStaticText(nas.Pref.tabPanel[1],"出力メディア登録",0,9,3,1);

//プリセットリスト
	nas.Pref.tabPanel[1].oMediaList=
		nas.GUI.addPanel(nas.Pref.tabPanel[1],"出力メディア編集",0.2,9,8.5,8.5);

//編集コントロール登録
	nas.Pref.tabPanel[1].oMediaList.init=function()
	{
	this.list=
		nas.GUI.addListBox(this,nas.outputMedias.names("all"),nas.outputMedias.selected,0.5,3,7,4);

	this.omId=
		nas.GUI.addStaticText(this,"( "+nas.outputMedias.selected+" )",0.3,1.6,0.7,1);
	this.omId.justify="right";

	this.omName=
		nas.GUI.addEditText(this,nas.outputMedias.selectedName,1,1.5,3,1);
	this.omWidth=
		nas.GUI.addEditText(this,nas.outputMedias.selectedRecord[1],4,1.5,1,1);


	this.omHeight=
		nas.GUI.addEditText(this,nas.outputMedias.selectedRecord[2],5,1.5,1,1);
	this.omPa=
		nas.GUI.addEditText(this,nas.outputMedias.selectedRecord[3],6,1.5,1,1);

	this.omFramerate=
		nas.GUI.addEditText(this,nas.outputMedias.selectedRecord[4],7,1.5,1,1);

//データ操作コントロール
	this.addEntry=
		nas.GUI.addButton(this,"新規登録",2.5,0.4,2,1);
	this.delEntry=
		nas.GUI.addButton(this,"削除",4.5,0.4,2,1);
	this.chgEntry=
		nas.GUI.addButton(this,"更新",6.5,0.4,2,1);
	}
nas.Pref.tabPanel[1].oMediaList.init();

//編集コントロール登録
	nas.Pref.tabPanel[1].oMediaList.reInit=function()
	{
		nas.outputMedias.select();
	this.list.setOptions(nas.outputMedias.names("all"),nas.outputMedias.selected);

	this.omId.text="( "+nas.outputMedias.selected+" )";
	this.omName.text=nas.outputMedias.selectedName;
	this.omWidth.text=nas.outputMedias.selectedRecord[1];
	this.omHeight.text=nas.outputMedias.selectedRecord[2];
	this.omPa.text=nas.outputMedias.selectedRecord[3];
	this.omFramerate.text=nas.outputMedias.selectedRecord[4];
	}
//画面アップデート
nas.Pref.tabPanel[1].oMediaList.update = function()
{
	this.omId.text	="( "+nas.outputMedias.selected+" )";
	this.omName.text	=nas.outputMedias.selectedRecord[0];
	this.omWidth.text	=nas.outputMedias.selectedRecord[1];
	this.omHeight.text	=nas.outputMedias.selectedRecord[2];
	this.omPa.text	=nas.outputMedias.selectedRecord[3];
	this.omFramerate.text	=nas.outputMedias.selectedRecord[4];

	if(this.list.selected!=nas.outputMedias.selected){this.list.check(nas.outputMedias.selected)}

	this.addEntry.enabled=false;
	this.chgEntry.enabled=false;

//	nas.Pref.tabPanel[0].TitleSelector.linkOM.options=nas.outputMedias.names();
//	nas.Pref.tabPanel[0].TitleSelector.linkOM.select();
}

//nas.Pref.tabPanel[1].oMediaList.update();

nas.Pref.tabPanel[1].init=function()
{
	this.MediaList.reInit();
	this.oMediaList.reInit();
	this.MediaList.update();
	this.oMediaList.update();
}

nas.Pref.tabPanel[1].init();


//=========================================================タブパネル２/詳細動作設定

	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"====================	読み込みフィルタ　====================",0,0,8,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"素材フィルタ : ",0,1,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"セルフィルタ : ",0,2,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"背景 : ",0,3,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"BOOK : ",0,4,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"レイアウト : ",0,5,2,1).justify="right";
/*
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"====================	素材管理フォルダ　====================",0,6,8,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"セル : ",0,7,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"背景 : ",0,8,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"レイアウト : ",0,9,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"フレーム : ",0,10,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"タイムシート : ",0,11,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"動画 : ",0,12,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"原画 : ",0,13,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"サウンド: ",0,14,2,1).justify="right";
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"その他 : ",0,15,2,1).justify="right";
*/
//インポートフィルタ
	nas.Pref.tabPanel[2].impFilt=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,1,7,1);
//セル判定フィルタ
	nas.Pref.tabPanel[2].cellFilt=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,2,7,1);
//BG
	nas.Pref.tabPanel[2].bgFilt=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,3,7,1);
//BOOK
	nas.Pref.tabPanel[2].mgFilt=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,4,7,1);
//レイアウト
	nas.Pref.tabPanel[2].loFilt=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,5,7,1);

/*
//ファイル配置DB
//	背景(静止画)
	nas.Pref.tabPanel[2].bgFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	7	,7,1);
//	セル(ペイント)
	nas.Pref.tabPanel[2].paintFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	8	,7,1);
//	レイアウト(フレームと同義で可　どちらのフォルダを使うのも可　ただしレ撮の際はこちらが絵素材)
	nas.Pref.tabPanel[2].loFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	9	,7,1);
//	フレーム(レイアウトと同義で可　どちらのフォルダを使うのも可　レ撮の場合は撮影参考フレーム配置場所)
	nas.Pref.tabPanel[2].frameFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	10	,7,1);
//	タイムシート、そのほかのXPS情報。将来的には進捗管理・作業管理もここ
	nas.Pref.tabPanel[2].etcFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	11	,7,1);
//	動画(レタス作業時はSCANフォルダと同義)
	nas.Pref.tabPanel[2].drwFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	12	,7,1);
//	原画（キーアニメーション・ラフ原は別だが未設定）
	nas.Pref.tabPanel[2].keyFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	13	,7,1);
//	サウンド(サウンドフッテージ　または　字幕テキストを所定形式で　<<予約>>)
	nas.Pref.tabPanel[2].sndFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	14	,7,1);
//	そのほか各種素材
	nas.Pref.tabPanel[2].othFld=
		nas.GUI.addEditText(nas.Pref.tabPanel[2],"",2,	15	,7,1);
*/
//=========================================================タブパネル２初期化
	nas.Pref.tabPanel[2].init=function()
	{
//フィルタ
		this.impFilt.text=nas.importFilter.toString();//インポートフィルタ
		this.cellFilt.text=nas.cellRegex.toString();//セル判定フィルタ
		this.bgFilt.text=nas.bgRegex.toString();//BG
		this.mgFilt.text=nas.mgRegex.toString();//BOOK
		this.loFilt.text=nas.loRegex.toString();//レイアウト
//フォルダ
/*
		this.bgFld.text=(nas.ftgFolders["bg"].toString());//
		this.paintFld.text=(nas.ftgFolders["paint"].toString());//
		this.loFld.text=(nas.ftgFolders["lo"].toString());//
		this.frameFld.text=(nas.ftgFolders["frame"].toString());//
		this.etcFld.text=(nas.ftgFolders["etc"].toString());//
		this.drwFld.text=(nas.ftgFolders["drawing"].toString());//
		this.keyFld.text=(nas.ftgFolders["key"].toString());//
		this.sndFld.text=(nas.ftgFolders["sound"].toString());//
		this.othFld.text=(nas.ftgFolders["unknown"].toString());//
*/
//		this.Fld.text=decodeURI(nas.ftgFolders[].toSource());//
	}
	nas.Pref.tabPanel[2].init();
/*
//レイアウト処理
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"L/O オプション : ",0,7,2,1);
	nas.Pref.tabPanel[2].loAp=
		nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"非表示",0.5,8,1.5,1);
		nas.Pref.tabPanel[2].loAp.value=(nas.viewLayout.visible)?false:true;
	nas.Pref.tabPanel[2].loMode=
		nas.GUI.addSelectButton(nas.Pref.tabPanel[2],["通常","乗算","比較(明)","比較(暗)","差の絶対値","シルエットルミナンス"],0,2,8,3,1);
		switch(nas.viewLayout.MODE){
		case 3612:	nas.Pref.tabPanel[2].loMode.select(0);break;
		case 3616:	nas.Pref.tabPanel[2].loMode.select(1);break;
		case 3621:	nas.Pref.tabPanel[2].loMode.select(2);break;
		case 3615:	nas.Pref.tabPanel[2].loMode.select(3);break;
		case 3633:	nas.Pref.tabPanel[2].loMode.select(4);break;
		case 3643:	nas.Pref.tabPanel[2].loMode.select(5);break;
		default:	nas.Pref.tabPanel[2].loMode.select(0);
		}
	nas.Pref.tabPanel[2].loOpa=
		nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"50%",5,8,1.5,1);
		nas.Pref.tabPanel[2].loOpa.value=(nas.viewLayout.RATIO==100)?false:true;
	nas.Pref.tabPanel[2].loGd=
		nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"ガイドレイヤにする",6.5,8,2.5,1);
		nas.Pref.tabPanel[2].loGd.value=nas.viewLayout.guideLayer;
//セルの処理
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"CELL オプション : ",0,9,2,1);

	nas.Pref.tabPanel[2].goClip=
	nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"カラーキーで白を透過",0,10,3,1);
	nas.Pref.tabPanel[2].goClip.value=nas.goClip;

	nas.Pref.tabPanel[2].killAlpha0=
		nas.GUI.addRadioButton(nas.Pref.tabPanel[2],"アルファチャンネル優先",0.5,11,3,1);	nas.Pref.tabPanel[2].killAlpha0.value=(nas.killAlpha)?false:true;

	nas.Pref.tabPanel[2].killAlpha1=
		nas.GUI.addRadioButton(nas.Pref.tabPanel[2],"カラーキー優先",4,11,3,1);
	nas.Pref.tabPanel[2].killAlpha1.value=(nas.killAlpha)?true:false;

	nas.Pref.tabPanel[2].goSms=
	nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"スムージングする",0,13,3,1);
	nas.Pref.tabPanel[2].goSms.value=nas.goSmooth;

	nas.Pref.tabPanel[2].smsOpt0=
		nas.GUI.addRadioButton(nas.Pref.tabPanel[2],"kp-smooth",1,14,2,1);
	nas.Pref.tabPanel[2].smsOpt0.value=(nas.cellOptions.selected==0)?true:false;

	nas.Pref.tabPanel[2].smsOpt1=
		nas.GUI.addRadioButton(nas.Pref.tabPanel[2],"KP-AntiAlias",1,15,4,1);
	nas.Pref.tabPanel[2].smsOpt1.value=(nas.cellOptions.selected==1)?true:false;

	nas.Pref.tabPanel[2].smsClip=
	nas.GUI.addCheckBox(nas.Pref.tabPanel[2],"white option",3,14,3,1);
	nas.Pref.tabPanel[2].smsClip.value=nas.smoothClip;
*/
//memo
	nas.GUI.addStaticText(nas.Pref.tabPanel[2],"このパネルの変更はセッション限りです。記録が必要な場合は下のボタンで保存してください。",0,17,9,1).justify="right";
//=========================================================タブパネル３　/　作画機能設定

	nas.GUI.addStaticText(nas.Pref.tabPanel[3],"作画機能設定",0,0,9,1).justify="right";

//レイヤコントロール設定
	nas.GUI.addStaticText(nas.Pref.tabPanel[3],"レイヤコントロール",0,1,2,1).justify="right";

nas.GUI.addStaticText(nas.Pref.tabPanel[3],"新規レイヤ作成時に",1,1.5,3,1).justify="right";
nas.Pref.tabPanel[3].nlOpc=nas.GUI.addCheckBox(nas.Pref.tabPanel[3],"透過させる",4,1.5,2,1);
nas.Pref.tabPanel[3].nlOpcValue=nas.GUI.addEditText(nas.Pref.tabPanel[3],"65",6,1.5,1,1);
nas.GUI.addStaticText(nas.Pref.tabPanel[3],"%",7,1.5,1,1).justify="left";

//=========色選択
//動画レイヤ
nas.Pref.tabPanel[3].colorSPC=nas.GUI.addPanel(nas.Pref.tabPanel[3],"新規レイヤの背景色",2,2,6,2);
for(var ix=0;ix<nas.axe.lyBgColors.length;ix++){
	nas.Pref.tabPanel[3]["rb"+ix]=nas.GUI.addRadioButton(nas.Pref.tabPanel[3].colorSPC,nas.axe.lyBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	nas.Pref.tabPanel[3]["rb"+nas.axe.lyBgColor].value=true;
//修正レイヤ
nas.Pref.tabPanel[3].colorSPCo=nas.GUI.addPanel(nas.Pref.tabPanel[3],"修正レイヤの背景色",2,3.7,6,2);
for(var ix=0;ix<nas.axe.ovlBgColors.length;ix++){
	nas.Pref.tabPanel[3]["rbo"+ix]=nas.GUI.addRadioButton(nas.Pref.tabPanel[3].colorSPCo,nas.axe.ovlBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	nas.Pref.tabPanel[3]["rbo"+nas.axe.ovlBgColor].value=true;

//プレビューコントロール設定
	nas.GUI.addStaticText(nas.Pref.tabPanel[3],"プレビューコントロール",0,7,2,1).justify="right";

nas.Pref.tabPanel[3].focusInterlocking=nas.GUI.addCheckBox(nas.Pref.tabPanel[3],"フレーム移動時にアクティブレイヤの移動をする"+nas.GUI.LineFeed+"(エクステンション使用時のみ有効)",4,6,6,2)

//ドキュメント設定
	nas.GUI.addStaticText(nas.Pref.tabPanel[3],"ドキュメント設定",0,9,2,1).justify="right";

//nas.GUI.addStaticText(nas.Pref.tabPanel[3],"新規ファイル作成ダイアログ",1,9,2,1).justify="right";
nas.Pref.tabPanel[3].selectDialog=nas.GUI.addCheckBox(nas.Pref.tabPanel[3],"新規ドキュメント作成時にアニメ拡張機能を使う",4,8,6,1)
//タップ画像配置時にブレンドモードを差の絶対値にする
nas.Pref.tabPanel[3].pegBlendMode=nas.GUI.addCheckBox(nas.Pref.tabPanel[3],"タップ画像配置時に差の絶対値にする",4,9,6,1)
//フレーム画像配置時に２０％透過にする
nas.Pref.tabPanel[3].frameOpacity=nas.GUI.addCheckBox(nas.Pref.tabPanel[3],"フレーム画像配置時に半透明にする",4,10,6,1)

nas.Pref.tabPanel[3].init=function()
{
	nas.Pref.tabPanel[3].nlOpc.value=nas.axe.newLayerTpr;
	nas.Pref.tabPanel[3].nlOpcValue.text=(nas.axe.onsOpc*100);
	nas.Pref.tabPanel[3]["rb"+nas.axe.lyBgColor].value=true;
	nas.Pref.tabPanel[3]["rbo"+nas.axe.ovlBgColor].value=true;
	nas.Pref.tabPanel[3].focusInterlocking.value=nas.axe.focusMove;
	nas.Pref.tabPanel[3].selectDialog.value=nas.axe.dmDialog;
	nas.Pref.tabPanel[3].pegBlendMode.value=nas.axe.pegBlend;
	nas.Pref.tabPanel[3].frameOpacity.value=nas.axe.frameOpc;
}

nas.Pref.tabPanel[3].init();


//Yes No Cancel
	nas.Pref.readButton=nas.GUI.addButton(nas.Pref,"読込",0,19,2,1);
	nas.Pref.writeButton=nas.GUI.addButton(nas.Pref,"保存",2,19,2,1);
	nas.Pref.clearButton=nas.GUI.addButton(nas.Pref,"消去",4,19,2,1);
	nas.Pref.closeButton=nas.GUI.addButton(nas.Pref,"close",6,19,3,1);	

//=========================================================コントロールファンクション設定
//メインコントロール
//Tab[0]
//nas_common
	nas.Pref.tabPanel[0].Uname.onChange=function(){nas.CURRENTUSER=this.text};
	nas.Pref.tabPanel[0].bResolution.onChange=function(){nas.RESOLUTION=this.text/2.54;this.text=nas.Dpi()};
	nas.Pref.tabPanel[0].fRate.onChange=function(){if(! isNaN(this.text)){nas.FRATE=this.text;};this.text=nas.FRATE;};
	nas.Pref.tabPanel[0].stLength.onChange=function(){var frames=nas.FCT2Frm(this.text);if(! isNaN(frames)){nas.SheetLength=frames};this.text=nas.Frm2FCT(nas.SheetLength,3);};

//TitleDB
	nas.Pref.tabPanel[0].TitleSelector.addEntry.onClick=function()
	{
		nas.workTitles.push(
			this.parent.myTitle.text,
			[
				this.parent.myPrefix.text,
				this.parent.myCode.text,
				this.parent.linkIM.selected,
				this.parent.linkOM.selected
			]
		);
		this.parent.list.setOptions(nas.workTitles.names("all"),nas.workTitles.selected);
		this.parent.list.check(nas.workTitles.selected);
	};
	nas.Pref.tabPanel[0].TitleSelector.delEntry.onClick=function()
	{
		if(this.parent.list.options.length==1) {alert("エントリが0になるので削除できません。");return;}
		if(confirm("選択されたエントリを削除します。\nよろしいですか?"))
		{
			nas.workTitles.del(this.parent.list.selected);
			nas.workTitles.select();
			this.parent.list.setOptions(nas.workTitles.names("all"),nas.workTitles.selected);
			this.parent.list.check(nas.workTitles.selected);
			this.parent.update();
		}
	};

	nas.Pref.tabPanel[0].TitleSelector.chgEntry.onClick=function()
	{
		nas.workTitles.change(
			this.parent.myTitle.text,
			[
				this.parent.myPrefix.text,
				this.parent.myCode.text,
				this.parent.linkIM.selected,
				this.parent.linkOM.selected
			],
			this.parent.list.selected
		);

		this.parent.list.setOptions(nas.workTitles.names("all"),nas.workTitles.selected);
		this.parent.list.check(nas.workTitles.selected);

		this.parent.update();
	};

	nas.Pref.tabPanel[0].TitleSelector.myTitle.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[0].TitleSelector.myPrefix.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[0].TitleSelector.myCode.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[0].TitleSelector.linkIM.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[0].TitleSelector.linkOM.onChange=function(){this.parent.chgvalue("Name")};

	nas.Pref.tabPanel[0].TitleSelector.chgvalue=function()
	{
		this.addEntry.enabled=true;
		this.chgEntry.enabled=true;
	return;
	};

	nas.Pref.tabPanel[0].TitleSelector.list.onChange=function()
	{
		if(this.selected==null)
		{
			this.check(nas.workTitles.selected);
			return;
		};
		nas.workTitles.select(this.selected);
		this.parent.update();
	};
//Tab[1]
//IM DB
	nas.Pref.tabPanel[1].MediaList.addEntry.onClick=function()
	{
		nas.inputMedias.push(
			this.parent.imName.text,
			[
				this.parent.imWidth.text,
				this.parent.imFrameRatio.text,
				this.parent.imResolution.text,
				this.parent.imFrameRate.text,
				this.parent.imPegID.text,
				this.parent.imPegX.text,
				this.parent.imPegY.text,
				this.parent.imPegR.text
			]
		);
		this.parent.list.setOptions(nas.inputMedias.names("all"),nas.inputMedias.selected);
		this.parent.list.check(nas.inputMedias.selected);		
	};
	nas.Pref.tabPanel[1].MediaList.delEntry.onClick=function()
	{
		if(this.parent.list.options.length==1) {alert("エントリが0になるので削除できません。");return;}
		if(confirm("選択されたエントリを削除します。\nよろしいですか?"))
		{
			nas.inputMedias.del(this.parent.list.selected);
			this.parent.list.setOptions(nas.inputMedias.names("all"),nas.inputMedias.selected);
			this.parent.list.check(nas.inputMedias.selected);
			this.parent.reInit();
		}
	};

	nas.Pref.tabPanel[1].MediaList.chgEntry.onClick=function()
	{
		nas.inputMedias.change(
			this.parent.imName.text,
			[
				this.parent.imWidth.text,
				this.parent.imFrameRatio.text,
				this.parent.imResolution.text,
				this.parent.imFrameRate.text,
				this.parent.imPegID.text,
				this.parent.imPegX.text,
				this.parent.imPegY.text,
				this.parent.imPegR.text
			],
			this.parent.list.selected
		);
		this.parent.list.setOptions(nas.inputMedias.names("all"),nas.inputMedias.selected);
		this.parent.list.check(nas.inputMedias.selected);		

		this.parent.update();
	};
	nas.Pref.tabPanel[1].MediaList.imName.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imWidth.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imFrameRatio.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imResolution.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imFrameRate.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imPegID.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imPegX.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imPegY.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].MediaList.imPegR.onChange=function(){this.parent.chgvalue("Name")};

	nas.Pref.tabPanel[1].MediaList.chgvalue=function()
	{
		this.addEntry.enabled=true;
		this.chgEntry.enabled=true;
	return;
	};

	nas.Pref.tabPanel[1].MediaList.list.onChange=function()
	{
		if(this.selected==null)
		{
			this.check(nas.inputMedias.selected);
			return;
		};
		nas.inputMedias.select(this.selected);
		nas.registerMarks.select(nas.inputMedias.selectedRecord[5])
		this.parent.update();
	};
//OM DB
	nas.Pref.tabPanel[1].oMediaList.addEntry.onClick=function()
	{
		nas.outputMedias.push(
			this.parent.omName.text,
			[
				this.parent.omWidth.text,
				this.parent.omHeight.text,
				this.parent.omPa.text,
				this.parent.omFramerate.text
			]
		);
		this.parent.list.setOptions(nas.outputMedias.names("all"),nas.outputMedias.selected);
		this.parent.list.check(nas.outputMedias.selected);		
	};
	nas.Pref.tabPanel[1].oMediaList.delEntry.onClick=function()
	{
		if(this.parent.list.options.length==1) {alert("エントリが0になるので削除できません。");return;}
		if(confirm("選択されたエントリを削除します。\nよろしいですか?"))
		{
			nas.outputMedias.del(this.parent.list.selected);
			this.parent.list.setOptions(nas.outputMedias.names("all"),nas.outputMedias.selected);
			this.parent.list.check(nas.outputMedias.selected);
			this.parent.reInit();
		}
	};

	nas.Pref.tabPanel[1].oMediaList.chgEntry.onClick=function()
	{
		nas.outputMedias.change(
			this.parent.omName.text,
			[
				this.parent.omWidth.text,
				this.parent.omHeight.text,
				this.parent.omPa.text,
				this.parent.omFramerate.text
			],
			this.parent.list.selected
		);

		this.parent.list.setOptions(nas.outputMedias.names("all"),nas.outputMedias.selected);
		this.parent.list.check(nas.outputMedias.selected);		

		this.parent.update();
	};

	nas.Pref.tabPanel[1].oMediaList.omName.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].oMediaList.omWidth.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].oMediaList.omHeight.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].oMediaList.omPa.onChange=function(){this.parent.chgvalue("Name")};
	nas.Pref.tabPanel[1].oMediaList.omFramerate.onChange=function(){this.parent.chgvalue("Name")};

	nas.Pref.tabPanel[1].oMediaList.chgvalue=function()
	{
		this.addEntry.enabled=true;
		this.chgEntry.enabled=true;
	return;
	};

	nas.Pref.tabPanel[1].oMediaList.list.onChange=function()
	{
		if(this.selected==null)
		{
			this.check(nas.outputMedias.selected);
			return;
		};
		nas.outputMedias.select(this.selected);
		this.parent.update();
	};
//Tab[2]
	nas.Pref.tabPanel[2].impFilt.onChange=function(){nas.importFilter=(this.text.match(/^\/.*\/[rgi]$/))?eval(this.text):new RegExp(this.text)};
	nas.Pref.tabPanel[2].cellFilt.onChange=function(){nas.cellRegex=(this.text.match(/^\/.*\/[rgi]$/))?eval(this.text):new RegExp(this.text)};
	nas.Pref.tabPanel[2].bgFilt.onChange=function(){nas.bgRegex=(this.text.match(/^\/.*\/[rgi]$/))?eval(this.text):new RegExp(this.text)};
	nas.Pref.tabPanel[2].mgFilt.onChange=function(){nas.mgRegex=(this.text.match(/^\/.*\/[rgi]$/))?eval(this.text):new RegExp(this.text)};
	nas.Pref.tabPanel[2].loFilt.onChange=function(){nas.loRegex=(this.text.match(/^\/.*\/[rgi]$/))?eval(this.text):new RegExp(this.text)};
/*
	nas.Pref.tabPanel[2].bgFld.onChange=function(){nas.ftgFolders["bg"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].paintFld.onChange=function(){nas.ftgFolders["paint"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].loFld.onChange=function(){nas.ftgFolders["lo"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].frameFld.onChange=function(){nas.ftgFolders["frame"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].etcFld.onChange=function(){nas.ftgFolders["etc"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].drwFld.onChange=function(){nas.ftgFolders["drawing"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].keyFld.onChange=function(){nas.ftgFolders["key"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].sndFld.onChange=function(){nas.ftgFolders["sound"]=(this.text.split(","))};
	nas.Pref.tabPanel[2].othFld.onChange=function(){nas.ftgFolders["unknown"]=(this.text.split(","))};
*/
/*

	nas.Pref.tabPanel[2].loAp.onClick=function(){nas.viewLayout.visible=(this.value)?false:true;}
	nas.Pref.tabPanel[2].loMode.onChange=function(){
		switch(this.selected)
		{
	case 0:nas.viewLayout.MODE=BlendingMode.NORMAL ;break;
	case 1:nas.viewLayout.MODE=BlendingMode.MULTIPLY ;break;
	case 2:nas.viewLayout.MODE=BlendingMode.LIGHTEN ;break;
	case 3:nas.viewLayout.MODE=BlendingMode.DARKEN ;break;
	case 4:nas.viewLayout.MODE=BlendingMode.DIFFERENCE ;break;
	case 5:nas.viewLayout.MODE=BlendingMode.SILHOUETTE_LUMA ;break;
	default :nas.viewLayout.MODE=BlendingMode.NORMAL ;
		}
	}
nas.Pref.tabPanel[2].loOpa.onClick=function(){nas.viewLayout.RATIO=(this.value)?50:100;};
nas.Pref.tabPanel[2].loGd.onClick=function(){nas.viewLayout.guideLayer=(this.value)?true:false;};
//セルクリップ
	nas.Pref.tabPanel[2].goClip.onClick=function(){nas.goClip=this.value;}
	nas.Pref.tabPanel[2].killAlpha0.onClick=function(){nas.killAlpha=(this.value)?false:true;}
	nas.Pref.tabPanel[2].killAlpha1.onClick=function(){nas.killAlpha=(this.value)?true:false;}
	nas.Pref.tabPanel[2].goSms.onClick=function(){nas.goSmooth=this.value;};

	nas.Pref.tabPanel[2].smsOpt0.onClick=function(){nas.cellOptions.select(0)};
	nas.Pref.tabPanel[2].smsOpt1.onClick=function(){nas.cellOptions.select(1)};
	nas.Pref.tabPanel[2].smsClip.onClick=function(){nas.smoothClip=this.value;}
*/
//tab[3]

	nas.Pref.tabPanel[3].nlOpc.onClick=function(){nas.axe.newLayerTpr=this.value};
	nas.Pref.tabPanel[3].nlOpcValue.onChange=function(){
		var myNumber=new Number(this.text);
		if((myNumber<=100)&&(myNumber>=0)){nas.axe.onsOpc=myNumber/100}else{this.text=(nas.axe.onsOpc*100);}
	}
	nas.Pref.tabPanel[3].chgColor=function(){
	 for(var ix=0;ix<nas.axe.lyBgColors.length;ix++){
	  if(nas.Pref.tabPanel[3]["rb"+ix].value){nas.axe.lyBgColor=ix;break;}
	 }
	 for(var ix=0;ix<nas.axe.ovlBgColors.length;ix++){
	  if(nas.Pref.tabPanel[3]["rbo"+ix].value){nas.axe.ovlBgColor=ix;break;}
	 }
	};
	for(var ix=0;ix<nas.axe.lyBgColors.length;ix++){
	 nas.Pref.tabPanel[3]["rb"+ix].onClick=nas.Pref.tabPanel[3].chgColor
	}
	for(var ix=0;ix<nas.axe.ovlBgColors.length;ix++){
	 nas.Pref.tabPanel[3]["rbo"+ix].onClick=nas.Pref.tabPanel[3].chgColor
	}
	nas.Pref.tabPanel[3].focusInterlocking.onClick=function(){nas.axe.focusMove=this.value;}
	nas.Pref.tabPanel[3].selectDialog.onClick=function(){nas.axe.dmDialog=this.value;}
	nas.Pref.tabPanel[3].pegBlendMode.onClick=function(){nas.axe.pegBlend=this.value;}
	nas.Pref.tabPanel[3].frameOpacity.onClick=function(){nas.axe.frameOpc=this.value;}

//Yes/No/Cacel
	nas.Pref.readButton.onClick=function(){
		var doAction=confirm("保存中の設定を読み込みます。現在の設定は上書きされます。"+nas.GUI.LineFeed+"取り消しはできません。よろしいですか？");
		if(doAction){nas.readPrefarence();this.parent.init("all")};
		};
	nas.Pref.writeButton.onClick=function(){
		var doAction=confirm("設定を["+nas.prefarenceFolder.fsName+"]以下に保存します。"+nas.GUI.LineFeed+"以前のファイルは上書きされます。よろしいですか？");
		if(doAction){nas.writePrefarence()}
		};
	nas.Pref.clearButton.onClick=function(){nas.cleraPrefarence();};
	nas.Pref.closeButton.onClick=function(){nas.Pref.close();};
//アップデートコントロール
	nas.Pref.init=function(opt)
	{
		if(!opt) opt="all";
		switch(opt){
		case	"0":
			this.tabPanel[0].init();
		break;
		case	"1":;
			this.tabPanel[1].init();
		break;
		case	"2":;
			this.tabPanel[2].init();
		break;
		case	"3":;
			this.tabPanel[3].init();
		break;
		default:
			this.tabPanel[0].init();
			this.tabPanel[1].init();
			this.tabPanel[2].init();
			this.tabPanel[3].init();
		}
	}


//	ウィンドウ最終位置を記録
	nas.Pref.onMove=function(){
nas.GUI.winOffset["Pref"] =[nas.Pref.bounds[0],nas.Pref.bounds[1]];
	}

//Start GUI
nas.Pref.show();
//
}

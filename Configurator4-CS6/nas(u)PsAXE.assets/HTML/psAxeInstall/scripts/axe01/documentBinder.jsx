// Photoshopで原撮準備
/*
現在開いたファイルを対象に、すべてのファイルをひとつのファイルにまとめる。
その際、1レイヤづつ名前をつけてゆく。
名前ウィンドウは、マウスクリックで編集可能

	アクションシートの前駆
レイヤ	番号	サブレイヤ
[ BG ]
[BOOK]
[ LO ]			[演出]
[ A ]	[-number]	[作監]
[ B ]	[up][down]	[総作監]
[ C ]	
[ D ]	
[ E ]	
[ F ]	
[ G ]	
[PAN]
[SLIDE]
[T.U.]
[T.B.]
[SCALE]
[付けPAN]
[ゴンドラ]
[effect]
[特効]

ラストにレイヤを再配置してシートを書き出し(MAPつき)


AEでは、シートにしたがってレイヤごとに ON/OFF(IN/OUT or ON/blank)処理する。

機能追加
対象がpsdファイル（マルチレイヤ）であった場合は、ドキュメントをひとつのレイヤセットにまとめて
レイヤセットにファイル名をつけて収集する。
ただし現在のスクリプト仕様ではレイヤセットのコピーペーストは不能なので再帰的にレイヤを複製する必要がある
一考　今日はやめとく
暫定的に第一レイヤを複製するコードで対処
　2011.02.15
 */

//for PreComp with Photoshop

var exFlag=false;
exFlag=confirm(localize({
en:"It will bundle a document that is currently open.\nChange of documents being destroyed, all the files will be closed.\nAre you sure you want to run?",
ja:"現在開いているドキュメントを収集します。\n変更は破棄されて、すべてのファイルは閉じられます。\n実行してよろしいですか？"
}));
    if (exFlag){
//現在オープンされているすべてのドキュメントをソースとして控える。
//ソース候補の選択UIが必要 可能ならadobe製のモノを流用
	var sourceDocs=new Array();
	var maxHeight=0;	var maxWidth=0;	var maxResolution=0;

for (idx=0;idx<app.documents.length;idx++)
{
	sourceDocs[idx]=app.documents[idx];

//	ソースの最大サイズを取得 新規ドキュメントを作成する。
	if(maxWidth<sourceDocs[idx].width.as("px")*1)
	{
		maxWidth=sourceDocs[idx].width.as("px")*1;
	}
	if(maxHeight<sourceDocs[idx].height.as("px")*1)
	{
		maxHeight=sourceDocs[idx].height.as("px")*1;
	}
	if(maxResolution<sourceDocs[idx].resolution.toString()*1)
	{
		maxResolution=sourceDocs[idx].resolution.toString()*1;
	}
};
//	ソースドキュメントのカット番号を推定して名前として取得する。
// ファイルが存在しないと思われる場合はカレントフォルダと仮名称を作成
	if(activeDocument.name.match(/.+\.[^\.]+$/)){
		var targetFolder=Folder(activeDocument.fullName.path);
		var previewValue=targetFolder.name;
//	var previewValue="c000";
	}else{
		var targetFolder=new Folder(Folder.current.fsName);
		var previewValue=activeDocument.name;
	}
//ここはプロンプトでなく File.saveFlg()に置き換える

//	myDocName=prompt(localize(nas.uiMsg.inputDocName),previewValue);//ドキュメントの名前を入力

var myDoc=new File(targetFolder.path.toString()+"/"+targetFolder.name+"/"+previewValue+".psd");
	var myResult=myDoc.saveDlg(localize(nas.uiMsg.inputDocName));//"ドキュメントの名前を入力"
if(myResult){
	targetFolder=myResult.parent;
	myDocName=myResult.name.replace(/\.[^.]+$/,"");
}else{
//キャンセル指定として扱う　処理中断　ファイルを名称未設定で作成するか否か問う。ことにしたい
	;
	targetFolder=null;
	myDocName="noname";
};

//	if(myDocName==null){myDocName=previewValue};
var destDoc=app.documents.add(maxWidth+" px",maxHeight+" px",maxResolution+" dpi",myDocName);
	var voidLayer=app.activeDocument.layers[0];//最初のレイヤを控えておく
	//作ったドキュメントをあらかじめ保存しておく　フラグによってはファイルなしで作成を考慮
if(targetFolder){
	var mySaveFile=new File(targetFolder.path.toString()+"/"+targetFolder.name+"/"+myDocName+".psd");

	destDoc.saveAs(mySaveFile);
	mySaveFile=null;
}
//if(maxResolution>144)
//{
//	destDoc.resizeImage(this.width,this.height,144);
//};

for (idx=0;idx<sourceDocs.length;idx++)
{
//ソースドキュメントをアクティブに
	app.activeDocument=sourceDocs[idx];
	var myLayerName=app.activeDocument.name;//
	
	if(app.activeDocument.pixelAspectRatio!=1)
	{
		app.activeDocument.pixelAspectRatio=1;
	}
//	ドキュメントが2値だったらグレースケールに変換
	if(app.activeDocument.mode==DocumentMode.BITMAP)
	{
		app.activeDocument.changeMode(ChangeMode.GRAYSCALE);
	}

	app.activeDocument.flatten();//複数かもしれないのでいったんレイヤを統合
	app.activeDocument.artLayers[0].copy();//レイヤ1をコピー
var orgBounds=app.activeDocument.artLayers[0].bounds;
var mySelectRegion=[[orgBounds[0].as("px"),orgBounds[1].as("px")],[orgBounds[2].as("px"),orgBounds[1].as("px")],[orgBounds[2].as("px"),orgBounds[3].as("px")],[orgBounds[0].as("px"),orgBounds[3].as("px")]];
//	if(app.activeDocument.saved){
		if(myLayerName.match(/^(.*)\..+?$/i))
		{
			myLayerName=RegExp.$1;//拡張子を払う
	/* これは正確には「最初のドットよりも前の文字列の取得」なので注意 */
		}
//確認
//		myLayerName=prompt("レイヤ名を確認",myLayerName);

	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

	app.activeDocument=destDoc;//複写先をアクティブに
	app.activeDocument.selection.select(mySelectRegion,SelectionType.REPLACE);//リジョンを選択　ドキュメント単位で左端がマッチ
	app.activeDocument.paste();//
	app.activeDocument.activeLayer.name=myLayerName;
//		レイヤに名前を設定(もとファイルのファイル名?)
};

//最初のレイヤまたは背景レイヤを捨てる
	voidLayer.remove();
if(false){
//	ドキュメントが144dpi以外だったら144dpiにリサンプル
	if(app.activeDocument.resolution.toString()!="144 dpi")
	{
		app.activeDocument.resizeImage(this.width,this.height,144);
	}
}
//新規ドキュメント作成系列なので UNDOまとめ処理は不要（戻りルートは無用）
    }
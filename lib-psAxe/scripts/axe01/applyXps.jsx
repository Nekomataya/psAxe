/*(タイムシート適用)
	Xps Sheet　データをPSDフレームアニメーションに適用
    undo 設定を行わない。
    この機能はチューニングの余地が多すぎるのでまだ最適化しないで置いておく 2011/09/25
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
// in case we double clicked the file
app.bringToFront();
//Photoshop用ライブラリ読み込み

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
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
includeLibs.push(nasLibFolderPath+"config.js");//configのみ加えて参照可能に
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
//動作抑制オブジェクト
	var XPS=new Xps();
//	nas.XPSStore=new XpsStore();

var myTimeCount=new Object();
	myTimeCount.start=new Date().getTime();
	myTimeCount.current=0;
	myTimeCount.datas=new Array();
	myTimeCount.datas.push(["started",0])
	myTimeCount.check=function(myLabel){
		now = new Date().getTime();
		this.datas.push([myLabel,now-this.start-this.current]);
		this.current=now-this.start;
	}

if((app.documents.length)&&(app.activeDocument.name.match(/.*\.psd$/i))){
myTimeCount.check("loadLib");
//
var myTarget=app.activeDocument;
myTarget.buildPsQueue=_buildPsQueue;
myTarget.setView=_setView;
if(myTarget.viewBuf){delete myTarget.viewBuf};//暫定的にviewBufクリア
var myXpsFile=new File([myTarget.fullName.path,myTarget.fullName.name.replace(/\.psd/,".xps")].join("/"));


if(myXpsFile.exists){
	//ファイルが存在するので読み込み
		var myOpenfile = new File(myXpsFile.fsName);
		myOpenfile.encoding="UTF8";
		myOpenfile.open("r");
		var myContent = myOpenfile.read();
	//	alert(myContent);
		if(myContent.length==0){alert("Zero Length!");}
		myOpenfile.close();
		XPS.readIN(myContent);
		myTimeCount.check("readIN");
//後処理に便利なのでシート参照配列を作成する。
	var myTargetOrder=0;//0はシート全体、そのほかは下から順に
if(myTarget.activeLayer.parent.typename!="Document"){
	for (var tlIx=0;tlIx<myTarget.layers.length;tlIx++){
		if(myTarget.layers[tlIx]==myTarget.activeLayer.parent){var myTargetOrder=(myTarget.layers.length-tlIx);break;}
	}
}
//ドキュメントの適用対象レイヤ数とシートのタイムライン数のうち小さい方をとってキュー配列をビルドする
//タイムシート上第一フレームが(カラでなく)未記入の場合は、スキップコードを埋める
var myTRs=new Array();
myTrCounts=(XPS.layers.length<myTarget.layers.length)? XPS.layers.length:myTarget.layers.length;
for(var idx=0;idx<myTrCounts;idx++){
	if(XPS.xpsBody[idx+1][0]==""){
		myTRs.push(-1);
	}else{
		if((myTargetOrder==0)||((idx+1)==myTargetOrder)){myTRs.push(idx+1)}else{myTRs.push(-1)}
	}
}
//alert(myTRs.toString());//確認用
/*
	ドキュメントの選択状態をスイッチとして動作を切り替えるべき
	第一階層のLayerSetまたはArtLayerを選択していた場合はシート全体の適用
	第二階層のLayerSetまたはArtLayerを選択していた場合は当該タイムラインの適用を行う
	シートがない場合の動作は同じ。
	myTRsを再構成することで実装?
*/


		var myQueue=myTarget.buildPsQueue(XPS,myTRs);
		myTimeCount.check("buildQueue");
		//取得したQueue列をアニメーションフレームへ転換
		//表示初期化
		//アニメーションテーブル初期化
//くみ上げたキューが多数の場合は時間がかかるのでこの場で警告して処理スキップできるようにする
	var doApply=true;
// alert("queue= "+ myQueue.length +": "+ myTimeCount.datas[3][1]);
	if((myQueue.length>50)||(myTimeCount.datas[3][1]>20000)){doApply=confirm("(警告！)適用に1分以上かかるかもしれません。続行しますか？");}

	if(doApply){
		//アニメウィンドウを初期化する＞要するに全て消す
        nas.axeAFC.initFrames();
		myTimeCount.check("clearFrames");
//==============================================================
		//第一（キー）フレームを設定
		var myIndex=myQueue[0].index;
		var myDuration=myQueue[0].duration/XPS.framerate;//継続フレームを時間に変換
		myTarget.setView(myQueue[0]);
		setDly(myDuration);
		//第二フレーム以降をループ設定
		for(var idx=1;idx<myQueue.length;idx++){
		 dupulicateFrame();//作る（フォーカス移動）
		 myDuration=myQueue[idx].duration/XPS.framerate;//継続フレームを時間に変換
		 myTarget.setView(myQueue[idx]);
		 setDly(myDuration);
		}
	}else{alert("処理を中断しました")}

}else{
	//ターゲットのXPSが存在しないので、現状のドキュメントに従う（と思われる）XPSをカラで生成して保存する
	//可能ならその場で編集ユニットをコールする
	var myDuration=72;//frames
	var myFps=nas.FRATE;
	XPS.init(myTarget.layers.length,myDuration);
	XPS.framerate=myFps;
	XPS.mapfile=myTarget.fullName.fsName;
	var mx=myTarget.layers.length;
	for(var lix=0;lix<mx;lix++){
		XPS.layers[lix].name=(myTarget.layers[mx-lix-1].name.replace(/\s/g,""));//name設定時にencoding設定してレイヤ名から空白をエスケープすること
		XPS.layers[lix].sizeX=myTarget.layers[mx-lix-1].bounds[2].as("px")-myTarget.layers[mx-lix-1].bounds[0].as("px");
		XPS.layers[lix].sizeY=myTarget.layers[mx-lix-1].bounds[3].as("px")-myTarget.layers[mx-lix-1].bounds[1].as("px");
		XPS.layers[lix].lot=(myTarget.layers[mx-lix-1].layers)?myTarget.layers[mx-lix-1].layers.length:1;
	}
	if(confirm("タイムシートがありません。新規に作成して編集しますか？")){
//保存して　ドキュメントを呼び出す
		myXpsFile.encoding="utf8"
		myXpsFile.open("w");
		myXpsFile.write(XPS.toString());
		myXpsFile.close();

		myXpsFile.execute();
	}
}
		myTimeCount.check("applyXPS");
		if (dbg){alert(myTimeCount.datas.toSource())};
}else{
	alert ("ドキュメントをpsd形式で保存してください。") 
}
//alert(XPS.toString())
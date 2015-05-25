/*
カラーオーダーボックス
色指定用の枠を作るUIつきスクリプト
テキストで名前と入れると前景色でカラーチップを描いて上下にダミーチップをつける。
スーパー暫定版	2008/02/03

*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){exFlag=false;}
if(exFlag){

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
	bootFlag=false;
};

/*	ライブラリ読み込み
ここで必要なライブラリをリストに加えてから読み込みを行う
*/
	if(false){
includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	}
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"psCCfontFix.js");

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

//仮値なのですべてポイント指定
/*
	selection.select()はpoint指定のみなのでその前で換算が必要
	デフォルトを埋め込んで、UIでサイズのみ変更が吉
	2 x 1.5 cm(w/h) 位か?
	Document.selection.select()メソッドはマニュアルにポイント指定だと書いてあるけど、
	実際はpxなので注意(CS2)
*/
var targetLayer	=(app.activeDocument.activeLayer)?app.activeDocument.activeLayer:app.activeDocument.layers[0];
var myDPC	=app.activeDocument.resolution/2.54;
var boxNum	=3;//ボックス数は 3(Hi/ノーマル/1号)
var boxWidth	=2;//サイズは、とりあえず[cm]
var boxHeight	=1.5;
var colorReverse =true;//仮色の反転フラグ(RGB反転なので明暗も反転)
//初期位置はセレクションがあればその左上、無い場合は、アクティブドキュメントの中央
var myPoint=div([app.activeDocument.width.as("px"),app.activeDocument.height.as("px")],2);//画面中央

/*	とりあえずパス今のところ出現位置は中央固定
まず、選択範囲の有る無しは、このルーチンで取得できないケースが多い(例の仕様変更の余波っぽいがウラワザなので無理は禁物)
 function checkSelection(){var flag = true;try {activeDocument.selection.translateBoundary(0,0);}catch(e){flag = false;}return flag;}

if (checkSelection())
{
	alert(app.activeDocument.selection.bounds.toString());//取得できないケースが多すぎ。ぎゃー
//ぎゃーもなにも全然取得できない?なんだこれは?
}
 */

if(app.activeDocument.selection)
var centerColor=new Array();
centerColor[0]=app.foregroundColor.rgb.red;
centerColor[1]=app.foregroundColor.rgb.green;
centerColor[2]=app.foregroundColor.rgb.blue;


function drawColorBox(boxName,myPoint,boxWidth,boxHeight,boxNum){

/*
	ドキュメントのバウンディングボックスを超えると数値の反転が発生しているっぽい
	UI操作ではおきないタイプの操作ではかなり信頼度(対応)が甘いカンジ
実操作の前に概略計算をおこなう
指定位置は描画範囲の中心にする
はみ出しにより安全な対応にする為には、別ドキュメントで書いてペーストした方が良さそう
2008/02/03
*/
var fontSize=boxHeight*(0.6);
var myMargin=6;
var myWidth	=boxWidth;
var myHeight	=(boxHeight*boxNum)+fontSize+myMargin;
var myLineColor=new SolidColor();
	myLineColor.rgb.red	=0;
	myLineColor.rgb.green	=0;
	myLineColor.rgb.blue	=0;

//	文字を記入(テキストレイヤが良い・フォントは現在のフォントサイズのみ調整)
//	チップレイヤとリンクさせる事
	var myTextLayer=app.activeDocument.artLayers.add();
		myTextLayer.kind=LayerKind.TEXT;
		myTextLayer.textItem.contents=boxName;//テキスト挿入
		myTextLayer.textItem.font="Heisei Kaku Gothic Std W5";//フォント設定
var myFontSize=Math.floor(72*(boxHeight/2)/app.activeDocument.resolution);
		myTextLayer.textItem.size=myFontSize;//フォントサイズ設定ポイント
	//バグが発生した場合指定ポイント数と異なるデータが返るのでそれを判定
if (Math.round(myTextLayer.textItem.size.as("point"))!=myFontSize){
  nas.PSCCFontSizeFix.setFontSizePoints( myTextLayer, myFontSize);//
};
		nas.PSCCFontSizeFix.setFontSizePoints(myTextLayer,Math.floor(72*(boxHeight/2)/app.activeDocument.resolution));//フォントサイズ設定ポイント
		myTextLayer.textItem.justification=Justification.CENTER;//フォント配置設定
		myTextLayer.textItem.color=myLineColor;//フォントカラー設定
		myTextLayer.textItem.position=[new UnitValue(myPoint[0],"px"),new UnitValue(myPoint[1]+myHeight/2,"px")];//フォント位置設定

//	カラーチップ作成
//	新しいレイヤを空で作成して、名前を割りつける

	var newColorChips=app.activeDocument.artLayers.add();
		newColorChips.name=boxName;

	for (var boxCount=0;boxCount<boxNum;boxCount++){

		var myPosition=sub(add(myPoint,[0,boxHeight*boxCount]),[myWidth/2,myHeight/2]);
		var myRegion=[
			myPosition,
			add(myPosition,[boxWidth,0]),
			add(myPosition,[boxWidth,boxHeight]),
			add(myPosition,[0,boxHeight])
		];


//			セレクトを作成
		app.activeDocument.selection.select(
			myRegion,
			SelectionType.REPLACE,
			0.0,
			false
		);
//塗色は、描画色から計算した仮色で作る。あとで置き替えが必要
		var centerNo	=Math.ceil(boxNum/2)-1;
		var colorParam	=Math.abs(centerNo-boxCount);
		if(boxCount==centerNo){
			myColor=centerColor;

		}else{
			if(boxCount<centerNo){
				myColor=add(centerColor,mul(sub([255,255,255],centerColor),colorParam/(centerNo+1)));
			}else{
				myColor=div(centerColor,Math.pow(1.2,colorParam));
			}
		};
//			fill
		var fillColor=new SolidColor();
//alert(myColor.toString());
//仮色なのでこれ以上はやらない。もしあるとしたらグレー化

if((boxCount!=centerNo)&&(colorReverse)){
			fillColor.rgb.red	=255-myColor[0];
			fillColor.rgb.green	=255-myColor[1];
			fillColor.rgb.blue	=255-myColor[2];
}else{

			fillColor.rgb.red	=myColor[0];
			fillColor.rgb.green	=myColor[1];
			fillColor.rgb.blue	=myColor[2];
}
		app.activeDocument.selection.fill(
			fillColor,
			ColorBlendMode.NORMAL,
			100,
			false
		);
//ノーマルマークをつける(仮でストロークしておく)
		if(boxCount==centerNo){
			var backupColor=app.foregroundColor;
		app.activeDocument.selection.stroke(
			myLineColor,
			0.03*myDPC,
			StrokeLocation.INSIDE,
			ColorBlendMode.NORMAL,
			100,
			false
		);
			app.foregroundColor=backupColor;//ストロークは前景色を書き換える
		}
	}
//	カラーチップとラベルをリンク
		myTextLayer.link(newColorChips);//リンク作成
		;//
//	selection解除
	app.activeDocument.selection.deselect();
//	できたレイヤは選択されていたレイヤの上に移動
		myTextLayer.move(targetLayer,ElementPlacement.PLACEBEFORE);
		newColorChips.move(myTextLayer,ElementPlacement.PLACEBEFORE);

};//


//drawColorBox("お試し",myPoint,boxWidth*myDPC,boxHeight*myDPC,boxNum);
/*
	GUI初期化
ボタン/2ヶ
テキスト/4ヶ

*/
//入力を数値に限定
clipNum=function(){
	if(isNaN(this.text)){this.text=this.baseValue.toString()}else{
		this.text=(this.text*1).toString();
	}
};
//入力を整数に限定
clipInt=function(){
	if(isNaN(this.text)){this.text=this.baseValue.toString()}else{
		this.text=Math.floor(this.text*1).toString();
	}
};
//	Window
var w=nas.GUI.newWindow("dialog","色指定チップを作る",3,6);
//	TEXT
 w.tx1	=nas.GUI.addEditText(w,"(名称未定)",0,0,3,1);

 w.lb1	=nas.GUI.addStaticText  (w ,"BOX" ,0 ,1 ,1.5 ,1).justify="right";
	w.tx2	=nas.GUI.addEditText(w,boxNum,1.5,1,1,1);
	w.lb1u	=nas.GUI.addStaticText  (w ,"個" ,2.5 ,1 ,0.5 ,1);
	w.tx2.baseValue=boxNum;w.tx2.onChange=clipInt;

 w.lb2	=nas.GUI.addStaticText  (w ,"width" ,0 ,2 ,1.5 ,1).justify="right";
	w.tx3	=nas.GUI.addEditText(w,boxWidth,1.5,2,1,1);
	w.lb2u	=nas.GUI.addStaticText  (w ,"cm" ,2.5 ,2 ,0.5 ,1);
	w.tx3.baseValue=boxWidth;w.tx3.onChange=clipNum;

 w.lb3	=nas.GUI.addStaticText  (w ,"height" ,0 ,3 ,1.5 ,1).justify="right";
	w.tx4	=nas.GUI.addEditText(w,boxHeight,1.5,3,1,1);
	w.lb3u	=nas.GUI.addStaticText  (w ,"cm" ,2.5 ,3 ,0.5 ,1);
	w.tx4.baseValue=boxHeight;w.tx4.onChange=clipNum;

 w.cb1 =nas.GUI.addCheckBox (w,"仮色反転",1,4,2,1);
	w.cb1.value=colorReverse;
	w.cb1.onClick=function(){
		colorReverse=this.value;
	}
 w.bt1	=nas.GUI.addButton(w,"OK",0,5,3,1);

w.bt1.onClick=function(){
//どうも実行前に数値の検証が必要

	drawColorBox(
		this.parent.tx1.text,
		myPoint,
		this.parent.tx3.text*myDPC,
		this.parent.tx4.text*myDPC,
		this.parent.tx2.text*1
	);
this.parent.close();
}
w.tx1.active=true;
w.show();
}

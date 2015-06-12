/*
		Photoshop　レイヤぱらぱら
	アクティブレイヤのあるレイヤコレクションをパラパラするよ
	簡易アニメチェックにどうぞ。色塗りのパカ探しとか。指パラみたいなもんです。
	時間制御するとどうも表示のリフレッシュが変？スイッチ制にすべきか？
	注意＊＊あまり長時間使うと画面リフレッシュが止まる。しょうがないけどね　05/08
	リフレッシュをアニメ機能にラップする
*/

	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　フリップアイテム数が1以下なら終了
		if(activeDocument.activeLayer.parent.layers.length<=1){exFlag=false;};
	}
	if(exFlag){
//オプションで背景レイヤをパラパラに雑ぜるか否かを調整
//最下層レイヤではなく、「背景レイヤ」限定? 考慮中

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

/*------	nas一般メソッド新しいやつ暫定試験	------*/
/*	nas.numInc([string 旧番号],step);
	戻り値:新番号
カット版番号を文字列で与えて最初に現れる数値部分を1増加させて後置部分を切り捨てて戻す。
数値を含まない文字列を与えるとそれを前置部分として"001"を付けて戻す。
引数無しの場合は開始番号の"001"を戻す。
*/
nas.numInc =function(oldNumber,myStep){

	var currentValue="001";
	if(! myStep){myStep=1;}else{myStep=myStep*1;};
	if(oldNumber){currentValue=oldNumber};

	if (currentValue.match(/^([^0-9]*)([0-9]+)(.*)/)){
		preFix=RegExp.$1;numValue=RegExp.$2;postFix=RegExp.$3;
	}else{
		preFix=currentValue;numValue="001";postFix="";
	}
//桁あわせの文字数取得
	var myOrder=numValue.length;
//ポストフィックスがある場合は、無条件で廃棄
//プレフィックスは無条件で保持
	return preFix+nas.Zf(numValue*1+myStep,myOrder);
}

//アニメウインドウ操作　現状取得ができないのはヘボいが今のトコはカンベン
/*
	復帰は不要でトレーラー内部の表示状態だけセットするスクリプトをまず作る
	フレームは初期化！
*/
setDly=function(myTime){
// =======================================================アニメーションウィンドウの最初のフレームの遅延を設定
var idsetd = charIDToTypeID( "setd" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
	
    var idT = charIDToTypeID( "T   " );
        var desc2 = new ActionDescriptor();
        var idanimationFrameDelay = stringIDToTypeID( "animationFrameDelay" );
        desc2.putDouble( idanimationFrameDelay, myTime );
    var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
    desc.putObject( idT, idanimationFrameClass, desc2 );
executeAction( idsetd, desc, DialogModes.NO );
}
duplicateFrame=function(){
// =======================================================フレーム複製
var idDplc = charIDToTypeID( "Dplc" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDplc, desc, DialogModes.NO );
}
selectFrame=function(idx){
// =======================================================フレーム選択(1/6)
var idslct = charIDToTypeID( "slct" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        ref.putIndex( idanimationFrameClass, idx );
    desc.putReference( idnull, ref );
var M=executeAction( idslct, desc, DialogModes.NO );
}
selectFramesAll=function(){
// =======================================================フレーム全選択
var idanimationSelectAll = stringIDToTypeID( "animationSelectAll" );
    var desc = new ActionDescriptor();
executeAction( idanimationSelectAll, desc, DialogModes.NO );
}
removeSelection=function(){
// =======================================================選択フレーム削除
var idDlt = charIDToTypeID( "Dlt " );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDlt, desc, DialogModes.NO );
}
//アニメーションフレームをアクティブにする（正逆順送り）セレクトとアクティブが別概念のようなので注意だ
activateFrame=function(kwd){
//kwd = Nxt ,Prevs,Frst(各４バイト)
var idanimationFrameActivate = stringIDToTypeID( "animationFrameActivate" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
		var idX = charIDToTypeID( kwd );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idX );
    desc.putReference( idnull, ref );
executeAction( idanimationFrameActivate, desc, DialogModes.NO );
}


var myEasyFlip=new Object();
//properties
	myEasyFlip.targetLayers=activeDocument.activeLayer.parent.layers;
	myEasyFlip.wait=3*1000/24;
	myEasyFlip.bgFix=false;
	myEasyFlip.onLoop=true;
	myEasyFlip.playStatus="stop";
	myEasyFlip.previewLayer=null;

	myEasyFlip.playList=new Array();
	myEasyFlip.backupView=new Array();

	myEasyFlip.tableInit=function(){
		//テーブルの初期化
		//プレイリスト取得背景レイヤをオプションに従って排除
		for(idx=0;idx<myEasyFlip.targetLayers.length;idx++){
			if((myEasyFlip.bgFix)&&(idx==myEasyFlip.targetLayers.length-1)){
				continue;
			}else{
				myEasyFlip.playList.push(idx);
			}
		}
		myEasyFlip.playList.active=myEasyFlip.playList.length-1;
		//表示バックアップを控える
		for(idx=0;idx<myEasyFlip.targetLayers.length;idx++){
			myEasyFlip.backupView.push(myEasyFlip.targetLayers[idx].visible);
		}
		myEasyFlip.backupView.active=activeDocument.activeLayer;
	}

	myEasyFlip.tableInit();

	myEasyFlip.viewRestore=function(){
		//アニメウインドウを初期化
//		selectFramesAll();//全選択
//		removeSelection();//削除
		//表示状態とアクティブレイヤを復帰
		for(idx=0;idx<this.backupView.length;idx++){
			this.targetLayers[idx].visible=this.backupView[idx];
		}
		activeDocument.activeLayer=myEasyFlip.backupView.active;//これは要らんかも
	}

	myEasyFlip.viewInit=function(){
		//表示初期化
		//アニメーションテーブル初期化
		//アニメウィンドウを初期化する＞要するに全て消す
		duplicateFrame();//一個複製して最低２個のフレームにする（エラー回避）
		selectFramesAll();//全選択
		removeSelection();//削除
//==============================================================
		for(idx=0;idx<this.backupView.length;idx++){
			if(!this.targetLayers[idx].visible){this.targetLayers[idx].visible=true}
		};//all visible
		for(idx=0;idx<this.playList.length;idx++){
			if(this.targetLayers[this.playList[idx]].visible){this.targetLayers[this.playList[idx]].visible=false}
		};//playList unvisible
		this.targetLayers[this.playList[this.playList.length-1]].visible=true;//第一フレーム表示
		//第二フレーム以降を表示を切り替えつつアニメフレームに登録
		for(var idx=this.playList.length-1;idx>0;idx--){
			duplicateFrame();//作る（フォーカス移動）
//			alert(this.playList[idx]);
			this.targetLayers[this.playList[idx]].visible=false;
			this.targetLayers[this.playList[idx-1]].visible=true;
		}
		//表示終了配置初期化
		activateFrame ("Frst");//最後に第一フレームにフォーカスしておく
//		myEasyFlip.playList[0].visible=true;//第一フレーム表示
		//setStart
		this.playStatus="stop";
		this.previewLayer=this.targetLayers[this.playList.active];
		activeDocument.activeLayer=myEasyFlip.previewLayer;
//		this.previewLayer.visible=true;//previewLayerはオブジェクト(アクセスターゲット)で
	}
　
	myEasyFlip.flip=function(WD){
		var myOffset=(WD=="BWD")?-1:1;
		if(myOffset==1){activateFrame("Nxt ")}else{activateFrame("Prvs")}
		if((w.namePad.text!=myEasyFlip.previewLayer.name)&&(w.namePad.text!="")){
			myEasyFlip.previewLayer.name=w.namePad.text;
		}
//		this.previewLayer.visible=false;
		if(this.onLoop){
			this.playList.active=(this.playList.active+this.playList.length-myOffset)%this.playList.length;//ループ
		}else{
			this.playList.active=(this.playList.active>0)?this.playList.active-myOffset:0;//stop
		}
		this.previewLayer=this.targetLayers[this.playList.active];
		this.previewLayer.active=true;
		activeDocument.activeLayer=this.previewLayer;
		w.nameView.text=this.previewLayer.name;
		w.namePad.text=this.previewLayer.name;

//		alert(w.namePad.textselection);
//		return "OK!";
	}

//初期化
myEasyFlip.viewInit();


if(false){
		var startCount=new Date().getTime();
		var breakRimit=startCount+10000;//10秒制限
		var nextCount=startCount+1000;//1秒試験
//alert("start"+startCount +" / "+nextCount)
		while(true){
			currentCount=new Date().getTime()
			if(currentCount<nextCount){
				continue;
			}else{
				if(nextCount<breakRimit){
			nextCount=nextCount+1000;
			myEasyFlip.flip("FWD");
				}else{
break;}
			}
		}
		nextCount;
	}

//	GUI初期化
w=nas.GUI.newWindow("dialog",localize(nas.uiMsg.layerRename),5,5);
w.onClose=function(){myEasyFlip.viewRestore();};
w.onOpen=true;

w.nameView=nas.GUI.addButton(w,myEasyFlip.previewLayer.name,1,0,4,1);
w.bt0=nas.GUI.addButton(w,"[ / ]",0,1,1,1);
w.bt1=nas.GUI.addButton(w,"[++]",0,2,1,1);
w.bt2=nas.GUI.addButton(w,"[--]",1,2,1,1);
w.namePad=nas.GUI.addEditText(w,myEasyFlip.previewLayer.name,1,1,4,1);

w.btL0=nas.GUI.addSelectButton(w,["BG","BOOK","LO","Frame","A","B","C","D","E","F","G","H","I","J","K","L"],3,0,3,1.5,1);
w.btL1=nas.GUI.addButton(w,"▲",1.5,3,1,1);
//w.btL2=nas.GUI.addButton(w,">>",2  ,3,0.7,1);


w.bt3=nas.GUI.addButton(w,"△goFWD△",2.5,2,2.5,1);
w.bt4=nas.GUI.addButton(w,"▼goBWD▼",2.5,3,2.5,1);
w.bt5=nas.GUI.addButton(w,"close",2.5,4,2.5,1);
w.bt6=nas.GUI.addButton(w,"label X",0,4,2.5,1);


w.nameView.onClick=function(){this.parent.namePad.text+=this.text;}

w.bt0.onClick=function(){this.parent.namePad.text+="/";}

w.bt1.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=nas.numInc(myNameSet[myNameSet.length-1]);
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.bt2.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=nas.numInc(myNameSet[myNameSet.length-1],-1);
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.btL1.onClick=function(){
	var myLabel=this.parent.btL0.value;
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=myNameSet[myNameSet.length-1].replace(/^([^0-9]*)/,myLabel);
		this.parent.namePad.text=myNameSet.join("/");
	}else{
		this.parent.namePad.text=myLabel
	}
}
w.btL0.onChange=w.btL1.onClick;
//w.btL2.onClick=function(){myShift(-1);}


//w.namePad.onChange=function(){myEasyFlip.flip("FWD");w.onOpen=false;this.active=true;};
w.bt3.onClick=function(){myEasyFlip.flip("FWD");w.onOpen=false;this.parent.namePad.active=true;};
w.bt4.onClick=function(){myEasyFlip.flip("BWD");w.onOpen=false;this.parent.namePad.active=true;};
w.bt5.onClick=function(){
//	myEasyFlip.viewRestore();
	this.parent.onOpen=false;
	this.parent.close();
};

w.bt6.onClick=function(){
//　対象トレーラのラベルを自動更新
	var myLabel=myEasyFlip.targetLayers[0].parent.name;
	var startNumber=1;
	var currentName=[myLabel,nas.Zf(startNumber,3)].join("-");
	for(var idx=myEasyFlip.playList.length-1;idx>=0;idx--){
		myEasyFlip.targetLayers[myEasyFlip.playList[idx]].name=currentName;
		currentName=nas.numInc(currentName);
	}
}
//============================================================== 
w.show();

//w.watch("onOpen",function(){alert(w.onOpen);w.unwatch("onOpen");});

//whle(true){}
	}else{
		alert(localize(nas.uiMsg.noTarget));//"なんだかパタパタするものが無いみたい"
	}
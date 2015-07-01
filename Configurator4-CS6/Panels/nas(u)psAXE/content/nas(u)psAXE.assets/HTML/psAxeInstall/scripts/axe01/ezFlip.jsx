/*
		Photoshop　レイヤぱらぱら
	アクティブレイヤのあるレイヤコレクションをパラパラするよ
	簡易アニメチェックにどうぞ。色塗りのパカ探しとか。指パラみたいなもんです。
	時間制御するとどうも表示のリフレッシュが変？スイッチ制にすべきか？
	注意＊＊あまり長時間使うと画面リフレッシュが止まる。しょうがないけどね　05/08
*/

	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　フリップアイテム数が1以下なら終了
		if(activeDocument.activeLayer.parent.layers.length<1){exFlag=false;};
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

//メソッド
		for(idx=0;idx<myEasyFlip.targetLayers.length;idx++){
			if((myEasyFlip.bgFix)&&(idx==myEasyFlip.targetLayers.length-1)){
				continue;
			}else{
				myEasyFlip.playList.push(idx);
			}
		}
		myEasyFlip.playList.active=myEasyFlip.playList.length-1;
//
		for(idx=0;idx<myEasyFlip.targetLayers.length;idx++){
			myEasyFlip.backupView.push(myEasyFlip.targetLayers[idx].visible);
		}
		myEasyFlip.backupView.active=activeDocument.activeLayer;
	}

	myEasyFlip.tableInit();

	myEasyFlip.viewRestore=function(){
		for(idx=0;idx<this.backupView.length;idx++){
			this.targetLayers[idx].visible=this.backupView[idx];
		}
		activeDocument.activeLayer=myEasyFlip.backupView.active;//これは要らんかも
	}

	myEasyFlip.viewInit=function(){
		for(idx=0;idx<this.backupView.length;idx++){
			if(!this.targetLayers[idx].visible){this.targetLayers[idx].visible=true}
		};//all visible
		for(idx=0;idx<this.playList.length;idx++){
			if(this.targetLayers[this.playList[idx]].visible){this.targetLayers[this.playList[idx]].visible=false}
		};//playList unvisible
		//setStart
		this.playStatus="stop";
		this.previewLayer=this.targetLayers[this.playList.active];
		activeDocument.activeLayer=myEasyFlip.previewLayer;
		this.previewLayer.visible=true;//previewLayerはオブジェクト(アクセスターゲット)で
	}

	myEasyFlip.flip=function(WD){
		var myOffset=(WD=="BWD")?-1:1;
		if((w.namePad.text!=myEasyFlip.previewLayer.name)&&(w.namePad.text!="")){
			myEasyFlip.previewLayer.name=w.namePad.text;
		}
		this.previewLayer.visible=false;

		if(this.onLoop){
			this.playList.active=(this.playList.active+this.playList.length-myOffset)%this.playList.length;//ループ
		}else{
			this.playList.active=(this.playList.active>0)?this.playList.active-myOffset:0;//stop
		}
	//	w.prevNameView.text=this.previewLayer.name;
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
w=nas.GUI.newWindow("dialog",nas.localize(nas.uiMsg.layerRename),5,7);
w.onClose=function(){myEasyFlip.viewRestore();};
w.onOpen=true;
w.countBuf=1;

w.nameView=nas.GUI.addButton(w,myEasyFlip.previewLayer.name,1,0,4,1);
w.bt0=nas.GUI.addButton(w,"[ / ]",0,1,1,1);
w.bt1=nas.GUI.addButton(w,"[++]",0,2,1,1);
w.bt2=nas.GUI.addButton(w,"[--]",1,2,1,1);

w.bt9=nas.GUI.addButton(w,"[±#]",2,2,1,1);
w.btA=nas.GUI.addButton(w,"[修]",3,2,1,1);
w.btB=nas.GUI.addButton(w,"[+]",4,2,1,1);

w.namePad=nas.GUI.addEditText(w,myEasyFlip.previewLayer.name,1,1,4,1);

w.btL0=nas.GUI.addSelectButton(w,["BG","BOOK","LO","frame","A","B","C","D","E","F","G","H","I","J","K","L"],3,0,3,1.5,1);
w.btL1=nas.GUI.addButton(w,"▲",1.5,3,1,1);
//w.btL2=nas.GUI.addButton(w,">>",2  ,3,0.7,1);


w.bt3=nas.GUI.addButton(w,"△goFWD△",2.5,3,2.5,1);
w.bt4=nas.GUI.addButton(w,"▼goBWD▼",2.5,4,2.5,1);
w.bt5=nas.GUI.addButton(w,"close",0,6,2.5,1);
w.bt6=nas.GUI.addButton(w,"auto-label",0,5,2.5,1);
w.bt7=nas.GUI.addButton(w,"apply",2.5,5,2.5,1);
w.bt8=nas.GUI.addButton(w,"OK",2.5,6,2.5,1);


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
w.bt9.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		if(myNameSet[myNameSet.length-1].match(/(.*[^0-9\s])\s?([0-9]+)$/)){myNameSet[myNameSet.length-1]=RegExp.$1;this.countBuf=RegExp.$2 *1;}else{myNameSet[myNameSet.length-1]+=this.countBuf;};
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.btA.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]+="修";
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.btB.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]+="+";
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
	myEasyFlip.viewRestore();
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
w.bt7.onClick=function(){
//その場でレイヤ名を変更（反映）させて移動は行わない
	if((this.parent.namePad.text!=myEasyFlip.previewLayer.name)&&(this.parent.namePad.text!="")){
		myEasyFlip.previewLayer.name=w.namePad.text;
	}
};
w.bt8.onClick=function(){
//最終変更を更新して終了
	if((this.parent.namePad.text!=myEasyFlip.previewLayer.name)&&(this.parent.namePad.text!="")){
		myEasyFlip.previewLayer.name=w.namePad.text;
	}
	myEasyFlip.viewRestore();
	this.parent.onOpen=false;
	this.parent.close();
};

//==============================================================
w.show();

//w.watch("onOpen",function(){alert(w.onOpen);w.unwatch("onOpen");});

//whle(true){}
	}else{
		alert(nas.localize(nas.uiMsg.noTarget));//"なんだかパタパタするものが無いみたい"
	}
/*
	アニメーションフレームに継続時間をセットする。
	最後に指定した継続時間は、ボタンに記録して１クリックでウィンドウのクローズまで行う
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
// in case we double clicked the file
	app.bringToFront();

	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　アイテム数が1以下なら終了 ko 
//		if(activeDocument.activeLayer.parent.layers.length<=1){exFlag=false;};
	}

	if(exFlag){
//最下層レイヤではなく、「背景レイヤ」限定? 考慮中

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
　config.js		一般設定ファイル（デフォルト値書込）このルーチン外では参照不能
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
var myValues=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
//=========================　ダイアログを作成
var myHeight=Math.ceil(myValues.length/6)+2.5;
w = nas.GUI.newWindow("dialog","Frame Duration -eXt",6,myHeight,320,360);
//プロパティ設定	
	w.setFrames ="0";
// 配列をボタンに展開
var myText="";

//buttonFunction
_aplDur=function(){
	var myFrames=nas.FCT2Frm(this.text);
	if(! isNaN(myFrames)){
		setDly(myFrames/nas.FRATE);
		this.parent.close();
	}
}

for (myLine=0;myLine<Math.floor(myValues.length/6);myLine++){
    for (myColumn =0;myColumn<6;myColumn++){
        w["bt"+myLine+myColumn]=nas.GUI.addButton(w,myValues[myColumn+myLine*6],myColumn*.95,myLine*.85,1.25,1);
        w["bt"+myLine+myColumn].onClick=_aplDur;
    }
}
if (false){
alert(myText);
w.bt11=nas.GUI.addButton(w,"0",0,0,1.25,1);
w.bt12=nas.GUI.addButton(w,"4",1,0,1.25,1);
w.bt13=nas.GUI.addButton(w,"8",2,0,1.25,1);
w.bt14=nas.GUI.addButton(w,"12",3,0,1.25,1);
w.bt15=nas.GUI.addButton(w,"18",4,0,1.25,1);
w.bt16=nas.GUI.addButton(w,"--",5,0,1,1);
}

/*
パネル上方にボタンを自動配置したので配列の数から垂直オフセットを出す
*/
var vOffset=Math.floor(myValues.length/6);
w.sl00=nas.GUI.addSlider(w,0,0,24,0,vOffset-1,6);
w.cb21=nas.GUI.addComboBox(w,["0+0","0+4","0+6","0+8","0+9","0+12","0+15","0+16","0+18"],w.setFrames,0,.5+vOffset,2,1);
w.lb22=nas.GUI.addStaticText(w,"frames",2,.7+vOffset,1,1);
w.cb23=nas.GUI.addComboBox(w,[15,24,23.98,25,30,29.97,59.94,60,100],nas.FRATE,3,.5+vOffset,2,1)
w.cb24=nas.GUI.addStaticText(w,"fps",5,.7+vOffset,1,1);
w.bt31=nas.GUI.addButton(w,"Cancel",0,1.7+vOffset,3,1);
w.bt32=nas.GUI.addButton(w,"O K",3,1.7+vOffset,3,1);
if (false){
w.bt11.onClick=_aplDur ;
w.bt12.onClick=_aplDur ;
w.bt13.onClick=_aplDur;w.bt14.onClick=_aplDur;w.bt15.onClick=_aplDur;w.bt16.onClick=_aplDur;
}
w.sl00.onChange=function(){w.cb21.set(nas.FCT2Frm(w.cb21.value)+this.value);}

Slider.on
w.cb21.onChange=function(){this.parent.setFrames=nas.FCT2Frm(this.value)}
w.cb23.onChange=function(){nas.FRATE=parseFloat (this.value);}
w.bt32.onClick=function(){
	if(! (isNaN(this.parent.setFrames))){
		setDly(this.parent.setFrames/nas.FRATE);
		this.parent.close();
	}
}
w.bt31.onClick=function(){this.parent.close();}
w.show();
//var myXps=new Xps();


}
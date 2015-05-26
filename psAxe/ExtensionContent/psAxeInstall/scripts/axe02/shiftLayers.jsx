//shiftLyers.jsx レイヤセットのメンバーを定数シフトする
/*
	スライダで数値指定を行って最短距離に変換、その後実際のレイヤをシフトする
	count数を設定してレイヤを移動するルーチン（試験）　あとでスライダをつけること
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
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	};
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

//=====================================================レイヤシフト関数ライブラリへ移行するほうがよいかも
function shiftLayers(shiftCount){
//shiftCountは整数　0は判定してリターン（移動がないので）
 if(!shiftCount){shiftCount=0;};
 if(shiftCount==0){return};
 var idx=0;
 var myDocLayers=app.activeDocument.activeLayer.parent;
 var mxId=myDocLayers.layers.length;
 //シフトカウントを最小移動へ変換
// alert(shiftCount);
 shiftCount=shiftCount%mxId;
if(Math.abs(shiftCount)>(mxId/2)){shiftCount=(shiftCount<0)?(mxId+shiftCount):-(mxId-shiftCount)};
// alert(shiftCount);
 while(myDocLayers.layers[idx]!=app.activeDocument.activeLayer){idx++};
 app.activeDocument.activeLayer=myDocLayers.layers[(idx+mxId-shiftCount)%mxId];
 if(shiftCount>0){
  while (shiftCount>0){ myDocLayers.layers[myDocLayers.layers.length-1].move(myDocLayers.layers[0],ElementPlacement.PLACEBEFORE);shiftCount--; }
 }else{
  while (shiftCount<0){myDocLayers.layers[0].moveToEnd(app.activeDocument.activeLayer.parent);shiftCount++; }
 }
//activate TopLayer
for(var idx=0;idx<myDocLayers.layers.length;idx++){if(myDocLayers.layers[idx].visible){app.activeDocument.activeLayer=myDocLayers.layers[idx];break;}};
}
//ラベル数値部カウント関数 補助部分は数えないよ　でも小数部は数えるかも？
function countLabelNum(myLabel){
	if (myLabel.match(/([0-9]+)/)){return RegExp.$1 *1;}else{return 0;}
}
//==================================================
if((app.documents.length)&&(app.version.split(".")[0]>9)){
var myDocLayers=app.activeDocument.activeLayer.parent;
var maxLayers=myDocLayers.layers.length;
//カレントオフセットを探る
var currentOffset=0;
var prV=countLabelNum(myDocLayers.layers[0].name);
var myNames=new Array();
for(var cIx=0;cIx<maxLayers;cIx++){myNames.push(myDocLayers.layers[cIx].name)};
for(var cIx=1;cIx<maxLayers;cIx++){
	var crV=countLabelNum(myDocLayers.layers[cIx].name);
	if((crV-prV)>=(maxLayers-1)){currentOffset=(cIx-1);break;}else{if(cIx==(maxLayers-1)){currentOffset=cIx;break;}else{prV=crV;continue;}}
}
var shiftCount=0;
//=====================================UI

var w=nas.GUI.newWindow("dialog","JUMP",6,3);
w.myLabel=nas.GUI.addComboBox(w,myNames,myNames[0],0,0,3,1);
w.cnBt=nas.GUI.addButton(w,"cancel",3,0,1.5,1);
w.okBt=nas.GUI.addButton(w,"G O !",4.5,0,1.5,1);
w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,1,6,2,true,"index",currentOffset+1,1,maxLayers);
//コンボボックスのセレクトは即移動・名前の入力は新規作成だけど今日は保留
w.myLabel.onChange=function(){
//	alert(this.selected)
	if(this.selected != null){
		shiftLayers (-this.selected);
//		if((maxLayers/2)>this.selected){shiftLayers (-this.selected)}else{shiftLayers (maxLayers-this.selected)}
		this.parent.close();
	}else{
		alert("ここで新規名称のレイヤを作成する予定だけど、あとで書きます。今日はナシ　2011.05.23");
	}
}
w.mySlider.onChange=function(){
		this.set(Math.round(this.value),0,true);
		//alert((maxLayers-Math.round(this.value)+currentOffset)%maxLayers);
		this.parent.myLabel.select((maxLayers-this.value+currentOffset+1)%maxLayers);
}
w.okBt.onClick=function(){shiftLayers (-this.parent.myLabel.selected);this.parent.close();}
w.cnBt.onClick=function(){this.parent.close();}
w.show();
//=================================
}else{
if(app.version.split(".")[0]<=9){alert("すみません CS2では機能しません")}
}

//xLink (同期レイヤ送り)には未対応なので注意　2011 05.31
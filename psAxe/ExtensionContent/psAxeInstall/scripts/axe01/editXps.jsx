/*
	アクティブドキュメントに対応するXPSファイルを探して編集する
*/

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
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
includeLibs.push(nasLibFolderPath+"newXps.jsx");

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

if(true){
//動作抑制オブジェクト
	var XPS=new Xps();
//	nas.XPSStore=new XpsStore();
}
if((app.documents.length)){
//
var myTarget=app.activeDocument;
if(myTarget.name.match(/.*\.psd$/i)){
	var myXpsFile=new File([myTarget.fullName.path,myTarget.fullName.name.replace(/\.psd/,".xps")].join("/"));

if(myXpsFile.exists){
	//ファイルが存在するので編集ソフトに渡して終了
		var myOpenfile = new File(myXpsFile.fsName);
		myOpenfile.execute();
}else{
	//ターゲットのXPSが存在しないので、
	//現状のドキュメントに従う（と思われる）XPSをカラで生成して保存する
	//可能ならその場で編集ユニットをコースする
	var myDuration=nas.FRATE*3;//frames初期値３秒
	var myFps=nas.FRATE;
//	(Framesフォルダをシートに入れるか否かを参照すること)
	var myTimelineCount=((true)&&(myTarget.layers[0].name=="Frames")&&(myTarget.layers[0].typename == "LayerSet"))?
		myTarget.layers.length-1:myTarget.layers.length;
	XPS.init(myTimelineCount,myDuration);
	XPS.mapFile="./"+myTarget.fullName.name;
	XPS.title=nas.workTitles.select()[0];
	XPS.create_user=nas.CURRENTUSER;
	XPS.update_user=nas.CURRENTUSER;
	XPS.framerate=myFps;
	XPS.cut=myTarget.name.replace(/\.psd/i,"");
	var mx=myTimelineCount;
	for(var lix=0;lix<mx;lix++){
		var psLayerId=(myTarget.layers.length!=mx)? mx-lix:mx-lix-1;
		XPS.layers[lix].name=(myTarget.layers[psLayerId].name.replace(/\s/g,""));//name設定時にencoding設定してレイヤ名から空白をエスケープすること
		XPS.layers[lix].sizeX=myTarget.layers[psLayerId].bounds[2].as("px")-myTarget.layers[psLayerId].bounds[0].as("px");
		XPS.layers[lix].sizeY=myTarget.layers[psLayerId].bounds[3].as("px")-myTarget.layers[psLayerId].bounds[1].as("px");
//lot が取得可能なのはレイヤセット（layersプロパテイがある）のみそれ以外は１で固定
		XPS.layers[lix].lot=(myTarget.layers[psLayerId].layers)?myTarget.layers[psLayerId].layers.length:1;
	}
	if(confirm("タイムシートがありません。新規に作成して編集しますか？")){
	var fileSaveResult=editXpsProp(XPS);
//	alert(fileSaveResult);
		if((fileSaveResult)&&(myXpsFile.exists)){myXpsFile.execute()};
if(false){
//保存して　ドキュメントを呼び出す
		myXpsFile.encoding="utf8";
		myXpsFile.open("w");
		myXpsFile.write(XPS.toString());
		myXpsFile.close();

		myXpsFile.execute();
}
	}
}
}else{
	alert("ファイルがpsdとして保存されていない場合は、シートを作成できません");
}

}
//alert(XPS.toString())
/*(goNext)
	アニメフレームを次へ進める
	オプションでフォーカスも移動
タイムラインモード対応　移動をヒストリに置かない仕様に変更 2015.05
 */
//Photoshop用ライブラリ読み込み CS6以降　小型版
if(app.nas){
	nas=app.nas;bootFlag=false;
}else{
var includeLibs=[];//読み込みライブラリを格納する配列
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
var nasLibFolderPath =  nas.baseLocation+"/lib/";
includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
];

for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	//$.evalFile ファンクションで実行する
		$.evalFile(myScriptFileName);
}
//=====================================保存してあるカスタマイズ情報を取得
nas.readPrefarence("nas.axe");
nas.readPrefarence("nas.FRATE");
//=====================================startup
//=====================================　Application Objectに参照をつける
	app.nas=nas;
	bootFlag=true;
 }
//+++++++++++++++++++++++++++++++++ここまで共用
var myExcute="";
//=============== コード
if(app.nas.axeVTC.getDuration()){
	myExcute+='nas.axeVTC.goFrame("n");';	
}else{
	myExcute+='nas.axeAFC.goFrame("n");';
}
eval(myExcute)

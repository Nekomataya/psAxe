/*
追加ライブラリのロード
startupロードのオブジェクトは消失するので
nasオブジェクト配下以外のものは必要に従って以下のルーチンで読み込む
*/
var includeLibs=[];//読み込みライブラリを格納する配列
var nasLibFolderPath =  Folder.userData.fullName+"/nas/lib/";
/*	ライブラリ読み込み
ここで必要なライブラリをリストに加えてから読み込みを行う
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
*/
    includeLibs.push(nasLibFolderPath+"config.js");
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
	//$.evalFile ファンクションで実行する
		$.evalFile(myScriptFileName);
}
//+++++++++++++++++++++++++++++++++追加ロード終了
/*	暫定ローダー
これが必要なのはCSX(CS6)Photoshopのみ
	ライブラリの整理後は調整必要	2015 06-12
*/
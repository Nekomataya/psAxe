/*goTC.jsx
 TC指定で再生ヘッドを移動
 暫定版　nasFCTに変更予定
*/
//Photoshop用ライブラリ読み込み
if(typeof app.nas =="undefined"){
   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");
   $.evalFile(myLibLoader);
}else{
   nas=app.nas;
}
//+++++++++++++++++++++++++++++++++ここまで共用
nas.axeCMC.execWithReference("timelineGoToTime");

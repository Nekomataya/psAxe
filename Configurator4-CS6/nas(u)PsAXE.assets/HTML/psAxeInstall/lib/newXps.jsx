/*
	新規Xps保存のための関数
	関数の動作に必要なメディアライブラリは nas_psAxeLib.js に移動済み
*/

//==================================================================main

//=========================以上は動作確認用のライブラリローディング
function editXpsProp(myXps){
	var myStatus=false;
/*(プロパティ編集)
	Xps.editProp
	タイムシートプロパティダイアログを表示して編集を促す
	戻り値はプロパティ調整されたXps
*/
	var myTarget=app.activeDocument;
	if(!(myTarget.name.match(/\.psd$/i))){return false}
	var w=nas.GUI.newWindow("dialog","新規タイムシート",8,17);
	w.Xps=new Xps();
	w.Xps.readIN(myXps.toString());
//
	w.lb=nas.GUI.addStaticText(w,"新規タイムシートを作成します",0,0,8,1);
// hederTools
/*
	w.tbt1=nas.GUI.addButton(w,"保存して閉じる",0,1,2,1);
	w.tbt2=nas.GUI.addButton(w,"更新",2,1,2,1);
	w.tbt3=nas.GUI.addButton(w,"リセット",4,1,2,1);
	w.tbt4=nas.GUI.addButton(w,"閉じる",6,1,2,1);
*/
// MapData
	w.mpLb=nas.GUI.addStaticText(w,"MapData",0,2,2,1);
	w.mpEt=nas.GUI.addEditText(w,myXps.mapFile,2,2,6,1);
	w.mpEt.enabled=false;
// title	
	w.OTLb=nas.GUI.addStaticText(w,"Title",0,3,2,1);
	w.tlEt=nas.GUI.addComboBox(w,nas.workTitles.names(0),nas.workTitles.selected,2,3,6,1);
	w.tlEt.set(myXps.title);
// subtitle
	w.stLb=nas.GUI.addStaticText(w,"sub-Title",0,4,2,1);
	w.stEt=nas.GUI.addComboBox(w,["sub-TITLE","(未定)","---"],0,2,4,6,1);
	w.stEt.set(myXps.subtitle);
// Opus	
	w.opLb=nas.GUI.addStaticText(w,"OPUS",0,5,2,1);
	w.opEt=nas.GUI.addEditText(w,myXps.opus,2,5,2,1);
// scenr/cut
	w.scLb=nas.GUI.addStaticText(w,"S-C",0,6,2,1);
	w.scEt=nas.GUI.addEditText(w,myXps.scene,2,6,3,1);
	w.cnEt=nas.GUI.addEditText(w,myXps.cut,5,6,3,1);
// layers
	w.lyLb=nas.GUI.addStaticText(w,"sheet Layers",0,7,2,1);
	w.lyLot=nas.GUI.addEditText(w,myXps.layers.length,2,7,1,1);
	var myNames=new Array;
	for (id=0;id<myXps.layers.length;id++){myNames.push(myXps.layers[id]["name"])}
	w.lyLbls=nas.GUI.addEditText(w,myNames.join(","),3,7,5,1);
	
	w.lyLot.onChanging=function(){
	
		var myCount=parseInt(this.text);
		if(myCount<=0){myCount=1}
		this.text=myCount;
		if(myCount>=26){
		
			if(! confirm("止めないけど…そんなにレイヤが多いとツライよ\nレイヤ名を自動でつけるのは「Z」までなので\nその先は自分でつけてね。")){return;}
		}
		var myLabels=new Array();
		var oldLabels=this.parent.lyLbls.text.split(",");
		for(var i=0;i<myCount;i++){
			if(i<oldLabels.length){
				myLabels.push(oldLabels[i]);
			}else{
				myLabels.push((i<26)?"ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(i):i.toString())
			}
		}
		this.parent.lyLbls.text=myLabels.join(",");
	}
	w.lyLbls.onChanging=function(){
		var myLabels=this.text.split(",");
		this.parent.lyLot.text=myLabels.length;
	}
// time framerate trin trout
	w.tmLb=nas.GUI.addStaticText(w,"time/framrate",0,8,2,1);

	w.tlEt=nas.GUI.addEditText(w,nas.Frm2FCT(myXps.time(),3),2,8,2,1);
	w.frEt=nas.GUI.addEditText(w,myXps.framerate,4,8,1,1);
	w.frDl=nas.GUI.addDropDownList(w,["=CUSTOM=","FILM","NTSC","NTSC-DF","PAL","WEB"],1,5,8,3,1);
	w.frDl.values=["custom","24","30","29.97","25","15"];//ラベル対照配列
	
	w.tlEt.onChanging=function(){if(isNaN(nas.FCT2Frm(this.text))){this.text=nas.Frm2FCT(myXps.time(),3)}}

//配列にasearchメソッドを付加 Array.aserch(セクション,キー) result;index or -1 (not found)

w.frDl.values.asearch =function(name){
	for (var n=0;n<this.length;n++){if(this[n]==name){return n}};
	return -1;
}

	w.frEt.onChanging=function(){
		var ix=this.parent.frDl.values.asearch(this.text);
		if(ix<=0){this.parent.frDl.items[0].selected=true;}else{this.parent.frDl.items[ix].selected=true;}
	}
	w.frDl.onChange=function(){if(this.selection.index>0){this.parent.frEt.text=this.values[this.selection.index]}}
//	w.frDl.set(myXps.rate)
// trin/trout
	w.tiLb=nas.GUI.addStaticText(w,"trin",2,9,3,1);
	w.toLb=nas.GUI.addStaticText(w,"trout",5,9,3,1);

	w.trLb=nas.GUI.addEditText(w,myXps.trin[1],2,10,1.5,1);
	w.trEt=nas.GUI.addEditText(w,nas.Frm2FCT(myXps.trin[0],3),3.5,10,1.5,1);

	w.toLb=nas.GUI.addEditText(w,myXps.trout[1],5,10,1.5,1);
	w.toEt=nas.GUI.addEditText(w,nas.Frm2FCT(myXps.trout[0],3),6.5,10,1.5,1);

	w.trEt.onChanging=function(){if(isNaN(nas.FCT2Frm(this.text))){this.text=nas.Frm2FCT(myXps.trin[0],3)}};
	w.toEt.onChanging=function(){if(isNaN(nas.FCT2Frm(this.text))){this.text=nas.Frm2FCT(myXps.trout[0],3)}};
// acount/user
	w.cuLb=nas.GUI.addStaticText(w,"createUser",0,11,2,1);
	w.cutmEt=nas.GUI.addStaticText(w,myXps.create_time,2,11,2.5,1);
	w.cunmEt=nas.GUI.addEditText(w,myXps.create_user,4.5,11,3.5,1);
// acount/user
	w.uuLb=nas.GUI.addStaticText(w,"updateUser",0,12,2,1);
	w.uutmEt=nas.GUI.addStaticText(w,myXps.update_time,2,12,2.5,1);
	w.uunmEt=nas.GUI.addStaticText(w,myXps.update_user,4.5,12,3.5,1);
// memo
	w.mmLb=nas.GUI.addStaticText(w,"MEMO.",0,13,2,1);
	w.mmEt=nas.GUI.addEditText(w,myXps.memo,2,13,6,2.5);

//OK/キャンセル
w.okbt=nas.GUI.addButton(w,"OK",2,16,3,1);
w.okbt.onClick=function(){if(checkProp()){myStatus=true;this.parent.close();}else{return false}}
w.cnbt=nas.GUI.addButton(w,"Cancel",5,16,3,1);
w.cnbt.onClick=function(){myStatus=false;this.parent.close();}
//コントロールを検査してターゲットのプロパティを更新する
checkProp=function(){
//	現在の時間からカット継続時間を一時的に生成
//	framerate?
	var duration=(
nas.FCT2Frm(w.trEt.text)+
nas.FCT2Frm(w.toEt.text))/2+
nas.FCT2Frm(w.tlEt.text);
	var oldduration=myXps.duration();
	var durationChange=(duration != oldduration)? true : false ;
//	レイヤ数の変更を一時変数に取得
	var newWidth=(w.lyLot.text*1)+2;//新幅
	var oldWidth=myXps.xpsBody.length;//もとの長さを控える
	var widthChange =(newWidth != oldWidth)?true:false;
	if((durationChange)||(widthChange)){
		myXps.init(w.lyLot.text*1,duration)
	}
//	新規作成なので細かいチェックは不要
//	実際のデータ更新
//値の変換不要なパラメータをまとめて更新
// MapData	変更禁止
//	w.mpEt.text
// title	ユーザの指定データに変更
	myXps.title	=w.tlEt.value;
// subtitle
	myXps.subtitle	=w.stEt.value;
// Opus	
	myXps.opus	=w.opLb.text;
// scenr/cut
	myXps.scene	=w.scEt.text;
	myXps.cut	=w.cnEt.text;
//　タイムスタンプは編集不能にしておく　このスクリプトは新規作成なのでcreateUserのみ編集可能
// acount/CreateUser
	myXps.create_time=new Date().toNASString();
	myXps.create_user	=w.cunmEt.text;
// acount/UpdateUser
	myXps.update_time=new Date().toNASString();
	myXps.update_user=w.uunmEt.text;
// memo
	myXps.memo	=w.mmEt.text;

//trin trout
	myXps.trin	=[nas.FCT2Frm(w.trEt.text),w.trLb.text];
	myXps.trout	=[nas.FCT2Frm(w.toEt.text),w.toLb.text];
//レイヤ名転記
	var myLyNames=w.lyLbls.text.split(",");
	var mx=myTarget.layers.length;
	for(var lix=0;lix<myLyNames.length;lix++){
		myXps.layers[lix].name=myLyNames[lix];
		if(lix<mx){
			myXps.layers[lix].sizeX=myTarget.layers[mx-lix-1].bounds[2].as("px")-myTarget.layers[mx-lix-1].bounds[0].as("px");
			myXps.layers[lix].sizeY=myTarget.layers[mx-lix-1].bounds[3].as("px")-myTarget.layers[mx-lix-1].bounds[1].as("px");
			myXps.layers[lix].lot=(myTarget.layers[mx-lix-1].layers)?myTarget.layers[mx-lix-1].layers.length:1;
		}
	}
// 実際に保存する
/* これはファイルダイアログをだして確認
	ドキュメントと別の配置に保存も可能だが
	その場合はリレーションが切れることを警告すること
*/
var myXpsFile=new File([myTarget.fullName.path,myTarget.fullName.name.replace(/\.psd/,".xps")].join("/"));
var isWindows=($.os.indexOf("Win")==-1)? false:true;
if(isWindows)
{
	var mySavefile = myXpsFile.saveDlg("ファイルの保存場所を変更するとデータの適用ができないことがあります","nasXPSheet(*.xps):*.XPS");
}else{
	var mySavefile = myXpsFile.saveDlg("ファイルの保存場所を変更するとデータの適用ができないことがあります","");
}
if(! mySavefile){return false};//キャンセル
if(mySavefile.exists)
{
if(! confirm("同名のファイルがすでにあります.\n上書きしてよろしいですか?")){return false;};
}
//alert(myXps.toString());
if (mySavefile && mySavefile.name.match(/^[a-z_\-\#0-9]+\.xps$/i)){
var myOpenfile = new File(mySavefile.fsName);
	myOpenfile.encoding="utf8";
	myOpenfile.open("w");
	myOpenfile.write(myXps.toString());
//	myOpenfile.write(nas.easyXPS.sheetView.text);
	myOpenfile.close();
	myStatus=true;
}
	return true;
}
//終了時に引数返す
//w.onClose=function(){myStatus=false;}
w.show();
//var myXps=new Xps();
return myStatus;
}
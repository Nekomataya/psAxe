/*
PacPs
インタフェースをPac風にしちゃうよ
レイヤリネーム

処理対象はezFlipと同じ、
選択ダイアログでターゲットトレーラー外まで拡張するかどうかは一考
選択解除もするかどうか一考

連番＋手編集を可能にする

だいたいできてきた
全部チャラにして最初の状態に戻れるようにバックアップを取得しておく
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
	app.bringToFront();

	var exFlag=true;
//そもそもドキュメントがなければ終了
	if(app.documents.length==0){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　フリップアイテム数が1以下なら終了
		if(activeDocument.activeLayer.parent.layers.length<=1){exFlag=false;};
	}
//nasライブラリを確認 オブジェククトがなければ処理中断
	if(app.nas){nas=app.nas;}else{exFlag=false;};

	if(exFlag){
//オプションで背景レイヤをパラパラに雑ぜるか否かを調整
//最下層レイヤではなく、「背景レイヤ」限定? 考慮中

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
//		if((w.namePad.text!=myEasyFlip.previewLayer.name)&&(w.namePad.text!="")){myEasyFlip.previewLayer.name=w.namePad.text;}
		this.previewLayer.visible=false;

		if(this.onLoop){
			this.playList.active=(this.playList.active+this.playList.length-myOffset)%this.playList.length;//ループ
		}else{
			this.playList.active=(this.playList.active>0)?this.playList.active-myOffset:0;//stop
		}
		this.previewLayer=this.targetLayers[this.playList.active];
		this.previewLayer.active=true;
		activeDocument.activeLayer=this.previewLayer;
//		w.nameView.text=this.previewLayer.name;
//		w.namePad.text=this.previewLayer.name;

//		alert(w.namePad.textselection);
//		return "OK!";
	}

//初期化
myEasyFlip.viewInit();
//初期状態の取得
var targetNamesBackup=new Array();
for (var nml =0;nml< app.activeDocument.activeLayer.parent.layers.length;nml++){targetNamesBackup.push(app.activeDocument.activeLayer.parent.layers[nml].name)}

var targetNames=new Array();
	targetNames.flip=false;
for (var nml =0;nml< app.activeDocument.activeLayer.parent.layers.length;nml++){targetNames.push(app.activeDocument.activeLayer.parent.layers[nml].name)}
var destNames=new Array();
intDestName=function(){
destNames=new Array();
for (var nml =0;nml< app.activeDocument.activeLayer.parent.layers.length;nml++){destNames.push(app.activeDocument.activeLayer.parent.layers[nml].name)}
}
intDestName();

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
w=nas.GUI.newWindow("dialog","レイヤリネーム",5,18);
w.onClose=function(){myEasyFlip.viewRestore();};
w.onOpen=true;

nas.GUI.setTabPanel(w,["追加","置換","連番"],0,0,5,5);
//tabPanel[0]	文字列追加インターフェース
w.tabPanel[0].prpf1=nas.GUI.addRadioButton(w.tabPanel[0],"prefix",0,1,1.5,1);
w.tabPanel[0].prpf2=nas.GUI.addRadioButton(w.tabPanel[0],"postfix",0,2,1.5,1);
w.tabPanel[0].prpf1.value=true;
w.tabPanel[0].newStr=nas.GUI.addEditText(w.tabPanel[0],"",1.5,1.5,2,1);
w.tabPanel[0].t0btOk=nas.GUI.addButton(w.tabPanel[0],"apply",3.5,1,1.5,1);
w.tabPanel[0].t0btCl=nas.GUI.addButton(w.tabPanel[0],"clear",3.5,2,1.5,1);
//tabPanel[1]	文字列置換インターフェース
w.tabPanel[1].osl=nas.GUI.addStaticText(w.tabPanel[1],"old",0,0,1.5,1);
w.tabPanel[1].nsl=nas.GUI.addStaticText(w.tabPanel[1],"new",2,0,1.5,1);
w.tabPanel[1].oldStr=nas.GUI.addEditText(w.tabPanel[1],"",0,1.5,2,1);
w.tabPanel[1].newStr=nas.GUI.addEditText(w.tabPanel[1],"",2,1.5,2,1);
w.tabPanel[1].t1btOk=nas.GUI.addButton(w.tabPanel[1],"apply",3.5,3,1.5,1);
w.tabPanel[1].t1btCl=nas.GUI.addButton(w.tabPanel[1],"clear",2,3,1.5,1);
//tabPanel[2]	連番インターフェース
w.tabPanel[2].pfl=nas.GUI.addStaticText(w.tabPanel[2],"label",0,0,1.5,1);
w.tabPanel[2].stnl=nas.GUI.addStaticText(w.tabPanel[2],"start No",2,0,1.5,1);
w.tabPanel[2].stpl=nas.GUI.addStaticText(w.tabPanel[2],"step",2,0,1.5,1);
w.tabPanel[2].prefix=nas.GUI.addEditText(w.tabPanel[2],app.activeDocument.activeLayer.parent.name,0,1.5,2.3,1);
w.tabPanel[2].sep=nas.GUI.addEditText(w.tabPanel[2],"-", 2.1,1.5,0.7,1);
w.tabPanel[2].startNo=nas.GUI.addComboBox(w.tabPanel[2],["0001","001","01","1","0000","000","00","0"],2,2.5,1.5,1.5,1);
w.tabPanel[2].incrStep=nas.GUI.addEditText(w.tabPanel[2],"1",4,1.5,1,1);
w.tabPanel[2].t2btOk=nas.GUI.addButton(w.tabPanel[2],"apply",3.5,3,1.5,1);
w.tabPanel[2].t2btCl=nas.GUI.addButton(w.tabPanel[2],"clear",2,3,1.5,1);


w.bt3=nas.GUI.addButton(w,"△goFWD△",0,16,2.5,1);
w.bt4=nas.GUI.addButton(w,"▼goBWD▼",2.5,16,2.5,1);

w.btRest=nas.GUI.addButton(w,"Reset",0,17,2.5,1);
w.btClose=nas.GUI.addButton(w,"Close",2.5,17,2.5,1);

//============================ common
_applyChange=function(){
	var mx=app.activeDocument.activeLayer.parent.layers.length;
	for(var ix=0;ix<mx;ix++){
		var newName=(targetNames.flip)?destNames[mx-ix-1]:destNames[ix]
		app.activeDocument.activeLayer.parent.layers[ix].name=newName;
		targetNames[ix]=newName;
	}
		targetNames.flip=false;
		intDestName ();
		this.parent.parent.nameDisplay.text=buildDisplay();
	
}
_clearPreview=function(){
	intDestName();
	this.parent.parent.nameDisplay.text=buildDisplay();
}

_applyBackup=function(){
	var mx=app.activeDocument.activeLayer.parent.layers.length;
	for(var ix=0;ix<mx;ix++){
		app.activeDocument.activeLayer.parent.layers[ix].name=targetNamesBackup[ix];
		targetNames[ix]=targetNamesBackup[ix];
	}
		targetNames.flip=false;
		intDestName ();
		this.parent.nameDisplay.text=buildDisplay();
}
w.bt3.onClick=function(){myEasyFlip.flip("FWD");w.onOpen=false;};
w.bt4.onClick=function(){myEasyFlip.flip("BWD");w.onOpen=false;};

w.btRest.onClick=_applyBackup;
w.btClose.onClick=function(){this.parent.close()};
//============================ panel 0
_chgPfpr=function(){
	if(this.parent.newStr.text.length){
		var myPrpf=this.parent.prpf1.value;
		for (var ix=0; ix<destNames.length;ix++){
			if(myPrpf){
				destNames[ix]=this.parent.newStr.text+targetNames[ix];
			}else{
				destNames[ix]=targetNames[ix]+this.parent.newStr.text;
			}
		}
	}
	this.parent.parent.nameDisplay.text=buildDisplay();
}
w.tabPanel[0].prpf1.onClick=_chgPfpr;
w.tabPanel[0].prpf2.onClick=_chgPfpr;
w.tabPanel[0].newStr.onChanging=_chgPfpr;
w.tabPanel[0].t0btOk.onClick=_applyChange;
w.tabPanel[0].t0btCl.onClick=_clearPreview;

//============================ panel 1
_chgStr=function(){
	if(this.parent.oldStr.text.length){
		var oldReg=new RegExp(this.parent.oldStr.text,"g");
		var newSTR=this.parent.newStr.text;
		for (var ix=0; ix<destNames.length;ix++){
				destNames[ix]=targetNames[ix].replace(oldReg,newSTR);
		}
	}
	this.parent.parent.nameDisplay.text=buildDisplay();
}
w.tabPanel[1].oldStr.onChanging=_chgStr;
w.tabPanel[1].newStr.onChanging=_chgStr;
w.tabPanel[1].t1btOk.onClick=_applyChange;
w.tabPanel[1].t1btCl.onClick=_clearPreview;

//============================ panel 2
_mkSeq=function(){
	if(true){
		var startNum=this.parent.startNo.value;
		var sepStr=this.parent.sep.text;
		var myPrefix=this.parent.prefix.text;
		var myStep=parseInt(this.parent.incrStep.text);
		var mIx=destNames.length-1;
			destNames[mIx]=myPrefix+sepStr+startNum;
			if(destNames.length>1){
		for (var ix=mIx-1; ix>=0;ix--){
			destNames[ix]=nas.incrStr(destNames[ix+1],myStep);
		}
			}
	}
	this.parent.parent.nameDisplay.text=buildDisplay();
}
w.tabPanel[2].prefix.onChanging=_mkSeq;
w.tabPanel[2].sep.onChanging=_mkSeq;
w.tabPanel[2].startNo.onChange=_mkSeq;
w.tabPanel[2].incrStep.onChanging=_mkSeq;
w.tabPanel[2].t2btOk.onClick=_applyChange;
w.tabPanel[2].t2btCl.onClick=_clearPreview;


if(false){

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
w.bt5=nas.GUI.addButton(w,"close",0,4,2.5,1);


//====================
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
	myEasyFlip.viewRestore();
	this.parent.onOpen=false;
	this.parent.close();
};

}

function pickupDest(){
	var myLines=w.nameDisplay.text.split("\n");
	
	for(var ix=0;ix<myLines.length;ix++){
		destNames[ix]=myLines[ix].split("\t: ")[1];
	}
	return buildDisplay();
}

function buildDisplay(){
	var myResult=new Array();
	for(var ix=0;ix<targetNames.length;ix++){
		myResult.push(" "+targetNames[ix]+"\t: "+destNames[ix]);
	}
	return myResult.join(nas.GUI.LineFeed);
}
w.dpCbt=nas.GUI.addButton(w,"Current\t▲",0,5,2.5,1);
w.dpNbt=nas.GUI.addButton(w,"New\t▲",2.5,5,2.5,1);

w.nameDisplay=nas.GUI.addEditText(w,buildDisplay(),0,6,5,10);
//w.dpN=nas.GUI.addEditText(w,destNames.join("\n"),3,6,3,4);

w.nameDisplay.onChange=function(){
	this.parent.nameDisplay.text=pickupDest();
	}
w.dpCbt.onClick=function(){
	targetNames=targetNames.reverse();
	targetNames.flip=(targetNames.flip)?false:true;
	this.parent.nameDisplay.text=buildDisplay();
}
w.dpNbt.onClick=function(){
	destNames=destNames.reverse()
	this.parent.nameDisplay.text=buildDisplay();
}


//==============================================================
w.selectTab(2);//連番をセレクト
w.tabPanel[2].prefix.onChanging();//一回だけ連番を生成
w.show();

//w.watch("onOpen",function(){alert(w.onOpen);w.unwatch("onOpen");});

//whle(true){}
	}else{alert("リネームするレイヤが無いか、ライブラリが見当たりません様でス");}
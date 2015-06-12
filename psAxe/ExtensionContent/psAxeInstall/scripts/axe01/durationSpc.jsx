/*
	アニメーションフレームに継続時間をセットする。
	最後に指定した継続時間は、ボタンに記録して１クリックでウィンドウのクローズまで行う
*/
	var exFlag=true;

	nas=app.nas;
	var animationMode=nas.axeCMC.getAnimationMode();

//ドキュメントがない・アニメーションモードが初期化されていない場合は終了
	if((app.documents.length==0)||(animationMode.indexOf("NI")>=0)){
		exFlag=false;
	}else{
//起動時にレイヤコレクションの状態を確認　アイテム数が1以下なら終了 ko 
//		if(activeDocument.activeLayer.parent.layers.length<=1){exFlag=false;};
	}

	if(exFlag){
//最下層レイヤではなく、「背景レイヤ」限定? 考慮中


//==================================================================main
var myValues=(animationMode=="timelineAnimation")?
	[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]:
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
//=========================　ダイアログを作成
var myHeight=Math.ceil(myValues.length/6)+2.5;
w = nas.GUI.newWindow("dialog","set frame duration",6,myHeight,320,360);
//プロパティ設定	
	w.setFrames ="0";
// 配列をボタンに展開
var myText="";

//buttonFunction
_aplDur=function(){
	var myFrames=nas.FCT2Frm(this.text);
	if(! isNaN(myFrames)){
	   if(animationMode=="timelineAnimation"){nas.axeVTC.setDuration(myFrames);}else{nas.axeAFC.setDly(myFrames/nas.FRATE)};
		this.parent.close();
	}
}

for (myLine=0;myLine<Math.floor(myValues.length/6);myLine++){
    for (myColumn =0;myColumn<6;myColumn++){
        w["bt"+myLine+myColumn]=nas.GUI.addButton(w,myValues[myColumn+myLine*6],myColumn*.95,myLine*.85,1.25,1);
        w["bt"+myLine+myColumn].onClick=_aplDur;
    }
}

/*
パネル上方にボタンを自動配置したので配列の数から垂直オフセットを出す
*/
var vOffset=Math.floor(myValues.length/6);
if(animationMode=="timelineAnimation"){
w.sl00=nas.GUI.addSlider(w,1,1,24,0,vOffset-1,6);
}else{
w.sl00=nas.GUI.addSlider(w,0,0,24,0,vOffset-1,6);
}

w.cb21=nas.GUI.addComboBox(w,["0+4","0+5","0+6","0+8","0+9","0+12","0+15","0+16","0+18"],w.setFrames,0,.5+vOffset,2,1);
w.lb22=nas.GUI.addStaticText(w,"frames",2,.7+vOffset,1,1);
w.cb23=nas.GUI.addComboBox(w,[15,24,23.98,25,30,29.97,59.94,60,100],nas.FRATE,3,.5+vOffset,2,1)
w.cb24=nas.GUI.addStaticText(w,"fps",5,.7+vOffset,1,1);
w.bt31=nas.GUI.addButton(w,"Cancel",0,1.7+vOffset,3,1);
w.bt32=nas.GUI.addButton(w,"O K",3,1.7+vOffset,3,1);
//======================================================================
w.sl00.onChange=function(){w.cb21.set(nas.Frm2FCT(Math.floor(this.value*nas.FRATE),3,0));w.cb21.onChange();}

Slider.on
w.cb21.onChange=function(){this.parent.setFrames=nas.FCT2Frm(this.value)}
w.cb23.onChange=function(){nas.FRATE=parseFloat(this.value);if(animationMode=="timelineAnimation"){nas.axeVTC.setFrameRate();}};
w.bt32.onClick=function(){
	var myFrames=this.parent.setFrames;
	if(! isNaN(myFrames)){
	   if(animationMode=="timelineAnimation"){nas.axeVTC.setDuration(myFrames)}else{nas.axeAFC.setDly(myFrames/nas.FRATE)};
		this.parent.close();
	}
}
w.bt31.onClick=function(){this.parent.close();}
w.show();
//var myXps=new Xps();


}
/*
	フレームレートの設定（nasのレートも変更）
*/
//nas=app.nas;

//var desc=nas.axeCMC.execWithReference("timelineDocumentSettings");
//if(desc){nas.FRATE=nas.axeVTC.getFrameRate();};

	var exFlag=true;

	nas=app.nas;
	var animationMode=nas.axeCMC.getAnimationMode();

//ドキュメントがない・アニメーションモードが初期化されていない場合はnas.FRATEのみを調整

	if(exFlag){
//最下層レイヤではなく、「背景レイヤ」限定? 考慮中


//==================================================================main
//=========================　ダイアログを作成
var myHeight=2.5;
w = nas.GUI.newWindow("dialog","Framerate setting",6,myHeight,320,360);
//プロパティ設定	
//buttonFunction

var vOffset=0;
w.tx01=nas.GUI.addStaticText(w,"psAxe :"+nas.FRATE,0,vOffset,2,1);
if(animationMode=="timelineAnimation"){
w.tx00=nas.GUI.addStaticText(w,"timeline :"+nas.axeVTC.getFrameRate(),0,.7+vOffset,2,1);

}
w.cb23=nas.GUI.addComboBox(w,[12,12.5,15,23.976,24,25,29.97,30,50,59.94,60,100],nas.FRATE,3,.5+vOffset,2,1)
w.cb24=nas.GUI.addStaticText(w,"fps",5,.7+vOffset,1,1);
w.bt31=nas.GUI.addButton(w,"Cancel",0,1.7+vOffset,3,1);
w.bt32=nas.GUI.addButton(w,"O K",3,1.7+vOffset,3,1);
//======================================================================
//w.cb23.onChange=function(){nas.FRATE=parseFloat(this.value);if(animationMode=="timelineAnimation"){nas.axeVTC.setFrameRate();}};
w.bt32.onClick=function(){
	nas.FRATE=parseFloat(this.parent.cb23.value);
	if(animationMode=="timelineAnimation"){nas.axeVTC.setFrameRate();};
		this.parent.close();
}
w.bt31.onClick=function(){this.parent.close();}
w.show();
//var myXps=new Xps();


}
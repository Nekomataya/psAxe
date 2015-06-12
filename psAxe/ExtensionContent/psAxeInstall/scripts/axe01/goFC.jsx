//goFC.jsx アニメーションフレームの指定を行って移動する
/*
	スライダで数値指定を行ってフレームをアクティベートする
	count数を設定してレイヤを移動するルーチン
*/
	nas=app.nas

var frameCount=nas.axeAFC.countFrames();

//==================================================
if(frameCount>1){

var maxFrames=frameCount;
//カレントオフセットを探る(現状0で初期化)
var currentOffset=0;
var myNames=new Array();
for(var cIx=maxFrames;cIx>0;cIx--){myNames.push(nas.Zf(cIx,3))};
//=====================================UI

var w=nas.GUI.newWindow("dialog","JUMP-AnimationFrames",6,3);
w.myLabel=nas.GUI.addComboBox(w,myNames,myNames[0],0,0,3,1);
w.cnBt=nas.GUI.addButton(w,"cancel",3,0,1.5,1);
w.okBt=nas.GUI.addButton(w,"G O !",4.5,0,1.5,1);
w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,1,6,2,true,"index",currentOffset+1,1,maxFrames);
//リストボックスのセレクトは即移動
w.myLabel.onChange=function(){
//	alert(this.selected)
	if(this.selected != null){
		nas.axeAFC.selectFrame(maxFrames-this.selected);
		if(nas.axe.focusMove)nas.axeCMC.focusTop();
		this.parent.close();
	}
}
w.mySlider.onChange=function(){
		this.set(Math.round(this.value),0,true);
		//alert((maxFrames-Math.round(this.value)+currentOffset)%maxFrames);
		this.parent.myLabel.select((maxFrames-this.value+currentOffset)%maxFrames);
}

w.okBt.onClick=function(){
//alert(maxFrames-this.parent.myLabel.selected);
nas.axeAFC.selectFrame(maxFrames-this.parent.myLabel.selected);
if(nas.axe.focusMove){nas.axeCMC.focusTop()};
this.parent.close();
}
w.cnBt.onClick=function(){this.parent.close();}

w.mySlider.onChange();
w.show();
//=================================
}else{
	alert(localize(nas.uiMsg.noAnimationFrames));
}


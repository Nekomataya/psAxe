/* addNewNumText.jsx
 add textLayer for Title/CUT#/TC
 optional Frame & registermark
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// in case we double clicked the file
	app.bringToFront();

if(app.documents.length==0){
	alert("noDocument");
}else{
//var strtRulerUnits = app.preferences.rulerUnits;
//app.preferences.rulerUnits = Units.INCHES;

//Photoshop�p���C�u�����ǂݍ���

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g������̂Ń��P�[�V�����t���[�ɂł���
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
var includeLibs=[nasLibFolderPath+"config.js"];//�ǂݍ��݃��C�u�������i�[����z��

if(! app.nas){
//iclude nas���C�u�����ɕK�v�Ȋ�b�I�u�W�F�N�g���쐬����
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
//	���C�u�����̃��[�h�@CS2-5�p
//==================== ���C�u������o�^���Ď��O�ɓǂݍ���
/*
	includeLibs�z��ɓo�^���ꂽ�t�@�C���������ǂݍ��ށB
	�o�^�̓p�X�ōs���B(File�I�u�W�F�N�g�ł͂Ȃ�)
	$.evalFile ���\�b�h�����݂���ꍇ�͂�����g�p���邪CS2�ȑO�̊��ł�global �� eval�֐��œǂݍ���

�������@���C�u�������X�g�i�ȉ��͓ǂݍ��ݏ��ʂɈ��̈ˑ���������̂Œ��Ӂj
�@config.js		��ʐݒ�t�@�C���i�f�t�H���g�l�����j���̃��[�`���O�ł͎Q�ƕs�\
  nas_common.js		AE�EHTML���p��ʃA�j�����C�u����
  nas_GUIlib.js		Adobe�����pGUI���C�u����
  nas_psAxeLib.js	PS�p�����C�u����
  nas_prefarenceLib.js	Adobe�����p�f�[�^�ۑ����C�u����

  nasXpsStore.js	PS�ق�Adobe�ėpXpsStore���C�u����(AE�p�͓���)
  xpsio.js		�ėpXps���C�u����
  mapio.js		�ėpMap���C�u����
  lib_STS.js		Adobe�����pSTS���C�u����
  dataio.js		Xps�I�u�W�F�N�g���o�̓��C�u�����i�R���o�[�^���j
  fakeAE.js		���Ԋ����C�u����
  io.js			��܂҂���o�̓��C�u����
  psAnimationFrameClass.js	PS�p�t���[���A�j���[�V�������색�C�u����
  xpsQueue.js		PS�pXps-FrameAnimation�A�g���C�u����
*/
includeLibs=[
	nasLibFolderPath+ "config.js",
	nasLibFolderPath+ "nas_common.js",
	nasLibFolderPath+ "nas_GUIlib.js",
	nasLibFolderPath+ "nas_psAxeLib.js",
	nasLibFolderPath+ "nas_prefarenceLib.js"
];
//=====================================�@Application Object�ɎQ�Ƃ�����
	app.nas=nas;
	bootFlag=true;
}else{
//	alert("object nas exists")
	nas=app.nas;
	bootFlag=false;
};

/*	���C�u�����ǂݍ���
�����ŕK�v�ȃ��C�u���������X�g�ɉ����Ă���ǂݍ��݂��s��
*/

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js" );
includeLibs.push(nasLibFolderPath+"xpsio.js" );
includeLibs.push(nasLibFolderPath+"mapio.js" );
includeLibs.push(nasLibFolderPath+"lib_STS.js" );
includeLibs.push(nasLibFolderPath+"dataio.js" );
includeLibs.push(nasLibFolderPath+"fakeAE.js" );
includeLibs.push(nasLibFolderPath+"io.js" );
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js" );
includeLibs.push(nasLibFolderPath+"xpsQueue.js" );
includeLibs.push(nasLibFolderPath+"psCCfontFix.js");

for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile �t�@���N�V����������Ύ��s����
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile �����݂��Ȃ��o�[�W�����ł�eval�Ƀt�@�C����n��
		var scriptFile = new File(myScriptFileName);
		if(scriptFile.exists){
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}
//=====================================�ۑ����Ă���J�X�^�}�C�Y�����擾
if(bootFlag){nas.readPrefarence();nas.workTitles.select();}
//=====================================
//+++++++++++++++++++++++++++++++++�����܂ŋ��p

//�h�L�������g��񂩂�h�L�������g�����쐬����
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+nas.Zf(nas.axe.dmCurrent[1],2)+ "c" +nas.Zf(nas.axe.dmCurrent[2],3);

if(nas.axe.dmDialog){
//�_�C�A���O���o�͂��ăh�L�������g�̎w��������擾
	var w=nas.GUI.newWindow("dialog","���݂̃h�L�������g�Ƀ^�C�g���e�L�X�g��ǉ�",9,9,320,240);

 w.lb0 = nas.GUI.addStaticText(w,"�t�@�C����",0,0,2,1);
// w.fileName= nas.GUI.addEditText(w,nas.incrStr(currentName),2,0,5,1);
 w.fileName= nas.GUI.addEditText(w,currentName,2,0,5,1);

 w.lb1 = nas.GUI.addStaticText(w,"����#." ,0,1,2,.75);
 w.lb2 = nas.GUI.addStaticText(w,"CUT#." ,2.25,1,2,.75);
 w.lb3 = nas.GUI.addStaticText(w,"( TIME )" ,4.5,1,2,0.75);

 w.opusNumber= nas.GUI.addEditText(w,nas.Zf(nas.axe.dmCurrent[1],2),0.75,1,1,1);
   w.opusInc= nas.GUI.addButton(w,"+",1.45 ,1,0.6,1);
   w.opusDec= nas.GUI.addButton(w,"-",1.75,1,0.6,1);

 w.cutNumber= nas.GUI.addEditText(w,nas.axe.dmCurrent[2].toString(),3,1,1,1);
   w.cutInc= nas.GUI.addButton(w,"+",3.7 ,1,0.6,1);
   w.cutDec= nas.GUI.addButton(w,"-",4   ,1,0.6,1);

 w.timeText= nas.GUI.addEditText(w,nas.Frm2FCT(nas.FCT2Frm(nas.axe.dmCurrent[3]),3),5.5,1,1.5,1);
   w.secInc= nas.GUI.addButton(w,"+1",4.8  ,2,.75,1);
   w.secDec= nas.GUI.addButton(w,"-1",5.25,2,.75,1);
   w.frmInc= nas.GUI.addButton(w,"+6",5.8  ,2,.75,1);
   w.frmDec= nas.GUI.addButton(w,"-6",6.25,2,.75,1);

�@w.imPanel=nas.GUI.addPanel(w,"�t���[��",0,3,7,6); 

w.imPanel.lb0 = nas.GUI.addStaticText(w.imPanel,"�^�C�g��:",0,0.5,2,1);
w.imPanel.selectTT=nas.GUI.addComboBox(w.imPanel,nas.workTitles.names(0),nas.workTitles.selected,2,0.5,4,1)

w.imPanel.lb1 = nas.GUI.addCheckBox(w.imPanel,":�t���[��",0,2,3,1);
w.imPanel.lb1.value=false;
w.imPanel.selectIM=nas.GUI.addDropDownList(w.imPanel,nas.inputMedias.names(0),nas.workTitles.selectedRecord[3],3,2,4,1);

w.imPanel.lb3 = nas.GUI.addCheckBox(w.imPanel,":�^�b�v",0,3,3,1);
w.imPanel.lb3.value =false;
w.imPanel.selectRM=nas.GUI.addDropDownList(w.imPanel,nas.registerMarks.names(0),nas.registerMarks.selected,3,3,4,1);

//=========================
 w.okBt=nas.GUI.addButton(w,"OK",7,0,2,1);
 w.cnBt=nas.GUI.addButton(w,"�L�����Z��",7,1,2,1);
//=============�@�R���g���[�����\�b�h
//�^�C�g���Z���N�^�X�V�@�e�R���g���[���X�V���ăh�L�������g�����쐬
w.imPanel.selectTT.onChange=function(){
 nas.workTitles.select(this.selected);//�I���^�C�g����؂�ւ���H
 nas.axe.dmCurrent[0]=nas.workTitles.selected;
 this.parent.parent.fileName.update();
 this.parent.selectIM.items[nas.workTitles.selectedRecord[3]].selected=true;
}

//IM�Z���N�^�X�V�@�e�R���g���[���X�V���ăh�L�������g�����쐬
w.imPanel.selectIM.onChange=function(){
 nas.inputMedias.select(this.selection.index);
 nas.RESOLUTION=nas.inputMedias.selectedRecord[3]/2.540;//dpc
}
//�^�b�v�Z���N�^�X�V
w.imPanel.selectRM.onChange=function(){
 nas.registerMarks.select(this.selection.index);
}
//�t�@�C�����X�V�i����ʍs�Łj
w.fileName.update=function(){
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+this.parent.opusNumber.text+"c"+this.parent.cutNumber.text;
this.text=currentName;
}
//�l�㉺�{�^��
w.opusInc.onClick=function(){this.parent.opusNumber.text=nas.Zf(nas.incrStr(this.parent.opusNumber.text),2);this.parent.opusNumber.onChange();};
w.opusDec.onClick=function(){this.parent.opusNumber.text=nas.Zf(nas.incrStr(this.parent.opusNumber.text,-1),2);this.parent.opusNumber.onChange();};
w.cutInc.onClick=function(){this.parent.cutNumber.text=nas.Zf(nas.incrStr(this.parent.cutNumber.text),3);this.parent.cutNumber.onChange();};
w.cutDec.onClick=function(){this.parent.cutNumber.text=nas.Zf(nas.incrStr(this.parent.cutNumber.text,-1),3);this.parent.cutNumber.onChange();};

w.secInc.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)+Number(nas.FRATE),3);};
w.secDec.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)-Number(nas.FRATE),3);};
w.frmInc.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)+6,3);};
w.frmDec.onClick=function(){this.parent.timeText.text=nas.Frm2FCT(nas.FCT2Frm(this.parent.timeText.text)-6,3);};
//opusNo.cutNo�X�V
w.opusNumber.onChange=function(){this.parent.fileName.update();};
w.cutNumber.onChange=function(){this.parent.fileName.update();};
w.timeText.onChange=function(){this.text=nas.Frm2FCT(nas.FCT2Frm(this.text),3);};


//=======================================�쐬
 w.okBt.onClick=function(){
  var myName=w.fileName.text;
//�I�v�V�����ɂ��������ăh�L�������g�𐮌`

/*	 ���݂��Ȃ��ꍇ�̂݃��C���Z�b�g"Frames"���쐬	*/
try {
	var myFrameSet=app.activeDocument.layerSets.getByName("Frames")
}catch(er){
	var myFrameSet=app.activeDocument.layerSets.add();
	myFrameSet.name="Frames";
}
//�ړ��̕K�v�������[Frames]���ŏ�ʂ�
if(app.activeDocument.layers.length >1){myFrameSet.move(app.activeDocument,ElementPlacement.PLACEATBEGINNING)};

//�t���[���Z�b�g�Ƀ��W�X�^�摜�ƃt���[����ǂݍ���(�`�F�b�N���Ȃ���΃X�L�b�v)
var currentUnitBase=app.preferences.rulerUnits;//�T����
app.preferences.rulerUnits=Units.MM;
if(w.imPanel.lb3.value==true){
//���W�X�^
  var myPegFile=new File(nasLibFolderPath+"resource/Pegs/"+nas.registerMarks.selectedRecord[1]);
  myPegLayer=nas.axeAFC.placeEps(myPegFile);
  myPegLayer.translate("0 px",-1*myPegLayer.bounds[1]);//��ӂւ͂���
  myPegLayer.name="peg";
  myPegLayer.move(myFrameSet,ElementPlacement.PLACEATEND);
}else{
//�_�~�[�̃^�b�v���C�������遁bounds����������I�u�W�F�N�g
�@var myPegLayer=new Object();
�@myPegLayer.bounds=[
		app.activeDocument.width*0.1,
		new UnitValue("0mm"),
		app.activeDocument.width*0.9,
		new UnitValue("25mm")	
�@]
}
if(w.imPanel.lb1.value==true){
//100�t���[���g��ǂݍ���
  var myFrameFile=new File(nasLibFolderPath+"resource/Frames/"
	+nas.inputMedias.selectedRecord[1]+"mm"
	+nas.inputMedias.selectedRecord[2].replace(/\//,"x")
	+".eps"
  );
  myFrameLayer=nas.axeAFC.placeEps(myFrameFile);
//�t���[���z�u�@�����̓Z���^�����O�݂̂ō��E�̓p�X 20110820
var myOffset=(((myFrameLayer.bounds[3]-myFrameLayer.bounds[1])/2)+myFrameLayer.bounds[1]).as("mm")-nas.inputMedias.selectedRecord[7];
  myFrameLayer.translate(new UnitValue("0 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//�^�b�v����̋�����
  myFrameLayer.name="frame";
//
  myFrameLayer.move(myFrameSet,ElementPlacement.PLACEATEND);
}
if(true){
//�e��e�L�X�g��z�u
var myTextLayer=myFrameSet.artLayers.add();//���C���ǉ�
var myTextOffsetX=(((myTextLayer.bounds[2]-myTextLayer.bounds[0])/2)+myTextLayer.bounds[0]).as("mm");
var myTextOffsetY=(((myTextLayer.bounds[3]-myTextLayer.bounds[1])/2)+myTextLayer.bounds[1]).as("mm");
  myTextLayer.kind = LayerKind.TEXT;//�e�L�X�g���C���ɕϊ�
  myTextLayer.textItem.contents = nas.workTitles.selectedRecord[1]+" #"+this.parent.opusNumber.text;
  myTextLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myTextLayer.bounds[0]).as("mm")+0)+" mm" ),
	new UnitValue(((myPegLayer.bounds[3]-myTextLayer.bounds[1]).as("mm")+5)+" mm" )
  );//�^�b�v�ʒu����ɒ���
var myCutLayer=myFrameSet.artLayers.add();//���C���ǉ�
  myCutLayer.kind = LayerKind.TEXT;//�e�L�X�g���C���ɕϊ�
  myCutLayer.textItem.contents = "c# "+this.parent.cutNumber.text;
  myCutLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myCutLayer.bounds[0]).as("mm")+120)+" mm" ),
	new UnitValue(((myPegLayer.bounds[3]-myCutLayer.bounds[1]).as("mm")+5)+" mm" )
  );//�^�b�v�ʒu����ɒ���
//  myCutLayer.translate(new UnitValue(120+" mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm"))+" mm"));//�^�b�v����̋�����
var myTimeLayer=myFrameSet.artLayers.add();//���C���ǉ�
  myTimeLayer.kind = LayerKind.TEXT;//�e�L�X�g���C���ɕϊ�
  myTimeLayer.textItem.contents = "( "+this.parent.timeText.text+" )" ;
  myTimeLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myTimeLayer.bounds[0]).as("mm")+200)+" mm"),
	new UnitValue(((myPegLayer.bounds[3]-myTimeLayer.bounds[1]).as("mm")+5)+" mm")
  );//�^�b�v�ʒu����ɒ���
//  myTimeLayer.translate(new UnitValue("200 mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm"))+" mm"));//�^�b�v����̋�����

	app.preferences.rulerUnits = Units.POINTS;
  myTextLayer.textItem.size = 32;//32�|
  myCutLayer.textItem.size = 32;//32�|
  myTimeLayer.textItem.size = 24;//24�|

	//�o�O�����������ꍇ�w��|�C���g���ƈقȂ�f�[�^���Ԃ�̂ł���𔻒�
if (Math.round(myTextLayer.textItem.size.as("point"))!=32){
  nas.PSCCFontSizeFix.setFontSizePoints( myTextLayer, 32);//32�|
  nas.PSCCFontSizeFix.setFontSizePoints( myCutLayer, 32);//32�|
  nas.PSCCFontSizeFix.setFontSizePoints( myTimeLayer, 24);//24�|
};

}
app.preferences.rulerUnits=currentUnitBase;//���A

//	app.activeDocument.activeLayer=startupLayer;

//nas.axe.dmCurrent �X�V
	nas.axe.dmCurrent=[nas.workTitles.selected,this.parent.opusNumber.text,this.parent.cutNumber.text,this.parent.timeText.text];
if(bootFlag){nas.writePrefarence(["nas.axe","nas.RESOLUTION","nas.workTitles.selected","nas.registerMarks.selected" ]);}
//alert(nas.axe.dmCurrent)
	this.parent.close();
};
 w.cnBt.onClick=function(){this.parent.close();};
/*
 w.tsBt.onClick=function(){;};
 w.isBt.onClick=function(){;};
*/
w.show();
}
}
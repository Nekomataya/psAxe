/* onsPref
	���߃v���t�@�����X
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
	app.bringToFront();

//Photoshop�p���C�u�����ǂݍ���

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g������̂Ń��P�[�V�����t���[�ɂł���
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas/lib=nas/lib/");
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
�@config.js"		��ʐݒ�t�@�C���i�f�t�H���g�l�����j���̃��[�`���O�ł͎Q�ƕs�\
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
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
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
	if(false){
includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	};
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

//=====================================UI
var uix=(app.version.split(".")[0]>9)
var w=nas.GUI.newWindow("dialog","���C���ݒ�",6,10);
 w.cbOpc=nas.GUI.addCheckBox(w,"�V�K���C���𓧉�",0,0,3,1);///�V�K���C���𔼓����ō�邩�s�����ō�邩
 w.cbOpc.value=nas.axe.newLayerTpr;
if(uix){
 w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,0.5,6,2,true,"�s���ߗ�",nas.axe.onsOpc*100,0,100,true);
 w.mySlider.onChange=function(){this.set(Math.floor(this.value),0,true);}
}else{
 w.opSPX=nas.GUI.addStaticText(w,"%�i�s���ߗ��j",1,1,2,1);//
 w.opSPC=nas.GUI.addEditText(w,nas.axe.onsOpc*100,0,1,1,1);//
}


//=========�V�K����w�i�F�I��
w.colorSPC=nas.GUI.addPanel(w,"�V�K���C���̔w�i�F",0,2.2,6,2);
for(var ix=0;ix<nas.axe.lyBgColors.length;ix++){
	w["rbl"+ix]=nas.GUI.addRadioButton(w.colorSPC,nas.axe.lyBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	w["rbl"+nas.axe.lyBgColor].value=true;
//=========�C���p���F�I��
w.colorSPCovl=nas.GUI.addPanel(w,"�C�����C���̔w�i�F",0,3.9,6,2);
for(var ix=0;ix<nas.axe.ovlBgColors.length;ix++){
	w["rbo"+ix]=nas.GUI.addRadioButton(w.colorSPCovl,nas.axe.ovlBgColors[ix][0],ix*1.2,0.3,1.5,1);
}
	w["rbo"+nas.axe.ovlBgColor].value=true;

//====================================================�@layers interlocking
/*�@���C���Z�b�g�A���v���p�e�B�̎擾
�@���C���Z�b�g�A���̏����́A
	�h�L�������g�����݂��邱��
	�h�L�������g���K�w�Ƀ��C���Z�b�g��2�ȏ㑶�݂��邱�ƁB(Document.layers.length>=2)
	Photoshop�̃o�[�W������CS4(11)�ȏ�ł��邱�Ɓi�v���p�e�B�ݒ肪�ł��Ȃ�)
	����ۗ��i���false�j
*/
var myWSnames=[];mySelectedOptions=[];
//alert(app.version.split(".")[0]>10);

if(	(false)&&
	(app.version.split(".")[0]>10)&&
	(app.documents.length)&&
	(app.activeDocument)&&
	(app.activeDocument.layerSets.length>1)
){
//�Ăяo�����_�̃^�[�Q�b�g���C���Z�b�g���擾����
/*	�^�[�Q�b�g���C���Z�b�g�͑��K�w�ŁA�����C���Z�b�g�ł��邱��
	
*/
var myDocLayers=(
	(app.activeDocument.activeLayer.parent.typename=="Document")&&
	(app.activeDocument.activeLayer.typename=="LayerSet")
)? app.activeDocument.activeLayer:app.activeDocument.activeLayer.parent;
if(myDocLayers.xLinks==undefined){
//�v���p�e�B�����݂��Ȃ���΃f�t�H���g�̋�z��ŏ�����
  myDocLayers.xLinks=mySelectedOptions
}else{
//�v���p�e�B������Ό�����擾
  mySelectedOptions=myDocLayers.xLinks
};
	for (var idx=0;idx<app.activeDocument.layerSets.length;idx++){
		myWSnames.push(app.activeDocument.layerSets[idx].name)
//alert(app.activeDocument.layerSets[idx].interlocked)
//		if(app.activeDocument.layerSets[idx].interlocked){
//			mySelectedOptions.push(idx)
//		}else{
//			app.activeDocument.layerSets[idx].interlocked=false;
//		}
	}
}else{
		myWSnames.push("�A���\�ȃ��C���Z�b�g�͂���܂���");
		mySelectedOptions.push(false);
}
var myMsgIL="���C���Z�b�g�A��"+nas.GUI.LineFeed+"���C���Z�b�g���Ƃɐݒ肵�܂��B"+nas.GUI.LineFeed+"�ۑ��͂���܂���B";//

 w.interlockLabel=nas.GUI.addStaticText(w,myMsgIL,0,6,2,3);//
 w.interlocking=nas.GUI.addListBoxO(w,myWSnames,mySelectedOptions,2,6,4,3,{multiselect:true});
if(myWSnames.length>1){w.interlocking.enabled=true;}else{w.interlocking.enabled=false;}
//====================================================
 w.cnBt=nas.GUI.addButton(w,"cancel",1.5,9,1.5,1);
 w.rtBt=nas.GUI.addButton(w,"Reset",3,9,1.5,1);
 w.okBt=nas.GUI.addButton(w,"O K",4.5,9,1.5,1);
//
//
w.cnBt.onClick=function(){this.parent.close()};
w.rtBt.onClick=function(){
	this.parent.cbOpc.value=nas.axe.newLayerTpr;
if(uix){
	this.parent.mySlider.set(Math.floor(nas.axe.onsOpc*100));
}else{
	this.parent.opSPC.text=(Math.floor(nas.axe.onsOpc*100));
}
	this.parent["rb"+nas.axe.lyBgColor].value=true;
};

w.okBt.onClick=function(){

	if(w.cbOpc.value!=nas.axe.newLayerTpr){nas.axe.newLayerTpr=w.cbOpc.value};
if(uix){
	if(w.mySlider.value!=(nas.axe.onsOpc*100)){nas.axe.onsOpc=(w.mySlider.value/100)};
}else{
	if((w.opSPC.text/100)!=nas.axe.onsOpc){nas.axe.onsOpc=(w.opSPC.text/100)};
}
	for(var rix=0;rix<nas.axe.lyBgColors.length;rix++){if(w["rbl"+rix].value){if(rix != nas.axe.lyBgColor){nas.axe.lyBgColor=rix};break;}};
	for(var rix=0;rix<nas.axe.ovlBgColors.length;rix++){if(w["rbo"+rix].value){if(rix != nas.axe.ovlBgColor){nas.axe.ovlBgColor=rix};break;}};
	nas.writePrefarence("nas.axe");

//�A�����̓h�L�������g�ɒ��ڏ�������ŕۑ��͂Ȃ�
//if(!app.activeDocument.interlocked){app.activeDocument.interlocked=new Array();}
if(myWSnames.length>1){
	myDocLayers.xLinks=[];//������
	for(var idx=0;idx<myWSnames.length;idx++){
 if(w.interlocking.items[idx].selected){myDocLayers.xLinks.push(idx)}
	}
}
	this.parent.close();
}

w.show();
//=================================
//
//delete w;



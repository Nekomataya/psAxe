//shiftLyers.jsx ���C���Z�b�g�̃����o�[��萔�V�t�g����
/*
	�X���C�_�Ő��l�w����s���čŒZ�����ɕϊ��A���̌���ۂ̃��C�����V�t�g����
	count����ݒ肵�ă��C�����ړ����郋�[�`���i�����j�@���ƂŃX���C�_�����邱��
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
	//alert("object nas exists")
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

//=====================================================���C���V�t�g�֐����C�u�����ֈڍs����ق����悢����
function shiftLayers(shiftCount){
//shiftCount�͐����@0�͔��肵�ă��^�[���i�ړ����Ȃ��̂Łj
 if(!shiftCount){shiftCount=0;};
 if(shiftCount==0){return};
 var idx=0;
 var myDocLayers=app.activeDocument.activeLayer.parent;
 var mxId=myDocLayers.layers.length;
 //�V�t�g�J�E���g���ŏ��ړ��֕ϊ�
// alert(shiftCount);
 shiftCount=shiftCount%mxId;
if(Math.abs(shiftCount)>(mxId/2)){shiftCount=(shiftCount<0)?(mxId+shiftCount):-(mxId-shiftCount)};
// alert(shiftCount);
 while(myDocLayers.layers[idx]!=app.activeDocument.activeLayer){idx++};
 app.activeDocument.activeLayer=myDocLayers.layers[(idx+mxId-shiftCount)%mxId];
 if(shiftCount>0){
  while (shiftCount>0){ myDocLayers.layers[myDocLayers.layers.length-1].move(myDocLayers.layers[0],ElementPlacement.PLACEBEFORE);shiftCount--; }
 }else{
  while (shiftCount<0){myDocLayers.layers[0].moveToEnd(app.activeDocument.activeLayer.parent);shiftCount++; }
 }
//activate TopLayer
for(var idx=0;idx<myDocLayers.layers.length;idx++){if(myDocLayers.layers[idx].visible){app.activeDocument.activeLayer=myDocLayers.layers[idx];break;}};
}
//���x�����l���J�E���g�֐� �⏕�����͐����Ȃ���@�ł��������͐����邩���H
function countLabelNum(myLabel){
	if (myLabel.match(/([0-9]+)/)){return RegExp.$1 *1;}else{return 0;}
}
//==================================================
if((app.documents.length)&&(app.version.split(".")[0]>9)){
var myDocLayers=app.activeDocument.activeLayer.parent;
var maxLayers=myDocLayers.layers.length;
//�J�����g�I�t�Z�b�g��T��
var currentOffset=0;
var prV=countLabelNum(myDocLayers.layers[0].name);
var myNames=new Array();
for(var cIx=0;cIx<maxLayers;cIx++){myNames.push(myDocLayers.layers[cIx].name)};
for(var cIx=1;cIx<maxLayers;cIx++){
	var crV=countLabelNum(myDocLayers.layers[cIx].name);
	if((crV-prV)>=(maxLayers-1)){currentOffset=(cIx-1);break;}else{if(cIx==(maxLayers-1)){currentOffset=cIx;break;}else{prV=crV;continue;}}
}
var shiftCount=0;
//=====================================UI

var w=nas.GUI.newWindow("dialog","JUMP",6,3);
w.myLabel=nas.GUI.addComboBox(w,myNames,myNames[0],0,0,3,1);
w.cnBt=nas.GUI.addButton(w,"cancel",3,0,1.5,1);
w.okBt=nas.GUI.addButton(w,"G O !",4.5,0,1.5,1);
w.mySlider=nas.GUI.addMultiControl(w,"number",1,0,1,6,2,true,"index",currentOffset+1,1,maxLayers);
//�R���{�{�b�N�X�̃Z���N�g�͑��ړ��E���O�̓��͂͐V�K�쐬�����Ǎ����͕ۗ�
w.myLabel.onChange=function(){
//	alert(this.selected)
	if(this.selected != null){
		shiftLayers (-this.selected);
//		if((maxLayers/2)>this.selected){shiftLayers (-this.selected)}else{shiftLayers (maxLayers-this.selected)}
		this.parent.close();
	}else{
		alert("�����ŐV�K���̂̃��C�����쐬����\�肾���ǁA���Ƃŏ����܂��B�����̓i�V�@2011.05.23");
	}
}
w.mySlider.onChange=function(){
		this.set(Math.round(this.value),0,true);
		//alert((maxLayers-Math.round(this.value)+currentOffset)%maxLayers);
		this.parent.myLabel.select((maxLayers-this.value+currentOffset+1)%maxLayers);
}
w.okBt.onClick=function(){shiftLayers (-this.parent.myLabel.selected);this.parent.close();}
w.cnBt.onClick=function(){this.parent.close();}
w.show();
//=================================
}else{
if(app.version.split(".")[0]<=9){alert("���݂܂��� CS2�ł͋@�\���܂���")}
}

//xLink (�������C������)�ɂ͖��Ή��Ȃ̂Œ��Ӂ@2011 05.31
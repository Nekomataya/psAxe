/*
		Photoshop�@���C�����ύX�p�l��
	�A�N�e�B�u���C���̃��C������ύX�����
	�ׂ̃��C���Ƀp�l�����ňړ��ł���
	�ς�ς�@�\�t(���̕ύX�����ɒ���)
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
	app.bringToFront();

	var exFlag=true;
//���������h�L�������g���Ȃ���ΏI��
	if(app.documents.length==0){
		exFlag=false;
	}else{
//�N�����Ƀ��C���R���N�V�����̏�Ԃ��m�F�@�t���b�v�A�C�e������0�ȉ��Ȃ�I��
		if(activeDocument.activeLayer.parent.layers.length<1){exFlag=false;};
	}
	if(exFlag){
//�I�v�V�����Ŕw�i���C�����p���p���ɎG���邩�ۂ��𒲐�
//�ŉ��w���C���ł͂Ȃ��A�u�w�i���C���v����? �l����

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

includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");

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

/*------	nas��ʃ��\�b�h�V������b�莎��	------*/
/*	nas.numInc([string ���ԍ�],step);
	�߂�l:�V�ԍ�
�J�b�g�Ŕԍ��𕶎���ŗ^���čŏ��Ɍ���鐔�l������1���������Č�u������؂�̂ĂĖ߂��B
���l���܂܂Ȃ��������^����Ƃ����O�u�����Ƃ���"001"��t���Ė߂��B
���������̏ꍇ�͊J�n�ԍ���"001"��߂��B
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
//�����킹�̕������擾
	var myOrder=numValue.length;
//�|�X�g�t�B�b�N�X������ꍇ�́A�������Ŕp��
//�v���t�B�b�N�X�͖������ŕێ�
	return preFix+nas.Zf(numValue*1+myStep,myOrder);
}

/*
	�t���b�v�@�\�̓��[�e�[�^�[����@�\�Œu��
*/


var myEasyFlip=new Object();
//properties
	myEasyFlip.targetLayers=activeDocument.activeLayer.parent.layers;
	myEasyFlip.wait=3*1000/24;
	myEasyFlip.bgFix=false;
	myEasyFlip.onLoop=true;
	myEasyFlip.playStatus="stop";
	myEasyFlip.previewLayer=activeDocument.activeLayer;

	myEasyFlip.playList=new Array();
	myEasyFlip.backupView=new Array();

	myEasyFlip.tableInit=function(){
		//�e�[�u���̏�����
/*
	�^�[�Q�b�g�g���[���[�̎Q�Ɣz������.
	�쐬���_�̕\������orderIndex�Ƃ��ċL�^���Ă���
*/
		for(var ix=0;ix<this.targetLayers.length;ix ++){
			this.targetLayers[ix].orderIndex=ix;
		}
	}

	myEasyFlip.tableInit();

	myEasyFlip.orderRestore=function(){
//�ȉ����A���[�`��
		for(var ix=0;ix<this.targetLayers.length;ix ++){
			if(this.targetLayers[0].orderIndex>ix){
				this.targetLayers[0].moveToEnd(app.activeDocument.activeLayer.parent);
			}
		}
	}

�@
	myEasyFlip.flip=function(WD){
		var myOffset=(WD=="BWD")?-1:1;
		if(myOffset==1){
this.targetLayers[this.targetLayers.length-1].move(this.targetLayers[0],ElementPlacement.PLACEBEFORE);
		}else{
this.targetLayers[0].moveToEnd(app.activeDocument.activeLayer.parent);
		}
	}

//������


if(false){
		var startCount=new Date().getTime();
		var breakRimit=startCount+10000;//10�b����
		var nextCount=startCount+1000;//1�b����
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

//	GUI������
w=nas.GUI.newWindow("dialog","���C�����l�[��",5,5);
w.onClose=function(){myEasyFlip.orderRestore();};
w.onOpen=true;

w.nameView=nas.GUI.addButton(w,myEasyFlip.previewLayer.name,1,0,4,1);
w.bt0=nas.GUI.addButton(w,"[ / ]",0,1,1,1);
w.bt1=nas.GUI.addButton(w,"[++]",0,2,1,1);
w.bt2=nas.GUI.addButton(w,"[--]",1,2,1,1);
w.namePad=nas.GUI.addEditText(w,myEasyFlip.previewLayer.name,1,1,4,1);

w.btL0=nas.GUI.addSelectButton(w,["BG","BOOK","LO","Frame","A","B","C","D","E","F","G","H","I","J","K","L"],3,0,3,1.5,1);
w.btL1=nas.GUI.addButton(w,"��",1.5,3,1,1);
//w.btL2=nas.GUI.addButton(w,">>",2  ,3,0.7,1);


w.bt3=nas.GUI.addButton(w,"��goFWD��",2.5,2,2.5,1);
w.bt4=nas.GUI.addButton(w,"��goBWD��",2.5,3,2.5,1);
w.bt5=nas.GUI.addButton(w,"close",2.5,4,2.5,1);
w.bt6=nas.GUI.addButton(w,"label X",0,4,2.5,1);


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
//	myEasyFlip.viewRestore();
	this.parent.onOpen=false;
	this.parent.close();
};

w.bt6.onClick=function(){
//�@�Ώۃg���[���̃��x���������X�V
	var myLabel=myEasyFlip.targetLayers[0].parent.name;
	var startNumber=1;
	var currentName=[myLabel,nas.Zf(startNumber,3)].join("-");
	for(var idx=myEasyFlip.playList.length-1;idx>=0;idx--){
		myEasyFlip.targetLayers[myEasyFlip.playList[idx]].name=currentName;
		currentName=nas.numInc(currentName);
	}
}
//============================================================== 
w.show();

//w.watch("onOpen",function(){alert(w.onOpen);w.unwatch("onOpen");});

//whle(true){}
	}else{alert("�Ȃ񂾂��p�^�p�^������̂������݂���");}
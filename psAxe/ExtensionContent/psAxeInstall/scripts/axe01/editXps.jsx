/*
	�A�N�e�B�u�h�L�������g�ɑΉ�����XPS�t�@�C����T���ĕҏW����
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
includeLibs.push(nasLibFolderPath+"config.js");//config�̂݉����ĎQ�Ɖ\��
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
includeLibs.push(nasLibFolderPath+"newXps.jsx");

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
//==================================================================main

if(true){
//����}���I�u�W�F�N�g
	var XPS=new Xps();
//	nas.XPSStore=new XpsStore();
}
if((app.documents.length)){
//
var myTarget=app.activeDocument;
if(myTarget.name.match(/.*\.psd$/i)){
	var myXpsFile=new File([myTarget.fullName.path,myTarget.fullName.name.replace(/\.psd/,".xps")].join("/"));

if(myXpsFile.exists){
	//�t�@�C�������݂���̂ŕҏW�\�t�g�ɓn���ďI��
		var myOpenfile = new File(myXpsFile.fsName);
		myOpenfile.execute();
}else{
	//�^�[�Q�b�g��XPS�����݂��Ȃ��̂ŁA
	//����̃h�L�������g�ɏ]���i�Ǝv����jXPS���J���Ő������ĕۑ�����
	//�\�Ȃ炻�̏�ŕҏW���j�b�g���R�[�X����
	var myDuration=72;//frames
	var myFps=nas.FRATE;
	XPS.init(myTarget.layers.length,myDuration);
	XPS.mapFile="./"+myTarget.fullName.name;
	XPS.framerate=myFps;
	XPS.cut=myTarget.name.replace(/\.psd/i,"");
	var mx=myTarget.layers.length;
	for(var lix=0;lix<mx;lix++){
		XPS.layers[lix].name=(myTarget.layers[mx-lix-1].name.replace(/\s/g,""));//name�ݒ莞��encoding�ݒ肵�ă��C��������󔒂��G�X�P�[�v���邱��
		XPS.layers[lix].sizeX=myTarget.layers[mx-lix-1].bounds[2].as("px")-myTarget.layers[mx-lix-1].bounds[0].as("px");
		XPS.layers[lix].sizeY=myTarget.layers[mx-lix-1].bounds[3].as("px")-myTarget.layers[mx-lix-1].bounds[1].as("px");
		XPS.layers[lix].lot=(myTarget.layers[mx-lix-1].layers)?myTarget.layers[mx-lix-1].layers.length:1;
	}
	if(confirm("�^�C���V�[�g������܂���B�V�K�ɍ쐬���ĕҏW���܂����H")){
	var fileSaveResult=editXpsProp(XPS);
//	alert(fileSaveResult);
		if((fileSaveResult)&&(myXpsFile.exists)){myXpsFile.execute()};
if(false){
//�ۑ����ā@�h�L�������g���Ăяo��
		myXpsFile.encoding="utf8";
		myXpsFile.open("w");
		myXpsFile.write(XPS.toString());
		myXpsFile.close();

		myXpsFile.execute();
}
	}
}
}else{
	alert("�t�@�C����psd�Ƃ��ĕۑ�����Ă��Ȃ��ꍇ�́A�V�[�g���쐬�ł��܂���");
}

}
//alert(XPS.toString())
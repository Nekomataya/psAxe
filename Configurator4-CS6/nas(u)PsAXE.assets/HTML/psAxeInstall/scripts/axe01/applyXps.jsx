/*(�^�C���V�[�g�K�p)
	Xps Sheet�@�f�[�^��PSD�t���[���A�j���[�V�����ɓK�p
    undo �ݒ���s��Ȃ��B
    ���̋@�\�̓`���[�j���O�̗]�n����������̂ł܂��œK�����Ȃ��Œu���Ă��� 2011/09/25
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
//����}���I�u�W�F�N�g
	var XPS=new Xps();
//	nas.XPSStore=new XpsStore();

var myTimeCount=new Object();
	myTimeCount.start=new Date().getTime();
	myTimeCount.current=0;
	myTimeCount.datas=new Array();
	myTimeCount.datas.push(["started",0])
	myTimeCount.check=function(myLabel){
		now = new Date().getTime();
		this.datas.push([myLabel,now-this.start-this.current]);
		this.current=now-this.start;
	}

if((app.documents.length)&&(app.activeDocument.name.match(/.*\.psd$/i))){
myTimeCount.check("loadLib");
//
var myTarget=app.activeDocument;
myTarget.buildPsQueue=_buildPsQueue;
myTarget.setView=_setView;
if(myTarget.viewBuf){delete myTarget.viewBuf};//�b��I��viewBuf�N���A
var myXpsFile=new File([myTarget.fullName.path,myTarget.fullName.name.replace(/\.psd/,".xps")].join("/"));


if(myXpsFile.exists){
	//�t�@�C�������݂���̂œǂݍ���
		var myOpenfile = new File(myXpsFile.fsName);
		myOpenfile.encoding="UTF8";
		myOpenfile.open("r");
		var myContent = myOpenfile.read();
	//	alert(myContent);
		if(myContent.length==0){alert("Zero Length!");}
		myOpenfile.close();
		XPS.readIN(myContent);
		myTimeCount.check("readIN");
//�㏈���ɕ֗��Ȃ̂ŃV�[�g�Q�Ɣz����쐬����B
	var myTargetOrder=0;//0�̓V�[�g�S�́A���̂ق��͉����珇��
if(myTarget.activeLayer.parent.typename!="Document"){
	for (var tlIx=0;tlIx<myTarget.layers.length;tlIx++){
		if(myTarget.layers[tlIx]==myTarget.activeLayer.parent){var myTargetOrder=(myTarget.layers.length-tlIx);break;}
	}
}
//�h�L�������g�̓K�p�Ώۃ��C�����ƃV�[�g�̃^�C�����C�����̂��������������Ƃ��ăL���[�z����r���h����
//�^�C���V�[�g����t���[����(�J���łȂ�)���L���̏ꍇ�́A�X�L�b�v�R�[�h�𖄂߂�
var myTRs=new Array();
myTrCounts=(XPS.layers.length<myTarget.layers.length)? XPS.layers.length:myTarget.layers.length;
for(var idx=0;idx<myTrCounts;idx++){
	if(XPS.xpsBody[idx+1][0]==""){
		myTRs.push(-1);
	}else{
		if((myTargetOrder==0)||((idx+1)==myTargetOrder)){myTRs.push(idx+1)}else{myTRs.push(-1)}
	}
}
//alert(myTRs.toString());//�m�F�p
/*
	�h�L�������g�̑I����Ԃ��X�C�b�`�Ƃ��ē����؂�ւ���ׂ�
	���K�w��LayerSet�܂���ArtLayer��I�����Ă����ꍇ�̓V�[�g�S�̂̓K�p
	���K�w��LayerSet�܂���ArtLayer��I�����Ă����ꍇ�͓��Y�^�C�����C���̓K�p���s��
	�V�[�g���Ȃ��ꍇ�̓���͓����B
	myTRs���č\�����邱�ƂŎ���?
*/


		var myQueue=myTarget.buildPsQueue(XPS,myTRs);
		myTimeCount.check("buildQueue");
		//�擾����Queue����A�j���[�V�����t���[���֓]��
		//�\��������
		//�A�j���[�V�����e�[�u��������
//���ݏグ���L���[�������̏ꍇ�͎��Ԃ�������̂ł��̏�Ōx�����ď����X�L�b�v�ł���悤�ɂ���
	var doApply=true;
// alert("queue= "+ myQueue.length +": "+ myTimeCount.datas[3][1]);
	if((myQueue.length>50)||(myTimeCount.datas[3][1]>20000)){doApply=confirm("(�x���I)�K�p��1���ȏォ���邩������܂���B���s���܂����H");}

	if(doApply){
		//�A�j���E�B���h�E�����������遄�v����ɑS�ď���
        nas.axeAFC.initFrames();
		myTimeCount.check("clearFrames");
//==============================================================
		//���i�L�[�j�t���[����ݒ�
		var myIndex=myQueue[0].index;
		var myDuration=myQueue[0].duration/XPS.framerate;//�p���t���[�������Ԃɕϊ�
		myTarget.setView(myQueue[0]);
		setDly(myDuration);
		//���t���[���ȍ~�����[�v�ݒ�
		for(var idx=1;idx<myQueue.length;idx++){
		 dupulicateFrame();//���i�t�H�[�J�X�ړ��j
		 myDuration=myQueue[idx].duration/XPS.framerate;//�p���t���[�������Ԃɕϊ�
		 myTarget.setView(myQueue[idx]);
		 setDly(myDuration);
		}
	}else{alert("�����𒆒f���܂���")}

}else{
	//�^�[�Q�b�g��XPS�����݂��Ȃ��̂ŁA����̃h�L�������g�ɏ]���i�Ǝv����jXPS���J���Ő������ĕۑ�����
	//�\�Ȃ炻�̏�ŕҏW���j�b�g���R�[������
	var myDuration=72;//frames
	var myFps=nas.FRATE;
	XPS.init(myTarget.layers.length,myDuration);
	XPS.framerate=myFps;
	XPS.mapfile=myTarget.fullName.fsName;
	var mx=myTarget.layers.length;
	for(var lix=0;lix<mx;lix++){
		XPS.layers[lix].name=(myTarget.layers[mx-lix-1].name.replace(/\s/g,""));//name�ݒ莞��encoding�ݒ肵�ă��C��������󔒂��G�X�P�[�v���邱��
		XPS.layers[lix].sizeX=myTarget.layers[mx-lix-1].bounds[2].as("px")-myTarget.layers[mx-lix-1].bounds[0].as("px");
		XPS.layers[lix].sizeY=myTarget.layers[mx-lix-1].bounds[3].as("px")-myTarget.layers[mx-lix-1].bounds[1].as("px");
		XPS.layers[lix].lot=(myTarget.layers[mx-lix-1].layers)?myTarget.layers[mx-lix-1].layers.length:1;
	}
	if(confirm("�^�C���V�[�g������܂���B�V�K�ɍ쐬���ĕҏW���܂����H")){
//�ۑ����ā@�h�L�������g���Ăяo��
		myXpsFile.encoding="utf8"
		myXpsFile.open("w");
		myXpsFile.write(XPS.toString());
		myXpsFile.close();

		myXpsFile.execute();
	}
}
		myTimeCount.check("applyXPS");
		if (dbg){alert(myTimeCount.datas.toSource())};
}else{
	alert ("�h�L�������g��psd�`���ŕۑ����Ă��������B") 
}
//alert(XPS.toString())
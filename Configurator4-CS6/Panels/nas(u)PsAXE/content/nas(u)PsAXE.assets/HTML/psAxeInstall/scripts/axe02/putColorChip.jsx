/*
�J���[�I�[�_�[�{�b�N�X
�F�w��p�̘g�����UI���X�N���v�g
�e�L�X�g�Ŗ��O�Ɠ����ƑO�i�F�ŃJ���[�`�b�v��`���ď㉺�Ƀ_�~�[�`�b�v������B
�X�[�p�[�b���	2008/02/03

*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
	var exFlag=true;
//���������h�L�������g���Ȃ���ΏI��
	if(app.documents.length==0){exFlag=false;}
if(exFlag){

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
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	}
includeLibs.push(nasLibFolderPath+"fakeAE.js");
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

//���l�Ȃ̂ł��ׂă|�C���g�w��
/*
	selection.select()��point�w��݂̂Ȃ̂ł��̑O�Ŋ��Z���K�v
	�f�t�H���g�𖄂ߍ���ŁAUI�ŃT�C�Y�̂ݕύX���g
	2 x 1.5 cm(w/h) �ʂ�?
	Document.selection.select()���\�b�h�̓}�j���A���Ƀ|�C���g�w�肾�Ə����Ă��邯�ǁA
	���ۂ�px�Ȃ̂Œ���(CS2)
*/
var targetLayer	=(app.activeDocument.activeLayer)?app.activeDocument.activeLayer:app.activeDocument.layers[0];
var myDPC	=app.activeDocument.resolution/2.54;
var boxNum	=3;//�{�b�N�X���� 3(Hi/�m�[�}��/1��)
var boxWidth	=2;//�T�C�Y�́A�Ƃ肠����[cm]
var boxHeight	=1.5;
var colorReverse =true;//���F�̔��]�t���O(RGB���]�Ȃ̂Ŗ��Â����])
//�����ʒu�̓Z���N�V����������΂��̍���A�����ꍇ�́A�A�N�e�B�u�h�L�������g�̒���
var myPoint=div([app.activeDocument.width.as("px"),app.activeDocument.height.as("px")],2);//��ʒ���

/*	�Ƃ肠�����p�X���̂Ƃ���o���ʒu�͒����Œ�
�܂��A�I��͈̗͂L�閳���́A���̃��[�`���Ŏ擾�ł��Ȃ��P�[�X������(��̎d�l�ύX�̗]�g���ۂ����E�����U�Ȃ̂Ŗ����͋֕�)
 function checkSelection(){var flag = true;try {activeDocument.selection.translateBoundary(0,0);}catch(e){flag = false;}return flag;}

if (checkSelection())
{
	alert(app.activeDocument.selection.bounds.toString());//�擾�ł��Ȃ��P�[�X���������B����[
//����[���Ȃɂ��S�R�擾�ł��Ȃ�?�Ȃ񂾂����?
}
 */

if(app.activeDocument.selection)
var centerColor=new Array();
centerColor[0]=app.foregroundColor.rgb.red;
centerColor[1]=app.foregroundColor.rgb.green;
centerColor[2]=app.foregroundColor.rgb.blue;


function drawColorBox(boxName,myPoint,boxWidth,boxHeight,boxNum){

/*
	�h�L�������g�̃o�E���f�B���O�{�b�N�X�𒴂���Ɛ��l�̔��]���������Ă�����ۂ�
	UI����ł͂����Ȃ��^�C�v�̑���ł͂��Ȃ�M���x(�Ή�)���Â��J���W
������̑O�ɊT���v�Z�������Ȃ�
�w��ʒu�͕`��͈͂̒��S�ɂ���
�͂ݏo���ɂ����S�ȑΉ��ɂ���ׂɂ́A�ʃh�L�������g�ŏ����ăy�[�X�g���������ǂ�����
2008/02/03
*/
var fontSize=boxHeight*(0.6);
var myMargin=6;
var myWidth	=boxWidth;
var myHeight	=(boxHeight*boxNum)+fontSize+myMargin;
var myLineColor=new SolidColor();
	myLineColor.rgb.red	=0;
	myLineColor.rgb.green	=0;
	myLineColor.rgb.blue	=0;

//	�������L��(�e�L�X�g���C�����ǂ��E�t�H���g�͌��݂̃t�H���g�T�C�Y�̂ݒ���)
//	�`�b�v���C���ƃ����N�����鎖
	var myTextLayer=app.activeDocument.artLayers.add();
		myTextLayer.kind=LayerKind.TEXT;
		myTextLayer.textItem.contents=boxName;//�e�L�X�g�}��
		myTextLayer.textItem.font="Heisei Kaku Gothic Std W5";//�t�H���g�ݒ�
var myFontSize=Math.floor(72*(boxHeight/2)/app.activeDocument.resolution);
		myTextLayer.textItem.size=myFontSize;//�t�H���g�T�C�Y�ݒ�|�C���g
	//�o�O�����������ꍇ�w��|�C���g���ƈقȂ�f�[�^���Ԃ�̂ł���𔻒�
if (Math.round(myTextLayer.textItem.size.as("point"))!=myFontSize){
  nas.PSCCFontSizeFix.setFontSizePoints( myTextLayer, myFontSize);//
};
		nas.PSCCFontSizeFix.setFontSizePoints(myTextLayer,Math.floor(72*(boxHeight/2)/app.activeDocument.resolution));//�t�H���g�T�C�Y�ݒ�|�C���g
		myTextLayer.textItem.justification=Justification.CENTER;//�t�H���g�z�u�ݒ�
		myTextLayer.textItem.color=myLineColor;//�t�H���g�J���[�ݒ�
		myTextLayer.textItem.position=[new UnitValue(myPoint[0],"px"),new UnitValue(myPoint[1]+myHeight/2,"px")];//�t�H���g�ʒu�ݒ�

//	�J���[�`�b�v�쐬
//	�V�������C������ō쐬���āA���O���������

	var newColorChips=app.activeDocument.artLayers.add();
		newColorChips.name=boxName;

	for (var boxCount=0;boxCount<boxNum;boxCount++){

		var myPosition=sub(add(myPoint,[0,boxHeight*boxCount]),[myWidth/2,myHeight/2]);
		var myRegion=[
			myPosition,
			add(myPosition,[boxWidth,0]),
			add(myPosition,[boxWidth,boxHeight]),
			add(myPosition,[0,boxHeight])
		];


//			�Z���N�g���쐬
		app.activeDocument.selection.select(
			myRegion,
			SelectionType.REPLACE,
			0.0,
			false
		);
//�h�F�́A�`��F����v�Z�������F�ō��B���ƂŒu���ւ����K�v
		var centerNo	=Math.ceil(boxNum/2)-1;
		var colorParam	=Math.abs(centerNo-boxCount);
		if(boxCount==centerNo){
			myColor=centerColor;

		}else{
			if(boxCount<centerNo){
				myColor=add(centerColor,mul(sub([255,255,255],centerColor),colorParam/(centerNo+1)));
			}else{
				myColor=div(centerColor,Math.pow(1.2,colorParam));
			}
		};
//			fill
		var fillColor=new SolidColor();
//alert(myColor.toString());
//���F�Ȃ̂ł���ȏ�͂��Ȃ��B��������Ƃ�����O���[��

if((boxCount!=centerNo)&&(colorReverse)){
			fillColor.rgb.red	=255-myColor[0];
			fillColor.rgb.green	=255-myColor[1];
			fillColor.rgb.blue	=255-myColor[2];
}else{

			fillColor.rgb.red	=myColor[0];
			fillColor.rgb.green	=myColor[1];
			fillColor.rgb.blue	=myColor[2];
}
		app.activeDocument.selection.fill(
			fillColor,
			ColorBlendMode.NORMAL,
			100,
			false
		);
//�m�[�}���}�[�N������(���ŃX�g���[�N���Ă���)
		if(boxCount==centerNo){
			var backupColor=app.foregroundColor;
		app.activeDocument.selection.stroke(
			myLineColor,
			0.03*myDPC,
			StrokeLocation.INSIDE,
			ColorBlendMode.NORMAL,
			100,
			false
		);
			app.foregroundColor=backupColor;//�X�g���[�N�͑O�i�F������������
		}
	}
//	�J���[�`�b�v�ƃ��x���������N
		myTextLayer.link(newColorChips);//�����N�쐬
		;//
//	selection����
	app.activeDocument.selection.deselect();
//	�ł������C���͑I������Ă������C���̏�Ɉړ�
		myTextLayer.move(targetLayer,ElementPlacement.PLACEBEFORE);
		newColorChips.move(myTextLayer,ElementPlacement.PLACEBEFORE);

};//


//drawColorBox("������",myPoint,boxWidth*myDPC,boxHeight*myDPC,boxNum);
/*
	GUI������
�{�^��/2��
�e�L�X�g/4��

*/
//���͂𐔒l�Ɍ���
clipNum=function(){
	if(isNaN(this.text)){this.text=this.baseValue.toString()}else{
		this.text=(this.text*1).toString();
	}
};
//���͂𐮐��Ɍ���
clipInt=function(){
	if(isNaN(this.text)){this.text=this.baseValue.toString()}else{
		this.text=Math.floor(this.text*1).toString();
	}
};
//	Window
var w=nas.GUI.newWindow("dialog","�F�w��`�b�v�����",3,6);
//	TEXT
 w.tx1	=nas.GUI.addEditText(w,"(���̖���)",0,0,3,1);

 w.lb1	=nas.GUI.addStaticText  (w ,"BOX" ,0 ,1 ,1.5 ,1).justify="right";
	w.tx2	=nas.GUI.addEditText(w,boxNum,1.5,1,1,1);
	w.lb1u	=nas.GUI.addStaticText  (w ,"��" ,2.5 ,1 ,0.5 ,1);
	w.tx2.baseValue=boxNum;w.tx2.onChange=clipInt;

 w.lb2	=nas.GUI.addStaticText  (w ,"width" ,0 ,2 ,1.5 ,1).justify="right";
	w.tx3	=nas.GUI.addEditText(w,boxWidth,1.5,2,1,1);
	w.lb2u	=nas.GUI.addStaticText  (w ,"cm" ,2.5 ,2 ,0.5 ,1);
	w.tx3.baseValue=boxWidth;w.tx3.onChange=clipNum;

 w.lb3	=nas.GUI.addStaticText  (w ,"height" ,0 ,3 ,1.5 ,1).justify="right";
	w.tx4	=nas.GUI.addEditText(w,boxHeight,1.5,3,1,1);
	w.lb3u	=nas.GUI.addStaticText  (w ,"cm" ,2.5 ,3 ,0.5 ,1);
	w.tx4.baseValue=boxHeight;w.tx4.onChange=clipNum;

 w.cb1 =nas.GUI.addCheckBox (w,"���F���]",1,4,2,1);
	w.cb1.value=colorReverse;
	w.cb1.onClick=function(){
		colorReverse=this.value;
	}
 w.bt1	=nas.GUI.addButton(w,"OK",0,5,3,1);

w.bt1.onClick=function(){
//�ǂ������s�O�ɐ��l�̌��؂��K�v

	drawColorBox(
		this.parent.tx1.text,
		myPoint,
		this.parent.tx3.text*myDPC,
		this.parent.tx4.text*myDPC,
		this.parent.tx2.text*1
	);
this.parent.close();
}
w.tx1.active=true;
w.show();
}

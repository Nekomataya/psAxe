/* addNewDocument.jsx

	�f�t�H���g�̒l�ŐV�K�h�L�������g���쐬��ɔw�i���C����ʏ탌�C���ɕϊ�����
	IMDB�̓ǂݍ��ݏ����͂��Ƃ�
    �t���[���𓧉߂Q�O�� / �^�b�v�̕\�������� �X�C�b�`���݁@20140919
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop

// in case we double clicked the file
	app.bringToFront();

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
//	alert( "object nas exists" )
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
function checkSelection(){var flg = true;try {activeDocument.selection.translate(0,0);}catch(e){flg = false;};return flg;}
//�h�L�������g��񂩂�h�L�������g�����쐬����
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+nas.Zf(nas.axe.dmCurrent[1],2)+ "c" +nas.Zf(nas.axe.dmCurrent[2],3);
//var clipB=($.fileName.match(/addNewDocument/))? false:true;//�N���b�v�{�[�h���[�h���t�@�C�����Ŕ���
var clipB=true
//	�A�N�e�B�u�h�L�������g����I��͈͂��R�s�[
if(clipB){
if(checkSelection()){
    activeDocument.selection.copy(true);
}else{
    clipB=false;//�I��͈͂��Ȃ��̂Ń��[�h��ʏ�쐬��
}
}
if(nas.axe.dmDialog){
//�_�C�A���O���o�͂��ăh�L�������g�̎w��������擾
if(clipB){
	var w=nas.GUI.newWindow("dialog","�I��͈͂���V�K�h�L�������g���쐬",9,14,320,240);
}else{
	var w=nas.GUI.newWindow("dialog","�V�K�h�L�������g���쐬���܂�",9,14,320,240);
}
 w.lb0 = nas.GUI.addStaticText(w,"�t�@�C����",0,0,2,1);
// w.fileName= nas.GUI.addEditText(w,nas.incrStr(currentName),2,0,5,1);
 w.fileName= nas.GUI.addEditText(w,currentName,2,0,5,1);

 w.lb1 = nas.GUI.addStaticText(w,"����#.",0,1,2,.75);
 w.lb2 = nas.GUI.addStaticText(w,"CUT#.",2.25,1,2,.75);
 w.lb3 = nas.GUI.addStaticText(w,"( TIME )",4.5,1,2,0.75);

 w.opusNumber= nas.GUI.addEditText(w,nas.Zf(nas.axe.dmCurrent[1],2),0.75,1,1,1);
   w.opusInc= nas.GUI.addButton(w,"+",1.45 ,1,0.6,1);
   w.opusDec= nas.GUI.addButton(w,"-",1.75,1,0.6,1);

// w.cutNumber= nas.GUI.addEditText(w,nas.incrStr(nas.axe.dmCurrent[2].toString()),3,1,1,1);
 w.cutNumber= nas.GUI.addEditText(w,nas.axe.dmCurrent[2].toString(),3,1,1,1);
   w.cutInc= nas.GUI.addButton(w,"+" ,3.7 ,1,0.6,1);
   w.cutDec= nas.GUI.addButton(w,"-" ,4   ,1,0.6,1);

 w.timeText= nas.GUI.addEditText(w,nas.Frm2FCT(nas.FCT2Frm(nas.axe.dmCurrent[3]),3),5.5,1,1.5,1);
   w.secInc= nas.GUI.addButton(w,"+1",4.8  ,2,.75,1);
   w.secDec= nas.GUI.addButton(w,"-1",5.25,2,.75,1);
   w.frmInc= nas.GUI.addButton(w,"+6",5.8  ,2,.75,1);
   w.frmDec= nas.GUI.addButton(w,"-6",6.25,2,.75,1);

/*
    �X�^�[�g�A�b�v�v���p�e�B���݁@21040919
    �^�b�v�ƃt���[���̕\�������l
 */
w.pegBlend=nas.GUI.addCheckBox(w,"�^�b�v�����̐�Βl��",7,9,2,1);
    w.pegBlend.value=nas.axe.pegBlend;
w.pegBlend.onClick=function(){nas.axe.pegBlend=this.value};
w.frameOpc=nas.GUI.addCheckBox(w,"�t���[���𔼓�����",7,10,2,1);
    w.frameOpc.value=nas.axe.frameOpc;
w.frameOpc.onClick=function(){nas.axe.frameOpc=this.value};
// w.titleCB= nas.GUI.addEditText(w,nas.workTitles.names(0),nas.workTitles.selected,2,0,4,1);
�@w.imPanel=nas.GUI.addPanel(w,"���̈�",0,3,7,11); 

w.imPanel.lb0 = nas.GUI.addStaticText(w.imPanel,"�^�C�g���i�e���v���[�g�j:",0,0.5,2,1);
w.imPanel.selectTT=nas.GUI.addComboBox(w.imPanel,nas.workTitles.names(0),nas.workTitles.selected,2,0.5,4,1)

//w.imPanel.SP = nas.GUI.addStaticText(w.imPanel,"==================================================================================================================",0,1,2,1);
//====================================================
w.imPanel.lb1 = nas.GUI.addStaticText(w.imPanel,"�W���t���[��:",0,2,3,1).justify="right";
w.imPanel.selectIM=nas.GUI.addDropDownList(w.imPanel,nas.inputMedias.names(0),nas.workTitles.selectedRecord[3],3,2,4,1);

w.imPanel.lb2 = nas.GUI.addStaticText(w.imPanel,"�p�� :" ,0,3,3,1).justify="right";
w.imPanel.selectDP=nas.GUI.addDropDownList(w.imPanel,nas.paperSizes.names(0),nas.paperSizes.selected,3,3,4,1);

w.imPanel.lb3 = nas.GUI.addStaticText(w.imPanel,"�^�b�v:",0,4,3,1).justify="right";
w.imPanel.selectRM=nas.GUI.addDropDownList(w.imPanel,nas.registerMarks.names(0),nas.registerMarks.selected,3,4,4,1);

w.imPanel.lb4 = nas.GUI.addStaticText(w.imPanel,"�������[�N�Z�b�g(���C���Z�b�g):",0,5,3,1).justify="right";
w.imPanel.selectWS=nas.GUI.addDropDownList(w.imPanel,["�Ȃ�","�t���[���̂�","�t���[��+1(A)","�t���[��+2(A,B)","�t���[��+3(A,B,C)","�t���[��+4(A,B,C,D)"],3,3,5,4,1);

w.imPanel.lbWIDTH = nas.GUI.addStaticText(w.imPanel,"��:",1,6,2,1).justify="right";
w.imPanel.lbHEIGHT = nas.GUI.addStaticText(w.imPanel,"��:",1,7,2,1).justify="right";
w.imPanel.lbRESOLUTION = nas.GUI.addStaticText(w.imPanel,"�𑜓x:",1,8,2,1).justify="right";

w.imPanel.etWIDTH = nas.GUI.addEditText(w.imPanel,Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px")),3,6,2,1);
w.imPanel.etHEIGHT = nas.GUI.addEditText(w.imPanel,Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px" )),3,7,2,1);
w.imPanel.etRESOLUTION = nas.GUI.addEditText(w.imPanel,nas.Dpi(),3,8,2,1);

w.imPanel.pstWIDTH = nas.GUI.addStaticText(w.imPanel,"pixel",5,6,2,1);
w.imPanel.pstHEIGHT = nas.GUI.addStaticText(w.imPanel,"pixel",5,7,2,1);
w.imPanel.pstRESOLUTION = nas.GUI.addStaticText(w.imPanel,"dpi",5,8,2,1);

w.imPanel.lbx = nas.GUI.addStaticText(w.imPanel,"�f�[�^���[�h��RGB/8bit�[�x�Œ�ł��B",0,9,6,1);

//=========================
 w.okBt=nas.GUI.addButton(w,"OK",7,0,2,1);
 w.cnBt=nas.GUI.addButton(w,"�L�����Z��",7,1,2,1);
/*
 w.tsBt=nas.GUI.addButton(w,"�^�C�g����ۑ�",7,2,2,1).enabled=false;
 w.isBt=nas.GUI.addButton(w,"���̓��f�B�A��ۑ�",7,3,2,1).enabled=false;
*/
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
w.imPanel.etWIDTH.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px" ));
w.imPanel.etHEIGHT.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px" ));
w.imPanel.etRESOLUTION.text = nas.Dpi();//nas.inputMedias.selectedRecord[3];
}
//�p���Z���N�^�X�V�@�e�R���g���[���X�V���ăh�L�������g�����쐬
w.imPanel.selectDP.onChange=function(){
//alert(nas.RESOLUTION)
 nas.paperSizes.select(this.selection.index);
w.imPanel.etWIDTH.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[1]+"mm","px"));
w.imPanel.etHEIGHT.text = Math.round(nas.decodeUnit(nas.paperSizes.selectedRecord[2]+"mm","px"));
//w.imPanel.etRESOLUTION.text = nas.inputMedias.selectedRecord[3];
}
//�^�b�v�Z���N�^�X�V
w.imPanel.selectRM.onChange=function(){
 nas.registerMarks.select(this.selection.index);
}
//�t�@�C�����X�V�i����ʍs�Łj
w.fileName.update=function(){
var currentName=nas.workTitles.bodys[nas.axe.dmCurrent[0]][2]+this.parent.opusNumber.text+"c" +this.parent.cutNumber.text;
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

var myMsg="";
myMsg+="RGB:8bit/pxel" ;
myMsg+=nas.GUI.LineFeed;
myMsg+="=====";

 w.notice=nas.GUI.addStaticText(w,myMsg,7,5,2,4);

//�𑜓x�����ڕύX���ꂽ�ꍇ�Anas.RESOLUTION���X�V
 w.imPanel.etRESOLUTION.onChange=function(){
	if(isNaN(this.text)){
		this.text=nas.Dpi();return;
	}else{
		nas.RESOLUTION=this.text/2.540;
	}
 }
//=======================================�쐬
 w.okBt.onClick=function(){
  var myWidth=w.imPanel.etWIDTH.text+" px";
  var myHeight=w.imPanel.etHEIGHT.text+" px";
  var myResolution=w.imPanel.etRESOLUTION.text+" dpi";
  var myName=w.fileName.text;
  var myLayerCounts=w.imPanel.selectWS.selection.index;//�ϊ��T�{���Ă邯�ǃC���f�b�N�X�����C���Z�b�g��
//�w��̖��O�ŐV�����h�L�������g���쐬
  myNewDocument=app.documents.add(
	myWidth,myHeight,myResolution,myName,
	NewDocumentMode.RGB,DocumentFill.BACKGROUNDCOLOR,
	1,BitsPerChannelType.EIGHT,
  )
//�I�v�V�����ɂ��������ăh�L�������g�𐮌`

/* �A�j���[�V�������[�h���^�C�����C���Ȃ�t���[�����[�h�ɕϊ��@���[�v�𖳌��� */
if (nas.axeAFC.checkAnimationMode()!="frameAnimation"){
//==�A�j���t���[���쐬
var idmakeFrameAnimation = stringIDToTypeID( "makeFrameAnimation" );
executeAction( idmakeFrameAnimation, undefined, DialogModes.NO );
//==�������[�v��
var idsetd = charIDToTypeID( "setd" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idanimationClass = stringIDToTypeID( "animationClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref2.putEnumerated( idanimationClass, idOrdn, idTrgt );
    desc3.putReference( idnull, ref2 );
    var idT = charIDToTypeID( "T   " );
        var desc4 = new ActionDescriptor();
        var idanimationLoopEnum = stringIDToTypeID( "animationLoopEnum" );
        var idanimationLoopType = stringIDToTypeID( "animationLoopType" );
        var idanimationLoopForever = stringIDToTypeID( "animationLoopForever" );
        desc4.putEnumerated( idanimationLoopEnum, idanimationLoopType, idanimationLoopForever );
    var idanimationClass = stringIDToTypeID( "animationClass" );
    desc3.putObject( idT, idanimationClass, desc4 );
executeAction( idsetd, desc3, DialogModes.NO );

}
/*	�������C����w�i���C������ʏ탌�C���֕ϊ�	*/
var startupLayer=myNewDocument.layers[0];
startupLayer.isBackgroundLayer=false;

/*	���C���Z�b�g���쐬	*/
 if(myLayerCounts>0){
  var myWorkSets=[];
  for(var lys=0;lys<myLayerCounts;lys++){myWorkSets.push(myNewDocument.layerSets.add());myWorkSets[lys].name=["Frames","A","B","C","D","E","F","G","H","I","J","K","L" ][lys];};

if(myLayerCounts>1){startupLayer.move(myWorkSets[1],ElementPlacement.INSIDE)};
 }
	startupLayer.name="A001";
//�ړ��̕K�v�������[Frames]���ŏ�ʂ�
if(myLayerCounts>1){myWorkSets[0].move(app.activeDocument,ElementPlacement.PLACEATBEGINNING)};

//�t���[���Z�b�g�Ƀ��W�X�^�摜�ƃt���[����ǂݍ���(�t���[���Z�b�g���Ȃ��ꍇ�̓X�L�b�v)
var currentUnitBase=app.preferences.rulerUnits;//�T����
app.preferences.rulerUnits=Units.MM;
if(myLayerCounts>0){
//���W�X�^
  var myPegFile=new File(nasLibFolderPath+"resource/Pegs/" +nas.registerMarks.selectedRecord[1]);
  myPegLayer=nas.axeAFC.placeEps(myPegFile);
  myPegLayer.translate("0 px",-1*myPegLayer.bounds[1]);//��ӂւ͂���
  if(nas.axe.pegBlend){myPegLayer.blendMode=BlendMode.DIFFERENCE;};
  myPegLayer.name="peg";
  myPegLayer.move(myWorkSets[0],ElementPlacement.PLACEATEND);

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
  if(nas.axe.frameOpc){myFrameLayer.opacity=20;};
  myFrameLayer.name="frame";

//�e��e�L�X�g��z�u
var myTextLayer=myWorkSets[0].artLayers.add();//���C���ǉ�
var myTextOffsetX=(((myTextLayer.bounds[2]-myTextLayer.bounds[0])/2)+myTextLayer.bounds[0]).as("mm" );
var myTextOffsetY=(((myTextLayer.bounds[3]-myTextLayer.bounds[1])/2)+myTextLayer.bounds[1]).as("mm" );
  myTextLayer.kind = LayerKind.TEXT;//�e�L�X�g���C���ɕϊ�
  myTextLayer.textItem.contents = nas.workTitles.selectedRecord[1]+" #"+this.parent.opusNumber.text;
  myTextLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myTextLayer.bounds[0]).as("mm")+0)+" mm"),
	new UnitValue(((myPegLayer.bounds[3]-myTextLayer.bounds[1]).as("mm")+5)+" mm")
  );//�^�b�v�ʒu����ɒ���
var myCutLayer=myWorkSets[0].artLayers.add();//���C���ǉ�
  myCutLayer.kind = LayerKind.TEXT;//�e�L�X�g���C���ɕϊ�
  myCutLayer.textItem.contents = "c# "+this.parent.cutNumber.text;
  myCutLayer.translate(
	new UnitValue(((myPegLayer.bounds[0]-myCutLayer.bounds[0]).as("mm")+120)+" mm"),
	new UnitValue(((myPegLayer.bounds[3]-myCutLayer.bounds[1]).as("mm")+5)+" mm")
  );//�^�b�v�ʒu����ɒ���
//  myCutLayer.translate(new UnitValue(120+" mm"),new UnitValue(((myPegLayer.bounds[3]/2).as("mm"))+" mm"));//�^�b�v����̋�����
var myTimeLayer=myWorkSets[0].artLayers.add();//���C���ǉ�
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

//
  myFrameLayer.move(myWorkSets[0],ElementPlacement.PLACEATEND);
}
app.preferences.rulerUnits=currentUnitBase;//���A

	app.activeDocument.activeLayer=startupLayer;

//�����Ńy�[�X�g���Ĉʒu�𒲐�����
if(clipB){
  var myPicture=app.activeDocument.paste();
  myPicture.translate(new UnitValue("0 mm" ),new UnitValue(((myPegLayer.bounds[3]/2).as("mm")-myOffset)+" mm"));//�^�b�v����̋�����
}
//nas.axe.dmCurrent �X�V
	nas.axe.dmCurrent=[nas.workTitles.selected,this.parent.opusNumber.text,this.parent.cutNumber.text,this.parent.timeText.text];
if(bootFlag){nas.writePrefarence(["nas.axe","nas.RESOLUTION","nas.workTitles.selected","nas.registerMarks.selected"]);}
//alert(nas.axe.dmCurrent)
	this.parent.close();
};
 w.cnBt.onClick=function(){this.parent.close();};
/*
 w.tsBt.onClick=function(){;};
 w.isBt.onClick=function(){;};
*/
w.show();


}else{
var myExcute="";
//=============== �R�[�h


// =======================================================�V�K�h�L�������g�쐬
myExcute+="var id1 = charIDToTypeID(\"Mk  \");";
myExcute+="var desc1 = new ActionDescriptor();";
myExcute+="var id2 = charIDToTypeID(\"Nw  \");";
myExcute+=" var desc2 = new ActionDescriptor();";
myExcute+=" var id3 = stringIDToTypeID(\"preset\");";
myExcute+="   desc2.putString(id3,\"640 x 480\");";
myExcute+=" var id4 = charIDToTypeID(\"Dcmn\");";
myExcute+=" desc1.putObject( id2, id4, desc2 );";
myExcute+=" var A =executeAction( id1, desc1, DialogModes.ALL);";
myExcute+="var newDocumentRef =app.activeDocument;";
myExcute+="newDocumentRef.layers[0].isBackgroundLayer=false;";
myExcute+="newDocumentRef = null;" ;

//=================================�@Execute width Undo
//alert(myExcute);
//eval(myExcute);
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
//�t�@�C���̐V�K�쐬�Ȃ̂ŁAactiveDocument�����݂��Ȃ��P�[�X������B
//���̏ꍇ�G���[�g���b�v�ɂ������Ă��܂��̂ŃI�u�W�F�N�g�̗L���ł͂Ȃ��o�[�W�����m�F���s��
		eval(myExcute)
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

}



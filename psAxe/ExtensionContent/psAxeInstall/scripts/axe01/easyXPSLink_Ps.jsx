/*(���ݔ�XPS�����J)
 *
 *	Nekomataya/kiyo	2005.11.15
 *		XPS�V�[�g��AE�h�L�������g�W�V�����ɓK�p���܂��B
 *		�b�莎���łł��B[�ǂݍ��݂̂�]2006.05.11
 *	�o�O(Mac�̂�edittext�̕s��) �Ή�
 *	AE7��AERemap�̃V�[�g���ǂݍ��߂Ȃ������o�O�ɑΏ� 2006/11/12
 *		�ǂݍ��ݏ�Q�̑Ή���(���o�̂�)
 *	AE CS3 �J���Z���������ɃG���[��~���錻�ۂɑΏ�	2009/08/21
 * 	�����Z���̐������������^�X�̃Z���ɉ��Ή�	2009/08/21
 *	������XPS�I�u�W�F�N�g������΍ď��������Ȃ��悤�ɕύX
 *	�v���W�F�N�g���̃^�C���V�[�g�̓ǂݏ����ɕ����Ή�
 *	�i�����I�Ƀ^�C�����C���̂Ȃ����C���ɑ΂��鉼�^�C�����C���������j
 *	�V�[�g���v���W�F�N�g���ɕۑ�����@�\���������Ȃ̂ŃC���C���@�\�ǉ����@2009/10/10
 Photoshop�ɈڐA�@�Q�O�P�P�@�O�R
 �N�����������Ɍ��݃I�[�v������Ă���h�L�������g�̓����P�[�V�����ɂ���XPS(�̂�)���I�[�v�����ăX�g�A�Ɋi�[���邱�Ƃ�
 ������Ԃł̃A�N�e�B�u�h�L�������g���Z���N�^��ŃA�N�e�B�u�ɂ���B
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
	app.bringToFront();

//	���W���[�����ݒ�
var myFilename=("$RCSfile: easyXPSLink_Ps.jsx,v $").split(":")[1].split(",")[0];
var myFilerevision=("$Revision: 1.5 $").split(":")[1].split("$")[0];
var exFlag=true;
var moduleName="easyXPS";//���W���[�����Œu�������Ă��������B
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

//==================================================================main
var XPS=new Xps(4,72);
var isAdobe=true;
nas.XPSStore=new XpsStore();

			if(false){
//��d�������h�~�g���b�v
try{
	if(nas.Version)
	{	nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;
	
		try{
if(nas[moduleName]){
	nas[moduleName].show();
	exFlag=false;
}else{
nas[moduleName]=new Object();
}
		}catch(err){
nas[moduleName]=new Object();}
	}
}catch(err){
	alert("nas���C�u�������K�v�ł��B\nnasStartup.jsx �����s���Ă��������B");
	exFlag=false;
}
			}else{
//�f�o�b�O���͓�d�N���h�~�g���b�v�͎ז��Ȃ̂Ńp�X�B�t�B�b�N�X�������͓��ꊷ��
nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;
nas[moduleName]=new Object();
			}

if((app.documents.length)&&(exFlag)){
/*
	edittext�ɏ�����Ԃ�256�o�C�g�Ńy�[�X�g�����͂��ł��~�߂ɂȂ錻�ۂ�����B
	�X�N���v�g�ł̃f�[�^�ǉ����s���Ɠ��I�Ƀ��������m�ۂ���Ă���悤�Ȃ̂ŁA
	����́Aedittext�ɖ������󔒂�ǉ����ăt���b�V�����郁�\�b�h�B
	���̃o�O������������s�v�B	�����̓��[�v�񐔁B1��A�^��1kb
*/

//��p�}�b�v������
var MAP=new Map(3);
/*
	�����W���[��������
 */

//	alert(MAP.toSource());
//XPS������
//	��܂҂�݊��p�_�~�[�I�u�W�F�N�g
var MSIE=false;
var xUI=new Array();
	xUI.blmtd=BlankMethod;
	xUI.blpos=BlankPosition;
	xUI.timeShift=TimeShift;
	xUI.keyMethod=KEYMethod;
	xUI.aeVersion=AEVersion;
	xUI.fpsF=FootageFramerate;
	xUI.Selection=[0,0];
	xUI.spinValue=3;
	xUI.Select=[1,0];
	xUI.spin=function(sv){this.spinValue=(isNaN(sv))?this.spinValue:sv;};
//	xUI.put=function(stream){alert("put :"+ stream);};
	xUI.put=function(stream){
		for(lyrs=0;lyrs<stream.split("\n").length;lyrs++)
		{
			kyLyr=stream.split("\n")[lyrs].split(",");
			for(frms=0;frms<kyLyr.length;frms++)
			{
				if(lyrs<XPS.xpsBody.length && frms < XPS[0].length)
				{
					XPS[lyrs+1][frms]=kyLyr[frms];
				}
			}
		}
	};

/*
	xUI.=;
	xUI.=;
	xUI.=;
	xUI.=;
*/
//	var XPS=new Object();
//	XPS=new_XPS(SheetLayers,nas.FCT2Frm(Sheet));
//	MAP=new Map(SheetLayers);
//var XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
/*	�����グ����XPS�I�u�W�F�N�g�����łɑ��݂���ꍇ�́A���̃f�[�^�������p���̂ł����ł̏������͕s�v
	�v���W�F�N�g�̂w�o�r�o�b�t�@��nas�����グ���ɏ���������̂��]�܂����Ǝv����
 */
try{var myXPS=XPS}catch(err){
	XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
}
//	�_�~�[�}�b�v��^���ď���荞��

//XPS.getMap(MAP);


//�R���g���[�����XPS�f�[�^��XPS�I�u�W�F�N�g�ɓW�J �W�J��ɍď����o��

function updateXPS(){
XPSbody=nas.easyXPS.sheetView.text.replace(/(\r\n?|\n)/g,"\n");
	if(XPS.readIN(XPSbody)){
		nas.easyXPS.sheetView.clear();
//�ǂݍ��ݐ��������ꍇ�����R���g���[�����N���A(���������܂�)
		return true;
	}else{
		return false;
	}
}
function updateControl()
{
//���������XPS�f�[�^�𕶎���ŃR���g���[���ɔ��f

/*	�\�����V�[�g�T�}���[�ɕύX(��)
	if(isWindows){
nas.easyXPS.sheetView.text=XPS.toString().replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
	}else{
nas.easyXPS.sheetView.text=XPS.toString(";").replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
	}
*/
//var XPSSummary="nasTIME-SHEET 0.4"+nas.GUI.LineFeed;
var XPSSummary="#--- nas.XPSSummary (for TEST) ---#"+nas.GUI.LineFeed;
if(true)
{
XPSSummary+="TITLE\t:"+XPS.title+"\tOPUS\t:"+XPS.opus+nas.GUI.LineFeed;
XPSSummary+="SUB_TITLE\t:"+XPS.subtitle+nas.GUI.LineFeed;
XPSSummary+="SCENE/CUT\t:"+XPS.scene+"\t/\t"+XPS.cut+nas.GUI.LineFeed;
XPSSummary+="TIME\t:(\t"+XPS.getTC(XPS.time())+"\t)"+nas.GUI.LineFeed;
XPSSummary+="TRIN\t:"+XPS.trin.toString()+"\t/TROUT\t:"+XPS.trout.toString()+nas.GUI.LineFeed;
XPSSummary+="FRAME_RATE\t:"+XPS.framerate+" fps"+nas.GUI.LineFeed;
XPSSummary+="CREATE_USER\t:"+XPS.create_user+nas.GUI.LineFeed;
//XPSSummary+="UPDATE_USER\t:"+XPS.update_user+nas.GUI.LineFeed;
XPSSummary+="CREATE_TIME\t:"+XPS.create_time;
//XPSSummary+="UPDATE_TIME\t:"+XPS.update_time+nas.GUI.LineFeed;
//	���C���ʃv���p�e�B���X�g���[���ɒǉ�
	var Lprops=["option","link","name"];
	for (prop in Lprops)
	{
		var propName=Lprops[prop];
		var lineHeader=(propName=="name")? 
		nas.GUI.LineFeed+'[CELL\tN' : nas.GUI.LineFeed+'[' + propName + '\t';
		XPSSummary+=lineHeader;
	for (id=0;id<XPS.layers.length;id++)
	{
		XPSSummary+="\t"+XPS["layers"][id][propName];
	}
	XPSSummary+='\t]';//
		}
XPSSummary+="=============================================== memo:"+nas.GUI.LineFeed;
XPSSummary+=XPS.memo.replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
}else{
XPSSummary+="##MAPPING_FILE="+XPS.mapfilr+nas.GUI.LineFeed;
XPSSummary+="##TITLE="+XPS.title+nas.GUI.LineFeed;
XPSSummary+="##SUB_TITLE="+XPS.subtitle+nas.GUI.LineFeed;
XPSSummary+="##OPUS="+XPS.opus+nas.GUI.LineFeed;
XPSSummary+="##SCENE="+XPS.scene+nas.GUI.LineFeed;
XPSSummary+="##CUT=" +XPS.cut+nas.GUI.LineFeed;
XPSSummary+="##TIME="+XPS.getTC(XPS.time())+nas.GUI.LineFeed;
XPSSummary+="##TRIN="+XPS.trin.toString()+nas.GUI.LineFeed;
XPSSummary+="##TROUT="+XPS.trout.toString()+nas.GUI.LineFeed;
XPSSummary+="##CREATE_USER="+XPS.create_user+nas.GUI.LineFeed;
XPSSummary+="##UPDATE_USER="+XPS.update_user+nas.GUI.LineFeed;
XPSSummary+="##CREATE_TIME="+XPS.create_time+nas.GUI.LineFeed;
XPSSummary+="##UPDATE_TIME="+XPS.update_time+nas.GUI.LineFeed;
XPSSummary+="##FRAME_RATE="+XPS.framerate+nas.GUI.LineFeed;
	XPSSummary+="####################################"
//	���C���ʃv���p�e�B���X�g���[���ɒǉ�
	var Lprops=["sizeX","sizeY","aspect","lot","blmtd","blpos","option","link","name"];
	for (prop in Lprops)
	{
		var propName=Lprops[prop];
		var lineHeader=(propName=="name")? 
		nas.GUI.LineFeed+'[CELL\tN' : nas.GUI.LineFeed+'[' + propName + '\t';
		XPSSummary+=lineHeader;
	for (id=0;id<XPS.layers.length;id++)
	{
		XPSSummary+="\t"+XPS["layers"][id][propName];
	}
	XPSSummary+='\t]';//
		}
XPSSummary+=nas.GUI.LineFeed+"[END]"+nas.GUI.LineFeed;
XPSSummary+=XPS.memo.replace(/(\r\n?|\n)/g,nas.GUI.LineFeed);
}
nas.easyXPS.sheetView.text=XPSSummary;

	nas.easyXPS.sheetView.chgFlag=false;

//edFlag=(nas.easyXPS.sheetView.chgFlag)?"��":"�@";//"\["+edFlag+"\] : "+
//nas.easyXPS.XPSTLSelector.text=[XPS.title,XPS.opus,XPS.subtitle,XPS.scene,XPS.cut].join("/");//�{�^��������
//nas.easyXPS.XPSTLSelector.enabled=(nas.easyXPS.sheetView.chgFlag)?true:false;
nas.easyXPS.updateButton.text=XPS.getIdentifier();//�{�^��������
nas.easyXPS.updateButton.enabled=(nas.easyXPS.sheetView.chgFlag)?true:false;
//�Z���N�^�̔z�񏑂������B
var newOptions=new Array();
newOptions.push("<no-select>");
newOptions.push("[BG/BOOK]");
for (idx=0;idx<XPS.layers.length;idx++){newOptions.push(XPS.layers[idx].name);};
	for (idx=0;idx<5;idx++){
	nas.easyXPS.LayerLink[idx].Button.text="<no-select>";
	nas.easyXPS.LayerLink[idx].Button.options=newOptions;
	}
}
//�����N�掩������
function guessLink(string)
{if(XPS.layers.length){
//BG/LO/���X�L�b�v
	if(string.match(/(^[-_].*|bg|lo|book)/i)){return 1;}

//����(���S��v�͂�߂��@�`����v�Ō��̕�����͎�ɐ��l�Ƃ��ċ��e)
	for (Xid=0;Xid<XPS.layers.length;Xid++){
		var Label=new RegExp("^"+XPS.layers[Xid].name+".*$","i");
	if(string.match(Label)){return(Xid+2);}
	}
	return 0;
}else{return 0;}}
//���C�������N
function goLink()
{
//����Ώۃh�L�������g���Ȃ��Ƃ��̓��^�[��
	if(nas.easyXPS.DocSelector.selected<=0){return false;};
//����Ώۃh�L�������g�擾
		var selectedDocId=nas.easyXPS.DocSelector.value.match(/\[\s(\d+)\s\]/)[1]*1;
		app.activeDocument=app.documents[selectedDocId];
//�ȉ��őI���h�L�������g�̃A�j���t���[�����r���h
	app.activeDocument.buildPsQueue=_buildPsQueue;
	app.activeDocument.setView=_setView;
	var myTimlineOrder=new Array();
	for(var tix=nas.easyXPS.lyrSelector.Links.length-1;tix>=0;tix--){
		myTimlineOrder.push((nas.easyXPS.lyrSelector.Links[tix]==1)?-1:nas.easyXPS.lyrSelector.Links[tix]-1);
		//timelineID=0
	}
	var ffo=nas.easyXPS.ffoButton.value;
	var myQF=app.activeDocument.buildPsQueue(XPS,myTimlineOrder,ffo);
	
		//�\��������
		//�A�j���[�V�����e�[�u��������
		//�A�j���E�B���h�E�����������遄�v����ɑS�ď���
		dupulicateFrame();//��������čŒ�Q�̃t���[���ɂ���i�G���[����j
		selectFramesAll();//�S�I��
		removeSelection();//�폜
//==============================================================
		//���i�L�[�j�t���[����ݒ�
		var myIndex=myQF[0].index;
		var myDuration=myQF[0].duration/XPS.framerate;//�p���t���[�������Ԃɕϊ�
		app.activeDocument.setView(myQF[0]);
		setDly(myDuration);
		//���t���[���ȍ~�����[�v�ݒ�
		for(var idx=1;idx<myQF.length;idx++){
			dupulicateFrame();//���i�t�H�[�J�X�ړ��j
		myDuration=myQF[idx].duration/XPS.framerate;//�p���t���[�������Ԃɕϊ�
		app.activeDocument.setView(myQF[idx]);
		setDly(myDuration);
		}
	//���t���[���ֈړ�
	selectFrame(1);
/*�I���h�L�������g�����C�Y���铮��́A�Z���N�^�̕ύX���ɏ�����*/

}

//�t�@�C������V�[�g�ǂݍ���()
function getSheet(sheetFile)
{
	var myContent="";
	if(sheetFile){
		var myOpenfile = new File(sheetFile.fsName);
		myOpenfile.encoding="UTF8";
		myOpenfile.open("r");
		myContent = myOpenfile.read();
//		alert(myContent);
		if(myContent.length==0){alert("Zero Length!");}
		myOpenfile.close();

			if(XPS.readIN(myContent)){return true;
		}else{alert(XPS.errorMsg[XPS.errorCode]);return false;};

	}else{
		if(isWindows)
		{
			var mySheetFile = File.openDialog("�ǂݍ��ރ^�C���V�[�g��I��ł�������","timeSheetFile(*.xps;*.ard;*.tsh;*.sts):*.XPS;*.ard;*.tsh;*.sts");
		}else{
			var mySheetFile = File.openDialog("�ǂݍ��ރ^�C���V�[�g��I��ł�������","");
		}
		if (! mySheetFile){return false;};
		if (mySheetFile.name.match(/^[a-z_\-\#0-9]+\.(xps|ard|tsh|sts)$/i))
		{
			var myOpenfile = new File(mySheetFile.fsName);
			myOpenfile.open("r");
			if (mySheetFile.name.match(/\.sts$/i))
			{
				myContent = STS2XPS(myOpenfile).replace(/(\r\n?|\n)/g,"\n");
			}else{
				myOpenfile.encoding="UTF8";
				myContent = myOpenfile.read();
			}
			myOpenfile.close();
			
			if(XPS.readIN(myContent))
			{
				if(! isNaN(nas.XPSStore.getLength())){
					nas.XPSStore.select(0)
				}
				updateControl();
				nas.easyXPS.XPSTLSelector.init();
			}else{
				alert(XPS.errorMsg[XPS.errorCode]);
			};
	return true;
		}else {
	alert("�^�C���V�[�g�t�@�C����I�����Ă��������B")
	return false;
		};
	}
}

//�V�[�g�����o��
function saveSheet()
{
if (! nas.easyXPS.sheetView.text){alert("�ۑ�����f�[�^������܂���");return false;}
if(isWindows)
{
	var mySavefile = File.saveDialog("�����o���̃t�@�C�������w�肵�Ă�������","nasXPSheet(*.xps):*.XPS");
}else{
	var mySavefile = File.saveDialog("�����o���̃t�@�C�������w�肵�Ă�������","");
}
if(! mySavefile){return};
if(mySavefile.exists)
{
if(! confirm("�����̃t�@�C�������łɂ���܂�.\n�㏑�����Ă�낵���ł���?")){return false;};
}

if (mySavefile && mySavefile.name.match(/^[a-z_\-\#0-9]+\.xps$/i)){
var myOpenfile = new File(mySavefile.fsName);
	myOpenfile.open("w");
	myOpenfile.write(XPS.toString());
//	myOpenfile.write(nas.easyXPS.sheetView.text);
	myOpenfile.close();
}else {
	alert("�^�C���V�[�g�t�@�C����I�����Ă��������B")
	return false;
};
}
//�v���W�F�N�g����V�[�g�ǂݍ���()
function popSheet()
{
	if(nas.XPSStore.getLength())
		{
			if(! nas.XPSStore.toString()){nas.XPSStore.setBody();}
			if(confirm ("XPSStore����V�[�g���擾���܂�")){var myIndex=nas.XPSStore.pop();nas.otome.writeConsole("poped XPSStore:"+myIndex+" : "+nas.XPSStore.selected.name)};
			return;
		}
}

//�v���W�F�N�g�ɃV�[�g�����o��
function pushSheet()
{
	if(! isNaN(nas.XPSStore.getLength()))
	{
		if(! nas.XPSStore.toString()){nas.XPSStore.setBody();}
		if(confirm ("XPSStore�ɃV�[�g��(����)�ۑ����܂�\n�ύX���Ȃ���Ή������܂���")){nas.XPSStore.push();}
		return;
	}
}
/*
 *	���ݕҏW���̃v���W�F�N�g���X�L��������
 *	�K�v�ȏ�����肷��T�u�v���V�W��
 *
 *	�߂�l�̓I�u�W�F�N�g
 *		���\�[�X���p�̂��߁AAE�v���W�F�N�g���g�����ĉ����^�O���Ԃ牺����B
 *		�����^�O�́A�\�Ȃ珉�������_�ŁA�_���ł��K�v�ɂȂ邽�сB
 *
 */
//�O���[�o���I�u�W�F�N�g ���݂̃v���W�F�N�g�̏�Ԃ��L�^����
	var thisProject = new Object();

function checkComp()
{
	if (app.documents.length==0) {
		//�J���Ă���v���W�F�N�g������
		alert("no documents open");return false;
	}else{
//		thisProject������
		thisProject.documents	=new Array();
		for(var docIndex=0;docIndex<app.documents.length;docIndex++){
			thisProject.documents.push(app.documents[docIndex]);
//			app.documets[docIndex].index=docIndex;//����p��index����
		}
	}
return true;
}
//
checkComp();
//�h�L�������g�z���̃^�C�����C�������̃��C���Z�b�g���X�L�������ă��C�����Ƃ̑�����Ԃ��i�V�[�g�t�����\���ǂ����̊ϓ_�j
//
function checkLayer()
{
	for (var idx=0;idx<thisProject.documents.length;idx++){
		thisProject.documents[idx].isStill=new Array();
		for(Lid=1;Lid<=thisProject.documents[idx].layers.length;Lid++){
//�e�h�L�������g��i�ڂ̃g���[���[�̂݌��� �������C���ȊO�͗L��
//isComp/Footage?
/*	���C���\�[�X�ɂ�镪��
	Layer.source.type
				Comp/Footage
	Layer.source.mainSource.type
				Footage.solidSource
				Footage.fileSource(movie)
				Footage.fileSource(stil)
 */
		thisProject.documents[idx].isStill.push();
		}
	}
}

//�h�L�������g�Z���N�^������(�h�L�������g�T�[�`���ăI�v�V�����̍ăZ�b�g)
function initDocSelector_(){
	thisProject.documents=app.documents//�I��Ώۂ̃A�C�e����S���o
//
		new_options=new Array();
		new_options.push("<�h�L�������g�I��>");//���ۉ����\�[�X����
//		var currentEntry=0;
			for (idx=0;idx<thisProject.documents.length;idx++){
					myEntry="\[\x20"+idx+"\x20\]\x20\x20"+thisProject.documents[idx].name;
					new_options.push(myEntry);
//					if(thisProject.documents[idx]===app.activeDocument){currentEntry=idx}
				}
//			if(thisProject.documents[idx] == app.project.activeItem){activeSelect=idx;};
			this.options=new_options;//�I�v�V�����Z�b�g
//			this.select(currentEntry);
	return;
}
//
function chgDocSelect_(){
	this.init();//�ď�����

	if (this.options.length<=1)
	{
		this.select(0);
		this.parent.lyrSelector.init();
		return;
	}else {
//�R�[�����_�̃h�L�������g����1�̏ꍇ�������őI��
//�R�[�����_�̃h�L�������g����2�ȏ�̏ꍇ�́A�I�v�V�����Z���N�^�ɑI��p�̔z���n���Ĉ�����1�����Ďg��

		var nextSelect=((this.selected+1)%this.options.length)?(this.selected+1)%this.options.length:1;
//			�D�L�����ǂƂ肠����0�X�L�b�v�őΏ�
//			var nextSelect=mySelection;
//			this.select(nextSelect);
			this.select(
				nas.GUI.selectOptions(
					this.options.slice(1,this.options.length),
					this.selected-1,
					this
				)+1
			);
			this.parent.lyrSelector.init();
			app.activeDocument=app.documents[this.selected-1];
			return;
	}
/*
	if (this.selected==0){
	}else{
		if(app.project==null){this.select(0);};
		this.select(1+(this.selected%(this.options.length-1)));
	}
//�h�L�������g��؂芷�����̂ŁA���C���Z���N�^���X�V
this.parent.lyrSelector.init();
*/
}
// GUI Setup
/*	��{�@�\�Ƃ������B�{�^��

*	�N���b�v�{�[�h�����o��
*	�N���b�v�{�[�h�ǂݍ���
���̂ӂ��͔p�~ �N���b�v�{�[�h����n�̃I�u�W�F�N�g�͂Ȃ�����
�댯������˂�

�t�@�C���I�[�v��
�ۑ�
*	���O��t���ĕۑ�(�ۑ��ő�p)

�t�B�[���h�N���A

�v���W�F�N�g�֕ۑ�
�v���W�F�N�g����ǂݏo��

�r���h
�^�C�~���O�擾

�V�[�g�I��
�h�L�������g�I��
���C���֘A�Â�
���C���Z���N�^�쐬>�X�N���[���o�[�̃v���p�e�B�ƃ��\�b�h�Ŏ���

*/
//------- GUI�ݒ�E�X�^�[�g�A�b�v -------
//�E�B���h�E�ʒu���X�g�A
	var myLeft=(nas.GUI.winOffset["easyXPS"])?
		nas.GUI.winOffset["easyXPS"][0]:nas.GUI.dafaultOffset[0];
	var myTop=(nas.GUI.winOffset["easyXPS"])?
		nas.GUI.winOffset["easyXPS"][1]:nas.GUI.dafaultOffset[1];

// window������
	nas.easyXPS= nas.GUI.newWindow("dialog","����XPS�����J nas(u) tools (Nekomataya/2011)",8,21,myLeft,myTop);
// �t�@�C���R���g���[��
	nas.easyXPS.loadButton=nas.GUI.addButton(nas.easyXPS,"�V�[�g�J��",0,1,2,1);
	nas.easyXPS.saveButton=nas.GUI.addButton(nas.easyXPS,"�V�[�g�ۑ�",2,1,2,1);
//	nas.easyXPS.saveAsButton=nas.GUI.addButton(nas.easyXPS,"SAVE as",4,1,2,1);
//	nas.easyXPS.clearSheetButton=nas.GUI.addButton(nas.easyXPS,"clearSheet",6,1,2,1);

//	nas.easyXPS.getCBButton=nas.GUI.addButton(nas.easyXPS,"getClipBoard",0,2,2,1);
//	nas.easyXPS.putCBButton=nas.GUI.addButton(nas.easyXPS,"putClipBoard",2,2,2,1);
	nas.easyXPS.readPjButton=nas.GUI.addButton(nas.easyXPS,"�X�g�A�Ǐo",4,1,2,1);
	nas.easyXPS.writePjButton=nas.GUI.addButton(nas.easyXPS,"�X�g�A����",6,1,2,1);
//���b�Z�[�W�E�F��
	nas.easyXPS.messageWell=nas.GUI.addStaticText(nas.easyXPS,"�V�[�g��ǂݍ��ނ��A�y�[�X�g���Ă�������",0,2.3,4,0.8)
//�V�[�g�X�V�{�^��
	nas.easyXPS.updateButton=nas.GUI.addButton(nas.easyXPS,"<sheetName>",4,2,4,1);
// �^�C���V�[�g�\��
	nas.easyXPS.sheetView=nas.GUI.addEditText(nas.easyXPS," ",0,3,8,7);
		nas.easyXPS.sheetView.addBuf=nas.GUI.addBuf_;
		nas.easyXPS.sheetView.multiline=true;
		nas.easyXPS.sheetView.backupText=" ";
		nas.easyXPS.sheetView.chgFlag=false;
		
nas.easyXPS.sheetView.clear= function ()
{this.text="";this.backupText="";this.chgFlag=false;};
nas.easyXPS.sheetView.onChange = function ()
{
		if(! this.chgFlag)
		{	this.chgFlag=true;
//edFlag=(nas.easyXPS.sheetView.chgFlag)?"��":"�@";//"\["+edFlag+"\] : "+
nas.easyXPS.updateButton.text=XPS.getIdentifier();//�{�^��������
nas.easyXPS.updateButton.enabled=(this.chgFlag)?true:false;

			this.backupText=this.text
		}else{
		};
};

// �V�[�g�Z���N�^
	nas.easyXPS.XPSTLSelector=nas.GUI.addSelectButton(nas.easyXPS,"[�@] <����>",0,0,10,8,1);

// �h�L�������g�Z���N�^
nas.easyXPS.DocSelector=nas.GUI.addSelectButton(nas.easyXPS,"<�t�@�C���I��>",0,0,11,8,1);
// �����N�u���E�U �_�~�[�f�[�^
	dummyLayers =new Array();
	dummyLayers=["","","","",""];
// �����N�u���E�U
	nas.easyXPS.LayerLink =new Array();

for (idx=0;idx<dummyLayers.length;idx++){
	nas.easyXPS.LayerLink[idx]=new Object();
	nas.easyXPS.LayerLink[idx].Button=nas.GUI.addSelectButton(nas.easyXPS,"<no-select>",0,0,12+idx,2,1);
	nas.easyXPS.LayerLink[idx].Button.options=["<no-select>","A","B","C","D","E","F"];
//	nas.easyXPS.LayerLink[idx].lyNames=nas.GUI.addEditText(nas.easyXPS,"===",2,12+idx,5.6,1);
	nas.easyXPS.LayerLink[idx].lyNames=nas.easyXPS.add("edittext",nas.GUI.Grid(2,12+idx,5.6,1,nas.easyXPS),dummyLayers[idx],{readonly:true});
}
// �X�N���[���o�[(���C���Z���N�^)
 	nas.easyXPS.lyrSelector=nas.GUI.addScrollBar(nas.easyXPS,0,0,0,7,12,5,"right");

// �Z���N�^ ���x��
nas.easyXPS.lb0=nas.GUI.addStaticText(nas.easyXPS,"(SHEET)",0,17,2,1);
nas.easyXPS.lb0.justify="center";
nas.easyXPS.lb1=nas.GUI.addStaticText(nas.easyXPS,"(LAYER)",2,17,5,1);
nas.easyXPS.lb1.justify="center";

// �����N�R�}���h�{�^��
	nas.easyXPS.linkButton=nas.GUI.addButton(nas.easyXPS,"�V�[�g���h�L�������g�֓K�p",0,18,4,1);
//	nas.easyXPS.readButton=nas.GUI.addButton(nas.easyXPS,"�h�L�������g����V�[�g���쐬",4,18,4,1);
//�t���t���[���I�v�V����
	nas.easyXPS.ffoButton=nas.GUI.addCheckBox(nas.easyXPS,"�S�t���[���o��",4,18,4,1);

//�X�g�A����
	nas.easyXPS.addSheet=nas.GUI.addButton(nas.easyXPS,"�X�g�A�ɒǉ�",0,19,2,1);
	nas.easyXPS.viewSheet=nas.GUI.addButton(nas.easyXPS,"�V�[�g�S�\��",2,19,2,1);
	nas.easyXPS.removeSheet=nas.GUI.addButton(nas.easyXPS,"�J�����g�V�[�g�폜",4,19,2,1);
	nas.easyXPS.infoSheet=nas.GUI.addButton(nas.easyXPS,"�V�[�g���",6,19,2,1);
	
//	�t�@���N�V�����{�^��
	nas.easyXPS.cluButton=nas.GUI.addButton(nas.easyXPS,"�o�b�t�@������",0,20,2,1);
	nas.easyXPS.clbButton=nas.GUI.addButton(nas.easyXPS,"�E�F������",2,20,2,1);
	nas.easyXPS.tstButton=nas.GUI.addButton(nas.easyXPS,"�ĕ\��",4,20,2,1);
	nas.easyXPS.closeButton=nas.GUI.addButton(nas.easyXPS,"close",6,20,2,1);

//GUI-FunctionSetup
//	�{�^���t�@���N�V��������t��
for (idx=0;idx<5;idx++){
//	nas.easyXPS.LayerLink[idx].Button.onClick=function(){alert(this.text);};
//		nas.easyXPS.LayerLink[idx].lyNames.justify="left";
	nas.easyXPS.LayerLink[idx].Button.id= idx;
	nas.easyXPS.LayerLink[idx].Button.onClick= function(){this.parent.lyrSelector.chgLink(this.id)};
}
//	��i�h�L�������g�֘A
//	nas.easyXPS.loadButton.onClick= function(){getSheet();nas.easyXPS.DocSelector.onClick();};
	nas.easyXPS.loadButton.onClick= function(){getSheet();nas.easyXPS.lyrSelector.init();};
	nas.easyXPS.saveButton.onClick= function(){saveSheet();};
//	nas.easyXPS.saveAsButton.onClick= function(){saveSheet();};
//	nas.easyXPS.clearSheetButton.onClick= function(){this.parent.sheetView.clear();};
//	nas.easyXPS.getCBButton.onClick=function(){alert("�܂��ł��B");};
//	nas.easyXPS.putCBButton.onClick=function(){alert("�܂������Ă܂���ł��B");};
	nas.easyXPS.readPjButton.onClick = function (){popSheet();nas.easyXPS.lyrSelector.init();updateControl();};
//	nas.easyXPS.readPjButton.enabled = false;
	nas.easyXPS.writePjButton.onClick = function (){pushSheet();};
//	nas.easyXPS.writePjButton.enabled = false;
	nas.easyXPS.updateButton.onClick = function (){
		if(this.parent.sheetView.chgFlag){if(updateXPS()){updateControl();}};
		//	nas.easyXPS.DocSelector.onClick();
			nas.easyXPS.lyrSelector.init();
	};

//	���i�R�}���h
//	nas.easyXPS.XPSTLSelector.onClick = function (){alert("temp")}

	nas.easyXPS.linkButton.onClick = function (){goLink();};
//	nas.easyXPS.readButton.onClick = function (){alert("�ł���Ƃ������");};
//	nas.easyXPS.readButton.enabled = false;

	nas.easyXPS.DocSelector.onClick = chgDocSelect_;
	nas.easyXPS.DocSelector.init = initDocSelector_;
//�@�X�g�A����
	nas.easyXPS.addSheet.onClick=function()
	{
		nas.XPSStore.add();
		this.parent.XPSTLSelector.init();
		updateControl();
	};
	nas.easyXPS.viewSheet.onClick=function()
	{
		this.parent.sheetView.text=XPS.toString()
	};
	nas.easyXPS.removeSheet.onClick=function()
	{
		if(nas.XPSStore.getLength()){
			nas.XPSStore.remove();
			this.parent.XPSTLSelector.init();
			updateControl();
			if(nas.otomeFEP.uiPanel){nas.otomeFEP.uiPanel.reloadInfo()}
		}else{
			alert("�^�C���V�[�g���X�g�A�ɂ���܂���")
		}
	};
	nas.easyXPS.infoSheet.onClick=function()
	{
		var myInfo=nas.XPSStore.getInfo();
		nas.easyXPS.sheetView.clear();
		nas.easyXPS.sheetView.text=["name:"+myInfo.name,"date:"+myInfo.modified,"size:"+myInfo.length].join(nas.GUI.LineFeed);
	};

//	���i�t�@���N�V�����{�^��
	nas.easyXPS.cluButton.onClick = function ()
	{
//var XPS=new Object();
	XPS=new Xps(SheetLayers,nas.FCT2Frm(Sheet));
//	�_�~�[�}�b�v��^���ď���荞��
	XPS.getMap(new Map(SheetLayers));
		updateControl();
	};
	nas.easyXPS.clbButton.onClick = function (){nas.easyXPS.sheetView.clear();};
	nas.easyXPS.tstButton.onClick = function (){updateControl();};
	nas.easyXPS.closeButton.onClick = function (){this.parent.close();};
// �h�L�������g�Z���N�^�Ƀh�L�������g��^���ď����ΏۂȂ炻�̃h�L�������g��I��
	nas.easyXPS.DocSelector.setDoc=function(myDoc)
	{
		if(! myDoc){return false;}
		for(var idx=0;idx<app.documents.length;idx++){
//			var myIndex=this.options[idx].match(/\[\s(\d+)\s\]/)[1]*1;
			if(myDoc===app.documents[idx]){
				this.select(idx+1);
				return true;
			}
		}
		return false;
	}
//	�V�[�g�Z���N�^������
{
	nas.easyXPS.XPSTLSelector.init=function()
	{
		var myOptions=new Array();
		myOptions.push("<<�@------------ no  selected ------------�@>>");//0��
		for(var idx=1;idx<=nas.XPSStore.getLength();idx++){
			var myXps=nas.XPSStore.get(idx);
			myOptions.push("[ "+idx+" ] "+[myXps.title,myXps.opus,myXps.subtitle,myXps.scene,myXps.cut].join("/"));
		}
		this.options=myOptions;
		if(nas.XPSStore.selected){this.select(nas.XPSStore.selected.index);}else{this.select(0);}
	}
	nas.easyXPS.XPSTLSelector.onChange=function()
	{
		nas.XPSStore.pop(this.selected);
		updateControl();
		this.parent.lyrSelector.init();
	}
}

//	���C���Z���N�^������
{
//5�i(�Œ�)���E������
//	var activeLayerLot=0;//�O���[�o�������� �ǂЁ[
//	nas.easyXPS.lyrSelector.Layers=new Array();//�N���A
//	nas.easyXPS.lyrSelector.Links=new Array();

nas.easyXPS.lyrSelector.init=function()
{
	if(this.parent.DocSelector.selected==0)
	{
		var activeLayerLot=0;
		this.Layers=new Array();//�N���A
		this.Links=new Array();
		this.minvalue=0;
		this.maxvalue=0;
		this.value=0;
		this.chgSRB();
	}else{
		var selectedDocId=this.parent.DocSelector.value.match(/\[\s(\d+)\s\]/)[1]*1;
//		var activeDoc=thisProject.documents[this.parent.DocSelector.selected-1];
		activeDoc=app.documents[selectedDocId];
//		alert(selectedLyId);
//		var activeLayerLot=thisProject.documents[selectedLyId].layers.length;
		activeLayerLot=activeDoc.layers.length;

		this.Layers=new Array(activeLayerLot);
		this.Links=new Array(activeLayerLot);
			for (idx=0;idx<activeLayerLot;idx++){
this.Layers[idx]="\[\x20"+(idx).toString()+"\x20\]\x20\x20"+activeDoc.layers[idx].name;
this.Links[idx]=guessLink(activeDoc.layers[idx].name);//�ڑ������N�𐄑��B�}�b�`�Ȃ����0�ŏ�����

			}
	this.minvalue=0;
	this.maxvalue=(activeLayerLot>5)?(activeLayerLot-5):0;
	this.value=(activeLayerLot>5)?(activeLayerLot-5):0;
//	this.activePoint=(activeLayerLot>5)?(activeLayerLot-5):0;
	this.chgSRB();
	}
};

	nas.easyXPS.lyrSelector.chgSRB=function()
{
for(idx=0;idx<5;idx++){
		if(idx<this.Layers.length){
	this.parent.LayerLink[idx].lyNames.text=this.Layers[idx+Math.round(this.value)];
	this.parent.LayerLink[idx].Button.select(this.Links[idx+Math.round(this.value)]);
		}else{
	this.parent.LayerLink[idx].lyNames.text="";
	this.parent.LayerLink[idx].Button.select(0);
		}
}
};
	nas.easyXPS.lyrSelector.onChange=function(){this.chgSRB()};

	nas.easyXPS.lyrSelector.chgLink=function(btid)
{//�{�^��������
	if((btid+this.value)< this.Layers.length){
//	this.parent.LayerLink[btid].Button.select("next");
	var myLocation=nas.GUI.screenLocation(this.parent.LayerLink[btid].Button);
	this.parent.LayerLink[btid].Button.select(nas.GUI.selectOptions(
		this.parent.LayerLink[btid].Button.options,
		this.parent.LayerLink[btid].Button.selected,
		this.parent.LayerLink[btid].Button
	));
	this.Links[btid+this.value]=this.parent.LayerLink[btid].Button.selected;
	}
};
}
//	�C�x���g�ݒ�
//	nas.easyXPS.sheetView.onChange = function (){alert("change");};
//	�E�B���h�E�ʒu�ۑ�
	nas.easyXPS.onMove=function(){
nas.GUI.winOffset["easyXPS"] =
[ nas["easyXPS"].bounds[0],nas["easyXPS"].bounds[1]];
	}
	
//	GUI�ݒ�I��/�\��

//			nas.easyXPS.show();

			nas.easyXPS.sheetView.addBuf(20);
//			nas.easyXPS.sheetView.text="<<��������>>";


//���R�͂킩��Ȃ���������Ԃ���256b�Ńy�[�X�g���ł��~�߂ɂȂ�̂ŃX�N���v�g������edittext�̊g���������Ă���܂��B20kb��
			updateControl();

//			nas.easyXPS.show();
}
//main
/*	Ps�ł͋N������XPSStore�����݂���̂Ŕ���͕s�v
		���݂̃h�L�������g�̃p�X�����񂵂ēǂݍ���œo�^
		�V�[�g�Z���N�^���X�V
		�A�N�e�B�u�h�L�������g�Ɠ��������P�[�V�����̃V�[�g������΂���Ƀt�H�[�J�X
 */

/* 
 *	nas-�J�����g�t�H���_�Ƀ^�C���V�[�g�����݂���΁A�ǂݍ���
	���N�G�X�g����E�f��(���C���t�b�e�[�W)����_�ɃV�[�g����������@�\
 *�������݂���ꍇ�́A�J�����g�t�H���_���Ɉ�v�������̂�����΂����
 *�Ȃ���΁A�V�X�e���\�[�g�œǂݍ��ށB(�����́A�ݒ�t�@�C�����ǂݍ���)
 *�Ή��t�H�[�}�b�g�� XPS/ARD/TSH/STS
 * STS�̂݃o�C�i���t�@�C���Ȃ̂œ���𕪊�
 **  �N�����ɃJ�����g�A�C�e�����h�L�������g�Ȃ�h�L�������g��I�����铮���ǉ�
 */
if((app.documents.length)&&(app.activeDocument.name.match(/.*\.psd$/i))){}
if(app.documents.length){
	var targetFolders=new Array();
	targetFolders.hasEntry=function(Fl){
		for(var ix=0;ix<this.length;ix++){if(Fl.fullName==this[ix].fullName){return true}};
		return false;
	}
	//�t�H���_�����j�[�N�J�E���g
	for(var fidx=0;fidx<app.documents.length;fidx++){
		//�d���t�H���_�E�t�@�C����ǂ݂��܂Ȃ�(�ύX��ɕۑ����Ă��Ȃ��t�@�C���͑ΏۊO�ɂȂ邪����͂���ł��傤���Ȃ�)
		if(app.documents[fidx].saved){
			if(! (targetFolders.hasEntry(app.documents[fidx].path)) ){targetFolders.push(app.documents[fidx].path)}
		}
	}

	//�t�H���_�����݂���ꍇ�́A����XPS�����炢
	for(var fidx=0;fidx<targetFolders.length;fidx++){
		var files = targetFolders[fidx].getFiles(); //����G���g���擾
			var mySheets=new Array();//�V�[�g�G���g��
		for(myEntry in files){
			if(files[myEntry].name.match(/.*\.(xps|ard|tsh|sts)/i)){mySheets.push(files[myEntry])};
		};
		if(mySheets.length)
		{	//�V�[�g����΁c�Ȃ���΃X�L�b�v
			//�ǂݍ��ݑΏۃV�[�g���i�炸�ɑS�ēǂݍ���ŃX�g�A��add����
			var currentXPSId=0
			for(myIx in mySheets){
				var myReadXPS=mySheets[myIx];
				//alert(myReadXPS.parent.fullName)
				if(getSheet(myReadXPS)){
				if(
					(myReadXPS.name.replace(/\..+$/,"")==app.activeDocument.name.replace(/\..+$/,""))&&
					(myReadXPS.parent.fullName==app.activeDocument.path.fullName)
				){
					currentXPSId=myIx+1;
				}
					nas.XPSStore.add()
				};				
			}
		}
	}
nas.XPSStore.select(currentXPSId)
updateControl();

//	�����グ���ɃA�N�e�B�u�A�C�e����I��������ԂŊJ�n����l�ɕύX
		nas.easyXPS.XPSTLSelector.init();
		nas.easyXPS.DocSelector.init();
		nas.easyXPS.DocSelector.setDoc(app.activeDocument);//�A�N�e�B�u�h�L�������g��I��
		nas.easyXPS.lyrSelector.init();
		
		nas.easyXPS.show();


//	�ǂݍ��ݕs�ǂ͖��Ώ�(07/04/02)
}else{
	var msg="�h�L�������g������܂���";
	alert(msg);
}



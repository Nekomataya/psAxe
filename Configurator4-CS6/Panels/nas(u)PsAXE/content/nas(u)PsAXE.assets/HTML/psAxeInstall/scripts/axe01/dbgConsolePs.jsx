/*(���R���\�[��)
//	Nekomataya/kiyo	2005.11.07
//	���s�R�[�h�����ǉ�	11.08
//	�t�@�C���ǂݍ��ݒǉ�	11.09
//	mac��ł̕\���̉��P�E�Ȉ�GUI���C�u���������@11.17
//	�����@11.23  ����ł���肩��
//	�ۑ��Ή����邱�Ƃɂ����B�ꉞ
//	���ł�Photoshop�Ή� inDesign�Ƃ�����CS�g�͂����ĂȂ��̂Ń��J���}�Z���B12/21
//	�����p�f�o�b�O�R���\�[���Ƃ��Đ������邱�Ƃɂ��܂����B2009/11/08
Axe �p����
	���̃R���\�[���́A���i�̃e�L�X�g�{�b�N�X�̓��e����eval()�Ŏ��s���āA
	��i�̃e�L�X�g�{�b�N�X�ɖߒl��\������ȈՃR���\�[���ł��B
	nas�I�u�W�F�N�g�̔z���ŃR���\�[�����b�Z�[�W����M����̂ŁAnas���݂̂œ���\�ł��B
	�R�[�h�̎�����r���h�̃f�o�b�O���ɂ����p���������B

	���i�R�}���h�̓ǂݍ��݂� �㉺�i�ʁX�̕ۑ����\�ł��B
	AE CS3�ȍ~�̃p�l���N���ɑΉ����Ă���܂��̂ŁA�p�l���g�p���������߂��܂��B
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
	}
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

try{if($.os)
	{
		var isWindows=($.os.match(/Windows/))?true:false;
		var doAction=true;
	}else{
		var isWindows=false;
		var doAction=true;
	};
	if(isWindows){var LineFeed="\x0d\x0a"}else{var LineFeed="\x0d"};
}catch(ERR){
	isWindows =true;
}
//��d�N���h�~�g���b�v
if(nas.axe.dbgConsole){
	if(confirm("���łɋN������Ă��܂��B\n�R���\�[���o�͂���M����̂œ�d�N���͋֎~����Ă��܂�\n���Z�b�g���܂���"))
	{
		if(nas.axe.dbgConsole.isDoc)
		{
			nas.axe.dbgConsole.resultBox.visible=false;
			nas.axe.dbgConsole.commandBox.visible=false;
			nas.axe.dbgConsole.actButton.visible =false;
			nas.axe.dbgConsole.cluButton.visible =false;
			nas.axe.dbgConsole.clbButton.visible =false;
			nas.axe.dbgConsole.loadButton.visible =false;
			nas.axe.dbgConsole.saveButton.visible =false;
			nas.axe.dbgConsole.writeButton.visible =false;
			alert("�p�l������čċN�����Ă�������")
			doAction=false;
		}else{
			nas.axe.dbgConsole.close();
			doAction=true
		}
		delete nas.axe.dbgConsole;
	}else{
		doAction=false;
	}
}

if(doAction){
/*
	edittext�ɏ�����Ԃ�256�o�C�g�Ńy�[�X�g�����͂��ł��~�߂ɂȂ錻�ۂ�����B
	�X�N���v�g�ł̃f�[�^�ǉ����s���Ɠ��I�Ƀ��������m�ۂ���Ă���悤�Ȃ̂ŁA
	����́Aedittext�ɖ������󔒂�ǉ����ăt���b�V�����郁�\�b�h�B
	���̃o�O������������s�v�B	�����̓��[�v�񐔁B1��A�^��1kb

	AE7.0 256�o�C�g�ł͂Ȃ��Ȃ��������o�O�ˑR�L��B����ɍ폜�����ɃL�[���͕s�S�ǉ�
	�������A�R���\�[���@�\�̓I���W�i���̃X�N���v�g�G�f�B�^������̂ŁA���̃c�[�����̂�
	������Ə�ԂȂ̂ŃA�b�v�f�[�g�͂��Ȃ�

	AE8(CS3) ��������炸�o�O���炯�B
	�肪��Ȃ̂ł��̃R���\�[������������炸����
	���x�́A�L�[�{�[�h������s�����͂ł��Ȃ��͗l?���[��
	
	���s�̓��͈͂ȉ��̃L�[���͂�
		[ctlr]+[Enter]	/Win
		[ctlr]+[M]	/Mac
*/
function getScript()
{
if(isWindows){
	var scriptfile = File.openDialog("�ǂݍ��ރX�N���v�g��I��ł�������","JSX-Script(*.jsx *.js):*.JSX;*.JS");
}else{
	var scriptfile = File.openDialog("�ǂݍ��ރX�N���v�g��I��ł�������");
}
if (scriptfile && scriptfile.name.match(/^[a-z_\-\#0-9]+\.jsx?$/i)){
	var myOpenfile = new File(scriptfile.fsName);
	myOpenfile.open("r");
	myContent = myOpenfile.read();
	return myContent.replace(/(\r\n?|\n)/g,LineFeed);
}else {return false;};
}
function addBuf_(KB)
{
	var xStr="";
	for(m=0;m<KB;m++){for(n=0;n<1024;n++) xStr+=" "};
	this.text +=xStr;
	this.text ="";
	return this.text;
};


function saveText(myText)
{
if (! myText.length){alert("�ۑ�����f�[�^������܂���");return false;}
if(isWindows)
{
	var mySavefile = File.saveDialog("�����o���̃t�@�C�������w�肵�Ă�������","File (*.js *.jsx *.txt):*.JS;*.JSX;*.TXT");
}else{
	var mySavefile = File.saveDialog("�����o���̃t�@�C�������w�肵�Ă�������","");
}
if(! mySavefile){return};
if(mySavefile.exists)
{
if(! confirm("�����̃t�@�C�������łɂ���܂�.\n�㏑�����Ă�낵���ł���?")){return false;};
}

if (mySavefile && mySavefile.name.match(/^[a-z_\-\#0-9]+\.(jsx?|txt)$/i)){
var myOpenfile = new File(mySavefile.fsName);
	myOpenfile.open("w");
	myOpenfile.write(myText);
	myOpenfile.close();
}else {
	alert("�g���q�� js/jsx/txt ���w�肵�Ă��������B")
	return false;
};
}
// GUI Setup
	var myWinsize=[512,480];	var myWinOffset=[239,40];
	
	//�������Ȉ�GUI���C�u����
	var leftMargin=12;
	var rightMargin=24;
	var topMargin=2;
	var bottomMargin=24;
	var leftPadding=8;
	var rightPadding=8;
	var topPadding=2;
	var bottomPadding=2;
	var colUnit=96;
	var lineUnit=24;
	var quartsOffset=(isWindows)? 0:4;
//�p�l���p nasGrid(Unit,Unit.pixel,pixel)
function nasGrid(col,line,width,height){
	left=(col*colUnit)+leftMargin+leftPadding;
	top=(line*lineUnit)+topMargin+topPadding;
	right=left+width-rightPadding;
	bottom=(height <= lineUnit)?top+height-bottomPadding-quartsOffset:top+height-bottomPadding;
		return [left,top,right,bottom];
}


if (app.name=="Adobe AfterEffects"){
if((app.version.split(".")[0]>7)&&(this instanceof Panel))
{
	nas.axe.dbgConsole= this;
	nas.axe.dbgConsole.isDoc= true;
}else{
	nas.axe.dbgConsole= new Window("palette","dbgConsole",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
	nas.axe.dbgConsole.isDoc= false;
}
//var nas.axe.dbgConsole= new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
// new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}else{
nas.axe.dbgConsole= new Window("dialog","dbgConsole",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}

/*	�E�B���h�E��GUI�p�[�c��z�u	*/
nas.axe.dbgConsole.titleLabel=nas.axe.dbgConsole.add("statictext",nasGrid(0,0,480,24),"���R���\�[�� nas(u) tools (Nekomataya/2011)",{multiline:false});nas.axe.dbgConsole.titleLabel.justify="right";

nas.axe.dbgConsole.resultBox=nas.axe.dbgConsole.add("edittext",nasGrid(0,1,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){nas.axe.dbgConsole.resultBox.addBuf=addBuf_;}

nas.axe.dbgConsole.commandBox=nas.axe.dbgConsole.add("edittext",nasGrid(0,10,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){nas.axe.dbgConsole.commandBox.addBuf=addBuf_;}

nas.axe.dbgConsole.cluButton=nas.axe.dbgConsole.add("button",nasGrid(0,9,96,24),"clearResult");
nas.axe.dbgConsole.actButton=nas.axe.dbgConsole.add("button",nasGrid(1,9,384,24),"evalCommand");
nas.axe.dbgConsole.writeButton=nas.axe.dbgConsole.add("button",nasGrid(4,9,96,24),"write");

nas.axe.dbgConsole.clbButton=nas.axe.dbgConsole.add("button",nasGrid(0,10,96,24),"clearCommand");
nas.axe.dbgConsole.loadButton=nas.axe.dbgConsole.add("button",nasGrid(3,10,96,24),"load");
nas.axe.dbgConsole.saveButton=nas.axe.dbgConsole.add("button",nasGrid(4,10,96,24),"save");

nas.axe.dbgConsole.btn00=nas.axe.dbgConsole.add("button",nasGrid(1,10,96,24),"app~");
nas.axe.dbgConsole.btn01=nas.axe.dbgConsole.add("button",nasGrid(2,10,96,24),"nas~");
//nas.axe.dbgConsole.btn02=nas.axe.dbgConsole.add("button",nasGrid(3,10,96,24),"app~");


	nas.axe.dbgConsole.actButton.onClick = function (){try{nas.axe.dbgConsole.resultBox.text += eval(nas.axe.dbgConsole.commandBox.text)+LineFeed;}catch(err){nas.axe.dbgConsole.resultBox.text +=err.toString()+LineFeed;}};
	nas.axe.dbgConsole.cluButton.onClick = function (){nas.axe.dbgConsole.resultBox.text ="";};
	nas.axe.dbgConsole.clbButton.onClick = function (){nas.axe.dbgConsole.commandBox.text ="";};
	nas.axe.dbgConsole.loadButton.onClick = function (){newContents=getScript();if(newContents){nas.axe.dbgConsole.commandBox.text=newContents;}};
	nas.axe.dbgConsole.saveButton.onClick = function (){saveText(this.parent.commandBox.text);};
	nas.axe.dbgConsole.writeButton.onClick = function (){saveText(this.parent.resultBox.text);};

	nas.axe.dbgConsole.btn00.onClick = function (){nas.axe.dbgConsole.commandBox.text+="app.activeDocument.activeLayer"};
	nas.axe.dbgConsole.btn01.onClick = function (){nas.axe.dbgConsole.commandBox.text+="nas.axe."};
//	nas.axe.dbgConsole.closeButton.onClick = function (){this.parent.close();};

/*	GUI�p�[�c���Ĕz�u	*/
nas.axe.dbgConsole.onResize=function(){
	if((nas.axe.dbgConsole.bounds.width<320)&&(nas.axe.dbgConsole.bounds.width<320)){return false}
var myWidth=(nas.axe.dbgConsole.bounds.width>320)?(nas.axe.dbgConsole.bounds.width-leftMargin-rightMargin)/colUnit:(320-leftMargin-rightMargin)/colUnit;
var myHeight=(nas.axe.dbgConsole.bounds.height>320)?(nas.axe.dbgConsole.bounds.height-topMargin-bottomMargin)/lineUnit:(320-topMargin-bottomMargin)/lineUnit;
var resultBottom=(myHeight/2);//���j�b�g��
//alert(resultBottom);
nas.axe.dbgConsole.titleLabel.bounds=nasGrid(0,0,myHeight*lineUnit,24);
nas.axe.dbgConsole.resultBox.bounds=nasGrid(0,1,myWidth*colUnit,resultBottom*lineUnit-24);
nas.axe.dbgConsole.commandBox.bounds=nasGrid(0,resultBottom+2,myWidth*colUnit,((myHeight-3)*lineUnit/2));

nas.axe.dbgConsole.commandBox.onChange=function(){
//	writeLn("onChange!");
	if(this.backupText) {this.backupText=this.text}
	if(this.backupText!=this.text){this.text+=LineFeed;}else{return false;};
	this.backupText=this.text;
	return false;
}

nas.axe.dbgConsole.cluButton.bounds	=nasGrid((myWidth/5)*0,resultBottom,myWidth*colUnit/5,24);
nas.axe.dbgConsole.actButton.bounds	=nasGrid((myWidth/5)*1,resultBottom,3*myWidth*colUnit/5,24);
nas.axe.dbgConsole.writeButton.bounds	=nasGrid((myWidth/5)*4,resultBottom,myWidth*colUnit/5,24);

nas.axe.dbgConsole.clbButton.bounds	=nasGrid((myWidth/5)*0,resultBottom+1,myWidth*colUnit/5,24);
nas.axe.dbgConsole.loadButton.bounds	=nasGrid((myWidth/5)*3,resultBottom+1,myWidth*colUnit/5,24);
nas.axe.dbgConsole.saveButton.bounds	=nasGrid((myWidth/5)*4,resultBottom+1,myWidth*colUnit/5,24);

nas.axe.dbgConsole.btn00.bounds	=nasGrid((myWidth/5)*1,resultBottom+1,myWidth*colUnit/5,24);
nas.axe.dbgConsole.btn01.bounds	=nasGrid((myWidth/5)*2,resultBottom+1,myWidth*colUnit/5,24);
//nas.axe.dbgConsole.btn02.bounds	=nasGrid((myWidth/5)*3,10,myWidth*colUnit/5,24);

}


nas.axe.dbgConsole.onClose=function(){
	delete nas.axe.dbgConsole;
}
if(nas.axe.dbgConsole.isDoc){
	nas.axe.dbgConsole.onResize();
}else{
	nas.axe.dbgConsole.onResize();
	nas.axe.dbgConsole.commandBox.text="/*\t���̃{�b�N�X�ɃR�[�h����������ł�������\t"+LineFeed+"\t���s�̓��͈͂ȉ��̃L�[���͂�"+LineFeed+"\t[ctlr]+[Enter]\t/Win\t;\t[ctlr]+[M]\t/Mac"+LineFeed+" */"+LineFeed;
	nas.axe.dbgConsole.show();
}
if(app.name=="Adobe AfterEffects")
{		nas.axe.dbgConsole.resultBox.addBuf(20);
		nas.axe.dbgConsole.commandBox.addBuf(10);
}
//���R�͂킩��Ȃ���������Ԃ���256b�Ńy�[�X�g���ł��~�߂ɂȂ�̂ŃX�N���v�g������edittext�̊g���������Ă��B
}
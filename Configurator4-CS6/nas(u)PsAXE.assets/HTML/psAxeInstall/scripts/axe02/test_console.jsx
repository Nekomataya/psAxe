/*(�ȈՃR���\�[��)
//	Nekomataya/kiyo	2005.11.07
//	���s�R�[�h�����ǉ�	11.08
//	�t�@�C���ǂݍ��ݒǉ�	11.09
//	mac��ł̕\���̉��P�E�Ȉ�GUI���C�u���������@11.17
//	�����@11.23  ����ł���肩��
//	�ۑ��Ή����邱�Ƃɂ����B�ꉞ
//	���ł�Photoshop�Ή� inDesign�Ƃ�����CS�g�͂����ĂȂ��̂Ń��J���}�Z���B12/21

	���̃R���\�[���́A���i�̃e�L�X�g�{�b�N�X�̓��e����eval()�Ŏ��s���āA
	��i�̃e�L�X�g�{�b�N�X�ɖߒl��\������ȈՃR���\�[���ł��B
	����̃��C�u�����ɂ͈ˑ����Ă���܂���̂� �唼��AdobeScript���œ���\�ł��B
	�ȒP�ȃR�[�h�̎�����f�o�b�O���ɂ����p���������B

	���i�̓ǂݍ��݂� �㉺�i�ʁX�̕ۑ����\�ł��B

 */
try{if(app.isProfessionalVersion)
	{
		app.name="Adobe AfterEffects";
		var isWindows=(system.osName.match(/Windows/))?true:false;
	}else{
		isWindows=false;
	};
	if(isWindows){var LineFeed="\x0d\x0a"}else{var LineFeed="\x0d"};
}catch(ERR){
	isWindows =true;
}
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
function nasGrid(col,line,width,height){
	left=(col*colUnit)+leftMargin+leftPadding;
	top=(line*lineUnit)+topMargin+topPadding;
	right=left+width-rightPadding;
	bottom=(height <= lineUnit)?top+height-bottomPadding-quartsOffset:top+height-bottomPadding;
		return [left,top,right,bottom];
}
	myWinsize=[512,480];	myWinOffset=[239,40];

if (app.name=="Adobe AfterEffects"){
if((this)&&(this.type=="panel"))
{
	var testConsole= this;
}else{
	var testConsole= new Window("palette","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}
//var testConsole= new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
// new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}else{
var testConsole= new Window("dialog","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}

/*	�E�B���h�E��GUI�p�[�c��z�u	*/
testConsole.titleLabel=testConsole.add("statictext",nasGrid(0,0,480,24),"�����R���\�[�� nas(u) tools (Nekomataya/2009)",{multiline:false});testConsole.titleLabel.justify="right";

testConsole.resultBox=testConsole.add("edittext",nasGrid(0,1,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){testConsole.resultBox.addBuf=addBuf_;}

testConsole.commandBox=testConsole.add("edittext",nasGrid(0,11,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){testConsole.commandBox.addBuf=addBuf_;}

testConsole.actButton=testConsole.add("button",nasGrid(0,9,480,24),"evalCommand");
testConsole.cluButton=testConsole.add("button",nasGrid(0,10,96,24),"clearResult");
testConsole.clbButton=testConsole.add("button",nasGrid(1,10,96,24),"clearCommand");
testConsole.loadButton=testConsole.add("button",nasGrid(2,10,96,24),"loadCommand");
testConsole.saveButton=testConsole.add("button",nasGrid(3,10,96,24),"saveCommand");
testConsole.writeButton=testConsole.add("button",nasGrid(4,10,96,24),"writeResult");


	testConsole.actButton.onClick = function (){try{testConsole.resultBox.text += eval(testConsole.commandBox.text)+LineFeed;}catch(err){testConsole.resultBox.text +=err.toString()+LineFeed;}};
	testConsole.cluButton.onClick = function (){testConsole.resultBox.text ="";};
	testConsole.clbButton.onClick = function (){testConsole.commandBox.text ="";};
	testConsole.loadButton.onClick = function (){newContents=getScript();if(newContents){testConsole.commandBox.text=newContents;}};
	testConsole.saveButton.onClick = function (){saveText(this.parent.commandBox.text);};
	testConsole.writeButton.onClick = function (){saveText(this.parent.resultBox.text);};
//	testConsole.closeButton.onClick = function (){this.parent.close();};

/*	GUI�p�[�c���Ĕz�u	*/
testConsole.onResize=function(){
var myWidth=(testConsole.bounds.width-leftMargin-rightMargin)/colUnit;
var myHeight=(testConsole.bounds.height-topMargin-bottomMargin)/lineUnit;

testConsole.titleLabel.bounds=nasGrid(0,0,myHeight*lineUnit,24);
testConsole.resultBox.bounds=nasGrid(0,1,myWidth*colUnit,192);
testConsole.commandBox.bounds=nasGrid(0,11,myWidth*colUnit,192);
testConsole.commandBox.onChange=function(){
	writeLn("onChange!");
	if(this.backupText) {this.backupText=this.text}
	if(this.backupText!=this.text){this.text+=LineFeed;}else{return false;};
	this.backupText=this.text;
	return false;
}
testConsole.actButton.bounds	=nasGrid(0,9,myWidth*colUnit,24);
testConsole.cluButton.bounds	=nasGrid(0,10,myWidth*colUnit/5,24);
testConsole.clbButton.bounds	=nasGrid((myWidth/5)*1,10,myWidth*colUnit/5,24);
testConsole.loadButton.bounds	=nasGrid((myWidth/5)*2,10,myWidth*colUnit/5,24);
testConsole.saveButton.bounds	=nasGrid((myWidth/5)*3,10,myWidth*colUnit/5,24);
testConsole.writeButton.bounds	=nasGrid((myWidth/5)*4,10,myWidth*colUnit/5,24);
}

if((this)&&(this.type=="panel")){
	testConsole.onResize();
}else{
	testConsole.show();
}
if(app.name=="Adobe AfterEffects")
{		testConsole.resultBox.addBuf(20);
		testConsole.commandBox.addBuf(10);
}
		testConsole.commandBox.text="/*\t���̃{�b�N�X�ɃR�[�h����������ł�������\t*/"+LineFeed;
//���R�͂킩��Ȃ���������Ԃ���256b�Ńy�[�X�g���ł��~�߂ɂȂ�̂ŃX�N���v�g������edittext�̊g���������Ă��B

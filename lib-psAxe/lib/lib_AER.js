//XPS�I�u�W�F�N�g������V�[�g�R���o�[�^ �����͂���ōs��
/*			AER2XPS(myOpenFile)
 *		AERema�t�@�C����XPS�݊��e�L�X�g�ɃR���o�[�g����
 *		����	AED�f�[�^���|�C���g����t�@�C���I�u�W�F�N�g
 *		�g���q�� ard/txt �̂݁B
 *		�w�b�_��������B�t�@�C���̔j���͌����Ȃ�
 *		�S�t�@�C����z��ɂƂ�Ȃ������ǂ������c
 */
function AER2XPS(myOpenFile)
{
//���ʕ�����ʒu���m�F���ăt�@�C���t�H�[�}�b�g����
	myOpenFile.open("r");
	checkVer=myOpenFile.read(24);
	myOpenFile.close();
if (! checkVer.match(/^#TimeSheetGrid\ SheetData$/)){ return false;};

//�I�[�v�����Ĕz��ɂƂ�
	myOpenFile.open("r");
	myContent=myOpenFile.read();
	myOpenFile.close();
//ARD�f�[�^��XPS�ŃI�u�W�F�N�g������
	var myARD=new Xps();
	myARD.readIN(myContent);
	if(myARD.cut==myCut){myARD.cut=myOpenFile.name.replace(/\.[^\.]+$/,"")};//�f�t�H���g�l�Ȃ̂Ńt�@�C�����Œu��������
	if(myARD.title==myTitle){myARD.title=nas.workTitles.selectedName};//�f�t�H���g�Œu��������
	
	return myARD.toString();
}
//end converter
function TSH2XPS(myOpenFile)
{
//���ʕ�����ʒu���m�F���ăt�@�C���t�H�[�}�b�g����
	myOpenFile.open("r");
	checkVer=myOpenFile.read(52);
	myOpenFile.close();
if (! checkVer.match(/^\x22([^\x09]+\x09){25}[^\x09]+$/)){ return false;};

//�I�[�v�����Ĕz��ɂƂ�
	myOpenFile.open("r");
	myContent=myOpenFile.read();
	myOpenFile.close();
//ARD�f�[�^��XPS�ŃI�u�W�F�N�g������
	var myTSH=new Xps();
	myTSH.readIN(myContent);
	if(myTSH.cut==myCut){myTSH.cut=myOpenFile.name.replace(/\.[^\.]+$/,"")};//�f�t�H���g�l�Ȃ̂Ńt�@�C�����Œu��������
	if(myTSH.title==myTitle){myTSH.title=nas.workTitles.selectedName};//�f�t�H���g�Œu��������
	
	return myTSH.toString();
}

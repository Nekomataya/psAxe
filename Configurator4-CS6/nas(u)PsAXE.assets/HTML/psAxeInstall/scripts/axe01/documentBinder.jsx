// Photoshop�Ō��B����
/*
���݊J�����t�@�C����ΏۂɁA���ׂẴt�@�C�����ЂƂ̃t�@�C���ɂ܂Ƃ߂�B
���̍ہA1���C���Â��O�����Ă䂭�B
���O�E�B���h�E�́A�}�E�X�N���b�N�ŕҏW�\

	�A�N�V�����V�[�g�̑O��
���C��	�ԍ�	�T�u���C��
[ BG ]
[BOOK]
[ LO ]			[���o]
[ A ]	[-number]	[���]
[ B ]	[up][down]	[�����]
[ C ]	
[ D ]	
[ E ]	
[ F ]	
[ G ]	
[PAN]
[SLIDE]
[T.U.]
[T.B.]
[SCALE]
[�t��PAN]
[�S���h��]
[effect]
[����]

���X�g�Ƀ��C�����Ĕz�u���ăV�[�g�������o��(MAP��)


AE�ł́A�V�[�g�ɂ��������ă��C�����Ƃ� ON/OFF(IN/OUT or ON/blank)��������B

�@�\�ǉ�
�Ώۂ�psd�t�@�C���i�}���`���C���j�ł������ꍇ�́A�h�L�������g���ЂƂ̃��C���Z�b�g�ɂ܂Ƃ߂�
���C���Z�b�g�Ƀt�@�C���������Ď��W����B
���������݂̃X�N���v�g�d�l�ł̓��C���Z�b�g�̃R�s�[�y�[�X�g�͕s�\�Ȃ̂ōċA�I�Ƀ��C���𕡐�����K�v������
��l�@�����͂�߂Ƃ�
�b��I�ɑ�ꃌ�C���𕡐�����R�[�h�őΏ�
�@2011.02.15
 */

//for PreComp with Photoshop


//���݃I�[�v������Ă��邷�ׂẴh�L�������g���\�[�X�Ƃ��čT����B
//�\�[�X���̑I��UI���K�v �\�Ȃ�adobe���̃��m�𗬗p
	var sourceDocs=new Array();
	var maxHeight=0;	var maxWidth=0;	var maxResolution=0;

for (idx=0;idx<app.documents.length;idx++)
{
	sourceDocs[idx]=app.documents[idx];

//	�\�[�X�̍ő�T�C�Y���擾 �V�K�h�L�������g���쐬����B
	if(maxWidth<sourceDocs[idx].width.as("px")*1)
	{
		maxWidth=sourceDocs[idx].width.as("px")*1;
	}
	if(maxHeight<sourceDocs[idx].height.as("px")*1)
	{
		maxHeight=sourceDocs[idx].height.as("px")*1;
	}
	if(maxResolution<sourceDocs[idx].resolution.toString()*1)
	{
		maxResolution=sourceDocs[idx].resolution.toString()*1;
	}
};
//	�\�[�X�h�L�������g�̃J�b�g�ԍ��𐄒肵�Ė��O�Ƃ��Ď擾����B
// �t�@�C�������݂��Ȃ��Ǝv����ꍇ�̓J�����g�t�H���_�Ɖ����̂��쐬
	if(activeDocument.name.match(/.+\.[^\.]+$/)){
		var targetFolder=Folder(activeDocument.fullName.path);
		var previewValue=targetFolder.name;
//	var previewValue="c000";
	}else{
		var targetFolder=new Folder(Folder.current.fsName);
		var previewValue=activeDocument.name;
	}
//�����̓v�����v�g�łȂ� File.saveFlg()�ɒu��������

//	myDocName=prompt("�h�L�������g�̖��O�����",previewValue);

var myDoc=new File(targetFolder.path.toString()+"/"+targetFolder.name+"/"+previewValue+".psd");
	var myResult=myDoc.saveDlg("�h�L�������g�̖��O�����");
if(myResult){
	targetFolder=myResult.parent;
	myDocName=myResult.name.replace(/\.[^.]+$/,"");
}else{
//�L�����Z���w��Ƃ��Ĉ����@�������f�@�t�@�C���𖼏̖��ݒ�ō쐬���邩�ۂ��₤�B���Ƃɂ�����
	;
	targetFolder=null;
	myDocName="noname"};

//	if(myDocName==null){myDocName=previewValue};

var destDoc=app.documents.add(maxWidth+" px",maxHeight+" px",maxResolution+" dpi",myDocName);
	var voidLayer=app.activeDocument.layers[0];//�ŏ��̃��C�����T���Ă���
	//������h�L�������g�����炩���ߕۑ����Ă����@�t���O�ɂ���Ă̓t�@�C���Ȃ��ō쐬���l��
if(targetFolder){
	var mySaveFile=new File(targetFolder.path.toString()+"/"+targetFolder.name+"/"+myDocName+".psd");

	destDoc.saveAs(mySaveFile);
	mySaveFile=null;
}
//if(maxResolution>144)
//{
//	destDoc.resizeImage(this.width,this.height,144);
//};

for (idx=0;idx<sourceDocs.length;idx++)
{
//�\�[�X�h�L�������g���A�N�e�B�u��
	app.activeDocument=sourceDocs[idx];
	var myLayerName=app.activeDocument.name;//
	
	if(app.activeDocument.pixelAspectRatio!=1)
	{
		app.activeDocument.pixelAspectRatio=1;
	}
//	�h�L�������g��2�l��������O���[�X�P�[���ɕϊ�
	if(app.activeDocument.mode==DocumentMode.BITMAP)
	{
		app.activeDocument.changeMode(ChangeMode.GRAYSCALE);
	}

	app.activeDocument.flatten();//������������Ȃ��̂ł������񃌃C���𓝍�
	app.activeDocument.artLayers[0].copy();//���C��1���R�s�[
var orgBounds=app.activeDocument.artLayers[0].bounds;
var mySelectRegion=[[orgBounds[0].as("px"),orgBounds[1].as("px")],[orgBounds[2].as("px"),orgBounds[1].as("px")],[orgBounds[2].as("px"),orgBounds[3].as("px")],[orgBounds[0].as("px"),orgBounds[3].as("px")]];
//	if(app.activeDocument.saved){
		if(myLayerName.match(/^(.*)\..+?$/i))
		{
			myLayerName=RegExp.$1;//�g���q�𕥂�
	/* ����͐��m�ɂ́u�ŏ��̃h�b�g�����O�̕�����̎擾�v�Ȃ̂Œ��� */
		}
//�m�F
//		myLayerName=prompt("���C�������m�F",myLayerName);

	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

	app.activeDocument=destDoc;//���ʐ���A�N�e�B�u��
	app.activeDocument.selection.select(mySelectRegion,SelectionType.REPLACE);//���W������I���@�h�L�������g�P�ʂō��[���}�b�`
	app.activeDocument.paste();//
	app.activeDocument.activeLayer.name=myLayerName;
//		���C���ɖ��O��ݒ�(���ƃt�@�C���̃t�@�C����?)
};

//�ŏ��̃��C���܂��͔w�i���C�����̂Ă�
	voidLayer.remove();
if(false){
//	�h�L�������g��144dpi�ȊO��������144dpi�Ƀ��T���v��
	if(app.activeDocument.resolution.toString()!="144 dpi")
	{
		app.activeDocument.resizeImage(this.width,this.height,144);
	}
}
//�V�K�h�L�������g�쐬�n��Ȃ̂� UNDO�܂Ƃߏ����͕s�v�i�߂胋�[�g�͖��p�j

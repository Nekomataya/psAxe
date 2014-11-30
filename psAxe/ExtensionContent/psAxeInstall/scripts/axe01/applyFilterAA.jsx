/* applyFilterAA.jsx
	Photoshop�X�N���v�g
	�A�j���[�V�����̐����Anti Alias�t�B���^��K�p���܂��B

	OLM Smoother �� pixelBender�t�B���^��I�ʂ��ė��p���܂��B
	���̃X�N���v�g�̗��p�ɂ͈ȉ��̂����ꂩ�̃t�B���^���K�v�ł��B
	�t�B���^�́ApsAxe�p�b�P�[�W�Ɋ܂܂�Ă��܂���̂ŁA�e�����肵�ĉ������B

	���̃X�N���v�g�Ŏg�p����s�N�Z���x���_�[�J�[�l����
	Adobe�G�N�X�`�F���W�œ���\�ł��B
	�ĔЕz�̃��C�Z���X�y�уG�N�X�`�F���W�̐������l����psAxe�p�b�P�[�W�ɂ͊܂܂�Ă���܂���̂�
	�����g�ŃC���X�g�[�������肢���܂��B

pixelBender�����p�\�ȕ�

	MLAA
	�i�܂��́@SmartAA���j
http://www.adobe.com/cfusion/exchange/index.cfm?searchfield=anti+alias&search_exchange=26&search_category=-1&search_license=&search_rating=&search_platform=0&search_pubdate=&Submit=Search&num=10&startnum=1&event=search&sort=0&dummy_tmpfield=

Adobe�G�N�X�`�F���W���̃_�E�����[�h�R�[�i�[�œ���\�ł��BPhotoshop CS4 �ȍ~�ŗ��p�\�ł��B

CS2,3 �܂��̓s�N�Z���x���_�[�������p�łȂ����́A�ȉ��̃v���O�C�����g�p�\�ł��B

	OLM Smoother(for photoshop)
http://www.olm.co.jp/rd/technology/tools/?lang=ja

	�A�j���[�V����������OLM�l�̃T�C�g�Ŗ����Ń_�E�����[�h�\�ł��B
	���[���A�h���X�̓o�^���K�v�ł��B

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
// �_�u���N���b�N���s�����ꍇ��photoshop���^�[�Q�b�g�ɂ���
#target photoshop
// in case we double clicked the file
// �O�ʂɏo��
app.bringToFront();

  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){
/*
	�_�C�A���O�̕\�����w��ł��܂��B
	�t�B���^�̃p�����[�^�́A�f�t�H���g�Ō��ߑł��ł��B
	�������AOLM Smoother���g�p����ꍇ�́A���݂̂Ƃ���_�C�A���O���[�h��"NO"�ɐݒ肵�Ă�
	�_�C�A���O��\�������ԂŃR���p�C������Ă���悤�ł��̂ŁA������̐ݒ�͖����ɂȂ�܂��B
*/
	var myDialogModes ="NO";//YES/NO/ALL �̎O�킪�ݒ�\�ł��B
	var usePB         =false;//pixelBender���g�p�\�Ȃ�s�N�Z���x���_�[���g�p����Bfalse�ɂ����OLM Smoother���g�p
/*
	CS4-5�ł́A�A�v���P�[�V�����t�H���_�� Pixel Bender Files �t�H���_�̗L�����`�F�b�N����
	Pixel Bender Kernel ���g�p�\���ۂ����肷��B
	CS6�ł͖�������Pixel Bender ���g�p�\
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}

if((exPBK)&&(usePB))
{
// =======================================================PixelBender�t�B���^(pbk)
/*	applyPbk(myPBK,knlName,[[control,value]],dialog)
����
	myPBK	�t�@�C���I�u�W�F�N�g���̓t�@�C���p�X
	knlName	�J�[�l�����ʎq
	control	�R���g���[���L�q(������)
	value	�R���g���[���̒l(���l)
	dialog	�_�C�A���O���[�h(������ "ALL""ERROR""NO")[�ȗ���]
�߂�l
	���ɂȂ�(undefeined)
	pixel bender karnel�@���X�N���v�g����K�p����֐�
	����myPBK�̓J�[�l���t�@�C�����̓t�@�C���p�X��
	���݂��Ȃ��J�[�l���t�@�C�����w�肳�ꂽ�ꍇ�́A������X�L�b�v
*/
applyPbk=function(myPBK,knlName,fVA,dMode){
 if(! dMode){dMode="NO"}
 if(! dMode.match(/(ALL|ERROR)/)){dMode="NO";};
 if(! fVA){fVA=[];}
 if(! knlName ) knlName=false;
 if(!(myPBK instanceof(File))){myPBK=new File(myPBK);};//�t�@�C���I�u�W�F�N�g�łȂ���ΐV�K�t�@�C��

	if((myPBK.exists)&&(knlName)){
// =======================================================pbk�K�p(�p�����^����)
var idPbPl = charIDToTypeID( "PbPl" );//pbk���ʕ�����
    var descPbk = new ActionDescriptor();//�A�N�V�����f�B�X�N���v�^�����

    var idKnNm = charIDToTypeID( "KnNm" );//KarNel NaMe
    descPbk.putString( idKnNm, knlName );//�J�[�l�����ʖ��ݒ�(���Ԃ�Undo�̎��ʖ��̂�)

    var idGpuY = charIDToTypeID( "GpuY" );//GPU�g�p�t���O(���ݎg�p���ɌŒ�@���肵�Ē����͑����K�v�@�������䂩�H)
    descPbk.putBoolean( idGpuY, true );//���ݒ�

    var idLIWy = charIDToTypeID( "LIWy" );//�s���Ȏ��ʎq
    descPbk.putBoolean( idLIWy, true );//���ݒ� - ����͌��ߑł��Ŏc��

    var idFPth = charIDToTypeID( "FPth" );//�t�@�C���p�X���ʎq
    descPbk.putString( idFPth, myPBK.fsName );//�t�@�C���p�X�ݒ�
//�p�����^�����鐔�����J��Ԃ��Đݒ�@���݃p�����^�̎�ʂ�Float�݂̂Ō��ߑł�(�ėp���Ȃ�)
//id�͎������� �A���t�@�x�b�g1���őł��~��
//aa,ab,ac,ad,ae~�ƘA��
 var exText=new Array();
 for(var ix=0;ix< fVA.length;ix++){
   var myChar="abcdefghijklmnopqrstuvwxyz".charAt(ix);
   var idPN = charIDToTypeID( "PNa"+myChar );//�p�����^���{id
   descPbk.putString( idPN, fVA[ix][0] );//�p�����^���ݒ�
   var idPT = charIDToTypeID( "PTa"+myChar );//�p�����^�Ɋւ��鉽���̎��ʎq+id
   descPbk.putInteger( idPT, 0 );//�����łO��ݒ肵�Ă���@�Ƃ肠�����R�s�[
   var idPF = charIDToTypeID( "PFa"+myChar );//���ۂɂ��������p�����^�̎��ʎq
   descPbk.putDouble( idPF, fVA[ix][1] );//�K�p�p�����^
 }
 executeAction( idPbPl, descPbk, DialogModes[dMode] );
	}else{
//�t�@�C�������݂��Ȃ������͎��ʎq����v���Ă��Ȃ�
alert("pixelBenderKernel not exists or wrong id");
	}
}
// =======================================================
//nas���C�u�����p�X�̎擾
if($.fileName){
//	$.fileName�I�u�W�F�N�g������Ύg�p����
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
//applyPbk(nasLibFolderPath+"PixelBenderKernel/SmartAA.pbk","SmartAA",[],myDialogModes);
applyPbk(nasLibFolderPath+"PixelBenderKernel/MLAA.pbg","MLAA",[],myDialogModes);


}else{
// =======================================================Smoother (OLM Smoother�g�p)
var idFltr = charIDToTypeID( "Fltr" );
    var desc10 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
var Smoother=($.os.indexOf("Windows")>=0)? "OLM Smoother...":"OLM Smoother";
    desc10.putString( idUsng, Smoother );
executeAction( idFltr, desc10, DialogModes[myDialogModes] );
}
  }

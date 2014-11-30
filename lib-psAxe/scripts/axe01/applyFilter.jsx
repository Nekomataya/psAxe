/*
	Photoshop�X�N���v�g
	�X�N���v�g����t�B���^�����s����e���v���[�g

	PBK���g�p�\�Ȃ�D�悵�Ďg�p
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();

  if((app.documents.length)&&(app.activeDocument)&&(app.activeDocument.activeLayer)){

/*	�O�i�F����psPaint�݊��F�l���擾	*/

var r=app.foregroundColor.rgb.red;
var g=app.foregroundColor.rgb.green;
var b=app.foregroundColor.rgb.blue;

	var i=(76*r+150*g+29*b)/255;
	var u=(b-i);
	var v=(r-i);
//	var u=(b-i)*0.24;
//	var v=(r-i)*0.44;
//	var u=(b-i)*0.493;
//	var v=(r-i)*0.877;
var s=0;
	if(u==0){
		if(v>=0){s=90;}else{s=-90;}
	}else{
		s=180. * (Math.atan(v/u)/Math.PI);
	}
	if((u<0) && (v>0)){ s+=180};
	if((u<0) && (v<0)){ s+=180};
	if((u>0) && (v<0)){ s+=360};
	s=Math.floor(s*1023/360)%1024;
	if(s>512){s=s-1024};
var m=Math.sqrt(u*u+v*v);


/*
	�A�v���P�[�V�����t�H���_�� Pixel Bender Files �t�H���_�̗L�����`�F�b�N����
	Pixel Bender Kernel ���g�p�\��Photoshop���ۂ����肷��
*/
var exPBK = new Folder(app.path.fullName+"/Pixel Bender Files").exists;
if(app.version.split(".")[0]>13){exPBK=false}
if(app.version.split(".")[0]==13){exPBK=true}
if(exPBK)
{
// =======================================================PixelBender�t�B���^(pbk)
/*	applyPbk(myPBK,knlName,[[control,value]],dialog)
����
	myPBK	�t�B���^�L�q �J�e�S��+�t�B���^��(������)
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

/*
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk",
"traceK",
[
["saturation",2.500000],
["backgroundClip",100.000000],
["lineIntensity",20.000000]
],
"NO"
)
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/thin000.pbk","thin000",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceAll.pbk","traceAll",[],"NO");
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceK.pbk","traceK",[],"ALL");
*/
//applyPbk(nasLibFolderPath+"PixelBenderKernel/traceY.pbk","trace_Y",[["hueOffset",0.],["hueRange",0.3],["strThreshold",20.0],["backgroundClip",100.0],["lineIntensity",0.]],"ALL");
applyPbk(nasLibFolderPath+"PixelBenderKernel/pickupColor.pbk","pickup_Color",[
["centerHue",s],
["hueRange",30.],
["strThreshold",3.],
["backgroundClip",100.],
["lineIntensity",1.]
],"ALL");

}else{
// =======================================================�ʏ�t�B���^(8BM)
/*	applyFilter(filterDescription,[[control,value]],dialog)
����
	filterDescription	�t�B���^�L�q �J�e�S��+�t�B���^��(������)
	control	�R���g���[���L�q(������)
	value	�R���g���[���̒l(���l)
	dialog	�_�C�A���O���[�h(������ "ALL""ERROR""NO")[�ȗ���]
�߂�l
	���ɂȂ�(undefeined)
 */
applyFilter=function(fD,fVA,dMode){
if (fVA instanceof Array){
if (! dMode){dMode="NO";};
if (! dMode.match(/(ALL|ERROR)/)){dMode="NO";};
	var actionID = stringIDToTypeID(fD);
	var myDescription = new ActionDescriptor();
	var id=new Array();

	for(idx=0;idx<fVA.length;idx++){
		id[idx] = charIDToTypeID( fVA[idx][0]);
		myDescription.putInteger( id[idx], fVA[idx][1]);
	}
	myMode=eval("DialogModes."+dMode);
	executeAction( actionID, myDescription, myMode );
}else{return false;};//
};
// ===========================================================�g�p�T���v��

/*
applyFilter("psPaint trace_B...",[["cTl0",127],["cTl1",127],["cTl2",127],["cTl3",255],["cTl4",0]]);
applyFilter("psPaint traceK...",[["cTl0",32],["cTl1",255],["cTl2",0]]);
applyFilter("psPaint thin000",[],"NO");

applyFilter("psPaint borderFill",[],)
applyFilter("psPaint traceAll",[],);
applyFilter("psPaint traceK...",[["cTl0",127],["cTl1",127],["cTl2",127]]);

*/
applyFilter("psPaint pickup_Color...",[["cTl0",(360*s)/1024],["cTl1",127],["cTl2",127],["cTl3",255],["cTl4",0]],"ALL");
}
  }

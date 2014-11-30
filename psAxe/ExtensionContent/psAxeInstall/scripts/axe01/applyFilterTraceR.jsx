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

/*	�O�i�F/�w�i�F����psPaint�݊��F�l���擾	*/
psPcolor=function(r,g,b){
		if(!r) {this.r=0.}else{this.r=r};
		if(!g) {this.g=0.}else{this.g=g};
		if(!b) {this.b=0.}else{this.b=b};

		this.i=(76*this.r+150*this.g+29*this.b)/255;;
		this.u=this.b-this.i;
		this.v=this.r-this.i;
		this.s=1024.*180. * (Math.atan2(this.v,this.u)/Math.PI)/360.;
		this.m=Math.sqrt(this.u*this.u+this.v*this.v);
	}

var colorParams=new Object;
	colorParams.fgc=new psPcolor(
		app.foregroundColor.rgb.red,
		app.foregroundColor.rgb.green,
		app.foregroundColor.rgb.blue
	);
	colorParams.bgc=new psPcolor(
		app.backgroundColor.rgb.red,
		app.backgroundColor.rgb.green,
		app.backgroundColor.rgb.blue
	);
//===========================���ʃI�u�W�F�N�g
targetParams=({
	P:{
		filterSig:"psPaint trace_P...",
		pbkName:"PixelBenderKernel/traceP.pbk",
		pbkSig:"trace_P",
		centerHue:149
	},
	R:{
		filterSig:"psPaint trace_R...",
		pbkName:"PixelBenderKernel/traceR.pbk",
		pbkSig:"trace_R",
		centerHue:307
	},
	Y:{
		filterSig:"psPaint trace_Y...",
		pbkName:"PixelBenderKernel/traceY.pbk",
		pbkSig:"trace_Y",
		centerHue:487
	},
	GY:{
		filterSig:"psPaint trace_GY...",
		pbkName:"PixelBenderKernel/traceGY.pbk",
		pbkSig:"trace_GY",
		centerHue:557
	},
	G:{
		filterSig:"psPaint trace_G...",
		pbkName:"PixelBenderKernel/traceG.pbk",
		pbkSig:"trace_G",
		centerHue:680
	},
	C:{
		filterSig:"psPaint trace_C...",
		pbkName:"PixelBenderKernel/traceC.pbk",
		pbkSig:"trace_C",
		centerHue:870
	},
	B:{
		filterSig:"psPaint trace_B...",
		pbkName:"PixelBenderKernel/traceB.pbk",
		pbkSig:"trace_B",
		centerHue:921
	}
});

//�^�[�Q�b�g�Z���^�F��
var targetColor="R";
var targetCenterHue=targetParams[targetColor].centerHue;
var myOffset=colorParams.fgc.s-targetCenterHue;

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
applyPbk(nasLibFolderPath+"PixelBenderKernel/traceY.pbk","trace_Y",[["hueOffset",0.],["hueRange",0.3],["strThreshold",20.0],["backgroundClip",100.0],["lineIntensity",0.]],"ALL");
*/
applyPbk(nasLibFolderPath+targetParams[targetColor].pbkName,targetParams[targetColor].pbkSig,[
	["hueOffset",myOffset],
	["hueRange",100.0],
	["strThreshold",(((colorParams.bgc.m)*9)+colorParams.fgc.m)/182],
	["backgroundClip",(colorParams.bgc.i/255.)*90],
	["lineIntensity",(colorParams.fgc.i+255.)/512]
],"NO");

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
var xs=Math.floor(((colorParams.fgc.s/1024))*256);
var xss=Math.floor(((colorParams.bgc.m)*9+colorParams.fgc.m)/1.40);
//�ʓx臒l���o�b�N�O���E���h��2�{�łȂ��^�[�Q�b�g�J���[�ƃo�b�N�O���E���h�̊Ԃɒu�����u���K�v
/*
(�o�b�N�O���E���h�ʓx*9+�^�[�Q�b�g�ʓx)/10
*/
applyFilter(targetParams[targetColor].filterSig,[
	["cTl0",Math.floor(myOffset%256)+127],
	["cTl1",255],
	["cTl2",xss],
	["cTl3",Math.floor((colorParams.bgc.i)*.9)],
	["cTl4",Math.floor((colorParams.fgc.i+255.)/2)]
],"ALL");
}
  }

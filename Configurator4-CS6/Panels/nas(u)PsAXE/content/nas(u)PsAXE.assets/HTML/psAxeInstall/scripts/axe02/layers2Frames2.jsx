/*
	�I�����C�����A�j���[�V�����t���[���֓W�J����B��Ƀv���r���[�p�������v�͍�����
*/
	var exFlag=true;
//���������h�L�������g���Ȃ���ΏI��
	if(app.documents.length==0){
		exFlag=false;
	}else{
getSelectedLayers=function(){ 
//--------------------------------------���C������O���[�v
 var idGrp = stringIDToTypeID( "groupLayersEvent" );
 var descGrp = new ActionDescriptor();
 var refGrp = new ActionReference();
 refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
 descGrp.putReference(charIDToTypeID( "null" ), refGrp );
 executeAction( idGrp, descGrp, DialogModes.ALL );//�O���֐��ɂ��ČĂяo������Ɩ��ɒx���̂Œ��ӂ�
//�������擾���ăt���[�������擾
//================== �g���[���[�̃��C�������擾
var resultLayers=new Array();
for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
// =================== UNDO�o�b�t�@���g�p���ĕ��A
var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var id10 = charIDToTypeID( "HstS" );
        var id11 = charIDToTypeID( "Ordn" );
        var id12 = charIDToTypeID( "Prvs" );  
        ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
executeAction( id8, desc5, DialogModes.NO );
return resultLayers;
//�I�����C���̕��A�͂��Ȃ�
}
 //�I�����C���擾
		var myLayers=getSelectedLayers();
//�N�����Ƀ��C���R���N�V�����̏�Ԃ��m�F�@�t���b�v�A�C�e������1�ȉ��Ȃ�I��
		if(myLayers.length<=1){exFlag=false;};
	}
	if(exFlag){

//�A�j���E�C���h�E����֐��@����擾���ł��Ȃ��̂̓w�{�������̃g�R�̓J���x���@��Ő�������
/*
	���A�͕s�v�Ńg���[���[�����̕\����Ԃ����Z�b�g����X�N���v�g���܂����
	�t���[���͏������I
*/
setDly=function(myTime){
// =======================================================�A�j���[�V�����E�B���h�E�̍ŏ��̃t���[���̒x����ݒ�
var idsetd = charIDToTypeID( "setd" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
	
    var idT = charIDToTypeID( "T   " );
        var desc2 = new ActionDescriptor();
        var idanimationFrameDelay = stringIDToTypeID( "animationFrameDelay" );
        desc2.putDouble( idanimationFrameDelay, myTime );
    var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
    desc.putObject( idT, idanimationFrameClass, desc2 );
executeAction( idsetd, desc, DialogModes.NO );
}
dupulicateFrame=function(){
// =======================================================�t���[������
var idDplc = charIDToTypeID( "Dplc" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDplc, desc, DialogModes.NO );
}
selectFrame=function(idx){
// =======================================================�t���[���I��(1/6)
var idslct = charIDToTypeID( "slct" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        ref.putIndex( idanimationFrameClass, idx );
    desc.putReference( idnull, ref );
var M=executeAction( idslct, desc, DialogModes.NO );
}
selectFramesAll=function(){
// =======================================================�t���[���S�I��
var idanimationSelectAll = stringIDToTypeID( "animationSelectAll" );
    var desc = new ActionDescriptor();
executeAction( idanimationSelectAll, desc, DialogModes.NO );
}
removeSelection=function(){
// =======================================================�I���t���[���폜
var idDlt = charIDToTypeID( "Dlt " );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDlt, desc, DialogModes.NO );
}
//=======================================================�A�j���[�V�����t���[�����A�N�e�B�u�ɂ���
//�i���t������j�Z���N�g�ƃA�N�e�B�u���ʊT�O�̂悤�Ȃ̂Œ��ӂ�
activateFrame=function(kwd){
//kwd = Nxt ,Prevs,Frst(�e�S�o�C�g)
var idanimationFrameActivate = stringIDToTypeID( "animationFrameActivate" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
		var idX = charIDToTypeID( kwd );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idX );
    desc.putReference( idnull, ref );
executeAction( idanimationFrameActivate, desc, DialogModes.NO );
}
//=======================================================�A�j���[�V�����t���[�����N���A�i�������j
initFrames=function(){
var idDlt = charIDToTypeID( "Dlt " );
 var desc = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref = new ActionReference();
 var idanimationClass = stringIDToTypeID( "animationClass" );
 var idOrdn = charIDToTypeID( "Ordn" );
 var idTrgt = charIDToTypeID( "Trgt" );
 ref.putEnumerated( idanimationClass, idOrdn, idTrgt );
 desc.putReference( idnull, ref );
 executeAction( idDlt, desc, DialogModes.ALL );
}
//=========================================main
		//�\�������� 
		//�A�j���[�V�����e�[�u��������
		initFrames();
//root�g���[���̃��C�������T����
var myRootCount=app.activeDocument.layers.length;
		//�I�����C���̕\����������(�ł����̃��C���̂ݕ\�����Ăق����I�t)
		for(var ix=0;ix<myLayers.length;ix++){myLayers[ix].visible=(ix==(myLayers.length-1))?true:false;}

		//���t���[���ȍ~��\����؂�ւ��A�j���t���[���ɓo�^
		for(var idx=myLayers.length-1;idx>0;idx--){
			dupulicateFrame();//���i�t�H�[�J�X�ړ��j
if(myRootCount<app.activeDocument.layers.length){
//���[�g��ꃌ�C�����̂Ăă��[�h��؂�ւ���
 app.activeDocument.layers[0].remove();
//=======================================================animationNewLayerPerFrame
 var idslct = charIDToTypeID( "slct" );
 var desc195 = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref172 = new ActionReference();
 var idMn = charIDToTypeID( "Mn  " );
 var idMnIt = charIDToTypeID( "MnIt" );
 var idanimationNewLayerPerFrame = stringIDToTypeID( "animationNewLayerPerFrame" );
 ref172.putEnumerated( idMn, idMnIt, idanimationNewLayerPerFrame );
 desc195.putReference( idnull, ref172 );
 executeAction( idslct, desc195, DialogModes.NO );
}
			myLayers[idx].visible=false;
			myLayers[idx-1].visible=true;
		}

//==============================================================
selectFrame(1);//�Ō�ɑ��t���[���Ƀt�H�[�J�X���Ă���


	}else{alert("�Ȃ񂾂��p�^�p�^������̂������݂���");}
/*	duplicateReg.jsx
	���W�X�^�}�[�N��I�����C���ɓ\��t����X�N���v�g
	���W�X�^�̉摜�̓h�L�������g���ɂ��炩���߃��C���Ƃ��ēǂݍ���ł����K�v������
	��{�́A///frame/peg ���̖��O�ȊO�̏ꍇ�̓��X�g����I������
	���W�X�^���C����I�����ꂽ�e���C���̏�ɕ������ē����B���[�h�A�����x�ɂ͎�����Ȃ�
	
	�ǂݍ��݂͕ʂ̃X�N���v�g�܂��͎���
*/
if(app.documents.length){
	var myTarget=app.activeDocument;
	getSelectedLayers=function(){ 
		//���蓮��@�w�i���C�����܂܂�Ă���Ƃ��ɂ̓G���[�����ǂƂ肠�������� �I�����C�����Ȃ��ꍇ���G���[�����ǂ��������
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
 //�e���v���[�g�̎擾
 	var myTempalte=false;
	for (var ix=0;ix<myTarget.layers.length;ix ++){
		if(
		 (myTarget.layers[ix].name=="peg")&&(
		  (myTarget.layers[ix].kind==LayerKind.NORMAL)||
		  (myTarget.layers[ix].kind==LayerKind.SMARTOBJECT)
		 )
		){
		//�h�L�������g���K�w�̃m�[�}���i�X�}�[�g�I�u�W�F�N�g�j���C���Ŗ��O��"peg"
			myTempalte=myTarget.layers[ix];break;
		}
		if(myTarget.layers[ix].name.match(/(frames?|�t���[��)/i)){
		//�h�L�������g���K�w��"peg"���C���Ńm�[�}���i�X�}�[�g�I�u�W�F�N�g�j���C��
		try{myTempalte=myTarget.layers[ix].layers.getByName("peg");}catch(err){myTempalte=false;}
		if(
		 (myTempalte)&&(
		  (myTempalte.kind==LayerKind.NORMAL)||
		  (myTempalte.kind==LayerKind.SMARTOBJECT)
		 )
		){break;}

		}
	}
	if(myTempalte){
		//�I�����C���擾
		var myLayers=getSelectedLayers();
        var myUndo="�^�b�v�\�t";var myAction="";
			//�m�[�}�����C�����̂ݏ��� �y�O���C�����̂Ȃ�X�L�b�v
myAction="for (var ix=0;ix<myLayers.length;ix ++){if((myLayers[ix].kind==LayerKind.NORMAL)&&(myLayers[ix]!==myTempalte)){var myLayerOpc=myLayers[ix].opacity;if (myLayerOpc<100){myLayers[ix].opacity=100.0;};var myPegLayer=myTempalte.duplicate(myLayers[ix],ElementPlacement.PLACEBEFORE);var newLayer=myPegLayer.merge();newLayer.opacity=myLayerOpc;}};"
if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
	}else{
	alert("no peg(register) layer found!\n�^�b�v�i�g���{�j���C�����擾�ł��܂���ł����B\n");
	}
}else{
    alert("no Documents")
}
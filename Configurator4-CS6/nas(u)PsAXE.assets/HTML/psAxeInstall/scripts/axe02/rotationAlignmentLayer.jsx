/*(��]�A���C�����g)
�I��͈͂��쐬������Ԃł��̃X�N���v�g�����s���Ă��������B
�I��̈�̑Ίp���𐅕��ɂȂ�悤�ɃA�N�e�B�u���C������]���܂��B
�w�i���C�����I������Ă���ꍇ�́A����X�L�b�v

Mac��Windows�Ń_�C�A���O�̃{�^���z�u���t�Ȃ̂Ŕ��肵�Ē���

���̂����c�[���ƕό`����]���p�x�w���A�����đ��삷�邱�Ƃ�
���l�̑����Photoshop�̋@�\�ōs�����Ƃ��\�B
���̏ꍇ�A���̂����c�[���͊p�x���[�h�Ŏg���K�v������B
�p�x���[�h��[alt]+�h���b�O

���C���Z�b�g�̍ŏ�ʂɃt�H�[�J�X���ڂ���𒲐�
�����C���폜�̃^�C�~���O�Ŏ����I�Ƀt�H�[�J�X���ړ����Ă����̌�X�N���v�g����̃A�N�Z�X���ł��Ȃ��l�Ȃ̂�
�폜�O�ɐ�ɃA�N�e�B�u�ł��������C���̒���Ɉړ����郋�[�`����ǉ� 2011/12/03
*/
var isWindows=($.os.match(/windows/i))?true:false;
if(activeDocument.activeLayer.isBackgroundLayer){
�@alert("�ʏ탌�C����I�����Ď��s���Ă������� :"+activeDocument.activeLayer.name);
}else{
var targetLayer=activeDocument.activeLayer;
//AE�@ExpressionOtherMath �݊� �p�x<>���W�A���ϊ��֐�
//���؂�Ȃ��ق����ǂ������A�^�p���Ă݂Ĕ��f���܂��傤 2006/06/23
function degreesToRadians(degrees)
{
	return Math.floor((degrees/180.)*Math.PI*100000000)/100000000;
}
function radiansToDegrees(radians)
{
	return Math.floor(180. * (radians/Math.PI)* 100000)/100000;
}

//�A�N�e�B�u�h�L�������g�̑I��͈͂�bounds��Ԃ��֐�
//�G���[�[�n���h�����O�������̂Œ���
//�I��͈͂������ꍇ�A�h�L�������g�S�͈̂̔͂��߂�
activeDocument.selection.getBounds=function(){
	var currentActiveLayer=this.parent.activeLayer;
	var tempLayer=this.parent.artLayers.add();
	this.fill(app.foregroundColor);
	var myBounds=tempLayer.bounds;
	tempLayer.move(currentActiveLayer,ElementPlacement.PLACEBEFORE);
	tempLayer.remove();
	this.parent.activeLayer=currentActiveLayer;
	return myBounds;
}
//��̃��\�b�h�̓��C�u�����ɓ��ꂽ��
//���̃X�N���v�g�̓��C����]�^�@���C���𒼐ڑ��삷��̂őI��͈͖͂���
//�I��͈͂��g���ꍇ�́A���̂����c�[���ƕό`���j���[��g�ݍ��킹������𐄏�
var myBounds=activeDocument.selection.getBounds();
var myAngle=radiansToDegrees(Math.atan2((myBounds[3].as("px")-myBounds[1].as("px")),(myBounds[2].as("px")-myBounds[0].as("px"))));
if(isWindows){var msg="�͂�-�����v���� :������-���v����"}else{var msg="������-�����v����:�͂�-���v���� ";myAngle=-myAngle;};
//alert(activeDocument.activeLayer.name);
//var backupCn=app.activeDocument.channels.add();
//app.activeDocument.selection.store(backupCn);
//�`�����l���Ƀo�b�N�A�b�v��������̂ŉ摜�`�����l���Ƀt�H�[�J�X��߂��B
//activeDocument.activeLayer=targetLayer;
//app.activeDocument.selection.deselect();//��������Z���N�V��������
if(confirm(msg)){targetLayer.rotate(-myAngle);}else{targetLayer.rotate(myAngle);}
}
//
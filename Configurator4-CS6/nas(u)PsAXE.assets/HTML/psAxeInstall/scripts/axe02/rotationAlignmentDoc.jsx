/*(��]�A���C�����g)
�I��͈͂��쐬������Ԃł��̃X�N���v�g�����s���Ă��������B
�I��̈�̑Ίp���𐅕��ɂȂ�悤�Ƀh�L�������g����]���܂��B

Mac��Windows�Ń_�C�A���O�̃{�^���z�u���t�Ȃ̂Ŕ��肵�Ē���

���̂����c�[���ƃh�L�������g�̉�]��A�����đ��삷���
���l�̑����Photoshop�̋@�\�ōs�����Ƃ��\�B
�������A���̋@�\���g���ƁA�����␳�Ɛ����␳�������F���Ȃ̂�
45�x�𒴂���␳�͂ł��Ȃ��B

���C���Z�b�g�̍ŏ�ʂɃt�H�[�J�X���ڂ���𒲐�
�����C���폜�̃^�C�~���O�Ŏ����I�Ƀt�H�[�J�X���ړ����Ă����̌�X�N���v�g����̃A�N�Z�X���ł��Ȃ��l�Ȃ̂�
�폜�O�ɐ�ɃA�N�e�B�u�ł��������C���̒���Ɉړ����郋�[�`����ǉ� 2011/12/03
*/
var isWindows=($.os.match(/windows/i))?true:false;

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
	return myBounds;
}
//��̃��\�b�h�̓��C�u�����ɓ��ꂽ��
//���C����]�^���K�v
var myBounds=activeDocument.selection.getBounds();
var myAngle=(Math.atan2((myBounds[3].as("px")-myBounds[1].as("px")),(myBounds[2].as("px")-myBounds[0].as("px"))));
if(isWindows){var msg="�͂�-�����v���� :������-���v����"}else{var msg="������-�����v����:�͂�-���v���� ";myAngle=-myAngle;};
if(confirm(msg)){activeDocument.rotateCanvas(-radiansToDegrees(myAngle))}else{activeDocument.rotateCanvas(radiansToDegrees(myAngle))};
//
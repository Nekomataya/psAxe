/* smartReset.jsx
	�X�}�[�g�I�u�W�F�N�g�����Z�b�g
�菇

1.�Ώۃ��C���I��
 �i����̓��[�U�ɂ��I��
   �A�N�e�B�u���C�����X�}�[�g�I�u�W�F�N�g�łȂ��ꍇ�͂��̋@�\���̂𒆒f�j
2.�u�R���e���c�̕ҏW�v�ŃI���W�i���̃��X�^��ʃE�C���h�E�ŕ\��
3.�S�I���E�R�s�[�Ńo�b�t�@�ɂƂ�
4.�ۑ������ɃE�C���h�E����ăN���A
5.���̃h�L�������g�ɖ߂�Ώۃ��C�������X�^���C�Y
6.�s�����x��0�ɂ���
7.���C���̏�ɃR�s�[�o�b�t�@���e���y�[�X�g
8.���̃��C���ƌ���
*/
var myUndoStr="�X�}�[�g�I�u�W�F�N�g�����Z�b�g";
var myExcute="";
//=============== �R�[�h
myExcute+="if(app.activeDocument.activeLayer.kind == LayerKind.SMARTOBJECT){";
// =======================================================�R���e���c�̕ҏW
myExcute+="var id72 = stringIDToTypeID(\"placedLayerEditContents\");var desc12 = new ActionDescriptor();executeAction( id72, desc12, DialogModes.NO );";
// =======================================================���C���̃R�s�[
myExcute+="app.activeDocument.activeLayer.copy();";
// =======================================================�ۑ������ɕ���
myExcute+="app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);";
// =======================================================���X�^���C�Y
myExcute+="app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER);";
// =======================================================�s�����x0%
myExcute+="app.activeDocument.activeLayer.opacity=0.0;";
// =======================================================�y�[�X�g
myExcute+="app.activeDocument.paste();";
// =======================================================�}�[�W
myExcute+="app.activeDocument.activeLayer.merge();}";
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
	if(activeDocument.suspendHistory){
		activeDocument.suspendHistory(myUndoStr,myExcute);
	}else{
		eval(myExcute)
	}
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}


/*
	�A�N�e�B�u���C���̂��郌�C���Z�b�g�̍ŉ��ʃ��C�������C�����ŏ�ʂֈړ��@�A�N�e�B�u���C�����ЂƂ�ֈړ�
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
*/
ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try {
var idx=0;var mxId=app.activeDocument.activeLayer.parent.layers.length;
while(app.activeDocument.activeLayer.parent.layers[idx]!=app.activeDocument.activeLayer){idx++};
app.activeDocument.activeLayer=app.activeDocument.activeLayer.parent.layers[(idx+mxId-1)%mxId];
app.activeDocument.activeLayer.parent.layers[app.activeDocument.activeLayer.parent.layers.length-1].move(app.activeDocument.activeLayer.parent.layers[0],ElementPlacement.PLACEBEFORE);
} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};

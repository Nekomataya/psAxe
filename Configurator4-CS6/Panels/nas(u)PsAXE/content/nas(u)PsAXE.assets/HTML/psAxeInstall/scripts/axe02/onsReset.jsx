/*	onsReset.jsx
	�I�j�I���X�L����Ԃ̃��Z�b�g
	�A�N�e�B�u���C���̂��郌�C���Z�b�g�̑S���C���̕s�����x�����Z�b�g����B
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
*/
ErrStrs = {};ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");try {
var myDocLayers=app.activeDocument.activeLayer.parent.layers;
for(var idx=0;idx<myDocLayers.length;idx++){
	if(!(myDocLayers[idx].visible)){
		myDocLayers[idx].visible=true;
	}
	if(myDocLayers[idx].opacity<100){
		myDocLayers[idx].opacity=100;
	}
};
} catch(e){ if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}};
//onsReset.jsx

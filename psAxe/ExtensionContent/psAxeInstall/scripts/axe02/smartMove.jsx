/*	smartMove.jsx
	���Q�l�̂��߂Ƀ��C�����X�}�[�g�I�u�W�F�N�g�ɕϊ����Ď��R�ό`�ɓ���
	���łɃX�}�[�g�I�u�W�F�N�g�ɂȂ��Ă���ꍇ�͎��R�ό`�̂�
	�������C�����I������Ă���ꍇ�͏��O�����ق����ǂ���������Ȃ��B
*/
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {

if(app.activeDocument.activeLayer.kind != LayerKind.SMARTOBJECT){
//========================================cahangeLayer to SmartObject
 var id557 = charIDToTypeID( "slct" );
 var desc108 = new ActionDescriptor();
 var id558 = charIDToTypeID( "null" );
 var ref77 = new ActionReference();
 var id559 = charIDToTypeID( "Mn  " );
 var id560 = charIDToTypeID( "MnIt" );
 var id561 = stringIDToTypeID( "newPlacedLayer" );
 ref77.putEnumerated( id559, id560, id561 );
 desc108.putReference( id558, ref77 );
 executeAction( id557, desc108, DialogModes.NO );
 }
//�X�}�[�g�I�u�W�F�N�g�̎��R�ό`�͑I��͈͂�����Ǝ��s�ł��Ȃ��̂ł����őI��͈͂���������
//app.activeDocument.selection.selectAll();
app.activeDocument.selection.deselect();

//====================================== free Tranceform
 var idslct = charIDToTypeID( "slct" );
 var desc74 = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref40 = new ActionReference();
 var idMn = charIDToTypeID( "Mn  " );
 var idMnIt = charIDToTypeID( "MnIt" );
 var idFrTr = charIDToTypeID( "FrTr" );
 ref40.putEnumerated( idMn, idMnIt, idFrTr );
 desc74.putReference( idnull, ref40 );
 executeAction( idslct, desc74, DialogModes.NO );

//�\�Ȃ�L�����Z���Ń��b�Z�[�W���o�Ȃ��悤�Ɂ�
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

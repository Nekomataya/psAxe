/*
	�I�����C�����O���[�v�����ăv���p�e�B�E�C���h�E���Ăяo��
*/
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {
//=========================== ���C������O���[�v
 var id1010 = stringIDToTypeID( "groupLayersEvent" );
 var desc190 = new ActionDescriptor();
 var id1011 = charIDToTypeID( "null" );
 var ref149 = new ActionReference();
 var id1012 = charIDToTypeID( "Lyr " );
 var id1013 = charIDToTypeID( "Ordn" );
 var id1014 = charIDToTypeID( "Trgt" );
 ref149.putEnumerated( id1012, id1013, id1014 );
 desc190.putReference( id1011, ref149 );
 executeAction( id1010, desc190, DialogModes.NO ); 
 //===========================�O���[�s���O���ꂽ���C�����疼�O�𐄑����ĕύX
 var myLayers=app.activeDocument.activeLayer;
 var myName=myLayers.layers[0].name.replace(/[-_\ ]?[0-9]*$/,"");
 myLayers.name=myName;
 //===========================���C���v���p�e�B���Ăяo��
/*
CS6�ȍ~�@���C���v���p�e�B���ĂׂȂ��l�Ȃ̂Ŏ��O�̃E�C���h�E�Ń��l�[�����s��
���l�[���Ȃ��̔ł��l��
�܂��@�v���p�e�B�l��UI�̓��C�u�����ɕғ������ق����ǂ�����

prompt�̂ق����R�[�f�B���O�������c

 var id1030 = charIDToTypeID( "slct" );
 var desc194 = new ActionDescriptor();
 var id1031 = charIDToTypeID( "null" );
 var ref153 = new ActionReference();
 var id1032 = charIDToTypeID( "Mn  " );
 var id1033 = charIDToTypeID( "MnIt" );
 var id1034 = charIDToTypeID( "LyrO" );
 ref153.putEnumerated( id1032, id1033, id1034 );
 desc194.putReference( id1031, ref153 );
 executeAction( id1030, desc194, DialogModes.ALL ); 
*/

var newName=prompt("���C�������m�F���Ă��������B",myLayers.name,"change Name?");

if((newName!=myName)&&(newName)&&(newName.length)){myLayers.name=newName};

} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}


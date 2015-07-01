/*	rotateSelection
編集>回転>角度指定 を呼び出す。
*/
ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");
try {
 var idslct = charIDToTypeID( "slct" );
 var desc77 = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref42 = new ActionReference();
 var idMn = charIDToTypeID( "Mn  " );
 var idMnIt = charIDToTypeID( "MnIt" );
 var idRtte = charIDToTypeID( "Rtte" );
 ref42.putEnumerated( idMn, idMnIt, idRtte );
 desc77.putReference( idnull, ref42 );
 executeAction( idslct, desc77, DialogModes.ALL );
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

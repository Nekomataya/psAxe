/*	rotateCanvas
カンバス>回転>角度指定 を呼び出す。
*/
ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");
try {
 var idRtte = charIDToTypeID( "Rtte" );
 var desc150 = new ActionDescriptor();
 var idnull = charIDToTypeID( "null" );
 var ref84 = new ActionReference();
 var idDcmn = charIDToTypeID( "Dcmn" );
 var idOrdn = charIDToTypeID( "Ordn" );
 var idFrst = charIDToTypeID( "Frst" );
 ref84.putEnumerated( idDcmn, idOrdn, idFrst );
 desc150.putReference( idnull, ref84 );
 executeAction( idRtte, desc150, DialogModes.ALL );
} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

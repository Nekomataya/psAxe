/*(afCopy)
	アニメフレームをコピー
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
// in case we double clicked the file
app.bringToFront();

ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");
try {var idcopy = charIDToTypeID( "copy" );
var desc181 = new ActionDescriptor();
var idnull = charIDToTypeID( "null" );
var ref161 = new ActionReference();
var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
var idOrdn = charIDToTypeID( "Ordn" );
var idTrgt = charIDToTypeID( "Trgt" );
ref161.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
desc181.putReference( idnull, ref161 );
executeAction( idcopy, desc181, DialogModes.ALL );
} catch(e){
if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}


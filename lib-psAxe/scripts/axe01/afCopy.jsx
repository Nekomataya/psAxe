/*(afCopy)
	アニメフレームをコピー
 */

ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");
try {
  var desc = new ActionDescriptor();
   var ref = new ActionReference();
    ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
   desc.putReference( charIDToTypeID( "null" ), ref );
  executeAction( charIDToTypeID( "copy" ), desc, DialogModes.ALL );
}catch(e){
if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

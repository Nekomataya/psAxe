/*(afPaste)
	アニメフレームを貼付
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop
// in case we double clicked the file
app.bringToFront();

ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {var idanimationPasteFrames = stringIDToTypeID( "animationPasteFrames" ); var desc182 = new ActionDescriptor(); var idnull = charIDToTypeID( "null" ); var ref162 = new ActionReference(); var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" ); ref162.putClass( idanimationFrameClass ); desc182.putReference( idnull, ref162 ); executeAction( idanimationPasteFrames, desc182, DialogModes.ALL );} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

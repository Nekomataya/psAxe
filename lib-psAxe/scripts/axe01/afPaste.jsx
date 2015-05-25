/*(afPaste)
	アニメフレームを貼付
 */
ErrStrs = {}; ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation"); try {var desc = new ActionDescriptor();var ref = new ActionReference();ref.putClass( stringIDToTypeID( "animationFrameClass" ) );desc.putReference( charIDToTypeID( "null" ), ref );executeAction( stringIDToTypeID( "animationPasteFrames" ), desc, DialogModes.ALL );} catch(e){if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {;} else{alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));}}

//Configure Script Sample レイヤからアニメーションフレームを作成
/*アニメパレットメニューの選択による操作。ドキュメント内のすべてのArtLayerが使用される。*/
ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");

try {
// =======================================================フレーム複製
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( charIDToTypeID( "Dplc" ), desc, DialogModes.NO );
// =======================================================フレーム全選択
    var desc = new ActionDescriptor();
executeAction( stringIDToTypeID( "animationSelectAll" ), desc, DialogModes.NO );
// =======================================================選択フレーム削除
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( charIDToTypeID( "Dlt " ), desc, DialogModes.NO );
     var desc = new ActionDescriptor();
executeAction(stringIDToTypeID( "animationFramesFromLayers" ),desc,DialogModes.ALL );
} catch(e){
	if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {
		;
	} else{
		alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));
	}
}

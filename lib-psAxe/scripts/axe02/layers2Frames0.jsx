//Configure Script Sample レイヤからアニメーションフレームを作成
/*アニメパレットメニューの選択による操作。ドキュメント内のすべてのArtLayerが使用される。*/
ErrStrs = {};
ErrStrs.USER_CANCELLED=localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");

try {
// =======================================================フレーム複製
var idDplc = charIDToTypeID( "Dplc" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDplc, desc, DialogModes.NO );
// =======================================================フレーム全選択
var idanimationSelectAll = stringIDToTypeID( "animationSelectAll" );
    var desc = new ActionDescriptor();
executeAction( idanimationSelectAll, desc, DialogModes.NO );
// =======================================================選択フレーム削除
var idDlt = charIDToTypeID( "Dlt " );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idanimationFrameClass = stringIDToTypeID( "animationFrameClass" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idanimationFrameClass, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idDlt, desc, DialogModes.NO );
	var idanimationFramesFromLayers = stringIDToTypeID( "animationFramesFromLayers" );
	var desc192 = new ActionDescriptor();
	executeAction(
		idanimationFramesFromLayers,
		desc192,
		DialogModes.ALL
	);
} catch(e){
	if (e.toString().indexOf(ErrStrs.USER_CANCELLED)!=-1) {
		;
	} else{
		alert(localize("$$$/ScriptingSupport/Error/CommandNotAvailable=The command is currently not available"));
	}
}

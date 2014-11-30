//　作業パスを鉛筆でストロークして作業パスを削除する。プレッシャなし。
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathStroke="var myPath=app.activeDocument.pathItems[0];";
//作業パスを鉛筆で描画
    myPathStroke+="myPath.strokePath(ToolType.PENCIL,false);";
//作業パスを削除
    myPathStroke+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory("パスをストローク", myPathStroke);
 }else{
     eval(myPathStroke);
 }
}

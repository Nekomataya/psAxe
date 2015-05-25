/*(レイヤ名末尾の数値部分を繰り上げ)
*/
var myTargetLayer=(app.documents.length)?app.activeDocument.activeLayer:false;
if(myTargetLayer){
	var nas=app.nas;
myTargetLayer.name=nas.incrStr(myTargetLayer.name,1,true)
}
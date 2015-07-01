/*(レイヤ名末尾の数値部分を繰り下げ)
*/
var myTargetLayer=(app.documents.length)?app.activeDocument.activeLayer:false;

if(myTargetLayer){
	nas=app.nas;
myTargetLayer.name=nas.incrStr(myTargetLayer.name,-1,true)
}
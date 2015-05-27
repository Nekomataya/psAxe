/*
	アニメセル用　Whiteパンチアウト
	レタス仕様でアルファチャンネルのない画像データから
	白([r,g,b]==[1.,1.,1.])部分を選択して削除するスクリプト
	色域選択でL==100.　の部分を選択して　削除後に選択領域を解除している。
	サスペンドヒストリが可能な場合は行う
*/

var myExecute="";
// =======================================================select color White
myExecute+="var descSelect = new ActionDescriptor();";
myExecute+="var idFzns = charIDToTypeID( \"Fzns\" );";
myExecute+="descSelect.putInteger( idFzns, 0 );";
myExecute+="var idMnm = charIDToTypeID( \"Mnm \" );";
myExecute+="var desc9 = new ActionDescriptor();";
myExecute+="var idLmnc = charIDToTypeID( \"Lmnc\" );";
myExecute+="desc9.putDouble( idLmnc, 100.000000 );";
myExecute+="var idA = charIDToTypeID( \"A   \" );";
myExecute+="desc9.putDouble( idA, 0.000000 );";
myExecute+="var idB = charIDToTypeID( \"B   \" );";
myExecute+="desc9.putDouble( idB, 0.000000 );";
myExecute+="var idLbCl = charIDToTypeID( \"LbCl\" );";
myExecute+="descSelect.putObject( idMnm, idLbCl, desc9 );";
myExecute+="var idMxm = charIDToTypeID( \"Mxm \" );";
myExecute+="var desc10 = new ActionDescriptor();";
myExecute+="var idLmnc = charIDToTypeID( \"Lmnc\" );";
myExecute+="desc10.putDouble( idLmnc, 100.000000 );";
myExecute+="var idA = charIDToTypeID( \"A   \" );";
myExecute+="desc10.putDouble( idA, 0.000000 );";
myExecute+="var idB = charIDToTypeID( \"B   \" );";
myExecute+="desc10.putDouble( idB, 0.000000 );";
myExecute+="var idLbCl = charIDToTypeID( \"LbCl\" );";
myExecute+="descSelect.putObject( idMxm, idLbCl, desc10 );";
myExecute+="var idcolorModel = stringIDToTypeID( \"colorModel\" );";
myExecute+="descSelect.putInteger( idcolorModel, 0 );";
myExecute+="executeAction( charIDToTypeID( \"ClrR\" ), descSelect, DialogModes.NO );";
//==============　selection clear and deselect
myExecute+="app.activeDocument.selection.clear();";
myExecute+="app.activeDocument.selection.deselect();";

if(app.activeDocument.suspendHistory){
app.activeDocument.suspendHistory ("白部分削除", myExecute ); 
}else{
eval(myExecute);
}

/*
	アニメセル用　下書きのポスタライズ
	画像をクリンアップする目的で領域化するスクリプト
	RGB各チャンネルを2段階にポスタライズする。
	赤青黒のピクセルを残して他を白に変換する

	白([r,g,b]==[1.,1.,1.])部分を選択して削除するスクリプト
	色域選択でL==100.　の部分を選択して　削除後に選択領域を解除している。
	サスペンドヒストリが可能な場合は行う
*/
var posterize2=function(){
//2階調ポスタライズ
 app.activeDocument.activeLayer.posterize(2)
//色域選択
/*
	アニメセル用　カラーパンチアウト
    Lab指定カラーを白で塗りつぶす。
*/
// =======================================================select color with Lab Color
 selectPixelsWithLab=function(myL,myA,myB,myRange){
var descSelect = new ActionDescriptor();
descSelect.putInteger( charIDToTypeID( "Fzns" ), myRange );
var desc9 = new ActionDescriptor();
desc9.putDouble( charIDToTypeID( "Lmnc" ), myL );
desc9.putDouble( charIDToTypeID( "A   " ), myA );
desc9.putDouble( charIDToTypeID( "B   " ), myB );
descSelect.putObject( charIDToTypeID( "Mnm " ), charIDToTypeID( "LbCl" ), desc9 );
var desc10 = new ActionDescriptor();
desc10.putDouble( charIDToTypeID( "Lmnc" ), myL );
desc10.putDouble( charIDToTypeID( "A   " ), myA );
desc10.putDouble( charIDToTypeID( "B   " ), myB );
descSelect.putObject( charIDToTypeID( "Mxm " ), charIDToTypeID( "LbCl" ), desc10 );
descSelect.putInteger( stringIDToTypeID( "colorModel" ), 0 );
executeAction( charIDToTypeID( "ClrR" ), descSelect, DialogModes.NO );

//==============　selection clear and deselect
//ケースによっては選択範囲がない場合があるので、その場合は何もしない
var mySelectionBounds=false;
try{mySelectionBounds=app.activeDocument.selection.bounds;}catch(err){};
  if(mySelectionBounds){
	app.activeDocument.selection.fill(app.backgroundColor,ColorBlendMode.NORMAL,100,false);
	app.activeDocument.selection.deselect();
  }
 }
//
selectPixelsWithLab(97.61,-15.75, 93.40,0);//Y
selectPixelsWithLab(87.82,-79.27, 81.00,0);//G
selectPixelsWithLab(60.17, 93.54,-60.50,0);//M
selectPixelsWithLab(90.66,-50.66,-14.96,0);//C
}
if(app.activeDocument.activeLayer){
	app.activeDocument.suspendHistory("posterize2","posterize2();")
}
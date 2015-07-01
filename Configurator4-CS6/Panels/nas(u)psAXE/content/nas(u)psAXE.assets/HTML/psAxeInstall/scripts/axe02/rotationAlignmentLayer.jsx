/*(回転アライメント)
選択範囲を作成した状態でこのスクリプトを実行してください。
選択領域の対角線を水平になるようにアクティブレイヤを回転します。
背景レイヤが選択されている場合は、動作スキップ

MacとWindowsでダイアログのボタン配置が逆なので判定して調整

ものさしツールと変形＞回転＞角度指定を連続して操作することで
同様の操作をPhotoshopの機能で行うことが可能。
その場合、ものさしツールは角度モードで使う必要がある。
角度モード＞[alt]+ドラッグ

レイヤセットの最上位にフォーカスが移る問題を調整
仮レイヤ削除のタイミングで自動的にフォーカスが移動してかつその後スクリプトからのアクセスができない様なので
削除前に先にアクティブであったレイヤの直上に移動するルーチンを追加 2011/12/03
*/
var isWindows=($.os.match(/windows/i))?true:false;
if(activeDocument.activeLayer.isBackgroundLayer){
　alert("通常レイヤを選択して実行してください :"+activeDocument.activeLayer.name);
}else{
var targetLayer=activeDocument.activeLayer;
//AE　ExpressionOtherMath 互換 角度<>ラジアン変換関数
//桁切らないほうが良いかも、運用してみて判断しましょう 2006/06/23
function degreesToRadians(degrees)
{
	return Math.floor((degrees/180.)*Math.PI*100000000)/100000000;
}
function radiansToDegrees(radians)
{
	return Math.floor(180. * (radians/Math.PI)* 100000)/100000;
}

//アクティブドキュメントの選択範囲のboundsを返す関数
//エラーーハンドリングが無いので注意
//選択範囲が無い場合、ドキュメント全体の範囲が戻る
activeDocument.selection.getBounds=function(){
	var currentActiveLayer=this.parent.activeLayer;
	var tempLayer=this.parent.artLayers.add();
	this.fill(app.foregroundColor);
	var myBounds=tempLayer.bounds;
	tempLayer.move(currentActiveLayer,ElementPlacement.PLACEBEFORE);
	tempLayer.remove();
	this.parent.activeLayer=currentActiveLayer;
	return myBounds;
}
//上のメソッドはライブラリに入れたい
//このスクリプトはレイヤ回転型　レイヤを直接操作するので選択範囲は無効
//選択範囲を使う場合は、ものさしツールと変形メニューを組み合わせた操作を推奨
var myBounds=activeDocument.selection.getBounds();
var myAngle=radiansToDegrees(Math.atan2((myBounds[3].as("px")-myBounds[1].as("px")),(myBounds[2].as("px")-myBounds[0].as("px"))));
if(isWindows){var msg="はい-反時計方向 :いいえ-時計方向"}else{var msg="いいえ-反時計方向:はい-時計方向 ";myAngle=-myAngle;};
//alert(activeDocument.activeLayer.name);
//var backupCn=app.activeDocument.channels.add();
//app.activeDocument.selection.store(backupCn);
//チャンネルにバックアップを取ったので画像チャンネルにフォーカスを戻す。
//activeDocument.activeLayer=targetLayer;
//app.activeDocument.selection.deselect();//いったんセレクション解除
if(confirm(msg)){targetLayer.rotate(-myAngle);}else{targetLayer.rotate(myAngle);}
}
//
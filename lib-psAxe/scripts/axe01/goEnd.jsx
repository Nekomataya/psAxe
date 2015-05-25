/*(goEnd)
	アニメフレームを末尾へ
	オプションでフォーカスも移動
タイムラインモード対応　移動をヒストリに置かない仕様に変更　2015.05
*/
if(app.nas){nas=app.nas;};
//+++++++++++++++++++++++++++++++++ここまで共用
var myExcute="";
//=============== コード
if(nas.axeVTC.getDuration()){
	myExcute+='nas.axeVTC.goFrame("e");';	
}else{
	myExcute+='nas.axeAFC.goFrame("e");';
}
eval(myExcute)

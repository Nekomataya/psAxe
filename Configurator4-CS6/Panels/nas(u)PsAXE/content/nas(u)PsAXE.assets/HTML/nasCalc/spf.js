/*
	電卓のサブファンクション定義ファイル
	非同期で読み込んでキー内容を置換する
*/
var SPFS=new Array();
//	初期値
SPFS[0]=[
["ceil","切り上げ",function(){pushValue(Math.ceil(operandStack.top()));}],
["round","四捨五入",function(){pushValue(Math.round(operandStack.top()));}],
["floor","切り捨て",function(){pushValue(Math.floor(operandStack.top()));}],
["rnd","ランダム",function(){pushValue(Math.random());}],
["rnd2","正規化ランダム",function(){pushValue(operandStack.pop()*Math.random());}],
["tot","合計",function(){pushKey('tot');}],
["avr","平均",function(){pushKey('avr');}],
["max","最大",function(){pushKey('max');}],
["min","最少",function(){pushKey('min');}]];
SPFS[0].name="Math-1";

//	三角関数
SPFS[1]=[
["r2d","radians>degrees",function(){pushValue(radiansToDegrees(operandStack.top()));}],
["d2r","degrees>radians",function(){pushValue(degreesToRadians(operandStack.top()));}],
["sin","sin",function(){pushValue(Math.sin(degreesToRadians(operandStack.top())));}],
["cos","cosin",function(){pushValue(Math.cos(degreesToRadians(operandStack.top())));}],
["tan","tan",function(){pushValue(Math.tan(degreesToRadians(operandStack.top())));}],
["asin","asin",function(){pushValue(radiansToDegrees(Math.asin(operandStack.top())));}],
["acos","acosin",function(){pushValue(radiansToDegrees(Math.acos(operandStack.top())));}],
["atan","atan",function(){pushValue(radiansToDegrees(Math.atan(operandStack.top())));}],
["atan2","atan2",function(){operandStack.push(radiansToDegrees(Math.atan2(operandStack.pop(),operandStack.pop())));syncST2IB();}]];
SPFS[1].name="Math-2";

//["abs","絶対値",function(){pushValue(Math.abs(operandStack.pop()));}],
//["PI","円周率",function(){pushValue(Math.PI);}],

//	定数I
SPFS[2]=[
["E","自然対数の底",function(){pushValue(Math.E);}],
["log2","log2",function(){pushValue(Math.LN2);}],
["log10","log10",function(){pushValue(Math.LN10);}],
["log2e","2を底とするeの対数",function(){pushValue(Math.LOG2E);}]
];
SPFS[2].name="Constant-1";


//	定数II
SPFS[3]=[
["Fph","１時間のフレーム数",function(){pushValue(nas.FRATE*60*60);}],
["Fpm","１分のフレーム数",function(){pushValue(nas.FRATE*60);}],
["Fps","毎秒フレーム数",function(){pushValue(nas.FRATE);}],
["nm","ノーティカルマイル(M)",function(){pushValue(1852);}],
["Eg","地球重力加速度(m/ss)",function(){pushValue(9.78);}],
["Er","地球赤道半径(km)",function(){pushValue(6378.140);}],
["Erd","地球自転角速度(rad/s)",function(){pushValue(0.7292/100000);}],
["","",function(){pushValue(0);}],
["getTC","",function(){pushValue(getTC());}]
];
SPFS[3].name="Constant-2";

//	debug
SPFS[4]=[
	["Fit","ウインドウのサイズ調整",function(){sizeToContent();}]
,	["cc2FR","cc2FR",function(){pushValue(nas_cc2FR(operandStack.top()));}]
,	["Start","Start",function(){pushValue(Start);}]
,	["Stop","Stop",function(){pushValue(Stop);}]
,	["000","000",function(){editBuf('000');}]
];
SPFS[4].name="Debug";
/*

*/
var CurrentSet=1;

function changeSPFB(myButton){
mySet=SPFS[CurrentSet];
	for(var idx=0;idx<9;idx++){
		if(idx<mySet.length){
			myButton=document.getElementById("SPF"+(idx+1));
			myButton.value=mySet[idx][0];
			myButton.title=mySet[idx][1];
			myButton.onclick=mySet[idx][2];
		}else{
			myButton=document.getElementById("SPF"+(idx+1));
			myButton.value=" ";
			myButton.title="no Function";
			myButton.onclick="viod(0);";
		}
	}
//	myButton.value==mySet.name;
	document.getElementById("PF2").value=mySet.name;
CurrentSet=(CurrentSet+1)%SPFS.length;
}
//

/*
	演算済のスタックと画面を同期させる
こちらの方がはるかにスッキリするのであとで置換
*/
	if(false){
function syncST2IB(){
	operandStack.dup();
switch (INPUTmode) {
case	"fct":
		if (TCf) {
		inBuf=nas_FR2TC(Math.floor(operandStack.pop()))[1];	//TC
		}else{
		inBuf=operandStack.pop().toString(10);	//TC保留
		}
		break;
default:	inBuf= operandStack.pop().toString(cardinal);
}
//ディスプレイ更新
	updateDP();
}
	}

/*
	getTC/putTC
	ストップウオッチ部分と電卓連結
*/
function getTC()
{
//何はなくとも現在時をキャプチャ
	var ClockClicks = new Date();ct_K = ClockClicks.getTime();
//電卓のステータスをみて計測中ならCC値を使用それ以外は(Stop - Start)
	var myCC=(STATUS=='stop')?(Stop-Start):(ct_K-Start);
//	alert("start:"+Start+"\nstop:"+Stop+"\ncc:"+ nas_cc2FR(myCC))
	newStack=true;pushValue(nas_cc2FR(myCC));
	return nas_cc2FR(myCC);
}
function putTC()
{
//何はなくとも現在時をキャプチャ
	var ClockClicks = new Date();ct_K = ClockClicks.getTime();
//強制的に計測時をリセット
	Start=ct_K-nas_FR2cc(operandStack.top());
	Stop=ct_K+1;
}

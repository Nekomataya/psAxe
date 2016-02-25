/*
 *	nasCalc.js
 *		アニメーション作業用電卓スクリプト部分
 */

/*
ねこまたや の電卓
 電卓
 ストップウオッチ その3つづき
Javascriptに移植してみるですよ。 2004/03/15 kiyo/Nekomataya

2004/03/20 ちょっと修正
ラップ表示エレメントとMaxLapの記述が違っていたら
MaxLapを減らしてエラーがでないようにした。
ラップ表示の初期値をヌルから0に変更
2004/04/13 ほつれ直し
いろいろ不具合修正。ラップ表示は正常になったかな？

2004/09/12	電卓と合体
2004/09/18	game.gr.jp のライブラリを借りて組み込む
2004/09/26	タイムコードくみこむどぉ
2004/10/12	再開、タイムコード組み込み中
2005/01/17	また持って再開 TCつづき
2005/01/22	電卓の仕様に合わせてラップメモリを変更
2005/04/17	タイムコードからフレーム数を返す関数修正
		25フレーム時のパラメータエラー
		100fpsの判定ミス
2008/12/03	AIR対応・あと色々と思い出したように手を入れる。
		ずっと放置してあったインクリメント演算を実装…忘れてた

このプログラムの著作権は「ねこまたや」にあります。

あなたは、このプログラムのこの著作権表示を改変しないかぎり
自由にプログラムの使用・複製・再配布などを行うことができます。

あなたは、このプログラムを自己の目的にしたがって改造することができます。
その場合、このプログラムを改造したものであることを明記して、この著作権表示を
添付するように努めてください。

このプログラムを使うも使わないもあなたの自由なのです。

ただし、作者はこのプログラムを使用したことによって起きたいかなる
不利益に対しても責任を負いません。
あなたは、あなたの判断と責任においてこのプログラムを使用するのです。

なんか、困ったことがあったら以下で連絡してもらえると何とかなるかもしれません。
http://www.nekomataya.info/
mailto:kiyo@nekomataya.info

そんな感じです。
*/

//	変数初期化
var VER="10120501";
var autoFit=true;//ウィンドウの自動リサイズ
/*	初期状態の設定
初期状態は、呼び出し側に記述された値で上書きするので
こちらを特に変更する必要はなさそう。
*/
//	時計の設定
var ccrate	=1000;		//最少計測単位(javascriptではミリ秒固定)
var MODE	="clock";	//表示の初期モード(時計)
var KeyMODE	="calculator";	//キー入力の初期モード(電卓)
var ClockOption	=12;		//時計の初期モード (12時制)
var STATUS	="stop";
//	計測モード
//ここの並びでループする	100fps 24FPS 30NDF 30DF 25FPS
RATEs = ["100fps","24FPS","30NDF","30DF","25FPS"];
var RATE	="24FPS";
//var FRATE	=24.;
nas.FRATE	=24.;
//	マウスクリックでアクションするかどうかのフラグ
var m_action	=true 		; 
//	ログ配列を初期化
Log	=new Array();
function nas_Push_Log(str) {Log = Log.concat([str])}
//	ログ 初期化してみる
nas_Push_Log( "Program Started " + VER);
nas_Push_Log( Date() );
nas_Push_Log( "     FrameRate" + nas.FRATE + "(" + RATE + ")");
nas_Push_Log( "     Start Mode      [" + MODE + "]" );
//ラップの最大保持数をここに記入
MaxLap = 0;
//	ラップ用のメモリを初期化

function nas_Clear_LAP() {
var checkMX=MaxLap;
	LAP = new Array(MaxLap);
	LapName = new Array(MaxLap);
		for(i = 0; i < MaxLap; i++){
			LapName[i] = "lap" + i;
			LAP[i] = nas_FR2TC(0)[1] ;
// ラップ表示欄は、きちんとラップメモリの数だけ作ってね。
// でないとラップを減らしちゃうよ。
try {
	document.getElementById(LapName[ i ]).value = LAP[i];
	var VoiD = document.getElementById(LapName[i]).value;
} catch(eRR) {
	checkMX= i + 1 ;	
	nas_Push_Log("\tcheck " + LapName[i] +" "+ eRR);
	nas_Push_Log(VoiD);
}
			} 
	MaxLap = checkMX;
	nas_Push_Log("\tLap memory clear");
 }
//	nas_Clear_LAP(MaxLap);
//	時間関連オブジェクトの初期化
ClockClicks = new Date();

var Start = ClockClicks.getTime();
var Stop = Start;

var nas_display = "";
//ランニングインジケータ設定
Ri = new Array(24) ;
var running = "";
function initRi(_base){
	for (n = 0; n < 25; n++) {
	Ri[n] = _base.substring(0,n + 1) + "|" + _base.substring(n + 2,26)
	}
	running = Ri[0];
}
/*	電卓部分の各変数を初期化	*/
var key_off=0;//キーボード入力フラグ
// カウンタの初期値
//10: 00000 ./20: 0:00:00 ./30: 000 + 00 ./40: p 1 / 0 + 00 ./50: p 1 / + 000 .
//11: 00001 _/21: 0:00:01 _/31: 000 + 01 _/41: p 1 / 0 + 01 _/51: p 1 / + 001 _
//var FCTo0 = 10;
//var FCTo1 = 31;
//var eFRM = 1 ;
var fctOpt = 20;//タイムコード計算の表示形式
var CALCmode=1;
var dEbug=false;
var inBuf='0';//入力バッファ、文字列で扱うこと
var siBuf='0';//サブ入力バッファ

//電卓のスタック
//スタック配列にメソッドとして push pop dup add sub div mulを登録

var operandStack = new Array();
	operandStack.fixed=false;//スタック編集フラグ
	
operandStack.dup=function()
{
	this[this.length]=this[this.length-1];
}

operandStack.push=function(n)
{
	this[this.length]=n;
}

operandStack.pop=function()
{
	if (this.length > 0)
	{
		result=1*(this[this.length - 1]);
		delete this[this.length-1];
		this.length --;
	} else {
		result=null;
	}
	return result;
}

operandStack.exc=function()
{
	if (this.length > 1)
	{
		var bkup_u=this[this.length-1];
		delete this[this.length-1];
		this.length --;
		var bkup_d=this[this.length-1];
		delete this[this.length-1];
		this.length --;
	this[this.length]=bkup_u;
	this[this.length]=bkup_d;
	}
	return ;
}

operandStack.top=function()
{
	if (this.length > 0)
	{
		result=this[this.length - 1];
	} else {
		result='';
	}
	return result;
}
operandStack.lock=function(sTatus)
{
	if(sTatus==''){sTatus=(this.fixed)?true:false;}
	this.fixed=sTatus;
	return this.fixed;
}

operandStack.add=function(){if(this.length>1){this.push(this.pop()+this.pop())};return this.top();};
operandStack.sub=function(){if(this.length>1){this.push(-this.pop()+this.pop())};return this.top();};
operandStack.mul=function(){if(this.length>1){this.push(this.pop()*this.pop())};return this.top();};
operandStack.div=function(){if(this.length>1){this.push((1/this.pop())*this.pop())};return this.top();};

//初期状態をプッシュ
operandStack.push(0);

var incrBuf=null;//くり返し演算バッファ
var newStack=0;//スタック内容確定のフラグ
var comBuf='';//オペレータバッファ
var maxPlace=12;//電卓としての最大桁数?
var bufPlace=1;//現在の入力バッファ桁数・初期値0 なので 最少は1桁
var bufDecimalPlace = 0;//入力バッファ小数部桁数
var checkRegex = /[0-9\.]+/ ;
//演算モード変数
var INPUTmode='dec'//bin,oct,dec,hex,frame,tc,sk,
var TCf=0;//TCフラグ TCモード時にバッファを10進に保留する際のフラグ
var OPf=0;//オペレーションフラグ 0:オペレータなし 1:オペレータあり 2:くり返しオペレータあり
var prefix = '';
var cardinal = 10;
var checkRegex = /^[0-9]$/;
//chgINPUTmode('dec');
/*
	入力バッファの内容をスタックに反映させて表示を同期
*/


function syncIB2ST(){
			operandStack.pop();
switch (INPUTmode) {
case	"bin":	operandStack.push(bin2dec(inBuf));break	//bin
case	"fct":
		if (TCf) {
		operandStack.push(nas_TC2FR(nas_STR2TC(inBuf)[1]));	//TC
		}else{
		operandStack.push(eval(prefix + inBuf));	//TC保留
		}
		break;
default:	operandStack.push(eval(prefix + inBuf));
}
//ディスプレイ更新
	updateDP();
//デバッグ表示
if (dEbug){
	var newDATA="inputBuffer : "+inBuf+'\noperandStackTop : '+operandStack.top();
	putsSTS(newDATA);
	nas_Push_Log(oldDATA + ':'+newDATA+':'+bufPlace+':'+bufDecimalPlace);
}
}
/*
	スタックトップの内容を入力バッファに反映させて表示を同期

*/

var syncIB4ST =function(X1){
// スタックトップの値を一時変数に取得
	var inBufvalue=operandStack.top() ;
//十進モード以外の場合は、整数にきり捨て
	if (! INPUTmode=="dec") {
		inBufvalue=Math.floor(inBufvalue);
	}
//バッファの内容を入力モード毎の文字列に変換してバッファ変数に格納
if (INPUTmode=="fct")	{
	inBuf=nas_FR2TC(inBufvalue.toString(cardinal))[2];//TC
		} else {
	inBuf=inBufvalue.toString(cardinal);//2~10進
		}
//でばぐ
if (dEbug){
putsCONS(
	''  + Math.round( operandStack.top() * Math.pow(10,maxPlace) ) +
	'/'+ Math.pow(10,maxPlace) 
	);
}
//
//ここで、バッファの内容から桁数を取得
	if (inBufvalue % 1 == 0){
//			小数桁なし(= 負数でズレる・TCで分岐)
		bufPlace=inBuf.length;
		bufDecimalPlace=0;
		slicePlace=0;
	}else{
//			小数部あり
		bufPlace=inBufvalue.toString().length - 1;
		bufDecimalPlace=inBufvalue.toString().length - inBufvalue.toString().search(/\./);
		slicePlace=maxPlace-(bufPlace-bufDecimalPlace+1);
		if (slicePlace < 0) slicePlace=0;
	}
	if (inBuf<0) bufPlace --;

//桁溢れしている場合は、バッファの値を桁どおりに丸めて表示と置き換え
	if (bufPlace > maxPlace){
inBufvalue=Math.round( inBufvalue * Math.pow(10,slicePlace) )/Math.pow(10,slicePlace);
inBuf=inBufvalue.toString(cardinal);
	}
//現在の基数で表示
	updateDP(X1);

//最後に入力バッファの値を明示的に文字列に変換
	inBuf=inBuf.toString(cardinal);
}
/*
	ユーザエージェントを確認してフラグを返す
	判定基準はユーザエージェント文字列
*/
function ckUA(){
//許可リスト
//ここにユーザエージェント文字列を記載したエージェントは拒否リストに載らないかぎりフラグを立てて返す。エントリは、ユーザエージェント文字列すべて。
agentsAllow=['Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)','Mozilla/5.0 (Macintosh; U; PPC Mac OS X; ja-jp) AppleWebKit/412 (KHTML, like Gecko) Safari/412','void'];
//拒否リスト 最優先に処理
agentsDeny=['Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)','void'];
//標準的なエージェントとバージョン 指定値以上を許可
	var ckvs=new Array();
		ckvs['MSIE']=5.5;
		ckvs['Opera']=7;
		ckvs['Safari']=150;
		ckvs['NN']=6.0;
		ckvs['AdobeAIR']=1.1;
		ckvs['Mozilla']=5.0;//その他のモジラ
	var agentFlag=-1;//初期値 判別不能時に初期値を返す
	var uaName = navigator.userAgent;//ユーザエージェント文字列を取得
	var uaVer = '';
	if (uaName.indexOf("Safari") > -1) {
		uaVer = uaName.match(/(Safari\/)([0-9\.]*)/)[2];
//		ver = new Array();
//		ver["85"] = "1.0";ver["100"] = "1.1";
//		ver["125"] = "1.2";ver["412"] = "2.0";
		n = uaVer.split(".")[0];uaVer = 1 * n ;
		uaName = "Safari";//サファリらしい
	}else{
		if(uaName.indexOf("AdobeAIR") > -1){
		uaVer = uaName.match(/(AdobeAIR[\ \/])([0-9]+\.[0-9]+)/)[2];
		//uaバージョン文字列がサブリビジョン付きになってるので対応する
		uaName = "AdobeAIR";//AIRである
			}else{
		if (uaName.indexOf("Opera") > -1) {
		uaVer = uaName.match(/(Opera[\ \/])([0-9\.]*)/)[2]
		uaName = "Opera";//オペラである
		}else{
			if (uaName.indexOf("MSIE") > -1) {
		uaVer = uaName.match(/(MSIE[\ \/])([0-9\.]*)/)[2];
		uaName = 'MSIE'
			}else{
				if (uaName.indexOf("Netscape") > -1) {
		uaVer = uaName.match(/(Netscape6?[\ \/])([0-9\.]*)/)[2];
		uaVer = (uaVer.split("\.")[0]*1)+(uaVer.split("\.")[1]/10)
		uaName = "NN";//NSにしてみる。
				}else{
			if (uaName.indexOf("Mozilla") > -1) {
		uaVer = uaName.match(/(Mozilla[\ \/])([0-9\.]*)/)[2];
		uaName = "Mozilla";//NSでないMozillaにしてみる。
			}else{
		uaVer = 'unKnown';
		uaName = 'unKnown';//知らないブラウザである。
		}}}}}}
	if (! uaName.match(/unKnown/)){
//ブラウザ名とバージョンから判定をとる
		if (uaVer >=ckvs[uaName]){
			agentFlag=1;//大丈夫;
		}else{
			agentFlag=0;//ダメダメ;
		}
	}
//	確認ブラウザか?
	for (aGent in agentsAllow) {
	if (agentsAllow[aGent] == navigator.userAgent){agentFlag=1;break;}
	}
//	確認否定ブラウザか?
	for (aGent in agentsDeny) {
	if (agentsDeny[aGent] == navigator.userAgent){agentFlag=0;break}
	}
return [agentFlag,uaName,uaVer];
}
/*
	たしかにUAによる判別は意味がない…必要なオブジェクトを確認する方が1024倍くらいマシなので
	そのうちこれは削除しようっと …今回はとりあえずメモしといて手をつけない(2008・12)
*/
/*
game.gr.jp のライブラリ
*/

/*/////////////// 押されたキーコード取得用関数   UseFree
========================================================
 Win  n4 n6 moz e4 e5 e6,
 Mac  n4 n6 moz e4.5 e5,
 Linux n4 n6 moz         
========================================================
 押されたキーコードを取得します。
 キーの文を取得したい場合は、getKEYSTR(e)を
 参照してください

 使用例  //押されたキーコードをダイアログに表示する
  alert( getKEYCODE(e) )

 Support http://game.gr.jp/js/
=======================================================*/

  //--ブラウザを調べてNNとIEの分岐を微調整します
  MSIE = navigator.userAgent.indexOf("MSIE")!=-1;

  //--押されたキーコードを返す
function getKEYCODE(e){  

      if(document.all)           return  event.keyCode
      else if(document.getElementById) 
            return (e.keyCode!=0)?e.keyCode:e.charCode
      else if(document.layers)   return  e.which
  }
//--修飾キーのための処理
//イベントを渡して CTRL/ALT/SHIFT 各キーの状態をチェック
function chkCtrl(e){ 

      if(document.getElementById && !MSIE )  
                                  return  e.ctrlKey
      else if(document.all)       return  event.ctrlKey
      else if(document.layers){
        var ctl=e.modifiers
        if( ctl==2 || ctl==3 || ctl==6 || ctl==7 ) 
             return  true
        else return  false
      }
}

function chkAlt(e){ 

      if(document.getElementById && !MSIE )  
                                  return  e.altKey
      else if(document.all)       return  event.altKey
      else if(document.layers){
        var ctl=e.modifiers
        if( ctl==1 || ctl==3 || ctl==5 || ctl==7 ) 
             return  true
        else return  false
      }
}

function chkShift(e){ 

      if(document.getElementById && !MSIE )  
                                  return  e.shiftKey
      else if(document.all)       return  event.shiftKey
      else if(document.layers){
        var ctl=e.modifiers
        if(  ctl==4 || ctl==5 || ctl==6 || ctl==7 ) 
             return  true
        else return  false
      }
}

/*///////////////////////////// HTML出力用関数   UseFree
========================================================
 Win  n4 n6 moz e4 e5 e6,
 Mac  n4 n6 moz e4.5 e5,
 Linux n4 n6 moz         
========================================================
  使用例
  outputLAYER('レイヤー名',出力するHTML) 

 Support http://game.gr.jp/js/
=======================================================*/

 function outputLAYER(layName,html){

    if(document.getElementById){       //N6,Moz,IE5,IE6用
      document.getElementById(layName).innerHTML=html

    } else if(document.all){                      //IE4用
      document.all(layName).innerHTML=html

    } else if(document.layers) {                  //NN4用
       with(document.layers[layName].document){
         open()
         write(html)
         close()
      }
    }

  }

/*///////////////////////////// HTML出力用関数ここまで */

  //--キーeventをセットする

  document.onkeydown = nas_InputD ;
  document.onkeypress = nas_InputP ;
//  if(document.layers)
//               document.captureEvents(Event.KEYPRESS)
  self.focus()
/*
ストップウオッチの関数
*/
//	clock clicks の値から表示モード別に表示値を生成


function nas_cc2dp(cc) {
	if (MODE == "watch") {
		frms = nas_cc2FR( cc - Start );
		TC = nas_FR2TC( frms );
		f = TC[0][3];
	return TC[1] ;
	} else  {
		xNow = new Date();
		h = xNow.getHours();
		m = xNow.getMinutes();
		s = xNow.getSeconds();
		switch (ClockOption) {
case "12":
	if(h <=11) {tf="AM"} else {h = h -12; tf="PM"};
clockdisplay =  nas_Zfill(h,2)+ ":" + nas_Zfill(m,2) + ":" + nas_Zfill(s,2) + " " + tf;
	break;
default:
clockdisplay = ".  " + nas_Zfill(h,2)+ ":" + nas_Zfill(m,2) + ":" + nas_Zfill(s,2) + "  ." 
		}
return clockdisplay
	}
}
//	end proc
/*
文字列を分割してTC文字列またはTC配列にして戻す
012345678 > 012:34:56:78,012,34,56,78
戻り値の形式は、nas_FR2TC()に準ずる。
TC=[h,m,s,f]
[TC,TCs]
*/


function nas_STR2TC(tcString){
//負の数ならフラグを立てて絶対値をとる
	var neG = 0;
	if (tcString<0){neG=1;tcString=Math.abs(tcString);alert("HitHitHit")}
//小数以下を捨てる
	tcString=Math.floor(tcString);
	var sepStr=":"//
	switch (RATE) {
case '30NDF':	sepStr=':';break;
case '30DF':	sepStr=';';break;
case '24FPS':	sepStr='+';break;
case '25FPS':	sepStr='-';break;
case '100fps':	sepStr='.';break;
default	:	sepStr=':';
	}
	tcString=nas_Zfill(tcString,8);//桁数不足を避けるためにゼロを加える。
	h =tcString.substr(0,tcString.length-6);
	m =tcString.substr(tcString.length-6,2);
	s =tcString.substr(tcString.length-4,2);
	f =tcString.substr(tcString.length-2,2);
TC = [h,m,s,f]
TCs = h+":"+m+":"+s+sepStr+f;
	if (neG){return nas_FR2TC(nas_TC2FR(TCs)*-1)[0][1];
	}else{
	return [TC,TCs];
	}
}
// end proc
/*
TCから、フレーム数を返す。
引数は 配列[h,m,s,f] または TC文字列
配列の場合は、現在のフレームレート識別変数を参照する。
文字列の場合は、ローカルに判定
hh:mm:ss:ff	30NDF
hh:mm:ss;ff	30DF
hh:mm:ss+ff	24FPS
hh:mm:ss-ff	25FPS
hh:mm:ss.ff	100fps
文字列の場合は、他の不定フレームレートを解釈しない。
その場合は、配列とフレームレートを外部参照できるようにすること
*/


function nas_TC2FR(TC) {
var rATE=RATE;
	if (TC.match(/^([0-9]*):?([0-9]*):?([0-9]*)([-;\+:\.]{1})([0-9]*)$/)) {
		var sTC=[0,0,0,0,];
		sTC=[RegExp.$1,RegExp.$2,RegExp.$3,RegExp.$5,''];
//配列の並び替えルーチンまだ
var idn=3;
var TC=[0,0,0,0];
for(idx=3;idx>=0;idx--){
	if (sTC[idx]==sTC[4]) { continue } else {TC[idn]=sTC[idx];idn--}
}
//alert(sTC[idx] + '=' + sTC[4])
		switch (RegExp.$4) {
case	':':	rATE='30NDF';break;
case	';':	rATE='30DF';break;
case	'+':	rATE='24FPS';break;
case	'-':	rATE='25FPS';break;
case	'.':	rATE='100fps';break;
default	:	rATE=RATE;
		}
//TC=sTC;
	} else {
//マッチしなかった場合、引数を返して終了
	return TC;
	}
//TCのフォーマットは [h,m,s,f] 配列にする
	h = 1*TC[0]; m = 1*TC[1]; s = 1*TC[2]; f = 1*TC[3];
switch(rATE) {
case "100fps":
	FR = h * 360000 + m * 6000 + s * 100 + f ; break;
case "24FPS":
	FR = h * 86400 + m * 1440 + s * 24 + f ; break;
case "30NDF":
	FR = h * 108000 + m * 1800 + s * 30 + f ; break;
case "30DF":

/* old
	FR  = h * 107892;//h
	FR += Math.floor(m / 10) * 17982 ;//10m
	if((m % 10) != 0) {
		FR += s * 30 + f
	} else {
		if(s) {
FR = FR + (m % 10) * 1800 - ((m % 10) - 1) * 2 + s * 28 + (s - 1) * 2 + f ;
		} else {
if(f <= 1) {f = f + 2 }
FR = FR + (m % 10) * 1800 - ((m % 10) - 1) * 2 + f - 2;
		}
	}
*/
	FR  = h * 107892;//時
	FR += Math.floor(m / 10) * 17982  ;//＋10分単位で加算
	FR += (m % 10) * 1798;//ひとけた分乗算
	FR += ((m % 10)>0)? 2 : 0;//1分以上なら読み飛ばさなかった2フレームを加算
	FR += s * 30;//秒数乗算
	FR -= (((m % 10)>0)&&(s>0))? 2 : 0;//00 10 20 30 40 50 分の例外フレームを減算して解決
	FR += f;//フレームを加算
	FR -= (((m % 10)>0)&&(s==0)&&(f>=2))? 2:0;//例外ドロップフレームを減算
//ここで存在しないはずの :00 :01フレームを減算対象外にして後ろに送る

	break;
default :
	var TmpRate=(rATE=="25FPS")? 25 : rATE;//暫定
	FR = h * TmpRate * 3600 + m * TmpRate * 60 + s * TmpRate + f;
}
return FR }
//	end proc
/*
//	TC値からフレーム値を算出


function nas_TC2FR(TC) {
//TCのフォーマットは [h,m,s,f] 配列にする
	h = TC[0]; m = TC[1]; s = TC[2]; f = TC[3];
switch(RATE) {
case "100fps":
	FR = h * 360000 + m * 6000 + s * 100 + f ; break;
case "24FPS":
	FR = h * 86400 + m * 1440 + s * 24 + f ; break;
case "30NDF":
	FR = h * 108000 + m * 1800 + s * 30 + f ; break;
case "30DF"://ドロップフレーム処理
	FR = h * 107892 + (m / 10) * 17982  ;//時＋分
	if((m % 10) != 0) {
		FR = FR + s * 30 + f;//毎正分以外は30fで加算
	} else {
//それ以外はさらに分岐
		if(s) {
//
FR = FR + (m % 10) * 1800 - ((m % 10) - 1) * 2 + s * 28 + (s - 1) * 2 + f ;
		} else {
//
if(f <= 1) {f = f + 2 }
FR = FR + (m % 10) * 1800 - ((m % 10) - 1) * 2 + f - 2;
		}
	}
	break;
default :
	FR = h * RATE * 3600 + m * RATE * 60 + s * RATE + f
}
return FR }
//	end proc
*/
//	FR値からTC値を算出


function nas_FR2TC(FR) {
	if (FR<0){FR=(24*60*60*nas.FRATE)-(Math.abs(FR)%(24*60*60*nas.FRATE))}
	switch (RATE) {
case "100fps":
	h = Math.floor(FR / 360000) % 24;
	m = Math.floor(FR / 6000) % 60;
	s = Math.floor(FR / 100) % 60;
	f = Math.floor(FR) % 100;
TCs = nas_Zfill((h%24),2)+":"+nas_Zfill(m,2)+":"+nas_Zfill(s,2)+"."+nas_Zfill(f,2);
	break;
case "24FPS":
	h = Math.floor(FR / 86400) % 24;
	m = Math.floor(FR / 1440) % 60;
	s = Math.floor(FR / 24) % 60;
	f = Math.floor(FR) % 24;
TCs = nas_Zfill((h%24),2)+":"+nas_Zfill(m,2)+":"+nas_Zfill(s,2)+"+"+nas_Zfill(f,2);
	break;
case "30NDF":
	h =Math.floor(FR / 108000) % 24;
	m =Math.floor(FR / 1800) % 60;
	s =Math.floor(FR / 30) % 60;
	f =Math.floor(FR) % 30;
TCs = nas_Zfill((h%24),2)+":"+nas_Zfill(m,2)+":"+nas_Zfill(s,2)+":"+nas_Zfill(f,2);
	break;
case "30DF":
	if(FR<0){FR=2589408+(FR%2589408)};
	h =Math.floor((FR / 107892) % 24);
//		mを10分単位でクリップすると計算が単純化されるはず
	var fRh = FR % 107892;//未処理フレーム
	var md =Math.floor(fRh/17982) ;//10分単位
	var mu =((fRh % 17982)<1800)? 0 : Math.floor(((fRh % 17982)-1800) / 1798)+1;//10分以下の分数
	m  = md*10 + mu;//加算して分数
	fRm = fRh -(17982*md)-(1798*mu);
	fRm -= (mu==0)? 0 : 2;//正分まで処理を終えた残りフレーム
	s = (mu == 0)? Math.floor(fRm/30):Math.floor((fRm+2)/30);//秒数・例外を除きドロップ2フレ補償
	fRs = ((mu == 0)||(s == 0))? fRm - (s * 30):fRm - (s * 30) + 2;
	f=((mu==0)||(s!=0))? fRs:fRs+2;
TCs = nas_Zfill((h%24),2)+":"+nas_Zfill(m,2)+":"+nas_Zfill(s,2)+";"+nas_Zfill(f,2);
	break;
default :
	h = Math.floor(FR / (nas.FRATE * 3600)) % 24;
	m = Math.floor(FR / (nas.FRATE * 60)) % 60;
	s = Math.floor(FR / nas.FRATE) % 60;
	f = Math.floor(FR) % Math.floor(nas.FRATE);
TCs = nas_Zfill((h%24),2)+":"+nas_Zfill(m,2)+":"+nas_Zfill(s,2)+"-"+nas_Zfill(f,2)
}
TC = [(h%24),m,s,f];//TC配列
sTC =(h%24)*1000000+m*10000+s*100+f;//セパレータなしの10進型TC
	return [TC,TCs,sTC.toString(10)];
}
//	end proc

//	cc値からFR値


function nas_cc2FR(cc) {
//global ccrate nas.FRATE
	FR = Math.floor((nas.FRATE * cc) / ccrate)
	return FR
}
//	end proc
//	FR値からcc値


function nas_FR2cc(FR) {return Math.floor((FR / nas.FRATE) * ccrate)}
//	end proc
//	ゼロ埋め
function nas_Zfill(n,s) {if(n < Math.pow(10,(s - 1))) {
	rt = Math.pow(10,s) + n + "";
//document.getElementById("sTatus").innerHTML = rt;
//return rt.substr(1,rt.length-1);
return rt.substr(rt.length-s,s);
} else {
return "" + n}}
//	終了
//	tclsh 互換リスト操作サブプロシージャ
//	lsearch(配列,検索値)


function nas_Alsearch(arr,ser) {for(n=0; n<arr.length; n++){if( arr[n] == ser ){ return n; break;}}}
//	フレームレート変更


function nas_ChangeRATE(newrate) {
	ClockClicks = new Date();
//	MODE = "watch";
//キャンセル用に変更前の値を退避
	cancel_Action = "ChangeRATE";oldrate = RATE;
//TCモードならばスタックの内容を時間に変換して保存(挿入)

switch(newrate) {
case "next":
newrate = RATEs[ nas_Alsearch(["25FPS","100fps","24FPS","30NDF","30DF"],pastrate) ];
break;
case "24FPS":
case "25FPS":
case "100fps":
case "30NDF":
case "30DF":	newrate=newrate;break;
default:
A = isNaN(newrate);
if(A == true) {newrate = "100fps"} else {
if(newrate <=0) {newrate = "100fps"} else {if(newrate >= 101) {newrate = "100fps"} else {newrate = newrate}}}
}
	switch(newrate) {
case "100fps":	nas.FRATE = 100.	; RATE = newrate; pastrate = RATE; break;
case "24FPS":	nas.FRATE = 24.	; RATE = newrate; pastrate = RATE; break;
case "30NDF":	nas.FRATE = 30.	; RATE = newrate; pastrate = RATE; break;
case "30DF":	nas.FRATE = 29.97	; RATE = newrate; pastrate = RATE; break;
case "25FPS":	nas.FRATE = 25.	; RATE = newrate; pastrate = RATE; break;
default:	nas.FRATE = newrate ; RATE = newrate + "fps";
	}
	switch(STATUS) {
case "stop": document.getElementById("nas_display").value = nas_FR2TC(nas_cc2FR(Stop - Start))[1]; break;
case "run\-lap": break;
case "run": document.getElementById("nas_display").value = nas_cc2dp(ClockClicks.getTime()) ; break;
default :
	}
//TCモードの場合はスタックの内容を新しいフレームレートで更新(挿入)
	document.getElementById("nas_RATE").innerHTML = RATE;
	nas_Push_Log("Change RATE\t"+ newrate )
	nas_Push_Log("Change nas.FRATE\t"+ nas.FRATE )
	updateDP();//電卓ディスプレイの更新
}
//	end proc

function nas_ChangeKBD(newmode) {
	switch(newmode) {
case "calculator":
case "stopwatch":
	KeyMODE = newmode; break;
default:
	KeyMODE = ['stopwatch','calculator'][nas_Alsearch(['calculator','stopwatch'],KeyMODE)];
	}
//	document.getElementById("CHG.value=KeyMODE;
	switch(KeyMODE) {
case "calculator":
	m_action=false ;
	nas_Push_Log("Change Mode calculator");
//	document.getElementById("CHG.src="./images/02.gif";
	document.getElementById("CHG").src="./images/02.gif";
		break;
case "stopwatch":
	m_action=true ;
	nas_Push_Log("Change Mode stopwatch");
//	document.getElementById("CHG.src="./images/01.gif";
	document.getElementById("CHG").src="./images/01.gif";
		break;
default: nas_Push_Log('error nas_ChangeKBD()');

	}
return false;}
//	end proc


function nas_ChangeMODE(newmode) {
	switch(newmode) {
case "clock":
case "watch":
	MODE = newmode; break;
default:
	MODE = ['watch','clock'][nas_Alsearch(['clock','watch'],MODE)];
	}
	switch(MODE) {
case "clock":
//	m_action=false ;
	nas_Push_Log("Change Mode Clock");
//	document.getElementById("CHG_clock.value="CLOCK";
	document.getElementById("CHG_clock").src="./images/04.gif";
		break;
case "watch":
//	m_action=false ;
	nas_Push_Log("Change Mode Stop-Watch");
//	document.getElementById("CHG_clock.value="WATCH";
	document.getElementById("CHG_clock").src="./images/03.gif";
		break;
default: nas_Push_Log('error nas_ChangeMODE()');

	}
return false;
}
//	end proc
//表示用インターバルプロシージャ


function nas_update_View() {
	ClockClicks = new Date();
frms = Math.floor((ClockClicks.getTime() - Start) / (ccrate / nas.FRATE));
	TC = nas_FR2TC(frms);
	f = TC[0][3];
		switch(MODE) {
case "clock": nas_display = nas_cc2dp(0);
	if(nas_display != document.getElementById("nas_display").value) {
		document.getElementById("nas_display").value = nas_display}
	break;
case "watch":
	switch(STATUS) {
case "stop":
	nas_display = nas_FR2TC(nas_cc2FR(Stop - Start))[1];
	if(nas_display != document.getElementById("nas_display").value) {
		document.getElementById("nas_display").value = nas_display}
	break;
case "run":
if(TC[1] != document.getElementById("nas_display").value ) {
	document.getElementById("nas_display").value = TC[1]}
	 break;
default:
	}
		}
	switch(STATUS) {
case "run\-lap":	;
case "run":
running = Ri[Math.floor(24 * (f / nas.FRATE))];
if(running != document.getElementById("nas_Ri").value) {document.getElementById("nas_Ri").value = running }
break;
default:
	}
}
//	end proc


function nas_push_LAP(cc) {
if(true){
	var LAP = nas_FR2TC(nas_cc2FR(cc - Start))[1];
	document.getElementById("nas_display").value = LAP;
//コンソールが開いているときだけラップを表示
	if(document.getElementById("consoleBox").style.display!="none"){putsCONS(LAP)}

}else{
//	従来のストップウオッチ用
	for(var n = MaxLap - 1 ;n > 0 ;n-- ) {LAP[n] = LAP[n - 1];}
	LAP[0] = nas_FR2TC(nas_cc2FR(cc - Start))[1];
	document.getElementById("nas_display").value = LAP[0];
	for(var n=0 ; n<MaxLap ;n++){document.getElementById("lap"+ n).value = LAP[n];}
}
//	LOG
	switch(STATUS) {
case "stop":    PreFix ="Stop"; break;
case "run":     ;
case "run\-lap":	PreFix ="Lap"; break;
default :       PreFix =""
	}
	nas_Push_Log(PreFix + "\t" + LAP)
}
//	end proc
//	スタートとストップ引数なし


function nas_Start_Stop() {
//呼出元にしたがって 基準時刻の選択 ダメならとりあえず現在時刻をとる
switch (nas_capt) {
case "Key"	:now = ct_K; break;
case "Object"	:now = ct_O; break;
case "Mouse"	:now = ct_M; break;
default:
ClockClicks = new Date(); now =ClockClicks.getTime()
}

	switch(STATUS) {
case "stop":    Start = now - (Stop - Start);
		if(Stop != 0) {nas_push_LAP(now)} else {nas_Push_Log("Start")}
		STATUS ="run"; break;
case "run":     nas_cc2dp(now);
		Stop = now;
		STATUS = "stop"; break;
case "run\-lap":STATUS = "run"; break;
	}
	switch(MODE) {
case "clock":
nas_ChangeMODE('watch');break;
default : 
	}
document.getElementById("sTatus").innerHTML = STATUS
}
//	end proc


function nas_Lap_Reset() {

//呼出元にしたがって 基準時刻の選択 ダメならとりあえず現在時刻をとる
switch (nas_capt) {
case "Key"	:now = ct_K; break;
case "Object"	:now = ct_O; break;
case "Mouse"	:now = ct_M; break;
default:
ClockClicks = new Date(); now =ClockClicks.getTime()
}
	switch(STATUS) {
case "stop":    nas_cc2dp(Start);
		if(Stop != 0) {nas_push_LAP(Stop)}
		Start = 0 ; Stop = 0 ; nas_Push_Log("\treset\n");
		running = Ri[0];
		document.getElementById("nas_Ri").value = running;
		document.getElementById("sTatus").innerHTML = "ready";
		break;
case "run":     nas_push_LAP(now);
		STATUS = "run-lap";
		document.getElementById("sTatus").innerHTML = STATUS;
		break;
case "run-lap": nas_cc2dp(now);
		nas_push_LAP(now);
	}
}
//	end proc


function nas_InputD(e) {
//キーダウンをキャプチャ
//何はなくとも現在時を保持
ClockClicks = new Date();ct_K = ClockClicks.getTime();nas_capt = "Key";
//putsCONS(getKEYCODE(e)+'/'+String.fromCharCode(getKEYCODE(e)));
//putsCONS(nas_cc2FR(ct_K)+"_");
	if ( KeyMODE == 'calculator' )
	{		return true;
	} else {

	key = getKEYCODE(e);//キーコードを取得
	switch(key) {
case 13 :       nas_Lap_Reset(); break;//enter
//case 27 :       nas_Clear_LAP(); break;//esc
case 32 :       nas_Start_Stop(); break;//space
case 49 :       nas_ChangeRATE("100fps"); break;//1
case 50 :       nas_ChangeRATE("24FPS"); break;//2
case 51 :       nas_ChangeRATE("30NDF"); break;//3
case 52 :       nas_ChangeRATE("30DF"); break;//4
case 53 :       nas_ChangeRATE("25FPS"); break;//5
case 65 :       about_nas(); break;//a
case 76 :       nas_write_Log(); break;//l
case 84 :       nas_ChangeMODE(); break;//T
//case 113 :	nas_ChangeKBD();break;//q 入力モード切り換え
default :       return false
	}
return false;
	}
}
//キープレスをキャプチャ


function nas_InputP(e) {
//何はなくとも現在時を保持
ClockClicks = new Date();ct_K = ClockClicks.getTime();nas_capt = "Key";
putsSTS(getKEYCODE(e)+'/'+String.fromCharCode(getKEYCODE(e)));
//putsCONS(nas_cc2FR(ct_K));
	if (key_off) return true;
//イベントを受け取る仕様に変更
	key = getKEYCODE(e);//キーコードを取得
	if ( KeyMODE == 'calculator' ) {
//putsCONS(key + ';')
//if (! document.getElementById("SIbuf").focus()) return true;
	switch(key) {
case 9 :       ;//TAB
case 37 :       ;//left
case 38 :       ;//up
case 39 :       ;//right
case 40 :       ;//down
case 32 :       return true; break;//SPACE
case 8 :       pushKey('BS'); break;//bs
case 3 :       ;//enter(mac)
case 13 :       pushKey('='); break;//Return
case 27 :       pushKey('AC'); break;//esc
case 127 :       pushKey('CE'); break;//del
/*
144はnumlockだった
*/
case 86 :	pushKey('MOD');break;//>MOD
case 90 :	pushKey('delta');break;//>delta
case 109 :	pushKey('m2i');break;//>m2i
//case 109 :	if(TC){pushKey('m')}else{pushKey('m2i')};break;//>m2i
case 105 :	pushKey('i2m');break;//>i2m
case 77 :	qpimp(operandStack.top(),'mm');break;//M>mm
case 73 :	qpimp(operandStack.top(),'in');break;//I>inch
case 80 :	qpimp(operandStack.top(),'pt');break;//P>point
case 81 :	qpimp(operandStack.top(),'Q');break;//Q>Q
case 112 :	qpimp(operandStack.top(),'px');break;//p>pixel
// case 113 :	nas_ChangeKBD('stopwatch');break;//入力モード切り換え

//case  :	pushKey('');break;//
default :// String.fromCharCode(getKEYCODE(e)) 等価である
	pushKey(String.fromCharCode(key));
	}
return false ;
	}
//
return true ;
}
//	end proc
//マウスボタンのキャプチャ


function nas_Mouse(Bt,Ob) {
ClockClicks = new Date();ct_M = ClockClicks.getTime();nas_capt = "Mouse"
if (KeyMODE != 'stopwatch') return false;
//	alert(navigator.appName);
//IEのとき event.button event.srcElement と入れ換える
if( navigator.appName == "Microsoft Internet Explorer" ) { Ob = event.srcElement.type ;Bt = event.button ;
// for IE
switch(Ob) {
case "text":	;
case "":	;
case "button":	m_action = false ;break ;
default:	m_action = true
}
 } else {
// for NN
if( Ob == "[object HTMLFormElement]") {m_action = true} else {m_action = false}
}
if( m_action != false) {
	switch(Bt) {
case 4: ;
case 2: ;
case 3:	nas_Lap_Reset(); break;
default:nas_Start_Stop()
	}
} else {return false }
}
//	end proc
/*	汎用のアクションキャプチャ
 呼び出しタイムラグを最少にする必要のある場合は、以下の書式でこの関数を呼び出します。
	nas_Capt("機能名称") 
 必要な引数は、受け渡し用の変数を別に立てて あらかじめ値を入力する必要あり。
 (ただし今のところべつになし)
 ここにある時間関連コマンド以外の関数は、直接呼び出す。
*/


function nas_Capt(Action_Name){
ClockClicks = new Date();ct_O = ClockClicks.getTime();nas_capt = "Object";
CaptureAction = Action_Name ;

	switch(Action_Name) {
case "Lap_Reset"	: nas_Lap_Reset(); break;
//case "Clear_LAP"	: nas_Clear_LAP(); break;
case "Start_Stop"	: nas_Start_Stop(); break;
default	: return false
	} 
}
// end 


//ログの表示 コンソールを開いて書き出す。


function nas_write_Log(){
	document.getElementById("CONS").value='';
	for(l=0; l<Log.length;l ++){putsCONS(Log[l])}
}

//	end proc
//############### ABOUT Display


function about_nas(){
alert("Nekomataya Animation System \(Unsupported\) \n電卓+StopWatch "+ VER + "\n2008/11/28\n http://www.nekomataya.info/")
}
/*
電卓部分
*/

//コンソールにメッセージ表示

function putsCONS(string){
//コンソールが表示されていない場合は表示する。
	if(document.getElementById("consoleBox").style.display=="none"){kb_Flip("cons");}
//文字を表示する
	document.getElementById("CONS").value += string +'\n';
}
//ステータス行にメッセージ表示


function putsSTS(string){
	window.status = string ;
}
// カウンタタイプの変更


function chgFCTopt() {
	fctOpt = document.getElementById("FCTopt").value;
}

//二進数文字列から10進数


function bin2dec(bin) {
	var dec = 0;
	for (p=0;p<bin.length;p++){dec += bin.charAt(p) *  Math.pow(2,bin.length-p-1)};
	return dec
}
// 入力モード変更 モード名称は dec oct hex bin tcまたは next


function chgINPUTmode(mode) {
	if (mode == 'next'){
		mode = ["dec","fct","oct","hex","bin"][nas_Alsearch(["fct","oct","hex","bin","dec"],INPUTmode)];
	}
	INPUTmode=mode;

switch (mode) {
case "fct":	checkRegex =/^[0-9]$/;prefix = ''	;cardinal =10;TCf=1;break;
case "bin":	checkRegex =/^[01]$/;prefix = ''	;cardinal =2;	break;
case "oct":	checkRegex =/^[0-7]$/;prefix = '0'	;cardinal =8;	break;
case "hex":	checkRegex =/^[0-9A-F]$/;prefix = '0x'	;cardinal =16;	break;
default:	checkRegex =/^[0-9]$/;prefix = ''	;cardinal =10;	break;
}
//ナンバボタン調整
myButtonIdx=["2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
for(var idx=0;idx<myButtonIdx.length;idx++){
	document.getElementById(myButtonIdx[idx]).disabled=(myButtonIdx[idx].match(checkRegex))?false:true;
}
//数値モード再表示
document.getElementById("inputMode").innerHTML=
["10","TC","8","16","2"][nas_Alsearch(["dec","fct","oct","hex","bin"],INPUTmode)];
document.getElementById("inputModeSelector").value=INPUTmode;
document.getElementById("S"+INPUTmode).checked=true;
pushKey('=');
return false;
};

//解像度の変更


function chgResolution(vAlue){
	if (! isNaN(vAlue)) {
		if ( vAlue <= 0 || vAlue >= 12000) return;
	nas.RESOLUTION=vAlue/2.540 ;

	document.getElementById("Resolution").innerHTML=Math.floor(nas.Dpi()) + 'dpi';
	}
}
//電卓バッファに対する直接入力の処理


function checkINbuf(){
			nas_Push_Log("INbuf check");
//テキストエリアの内容が評価可能ならば、評価してバッファに格納して復帰
	try {
		var eXp=eval(document.getElementById("INbuf").innerHTML);
	} catch(eRR) {eXp="cannoteval";}
		if (! isNaN(eXp)) {
			nas_Push_Log("ok_eval");
			operandStack.pop();
			operandStack.push(eXp);
			inBuf=eXp.toString();
		} else {
//評価に失敗した場合でも、TCモードの場合はTC文字列として再評価する
	if (document.getElementById("INbuf").innerHTML.match(/^([0-9]*):?([0-9]*):?([0-9]*)([-;\+:]?)([0-9]*)$/)) {	eXp=nas_TC2FR(document.getElementById("INbuf").innerHTML);
			nas_Push_Log("ok_TC");
			operandStack.pop();
			operandStack.push(eXp);
			inBuf=eXp;
} else {

nas_Push_Log("ng");
}
		}
		document.getElementById("INbuf").innerHTML = inBuf.toString(cardinal);
		pushKey("=");
	return;
}


function putsStack(){
	var resUlt="";
for (num=operandStack.length;num>0;num--){resUlt+=operandStack[num-1] +"\n"}
	document.getElementById("RESULT").value=resUlt;
}

/*	スタックに値をいれる
	オペレータの状態を見て動作を切り分ける
*/
function pushValue(myValue){
	if (myValue=='') return ;	//カラ呼び出しはリターン
	if (newStack && ! comBuf==''){
//スタックが確定しているので、
//入力バッファを初期化して、新しいスタックをプッシュ
		inBuf='0';bufPlace=1;bufDecimalPlace=0;
		newStack=0;	//スタック確定解除
	}else{
		operandStack.pop();
	}

//値をスタックに格納
	operandStack.push(myValue);
//電卓スタックとバッファを同期
	syncIB4ST();
	newStack=1;
}
//入力バッファを編集してスタックと同期
function editBuf(button){
	if(newStack){
//スタックが確定しているので、
//入力バッファを初期化して、新しいスタックをプッシュ
		inBuf='0';bufPlace=1;bufDecimalPlace=0;
	if (dEbug){nas_Push_Log('StackPush');}
		if(OPf==0){operandStack.pop();}else{operandStack.dup();};
		newStack=0;	//スタック確定解除
	}

	if (bufPlace<maxPlace) {
		var oldDATA=inBuf+'/'+operandStack[operandStack.length -1];
		if (inBuf=='0') {
			if(button.match(/^0+$/)){button='0';}
//ゼロのみの場合は入力でバッファを置き換え 桁数留保
			inBuf = button.toString(cardinal);
		}else{
//ゼロ以外の値ならば文字連結してバッファに格納 桁数は繰り上げ
			inBuf = inBuf + button;bufPlace ++ ;
		}
//小数フラグが立っていたら小数桁も切り上げ
		if (bufDecimalPlace>=1) bufDecimalPlace ++;
//電卓スタックとバッファを同期
		syncIB2ST();

	}else{
//NOP
//	updateDP();
	}

}

/*
	電卓のボタンを押す処理
*/
var pushDouble=false;var previewButton="";

function pushKey(button){
pushDouble=(previewButton==button)?true:false;
previewButton=button;
	if (button == '') return ;	//カラ呼び出しはリターン

//入力可能な文字列だった場合は、バッファに追加
	if (button.match(checkRegex)) {
		editBuf(button);
	} else {
		if (dEbug){putsCONS("push :"+button);}
		SW(button);
	}
}
/*
	保留オペレータの解決
	二項以上の演算子のみ(表示部にサインをだす演算)
	ここではスタックの更新のみで、表示はそのまま
*/
function operatioN(){

if ((operandStack.length==1)&&(OPf<2)) {return;};//あとで消す

if((incrBuf===null)&&(OPf==2)){incrBuf=operandStack.pop();}

var myOperand=(OPf<2)?operandStack.pop():incrBuf;
	switch (comBuf){
	case		"-":	//減算
operandStack.push(- myOperand + operandStack.pop());break;
	case		"+":	//加算
operandStack.push(myOperand + operandStack.pop());break;
	case		"*":	//乗算
operandStack.push(myOperand * operandStack.pop());break;
	case		"/":	//実数商
operandStack.push((1/myOperand) * operandStack.pop());break;
	case		"Di":	//整数商
operandStack.push(Math.floor((1/myOperand) * operandStack.pop()));break;
	case		"MOD":	//剰余
operandStack.push(operandStack.pop()%myOperand);break;
	case		"^":	//ベキ乗
operandStack.push(Math.pow(operandStack.pop(),myOperand));break;
	default:
nas_Push_Log('NOP');
;//NOP
	}
	newStack=1;	//スタックの確定フラグを立てる
}
/*
	TC入力バッファスタック転送
	TCセパレータをキー入力しないことになったので、この関数は現在不使用 05/01/24
*/
function ibEXst(Tkey){
	switch (Tkey) {
case	"h":	operandStack.push(operandStack.pop()+inBuf*60*60*nas.FRATE);break;
case	"p":	operandStack.push(operandStack.pop()+inBuf*SheetLength);;break;
case	"m":	operandStack.push(operandStack.pop()+inBuf*60*nas.FRATE);;break;
case	"s":	operandStack.push(operandStack.pop()+inBuf*nas.FRATE);;break;
case	"k":	operandStack.push(operandStack.pop()+inBuf*1);;break;
case	"f":	operandStack.push(operandStack.pop()+inBuf*1);;break;
default	:	operandStack.pop();operandStack.push(inBuf*1);//無条件入れ換え
}
	inBuf='0';bufPlace=1;bufDecimalPlace=0;

}
/*
	電卓表示部分の更新
*/
function updateDP(Nm){
if (INPUTmode=="fct") {
	if(TCf){
		document.getElementById("INbuf").innerHTML = nas_STR2TC(inBuf)[1];
		document.getElementById("SIbuf").value = '';
	}else{
		document.getElementById("SIbuf").value = inBuf;//保留中
	}
}else{
//	alert(inBuf)
	document.getElementById("INbuf").innerHTML = inBuf;
	document.getElementById("SIbuf").value = '';
}
//alert(Nm);
putsStack();//デバッグ用 というか、ベンリなのでそのまま使う
}
/*
	オペランド編集以外のコマンド処理
*/
function SW(ComInput) {
if (dEbug) nas_Push_Log(ComInput + '\t>>');
//オペレータを受信した場合は

switch (ComInput) {
//くり返し可能二項演算子の場合
//case		"++":	//くり返し加算
//case		"--":	//くり返し減算
	
// 二項演算子
case		"*":	//乗算
case		"/":	//実数商
case		"Di":	//整数商
case		"MOD":	//剰余
case		"^":	//ベキ乗
case		"-":	//減算
case		"+":	//加算
//以前の二項演算子を解決
//	if (! comBuf=='') {SW("=");};
	switch(OPf){
	case 2:
		if (comBuf==ComInput){
			SW("=");return;//くり返し演算実行
		}else{
			OPf=1;incrBuf=null;
			if (dEbug){putsCONS("clear incrBuf\n");};
//				くり返し演算モード解除
		}
		break;
	case 1:
		if ((comBuf==ComInput)&&(pushDouble)){
			OPf=2;//くり返し演算モードに遷移
		}else{
			SW("=");OPf=1;//通常演算のオペレータ変更
		}
		break;
	case 0:
	default:
		OPf=1;//オペレータ設定
	}
//オペレーションフラグが立っていないか、または連続打鍵で無ければ
//バッファにオペレータを置く
//オペレータをオペレータバッファに置いてスタックの確定フラグを立てる。
//表示更新
//TC入力フラグを調整
//	if((incrBuf!=null)&&(ComBuf!=ComInput)){incrBuf=null;};//現在のオペレータが切り替わる場合インクリメント変数をクリア
	comBuf = ComInput;
if (dEbug){putsCONS("change ComInput"+ComInput)};
	switch (ComInput) {
	case	"*":	document.getElementById("COMbuf").innerHTML = "×";	TCf=0;break;
	case	"/":	document.getElementById("COMbuf").innerHTML = "÷";	TCf=0;break;
	case	"Di":	document.getElementById("COMbuf").innerHTML = "＼";	TCf=0;break;
	case	"MOD":	document.getElementById("COMbuf").innerHTML = "％";	TCf=0;break;
	case	"^":	document.getElementById("COMbuf").innerHTML = "pow";	TCf=0;break;
	case	"-":	document.getElementById("COMbuf").innerHTML = "－";	TCf=1;break;
	case	"+":	document.getElementById("COMbuf").innerHTML = "＋";	TCf=1;break;
//	case	"":	document.getElementById("COMbuf").innerHTML = "";	TCf=1;break;
	default:;
	}
	if(OPf>1){document.getElementById("COMbuf").innerHTML +=" K";}
	newStack=1;//スタック確定フラグ
	return;
break;
// 単項演算子と多項演算子の処理
/*	kontoke形式は保留
case		"h"://入力バッファを時間としてスタックへ加算
case		"p"://入力バッファをページとしてスタックへ加算
case		"m"://入力バッファを分としてスタックへ加算
case		"s"://入力バッファを秒としてスタックへ加算
case		"k"://入力バッファをスタックへ加算
	if (TCf){ibEXst(ComInput);}
*/
//スタック操作

case		"MEM":	//スタックをプッシュ入力をクリア（メモリプッシュ）
	operandStack.push(0);
break;
case		"dup":	//メモリ?
	operandStack.dup();
break;
case		"pop":	//メモリ?
	operandStack.pop();
	if(! operandStack.length) operandStack.push(0);
break;
case		"exc":	//メモリ?
	operandStack.exc();
break;
//単項演算
//case		"":	//
//	operandStack.push();
//break;
case		"R":	//√平方根
	operandStack.push(Math.sqrt(operandStack.pop()));
break;

case		"T":	//符号反転
	operandStack.push(-(operandStack.pop()));
break;
case		"m2i":	//mm>インチ換算
	operandStack.push((operandStack.pop())/25.40);
break;
case		"i2m":	//インチ>mm換算
	operandStack.push(25.40*(operandStack.pop()));
break;
//	定数

case		"P":	//パイを入力
	pushValue(Math.PI);

break;
case		"E":	//
	pushValue(Math.E);
break;
case		"LN10":	//
	pushValue(Math.LN10);
break;
case		"LN2":	//
	pushValue(Math.LN2);
break;
case		"rnd":	//ランダム 0-1
	pushValue(Math.random());
break;
//多項演算
case		"avr":	//スタック平均
	var tos=0;var tosCount=0;
	while(operandStack.length){tos+=operandStack.pop();tosCount++;}
	operandStack.push(tos/tosCount);
break;
case		"tot":	//スタック合計
	var tos=0;
	while(operandStack.length){tos+=operandStack.pop();}
	operandStack.push(tos);
break;
case		"max":	//最大値(多項目)
	var myCurrent=0;var myMax=0;
	while(operandStack.length){myCurrent=operandStack.pop();myMax=(myCurrent>myMax)?myCurrent:myMax;}
	operandStack.push(myMax);
break;
case		"min":	//最小値(多項目)
	var myCurrent=0;var myMin = operandStack.pop();
	while(operandStack.length){myCurrent=operandStack.pop();myMin=(myCurrent<myMin)?myCurrent:myMin;}
	operandStack.push(myMin);
break;
// 以下コマンド
case		"AC":	//オールクリア
	comBuf='';inBuf='0';incrBuf=null;
	while(operandStack.length) operandStack.pop() ;
	operandStack.pop() ;
	operandStack.push(0);
	bufDecimalPlace=0;
	bufPlace=1;
	newStack=0;
	OPf=0;
	

	document.getElementById("CONS").value='';
	document.getElementById("COMbuf").innerHTML = comBuf;
	updateDP();

//通常の表示更新をスキップしてリターン
	return;
break;
case		"CE":	//クリアエントリ
	operandStack.pop();
	operandStack.push(0);OPf=0;
break;
case		"BS":	//バックスペース(どうなの?コレ)
if (newStack) newStack=0;
if(bufPlace==1){
	inBuf = 0;
}else{
	if ( bufDecimalPlace == 2) {
	inBuf = inBuf.slice(0,inBuf.length-2);
		bufDecimalPlace =0 ;
	} else {
	inBuf = inBuf.slice(0,inBuf.length-1);
		if (bufDecimalPlace != 0 ) {
			bufDecimalPlace --;
		}
	}
	bufPlace --;
}
//
	operandStack.pop();
switch (INPUTmode) {
case	"bin":			operandStack.push(bin2dec(inBuf));break;//bin
case	"fct":
		if(TCf) {
		operandStack.push(nas_TC2FR(nas_STR2TC(inBuf)[1]));//TC
		}else{
		operandStack.push(eval(prefix + inBuf));//TC保留
		}
		break;
default:			operandStack.push(eval(prefix + inBuf));
}
	updateDP();
//通常の表示更新をスキップしてリターン
	return;
break;
case		"=":	//保留オペレータの解決
		operatioN();
		if(OPf<2){
			comBuf = '';OPf=0;//コマンドバッファのみ初期化
			document.getElementById("COMbuf").innerHTML = comBuf;
//newStack=1;alert("newStack");
			TCf=1;
			if(incrBuf){incrBuf=null;}
		}
//	else{TCf=1;OPf=0;}
break;
case		".":	//小数フラグを立てる(小数以下桁数の変数と兼用)
	switch ( INPUTmode ){
	case "dec":
		if (bufDecimalPlace==0){
		bufDecimalPlace = 1;
		inBuf=inBuf+'.';
		updateDP();
		}
	break;
	case "fct":
//TCモードの場合単項演算子として使用する。(あとで)
	}
	return;
break;
case		"STACK":	//スタック表示
	putsCONS(STACK);return;
break;
case		"check":	//デバッグ用に各変数表示
	document.getElementById("CONS").value = '';
	putsCONS('STACK\t: '+ operandStack+'\n'+'inBuf\t: '+ inBuf +' : '+bufPlace + '/' +bufDecimalPlace+'\nINPUTmode\t: '+INPUTmode+'\ncombuf\t: '+comBuf+'\nincrbuf\t: '+incrBuf+'\nnstck\t: '+newStack+'\nTCf\t: '+TCf+'\n'+'\nOPf\t: '+OPf+'\n');return;
break;
case		":":	//
	switch ( INPUTmode ){
	case "fct":
	//TCモードの場合単項演算子として使用する。(あとで)
	//	inBuf=inBuf+':';
	//	document.getElementById("INbuf").innerHTML=inBuf;
		break;
	default :
		;//NOP
	}
return;
break;
//case		";":	//
//case		"-":	//
//case		"+":	//
//case		"":	//
//break;
default:	;//(NOP)
}
// コマンドの結果で表示を更新
if (dEbug) putsCONS( operandStack.top() );
//入力確定
	syncIB4ST(ComInput);
//表示の更新と同タイミングでその内容をクリップボードに転送できない
//セキュリティ上の仕様なので、それは受け入れる
}
/*
	mipq+alpha
*/


function qpimp(vAlue,uNit){
	if (INPUTmode == "fct"){
		document.getElementById("CONS").value='';
		putsCONS("数値モードで使用してください。");
		return;
	}
var RESULT = '';
var rimPlace=10000;
	switch (uNit){
	case	'Q':
RESULT=
vAlue+'Q:\n'+
' ='+vAlue+' Q\n'+
' ='+Math.round((((0.25 * vAlue) / 25.40)*72)*rimPlace)/rimPlace+' pt\n'+
' ='+Math.round(((0.25 * vAlue) / 25.40)*rimPlace)/rimPlace+' in\n'+
' ='+Math.round((0.25 * vAlue)*rimPlace)/rimPlace+' mm\n'+
' ='+Math.round(((0.25 * vAlue) * nas.Dpc() / 10)*rimPlace)/rimPlace+' px/'+nas.Dpi()+'dpi\n';
		;break;
	case	'pt':
RESULT=vAlue + 'pt:\n'+
' ='+Math.round( (((vAlue / 72) * 25.40) * 4)*rimPlace)/rimPlace +' Q\n'+
' ='+Math.round( vAlue*rimPlace)/rimPlace + ' pt\n'+
' ='+Math.round( (vAlue / 72)*rimPlace)/rimPlace+' in\n'+
' ='+Math.round( ((vAlue / 72) * 25.40)*rimPlace)/rimPlace+' mm\n'+
' ='+Math.round( ((vAlue / 72) * nas.Dpi() )*rimPlace)/rimPlace+' px/'+nas.Dpi()+'dpi\n';
		;break;
	case	'in':
RESULT=vAlue + 'in:\n'+
' ='+Math.round( (vAlue * 25.40 * 4)*rimPlace)/rimPlace+' Q\n'+
' ='+Math.round( (vAlue * 72)*rimPlace)/rimPlace+' pt\n'+
' ='+Math.round( vAlue*rimPlace)/rimPlace + ' in\n'+
' ='+Math.round( (vAlue * 25.40*rimPlace)/rimPlace)+' mm\n'+
' ='+Math.round( (vAlue * nas.Dpi())*rimPlace)/rimPlace+' px/'+nas.Dpi()+'dpi\n';
		;break;
	case	'mm':
RESULT=
vAlue+'mm:\n'+
' ='+Math.round((vAlue * 4)*rimPlace)/rimPlace+' Q\n'+
' ='+Math.round( ((vAlue / 25.40) * 72)*rimPlace)/rimPlace+' pt\n'+
' ='+Math.round( (vAlue / 25.40)*rimPlace)/rimPlace+ ' in\n'+
' ='+Math.round( vAlue*rimPlace)/rimPlace + ' mm\n'+
' ='+Math.round( (vAlue * nas.Dpc() / 10)*rimPlace)/rimPlace+' px/'+nas.Dpi()+'dpi\n';
		;break;
	case	'px':
RESULT=
vAlue + 'px/'+nas.Dpi()+' dpi:\n'+
' ='+Math.round( (vAlue / nas.Dpc() * 10) * 4 *rimPlace)/rimPlace+' Q\n'+
' ='+Math.round((((vAlue / nas.Dpc() * 10) / 25.40) * 72)*rimPlace)/rimPlace+' pt\n'+
' ='+Math.round( ((vAlue / nas.Dpc() * 10) / 25.40)*rimPlace)/rimPlace+' in\n'+
' ='+Math.round((vAlue / nas.Dpc() * 10)*rimPlace)/rimPlace+' mm\n'+
' ='+Math.round( vAlue*rimPlace)/rimPlace+' px/'+nas.Dpi()+'dpi\n';
		;break;
	}
	document.getElementById("CONS").value='';
	putsCONS(RESULT);
}

/*
UI関連処理
*/
//データ初期化
//
if(false){
//コンソール表示のひかえをドキュメントから取得
UIdata["console00"] = document.getElementById("tooPanel").innerHTML;

//
UIdata["toolBox00"] = '	<!-- ツールボックスパネル hide-->'+
'<input	type=hidden'+
'	value="cons"'+
'	id="Pn1"'+
'	><br />'+
'<input	type=hidden'+
'	value="kbd"'+
'	id="Pn2"'+
'	><br />'+
'<input	type=hidden'+
'	value="kbd2"'+
'	id="Pn3"'+
'	><br />'+
'	<!-- ツールボックスパネル hidden-->';
//
UIdata["toolBox01"] = document.getElementById("tooPanel").innerHTML;

//
UIdata["mdp00"]=document.getElementById("mdpBox").innerHTML;
//
UIdata["fkb00"]='	<!-- ファンクションキーボード hide-->'+
'<input type="hidden" value="dec">'+
'	<!-- ファンクションキーボード -->';
//
UIdata["fkb01"]=document.getElementById("fkbBox").innerHTML;
//
UIdata["nkb00"]='	<!-- 数値キーボード hide-->';
//
//
UIdata["nkb01"]=document.getElementById("nkbBox").innerHTML;

//
}

//サブウィンドウのフリップ


function kb_Flip(aRgs) {
	switch(aRgs){
case 'cons':
	if(document.getElementById('flipPicture').style.display=="none"){
	document.getElementById('consoleBox').style.display="inline";
	document.getElementById('flipPicture').style.display="inline";
	}else{
	document.getElementById('consoleBox').style.display="none";
	document.getElementById('flipPicture').style.display="none";
	}
	break;
case 'fkb':
	if(document.getElementById('fkbBox').style.display=="none"){
	document.getElementById('fkbBox').style.display="inline";
	document.getElementById('nkbBox').style.display="inline";
	}else{
	document.getElementById('fkbBox').style.display="none";
	document.getElementById('nkbBox').style.display="none";
	}
	break;
case 'kbd':
	if(document.getElementById('fkbBox').style.display!="inline"){
	document.getElementById('fkbBox').style.display="inline";
	document.getElementById('nkbBox').style.display="inline";
	document.getElementById('basePicture').src="./images/tall.png";
	document.getElementById('flipPicture').src="./images/tall.png";
	}else{
	document.getElementById('fkbBox').style.display="none";
	document.getElementById('nkbBox').style.display="none";
	document.getElementById('basePicture').src="./images/thin.png";
	document.getElementById('flipPicture').src="./images/thin.png";
	}
	break;
default	:	alert(aRgs);
	}
//キーボードが表示されてかつフラップが開いていたら背の高いコンソールに
	if(document.getElementById('consoleBox').style.display!="none"){
		if(document.getElementById('fkbBox').style.display=="none"){
		document.getElementById('consoleBox').style.top	="208px";
		document.getElementById('RESULT').style.height	="40px";
		document.getElementById('CONS').style.height	="96px";
		}else{
		document.getElementById('consoleBox').style.top	="400px";
		document.getElementById('RESULT').style.height	="120px";
		document.getElementById('CONS').style.height	="200px";
		}
	}

if (autoFit) {
nas_sizeToContent();
}
return false;
}
/*内寸取得*/


function getWindowinnerSize() {
    if (typeof innerWidth != 'undefined') {           // CSSOM, Fx, Opera, Safari, NN3-4
        return [innerWidth,innerHeight];
    } else if (document.compatMode == 'CSS1Compat') { // IE standard mode
        return [document.documentElement.clientWidth,document.documentElement.clientHeight];
    } else {                                          // IE backward-compatible mode
        return [document.body.clientWidth,document.body.clientHeight];
    }
}
/*リブ取得*/


function getWindowlibSize() {
    if (typeof innerWidth != 'undefined') {           // CSSOM, Fx, Opera, Safari, NN3-4
        return [outerWidth-innerWidth,outerHeight-innerHeight];
    } else if (document.compatMode == 'CSS1Compat') { // IE standard mode
//	alert("std :"+document.documentElement.offsetWidth+" / "+document.documentElement.offsetHeight)
       return [document.documentElement.offsetWidth-document.documentElement.clientWidth,document.documentElement.offsetHeight-document.documentElement.clientHeight];
    } else {                                          // IE backward-compatible mode
	window.resizeTo(240,320);
        return [240-document.body.clientWidth,320-document.body.clientHeight];
    }
}

/*ウインドウをコンテンツにフィットさせる関数、引数は特になし*/


function nas_sizeToContent(){
if(! autoFit){return;}else{
var 	innerHeight=(document.getElementById('fkbBox').style.display=="none")?192:384;
	innerHeight+=+42;
var 	innerWidth=(document.getElementById('consoleBox').style.display!="none")?document.getElementById('basePicture').width+document.getElementById('flipPicture').width:document.getElementById('basePicture').width;

var winLib=getWindowlibSize();
//alert(winLib.toString())
//alert(innerWidth+" : "+innerHeight)
	var WinW=innerWidth	+winLib[0];
	var WinH=innerHeight	+winLib[1]; 
	window.resizeTo(WinW,WinH);
}
	return;
}

/*
ストップウオッチフォームが読み込まれた直後に呼び出されて、
ストップウオッチを最終的に開始させる関数。
フォーム上のカスタム変数の読み込み(オーバーライド)および
表示インターバルの開始
明示的な終了手続きは特になし。
*/


function nas_Action_Startup() {
//ブラウザの判定をしてあまりに古い場合は終了コメントをだす。
/*			*/

	if (! ckUA()[0]) {
	document.getElementById('mdpBox').innerHTML='<b>'+
'申し訳ありませんが、現在ご使用のブラウザには対応しておりません。<br />'+
'MSIE5.5 以降、Netscape6 以降 またはこれらに相当の実行環境でご使用お願いします。<br />'+
'どうしても現在のブラウザでご使用になりたい場合は、<A href="mailto:nekomata_ya@mac.com">「ねこまたや」</A>まで<br />'+
'ご連絡くだるか、<A href="http://homepage2.nifty.com/Nekomata/bbs.html" target=_new>このあたり</A>でリクエストしてみてください。<br />状況次第ではなんとかなるかもしれません…ならんかもしれませんが…<br />'+
'<br />'+ckUA()+'<br /><hr />'
'2005/Nekomataya/kiyo';
return;	}

	document.getElementById("sTatus").innerHTML= "startup";
	
	//フォーム上のカスタム変数を読み取る
	pastrate = RATE; 	//新レートを設定する前に元のレートを退避
		nas_ChangeRATE( document.getElementById("RATE").value );
	MaxLap = document.getElementById("MaxLap").value;
	ClockOption = document.getElementById("ClockOption").value;
	nas_ChangeMODE(MODE);
	nas_ChangeKBD(KeyMODE);
	chgINPUTmode('dec');
	initRi(document.getElementById("nas_Ri_base").value);
	document.getElementById("nas_Ri").value = running

	autoFit=(document.getElementById("AutoFit"))?eval(document.getElementById("AutoFit").value):autoFit;
	chgResolution(document.getElementById("Dpi").value);
	
	 if(SPFS){changeSPFB();};//一回実行しておく?

//	再初期化終了・動作開始
	nas_cc2dp();
	document.getElementById("sTatus").innerHTML = "ready";
	m_action = true;
	CaptureAction = "";
//	表示インターバル開始
		Action = setInterval("nas_update_View()",10);
// ウィンドウのツールバー類を非表示に
	if(false){
		statusbar.visible=false;
		toolbar.visible=false;
		menubar.visible=false;
		directories.visible=false;
		locationbar.visible=false;
		personalbar.visible=false;
	}
//	ウィンドウをリサイズ?
		setTimeout("nas_sizeToContent();",50);
//	お後がよろしいようで
}
// プログラムおしまい とっぴんぱらりのぷぅ
//
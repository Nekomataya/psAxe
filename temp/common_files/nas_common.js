/*
nas_common.js
共用可能スクリプト部分

--- おことわり
このプログラムの著作権は「ねこまたや」にあります。

あなたは、このプログラムのこの著作権表示を改変しないかぎり
自由にプログラムの使用・複製・再配布などを行うことができます。

あなたは、このプログラムを自己の目的にしたがって改造することができます。
その場合、このプログラムを改造したものであることを明記して、この著作権表示を
添付するように努めてください。

このプログラムを使うも使わないもあなたの自由なのです。

作者はこのプログラムを使用したことによって起きたいかなる
不利益に対しても責任を負いません。
あなたは、あなたの判断と責任においてこのプログラムを使用するのです。

なんか、困ったことがあったら以下で連絡してもらえると何とかなるかもしれません。
http://homepage2.nifty.com/Nekomata/
mailto:nekomata_ya@mac.com

そんな感じです。

追伸
このプログラムは、汎用のモジュール群です。
組み込みでつかえるかどうかは作者の作業時間とセンスに左右されます。
*/
/*メッセージ (現在未使用）
フレームレートがロックされているので、リンクは解除できません。
解像度がロックされているので、リンクは解除できません。
ゼロは設定しないでください。
負の値は設定できません。
メッセージは不要かも
フラグを付けてプリファレンスで選択させるか?
*/
//	変数初期化
var VER = "Ver.0.1 alpha";

//マウスバリスライダ変数
var Xoffset = 0;
var baseValue = 0;
var diffValue = 0;

//	時間関連設定
// 	時計関連のフラグがたっておるなら使用
//if (document.nasExchg.ExchgUnit.value.match(/Time/)=="Time") {}
var ccrate = 1000 ;	//最少計測単位(javascriptではミリ秒固定)
var MODE = "clock" ;	//表示の初期モード(時計)
var ClockOption = 12 ;	//時計の初期モード (12時制)
var STATUS = "stop" ;
//	フレームレート	ここの並びでループする　RT 24FPS 30NDF 30DF 25FPS
RATEs = ["100","24FPS","30NDF","30DF","25FPS"];
var RATE = "24FPS" ;
//	FCTインターフェース関連
var SheetLength = 144;//タイムシート継続時間 フレーム/枚
//基準変数
//名前付け規則は、以下に準ずる
//スクリプト上の変数名は、大文字のみ
//フォーム上の同名のエレメントは 小文字で綴り初めて 大文字で綴り終わる記法で
//複合単語は、前置語を小文字、後置語を大文字
//	サンプル基準値
var FRATE = 24;//サンプルフレームレート(フレーム継続時間に置き換えるか一考)
var RESOLUTION = 144. / 2.540 ;//サンプル解像度ppc(dpc)
var LENGTH = 225. ;//サンプル基準寸法(mm)
var FRAME_L=100 ;//サンプル基準フレーム(fl)
//Frame of Location アニメーション撮影フレーム(traditional)
//基準値は計算レタスフレームを基準にしたほうが計算回数がいくらか減りそう?
var SCALE = 1;//サンプル拡大比率(実数)
// for AEkey
//	コンポジション３Ｄカメラ情報
var FOCUS_D = 50; //レンズ焦点距離 (mm)
var FILM_W = 36;//FILM Width (mm)
var FILM_H = 24;//FILM Height(mm)
var IMAGE_CR = Math.sqrt(Math.pow(FILM_W,2)+ Math.pow(FILM_H,2));//イメージサークル直径(mm)
//	コンポジション設定
var COMP_W = 720;//comp Width (px);
var COMP_H = 486;//comp Height(px);
var COMP_A = 0.9;//comp Aspect(W/H);
var COMP_D = Math.sqrt(Math.pow(COMP_W * COMP_A,2)+ Math.pow(COMP_H,2));
var CAMERA_D = (COMP_D * FOCUS_D)/ IMAGE_CR;
//	レイヤ・フッテージ設定
//今のところキーに添付するだけの値(変換には無関係)
var SRC_W = 720;//source Width (px);
var SRC_H = 486;//source Height(px);
var SRC_A = 0.9;//source Aspect(W/H);
// AE-Key data 出力関連の変数(初期値)
var AE_Ver = "5.0";// 4.0/5.0/6.0
var KEY_STYLE = "withTime";//or "valueOnly"
var KEY_TYPE = "Scale";// or "Position"

//子変数 親変数から導かれる表示データ(または派生データ)
//変数名は、大文字ではじまり 後ろは小文字のみ
//フォーム上の同名のinputは極力大文字のみで表記
//RESOLUTION 派生変数
var Dpi = RESOLUTION * 2.540 ;
var Dpc = RESOLUTION ;
//FRAME_L 派生変数
var FRAMEl = FRAME_L;
var FRAMEr = fl2fr(FRAME_L);

/*
	nas 共通ライブラリ
数学関連とか映像関連の戻り値のある関数群
*/
//
/*	距離関連換算関数
dt2sc(AEのZ軸位置)	戻り値:位置に相当する比率
sc2dt(比率)	戻り値:比率に相当するAEのZ軸位置
*/
function dt2sc(dt){return (CAMERA_D/((1 * dt) + CAMERA_D))}
function sc2dt(sc){return ((CAMERA_D/(1 * sc))-CAMERA_D)}
/*	フレーム関連換算関数 一々書いても間違えそうなのでまとめておく。
fl は、旧来のアニメーション撮影フレーム・スタンダード値100
fr は、レタス撮影フレーム(要検証)・同スタンダード値100
sc は、倍率
FRAME_Lは、基礎情報として基準フレーム数をfl値で与えること
*/
function fl2fr(fl){return ((fl * 1 + 60)/1.60)}
function fr2fl(fr){return ((fr * 1.60)-60)}
/*
*/
function fl2sc(fl){return ((160*((FRAME_L * 1)+60))/(160*((fl*1)+60)))}
function fr2sc(fr){return (fl2sc(fr2fl(fr)))}
function sc2fl(sc){return ((((160 * (FRAME_L + 60))/(sc * 1))/160) - 60)}
function sc2fr(sc){return (fl2fr(sc2fl(sc)))}

// 拡大率変換関数
// kac(基準量,目標量,助変数)
// 戻り値は 拡大率を実数で

function kac(StartSize,EndSize,timingValue) {
if (timingValue == 0 || timingValue == 1){
	if (timingValue == 0) {resultS = StartSize}
	if (timingValue == 1) {resultS = EndSize}
} else {
/*
求める寸法は

まず開始寸法を1として終了寸法の比率を求める EndSize/Startsize

距離評価係数として 比の逆数を開始点と終了点で求める。
開始点距離評価係数 1/1 = 1
終了点距離評価係数 1/(EndSize/Startsize) = Startsize/EndSize

与えられた助変数にしたがって距離評価係数を求める。
((終了点距離評価係数 - 開始点距離評価係数) * 序変数) + 開始点距離評価係数
= (((Startsize/EndSize) - 1) * timingValue) + 1
逆数をとって比率を得て
開始寸法に掛ける
開始寸法 * 距離評価係数
= StartSize / ((((Startsize/EndSize) - 1) * timingValue) + 1)
*/
//	resultS = (1-(timingValue)*(1-(StartSize/EndSize)));
resultS = StartSize / ((((StartSize/EndSize) - 1) * timingValue) + 1)

}
return (resultS);
}
//逆関数
//cak(基準量,目標量,拡大率)
//戻り値は助変数を最大精度で

function cak(StartSize,EndSize,scaleValue) {
return ("resultT");
}

// ゼロ埋め ZERROfilling
function Zf(N,f) {
var prefix="";
if (N < 0) {N=Math.abs(N);prefix="-"}
if (String(N).length < f) {
	return prefix + ('00000000' + String(N)).slice(String(N).length + 8 - f , String(N).length + 8);
} else {return String(N);}
}
//時間フレーム変換
function ms2fr(ms){return (Math.floor(FRATE*(ms/1000)))}
//function ms2fr(ms){return (FRATE*(ms/1000))}
function fr2ms(frm){return (1000*frm/FRATE)}
function ms2FCT(ms,type,ostF){return Frm2FCT(Math.floor(FRATE * ms /1000),type,ostF)}
function FCT2ms(fct){return 1000*(FCT2Frm(fct))/FRATE}

//カウンタ文字列生成
function Frm2FCT(frames,type,ostF) {
	frames=parseInt(frames);
var negative_flag = false;
if (frames < 0) {frames = Math.abs(frames);negative_flag=true;}
	if (ostF == 1) {
		PostFix = ' _';
	} else {
		ostF = 0;
		PostFix = ' .';
	}
//
//	default	00000
//	type 2	0:00:00
//	type 3	000 + 00
//	type 4	p 0 / 0 + 00
//	type 5	p 0 / + 000
//
var m = Math.floor((frames + ostF) / (FRATE * 60));
 var s = Math.floor((frames + ostF) / FRATE);
  var SrM = s % 60;
   var p = Math.floor(frames / SheetLength ) + 1;
    var FrS = ((frames + ostF) % FRATE);
     var FrP = (frames % SheetLength) + ostF;
      var SrP = Math.floor(((frames % SheetLength) + ostF) / FRATE)

switch (type) {
case 5: Counter ='p ' + Zf(p,1) + ' / + ' + Zf(FrP,3) + PostFix ;break;
case 4: Counter ='p ' + Zf(p,1) + ' / ' + SrP +' + ' + Zf(FrS,2)+ PostFix ;break;
case 3: Counter =Zf(s,1) + ' + ' + Zf(FrS,2) + PostFix ;break;
case 2: Counter =Zf(m,1) + ':' + Zf(SrM,2) + ':' + Zf(FrS,2) + PostFix ;break;
default: Counter =Zf(frames + ostF ,4) + PostFix ;
}
if (negative_flag) {Counter="-( " + Counter +" )"}
 return Counter;
}
//カウンタ文字から0スタートのフレーム値を返す
//カウンタ文字列以外には'元の文字列'を返す[仕様変更]
//カウンタ文字列として-(FCT)形式の値を 負の数として受け入れる[仕様変更]
function FCT2Frm(fct) {
	var fpsC = FRATE;
	fct = fct+"";//数値を文字列に変換
var negative_flag=false;
	if(fct.match(/\-\((.*)\)/)){negative_flag=true;fct=RegExp.$1;};
//文字列の最期の文字を評価してオリジネーションを取得
	if (fct.charAt(fct.length - 1)=='_') {
		ostF = 1;
		PostFix = '_';
	} else {
		ostF = 0;
		PostFix = '.';
	}
//文字列の最期の文字がポストフィックスなら切り捨て
	if (fct.charAt(fct.length - 1)==PostFix) {
		fct = fct.slice(0,-1)
	}
//空白を全削除
	fct = fct.replace(/\ /g,'')
//判定
//	if (fct.match(/[0-9\:\p\/\+]/)) {return fct}
// ローカル変数初期化
	var p=1;
	 var h=0;
	  var m=0;
	   var s=0;
	    var k=0;
//	type 1	00000
	if (fct.match(/^[0-9]+$/)) {
		k=fct;
	} else {
//	type 2	0:00:00
	if (fct.match(/^([0-9]+:){1,3}[0-9]+$/)) {
//TCなのでスプリットして配列に入れる
		tmpTC=new Array()
		tmpTC=fct.split(":")
		switch (tmpTC.length) {
case 4:	 h=tmpTC[tmpTC.length - 4];
case 3:	  m=tmpTC[tmpTC.length - 3];
case 2:	   s=tmpTC[tmpTC.length - 2];
case 1:	    k=tmpTC[tmpTC.length - 1];
		}
	} else {
//	type 3	000 + 00
	if (fct.match(/^[0-9]+\+[0-9]+$/)) {
		s=fct.substring(0,fct.search(/\+/));
		 k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 4	p 0 / 0 + 00
	if (fct.match(/^p[0-9]+\/[0-9]+\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\//));
		 s=fct.substring(fct.search(/\//)+1,fct.search(/\+/));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 5	p 0 / + 000
	if (fct.match(/^p[0-9]+\/\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\//));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
// ダメダメ
	return fct;
		}}}}}
// 数値化して全加算
 p=parseInt(p,10);
  h=parseInt(h,10);
   m=parseInt(m,10);
     s=parseInt(s,10);
      k=parseInt(k,10);
var Frame=(p-1) * (fpsC * SheetLength) + h * (fpsC * 60 * 60) + m * (fpsC * 60) + s * (fpsC) + k - ostF;
 if(negative_flag){return -1*Frame;}else{return Frame;}
}





/* 
	お道具箱汎用データ操作関数群
イロイロ、共通でつかえる奴

*/
//エレメントの値をすべてバックアップ(正常な処理の最後に呼ぶ)
function updateBk() {
	for (n = 1 ; n< BkValue.length ; n++) {
	elName = ElementName[n];
	BkValue[n] = document.nasExchg.elements[elName].value }
}
//お道具箱汎用データ操作関数群オワリ
/*
	ログ関連
あまりつかってない
*/
//	ログ配列を初期化（）
Log = new Array() ;
function nas_Push_Log(str) {Log = Log.concat([str])}
//	ログ 初期化してみる
nas_Push_Log( "Program Started " + VER);
nas_Push_Log( Date() );
nas_Push_Log( "  FrameRate" + FRATE + "(" + FRATE + ")");
//nas_Push_Log( "  Start Mode  [" + MODE + "]" );
//

/*
	マウスバリスライダ
書いてはみたが
これは ひょっとしてなんかのパテントにふれる様な気がしてならない。
要調査
これを使うinputオブジェクトは、以下の書式でonMouseDownでsliderVALUEを呼ぶ
初期値は任意　指定されない場合はテキスト内容が初期値となるが数値以外の場合は
何も実行されない

sliderVALUE([event,エレメント名,上限,下限,桁数(,初期値)]);

<input type=text onMousedown = "sliderVALUE([event,this,'260','-60','-1'])">

初期値の挿入とロック時の動作を追加TC関連の拡張まだ(04.06.06)

汎用の関数へ変更　エレメントをIDでなく直接渡すことに
INPUT type=text　限定
2014.11.01 kiyo@nekomataya.info
*/
function sliderVALUE(chnk) {
//配列で受け渡し [イベント,エレメント名,上限,下限,桁数(,デフォルト値)]
	Xoffset = chnk[0].screenX;
	slfocus = chnk[1];
	slmax = 1*chnk[2];
	slmin = 1*chnk[3];
	slstp = 1*chnk[4];
//エレメント違い・タイプ違い・ロックされていたらモード変更なしでリターン
if( (isNaN(slfocus.value))||
   !(slfocus instanceof HTMLInputElement)||
    (slfocus.type != "text")||
    (slfocus.disabled == true)) {return false}
//基準値取得
if (slfocus.value == "--") {
	if (chnk.length == 6){baseValue = 1*chnk[5]} else {baseValue = slmin}
} else {
	baseValue = 1 * (slfocus.value);
}
//該当するエレメントのオンチェンジを保留してスライダモードに入る
	slfocus.blur();
//	slfocus.onchange = '';
switch (navigator.appName) {
case "Opera":
case "Microsoft Internet Explorer":
	document.body.onmousemove = MVSlider_IE;break;
case "Netscape":
	document.body.onmousemove = MVSlider_NS;break;
default:	return;
}
	document.body.onmouseout = sliderOFF;
	document.body.onmouseup = sliderOFF;
}
function sliderOFF() {
//	alert("off")
//	slfocus.focus();
	document.body.onmousemove = null;
	document.body.onmouseup = null;
	document.body.onmouseout = null;

//スライダモード終了して該当するエレメントのオンチェンジを復帰
//	slfocus.onchange = 'CHK_VALUE';
//スクリプトからの変更ではイベントが発生しないのでスライダの値が前の値と異なっていた場合のみonChenge()メソッドを実行
//数値以外の値をこのメソッドで実行する場合は実行前に数値化しておくことで利用可能
if((slfocus.value != baseValue)&&(slfocus.onchange)){slfocus.onchange();}
	return;
}
function MVSlider_NS(event) {
	diffValue = event.screenX - Xoffset;
	if (diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//ガンマかけて値をとる
	newValue = baseValue + (Flgl * (Math.pow(diffValue/100,2)*100));
//上限下限でおさえる
	if (newValue > slmax) {newValue = slmax} {
		if (newValue < slmin) {newValue = slmin}
	}
//ステップで桁だし
	var exN = Math.pow(10,slstp);
	newValue = Math.floor(newValue * exN)/exN;
if(slfocus.value != newValue) {
	slfocus.value = newValue ;
}
}

function MVSlider_IE() {
	diffValue = event.screenX - Xoffset;
	if (diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//ガンマかけて値をとる
	newValue = baseValue + (Flgl * (Math.pow(diffValue/100,2)*100));
//上限下限でおさえる
	if (newValue > slmax) {newValue = slmax} {
		if (newValue < slmin) {newValue = slmin}
	}
//ステップで桁だし
	var exN = Math.pow(10,slstp);
	newValue = Math.floor(newValue * exN)/exN;
if(slfocus.value != newValue) { slfocus.value = newValue }
}
//マウスバリスライダ関連終了


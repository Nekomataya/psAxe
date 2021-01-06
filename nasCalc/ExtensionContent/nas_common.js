/*
 *	nas アニメーション一般ライブラリ
 *	AE等のAdobe Script 環境で使用可能な関数およびプロパティをサポートします
 *
 *
 *	2016/01/29
 *
 */
 myFilename=('nas_common.js');
 myFilerevision=('1.9');

// ============ 動作プラットフォームを判別してプラットフォーム別の初期化を行う
	if(typeof nas=='undefined'){nas=new Object();}
try{
//appオブジェクトを確認してAdobeScript環境を判定
	if(app){
	//Adobe Scripts 
	nas.isAdobe=true;
	nas.Version["common"]="common:"+myFilename+" :"+myFilerevision;
		try{
	if(app.isProfessionalVersion){app.name="Adobe AfterEffects";}
		}catch(ERR){
	;
		};
	}else{
	nas.isAdobe=false;
	};
}catch(ERR){
//app オブジェクトが無いのでAIRまたはブラウザ
//var	nas	=new Object();//nas オブジェクトとの生成はこの時点より前に送る

	nas.isAdobe=false;

	try{
//Folderオブジェクトを参照してAIR環境の場合nas.baseLocationを設定 psAxe用
	 nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");//(Folder.current.name=="Startup")? new Folder("../nas/"):Folder.current;
	}catch(err){
	 nas.baseLocation="";
	}
	 var MSIE	= navigator.userAgent.indexOf("MSIE")!=-1; 
	 var Safari	= navigator.userAgent.indexOf("Safari")!=-1;
	 var Firefox	= navigator.userAgent.indexOf("Firefox")!=-1;
};

	xUI=false;//xUIオブジェクトはHTMLライブラリにおけるUI管理オブジェクトなのでHTML環境外ではfalseで初期化して判定する
	//HTML環境下であっても依存機能が初期化完了前にアクセスすることを抑制するためにfalseであらかじめ初期化するのを標準メソッドとする

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
http://www.nekomataya.info/
mailto:kiyo@nekomataya.info

そんな感じです。

追伸
このプログラムは、汎用のモジュール群です。
組み込みでつかえるかどうかは作者の作業時間とセンスに左右されます。
nas汎用オブジェクトとメソッドで構成することに決定。
呼び出しかたが変わるのでこのバージョン以降互換性無し。

2015 07-11
基礎オブジェクトの大幅変更
以降のライブラリは基本的に後方互換性を失うので注意

2016 01-29
 懸案だったベクトル関連の演算ライブラリを少し整理してこのモジュールに組み込む
 関連の関数は全てnas.配下に組み入れるので、使用の際はコードの置きかえまたはエイリアスからのアクセスが必要
 移行した関数
 	　preformvector add sub mul div clamp dot cross length normalize
 	　degreesToRadians radiansToDegrees
 */

/*
=======	現在のメソッド一覧 ======= 2016/01/29

nas.dt2sc(z距離)
	z軸距離(ピクセル)からスケールを求める

nas.sc2dt(スケール)
	スケールからz軸距離を求める。

nas.fl2fr(撮影フレーム)
	撮影フレームからレタス撮影フレームを求める。

nas.fr2fl(レタス撮影フレーム)
	レタスフレームから撮影フレームを求める。

nas.fl2sc(撮影フレーム)
	撮影フレームからスケールを求める。
nas.fr2sc(レタス撮影フレーム)
	レタス撮影フレームからスケールを求める。
nas.sc2fl(スケール)
	スケールから撮影フレームを求める。
nas.sc2fr(スケール)
	スケールからレタス撮影フレームを求める。
nas.kac(開始寸法,終了寸法,助変数)
	開始寸法・終了寸法と助変数を与えて、対応する寸法を求める。
nas.cak(開始寸法,終了寸法,拡大率)
	開始寸法・終了寸法と任意寸法を与えて、寸法に対応する助変数を求める。

nas.Zf(数値,桁数)
	数値を指定桁数のゼロで埋める。

nas.ms2fr(ミリ秒数)
	ミリ秒数から、フレーム数を求める。
nas.fr2ms(フレーム数)
	フレーム数から、ミリ秒数を求める。
nas.ms2FCT(ミリ秒数,カウンタタイプ,オリジネーション[,フレームレート])
	ミリ秒数から、カウンタ文字列への変換。
	カウンタータイプ・オリジネーション・フレームレートを指定
nas.FCT2ms(カウンタ文字列)
	カウンタ文字列から、ミリ秒数への変換。
nas.Frm2FCT(フレーム数,カウンタタイプ,オリジネーション[,フレームレート])
	フレーム数(0オリジン)から、カウンタ文字列への変換
	カウンタータイプ・オリジネーション・フレームレートを指定
nas.FCT2Frm(カウンタ文字列[,フレームレート])
	カウンタ文字列から、フレーム数(0オリジン)への変換
	フレームレート省略可能
nas.docodeUnit(入力値,変換単位)
	入力値の単位を変換した数値を戻す(mm,cm,px,pt,in)

==== 色彩関連(web用)
nas.colorStr2Ary(カラー文字列)
	WEB色指定用の文字列を3次元の配列にして返す
nas.colorAry2Str([配列])
	配列で与えられたRGB値を16進文字列で返す。
==== ベクトル関連
nas.vec2azi(ベクトル,[フォーマット])
	与えられたベクトルの方位角を返す。文字フォーマットも可
==== 行列計算
行列演算関数の行列は配列の組み合わせでなく、要素のストリーム文字列である。

nas.showMatrix(ラベル,行列文字列,行数,列数)
	与えられた行列文字列に改行を加えて文字列で返す。
nas.mDeterminant(行列文字列)
	行列式(和)を返す。
nas.multiMatrix(行列文字列1,行列文字列2)
	行列積を求める。
nas.mInverse(行列文字列)
	逆行列を求める。
nas.transMatrix(行列文字列)
	行列を転置する。

==== 文字列操作(Stringクラスにオーバーライドするかも知れないので暫定)
nas.biteCount(文字列)
	文字列のバイト数を返す。
nas.biteClip(文字列,制限バイト数)
	文字列を指定バイト数以下にクリップ
nas.incrStr(文字列)
	文字列の末尾の番号部分を１くり上げて返す
==== プロパティ操作
nas.propCount(オブジェクト,リストスイッチ)
	オブジェクトのプロパティをカウントする
	リストスイッチでプロパティ名の配列を返す
==== 単位換算
nas.decodeUnit(入力値,変換単位)
	単位つきの文字列値を数値にして返すメソッド
	単位は　mm cm in pt px
	
========	既存オブジェクトにオーバーライドするメソッド
		"yy/mm/dd hh:mm:ss" 形式を拡張
Date.toNASString()
	;returns String
Date.setNASString("yy/mm/dd hh:mm:ss")
	; returns object
 */

/*===========================================
 *	nas Object base property
 *
 *
 */
//カレントユーザ文字列
	nas.CURRENTUSER=(typeof(myName)=="undefined")?"nobody":myName;	
	//ここで参照して、以降はグローバルを使用しないようにする2011/08/17
	//参照先がない場合の対処　2016/01/30
//時間関連設定
	nas.ccrate = 1000	;	//最少計測単位(javascriptではミリ秒固定)
	nas.MODE = "clock"	;	//表示の初期モード(時計) ストップウオッチ用共用変数
	nas.ClockOption = 12	;	//時計の初期モード (12時制) ストップウオッチ用共用変数
	nas.STATUS = "stop"	;	// ストップウオッチ用共用変数
//フレームレート	ここの並びでループする 100fps 24FPS 30NDF 30DF 25FPS
	nas.RATEs = ['100fps','24FPS','23.976FPS','30NDF','30DF','25FPS','48FPS'];
	nas.RATE = '24FPS' ;

//基準変数
//名前付け規則は、以下に準ずる
//スクリプト上の変数名は、大文字のみ
//フォーム上の同名のエレメントは 小文字で綴り初めて 大文字で綴り終わる記法で
//複合単語は、前置語を小文字、後置語を大文字
//サンプル基準値
	nas.FRATE = 24;//サンプルフレームレート(フレーム継続時間に置き換えるか一考)
//	nas.FRATE = nas.newFramerate();
	nas.RESOLUTION = 144. / 2.540 ;//サンプル解像度ppc(dpc)
//	nas.RESOLUTION = new nas.Resolution(144.,"dpc");
	nas.LENGTH = 225. ;//サンプル基準寸法(mm)
//	nas.LENGTH = new nas.UnitValue(225.,'mm') ;//フレーム基準寸法(横幅)
	nas.ASPECT = 16/9 ;//フレームアスペクト（参考値　横／縦）
	nas.PIXELASPECT = 1 ;//ピクセルアスペクト（参考値　横／縦）
	nas.FRAME_L=100 ;//サンプル基準フレーム(fl)

//FCTインターフェース関連
	nas.SheetLength = (typeof(SheetLength)=="undefined")? 6:SheetLength;
	//タイムシート継続時間 秒/枚

/*
	FCTインターフェースをドロップフレーム対応とする
	基本的なドロップメソッドはカウント母数を Math.ceil(nas.FRATE)として
	誤差が蓄積次第秒の末尾フレームをドロップカウントする事で行う。
	nas.SheetLengthは実際の消化フレームととらえると枚数ごとの不定値となるので
	秒数で置いて一定値を得ることにする(仕様変更)
*/

// fl : Fields アニメーション撮影フレーム(traditional)
//基準値は計算レタスフレームを基準にしたほうが計算回数がいくらか減りそう?
	nas.SCALE = 1;//サンプル拡大比率(実数)

// for AEkey
/*
 *	コンポ情報
 *	計算に必要な情報は、コンポを切り換えるタイミングで再初期化する?
 *	または、手動で初期化トリガを打つか?
 */
//コンポジション３Ｄカメラ情報 > オブジェクト化すること
	nas.FOCUS_D = 50; //レンズ焦点距離 (mm)
	nas.FILM_W = 36;//FILM Width (mm)
	nas.FILM_H = 24;//FILM Height(mm)
	nas.IMAGE_CR = function(){return Math.sqrt(Math.pow(this.FILM_W,2)+Math.pow(this.FILM_H,2))};//イメージサークル直径(mm)


//コンポジション設定 > オブジェクト化すること
	nas.COMP_W = 720;//comp Width (px);
	nas.COMP_H = 486;//comp Height(px);
	nas.COMP_A = 0.9;//comp Aspect(W/H);

	nas.COMP_D = function(){return Math.sqrt(Math.pow(this.COMP_W * this.COMP_A,2)+ Math.pow(this.COMP_H,2));};
	nas.CAMERA_D = function(){return (this.COMP_D() * this.FOCUS_D)/ this.IMAGE_CR();};


//レイヤ・フッテージ設定
//今のところキーに添付するだけの値(変換には無関係)
	nas.SRC_W = 720;//source Width (px);
	nas.SRC_H = 486;//source Height(px);
	nas.SRC_A = 0.9;//source Aspect(W/H);
//AE-Key data 出力関連の変数(初期値)
	nas.AE_Ver = "8.0";// 4.0/5.0/6.0/6.5/7.0/8.0 AE CS3
	nas.KEY_STYLE = "withTime";//or "valueOnly"
	nas.KEY_TYPE = "Scale";// or "Position"

//子変数 親変数から導かれる表示データ(または派生データ)
//変数名は、大文字ではじまり 後ろは小文字のみ
//フォーム上の同名のinputは極力大文字のみで表記
/*
	Resolution objectを作成してそちらへ移行

	nas.Resolution
	nas.Resolution.dpc
	nas.Resolution.dpi
*/
//RESOLUTION 派生変数 ラムダ関数試験
	nas.Dpi = function(){return this.RESOLUTION * 2.540;} ;
//	nas.Dpi = function(){return this.RESOLUTION.as('dpi');} ;
	nas.Dpc = function(){return this.RESOLUTION;} ;
//	nas.Dpc = function(){return this.RESOLUTION.as('dpc');} ;
/*
nas.ClipingFrame objectを作成してそちらへ移行
	nas.ClipingFrame.size	:nas.Geometry
	nas.ClipingFrame.height
	nas.ClipingFrame.scale
	nas.ClipingFrame.offset
	nas.ClipingFrame.rotation
	nas.ClipingFrame.traditionalFrames
	nas.ClipingFrame.retasFrames
nas.ProductSpeckに統合？
*/

//FRAME_L 派生変数
	nas.FRAMEl = function(){this.FRAME_L;};
	nas.FRAMEr = function(){this.fl2fr(this.FRAME_L);};

//ここまではプロパティ
/*
DateオブジェクトにtoNASString形式処理を乗せる
*/
Date.prototype.toNASString = function()
{
	var	h=this.getHours();
	var	m=this.getMinutes();
	var	s=this.getSeconds();
	var	yy=this.getFullYear();
	var	mm=this.getMonth()+1;
	var	dd=this.getDate();
	var Result=yy+"/"+mm+"/"+dd+"\ "+h+"\:"+m+"\:"+s ;
return Result;
};
//
//
Date.prototype.setNASString = function(nasString)
{
	var	yy=nasString.split("\ ")[0].split("/")[0];
	var	mm=nasString.split("\ ")[0].split("/")[1]-1;
	var	dd=nasString.split("\ ")[0].split("/")[2];
	var	h=nasString.split("\ ")[1].split(":")[0];
	var	m=nasString.split("\ ")[1].split(":")[1];
	var	s=nasString.split("\ ")[1].split(":")[2];
		this.setYear(yy);
		this.setMonth(mm);
		this.setDate(dd);
		this.setHours(h);
		this.setMinutes(m);
		this.setSeconds(s);

return this;
};
/*
String.camelize()
*/
 
String.prototype.camelize=function () {
    return this.replace (/(?:[-_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    });
  }

/*
	nas 共通ライブラリ
数学関連とか映像関連の戻り値のある関数群
(メソッドで)
*/
//
/*	距離関連換算関数
dt2sc(Z軸位置)	戻り値:位置に相当する拡大比率
sc2dt(拡大比率)	戻り値:比率に相当するAEのZ軸位置
	双方、ともにコンポジションのプロパティに依存
*/
nas.dt2sc = function(dt){return (this.CAMERA_D()/((1 * dt) + this.CAMERA_D()))};
//
nas.sc2dt = function(sc) {return ((this.CAMERA_D()/(1 * sc))-this.CAMERA_D())};
//

/*	フレーム関連換算関数 一々書いても間違えそうなのでまとめておく。
fl は、旧来のアニメーション撮影フレーム・スタンダード値100
fr は、レタス撮影フレーム(要検証)・同スタンダード値100
sc は、倍率
FRAME_Lは、基礎情報として基準フレーム数をfl値で与えること
*/
nas.fl2fr = function(fl){return ((fl * 1 + 60)/1.60)};
//
nas.fr2fl = function(fr){return ((fr * 1.60)-60)};
	//
/*
*/
nas.fl2sc = function (fl){return ((160*((this.FRAME_L * 1)+60))/(160*((fl*1)+60)))};
//
nas.fr2sc = function(fr){return (this.fl2sc(this.fr2fl(fr)))};
//
nas.sc2fl = function(sc){return ((((160 * (this.FRAME_L + 60))/(sc * 1))/160) - 60)};
//
nas.sc2fr = function(sc){return (this.fl2fr(this.sc2fl(sc)))};

// 拡大率変換関数
// kac(基準量,目標量,助変数)
// 戻り値は 序変数に対応する寸法

nas.kac	= function(StartSize,EndSize,timingValue) {
if (timingValue == 0 || timingValue == 1){
	if (timingValue == 0) {resultS = StartSize};
	if (timingValue == 1) {resultS = EndSize};
} else {
/*
求める寸法は

まず開始寸法を1として終了寸法の開始寸法に対する比率を求める
	EndSize/StartSize
距離評価係数として 比の逆数を開始点と終了点で求める。
開始点距離評価係数 1/1 = 1
終了点距離評価係数 1/(EndSize/StartSize) = StartSize/EndSize

与えられた助変数に対応する距離評価係数を求める。
((終了点距離評価係数 - 開始点距離評価係数) * 序変数) + 開始点距離評価係数
= (((StartSize/EndSize) - 1) * timingValue) + 1
評価係数の逆数をとって比率を得る
比率を開始寸法に掛ける
開始寸法 * 距離評価係数
= StartSize / ((((Startsize/EndSize) - 1) * timingValue) + 1)
*/
//	resultS = (1-(timingValue)*(1-(StartSize/EndSize)));
resultS = StartSize / ((((StartSize/EndSize) - 1) * timingValue) + 1);

};
return (resultS);
};
//
//kacの逆関数
//cak(基準量,目標量,任意寸法)
//戻り値は助変数を最大精度で

nas.cak	= function(StartSize,EndSize,TargetSize) {
/*
	まだ書いてないよ('o')
*/
var resultT=0;
	if (TargetSize==StartSize) {resultT=0}else{
	if (TargetSize==EndSize) {resultT=1}else{
resultT=(((1/TargetSize)-(1/StartSize))/((1/EndSize)-(1/StartSize)))

	}};
return (resultT);
};

//
// ゼロ埋め ZERROfilling
nas.Zf = function(N,f) {
var prefix="";
if (N < 0) {N=Math.abs(N);prefix="-"};
if (String(N).length < f) {
	return prefix + ('00000000' + String(N)).slice(String(N).length + 8 - f , String(N).length + 8);
} else {return String(N);}
};
//
//時間フレーム変換
nas.ms2fr = function(ms){return (Math.floor(this.FRATE*(ms/1000)))};//ミリ秒からフレーム数　実時間切捨て整数フレーム
//
nas.fr2ms = function(frm){return (1000*frm/this.FRATE)};//フレームからミリ秒　浮動少数
//
nas.ms2FCT = function(ms,type,ostF,fpsC){
	if(! type){type=0};
	if(! ostF){ostF=0};
	if(! fpsC){fpsC = this.FRATE};
	if(type>5){fpsC=29.97*(type-5)};//type 6 7の時にフレームレート強制
	var myFrms=Math.round((ms*fpsC)/1000);
	return this.Frm2FCT(myFrms,type,ostF,fpsC);
}
//
nas.FCT2ms = function(fct){return 1000*(this.FCT2Frm(fct))/this.FRATE};
//
//カウンタ文字列生成
/*
	ドロップ対応版 2010/11/04
	SMPTE ドロップ30対応 2010/11/05
	モード指定 type6

	30DF 60DF のみをサポートの予定 どちらのモードも0オリジン
	指定モードとしてtype6(30df)/7(60df)を与える
	type7は30DF互換なので30DFと同じタイミングで4フレームドロップカウントする
*/
nas.Frm2FCT = function(frames,type,ostF,fpsC) {
if(!type){type=0}
if(!fpsC){fpsC=this.FRATE}
if((type==6)||(type==7)){
/*	SMPTE 30DF/type6 60DF/type7*/
var dF=2589408;var hF=107892;var dmF=17982;var lmFd=1798;var lmFc=1800;var sF=30;var dropF=2;
if(type==7){dF=dF*2;hF=hF*2;dmF=dmF*2;lmFd=lmFd*2;lmFc=lmFc*2;sF=sF*2;dropF=dropF*2;}

var FR=(frames<0)? dF+(frames%dF):frames;//負数は24hの補数化して解決
var h=0;var m=0;var s=0;var f=0;
	h =Math.floor((FR / hF) % 24);//SMPTE TCは24時ループ
//		mを10分単位でクリップすると計算が単純化される
	var fRh = FR % hF;//未処理フレーム
	var md =Math.floor(fRh/dmF);//10分単位
	var mu =((fRh % dmF)<lmFc)? 0 : Math.floor(((fRh % dmF)-lmFc) / lmFd)+1;//10分以下の分数
	m  = (md*10) + mu;//加算して分数
	fRm = fRh -(dmF*md)-(lmFd*mu);//
	fRm -= (mu==0)? 0 : dropF;//正分まで処理を終えた残フレーム
	s = (mu == 0)? Math.floor(fRm/sF):Math.floor((fRm+dropF)/sF);//秒数・例外を除きドロップ2フレ補償
	fRs = ((mu == 0)||(s == 0))? fRm - (s * sF):fRm - (s * sF) + dropF;
	f=((mu==0)||(s!=0))? fRs:fRs+dropF;
 return nas.Zf((h%24),2)+":"+nas.Zf(m,2)+":"+nas.Zf(s,2)+";"+nas.Zf(f,2);
}else{
/*	通常のTCを作成	*/
var negative_flag = false;
if (frames < 0) {frames = Math.abs(frames);negative_flag=true;};
	if (ostF == 1) {
		PostFix = ' _';
	} else {
		ostF = 0;
		PostFix = ' .';
	};
//
//	default	00000
//	type 2	0:00:00
//	type 3	000 + 00
//	type 4	p 0 / 0 + 00
//	type 5	p 0 / + 000
//		type 6	00:00:00;00
//		type 7	00:00:00;00
//
var m = Math.floor((frames + ostF) / (fpsC * 60));
 var s = Math.floor((frames + ostF) / fpsC);
  var SrM = s % 60;
   var p = Math.floor(s / this.SheetLength ) + 1;//SheetLength秒数で計算
    var FrS = Math.floor(frames-(s * fpsC))+ostF;//秒単位端数フレーム
     var FrP = Math.floor(frames-(((p-1)*this.SheetLength) * fpsC))+ostF;//ページ
      var SrP = s-((p-1)*this.SheetLength);//ページ単位端数 秒

switch (type) {
case 5: Counter ='p ' + this.Zf(p,1) + ' / + ' + this.Zf(FrP,3) + PostFix ;break;
case 4: Counter ='p ' + this.Zf(p,1) + ' / ' + SrP +' + ' + this.Zf(FrS,2)+ PostFix ;break;
case 3: Counter =this.Zf(s,1) + ' + ' + this.Zf(FrS,2) + PostFix ;break;
case 2: Counter =this.Zf(m,1) + ':' + this.Zf(SrM,2) + ':' + this.Zf(FrS,2) + PostFix ;break;
default: Counter =this.Zf(frames + ostF ,4) + PostFix ;
};
if (negative_flag) {Counter="-( " + Counter +" )"};
 return Counter;
}
};

/*
nas.FCT2Frm(Fct,fpsC)
引数 :タイムカウンタ文字列[,カウンタフレームレート]
戻値 :フレーム数

カウンタ文字から0スタートのフレーム値を返す
カウンタ文字列と認識できなかった場合は'元の文字列'を返す[仕様変更]
ドロップフレームが指定された場合はフレームを戻さず上記に準ずる

タイムカウンタ文字列はFrm2FCT()の文字列を全て認識して解決する
負数対応
フレームレートの指定が可能なように拡張(2010/11/06)
指定がない場合　nas.RATE を参照する
カウンタ文字列にページ指定がある場合は　nas.SheetLength　を参照する
この変数の一時指定はできないので、システムプロパティを直接書き直す必要がある

SMPTEドロップを拡張(2010.11.05)
TC文字列判定 キーは
　最終セパレータが";"であるか否か
　文字列末尾のオリジネーション指定はあってもよいが無効（全て0オリジン）
　フレームレートは30DF 60DFでは強制指定が行われたものとする。
　中間の45fpsを閾値としてnas.FRATEがそれ以下の場合は30DF
　それ以上の場合は60DFのフレーム数を返す
　本来60DFはSMPTEの規格外なので扱いに注意すること
*/
nas.FCT2Frm = function(Fct,fpsC)
{
	if(!fpsC){ fpsC = this.FRATE};
	fct = Fct.toString();
	var negative_flag=1;
//負数表示がある場合ネガティブモードに遷移
   if (fct.match(/^\-\(([^\(\)]*)\)$/)){
	fct=RegExp.$1;
	negative_flag=-1;
   }
//空白を全削除
	fct = fct.replace(/\s/g,'');
//文字列の最期の文字を評価してオリジネーションを取得
	if (fct.charAt(fct.length - 1)=='_') {
		ostF = 1;
		PostFix = '_';
	} else {
		ostF = 0;
		PostFix = '.';
	};

//文字列の最期の文字がポストフィックスなら切り捨て
//	alert(fct.charAt(fct.length - 1)+" : "+PostFix);
	if (fct.charAt(fct.length - 1)==PostFix) {
		fct = fct.slice(0,-1);
	};
//初期判定で　SMPTE-DFを分離
	if(fct.match(/^([0-9]+:){0,2}[0-9]+;[0-9]+$/)){
//SMPTE hh:mm:ss;ff
		fct=fct.replace(/;/g,":");//セミコロンを置換
		fpsC=(fpsC<45)?29.97:59.94;//SMPTEドロップが指定されたので強制的にフレームレート調整
		ostF=0;PostFix="";

//一時係数設定
var dF=2589408;var hF=107892;var dmF=17982;var lmFd=1798;var lmFc=1800;var sF=30;var dropF=2;
if(fpsC>=45){dF=dF*2;hF=hF*2;dmF=dmF*2;lmFd=lmFd*2;lmFc=lmFc*2;sF=sF*2;dropF=4;};//60DF
//TCをスプリットして配列に入れる
		tmpTC=new Array();
		tmpTC=fct.split(":");
		var h=0;var m=0;var s=0;var k=0;
//
		switch (tmpTC.length) {
case 4:	 h=tmpTC[tmpTC.length - 4]*1;
case 3:	  m=tmpTC[tmpTC.length - 3]*1;
case 2:	   s=tmpTC[tmpTC.length - 2]*1;
case 1:	    f=tmpTC[tmpTC.length - 1]*1;
		};
//フレームドロップ判定
if(((m%10)>0)&&(s==0)&&(f<dropF)){return null};//ドロップフレームはヌル戻し

	var FR  = h * hF;//時
	FR += Math.floor(m / 10) * dmF  ;//＋10分単位で加算
	FR += (m % 10) * lmFd;//ひとけた分乗算
	FR += ((m % 10)>0)? dropF : 0;//1分以上なら読み飛ばさなかったフレームを加算
	FR += s * sF;//秒数乗算
	FR -= (((m % 10)>0)&&(s>0))? dropF : 0;//00 10 20 30 40 50 分の例外フレームを減算して解決
	FR += f;//フレームを加算
	FR -= (((m % 10)>0)&&(s==0)&&(f>=dropF))? dropF:0;//例外ドロップフレームを減算
//ここで存在しないはずの ドロップされたフレームは減算対象外にして後ろに送る

	return FR*negative_flag;
	}else{
//標準処理(ドロップ含む)
//	if (fct.match(/[0-9\:\p\/\+]/)) {return fct}
// ローカル変数初期化
	var p=1;
	 var h=0;
	  var m=0;
	   var s=0;
	    var k=0;
//	type 1	00000 ドロップは存在しない
	if (fct.match(/^[0-9]+$/)) {
		k=fct;
	} else {
//	type 2	0:00:00　少数フレームレートの際にドロップ発生
	if (fct.match(/^([0-9]+:){1,3}[0-9]+$/)) {
//TCなのでスプリットして配列に入れる
		tmpTC=new Array();
		tmpTC=fct.split(":");
		switch (tmpTC.length) {
case 4:	 h=tmpTC[tmpTC.length - 4];
case 3:	  m=tmpTC[tmpTC.length - 3];
case 2:	   s=tmpTC[tmpTC.length - 2];
case 1:	    k=tmpTC[tmpTC.length - 1];
		};
	} else {
//	type 3	000 + 00
	if (fct.match(/^[0-9]+\+[0-9]+$/)) {
		s=fct.substring(0,fct.search(/\+/));
		 k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 4	p 0 / 0 + 00
	if (fct.match(/^p[0-9]+\/[0-9]+\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\x2F/));
		 s=fct.substring(fct.search(/\x2F/)+1,fct.search(/\+/));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 5	p 0 / + 000
	if (fct.match(/^p[0-9]+\/\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\x2F/));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
// ダメダメ
	return fct;
		}}}}};
// 数値化して全加算
 p=parseInt(p,10);
  h=parseInt(h,10);
   m=parseInt(m,10);
     s=parseInt(s,10);
      k=parseInt(k,10);
/*
	タイムコード的にはすべて整数であることが必須
	フレームレートが少数点以下の値を含む場合はすべて切り上げてフレームを得る
	→ (1+10.5)は(1+11)にあたる
*/
var	Seconds=(p-1) * this.SheetLength + h * (60 * 60) + m * (60) + s;
var	Frames= Math.ceil(( Seconds * fpsC ) + k )- ostF;
//ナチュラルドロップフレームの判定 フレーム継続時間の末尾が秒境界をまたがった場合をドロップカウントする
//連続してフレームがドロップすることはありえないのでこのように判定
//整数フレームレート時に実行されていたので、トラップする　2012　0205

	if (((fpsC % 1)!= 0)&&(Math.floor(Frames/fpsC) != (Seconds))){
		return null
	};
//{alert ("drop :"+Frames+" >> "+(Frames)/fpsC+":"+Seconds)};
//この判定のため電卓の計算式に使用するときのトラップが発生するので注意(2010/11/06)
	 return Frames*negative_flag;
	}
};
/* 
	お道具箱汎用データ操作関数群


//お道具箱汎用データ操作関数群オワリ

*/
/*
	ベクトル演算関数群
*/
/*	nas.preformvector(vec1,vec2)
引数:	ベクトル（配列）２つ
戻値:	次数の揃ったベクトル（配列）２つ
	ベクトル演算事前処理
与えられたベクトルの次数を多いものに揃えて不足分に0を加えて返す
内部使なのでエイリアスは不要
*/
nas.preformvector = function (vec1,vec2){
//単項スカラだった場合、要素数1の配列に変換しておく。
	if (typeof(vec1)=="number") {vec1=[vec1];}
	if (typeof(vec2)=="number") {vec2=[vec2];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var difD = (vec1.length - vec2.length);
	var vecD = (vec1.length > vec2.length)? vec1.length:vec2.length;
//要素数の多い方をとって不足する要素は0で補う
	if (difD > 0) { for (var idx = 0 ; idx < difD; idx ++){	vec2 = vec2.concat([0]);}}else{
		if (difD < 0) { for (var idx = 0 ; idx > difD; idx --){	vec1 = vec1.concat([0]);}}
	}
	return [vec1,vec2,vecD];
}
/*	nas.add(vec1,vec2)
引数:ベクトル配列1　ベクトル配列2
戻値:各項を加算したベクトル
	ベクトル和を返す。
*/
nas.add = function(vec1,vec2) {
	var preformedVec=this.preformvector(vec1,vec2);
	var vec3 = new Array(preformedVec[2]);
//和を求めて返す。
	for (var idx = 0;idx < vec3.length ; idx ++) { vec3[idx] = preformedVec[0][idx] + preformedVec[1][idx];}
	return vec3;
}
/*	nas.sub(vec1,vec2)
引数:ベクトル配列1　ベクトル配列2
戻値:各項を減算したベクトル
	ベクトル差を返す
*/
nas.sub = function(vec1,vec2) {
	var preformedVec=this.preformvector(vec1,vec2);
	var vec3 = new Array(preformedVec[2]);
//差を求めて返す。
	for (idx = 0;idx <  vec3.length ; idx ++) {	 vec3[idx] = preformedVec[0][idx] - preformedVec[1][idx];  }
	return vec3;
}
/*	nas.mul(vec,amount)
引数:ベクトル配列　乗数
戻値:各項に乗数を積算したベクトル
	ベクトル積を返す
*/
nas.mul = function(vec,amount) {
	if (typeof(vec)=="number") vec=[vec];
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//積を求めて返す。
	for (idx = 0;idx < vecD ; idx ++) {vecNew[idx] = vec[idx] * amount; }
	return vecNew;
}

/*	nas.div(vec,amount)
引数:ベクトル配列　商数
戻値:各項を商数で割ったベクトル
	ベクトル商を返す
*/
nas.div = function(vec,amount) {
	if (typeof(vec)=="number") {vec=[vec];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//商を求めて返す。
	for (idx = 0;idx < vecD ; idx ++) { vecNew[idx] = vec[idx] / amount; }
	return vecNew;
}

/*	nas.clamp(vec, limit1, limit2)
引数:ベクトル配列　制限値１　制限値２
戻値:制限値の範囲内にクランプされたベクトル
	ベクトルを制限値でクランプする
*/
nas.clamp = function(vec, limit1, limit2) {
	var max=limit1;var min=limit2;
	if (limit1 < limit2){ max=limit2;min=limit1 }
	if (typeof(vec)=="number") {vec=[vec];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//要素ごとに値をクランプして返す。
	for (idx = 0;idx < vecD ; idx ++) {
		if (vec[idx] >= min && vec[idx] <= max){
			vecNew[idx] = vec[idx];
		} else {
			vecNew = (vec[idx] >= min )?vecNew.concat([max]):vecNew = vecNew.concat([min]);
		}
	}
	return vecNew;
}

/*	nas.dot(vec1,vec2)
引数:ベクトル配列1　ベクトル配列2
戻値:ベクトル要素の内積
	ベクトル内積
*/
nas.dot = function(vec1,vec2) {
 	var Result = 0;
//要素ごとに積算。
	for (idx = 0;idx < preformedVec[2].length ; idx ++) { Result += (preformedVec[0][idx] * preformedVec[1][idx]); }
	return Result;
}
/*	nas.cross(vec1, vec2)
引数:ベクトル配列1　ベクトル配列2
戻値:ベクトル要素の外積
　AEの仕様に合わせて2次元と3次元の値のみを計算する

*/
nas.cross = function(vec1, vec2) {
	var preformedVec=this.preformvector(vec1,vec2);
	vec1=preformedVec[0];
	vec2=preformedVec[1];
	var vecD=preformedVec[2];
	var Result = 0;
//2次元か3次元で分岐
	switch (vecD) {
case 2:
//2次元の時は外積を求めるためz座標値に0を補ってやる。(breakなし)
			vec1 = vec1.concat([0]);
			vec2 = vec2.concat([0]);
case 3:
	Result = [	vec1[1] * vec2[2] -  vec1[2] * vec2[1],
			vec1[2] * vec2[0] -  vec1[0] * vec2[2],
			vec1[0] * vec2[1] -  vec1[1] * vec2[0]	];
	break;
default:
	Result="2次元か3次元の値である必要があります。"	;	
	}
return Result;
}
/*	nas.length(vec)
引数:ベクトル配列
戻値:ベクトル長
	ベクトルの長さを求める
*/
nas.length = function(vec) {
//引数がいくつかを求める
	if (arguments.length==2){
		if (	typeof(arguments[0])=="number" &&
			typeof(arguments[1])=="number"
		){
			vec=[arguments[0],argments[1]];
		}else{
	if(	typeof(arguments[0][0])=="number" &&
		typeof(arguments[0][1])=="number" &&
		typeof(arguments[1][0])=="number" &&
		typeof(arguments[1][1])=="number" 
	){
		vec=this.sub(arguments[0],arguments[1]);
	}else{
		return "配列を入力しましょう";
	}
		}
	}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	if (isNaN(vecD)) { return  }
	var Length;
//長さを求める
switch (vecD) {
case 1:	Length = vec[0];break;
case 2:
case 3:
	Length = Math.pow(Math.pow(vec[0],2) + Math.pow(vec[1],2),.5);
		if (vecD > 2) {
	for (idx = 2 ; idx < vecD ; idx ++) { Length = Math.pow(Math.pow(Length,2) + Math.pow(vec[idx],2),.5) }
		};
break;
default:	return "2次元または3次元の値を入力しましょう";
}
return Length;
}
/*	nas.normalize(vec)
引数:ベクトル配列
戻値:単位長ベクトル
	方向が同じで長さ１のベクトル
*/

nas.normalize = function(vec) {return this.div(vec,this.length(vec))};

//=====================ベクトル演算関数おしまい

//AE　ExpressionOtherMath 互換 角度<>ラジアン変換関数
//桁切らないほうが良いかも、運用してみて判断しましょう 2006/06/23
nas.degreesToRadians =function(degrees){
	return Math.floor((degrees/180.)*Math.PI*100000000)/100000000;
}
nas.radiansToDegrees =function(radians){
	return Math.floor(180. * (radians/Math.PI)* 100000)/100000;
}

//==================== 互換のためエイリアスを設定する
	if(typeof (preformvector) == "undefined") var preformvector=nas.preformvector;
	if(typeof (add) == "undefined") var add=nas.add;
	if(typeof (sub) == "undefined") var sub=nas.sub;
	if(typeof (mul) == "undefined") var mul=nas.mul;
	if(typeof (div) == "undefined") var div=nas.div;
	if(typeof (clamp) == "undefined") var clamp=nas.clamp;
	if(typeof (dot) == "undefined") var dot=nas.dot;
	if(typeof (cross) == "undefined") var cross=nas.cross;
	if(typeof (length) == "undefined") var length=nas.length;
	if(typeof (normalize) == "undefined") var normalize=nas.normalize;
 	if(typeof (degreesToRadians) == "undefined") var degreesToRadians=nas.degreesToRadians;
 	if(typeof (radiansToDegrees) == "undefined") var radiansToDegrees=nas.radiansToDegrees;
// 以前のコードを洗ってエイリアスが不要なら削除のこと AEエクスプレッション準互換ベクター/数学関数


/*	corveto 関連の関数
		なんかまだつらそうだがとりあえず設定しておく
*/
// ベジェの一次式
nas.bezier = function(SP, CP1, CP2, EP, T) {
//この式は定義どおりの式

	var Ax = EP - SP - (3 * (CP2 - CP1));
	var Bx = 3 * (CP2 - (2 * CP1) + SP);
	var Cx = 3 * (CP1 - SP);
    
	var Result = (Ax * Math.pow(T,3)) + (Bx * Math.pow(T,2)) + (Cx * T) + SP;
    
	return Result;
};
//
// 一次ベジェの逆関数 係数と値から序変数tをもとめる
/*
この関数は範囲を限定してタイミングを求める関数として生かし
SP=0  EP=1*/
nas.bezierA = function(CP1, CP2, Vl) 
{
/*
制御点の範囲を0-1に限定して値の増加傾向を維持することで、値に対する助変数を決定する 関数。一般値を求める関数ではありませんのでご注意ください。
*/
	if ( Vl > 1 || CP1 > 1 || CP2 > 1 || Vl < 0 || CP1 < 0 || CP2 < 0) {
		return "rangeover";
	};
	var Ck = 0;
	if (Vl == 0) {var t = 0} else {if (Vl == 1) {var t = 1} else {
//初期化
//助変数の初期値を値にとる
	t = Vl ;//テスト用仮値
//求めた助変数でテスト値をとる
//助変数が
	var TESTv = this.bezier(0, CP1, CP2, 1, t);//初期テスト値
	var UPv = 1;	//上限値
	var DOWNv = 0;	//下限値
	do {
if ( TESTv < Vl ) { DOWNv = t }else {UPv = t};
//	テスト値によって上限または下限を入れ換え
	t = (DOWNv + UPv) / 2;
	Ck = Ck + 1;//チェック回数(デバック用)
TESTv = this.bezier(0, CP1, CP2, 1, t);
	} while (TESTv / Vl < 0.999999999 || TESTv / Vl > 1.0000000001)
//テスト値が目標値にたいして十分な精度になるまでループ(精度調整待ち 05/01)
}};
t = Math.round(t*100000000)/100000000;
//
	if (dbg) dbg_info.notice="loop-count is "+Ct;
//デバッグメモにカウンタの値を入れる
var Result = t;//助変数
return Result;
};

//
//
/*	一般式ﾍﾞｼﾞｪの弧の長さを求める
引数は
bezierL(開始値,制御点1,制御点2,終了値[[,開始助変数,終了助変数],分割数])
分割数が省略された場合は	10
開始・終了助変数が省略された場合は	0-1
*/
nas.bezierL = function(SP,CP1,CP2,EP,sT,eT,Slice)
{
	if (! SP)	SP=0;
	if (! EP)	EP=1;
	if (! CP1)	CP1=0;
	if (! CP2)	CP2=1;

	if (! Slice)	Slice=10;
	if (! sT)	sT=0;
	if (! eT)	eT=1;

//AEの仕様に合わせて 単項、2次元3次元のみを扱う
//次元数取得
	var Dim=(typeof(SP)=="number")? 1:SP.length;

	var Ltable=new Array(Slice);//分割長テーブルを作る

	for (i=0;i<Slice;i++)
	{
switch(Dim){
case	1:
		Ltable[i]=Math.abs(
			this.bezier(SP,CP1,CP2,EP,sT+(eT-sT)*(i/Slice))-
			this.bezier(SP,CP1,CP2,EP,sT+(eT-sT)*((i+1)/Slice))
		);
	break;
case	2:
var p1x=this.bezier(SP[0],CP1[0],CP2[0],EP[0],sT+(eT-sT)*(i/Slice));
var p1y=this.bezier(SP[1],CP1[1],CP2[1],EP[1],sT+(eT-sT)*(i/Slice));

var p2x=this.bezier(SP[0],CP1[0],CP2[0],EP[0],sT+(eT-sT)*((i+1)/Slice));
var p2y=this.bezier(SP[1],CP1[1],CP2[1],EP[1],sT+(eT-sT)*((i+1)/Slice));
// alert([p1x,p1y],[p2x,p2y]);

Ltable[i]=this.length(this.sub([p1x,p1y],[p2x,p2y]));
	break;
case	3:
var p1x=this.bezier(SP[0],CP1[0],CP2[0],EP[0],sT+(eT-sT)*(i/Slice));
var p1y=this.bezier(SP[1],CP1[1],CP2[1],EP[1],sT+(eT-sT)*(i/Slice));
var p1z=this.bezier(SP[2],CP1[2],CP2[2],EP[2],sT+(eT-sT)*(i/Slice));

var p2x=this.bezier(SP[0],CP1[0],CP2[0],EP[0],sT+(eT-sT)*((i+1)/Slice));
var p2y=this.bezier(SP[1],CP1[1],CP2[1],EP[1],sT+(eT-sT)*((i+1)/Slice));
var p2z=this.bezier(SP[2],CP1[2],CP2[2],EP[2],sT+(eT-sT)*((i+1)/Slice));
Ltable[i]=this.length(this.sub([p1x,p1y,p1z],[p2x,p2y,p2z]));
	break;
default	:	return false;
}
	};

	var T=0;
	for(n in Ltable){T +=Ltable[n]}

return T;
};
//
//暫定色彩関連関数
nas.colorStr2Ary=function(colorString)
{
var Cr=.5;var Cg=.5;var Cb=.5;
	if (colorString.match(/^\#[0-9abcdef]+/i)){
Cr=eval("0x"+colorString.substr(1,2)+" /255");
Cg=eval("0x"+colorString.substr(3,2)+" /255");
Cb=eval("0x"+colorString.substr(5,2)+" /255");
	return [Cr,Cg,Cb];
	};
	if (colorString.match(/^rgb\([\d]*\%?[\s\,]+[\d]*\%?[\s\,]+[\d]*\%?\)$/)){
	var myColor =eval(
colorString.replace( /rgb\(/, "\[").replace( /\)/ig, "\]").replace( /\%/g, "\*2.55")
);
	return this.div(myColor,255);
	};
	return [Cr,Cg,Cb];
};

//	WEB色指定用の文字列を3次元の配列にして返す


nas.colorAry2Str=function (colorArray)
{
var Sr=((colorArray[0]*255) >=16)?
	Math.round(colorArray[0]*255).toString(16):
	"0"+Math.round(colorArray[0]*255).toString(16);
var Sg=((colorArray[1]*255) >=16)?
	Math.round(colorArray[1]*255).toString(16):
	"0"+Math.round(colorArray[1]*255).toString(16);
var Sb=((colorArray[2]*255) >=16)?
	Math.round(colorArray[2]*255).toString(16):
	"0"+Math.round(colorArray[2]*255).toString(16);
return "#"+Sr+Sg+Sb;
};


//配列形式のカラーデータを16進文字列で返す

/* ######################## 行列計算関数群
原型となったtcl 処理系との互換のため引数はリスト文字列または1次元の配列で与える必要があるので注意



*/
 
//  行列表示(特設デバッグ表示)
nas.showMatrix	= function(Name,Matrix,L,C)
{
	if((Matrix instanceof Array)) Matrix = Matrix.toString();
	Matrix=Matrix.split(',');
//  表示名 行列リスト 行数 列数
	var Result	=Name +":\n";

	for(i=0;i<L;i++) {
	  for(j=0;j<C;j++){
//	puts -nonewline [format \t%\ 4.4f [lindex ${Matrix} [expr ${i} * ${C} + ${j}]]]
	    Result +="\t "+Matrix[i*C+j] ; 
	  };
	  Result += "\n";
	};
	alert(Result);
	return;
};
//  行列表示終わり
/*	行列式計算(2または3,4 の正方行列のみ)



*/
nas.mDeterminant = function (myMatrix)
{
	if((myMatrix instanceof Array)){myMatrix=myMatrix.toString().split(',');}else{myMatrix=myMatrix.split(',');};
	if (myMatrix.length!=4 && myMatrix.length!=9 && myMatrix.length!=16) {	return null;}//ひとまずヌル返す？
	if (myMatrix.length==4) {
//var Result [expr [lindex ${Matrix} 0] * [lindex ${Matrix} 3] - [lindex ${Matrix} 1] * [lindex ${Matrix} 2]]
//2×2の正方行列式
	  var Result = myMatrix[0]*myMatrix[3] -myMatrix[1]*myMatrix[2];
	} else {
	if(myMatrix.length==9){
//3×3の正方行列
	var Result=0;
	  Result+=(1*myMatrix[0])*(1*myMatrix[4])*(1*myMatrix[8]);
	  Result+=(1*myMatrix[1])*(1*myMatrix[5])*(1*myMatrix[6]);
	  Result+=(1*myMatrix[2])*(1*myMatrix[3])*(1*myMatrix[7]);
	  Result-=(1*myMatrix[0])*(1*myMatrix[5])*(1*myMatrix[7]);
	  Result-=(1*myMatrix[1])*(1*myMatrix[3])*(1*myMatrix[8]);
	  Result-=(1*myMatrix[2])*(1*myMatrix[4])*(1*myMatrix[6]);
	}else{
//正方行列 4x4
myMatrix=[myMatrix.slice(0,4),myMatrix.slice(4,8),myMatrix.slice(8,12),myMatrix.slice(12)];
var Result=1.0;
var buf;
var n=4;  //配列の次数
 
//三角行列を作成
for(var i=0;i<n;i++){
 for(var j=0;j<n;j++){
  if(i<j){
   var buf=myMatrix[j][i]/myMatrix[i][i];
   for(var k=0;k<n;k++){
     myMatrix[j][k]-=myMatrix[i][k]*buf;
   }
  }
 }
}
 
//対角部分の積
for(i=0;i<n;i++){ Result *= myMatrix[i][i] };
	}
	};
	return Result;
};
//  行列式計算終わり

//  行列の積算
nas.multiMatrix	= function(M1,M2)
{
	if(M1 instanceof Array){M1 = M1.toString().split(',')}else{ M1 = M1.split(",");}
	if(M2 instanceof Array){M2 = M2.toString().split(',')}else{ M2 = M2.split(",");}
//  M1 は、3×3の行列 M2は、3×? の行列でなくてはならない
//  それ以外の場合は、3×3 の単位行列を返す
	if(M1.length != 9  || M2.length % 3 !=0){
		return "1,0,0,0,1,0,0,0,1";
	};
//  応答行列初期化
	var multiprideMatrix =new Array();
//  行列の次数を設定
	var D1C =3;//
	var D1L =3;//
	var D2C =Math.floor(M2.length / D1L);
	var D2L =D1C;
for (Mi=0;Mi<D1L;Mi++){
	for (Mj=0;Mj<D2C;Mj++){
	  var X =0;
	    for (count=0;count<D1C;count++){
X= X+M1[Mi * D1C +count ] * M2[Mj % D2C +D2C * count ] ;
	    }
	  multiprideMatrix.push(X);
	}
};
return multiprideMatrix.toString();
};
//  行列の積算終わり

//  逆行列生成
//2次または3次/4次の正方行列である必要があります。

nas.mInverse	= function(Matrix)
{
	if(Matrix instanceof Array){ Matrix= Matrix.toString().split(',')}else{ Matrix= Matrix.split(',')};

if(Matrix.length!=4 && Matrix.length!=9 && Matrix.length!=16 ){return null;};
//  逆行列初期化
var InversedMatrix = new Array();
//  行列の次数を取得
	var D = Math.sqrt(Matrix.length);// expr int(sqrt ([llength ${Matrix}]))]
// 	余因数生成
for (j=0;j<D;j++){
  for (i=0;i<D;i++){
	var Cm = new Array();
	for (Cj=0;Cj<D;Cj++){
	  for (Ci=0;Ci<D;Ci++){
	    if ((Cj-j)==0){
		continue;
	    } else{
		if((Ci-i)==0) {
			continue;
		} else {
			Cm.push(Matrix[Cj*D+Ci]);
		}
	    }
	  }
	}
	var Mx = this.mDeterminant(Matrix)
	InversedMatrix.push(this.mDeterminant(Cm) * Math.pow(-1,i + j) / Mx)
  }
}
return this.transMatrix(InversedMatrix).toString();
};
//  逆行列生成終わり
//  行列の転置
nas.transMatrix	= function(Matrix)
{
	if(Matrix instanceof Array){ Matrix= Matrix.toString().split(',')}else{ Matrix= Matrix.split(',')};

	if(Matrix.length!=4 && Matrix.length!=9 && Matrix.length!=16 ){return null;}
//  転置配列の初期化
	var tranposedMatrix =new Array();
//  行列の次数を取得
	var D =Math.sqrt(Matrix.length);
//  転置
	for(j=0;j<D;j++){
	  for(i=0;i<D;i++){
	    tranposedMatrix.push( Matrix[i* D+j]);
	  }
	};
	return tranposedMatrix.toString();
};
//  行列の転置終わり
// ######################## 行列関数群終わり

//	回転角関連

//azimuth（アジマス）は地図・海図等で使用する方位角。
//ここでは時計の12時方向(北=N)を0度として時計回り方向に 1周360°の単位系とします。
//方位角の概念は　AEには存在しない
nas.deg2azi=function(degrees)
{//傾斜角から方位へ
	return (-1*degrees+90);
}
nas.azi2deg=function(azimuth)
{//方位から傾斜角へ
	return (-1*(azimuth-90))
}

// 2次元のベクトルを与えて方位角を求める。長さを加えるべきか？
//引数formは戻し値の形式を指定。デフォルトは方位角
function vec2deg(Vector,form)
{
 	if (Vector.length!=2){return false};
 	if (!form){form="degrees"};
 	var x=Vector[0];var y=Vector[1];
	var	myRadians=(y==0)?0:Math.atan(y/x);
 	if (x<0){myRadians+=Math.PI};
	switch(form)
	{
		case		"redians":var result=myRadians;
		break;	
		case		"degrees":var result = Math.floor(180. * (myRadians/Math.PI)* 10000)/10000;//degrees;
		break;	
		case		"azimuth":
		default	:
				var result = nas.deg2azi(radiansToDegrees(myRadians));
		break;	
	} 	
	return result;
}
/*	暫定文字列操作メソッド	*/
//バイト数を返す。
//実装によっては内部コードが違うのでマルチバイト部分のバイト数は同じとは限らない。
nas.biteCount	=function(myString){
if(! myString){myString="";};
	var btCount=0;
	for (cid=0;cid<myString.length;cid++){
		cXV=myString.charCodeAt(cid);
		while(cXV>0){btCount++;cXV=Math.floor(cXV/256);}
	}
	return btCount;
}


//文字列のバイト数を勘定して、指定バイト以下の文字列に区切って返す。
//AEのラベル31バイト制限用なので、デフォルトは 31
nas.biteClip	=function(myString,count){
if(! myString){myString="";};
	if(! count){count=31};
	var btCount=0;
	for (cid=0;cid<myString.length;cid++){
		cXV=myString.charCodeAt(cid);
		while(cXV>0){btCount++;cXV=Math.floor(cXV/256);}
		if (btCount>count){return myString.slice(0,cid);}
	}
	return myString;//抜けたら全部返す
};
/* nas.incrStr(myString)
引数　任意文字列
戻値	文字列の末尾の番号部分を１くり上げて返す
	１０進数値のみサポート
	数字の末尾にサブバージョン表記として[a-z]の
	付記があってもそれを切り捨てて評価するのでちょっとだけ便利
	番号がなければそのまま戻す
*/

nas.incrStr=function(myString,myStep){
	if(isNaN(myStep)){myStep=1};
	if(myString.match(/^(.*[^\d])?(\d+)([a-z]?)$/i)){
		var myPreFix=RegExp.$1;
		var myNumber=RegExp.$2;
//		var myPstFix=RegExp.$3;
	return myPreFix+nas.Zf(parseInt(myNumber,10)+myStep,myNumber.length)
	}
	return myString;
}
/*	nas.propCount(myObject,option)
引数:	任意のオブジェクト,リストスイッチ
戻値	オブジェクトのもつプロパティの数

単純にオブジェクトの総数を返す
削除されたが参照が残っているために無効になったオブジェクトを検査するために作成
ただしそれ以外の用途で使用できないわけではない
リストスイッチを入れるとプロパティを配列で返す
*/
nas.propCount=function(myObject,myOption)
{
	if(! myObject){return false;}
	if(myOption){var resultArray=new Array();}
	var myResult=0;
		for(prp in myObject){
			myResult++;
	if(myOption){resultArray.push(prp)}
			}
	if(myOption){
		return resultArray;
	}else{	
		return myResult;
	}
}
/*	単位つきの文字列値を数値にして返すメソッド

	nas.decodeUnit(入力値,変換単位)

	解釈できる単位は millimeters mm centimeters cm points picas pt pixels px inches in
	戻し値の単位も同じく
	デフォルトの単位は入りも戻しも pt
*/
nas.decodeUnit=function(myValue,resultUnit){
	if((myValue!=undefined)&&(myValue.match(/^([0-9]+.?[0-9]*)\s?(millimeters|mm|centimeters|cm|points|picas|pt|pixels|px|inches|in)?$/i))){
		var baseValue=parseFloat(myValue);
		var myUnit=RegExp.$2;
	}else{
		return false;
	}
	if(!(resultUnit.match(/^(millimeters|mm|centimeters|cm|points|picas|pt|pixels|px|inches|in)?$/i))){resultUnit="pt";}
	if(myUnit==resultUnit){return baseValue};//入出力単位が一致した場合はコンバート不要
//すべてptに変換 (ここに誤差が乗る原因あり)
	switch(myUnit){
case	"inches":
case	"in":myValue=72.*baseValue;break;
case	"pixels":
case	"px":myValue=72.*baseValue/this.Dpi();break;
case	"centimeters":
case	"cm":myValue=72.*baseValue/2.54;break;
case	"millimeters":
case	"mm":myValue=72.*baseValue/25.4;break;
case	"millipoints":
case	"mp":myValue=baseValue/1000.;break;
case	"points":
case	"paicas":
case	"pt":
default	:myValue=baseValue;
	}
	switch(resultUnit){
case	"inches":
case	"in":myResult=myValue/72.;break;
case	"pixels":
case	"px":myResult=this.Dpi()*myValue/72.;break;
case	"centimeters":
case	"cm":myResult=2.54*(myValue/72.);break;
case	"millimeters":
case	"mm":myResult=25.4*(myValue/72.);break;
case	"millipoints":
case	"mp":myResult=myValue*1000.;break;
case	"points":
case	"paicas":
case	"pt":
default	:myResult=myValue;
	}
return myResult;
};


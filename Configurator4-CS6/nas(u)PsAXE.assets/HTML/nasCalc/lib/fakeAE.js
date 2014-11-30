/*
	偽AE環境初期化関数 定義

コンポジションはレイヤを要素に持つ配列オブジェクト
レイヤは、複数のタイムラインを要素に持つ配列オブジェクト
タイムラインは、キーフレームを要素に持つ配列オブジェクト
タイムラインの 基本データ構造は[frame,value]の配列。

valueは、タイムラインの種別プロパティにしたがって変化する値の配列。
値が単項配列の場合、スカラ変数として使えるようにしておく。

以下タイムラインのプロパティ
value の構造、例のあれ?

name(=id) 識別名
valueAtTime(){キーフレームを補完した値を返すメソッド}
timeLineClass	タイムライン種別 ジオメトリ・エフェクト・リマップなどなど



以下レイヤのプロパティ

width	レイヤソース幅
height	レイヤソース高さ
pixelAspectRatio	ソースの縦横比
 inPoint	IN点
outPoint	OUT点

 footage	フーテージID

duration(){現継続時間を取得するメソッド(w)}
name(id)	識別名
orderId	重ね合わせ優先順位

以下コンポジションのプロパティ
name(id)	識別子
unitsOfSecond	フレームレート
compPixelAspectRatio	コンポのピクセル縦横比


*/
/*
	ベクトル演算関数群
*/
//ベクトル演算事前処理
//	与えられたベクトルの次数を多いものに揃えて不足分に0を加えて返す
function preformvector(vec1,vec2)
{
//単項スカラだった場合、要素数1の配列に変換しておく。
	if (typeof(vec1)=="number") {vec1=[vec1];}
	if (typeof(vec2)=="number") {vec2=[vec2];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var difD = (vec1.length - vec2.length);
	var vecD = (vec1.length > vec2.length)? vec1.length:vec2.length;//多い方
//片方が不足する場合は0で補う
	if (difD > 0) {
		for (var idx = 0 ; idx > difD; idx --){
			vec2 = vec2.concat([0]);
		}
	}
	if (difD < 0) {
		for (var idx = 0 ; idx < difD; idx ++){
			vec1 = vec1.concat([0]);
		}
	}
	return [vec1,vec2,vecD];
}
//	ベクトル和を返す。
function add(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

	var vec3 = new Array(vecD);

//和を求めて返す。
	for (idx = 0;idx < vecD ; idx ++) {
		 vec3[idx] = vec1[idx] + vec2[idx];
	}
return vec3;
}
//ベクトル差を返す
function sub(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

	var vec3 = new Array(vecD);

//差を求めて返す。
	for (idx = 0;idx < vecD ; idx ++) {
		 vec3[idx] = vec1[idx] - vec2[idx];
	}
return vec3;
}

//ベクトル積を返す
function mul(vec,amount) {

	if (typeof(vec)=="number") vec=[vec];
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//積を求めて返す。
for (idx = 0;idx < vecD ; idx ++) {
 vecNew[idx] = vec[idx] * amount;
}
return vecNew;
}

//ベクトル商を返す
function div(vec,amount) {
	if (typeof(vec)=="number") {vec=[vec];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//商を求めて返す。
	for (idx = 0;idx < vecD ; idx ++) {
 vecNew[idx] = vec[idx] / amount;
}
return vecNew;
}


//ベクトルクランプ
function clamp(vec, limit1, limit2) {
		var max=limit1;var min=limit2;
	if (limit1 < limit2){
		max=limit2;min=limit1;
}
	if (typeof(vec)=="number") {vec=[vec];}
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//要素ごとに値をクランプして返す。
for (idx = 0;idx < vecD ; idx ++) {
	if (vec[idx] >= min && vec[idx] <= max){
		vecNew[idx] = vec[idx];
	}else {
		vecNew = (vec[idx] >= min )?vecNew.concat([max]):vecNew = vecNew.concat([min]);
	}
}
return vecNew;
}

//内積
function dot(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

//	var vec3 = new Array(vecD);

	var Result = 0;
//要素ごとに積算。
	for (idx = 0;idx < vecD ; idx ++) {
		Result= Result + (vec1[idx] * vec2[idx])
	}
	return Result;
}
//外積
//AEの仕様に合わせて2次元と3次元の値のみを計算する
//
function cross(vec1, vec2) {


	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

//	var vec3 = new Array(vecD);

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

function length() {
//引数がいくつかを求める
	if (arguments.length==2){
		if (	typeof(arguments[0])=="number" &&
			typeof(arguments[1])=="number")
		{
			vec=[arguments[0],argments[1]];
		}else{
	if(	typeof(arguments[0][0])=="number" &&
		typeof(arguments[0][1])=="number" &&
		typeof(arguments[1][0])=="number" &&
		typeof(arguments[1][1])=="number" )
	{
		vec=sub(arguments[0],arguments[1]);
	}else{
		return "配列を入力しましょう";
	}
		}
	}
//
//ベクトルの次数を求める 二次元か三次元か四次元か
	var vecD = (vec.length);
	if (isNaN(vecD)) { return;  }
	var Length;
//長さを求める
switch (vecD) {
case 1:	Length = vec[0];break;
case 2:
case 3:
	Length = Math.pow(Math.pow(vec[0],2) + Math.pow(vec[1],2),.5);
		if (vecD > 2) {
	for (idx = 2 ; idx < vecD ; idx ++) {
		Length = Math.pow(Math.pow(Length,2) + Math.pow(vec[idx],2),.5);
	}
		};break;
default:	return "2次元または3次元の値を入力しましょう";
}
return Length;
}

function normalize(vec) {return div(vec,length(vec));}

//ベクトル演算関数おしまい

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

//AEの動作を模倣するために設定する偽オブジェクトの定義
//定義に使用する関数
//
//クラスプロトタイプの複製
//	この関数で、引き継ぎたいプロトタイププロパティを取得
//  function inherit(subClass, superClass) {
//        for (var prop in superClass.prototype) {
//            subClass.prototype[prop] = superClass.prototype[prop];
//        }
//    }
//



/*	合成キャリアオブジェクト設定
	キャリアオブジェクト単体は使用しないが、
	座標系オブジェクトの基礎オブジェクトになる。
	座標系の基本メソッドはここから取得する。
	合成バッファのたぐいは、コレ!
*/
function Carrier()
{
//this.prototype.contructor=Array;
	this.width		=	0	;
	this.height		=	0	;
	this.pixelAspect	=	1	;
	this.frameRate		=	1	;
	this.duration		=	0	;
}
//	new Carrier();
// Carrier.prototype.constructor = Array;
//	プロトタイプメソッド
	Carrier.prototype.setFrameRate	=
	function(rate){
		if(! rate)
		{rate=this.frameRate;}else{this.frameRate=rate;};
		this.frameDuration=1/rate;
	return rate;
	};
	Carrier.prototype.setFrameDuration	=
	function(duration){
		if(! duration)
		{duration=this.frameDuration;}else{this.frameDuration=duration;};
		this.frameRate=1/duration;
	return duration;
	};
	Carrier.prototype.setGeometry	=
	function(w,h,a){
		if(w){this.width	=w;}
		if(h){this.height	=h;}
		if(a){this.pixelAspect	=a;}
	return [w,h,a];
	};
/*	キーフレーム設定
	キーフレームの次元を与えて初期化する。
	一つのキーフレームは、以下のプロパティを持つ
	時間,		//積算フレーム数で
	[値],		//タイムラインのプロパティにしたがって多次元
	[[値の制御変数1],[2]],//値と同次元で、二つ一組
	[[タイミングの制御変数1],[2]],//二次元、二つ一組
	キーアトリビュート,//AE用キー補完フラグ
*/
function KeyFrame(f,v,vCp,tCp,kAtrib)
{
	if(!f){	f =0	}
		this.frame =f	;
	if(!v){	v=null	}
		this.value=v	;
	if(!vCp){ vCp=[1/3,2/3]	}
		this.valueCp=vCp	;
	if(!tCp){ tCp=[[1/3,2/3],[1/3,2/3]]	}
			this.timingCp=tCp	;//AE互換なら1次元で
	if(!kAtrib){ kAtrib=["stop","linear","time_fix"]	}
			this.keyAtrib=kAtrib	;
/*
キーアトリビュートは、現在はAE互換を標榜しておく。後で再考
[タイミング補完,値補完,値の時間補完(ロービング)]
*/

}
//	new KeyFrame();

//	タイムライン設定
function TimeLine(atrib)
{	this.name = atrib	}
//	new TimeLine();
	TimeLine.prototype= new Array();
	TimeLine.prototype.constructor=TimeLine;
//タイムラインのメソッド
//キーフレームをプッシュする。
//すでに登録されているキーフレームのうち、同じframe値を持つものがあれば上書き
//それ以外は新規登録する。このままだと順不同になるので後で書き換え要
TimeLine.prototype.setKeyFrame=	function (KeyFrame){
	for (id = 0;id<this.length;id ++)
	{	if (KeyFrame[0]==this[id][0])
		{
			this[id]=KeyFrame;
			return this.length;
		}
	}
	return this.push(KeyFrame);
};
//valueAtTime()
//AE互換?かもしれない?ここでは互換なし! t はフレーム数で与えること
function valueAtTime_(t){
	if(t <= this[0].frame){return this[0].value}
	if(t >= this[this.length-1].frame){return this[this.length-1].value}
		for(id=1;id<this.length;id ++)
		{
	if(t == this[id].frame){return this[id].value}
	if(t <  this[id].frame){//所属キーフレームが判明したので計算して返す
//

if (this[id].keyAtrib[0]=="stop"){
//キー補完が停止の時は、補完計算なし。前方キーの値で返す。
	return this[id-1].value;
}else{
		var Vstart	=this[id-1].value;
		var Vcp1	=this[id-1].valueCp[0];
		var Vcp2	=this[id-1].valueCp[1];
		var Vend	=this[id].value;

		var Tstart	=this[id-1].frame;
		var Tcp1	=this[id-1].timingCp[0];
		var Tcp2	=this[id-1].timingCp[1];
		var Tend	=this[id].frame;

//値が描くアークの全長を求める
		var HallArk=nas.bezierL(Vstart,Vcp1,Vcp2,Vend);
//指定時間からタイミング係数を求める
		var Now=(t-Tstart)/(Tend - Tstart);
//時間から 2次元(時間・比率)助変数を求める。
		var Tvt= nas.bezierA(Tcp1[0],Tcp1[1],Now);
//求めた助変数でタイミング係数を出す
		var Tvv= nas.bezierA(0,Tcp2[0],Tcp2[1],1,Tvt);
//係数から値を求める。
	Tt=Tvv;//仮助変数(初期値)
	Tmax=1;
	Tmin=0;
	var preLength	=0;//始点からのアーク長
	var postLength	=0;//終点までのアーク長
	var TtT	=0;//テストで得られる比率

do{
	preLength	=nas.bezierL(Vstart,Vcp1,Vcp2,Vend,0,Tt);
	postLength	=nas.bezierL(Vstart,Vcp1,Vcp2,Vend,Tt,1);
	TtT	=preLength/(preLength+postLength);
		if(Tvv<preLength/(preLength+postLength))
		{
			Tmin=Tt;//下限値を現在値に
			Tt=(Tmax+Tt)/2;//新テスト値を設定
		}else{
			Tmax=Tt;//上限値を現在値に
			Tt=(Tmin+Tt)/2;//新テスト値を設定
		}
} while(TtT/Tvv>0.9999999 && TtT/Tvv<1.0000001);//精度確認
	//その得られた助変数を使って値を返す。値の次元数でループ
	var Result=new Array(Vstart.length);
	for(i=0;i<Vstart.length;i++)
	{Result[i]=nas.bezier(Vstart[i],Vcp1[i],Vcp2[i],Vend[i],Tt)}
	return Result;
}	}	}

}

/*	レイヤ設定
レイヤのメンバはタイムライン
デフォルトで以下のタイムラインがある。
タイムリマップ**
アンカーポイント
位置
回転
不透明度
カラセル**
ワイプ
エクスプレッション
	**印は、りまぴんのみ
*/
function FakeLayer()
{

	this.width		=	640	;
	this.height		=	480	;
	this.pixelAspect	=	1	;
	this.frameRate		=	24	;
	this.duration		=	0	;
	this.activeFrame	=	0	;
//
		this.inPoint	=	0	;
		this.outPoint	= this.duration	;
//タイムラインプロパティなので後から初期化?りまぴんでは特に初期化しない。
this.init= function(){

this.timeRemap	= new TimeLine("timeRemap");
	this.timeRemap.push(new KeyFrame(0,"blank"));
this.anchorPoint = new TimeLine("anchorPoint");
	this.anchorPoint.push(new KeyFrame(0,[this.width/2,this.height/2,0])) ;
this.position = new TimeLine("position");
	this.positiont.push(new KeyFrame(0,[thisComp.width/2,thisComp.heigth/2,0])) ;
this.rotation = new TimeLine("rotation");
	this.rotation.push(new KeyFrame(0,[0,0,0])) ;
this.opacity = new TimeLine("opacity");
	this.opacity.push(new KayFrame(0,100)) ;
}

};
//	new FakeLayer();
	FakeLayer.prototype=new Carrier();
	FakeLayer.prototype.constructor=FakeLayer;
//		inherit(FakeLayer,Carrier);//Carrierのメソッドを取得

FakeLayer.prototype.setClip=function(ip,op){
	if (ip && ip>=0 && ip<=duration) this.inPoint=ip;
	if (op && op>=0 && op<=duration) this.outPoint=op;
return [ip,op];
};
/*
FakeLayer.prototype.=function(){
};
FakeLayer.prototype.=function(){
};
FakeLayer.prototype.=function(){
};
*/
//	コンポジション設定
//	コンポジションコンストラクタ
/*
function FakeComposition()
{
	this.width		=	640	;
	this.height		=	480	;
	this.pixelAspect	=	1	;
	this.frameRate		=	24	;
	this.duration		=	0	;
};
*/
function FakeComposition(w,h,a,l,f)
{
	this.layers=new Array();
		if (! w)	w	=640	;
		if (! h)	h	=480	;
		if (! a)	a	=1	;
		if (! l)	l	=6	;
		if (! f)	f	=24	;
	this.width	=w	;//幅(バッファ幅・px)
	this.height	=h	;//高さ(バッファ高さ・px)
	this.pixelAspect=a	;//ピクセル縦横比
	this.duration	=l	;//長さ(継続時間・秒)
	this.framerate	=f	;//フレームレート(fps)
};
//	ダミー初期化
//	new FakeComposition();
	FakeComposition.prototype=new Carrier();
	FakeComposition.prototype.constructor=FakeComposition;
	
//		inherit(FakeComposition,Carrier);//Carrierのメソッドを取得
//		inherit(FakeComposition,Array);//配列としてのメソッドを取得

//	メソッド設定
function frame_duration_(){return 1/this.framerate;}

FakeComposition.prototype.frameDuration	=frame_duration_	;
FakeComposition.prototype.frame_duration	=frame_duration_	;





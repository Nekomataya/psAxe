/*
 *	Xpsオブジェクト生成
		2007.04.03 エラーメッセージ分離
 */

/*
	Xpsオブジェクト初期化手順
		Xpsオブジェクトの新規作成
		コンストラクタ
	myXPS=new Xps([layer count][,frame length]);

Xpsクラスオブジェクトコンストラクタ

引数は、省略可能。
省略時はレイヤ数０，フレーム数０
セルの初期値は全て""
マップの設定はなし(ダミーマップも参照していない)

このオブジェクトはフレーム優先。
フレームレートを変えるとコマうちが変わるのではなく、カットの継続時間が変わる。
アニメーターの振ったコマ打ち優先!(これでいいのかなぁ?)


		XPSオブジェクトの再初期化
	method	[object Xps].init([layer count][,frame length])
自分自身を再初期化する。
すべてのプロパティをリセット
指定されたレイヤ数とフレーム長で空の値のテーブルを作成する。
以前のデータは消去。new_XPSは、内部でこのメソッドを呼ぶ。

		MAPオブジェクトの参照メソッド
	method	[object Xps].getMap([object Map])
このメソッドに引数としてマップオブジェクト[省略不可]を与える。
マップファイルがない場合は、falseを戻す。
現在の使用には、明示的にダミーオブジェクトを与える。
戻り値は取り込み成功時に true 
マップオブジェクトを参照して得られるプロパティは、
レイヤ情報初期値群
タイトル・サブタイトル 初期値

		現在の継続時間を返す
	method	[object Xps].duration()
このメソッドは、プロパティに変更予定
		
		現在のカット尺を返す
	method	[object Xps].time()
このメソッドは、プロパティに変更予定

		カット尺をフレーム数で返す
	method	[object Xps].getTC(フレーム数)
暫定メソッド、消えそう


		テキスト形式データを読み込んでオブジェクトに反映
	method	[object Xps].readIN(テキストデータ)
init()と一体化した方が良いかも

		テキスト形式で出力
	method	[object Xps].toString(セパレータ)
そのうち拡張

	method	[object Xps].mkAEKey(レイヤID)
モードよっては不要ぽい

*/
//Xpsクラスオブジェクト定義

// Xps_TimeLine クラスオブジェクト
function Xps_TimeLine(myIndex,myParent,myLength){
	if(!myLength){myLength=myParent.duration();}
	this.parent=myParent;
	this.length=myLength;
	for(var ix=0;ix<myLength;ix++){this[ix]="";}
	this.index=myIndex;
/*
	タイムラインの中間処理メソッド
	タイムラインをパースして有効データで埋まった１次元配列を返す
*/
	this.parseTm=function(myStart,myLength){
		if((! myStart)||(myStart>this.length)||(myStart<0)){myStart=0}
		if((! myLength)||(myLength>(this.length-myStart))){myLength=(this.length-myStart)}
//将来、データツリー構造が拡張される場合は、機能開始時点でツリーの仮構築必須
		if((this.index<1)||(this.index>this.parent.layers.length)||(this.parent.layers[this.index-1].option !=="timing")){return false}
//現在は、timing専用
//タイミングタイムラインの内部処理に必要な環境を作成
//		var	tmDataArray	=this.parent.xpsBody[this.index];
		var myLabel=this.parent.layers[this.index-1].name;
		var	blank_pos	=this.parent.layers[this.index-1].blpos;
		var	bflag=(blank_pos=="none")? false : true ;//ブランク処理フラグ

//前処理 シート配列からキー変換前にフルフレーム有効データの配列を作る
//全フレーム分のバッファ配列を作る
		var bufDataArray=new Array(myStart+myLength);
//第一フレーム評価・エントリが無効な場合空フレームを設定
		var myData=dataCheck(this[0],myLabel,bflag);
		bufDataArray[0]=(myData)? myData : bufDataArray[f-1] ;//有効データ以外は直前のデータを使用
//2--ラストフレームループ
		for (var f=1;f<bufDataArray.length;f++){
//有効データを判定して無効データエントリを直前のコピーで埋める
			var myData=dataCheck(this[f],myLabel,bflag);
			bufDataArray[f]=(myData)? myData : bufDataArray[f-1] ;//有効データ以外は直前のデータを使用
		}
		return bufDataArray.slice(myStart,bufDataArray.length);
	}
}
	Xps_TimeLine.prototype= new Array();
	Xps_TimeLine.prototype.constructor=Xps_TimeLine;

//				object Xps コンストラクタ
function Xps(Layers,Length)
{
	if(! Layers) Layers=4;//標準的な　A,B,C,D の4レイヤで初期化
	if(! Length) Length=nas.FRATE;//現状のレートで1秒を初期化
	///////////　デフォルト値がレイヤなし継続長なしだと弊害があるのでデフォルト値を変更 2009/10/12
//Xps標準のプロパティ設定
	this.errorCode	=	0;
	this.errorMsg=[
"000:最終処理にエラーはありません",
"001:データ長が0です。読み込みに失敗したかもしれません",
"002:どうもすみません。このデータは読めないみたいダ",
"003:読み取るデータがないのです。",
"004:変換すべきデータがありません。\n処理を中断します。",
"005:MAPデータがありません",
"006:ユーザキャンセル",
"007:",
"008:",
"009:想定外エラー"
];

	this.mapfile	=	"";
	this.opus	=	myOpus;
	this.title	=	myTitle;
	this.subtitle	=	mySubTitle;
	this.scene	=	myScene;
	this.cut	=	myCut;

	this.trin	=	[0,"trin"];
	this.trout	=	[0,"trout"];
	this.rate	=	(!nas)? "24FPS":nas.RATE;
	this.framerate	=	(!nas)? 24:nas.FRATE;
		var Now= new Date();
	this.create_time	=	Now.toNASString();
	this.create_user	=	myName;
	this.update_time	=	"";
	this.update_user	=	myName;
//		レイヤプロパティ設定()
	this.layers	=	new Array();

//レイヤの初期パラメータ
	var sizeX	="640";
	var sizeY	="480";
	var aspect	="1";
	var lot		="=AUTO=";
	var blmtd	="wipe";	//りまぴん専用?
	var blpos	="end";	//
	var option	="timing";	//
	var link	=".";	//リンクする親オブジェクト
			//"."区切りでIDナンバでパスを(暫定)
	for (id=0;id<Layers;id++)
	{
		this["layers"][id]=new Array();

		var name	="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(id);

		this["layers"][id]["name"]	=name	;
		this["layers"][id]["sizeX"]	=sizeX	;
		this["layers"][id]["sizeY"]	=sizeY	;
		this["layers"][id]["aspect"]	=aspect	;
		this["layers"][id]["lot"]	=lot	;
		this["layers"][id]["blmtd"]	=blmtd	;
		this["layers"][id]["blpos"]	=blpos	;
		this["layers"][id]["option"]	=option	;
		this["layers"][id]["link"]	=link	;
	}
	this.memo	=	"";

//	XPS配列の作成
	this.xpsBody= new Array();

//DIALOG および comment のデータエリアを加えて初期化
	for(L=0;L<(Layers +2);L++)
	{
		this.xpsBody[L]=new Xps_TimeLine(L,this,Length);
//		this.xpsBody[L]=new Array();
//		for(F=0;F<Length;F++){this.xpsBody[L][F]="";};
	}
	///////////

}

//XPS.のメソッドを定義
//タイムラインにアクセスする関数
Xps.prototype.timeline=function(idx){return this.xpsBody[idx];};
//再初期化
Xps.prototype.init=function(Layers,Length)
{
	if(! Layers) Layers=4;//0から標準的な　A,B,C,D の4レイヤで初期化に変更
	if(! Length) Length=Math.round(nas.FRATE);//現状のレートで1秒を初期化<Lenｇｔｈは配列の要素数でなくてはならないのでフレームレートを整数化する>
	///////////
//Xps標準のプロパティ設定
	this.mapfile	=	"";
	this.opus	=	myOpus;
	this.title	=	myTitle;
	this.subtitle	=	mySubTitle;
	this.scene	=	myScene;
	this.cut	=	myCut;

	this.trin	=	[0,"trin"];
	this.trout	=	[0,"trout"];

	this.rate	=	(!nas)? "24FPS":nas.RATE;
	this.framerate	=	(!nas)? 24:nas.FRATE;
		var Now= new Date();
	this.create_time	=	Now.toNASString();
	this.create_user	=	myName;
	this.update_time	=	"";
	this.update_user	=	myName;
//		レイヤプロパティ設定()
	this.layers	=	new Array();

//レイヤの初期パラメータ
	var sizeX	="640";
	var sizeY	="480";
	var aspect	="1";
	var lot		="=AUTO=";
	var blmtd	="wipe";	//りまぴん専用?
	var blpos	="end";	//
	var option	="timing";	//
	var link	=".";	//リンクする親オブジェクト
			//"."区切りでIDナンバでパスを(暫定)
	for (id=0;id<Layers;id++)
	{
		this["layers"][id]=new Array();

		var name	="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(id);

		this["layers"][id]["name"]	=name	;
		this["layers"][id]["sizeX"]	=sizeX	;
		this["layers"][id]["sizeY"]	=sizeY	;
		this["layers"][id]["aspect"]	=aspect	;
		this["layers"][id]["lot"]	=lot	;
		this["layers"][id]["blmtd"]	=blmtd	;
		this["layers"][id]["blpos"]	=blpos	;
		this["layers"][id]["option"]	=option	;
		this["layers"][id]["link"]	=link	;
	}
	this.memo	=	"";

//	XPS配列の作成
	this.xpsBody= new Array();
	
//DIALOG および comment のデータエリアを加えて初期化
	for(L=0;L<(Layers +2);L++)
	{
		this.xpsBody[L]=new Xps_TimeLine(L,this,Length);
//		this.xpsBody[L]=new Array();
//		for(F=0;F<Length;F++){this.xpsBody[L][F]="";};
}

}

//	マップオブジェクトを与えて初期化
Xps.prototype.getMap=function(MAP)
{
//マップ無ければ失敗
	if(! MAP) {
			this.errorCode=5;return false;
			}

//		レイヤプロパティ設定()
	this.layers.length	=(MAP.mapBody.length-2 >this.layers.length)?
	MAP.mapBody.length-2 : this.layers.length;//大きいほうを採る
//		レイヤプロパティを取得する。マップに無い情報はパスする。
//	マップが小さい場合は元に情報が残る?不足分はデフォルトで埋めるか?
	for (var id=0;id<(MAP.mapBody.length-2);id++)
	{

//レイヤのプロパティをMAPオブジェクトのプロパティから読み込む(ダミーだけど)
//	読み込んだジオメトリは、セル(グループ)のジオメトリであって、
//	個々のエントリのジオメトリではない点に注意。
		var name	=MAP.groups[id+1][0];
		var sizeX	=MAP.getgeometry(id+1,"sizeX");
		var sizeY	=MAP.getgeometry(id+1,"sizeY");
		var aspect	=MAP.getgeometry(id+1,"aspect");
		var lot		=MAP.getmaxlot(id+1);
		var blmtd	="wipe";	//りまぴん専用?
		var blpos	="end";	//
		var option	="timing";	//
		var link	=".";	//リンクする親オブジェクト
			//"."区切りでIDナンバでパスを(暫定)
		this["layers"][id]=new Array();

			this["layers"][id]["name"]	=name	;
			this["layers"][id]["sizeX"]	=sizeX	;
			this["layers"][id]["sizeY"]	=sizeY	;
			this["layers"][id]["aspect"]	=aspect	;
			this["layers"][id]["lot"]	=lot	;
			this["layers"][id]["blmtd"]	=blmtd	;
			this["layers"][id]["blpos"]	=blpos	;
			this["layers"][id]["option"]	=option	;
			this["layers"][id]["link"]	=link	;
	}
}
//
//	カット識別子を返す
/*	Xps.getIdentifier(識別オプション)
	カット識別文字列を返す
	カット識別子は　タイトル、制作番号、シーン、カット番号　の各情報をセパレータ"_"で結合した文字列
	カット番号以外の情報はデフォルトの文字列と比較して一致した場合セパレータごと省略
	オプションで全ての要素を省略なしに結合したものを返す
*/
Xps.prototype.getIdentifier=function(opt){
	if(opt){
		return [this.title ,this.opus ,this.scene ,this.cut].join("_");
	}else{
		var myDatas=[this.title ,this.opus ,this.scene];
		var myDefaults=[myTitle ,myOpus ,myScene];
		var myResult=new Array();
		for(i in myDatas){if(myDatas[i] !=myDefaults[i]){myResult.push(myDatas[i])}}
		myResult.push(this.cut);
		return myResult.join("_");
	}
}
//	継続時間を返す(ダイアログタイムラインの要素数で返す)
Xps.prototype.duration=function(){if(this.errorCode){this.errorCode=0};return this.xpsBody[0].length;};
//
//	カット尺をフレーム数で返す
Xps.prototype.time=function(){if(this.errorCode){this.errorCode=0};return (this.duration()-(this.trin[0]+this.trout[0])/2);};
//
//	フレーム数からTCを返す
Xps.prototype.getTC=function(mtd){if(this.errorCode){this.errorCode=0};return nas.Frm2FCT(mtd,3,0,this.framerate);}
//仮メソッドアトでキチンとカケ
//
//	読み込みメソッド
Xps.prototype.readIN=function(datastream)
{
	if(! datastream.toString().length ){
		this.errorCode=1;return false;
//"001:データ長が0です。読み込みに失敗したかもしれません",
	};
//ラインで分割して配列に取り込み
	var SrcData=new Array();
if(datastream.match(/\r/)){datastream=datastream.replace(/\r\n?/g,("\n"));};
	SrcData=datastream.split("\n");
	var AEK=true;//AEKey read-formatTestFlag
//データストリーム判別プロパティ
	SrcData.startLine	=0;//データ開始行
	SrcData.dataClass	="XPS";
//データ種別(XPS/AEKey/TSX/AERemap/TSheet/STS)

//ソースデータのプロパティ
	SrcData.layerHeader	=0;//レイヤヘッダ開始行
	SrcData.layerProps	=0;//レイヤプロパティエントリ数
	SrcData.layerCount	=0;//レイヤ数
	SrcData.layers= new Array();//レイヤ情報トレーラー
	SrcData.layerBodyEnd	=0;//レイヤ情報終了行
	SrcData.frameCount	=0;//読み取りフレーム数
//第一パス
//冒頭ラインが識別コードまたは空行でなかった場合は、さようなら御免ね
//IEのデータの検証もここでやっといたほうが良い?
	for (l=0;l<SrcData.length;l++)
	{
		if(SrcData[l].match(/^\s*$/))
		{
			continue;
		}else{

		if(MSIE){
	var choped=SrcData[l].charCodeAt(SrcData[l].length-1);
	if(choped<=32)
	SrcData[l] = SrcData[l].slice(0,-1);
		}
		//なぜだかナゾなぜに一文字多いのか?

/*
	どうしましょったら、どーしましょ まだ思案中 シアンは赤の補色です。
*/
if(SrcData[l].match(/^nasTIME-SHEET\ 0\.[1-4]$/))
{
	SrcData.startLine =l;//データ開始行
	break;
}else{
	if(SrcData[l].match(/^Adobe\ After\ Effects\x20([456]\.[05])\ Keyframe\ Data$/))
	{
		SrcData.dataClass ="AEKey";//データ種別
		SrcData.startLine =l;//データ開始行
		break;
	}else{
		if(SrcData[l].match(/^#TimeSheetGrid\x20SheetData$/))
		{
		SrcData.dataClass ="AERemap";//データ種別(.ard)
		SrcData.startLine =l;//データ開始行
		break;
		}else{
			if(SrcData[l].match(/^\x22([^\x09]+\x09){25}[^\x09]+$/))
			{
				SrcData.dataClass ="TSheet";//データ種別(.tsh)
				SrcData.startLine =0;//データ開始行
				break;
			}else{
				if(TSXEx)
				{
					SrcData.dataClass ="TSX";//データ種別
					SrcData.startLine =0;//データ開始行(TSXは0固定)
					break;
				}else{
	this.errorMsg[10]=SrcData[l];//message10に当該トークンを格納
	this.errorCode=2;return false;
//	"002:どうもすみません。このデータは読めないみたいダ\n"
	
				}
			}
		}
	}
}
		}
	}
//第一パスおしまい。なんにもデータが無かったらサヨナラ
	if(SrcData.startLine==0 && SrcData.length==l){
	this.errorCode=3;return false;
//	"読み取るデータがないのです。";
//		xUI.riseSW("data_");//子供オブジェクトに依存しとる ヨクナイ
	}
	if(! SrcData.dataClass){
		this.errorMsg[10]=("009:想定外エラー\n"+SrcData.dataClass + "error!");
		this.errorCode=9;return false;
	}
	
//##変数名とプロパティ名の対照テーブル//
	var varNames=[
"MAPPING_FILE",
"TITLE",
"SUB_TITLE",
"OPUS",
"SCENE",
"CUT",
"TIME",
"TRIN",
"TROUT",
"FRAME_RATE",
"CREATE_USER",
"UPDATE_USER",
"CREATE_TIME",
"UPDATE_TIME"
	];
	var propNames=[
"mapfile",
"title",
"subtitle",
"opus",
"scene",
"cut",
"time",
"trin",
"trout",
"framerate",
"create_user",
"update_user",
"create_time",
"update_time"
	];
	var props =new Array(varNames.length);
for (i=0;i<varNames.length;i++){props[varNames[i]]=propNames[i];};
if (SrcData.dataClass=="XPS"){
//	データ走査第二パス(XPS)
//		時間プロパティ欠落時のために初期値設定
//		SrcData.time="6+0";
		SrcData.trin=[0,"trin"];
		SrcData.trout=[0,"trout"];

	for(line=SrcData.startLine;line<SrcData.length;line++){
			//前置部分を読み込みつつ、本体情報の確認
		if(MSIE){
	var choped=SrcData[line].charCodeAt(SrcData[line].length-1);
	if(choped<=32)
	SrcData[line] = SrcData[line].slice(0,-1);
		}
		//なぜだかナゾなぜに一文字多いのか?
//			シートプロパティにマッチ
		if(SrcData[line].match(/^\#\#([A-Z].*)=(.*)$/))
		{
			nAme=RegExp.$1;vAlue=RegExp.$2;
//	時間関連プロパティを先行して評価。
//	読み取ったフレーム数と指定時間の長いほうでシートを初期化する。
switch (nAme)
{
case	"TRIN":			;//トランシットイン
case	"TROUT":		;//トランシットアウト
		var tm=nas.FCT2Frm(vAlue.split(",")[0]);
		if(isNaN(tm)){tm=0};
		var nm=vAlue.split(",")[1];
		if(! nm){nm=props[nAme]};
			  SrcData[props[nAme]]=[tm,nm];
			break	;
case	"TIME":			;//カット尺
		var tm=nas.FCT2Frm(vAlue);
		if(isNaN(tm)){tm=0}
			  SrcData[props[nAme]]=tm;

			break	;
default:				;//時間関連以外
			SrcData[props[nAme]]=vAlue;
//					判定した値をプロパティで控える
}
		}
//			レイヤヘッダまたは終了識別にマッチ
		if(SrcData[line].match(/^\[(([a-zA-Z]+)\t?.*)\]$/))
		{
//シート終わっていたらメモを取り込んで終了
			if(SrcData[line].match(/\[END\]/))
			{
//	シートボディ終了ライン控え
				SrcData.layerBodyEnd=line;
				SrcData["memo"]='';
				for(li=line+1;li<SrcData.length;li++)
				{
					SrcData["memo"]+=SrcData[li];
					if(li !=SrcData.length)+"\n"
				}

					break ;
			}else{
//各レイヤの情報を取得
//	レイヤヘッダの開始行を記録
				if(SrcData.layerHeader==0)
					{SrcData.layerHeader=line};
//	ロットを記録(最大の行を採る)
				var LayerCount =
				SrcData[line].split("\t").length-3;
				SrcData.layerCount=
				(SrcData.layerCount<LayerCount)?
				LayerCount	:	SrcData.layerCount;
//	エントリ数を記録
				SrcData.layerProps++;
			}
		}else{
//	シートデータ本体の行数を加算
	if(! SrcData[line].match(/^\#.*$/))
	{
		SrcData.frameCount++;	//読み取りフレーム数
	}
		}
	}
};

//	データ走査第二パス(AEKey)

if (SrcData.dataClass=="AEKey"){
//	仮にデータを取得するコンポを初期化
		thisComp= new FakeComposition();
		thisComp.maxFrame=0;//キーの最大時間を取得するプロパティを初期化
		ly_id	=0;//レイヤID初期化
		tl_id	=0;//タイムラインID初期化
		kf_id	=0;//キーフレームID初期化 いらないか?

//		第二パス開始
//	データをスキャンしてコンポ(オブジェクト)に格納
	for(line=SrcData.startLine;line<SrcData.length;line++)
	{
			// キーデータに含まれるレイヤ情報の取得
		if(MSIE){
	var choped=SrcData[line].charCodeAt(SrcData[line].length-1);
	if(choped<=32) SrcData[line] = SrcData[line].slice(0,-1);
		}
		//データ前処理・なぜだかナゾ、なぜに一文字多いのか?

//空白行のスキップ
	if(SrcData[line]=='') continue;

//一番エントリの多いデータ行を最初に処理
	if( SrcData[line].match(/^\t.*/) )
	{
//if(dbg) dbgPut("\tDATALINEs\nLayer No."+ly_id+" TimeLineID :"+tl_id+ " "+line+":"+SrcData[line]);
		var SrcLine = SrcData[line].split("\t");

		if(SrcLine[1]=="Frame") continue;//フィールドタイトル行スキップ

		if (tl_id==0){ //レイヤ内で一度もタイムラインを処理していない。
//if(dbg) dbgPut(SrcLine);

//レイヤヘッダなのでレイヤのプロパティを検証してオブジェクトに登録
switch (SrcLine[1])
{
case	"Units\ Per\ Second"	:			;//コンポフレームレート
	thisComp.frameRate	= SrcLine[2]		; break;
	//この部分をこのまま放置するとコンポのフレームレートが、最後のレイヤで決定されるので注意。

case	"Source\ Width"	:				;//レイヤソース幅
	thisLayer.width	= SrcLine[2]	; break;
case	"Source\ Height"	:			;//レイヤソース高さ
	thisLayer.height	= SrcLine[2]	; break;
case	"Source\ Pixel\ Aspect\ Ratio"	:		;//ソースの縦横比
	thisLayer.pixelAspect	= SrcLine[2]	; break;
case	"Comp\ Pixel\ Aspect\ Ratio"	:		;//コンポの縦横比
	thisComp.pixelAspect	= SrcLine[2]		; break;
default:				;//時間関連以外
	thisLayer[SrcLine[1]]	= SrcLine[2]	; break;
//	判定した値をレイヤのプロパティに控える。
}
		}else{
//タイムラインデータなのでアクティブなタイムラインに登録
//if(dbg) dbgPut("timelinedata line No."+line+":"+SrcData[line]);
	frame=SrcLine[1]*1;
		if(frame > thisComp.maxFrame) thisComp.maxFrame=frame;
		//	キーフレームの最大時間を記録
	value=SrcLine.slice(2,SrcLine.length-1);
//	value=SrcLine.slice(2);

//	タイムラインの最大値を控える 999999 は予約値なのでパス
//	実際問題ここで控えた方が良いのかこれは?
//	if (thisTimeLine.maxValue<value && value < 999999)
//	thisTimeLine.maxValue=value;

//result=thisTimeLine.push(new KeyFrame(frame,value));
//thisComp.layers[ly_id][tl_id][kf_id] = new KeyFrame(frame,value);
//kf_id ++;
//result=thisComp.layers[ly_id][tl_id].setKeyFrame(new KeyFrame(frame,value));

	thisComp.layers[ly_id][tl_id].push(new KeyFrame(frame,value));
	result=thisComp.layers[ly_id][tl_id].length;

//	if(dbg) dbgPut(">>set "+thisComp.layers[ly_id][tl_id].name+
//	" frame:"+frame+"  to value:"+value+"<<"+result+
//	"::and maxFrame is :" + thisComp.maxFrame);

//if(dbg) dbgPut(">>> "+ thisComp.layers[ly_id][tl_id][kf_id].frame +"<<<");
		}

	continue;//次の判定は、当然パスして次の行を処理
	};

//レイヤ開始判定
	if(SrcData[line].match(/^Adobe\ After\ Effects\x20([456]\.[015])\ Keyframe\ Data$/)){
//if(dbg) dbgPut("\n\nNew Layer INIT "+l+":"+SrcData[line]);
		//レイヤ作成
		thisComp.layers[ly_id]=new FakeLayer();
//		thisComp.layers[ly_id].init();
		thisLayer=thisComp.layers[ly_id];//ポインタ設定

		continue;
	}
//		タイムライン開始判定または、レイヤ終了
	if( SrcData[line].match(/^[\S]/))
	{
//　タイムライン終了処理があればここに
// レイヤ終了処理
//if(dbg)	dbgPut(line+" : "+SrcData[line]);
		if(SrcData[line].match(/^End\ of\ Keyframe\ Data$/))
		{
//			thisComp.setFrameDuration()
			ly_id ++ ;tl_id	=0;kf_id=0;
		//レイヤIDインクリメント・タイムラインID初期化
		}else{

//	最上位階層はデータブロックのセパレータなので読み取り対象を切り換え	//	タイムラインを判定して作成


//	if(! SrcData[line].match(/^\s*$/)){}

//新規タイムライン設定

	SrcLine=SrcData[line].split("\t");

switch (SrcLine[0])
{
case	"Time\ Remap":	tl_id="timeRemap";
	break;
case	"Anchor\ Point":	tl_id="anchorPoint";
	break;
case	"Position":	tl_id="position";
	break;
case	"Scale":	tl_id="scale";
	break;
case	"Rotation":	tl_id="rotation";
	break;
case	"Opacity":	tl_id="opacity";
	break;
case	"変換終了":	tl_id="wipe";//AE 4.0-5.5 wipe/トランジション
	break;
case "スライダ":	tl_id="slider";//AE 4.0-5.5 スライダ制御
	break;
case	"Effects":	//AE 6.5 (6.0? 要確認) エフェクトヘッダサブ判定が必要
	switch (SrcLine[1].slice("\ ")[0])
	{
	case "変換終了":	tl_id="wipe";break;
	case "スライダ制御":	tl_id="slider";break;
//	case "":	tl_id="";break;
//	case "":	tl_id="";break;
//	case "":	tl_id="";break;
	defaulet:	tlid=SrcLine[1];
	}
	break;
default:
	tlid=SrcLine[0];
}

//	if(! thisComp.layers[ly_id][tl_id]){thisComp.layers[ly_id][tl_id]= new TimeLine(tl_id)}else{if(dbg) dbgPut(tl_id)}

	if(! thisComp.layers[ly_id][tl_id])
	{
		thisComp.layers[ly_id][tl_id]= new Array();
		thisComp.layers[ly_id][tl_id].name=[tl_id];
		thisComp.layers[ly_id][tl_id].maxValue=0;
		thisComp.layers[ly_id][tl_id].valueAtTime=valueAtTime_;
	};//else{	if(dbg) dbgPut(tl_id + " is exist")	}
//			なければ作る＝すでにあるタイムラインならスキップ
		thisTimeLine=thisComp.layers[ly_id][tl_id];
//		if(dbg) dbgPut("set TIMELINE :"+ly_id+":"+tl_id);
		continue;
		}
	continue;
	}


	}
//		all_AEfake();
//	キーの読み込みが終わったのでキーデータを解析
//キーの最後のフレームをみて、カットの継続時間を割り出す。
	thisComp.duration=
	nas.FCT2ms(
		ssUnit(thisComp.frameRate)*
		Math.ceil(thisComp.maxFrame/ssUnit(thisComp.frameRate))
	)/1000;//最小単位はキリの良いところで設定
//
//タイムラインをチェックしてタイミング情報を抽出
//レイヤでループ
for (lyr in thisComp.layers){
/*
	コンポジションのレイヤ情報を読んで、変換のパラメータを判定する
	現在認識して読み取るタイムライン
timeRemap	タイミング情報有り
	slider	タイミング情報の可能性有り
opacity	タイミング情報の可能性有り
wipe	タイミング情報の可能性有り
**カメラワーク判定は、現在なし 常にfalse

*/
//ソースデータ用情報トレーラ
		SrcData.layers[lyr]=new Object();

//　初期化
	SrcData.layers[lyr].haveTimingData	=false;
	SrcData.layers[lyr].haveCameraWork	=false;

//メソッド・位置をデフォルトに設定
if(xUI){
	SrcData.layers[lyr].blmtd=xUI.blmtd;
	SrcData.layers[lyr].blpos=xUI.blpos;
}else{
	SrcData.layers[lyr].blmtd="wipe";
	SrcData.layers[lyr].blpos="first";
}
	SrcData.layers[lyr].lot="=AUTO=";
		//仮のブランクレイヤ
		SrcData.layers[lyr].bTimeLine=false;
		SrcData.layers[lyr].tBlank=false;
//リマップはある?
	if (thisComp.layers[lyr].timeRemap)
	{
		SrcData.layers[lyr].haveTimingData	=true;

//カラセル制御レイヤはあるか
if (thisComp.layers[lyr].opacity){
		if(ckBlank(thisComp.layers[lyr].opacity)){
	SrcData.layers[lyr].blmtd="opacity";
	SrcData.layers[lyr].blpos="end";
		//仮のブランクレイヤ
		SrcData.layers[lyr].bTimeLine=thisComp.layers[lyr].opacity;
		SrcData.layers[lyr].tBlank=0;
//alert("hasBlankOpacity");
		}
}else{
if (thisComp.layers[lyr].wipe){
		if(ckBlank(thisComp.layers[lyr].wipe)){
	SrcData.layers[lyr].blmtd="wipe";
	SrcData.layers[lyr].blpos="end";
		//仮のブランクレイヤ
		SrcData.layers[lyr].bTimeLine=thisComp.layers[lyr].wipe;
		SrcData.layers[lyr].tBlank=100;
//alert("hasBlankWipe");
		}
}
}
//キーを全数検査
	var isExpression=false	;//エクスプレッションフラグ
	var MaxValue=0	;//最大値を控える変数
	var blAP=false	;//カラセル出現フラグ
	var tmpBlank=(SrcData.layers[lyr].blmtd=="opacity")? 0 : 100 ;//仮のブランク値
for (kid=0;kid<thisComp.layers[lyr].timeRemap.length;kid++){
	if(thisComp.layers[lyr].timeRemap[kid].value[0] >= 999999){
		isExpression=true;
		blAP=true;
	};//これが最優先(最後に判定して上書き)
//最大値を取得
	if(	MaxValue< 1 * thisComp.layers[lyr].timeRemap[kid].value[0] &&
		1 * thisComp.layers[lyr].timeRemap[kid].value[0] < 999999)
	{
	MaxValue=1*thisComp.layers[lyr].timeRemap[kid].value[0];

//最大値が更新されたらキーに対応するカラセル制御をチェック
		if(SrcData.layers[lyr].bTimeLine){
//制御ラインあるか
//キーフレームの位置にブランク指定があれば、そこをブランク値に設定
if(SrcData.layers[lyr].bTimeLine.valueAtTime(thisComp.layers[lyr].timeRemap[kid].frame)==SrcData.layers[lyr].tBlank){
	blAP=true;//カラセル出現
}
		}

	}
}
	if(isExpression){
		SrcData.layers[lyr].blmtd="expression2";
		SrcData.layers[lyr].blpos="end";
	}

	SrcData.layers[lyr].maxValue=MaxValue;

//	フレームレート取り出し
var FrameDuration=(thisComp.layers[lyr].frameDuration)?
	thisComp.layers[lyr].frameDuration :
	thisComp.frameDuration();
//	セル枚数推定
switch(SrcData.layers[lyr].blpos){
case "end":
	SrcData.layers[lyr].lot=(blAP)?
		Math.floor(MaxValue/FrameDuration):
		Math.floor(MaxValue/FrameDuration)+1	;//end
	if(isExpression && blAP)	SrcData.layers[lyr].lot++;
//		SrcData.layers[lyr].hasBlank=blAP;
	break;
case "first":
	SrcData.layers[lyr].lot=
		Math.floor(MaxValue/FrameDuration);//first
	break;
case "none":
default:
//	SrcData.layers[lyr].lot="=AUTO=";//end && MaxValue==0
}
	}else{
//	スライダ制御はある?
		if (thisComp.layers[lyr].slider)
		{
/*	スライダ=エクスプレッションの可能性有り
エクスプレッションだとするとexpression1なので、
同一レイヤにタイムラインが二つ以上あってはならないものとする。
が、二つ目以降のスライダは、現在正常に読めない。混ざる

そのうち何とかする
*/
//キーを全検査する。
	var MaxValue=0;
	var isTiming=true;
for (kid=0;kid<thisComp.layers[lyr].slider.length;kid++){
//	整数か
	if(thisComp.layers[lyr].slider[kid].value[0] %1 != 0) {isTiming=false;break;}

//最大値を取得
	if(MaxValue<1*thisComp.layers[lyr].slider[kid].value[0])
	{MaxValue=thisComp.layers[lyr].slider[kid].value[0]}
}
//すべて整数値ならば一応エクスプレッションによるタイミングと認識
if (isTiming){
	SrcData.layers[lyr].haveTimingData	=true;		
	SrcData.layers[lyr].blmtd="expression1";
	SrcData.layers[lyr].blpos="first";
	SrcData.layers[lyr].lot=MaxValue;
	SrcData.layers[lyr].maxValue=MaxValue;
}
//			
		}
	}
//両方の判定を抜けたならタイミング情報がないのでこのレイヤはただの空レイヤ

/*
//	タイミングだと思われる場合はフラグ立てる。
//case	"slider":
//case	"timeRemap":	;break;
//キーを全数検査する。
//制御レイヤが付属していたらそちらを優先させる。
//制御レイヤの値とリマップの値を比較してカラセルメソッドとポジションを出す

//タイムリマップとスライダの時のみの判定
//値の最大量を控える
if(SrcData.layers[ly_id].maxValue<value) SrcData.layers[ly_id].maxValue= value;

//スライダかつ整数以外の値があるときは削除フラグを立てる
if(tl_id=="slider" && value%1 != 0) SrcData.layers[ly_id].isExpression=false;

//タイムリマップでかつ値に"999999"がある場合はメソッドをexp2に
if(tlid=="timeRemap" && value==999999) SrcData.leyers[ly_id].blmtd="exp2";

*/

}
//	解析したプロパティの転記
	if(AEK){
//		暫定処理だけど現在のカットの情報で埋めることにする?
SrcData.mapfile	="(no file)";
SrcData.title	=this.title;
SrcData.subtitle=this.subtitle;
SrcData.opus	=this.opus;
SrcData.scene	=this.scene;
SrcData.cut	=this.cut;
SrcData.create_user	=this.create_user;
SrcData.update_user	=this.update_user;
SrcData.create_time	=this.create_time;
SrcData.update_time	=this.update_time;
SrcData.framerate	=thisComp.frameRate;
SrcData.layerCount	=thisComp.layers.length;
SrcData.memo	=this.memo;
SrcData.time	=thisComp.duration*thisComp.frameRate;//読み取り
SrcData.trin	=[this.trin[0],this.trin[1]];
SrcData.trout	=[this.trout[0],this.trout[1]];
	}else{
SrcData.mapfile	="(no file)";
SrcData.title	="";
SrcData.subtitle="";
SrcData.opus	="";
SrcData.scene	="";
SrcData.cut	="";
SrcData.create_user	="";
SrcData.update_user	="";
SrcData.create_time	="";
SrcData.update_time	="";
SrcData.framerate	=thisComp.frameRate;
SrcData.layerCount	=thisComp.layers.length;
SrcData.memo	="";
SrcData.time	=thisComp.duration*thisComp.frameRate;//読み取り
SrcData.trin	=[0,"trin"];
SrcData.trout	=[0,"trout"];//キーフレームからは読まない(ユーザが後で指定)
	}
//	SrcData.frameCount	=;
//	SrcData.	="";
//	SrcData.	="";
//	SrcData.	="";	
//	SrcData.	="";


/*
	タイムリマップとスライダ制御の両方がない場合は、
	レイヤは「camerawork」(保留)
	スライダ制御があって、かつデータエントリーがすべて整数の場合は、
	exp1 それ以外はスライダ制御を破棄
	スライダ制御とタイムリマップが両方ある場合はタイムリマップ優先

	
*/

};
//データ走査第二パス(.ard)
if(SrcData.dataClass=="AERemap")
{
//データ状態設定 Param > Names
var dataStatus="";	//読み込みステータス
var LayerCount=0;	//レイヤ数え(確認用)
	for(line=SrcData.startLine;line<SrcData.length;line++){
			//前置部分を読み込みつつ、本体情報の確認
		if(MSIE){
	var choped=SrcData[line].charCodeAt(SrcData[line].length-1);
	if(choped<=32)
	SrcData[line] = SrcData[line].slice(0,-1);
		}
		//なぜだかナゾなぜに一文字多いのか?
//			シートプロパティにマッチ
//空行スキップとステータス変更
	if(SrcData[line]=="")
	{
		continue
	}else{
		var myLineData=SrcData[line].split("\t");
		switch(myLineData[0])
		{
			case "*CommentStart":;
			case "*CommentEnd":dataStatus="Skip";break;
			case "*ParamStart":dataStatus="Param";break;
			case "*MapData":;
			case "*MapNumber":;
			case "*ChildLayer":dataStatus="Skip";break;
			case "*CellName":dataStatus="Names";SrcData.layerHeader=line;break;
			case "*CellDataStart":;
			case "*Cell":;
			case "*End":;
			derfault	:dataStatus="end";break;
		}
	};
//	第二パス終了
if(dataStatus=="end") {break;}
//	読みとばしデータなのでスキップ
if(dataStatus=="Skip") {continue;}
//	データステータスがParamの処理
if(dataStatus=="Param")
{
//	var ARDValue=SrcData[line].split[1];
	switch(myLineData[0])
	{
		case "LayerCount":	SrcData.layerCount=myLineData[1]*1;
					break;
		case "FrameCount":	SrcData.time=myLineData[1]*1;
					break;
		case "CmpFps"	:	SrcData.framerate=myLineData[1];
					break;
		case "SrcWidth":	;//NOP
		case "SrcHeight":	;//NOP
		case "PageFrame":	;//NOP
		case "SrcAspect":	;//NOP
		case "EmptyCell":	;//NOP
		default	:		break;//NOP

	}
}
//レイヤカウント確認
if(dataStatus=="Names" && myLineData[0].match(/^[0-9]+$/))
{
	LayerCount++;
	if (LayerCount>SrcData.layerCount){SrcData.layerCount=LayerCount;};//レイヤ数確認
}
	};

//	プロパティの設定
SrcData.mapfile	="(no file)";
SrcData.title	=myTitle;
SrcData.subtitle=mySubTitle;
SrcData.opus	=myOpus;
SrcData.scene	="";
SrcData.cut	="";
SrcData.create_user	=myName;
SrcData.update_user	=myName;
SrcData.create_time	="";
SrcData.update_time	="";

SrcData.memo	="AERemap convert";

//SrcData.framerate	="";

SrcData.trin	=[0,"trin"];
SrcData.trout	=[0,"trout"];
//	SrcData.frameCount	=;
//	SrcData.	="";
//	SrcData.	="";
//	SrcData.	="";	
//	SrcData.	="";

};
//データ走査第二パス(.tsh)
if(SrcData.dataClass=="TSheet")
{
//レイヤカウント最大値/フレーム総数 控える
SrcData.time=SrcData.length-3;//ラベル行チェック行終了行を削除
var LayerCount=0;
	for(line=2;line<SrcData.length-2;line++)
	{
		for(col=SrcData[line].split("\t").length-1;col>=0;col--)
		{
			if(SrcData[line].split("\t")[col])
			{
			LayerCount=col+1;
				SrcData.layerCount=(LayerCount>SrcData.layerCount)?
				LayerCount : SrcData.layerCount;
				break;
			}
		}
	}
//何らかの手違いで全カラのシートを読み込んだ場合の処置
if(LayerCount<=0)
{
	SrcData.layerCount=SheetLayers;//標準値で初期化
//	return false;エラー返して中止
}
//	プロパティの設定
SrcData.mapfile	="(no file)";
SrcData.title	=myTitle;
SrcData.subtitle=mySubTitle;
SrcData.opus	=myOpus;
SrcData.scene	="";
SrcData.cut	="";
SrcData.create_user	=myName;
SrcData.update_user	=myName;
SrcData.create_time	="";
SrcData.update_time	="";

SrcData.memo	="T-Sheet convert";

SrcData.framerate	=24;//T-Sheetは24fps専用

SrcData.trin	=[0,"trin"];
SrcData.trout	=[0,"trout"];
//	SrcData.frameCount	=;
//	SrcData.	="";
//	SrcData.	="";
//	SrcData.	="";	
//	SrcData.	="";
};

//データ走査第二パス(TSX)
if(TSXEx && SrcData.dataClass=="TSX"){
	SrcData.time		=	0;//初期化
	var LayerDuration	=	0;
	SrcData.layerCount	=	0;//初期化
	var LayerCount		=	0;

	for(line=SrcData.startLine;line<SrcData.length;line++){
			//本体情報の確認
	//レイヤカウント・各レイヤの継続時間カウント
	//タイムシートの長さは最長のレイヤを使用
	//シートの継続はサポート=(直後のレイヤと連結)
	//空白行はすべてフレームカウント
	//開始行および読み込み停止行の直後の行のみ情報行として使用
	//	第二フィールドを
	//継続時間に加算されないデータ	/^[\/eE].*$/
	if(SrcData[line].match(/^[\/eE].*$/)){
		if(LayerCount!=SrcData.layerCount){
			SrcData.layers[LayerCount].duration=LayerDuration;
			LayerDuration=0;
			LayerCount++;
		}
		//記述終了・継続時間加算リセット・レイヤ加算
	}else{
//if(!SrcData[line].match(/^[\/eE].*$/)){}
		if(LayerCount==SrcData.layerCount){
			SrcData.layerCount++;
			SrcData.layers[LayerCount]= new Object();
SrcData.layers[LayerCount].blmtd	="file";
SrcData.layers[LayerCount].blpos	="first";
SrcData.layers[LayerCount].lot		="=AUTO=";
		}
		LayerDuration++;
		if(SrcData.time<LayerDuration) {SrcData.time= LayerDuration;}
	}
	//有効な動画番号データ(単独)	/^[1-9][0-9]*\s?.*$/
	//有効な動画番号データ(繰返)	/^[+rR]?\[?[1-9][\,]\]?
	//
	//
	//
	}
//	プロパティの設定
SrcData.mapfile	="(no file)";
SrcData.title	=myTitle;
SrcData.subtitle=mySubTitle;
SrcData.opus	=myOpus;
SrcData.scene	="";
SrcData.cut	="";
SrcData.create_user	=myName;
SrcData.update_user	=myName;
SrcData.create_time	="";
SrcData.update_time	="";

SrcData.memo	="TSXreadTEST";

SrcData.framerate	="";

SrcData.trin	=[0,"trin"];
SrcData.trout	=[0,"trout"];
//	SrcData.frameCount	=;
//	SrcData.	="";
//	SrcData.	="";
//	SrcData.	="";	
//	SrcData.	="";
};

//	第二パス終了・読み取った情報でXPSオブジェクトを再初期化(共通)
	SrcData.duration=
	Math.ceil(SrcData.time+(SrcData.trin[0]+SrcData.trout[0])/2);
//		トランシット時間の処理は要再考。現状は切り上げ
	var SheetDuration=(SrcData.duration>(SrcData.frameCount-1))?
	SrcData.duration : (SrcData.frameCount-1)	;//大きいほう

if(false){
/*	------ とりあえず、警告部分を削除 ----
 *** 動作フラグでデータ種別だけ判定して返すオプションを付けても良いかも
 */
//		ここから後戻り不可なので警告を出すべきかもね
if (SrcData.dataClass.match(/(XPS|AERemap|TSheet)/) ){

//	読み込み確認(XPS)
if(! confirm("タイムシートデータの読み込みを行います。\n読み込みを行うと以前の編集内容は消去されます。\nこの操作は、取り消しできません。\n\n----- よろしいですか?"))
	this.errorCode=6;return false;//ユーザキャンセル
}

if (SrcData.dataClass=="AEKey"){

//	読み込み確認(AEKey)
//ここは、後からオプションセレクタに変更すること。
	if (AEK)
	{
var msg="AEKeyデータの読み込みを行います。\nデータはカーソル位置に挿入されます。\n\n----- よろしいですか?";
	}else{
var msg="AEKeyデータの読み込みを行います。\n読み込みを行うと以前の編集内容は消去されます。\nこの操作は、取り消しできません。\n\n----- よろしいですか?";
	}

if(! confirm(msg))
{
	this.errorCode=6;return false;//ユーザキャンセル
}else{
//	SrcData.blank_offset=0;// 0 or 1
//	SrcData.key_shift=false;

}
}

if (SrcData.dataClass=="TSX"){

//	読み込み確認(TSX)
if(! confirm("TSXデータとして読み込みを行います。\n読み込みを行うと以前の編集内容は消去されます。\nこの操作は、取り消しできません。\n\n----- よろしいですか?"))
	this.errorCode=6;return false;//ユーザキャンセル
};
// ---- 確認ダイアログを暫定的にスキップ -----
}
//	///////////////////////
//	if(dbg) dbgPut("count/duration:"+SrcData.layerCount+":"+SheetDuration);
	if(SrcData.dataClass!="AEKey" || (! AEK)) this.init(SrcData.layerCount,SheetDuration);//再初期化
//	///////////////////////
if (SrcData.dataClass!="AEKey" || (! AEK)){
//	第二パスで読み取ったプロパティをXPSに転記
	for(id=0;id<propNames.length;id++)
	{
		prpName=propNames[id];
		if(SrcData[prpName] && prpName!="time")
		{
			this[prpName]=SrcData[prpName];
//					タイム以外はそのまま転記
		}
	}

//	読み取りデータを調べて得たキーメソッドとブランク位置を転記
for (lyr in SrcData.layers)
{
this.layers[lyr].blmtd	=SrcData.layers[lyr].blmtd;
this.layers[lyr].blpos	=SrcData.layers[lyr].blpos;
this.layers[lyr].lot	=SrcData.layers[lyr].lot;
}

	if(SrcData["memo"]) this["memo"]=SrcData["memo"];//memoがあれば転記
}

// ///// 各エントリのレイヤプロパティとシート本体情報を取得(第三パス)
if (SrcData.dataClass=="XPS")
{
		var frame_id=0;//読み取りフレーム初期化

	for(line=SrcData.layerHeader;line<SrcData.layerBodyEnd;line++)
	{
//角括弧で開始するデータはレイヤプロパティ
		if(SrcData[line].match(/^\[(([a-zA-Z]+)\t.*)\]$/))
		{
				var layerProps= RegExp.$1.split("\t");
				var layerPropName=RegExp.$2;
					if(layerPropName=="CELL"){layerPropName="name"};
//	これ(CELL)だけシート表記とプロパティ名が一致していないので置換 一致が少ない場合はテーブルが必要になる
				for (c=0;c<SrcData.layerCount;c++)
				{	this["layers"][c][layerPropName]=layerProps[c+2]	}
		}else{
//ほかコメント以外はすべてシートデータ
			if(!SrcData[line].match(/^\#.*$/))
			{
				myLineAry=(SrcData[line].match(/\t/))? SrcData[line].split("\t"):SrcData[line].replace(/[\;\:\,]/g,"\t").split("\t");
				for (col=1;col<=(SrcData.layerCount+2);col++)
				{
//シート本体データの取得
					this.xpsBody[col-1][frame_id]=
					(myLineAry[col]!=undefined)?
					myLineAry[col].replace(/(^\s*|\s*$)/,""):"";
				}
				frame_id++;
			}
		}
	}
}

//
if (SrcData.dataClass=="AEKey"){
//読み出したAEオブジェクトから情報を再構成する
	var preValue='';//直前の値を控えておく変数
if(AEK)	{
//	var AETransStream=new String();//リザルト文字列の初期化
	var AETransStream="";//リザルト文字列の初期化
	var AETransArray=new Array(SrcData.layerCount);//
	for(layer=0;layer<SrcData.layerCount;layer++){
		AETransArray[layer]=new Array();
	}
}

for(layer=0;layer<SrcData.layerCount;layer++){
//レイヤ数回す

	timingTL=(SrcData.layers[layer].blmtd=="expression1")? "slider":"timeRemap";//	タイミング保持タイムラインをblmtdで変更


	BlankValue	=(SrcData.layers[layer].blpos=="first")?
		0	:	(SrcData.layers[layer].lot + 1);
//	レイヤごとのブランク値を出す。999999は、パス

	for(kid=0; kid < thisComp.layers[layer][timingTL].length ;kid++)
	{
//タイミング保持タイムラインのキー数で転送
		if (preValue != thisComp.layers[layer][timingTL][kid].value[0])
		{
	frame=thisComp.layers[layer][timingTL][kid].frame;

//キーフレームの存在するコマのみ時間値からセル番号を取り出して転送

	if((xUI)&&(xUI.timeShift)){
var diffStep = (Math.abs(thisComp.layers[layer][timingTL][kid].value[0] % thisComp.frameDuration()))/thisComp.frameDuration();
timeShift=(diffStep < 0.1)? thisComp.frameDuration()*0.5 : 0;
	}else{
timeShift=0;
	};
	blank_offset =(SrcData.layers[layer].blpos=="first")? 0 : 1;

//あらかじめセル番号を計算
		cellNo=(timingTL=="timeRemap")?
Math.floor((thisComp.layers[layer][timingTL][kid].value[0]*1+timeShift)/thisComp.frameDuration())+blank_offset:
thisComp.layers[layer][timingTL][kid].value[0];
	if (SrcData.layers[layer].blpos=="first"){
		if(cellNo == BlankValue)	{cellNo="X"}
	}else{
		if(cellNo >= BlankValue)	{cellNo="X"}
	}

//	無条件ブランク
if(
	thisComp.layers[layer][timingTL][kid].value[0]==999999 ||
	thisComp.layers[layer][timingTL][kid].value[0]< 0
){cellNo="X"};
if(SrcData.layers[layer].bTimeLine){
	if(SrcData.layers[layer].bTimeLine.valueAtTime(frame)==SrcData.layers[layer].tBlank){cellNo="X"};
};
//if(dbg) dbgPut(thisComp.layers[layer][timingTL][kid].value);

		if(! AEK){
	this.xpsBody[layer+1][frame]=cellNo;
		}else{
	AETransArray[layer].push(cellNo.toString());
	if(kid < thisComp.layers[layer][timingTL].length -1)
	{
		var currentframe = thisComp.layers[layer][timingTL][kid].frame;
		var nextframe = thisComp.layers[layer][timingTL][kid+1].frame;
		for(fr=currentframe+1;fr<nextframe;fr++){
			AETransArray[layer].push("");
		}
	}
		}
	}else{
			AETransArray[layer].push("");
	};
	preValue=thisComp.layers[layer][timingTL][kid].value[0];
	};
	preValue='';//1レイヤ終わったら再度初期化
}
//================================
	if(AEK)	{
//		xUI.put(AETransStream);
//	データ配列の数を比較して最も大きなものに合わせる
		var MaxLength=0;
		for(layer=0;layer<SrcData.layerCount;layer++)
		{
	MaxLength=(MaxLength<AETransArray[layer].length)?
	AETransArray[layer].length:MaxLength;
		}
		for(layer=0;layer<SrcData.layerCount;layer++)
		{
	AETransArray[layer].length=MaxLength;
	AETransStream+=AETransArray[layer].join(",");
	if(layer<SrcData.layerCount-1)AETransStream+="\n";
		};
//	dbgPut(AETransStream);
if(xUI){
	xUI.Select=[1,0];
	xUI.put(AETransStream);
}
//		return false;
	if(this.errorCode){this.errorCode=0};return true;
	}
}
//AE-Remap
if(SrcData.dataClass=="AERemap")
{
//データ状態設定 Param > Names
var dataStatus="Skip";	//読み込みステータス
var LayerCount="";	//レイヤカウンタ
	for(line=SrcData.startLine;line<SrcData.length;line++){
//空行スキップとステータス変更
		if(SrcData[line]=="")
		{
			continue
		}else{
			var myLineData=SrcData[line].split("\t");
			switch(myLineData[0])
			{
			case "*CommentStart":;
			case "*CommentEnd":dataStatus="Skip";break;
			case "*ParamStart":dataStatus="Param";break;
			case "*MapData":;
			case "*MapNumber":;
			case "*ChildLayer":dataStatus="Skip";break;
			case "*CellName":dataStatus="Names";break;
			case "*CellDataStart":dataStatus="SheetBody";break;
			case "*Cell":LayerCount=(1*myLineData[1]);break;
			case "*End":;
			derfault	:dataStatus="end";break;
			}
		};
//	第三パス終了
if(dataStatus=="end") {break;}
//	データステータスがParamの処理
if(dataStatus=="Param" || dataStatus=="Skip") continue;//skip
//	シートボディ取り込み
if(dataStatus=="SheetBody" && myLineData[0].match(/^[0-9]+$/)){
	this.xpsBody[LayerCount+1][(myLineData[0]*1)-1]=(myLineData[1]==0)?
	"X":myLineData[1].toString();
	continue;
}
//レイヤラベル取得
if(dataStatus=="Names" && myLineData[0].match(/^[0-9]+$/)){
	this["layers"][myLineData[0]]["name"]=myLineData[1];
}
	};
};
//T-Sheet
if (SrcData.dataClass=="TSheet")
{
	var frame_id=0;//読み取りフレーム初期化

//第一レコードからレイヤ名取得
	var LayerLabels=SrcData[0].split("\t").slice(0,SrcData.layerCount);
	LayerLabels[0]=LayerLabels[0].replace(/^\x22/,"");

	for (c=0;c<SrcData.layerCount;c++)
	{	this["layers"][c]["name"]=LayerLabels[c];	};
//シートデータ読み取り
	for(line=2;line<SrcData.length-1;line++)
	{

//すべてシートデータ
myLineAry=(SrcData[line].match(/\t/))? SrcData[line].split("\t"):SrcData[line].replace(/[\;\:\,]/g,"\t").split("\t");

		for (col=0;col<=SrcData.layerCount;col++){
//シート本体データの取得(ダイアログフィールドはないのでトばして拾う)
			this.xpsBody[col+1][frame_id]=(myLineAry[col]!=undefined)?
				myLineAry[col].replace(/(^0$)/,"X"):"";
		}
		frame_id++;
	}
};
//TSX
if(TSXEx && SrcData.dataClass=="TSX"){
//カウンタ初期化
	SrcData.time		=	0;//初期化
	var LayerTime		=	0;
	SrcData.layerCount	=	0;//初期化
	LayerCount		=	0;
	var RepeatBuf=new Array();
	var repIdx=0;
//	var readCountLine	=	0;
//	var readCountLayer	=	0;
//本体データ読み取り
	for(line=SrcData.startLine;line<SrcData.length;line++){

	if(SrcData[line].match(/^[\/eE].*$/)){
		if(LayerCount!=SrcData.layerCount){
			LayerTime=0;
			LayerCount++;
		}
		//記述終了・継続時間加算リセット・レイヤ加算
	}else{
		if(LayerCount==SrcData.layerCount){
			if(RepeatBuf.length){RepeatBuf.length=0;repIdx=0;}
			SrcData.layerCount++;
		}
		body_data=SrcData[line].replace(/^([^\#]*)(\-\-|\#).*$/,"$1");
if(body_data.match(/^[1-9][0-9]*$/)){
	if(RepeatBuf.length){RepeatBuf.length=0;repIdx=0;}
	this.xpsBody[LayerCount+1][LayerTime]=body_data;
}else{
	if(body_data==""){
		if(RepeatBuf.length){
			this.xpsBody[LayerCount+1][LayerTime]=RepeatBuf[repIdx%RepeatBuf.length];repIdx++;
		}else{
			this.xpsBody[LayerCount+1][LayerTime]=body_data;
		}
	}else{
		RepeatBuf=TSX_expdList(body_data);repIdx=0;
		this.xpsBody[LayerCount+1][LayerTime]=RepeatBuf[repIdx];repIdx++;
	}

}
		LayerTime++;
		if(SrcData.time<LayerDuration) {SrcData.time= LayerDuration;}
	}

	}
}
// ///// 読み取ったデータを検査する(データ検査は別のメソッドにしろ!??)
/*
//	マップファイルは、現在サポート無し
//		サポート開始時期未定
//この情報は、他の情報以前に判定して、マップオブジェクトの生成が必要。
//マップ未設定状態では、代用マップを作成して使用。
//代用マップは、デフォルトで存在。
<<
	現在は、代用MAPオブジェクトを先行して作成してあるが、
	本来のマップが確定するのはこのタイミングなので、注意!
>>
*/
if(false){
//MAPPING_FILE=(no file)//値は未設定時の予約値?nullで初期化すべきか?
			if(! this.mapfile) this.mapfile='(no file)';

//マップファイルが未設定ならば、代用マップを使用
//この判定はあまりに雑なので後でなんとかすれ
if(false){
	if(this.mapfile=='(no file)')
	{
		MapObj=MAP;	//とりあえず既存のダミーマップを代入しておく。
	}
}
//マップファイルを読み込んでマップオブジェクトを初期化
	//	そのうちね、今はまだない
//日付関連

//制作日付と制作者が無い場合は、空白で初期化?無視したほうが良いかも
//CREATE_USER=''
//CREATE_TIME=''
			if(! this.create_time) this.create_time='';
			if(! this.create_user) this.create_user='';
//最終更新日付と最終更新者が無い場合は、空白で初期化?
//(これは、どのみち保存時に現在のデータで上書き)
//UPDATE_USER=''
//UPDATE_TIME=''
			if(! this.update_time) this.update_time='';
			if(! this.update_user) this.update_user='';
//
//FRAME_RATE=24//
//フレームレート読み取れてなければ、現在の値で初期化(組み込み注意)
			if(! this.framerate)
			{	this.framerate=nas.FRATE;
			}else{
				nas.FRATE=this.framerate;
			}
//トランシット展開しておく
//TRIN=(時間文字列),(トランシット種別)

if(! this.trin){
	this.trin=[0,"trin"]
}else{
	time=nas.FCT2Frm(this.trin[0]);
	if(isNaN(time)){time=0};
	name=(this.trin[1])?this.trin[1]:"trin";
	this.trin=[time,name];
}
//TROUT=(時間文字列),(トランシット種別)
if(! this.trout){
	this.trout=[0,"trout"];
}else{
	time=nas.FCT2Frm(this.trout[0]);
	if(isNaN(time)){time=0};
	name=(this.trout[1])?this.trout[1]:"trout";
	this.trout=[time,name];
}
//TIMEも一応取り込んでおく。
//実際のデータの継続時間とこの情報の「長いほう」を採る
//TIME=(時間文字列)
//			this.time=nas.FCT2Frm(this.time);
//			if(isNaN(this.time)){this.time=0}

//作品データ
//情報が無い場合は、空白で初期化。マップをみるようになったら。
//マップの情報を参照
//最終作業情報(クッキー)を参照
//ユーザ設定によるデフォルトを参照 などから選択


//TITLE=(未設定とかのほうが良いかも)
			if(! this.title) this.title='';
//SUB_TITLE=(未設定とかのほうが良いかも)
			if(! this.subtitle) this.subtitle='';
//OPUS=()
			if(! this.opus) this.opus='';
//SCENE=()
			if(! this.scene) this.scene='';
//CUT=()
			if(! this.cut) this.cut='';

//シーン?・カット番号は最終状態でもデフォルトは空白に。紛らわしいから。

}
if(this.errorCode){alert("error :"+this.errorCode);this.errorCode=0};return true;
};

//
/*
 *	書きだしメソッド
 *
 */
Xps.prototype.toString= function(Separator)
{
	var Now=new Date();
//セパレータ文字列調整
	var	bold_sep='\n#';
		for(n=this.layers.length+2;n>0;n--) bold_sep+='========';
	var	thin_sep='\n#';
		for(n=this.layers.length+2;n>0;n--) thin_sep+='--------';
//	ヘッダで初期化
	var result='nasTIME-SHEET 0.4';//出力変数初期化
//	##共通プロパティ変数設定
	result+='\n##MAPPING_FILE='	+ this.mapfile	;
	result+='\n##TITLE='	+ this.title	;
	result+='\n##SUB_TITLE='	+ this.subtitle	;
	result+='\n##OPUS='	+ this.opus	;
	result+='\n##SCENE='	+ this.scene	;
	result+='\n##CUT='	+ this.cut	;
	result+='\n##TIME='	+ nas.Frm2FCT(this.time(),3,0)	;
	result+='\n##TRIN='	+nas.Frm2FCT(this.trin[0],3,0)+","+ this.trin[1];
	result+='\n##TROUT='	+nas.Frm2FCT(this.trout[0],3,0)+","+ this.trout[1];
	result+='\n##CREATE_USER='	+ this.create_user	;
	result+='\n##UPDATE_USER='	+ this.update_user	;
	result+='\n##CREATE_TIME='	+ this.create_time	;
	result+='\n##UPDATE_TIME='	+ Now.toNASString()	;
	result+='\n##FRAME_RATE='	+ this.framerate	;
//result+='\n##FOCUS='	+11//
//result+='\n##SPIN='	+S3//
//result+='\n##BLANK_SWITCH='	+File//
	result+='\n#';
	result+=bold_sep;//セパレータ####################################
//	レイヤ別プロパティをストリームに追加
	var Lprops=["sizeX","sizeY","aspect","lot","blmtd","blpos","option","link","name"];
//	var Lprops=["sizeX","sizeY","aspect","lot","blmtd","blpos","option","link","CELL"];
	for (prop in Lprops)
	{
		var propName=Lprops[prop];
		var lineHeader=(propName=="name")? 
		'\n[CELL\tN' : '\n[' + propName + '\t';
		result+=lineHeader;
	for (id=0;id<this.layers.length;id++)
	{
		result+="\t"+this["layers"][id][propName];
	}
	result+='\t]';//
		}
//セパレータ
	result+=bold_sep;//セパレータ####################################
//シートボディ
	for(line=0;line<this.duration();line++)
	{
		result+='\n.';//改行＋ラインヘッダ
		for(column=0;column<(this.layers.length+2);column++)
		{
			address=column+'_'+line;
			if(! Separator)
			{
				result+='\t'+this.xpsBody[column][line];
			}else{
				result+=Separator+spcFill(this.xpsBody[column][line],17);
			}
		}
//	1/4秒おきにサブセパレータ/秒セパレータを出力
		if ((line+1)%Math.round(this.framerate/4)==0)
		{
			if((line+1)%Math.round(this.framerate)==0)
			{
				result+=bold_sep;
			}else{
				result+=thin_sep;
			}
		}
	}
//ボディ終了セパレータ
	result+=bold_sep;//セパレータ####################################
//ENDマーク
	result+='\n[END]\n';
//メモ
	result+=this.memo;

// // // // //返す(とりあえず)
//引数を認識していくつかの形式で返すように拡張予定
//セパレータを空白に変換したものは必要
//変更前(開始時点)のバックアップを返すモード必要/ゼロスクラッチの場合は、カラシートを返す。
	if(this.errorCode){this.errorCode=0};return result;
}

/*	Xps.isSame(targetXps)
引数	比較するXpsオブジェクト
	シート内容比較メソッド 相互の値が同じか否か比較する関数
	ユーザ名・時間等は比較しないでシート内容のみ比較する
	コメント類は連続する空白をひとつにまとめて比較する
*/
Xps.prototype.isSame=function(targetXps)
{
	var rejectRegEx=new RegExp("errorCode|errorMsg|mapfile|create_time|create_user|update_time|update_user|layers|xpsBody|memo");
//プロパティリスト
// errorCode,errorMsg,mapfile,opus,title,subtitle,scene,cut,trin,trout,framerate,create_time,create_user,update_time,update_user,layers,memo,xpsBody,mkStage,getInfo,guessLink,init,getMap,duration,time,getTC,readIN,toString,mkAEKey

	for(var myProp in this)
	{
		if((myProp.match(rejectRegEx))||(this[myProp] instanceof Function)){continue};//ここでは比較しないものをリジェクト
		if((this[myProp] instanceof Array)){continue};//配列プロパティをスキップしているので注意　後で配列比較を書く
		if((this[myProp]==targetXps[myProp])){continue};//プロパティがあれば比較してマッチしていればスキップ(targetXps[myProp])&&
//		return [this[myProp],targetXps[myProp]].join(" != ");//抜けたデータがあればNG判定で終了
		return false;//
	}
//opus,title,subtitle,scene,cut,trin,trout,framerate,
//nas.otome.writeConsole(this.layers.length);

	if(this.layers.length!=targetXps.layers.length){return false}

//	layersのサブプロパティ比較
	for (var lIdx=0;lIdx<this.layers.length;lIdx++){
		//
		for (var myProp in this.layers[lIdx])
		{
			if((this.layers[lIdx][myProp]==targetXps.layers[lIdx][myProp])){continue};//(targetXps.layers[lIdx][myProp])&&
			return false;
		}
	}

//メモ比較
	if(this.memo.replace(/\s+/g," ").replace(/\n/g,"")!=targetXps.memo.replace(/\s+/g," ").replace(/\n/g,"")){return false};

//ボディ比較
	if(this.xpsBody.length!=this.xpsBody.length){return false};
	if(this.xpsBody[0].length!=this.xpsBody[0].length){return false};

	for(var L=0;L<this.xpsBody.length;L++)
	{
		for(var F=0;F<this.xpsBody[0].length;F++)
		{
			if(this.xpsBody[L][F]==targetXps.xpsBody[L][F]){continue};
			return false;
		}
	}
//比較順序は後で見直しが必要　多分
	return true;
}
///////

//キーフレーム変換メソッド
//これはAEだと不要か？
Xps.prototype.mkAEKey=function(layer_id){
//将来、データツリー構造が拡張された場合、機能開始時点でツリーの仮構築必須
//現在は、決め打ち
//内部処理に必要な環境を作成
//var	layerDataArray	=this.xpsBody[layer_id+1];
//		layerDataArray.label=this.layers[layer_id].name;

var	bufDataArray=this.timeline(layer_id+1).parseTm();

var	blank_method	=this.layers[layer_id].blmtd;
var	blank_pos	=this.layers[layer_id].blpos;
var	key_method	=(xUI)? xUI.keyMethod:"opt";
var	key_max_lot	=(isNaN(this.layers[layer_id].lot))?
			0 : this.layers[layer_id].lot;

var	bflag=(blank_pos=="none")? false : true ;//ブランク処理フラグ
//
//
var	AE_version	=(xUI)? xUI.aeVersion:app.version.split(".").slice(0,2).join(".");
var	compFramerate	=this.framerate;
var	footageFramerate=(xUI)?xUI.fpsF:nas.FRATE;
	if(isNaN(footageFramerate)){footageFramerate=compFramerate}
var	sizeX	=this.layers[layer_id].sizeX;
var	sizeY	=this.layers[layer_id].sizeY;
var	aspect	=this.layers[layer_id].aspect;
//alert("カラセル方式は :"+blank_method+"\n フーテージのフレームレートは :"+footageFramerate);

	var layer_max_lot=0;//レイヤロット変数の初期化

//キースタック配列を宣言
	var keyStackArray=new Array;//キースタックは可変長
	keyStackArray["remap"]= new Array();
	keyStackArray["blank"]= new Array();
		//ふたつ リマップキー/ブランクキー 用

//事前処理 AEVersionが6.5以降でキータイプがexpression3ならばを強制変更 未処理

if(false){
//前処理 シート配列からキー変換前にフルフレーム有効データの配列を作る
//全フレーム分のバッファ配列を作る
	var bufDataArray=new Array(layerDataArray.length);
//第一フレーム評価・エントリが無効な場合空フレームを設定
	bufDataArray[0]= (dataCheck(layerDataArray[0],layerDataArray.label,bflag))?
	dataCheck(layerDataArray[0],layerDataArray.label,bflag):"blank";

//2--ラストフレームループ
	for (f=1;f<layerDataArray.length;f++){
//有効データを判定して無効データエントリを直前のコピーで埋める
	bufDataArray[f]=(dataCheck(layerDataArray[f],layerDataArray.label,bflag))?
	dataCheck(layerDataArray[f],layerDataArray.label,bflag):bufDataArray[f-1];

		if (bufDataArray[f]!="blank")
		{
			layer_max_lot=(layer_max_lot>bufDataArray[f]) ?
			layer_max_lot : bufDataArray[f] ;
		}
	}
}else{
	layer_max_lot=parseInt(bufDataArray.sort(function(a,b){return parseInt(b)-parseInt(a)})[0])
}
	max_lot = (layer_max_lot>key_max_lot)?
	layer_max_lot:key_max_lot;

//あらかじめ与えられた最大ロット変数と有効データ中の最大の値を比較して
//大きいほうをとる
//ここで、layer_max_lot が 0 であった場合変換すべきデータが無いので処理中断

	if(layer_max_lot==0){
	this.errorCode=4;return	;
// "変換すべきデータがありません。\n処理を中断します。";
	}

//前処理第二 (配列には、キーを作成するフレームを積む)

	keyStackArray["remap"].push(0);
	keyStackArray["blank"].push(0);//最初のフレームには無条件でキーを作成

//有効データで埋まった配列を再評価(2?ラスト)
	for (f=1;f<bufDataArray.length;f++){
//キーオプションにしたがって以下の評価でキー配列にスタック(フレームのみ)
switch (key_method){
case	"opt"	:	//	最適化キー(変化点の前後にキー)
			//	○前データと同じで、かつ後ろのデータと
			//	同一のエントリをスキップ
	if (bufDataArray[f]!=bufDataArray[f-1] || bufDataArray[f]!=bufDataArray[f+1])
	{keyStackArray["remap"].push(f)}
	break;
case	"min"	:	//	最少キー(変化点の前後にキー)
			//	○前データと同じエントリをスキップ
	if (bufDataArray[f]!=bufDataArray[f-1])
	{keyStackArray["remap"].push(f)}
	break;
case	"max"	:	//	全フレームキー(スキップ無し)
default:
	keyStackArray["remap"].push(f);
}	
//ブランクメソッドにしたがってブランクキーをスタック(フレームのみ)
	var prevalue	=(bufDataArray[f-1]	=="blank")?	"blank":"cell";
	var currentvalue=(bufDataArray[f]	=="blank")?	"blank":"cell";
	var postvalue	=(bufDataArray[f+1]	=="blank")?	"blank":"cell";
switch (key_method){
case	"opt"	:	//	最適化キー(変化点の前後にキー)
	if (currentvalue!=prevalue || currentvalue!=postvalue)
	{keyStackArray["blank"].push(f)}
	break;
case	"min"	:	//	最少キー(変化点の前後にキー)
	if (currentvalue!=prevalue)
	{keyStackArray["blank"].push(f)}
	break;
case	"max"	:	//	全フレームキー(スキップ無し)
default:
	keyStackArray["blank"].push(f);
}	
	}

//キー文字列を作成
//blankoffsetは、カラセル挿入によるタイミングの遷移量・冒頭挿入以外は基本的に0
switch (blank_pos){
case	"first"	:var blankoffset=1;break;
case	"end"	:var blankoffset=0;break;
case	"none"	:var blankoffset=0;break;
default	:var blankoffset=0;
}
var footage_frame_duration=(1/footageFramerate);
//	リマップキーを作成
	var remapBody=
'Time Remap\n\tFrame\tseconds\t\n';
	for (n=0;n<keyStackArray["remap"].length;n++)
	{
	if(bufDataArray[keyStackArray["remap"][n]]=="blank")
	{	var seedValue=(blank_pos=="first")? 1 : max_lot+1 ;
	}else{	var seedValue=bufDataArray[keyStackArray["remap"][n]]*1 + blankoffset;
	}
	remapBody+="\t";
	remapBody+=keyStackArray["remap"][n].toString(10);
	remapBody+="\t";
if(	blank_method=="expression2" && 
	bufDataArray[keyStackArray["remap"][n]]=="blank"){
	remapBody+=999999;//エクスプレッション2のカラ
}else{
	remapBody+=(seedValue-0.5)*footage_frame_duration;//通常処理
}
	remapBody+="\t\n";
	}

//	エクスプレッション型
	var expBody=(AE_version<6.0)?
'スライダ\tスライダ制御\tEffect\ Parameter\ #1\t\n\tFrame\t\t\n':
'Effects\tスライダ制御\tスライダ\n\tFrame\t\t\n';

	for (n=0;n<keyStackArray["remap"].length;n++)
	{
	expBody+="\t";
	expBody+=keyStackArray["remap"][n].toString(10);
	expBody+="\t";
	if (bufDataArray[keyStackArray["remap"][n]]=="blank")
	{	expBody+=("0");

	}else{	expBody+=(bufDataArray[keyStackArray["remap"][n]]);
	}
	expBody+="\t\n";
	}

//	ブランクキーを作成
//	エクスプレッション型/ブランクセル無し の場合は不要
switch(blank_method){
case "opacity":
//不透明度
	var blankBody=
'Opacity\n\tFrame\tpercent\t\n';
	var blank_='0';
	var cell_='100';
	break;
case "wipe":
//ワイプ
	var blankBody=(AE_version<6.0)?
'変換終了\tリニアワイプ\tEffect\ Parameter\ \#1\t\n\tFrame\tパーセント\t\n':
'Effects\tリニアワイプ\t変換終了\n\tFrame\tpercent\t\n';
	var blank_='100';
	var cell_='0';
	break;
}
//
	for (n=0;n<keyStackArray["blank"].length;n++)
	{

	blankBody+="\t";
	blankBody+=keyStackArray["blank"][n].toString(10);
	blankBody+="\t";
		if(bufDataArray[keyStackArray["blank"][n]]=="blank")
		{blankBody+=blank_}else{blankBody+=cell_};
	blankBody+="\t\n";
	}

//AE6.5以降のエクスプレッションペースト可能な際のエクスプレッション

if(AE_version>=6.5){
//前方キー参照
	var keepPreviewKeyValue='Expression Data\n';
	keepPreviewKeyValue+='if(numKeys){if(nearestKey(time).time<=time){ix=nearestKey(time).index;}else{';
	keepPreviewKeyValue+='ix=(nearestKey(time).index==1)?1:nearestKey(time).index-1;};key(ix).value;}else{this.value}';
	keepPreviewKeyValue+='\n';
	keepPreviewKeyValue+='End of Expression Data\n';
//TimeRemap処理 No.1-T(スライダ参照)
	var trExpression='Time Remap\n';
	trExpression+='\tFrame\tseconds\t\n';
	trExpression+='\t0\t0\t\n\n';
	trExpression+='Expression Data\n';
	trExpression+='(effect("スライダ制御")("スライダ")-1)*thisComp.frameDuration;\n';
	trExpression+='End of Expression Data\n';
//blank処理 No.1-B(スライダ参照)
	var blankExpression1='Effects\tチャンネルシフト #2\tアルファを取り込む #2\n';
	blankExpression1+='\tFrame\t\t\n';
	blankExpression1+='\t\t0\t\n\n';
	blankExpression1+='Expression Data\n';
	blankExpression1+='if(effect("スライダ制御")("スライダ").value){1}else{10};\n';
	blankExpression1+='End of Expression Data\n';

//blank処理 No.2(タイムリマップ直接参照)
	var blankExpression2='Effects\tチャンネルシフト #1\tアルファを取り込む #2\n';
	blankExpression2+='\tFrame\t\t\n';
	blankExpression2+='\t\t0\t\n\n';
	blankExpression2+='Expression Data\n';
	blankExpression2+='if(timeRemap.value>=999999){10}else{1};\n';
	blankExpression2+='End of Expression Data\n';

}

//出力
var Result= 'Adobe After Effects ';
Result += AE_version;
Result += ' Keyframe Data\n';
//Result += ;
Result += '\n\tUnits Per Second\t';
Result += compFramerate.toString();
Result += '\n\tSource Width\t';
Result += sizeX.toString();
Result += '\n\tSource Height\t';
Result += sizeY.toString();
Result += '\n\tSource Pixel Aspect Ratio\t1';
Result += '\n\tComp Pixel Aspect Ratio\t1';
Result += '\n';
if (blank_method !="expression1")
{

	if (blank_method =="opacity")
	{
//		ブランク
		Result += '\n';
		Result += blankBody;
	}
//
//	リマップ
	Result += '\n';
	Result += remapBody;
//AE 6.5以上ならキー保持エクスプレッション貼り付け
	if (AE_version >=6.5){Result +=keepPreviewKeyValue+"\n";}

	if (blank_method =="wipe")
	{
//		ブランク
		Result += '\n';
		Result += blankBody;
	}
//AE 6.5以上でメソッドがexpression2ならばブランク処理を貼り付け
if((blank_method=="expression2")&&(AE_version >=6.5)){Result +=blankExpression2+"\n";}
//
} else {
//エクスプレッション1
	Result += '\n';
//AE 6.5以上ならタイムリマップのエクスプレッションを貼り付け
	if (AE_version >=6.5){Result +=trExpression+"\n";}
//スライダボディ
	Result +=expBody+"\n";
//AE 6.5以上ならキープエクスプレッション貼り付け
	if (AE_version >=6.5){Result +=keepPreviewKeyValue+"\n";}
//AE 6.5以上ならカラセルエクスプレッション貼り付け
	if (AE_version >=6.5){Result +=blankExpression1+"\n";}
}

Result += '\n';
Result += 'End of Keyframe Data';

if(this.errorCode){this.errorCode=0};return Result;
}

// Xpsオブジェクト定義終了


//MacOSでシートテキストを読みやすくする為の空白の追加 このせいでデータ量がやたら増える
function spcFill(string,Span)
{
	var charSpan=0;

	for(n=0;n<string.length;n++){
//エントリーの占有幅仮算定、すごく雑、さらにフォント確認していないのでもっと雑
//無いよりマシ程度だね
if(nas.isAdobe){
	if (isWindows){
if(string.charCodeAt(n)<127){charSpan+=1;}else{charSpan+=2;}
	}else{
if(string.charCodeAt(n)<127){charSpan+=2;}else{charSpan+=3;}
	}
}else{
	charSpan+=1;
}
	};
	if(charSpan>Span){charSpan=Span};
	preSpc="";postSpc="";
for (p=0;p<Math.floor((Span-charSpan)/2);p++){preSpc+="\x20"}
for (p=0;p<Span-Math.floor((Span-charSpan)/2)-charSpan;p++){postSpc+="\x20"}
	return preSpc+string+postSpc;
}

//MAPping配列の初期化()	//りまぴん用仮オブジェクト
//
//var MAP= new_MAP(SheetLayers);
//var MAP= new Array(SheetLayers+2);//0番・レイヤ最大番号+1 はシステム予約
/*
マップを初期化する手順
	コンストラクタでMapオブジェクトを初期化
	new Map([セルグループ数])
			戻り値は空のマップオブジェクト

	引数は、セルのグループ数。省略可能。省略時は、グループ数1で初期化?
	(0でも良さそう)

	実際のデータの初期化は、マップオブジェクト自身の初期化メソッドを
	コールして行う。
	初期化は、実装により異なるかもしれない。それで良いのだ。

マップは基本的には、マップエントリグループとその配下のマップエントリを格納するトレーラです。

エントリグループ毎に実際のセル・撮影指定等がエントリされます。
エントリグループは、セルグループに加えてシステムが管理する3種類のグループがあります。
	グループ[ID.system]は、
システムによって生成された(ユーザが管理しない)画像が属するグループ
(カラセル等・今回の実装では配列の添字は0)
	グループ[ID.camerawork]は、
撮影情報に対して名前をつけて管理する(実体のファイルが存在しない)エントリが
属するグループ。
	グループ[ID.dialog]は、音響効果指定
	グループ[ID.effect]は、合成効果指定

それぞれのエントリグループは任意の数を設定できるが、デフォルトで以下のグループが作成されます。
	camerawork	/0
	cell	/1(初期化時点で設定可能)
	dialog	/1
	effect	/0
	system	/1

したがってマップ配列の要素数は、作成時点でセルグループ数+2 となる。

AEの場合のMAPに望まれる機能
名前で指定されたXPSのエントリーを適切なタイムリマップ値に変換すること
XPS側からは タイムラインラベルおよびエントリ文字列を与える
MAPサイドでは、
	ラベルからエントリグループ(コンポジション)を特定
	エントリ文字列からグループ内のエントリ(タイムリマップ値)を特定して戻す

コンポ内でブランク対応している場合(ファイルモード)は、ブランクに相当するタイムリマップ値を返す
それ以外の場合は、特定のキーワード"blank"を返す。
エントリに該当しない場合は、nullを返す。
	this.trailer=targetFolder;//ターゲットフォルダアイテムを指定して初期化


Map.getElementByName("ラベル","エントリ")	戻り値：Number(整数)or "blank" or null

*/

function Map(cellCount)
{
	if(! cellCount) cellCount=1;//引数無ければ 1
	cellCount=cellCount*1;//数値にしておく
////////////////////// 基本要素設定
	this.mapBody = new Array(cellCount+2);//システム配列要素を2つ追加する。ダイアログとシステム

//	プロパティを空で設定
	this.opus	=	myOpus;//
	this.title	=	myTitle;//
	this.subtitle	=	mySubTitle;//
	this.scene	=	myScene;//
	this.cut	=	myCut;//
		var Now =new Date();
	this.create_time	=	Now.toNASString();//
	this.create_user	=	myName;//
	this.update_time	=	"";//
	this.update_user	=	myName;//
	this.standerd_frame	=	[22.5,4/3.144/2.54];//width(cm),aspect(w/h),Resolution(dpc)//Frameに置き換え予定
	this.standerd_peg	=	["3P",0,19.875,0];//type,x,y,0];//pegType,posX,posY,rotation//Pegに置き換え予定
	this.resolution	=	nas.RESOLUTION;//(dpc)

// グループ情報の設定
/*
	グループの持つジオメトリ情報は、各エントリのジオメトリと独立している。
	これは、グループ内のセルの持つ情報の省略値ではなく、グループ全体の持つ
	トリミング情報となる。要するにタップとフレームだ。
*/
	this.groups=new Array(cellCount+2);
//			初期値
		var name	="";
		var geometry	= "640,480,72/2.54,1,0,300,0";
				//デフォルト値としては妥当な気がする?
				//"X,Y,dpc,par,offsetX,offsetY,rotation"
		var comment	="";//未設定

	this.groups["0"]=["system",geometry,comment];//0番要素はシステム固定
//		ループしてデフォルト値を設定
	for (id=1;id<(cellCount+1);id++){
		name	="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(id-1);
		//geometry	="640,480,72,1,0,300,0";
		//comment	="";
	this.groups[id]	=[name,geometry,comment];
	}

	this.groups[cellCount+1]=["camera",geometry,comment];//最終要素はシステム予約(1番でも良いかもその方が計算が減る?)
// エントリ情報の設定
	for (id=0;id<SheetLayers+2;id++){
		this.mapBody[id]	="=AUTO=";
	}
};
//各メソッド
Map.prototype.init=function(){return "ここで初期化するぞー!(してないけど)";}
//
//

Map.prototype.getgeometry=function(id,prop)
{
	if(! id) id=0;
	if(! prop) prop="all";
	switch (prop)
	{
case "sizeX":
	return	(( this["groups"][id][1].split(",")[0]/72 )*
		this["groups"][id][1].split(",")[2] );
	break;
case "sizeY":
	return	(( this["groups"][id][1].split(",")[1]/72 )*
		(this["groups"][id][1].split(",")[2]/this["groups"][id][1].split(",")[3]));
	break;
case "resX":	return this["groups"][id][1].split(",")[2];break;
case "aspect":	return this["groups"][id][1].split(",")[3];break;
case "resY"	:	return (this["groups"][id][1].split(",")[2]/this[id][1].split(",")[3]);break;
case "offsetX"	:	return this["groups"][id][1].split(",")[4];break;
case "offsetY"	:	return this["groups"][id][1].split(",")[5];break;
case "rotation"	:	return this["groups"][id][1].split(",")[6];break;
default	:return this["groups"][id][1].split(",");
	}
}
//
//
Map.prototype.getmaxlot =function(id)
{
	if (this.mapBody[id]=="=AUTO=")
	{	return "=AUTO="
	} else {
		return this.mapBody[id].length;
	};
}
//Mapコンストラクタ終了

//
function initMAP()
{
//マップオブジェクトの初期化は、
//MAPファイルを指定されればインポートおよび環境形成（未実装）
//それ以外は導入済みデータを使用してエージェントの初期化を行う
//AE以外の環境はあとまわし
//		MAP各プロパティ
/*
	var cellCount=app.project.items.getByName(nas.otome.mapFolders.mapBase).items.getByName(nas.otome.mapFolders.cell).length;//グループアイテムフォルダのエントリ数をみる
////////////////////// 基本要素設定
	this.mapBody = new Array(cellCount+2);//システム配列要素を2つ追加する。ダイアログとシステム

//	プロパティを空で設定
	this.opus	=	myOpus;//
	this.title	=	myTitle;//
	this.subtitle	=	mySubTitle;//
	this.scene	=	myScene;//
	this.cut	=	myCut;//
		var Now =new Date();
	this.create_time	=	Now.toNASString();//
	this.create_user	=	myName;//
	this.update_time	=	"";//
	this.update_user	=	myName;//
*/

return "代用マップデータの初期化をしました";
}
/* Map用各種メソッド
 *		
 *
 *
 *
 */

	///////////
// var MAP= new_MAP(SheetLayers);

//if (dbg) {alert(initMAP())};	//マップダミー初期化
	///////////

//まだ腐っているけどmap関連一応分離 2005.03.22

/*
	NAS(U) りまぴん専用データチェック関数
		マップ処理ができるようになったら汎用関数に
	マップオブジェクトのメソッドに切り換え予定
	2005/12/19 mapサイドに移動
dataCheck = function (str,label,bflag)
*/

function dataCheck(str,label,bflag)
{
/*
//与えられたトークンを有効データか否か検査して有効な場合に数値もしくは、
//キーワード"blank"を返す。それ以外はヌルを返す。
//今のところりまぴん専用05/03/05
//	すっかり忘れていた、
//	ブランクメソッドがファイルでかつカラセルなしの場合は、
//	ブランク自体が無効データになるように修正 05/05/02
//汎用関数になる場合は、有効データに対して
//「MAP上の正しいエントリに対応するエントリID」で返すこと。
*/
	if(! label){label=null};//ラベルなしの場合、ヌルで
if(xUI){
	if(! bflag){bflag=(xUI.blpos=="none")? false : true }
}else{
	if(! bflag){Blank=(BlankPosition=="none")? false : true }
}
	//カラセルフラグなしの場合はデフォルト位置から取得

	if (! str){return null};
//ブランクキーワードならば、ブランクを返す。
		var blankRegex=new RegExp("^("+label+")?\[?[\-_\]?[(\<]?\s?[ｘＸxX×〆0０]{1}\s?[\)\>]?\]?$");
	if (str.toString().match(blankRegex))
	{	if(bflag){return "blank" }else{ return null } }
//全角英数字記号類を半角に変換
	srcRegex=/[０-９]/;
	if (str.toString().match(srcRegex)){
		var srcChars="１２３４５６７８９０";
		var dstChars="1234567890";
		var deStr='';
		for (c=0;c<str.toString().length;c++){
			if (str.charAt(c).match(srcRegex)){
	deStr+=dstChars.charAt(srcChars.indexOf(str.toString().charAt(c)));
			}else{
	deStr+=str.toString().charAt(c);
			}
		}
	str=deStr;
	}
//数値のみの場合は、数値化して返す。ゼロ捨てなくても良いみたい?
	if(! isNaN(str)) {return str*1}else{
//レベルを判別してラベル文字列を取得。ラベル付き数値ならば、数値化して返す。
		var labelRegex=new RegExp("^("+label+")?[\-_\]?\[?[\(\<]?\s?([0-9]+)\s?[\)\>]?$");
		//↑ラベル付きおよび付いてないセル名にヒットする正規表現
		//…のつもりだけど大丈夫かしら?
		if (str.toString().match(labelRegex))
		{	str=RegExp.$2 * 1; //部分ヒットを数値化
			return str;	
		}
	};
//あとは無効データなのでヌルを返す。
	return null;
}
//以下は 上のエントリの置換え用関数

/*	Map.dataCheck(myStr,tlLabel[,blFlag])
	引数	: セルエントリ,タイムラインラベル,ブランクフラグ
	戻り値	: 有効エントリID　/"blank"/ null

	セルエントリを　文字列　タイムラインラベル　[カラセルフラグ]で与えて有効エントリの検査を行う
	MAP内部を走査して有効エントリにマッチした場合は有効エントリを示す固有のIDを返す
	（AE版では　グループ相当のコンポオブジェクトおよびフレームIDで返す）
	カラセルフラグが与えられた場合は、本来のカラセルメソッドを上書きして強制的にカラセルメソッドを切り替える
	AE版の旧版タイムシートリンカとの互換機能


*/

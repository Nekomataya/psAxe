/*
りまぴん
入出力関連プロシージャ
*/


function writeAEKey(n)
{	parent.info.document.getElementById("rEsult").value=XPS.mkAEKey(n-1);
if(! Safari){parent.info.document.getElementById("rEsult").focus();}
}


/*
りまぴん専用AEキー生成関数
与える引数は、単一レイヤから導いた1次元配列
インデックス0から連続してすべてのフレームに値があること。
プロパティ .label にラベル名を持っても良い。なければダミーを生成する。

*/
 function mkAEKey_(layer_id){
//将来、データツリー構造が拡張された場合、機能開始時点でツリーの仮構築必須
//現在は、決め打ち
//内部処理に必要な環境を作成
var	layerDataArray	=this[layer_id+1];
		layerDataArray.label=this.layers[layer_id].name;
var	blank_method	=this.layers[layer_id].blmtd;
var	blank_pos	=this.layers[layer_id].blpos;
var	key_method	=xUI.keyMethod;
var	key_max_lot	=(isNaN(this.layers[layer_id].lot))?
			0 : this.layers[layer_id].lot;

var	bflag=(blank_pos)? false : true ;//ブランク処理フラグ
//
//
var	AE_version	=xUI.aeVersion;
var	compFramerate	=this.framerate;
var	footageFramerate=xUI.fpsF;
	if(isNaN(footageFramerate)){footageFramerate=compFramerate}
var	sizeX	=this.layers[layer_id].sizeX;
var	sizeY	=this.layers[layer_id].sizeY;
var	aspect	=this.layers[layer_id].aspect;
//alert("カラセル方式は :"+blank_method+"\n フーテージのフレームレートは :"+footageFramerate);

	var layer_max_lot=0;//レイヤロット変数の初期化

//前処理 シート配列からキー変換前にフルフレーム有効データの配列を作る
//全フレーム分のバッファ配列を作る
	var bufDataArray=new Array(layerDataArray.length);
//キースタック配列を宣言
	var keyStackArray=new Array;//キースタックは可変長
	keyStackArray["remap"]= new Array();
	keyStackArray["blank"]= new Array();
		//ふたつ リマップキー/ブランクキー 用
//第一フレーム評価・エントリが無効な場合空フレームを設定
	bufDataArray[0]= (dataCheck(layerDataArray[0],layerDataArray.label,bflag))?
	dataCheck(layerDataArray[0],layerDataArray.label,bflag):"blank";

//2～ラストフレームループ
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
	max_lot = (layer_max_lot>key_max_lot)?
	layer_max_lot:key_max_lot;

//あらかじめ与えられた最大ロット変数と有効データ中の最大の値を比較して
//大きいほうをとる
//ここで、layer_max_lot が 0 であった場合変換すべきデータが無いので処理中断

	if(layer_max_lot==0){
	return "変換すべきデータがありません。\n処理を中断します。";
	}

//前処理第二 (配列には、キーを作成するフレームを積む)

	keyStackArray["remap"].push(0);
	keyStackArray["blank"].push(0);//最初のフレームには無条件でキーを作成

//有効データで埋まった配列を再評価(2～ラスト)
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
	var expBody=
'スライダ\tスライダ制御\tEffect\ Parameter\ #1\t\n\tFrame\t\t\n';

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
	var blankBody=
'変換終了\tリニアワイプ\tEffect\ Parameter\ \#1\t\n\tFrame\tパーセント\t\n';
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
	if (blank_method =="wipe")
	{
//		ブランク
		Result += '\n';
		Result += blankBody;
	}
//
} else {
//エクスプレッション1
	Result += '\n';
	Result += expBody;
}

Result += '\n\n';
Result += 'End of Keyframe Data';

return Result;
}


//リスト展開プロシージャ
	var expd_repFlag	=false	;
	var expd_skipValue	=0	;//グローバルで宣言
// リスト展開はxUIのメソッドか?
function nas_expdList(ListStr,rcl)
{	if(!rcl){rcl=false}else{rcl=true}
	var leastCount=(xUI.Selection[1])? xUI.Selection[1]:XPS.duration()-xUI.Select[1];
	if(!rcl){
		expd_repFlag=false;
		expd_skipValue=xUI.spinValue-1;
	//再帰呼び出し以外はスピン値で初期化
	}
//(スキップ量はスピン-１)この値はグローバルの値を参照
	var SepChar="\.";
//	var SepChars=["\.","\ ","\,"];


//	台詞レイヤの場合のみ、カギ括弧の中をすべてセパレートする
	if (xUI.Select[0]==0){
if (ListStr.match(/「([^「]*)」?/)) ;
if (ListStr.match(/「(.+)」?/)) {
//alert("Hit ："+ListStr.match(/^(.*「)([^」]*)(」?$)/));
	ListStr=d_break(ListStr.match(/^(.*「)([^」]*)(」?$)/));
	ListStr=ListStr.replace(/「/g,SepChar+"「"+SepChar);//開き括弧はセパレーション
}
	ListStr=ListStr.replace(/\」/g,"---");//閉じ括弧は横棒
	ListStr=ListStr.replace(/\、/g,"・");//読点中黒
	ListStr=ListStr.replace(/\。/g,"");//句点空白(null)
	ListStr=ListStr.replace(/\ー/g,"｜");//音引き縦棒
	};

//		r導入リピートならば専用展開プロシージャへ渡してしまう
		if (ListStr.match(/^([\+rR])(.*)$/)){
			var expdList=TSX_expdList(ListStr);
			expd_repFlag=true;
		}else{

//		リスト文字列を走査してセパレータを置換
	ListStr=ListStr.replace(/[\,\x20]/g,SepChar);
//		スラッシュを一組で括弧と置換(代用括弧)
	ListStr=ListStr.replace(/\/(.*)(\/)/g,"\($1\)");//コメント引数注意
//		var PreX="/\(\.([1-9])/g";//括弧の前にセパレータを補う
	ListStr=ListStr.replace(/\(([^\.])/g,"\(\.$1");
//		var PostX="/[0-9](\)[1-9])/";//括弧の後にセパレータを補う
	ListStr=ListStr.replace(/([^\.])(\)[1-9]?)/g,"$1\.$2");

//		前処理終わり
//		リストをセパレータで分割して配列に
	var srcList=new Array;
		srcList=ListStr.toString().split(SepChar);

//	if (xUI.Select[0]==0){
//	} else {}

	var expdList= new Array;//生成データ配列を作成

	var sDepth=0;//括弧展開深度/初期値0
	var StartCt=0;var EndCt=0;
//rT=0;
//		元配列を走査
	var ct=0;//ローカルスコープにするために宣言する
	for (ct=0;ct<srcList.length;ct++){
	tcn=srcList[ct];

//		トークンが開きカギ括弧の場合リザルトに積まないで
//		リザルトのおしまいの要素を横棒にする。
//	if (tcn.match(/^[「」]$/)) {y_bar();continue;}
	if (tcn=="「") {y_bar();continue;}

//		トークンがコントロールワードならば値はリザルトに積まない
//		変数に展開してループ再開
	if (tcn.match(/^s([1-9][0-9]*)$/))
	{
//		if(RegExp.$1*1>0) {xUI.spin(RegExp.$1*1)}else{xUI.spin(1)};
		expd_skipValue=(RegExp.$1*1>0)? (RegExp.$1*1-1):0;
		continue;
	}
//			グローバル
//		トークンが開き括弧ならばデプスを加算して保留
	if (tcn.match(/^(\(|\/)$/))
	{	sDepth=1;StartCt=ct;
//		トークンを積まないで閉じ括弧を走査
		var ct2=0;//ローカルスコープにするために宣言する
		for(ct2=ct+1;ct2<srcList.length;ct2++)
		{
	if (srcList[ct2].match(/^\($/)){sDepth++}
	if (srcList[ct2].match(/^(\)|\/)[\*x]?([0-9]*)$/)){sDepth--}
			if (sDepth==0)
			{EndCt=ct2;
//	最初の括弧が閉じたので括弧の繰り返し分を取得/ループ
			var rT=RegExp.$2*1;if(rT<1){rT=1};
			if(RegExp.$2==""){expd_repFlag=true;};
			var ct3=0;//ローカルスコープにするために宣言する
			for(ct3=1;ct3<=rT;ct3++)
			{if((StartCt+1)!=EndCt)
{
//alert("DPS= "+sDepth+" :start= "+StartCt+"  ;end= "+EndCt +"\n"+ srcList.slice(StartCt+1,EndCt).join(SepChar)+"\n\n-- "+rT);
expdList=expdList.concat(nas_expdList(srcList.slice(StartCt+1,EndCt).join(SepChar),"Rcall"));
//括弧の中身を自分自身に渡して展開させる
//展開配列が規定処理範囲を超過していたら処理終了
	if(expdList.length>=leastCount){return expdList}
}
			}
			ct=EndCt;break;
			}//if block end
		}//ct2 loop end
			if(rT==0)
			{expdList.push(srcList[ct]);s_kip();//ct++;
			}
	}else{
//	トークンが展開可能なら展開して生成データに積む
			if (tcn.match(/^([1-9]{1}[0-9]*)\-([1-9]{1}[0-9]*)$/))
			{
	var stV=Math.round(RegExp.$1*1) ;var edV=Math.round(RegExp.$2*1);
		if (stV<=edV){
	for(tcv=stV;tcv<=edV;tcv++){expdList.push(tcv);s_kip();}
		}else{
	for(tcv=stV;tcv>=edV;tcv--){expdList.push(tcv);s_kip();}
		}
			}else{
	expdList.push(tcn);s_kip();
			}

	}
}
	}
//	生成配列にスキップを挿入
function s_kip(){
//for (x=0;x<(xUI.spinValue-1);x++){expdList.push('');}
for (x=0;x<expd_skipValue;x++){expdList.push('');}
}
//	配列の末尾を横棒に
function y_bar(){expdList.pop();expdList.push('---');}
//	かぎ括弧の中身をセパレーション
function d_break(dList){
	wLists=dList.toString().split(",");
	return wLists[1]+wLists[2].replace(/(.)/g,"$1\.")+wLists[3];}
//
// カエス
	if ( expdList.length < leastCount && expd_repFlag ){
			blockCount=expdList.length;
//			alert(blockCount + " / " +leastCount);
			for(resultCt=0; resultCt <= (leastCount-blockCount); resultCt++){
				expdList.push(expdList[resultCt % blockCount]);
			}
		}
		return expdList;

}
/*
	XPS オブジェクトから 保存用ファイルに変換
		メソッドか?それとも関数か?
	2005/03/04
本体を	XPS.toString() に書き換えて、元の関数はラッパとして残しました。
	2005/12.19
*/
function writeXPS(obj)
{
if(! nas.isAdobe){
_w=window.open ("","xpsFile","width=480,height=360,scrollbars=yes,menubar=yes");

	_w.document.open("text/plain");
		if(! MSIE && ! Firefox)_w.document.write("<html><body><pre>");
	_w.document.write(obj.toString());
		if(! MSIE && ! Firefox)_w.document.write("</pre></body></html>");
	_w.document.close();

	_w.window.focus();//書き直したらフォーカス入れておく
	return false;//リンクのアクションを抑制するためにfalseを返す
}else{return obj.toString();};
}


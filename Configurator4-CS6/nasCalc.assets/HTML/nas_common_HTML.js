/* 
	nas_tools.js お道具箱汎用データ操作・サービス 関数
イロイロ、共通でつかえる奴
基本的にWWWブラウザに依存するので、Javascript(ECMA-262)汎用系と切り分けます。
ただし。呼び出しの弁のため、nasオブジェクトのメソッドであることは変わらず。
このスクリプトをロードする前にnasオブジェクトの初期化は行うこと。


nas.updateBk() {
	エレメントの値をすべてバックアップ(正常な処理の最後に呼ぶ)
nas.Push_Log(str) {Log = Log.concat([str])}
	ログファイルへのプッシュ
nas.sliderVALUE(chnk)
	マウスドラグによるインプット値の編集開始
nas.sliderOFF()
	マウスドラグによるインプット値の編集終了

nas.MVSlider_NS(event)
nas.MVSlider_IE()
	マウススライダが呼び出すメソッド

nas.editTableCell(myObj,inputType,myContent,myFunction)
	htmlテーブルの内容をダイナミックに書き換えるメソッド

nas_sizeToContent()
	ウィンドウサイズをあわせる一応汎用品(あやしい)

===================メッセージ (現在未使用）
フレームレートがロックされているので、リンクは解除できません。
解像度がロックされているので、リンクは解除できません。
ゼロは設定しないでください。
負の値は設定できません。
メッセージは不要かも
フラグを付けてプリファレンスで選択させるか?
===============================
AIR環境ではローカルシステムサポートが発生するので
こちらのファイルで判定や切り替えをある程度サポートするべきか?

*/
isAIR=false;
if (navigator.userAgent.indexOf("AdobeAIR") > -1) {isAIR=true}

try {
//エレメントの値をすべてバックアップ(正常な処理の最後に呼ぶ)
function updateBk() {
	for (n = 1 ; n< BkValue.length ; n++) {
	elName = ElementName[n];
	BkValue[n] = document.nasExchg.elements[elName].value }
};

/*
	ログ関連
あまりつかってない
*/
//	ログ配列を初期化（）

nas.Log = new Array() ;
nas.Push_Log = function (str){this.Log = this.Log.concat([str])}

//	ログ 初期化してみる
nas.Push_Log( "Program Started " + nas.VER);
nas.Push_Log( Date() );
nas.Push_Log( "  FrameRate" + nas.FRATE + "(" + nas.FRATE + ")");
//nas_Push_Log( "  Start Mode  [" + MODE + "]" );
//

/*
	マウスバリスライダ
書いてはみたが
これは ひょっとしてなんかのパテントにふれる様な気がしてならない。
要調査
これを使うinputオブジェクトは、以下の書式でsliderVALUEを呼ぶ
sliderVALUE([event,エレメント名,上限,下限,桁数(,初期値)]);

初期値の挿入とロック時の動作を追加TC関連の拡張まだ(04.06.06)
formオブジェクトの参照からinputElementに変更
コード見直しで動作可能に
以前との互換は終了(10.09.20)
*/

nas.sliderVALUE = function(chnk) {
//配列で受け渡し [イベント,エレメントID,上限,下限,桁数(,デフォルト値)]
	var startX = chnk[0].screenX;
	var slfocus = document.getElementById(chnk[1]);
	var slmax = 1*chnk[2];
	var slmin = 1*chnk[3];
	var slstp = 1*chnk[4];
	var baseValue =slmin;
//タイプが、input以外だったりロックされていたらモード変更なしでリターン
if (slfocus.disabled == true || (!(slfocus instanceof HTMLInputElement)) ) {return false}
//基準値取得
if (isNaN(slfocus.value)) {
	if (chnk.length == 6){baseValue = 1*chnk[5]}
} else {
	baseValue = 1 * (slfocus.value);
}
//該当するエレメントのオンチェンジを保留してスライダモードに入る

	slfocus.blur();
//	document.nasExch.elements[slfocus].onchange = '';
	document.body.sliderTarget=slfocus
	document.body.sliderTarget.startX= startX;
	document.body.sliderTarget.slmax = slmax;
	document.body.sliderTarget.slmin = slmin;
	document.body.sliderTarget.slstp = slstp;
	document.body.sliderTarget.baseValue=baseValue;
switch (navigator.appName) {
case "Opera":
case "Microsoft Internet Explorer":
	document.body.onmousemove = MVSlider_IE_;break;
case "Netscape":
	document.body.onmousemove = MVSlider_NS_;break;
default:
	return;
}
	document.body.onmouseup = function(){
		this.onmousemove = null;
		this.onmouseup   = null;

//スライダの値が前の値と異なっていた場合のみ更新
		if (this.sliderTarget.value != this.sliderTarget.baseValue) {this.sliderTarget.onchange();}
		
		delete this.sliderTarget.startX;
		delete this.sliderTarget.slmax;
		delete this.sliderTarget.slmin;
		delete this.sliderTarget.slstp;
		delete this.sliderTarget.baseValue;
		delete this.sliderTarget;
		return;
	}

}
//


function MVSlider_NS_(event) {
	var diffValue = event.screenX - this.sliderTarget.startX;
	if (diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//ガンマかけて値をとる
	var newValue = this.sliderTarget.baseValue + (Flgl * (Math.pow(diffValue/100,2)*100));
//上限下限でおさえる
	if (newValue > this.sliderTarget.slmax) {newValue = this.sliderTarget.slmax} {
		if (newValue < this.sliderTarget.slmin) {newValue = this.sliderTarget.slmin}
	}
//ステップで桁だし
	var exN = Math.pow(10,this.sliderTarget.slstp);
	newValue = Math.floor(newValue * exN)/exN;
	if(this.sliderTarget.value != newValue) {
		this.sliderTarget.value = newValue ;
		this.sliderTarget.onchanging();
	}
}
//	nas.MVSlider_NS	=	MVSlider_NS_ ;


function MVSlider_IE_() {
	this.diffValue = event.screenX - this.sliderTarget.startX;;
	if (this.diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//ガンマかけて値をとる
	newValue = this.sliderTarget.baseValue + (Flgl * (Math.pow(this.diffValue/100,2)*100));
//上限下限でおさえる
	if (newValue > this.sliderTarget.slmax) {newValue = this.sliderTarget.slmax} {
		if (newValue < this.sliderTarget.slmin) {newValue = this.sliderTarget.slmin}
	}
//ステップで桁だし
	var exN = Math.pow(10,this.sliderTarget.slstp);
	newValue = Math.floor(newValue * exN)/exN;
	if(this.sliderTarget.value != newValue) {
		this.sliderTarget.value = newValue;
		this.sliderTarget.onchanging();
	}
}
//	nas.MVSlider_IE	=	MVSlider_IE_	;//
//マウスバリスライダ関連終了

/*	nas.editTableCell(セルオブジェクト[,inputType[,初期値[,変更時関数]]])
テーブルセルに対してサイズを一致させたINPUT/TEXTAREAを作成して入力値でそのテーブルの内容を置き換える
汎用メソッド

inputTypeフラグでINPUT/TEXTAREAを切り換える
"input" / "textarea" で指定 デフォルトは"input"

同時に作成する入力コントロールはひとつ

あまり複雑なテーブル内容を書き換える際(特にタグやクォートがある内容)は注意
変更時に内容をフィルタする必要あり

	nas.editTabelCell(セルオブジェクト[,初期値[,オンチェンジ関数]])

指定するテーブルセルにはユニークなIDが必要である。
IDをもたないセルは編集対象にならない。

また ユニークID+"_ipt"を一時生成するInputのIDとして使用するため、
このIDがユニークになることも期待されている。

editTableCellを使用して変数等の編集をする場合は、
使用時にeditTableCell.onChange()メソッドに使用する関数を登録すること。
例

myOnChange=function(){VAR1=this.newContent;}
editTabelCell(document.getElementById("x0_0"),VAR1,myOnChange);

この操作関数がなければこのメソッドはテーブルの内容のみを書き換える
関数中では以下のサブプロパティが参照可能

this.target=null     ;//対象セル HTMLTableCellElement
this.inputArea=null  ;//現在ホールドしている HTMLInputElement
this.orgContent=""   ;//変更前のプロパティ(セル)の値
this.newContent=""   ;//変更後の値

実行後はクリアされるので参照不能

デフォーカス(ブラー)がかかった場合は、ステータスにfalseをセットして終了する戻り値はnullに置き換える。
最終の値はnas.editTableCell.newContentで参照可能

optionでテーブル内にキャンセルボタンを表示可能にする。ボタン動作はエスケープと同じ ヤメる　ボタンは邪魔
ただしこれを利用したダイアログボックスは作る
*/
nas.editTableCell=function(myObj,inputType,myContent,myFunction){
if(!inputType) inputType="input";
//if(!myContent) myContent="";

if(!this.target)     this.target=null     ;//対象セル HTMLTableCellElement
if(!this.status)     this.status=false    ;//データステータス＞キャンセル基本
if(!this.inputArea)  this.inputArea=null  ;//現在ホールドしている HTMLInputElement
if(!this.orgContent) this.orgContent=""   ;//変更前のプロパティ(セル)の値
if(this.newContent==undefined) this.newContent=this.orgContent   ;//変更後の値
if(!this.updCount)   this.updCount=0      ;//なぜか２回連続でイベントが発生する際のイベントカウンタ AIR用
if(!this.onChange)   this.onChange=(myFunction)?myFunction:null;
if(! this.init){
	this.init=function(){this.target=null;this.status=false;this.inputArea=null;this.orgContent="";delete this.newContent};//まとめてリセット
}
//引数オブジェクトがInput/TextAreaだった場合は、インプットの内容でセルを置き換えてonChangeを実行してから、メソッド自体をリセットする
if((myObj==null)||(myObj instanceof HTMLInputElement)||(myObj instanceof HTMLTextAreaElement)){
	if(this.updCount){return false;}
	this.updCount++;
//なぜかAIR環境の際にchangeイベントが二回連続で発生するので二度目の動作を捨てるためのトラップ(要精査 2010・0913)
	//this.status　は主にonChange内で処理する
	if(myObj==null){
		this.status=false;
		this.target.innerHTML=this.orgContent;//先に書き換える、onChangeで参照可能かつ変更可能に
	}else{
	this.newContent=(myObj.value != undefined)? myObj.value:myObj.innerHTML;
//	valueオブジェクトが存在する場合はオブジェクトを取得…でもテキストエリアにvalueがあるのね
		this.status=true;
		this.target.innerHTML=this.newContent;//先に書き換える、onChangeで参照可能かつ変更可能に
	}
	delete myObj;//明示的に消す
	if(this.onChange){this.onChange()};
	if(this.target.innerHTML==""){this.target.innerHTML+="<br />"};//空文字列の時　改行ひとつと置換
	var myResult=(this.status)? this.newContent:null;
	this.init();
	this.onChange=null;//ファンクションクリア
	return myResult;//
}
//オブジェクトなしでコールされた場合
//現在のターゲットがなければスキップ あればターゲットをリセットクリア
if(!(myObj instanceof HTMLTableCellElement)){
	if(! this.target){return false};//先の入力エリアが存在するか?
	this.target.innerHTML=this.orgContent;//復帰
	this.init();
}
//セルあり
//既存ターゲットセル
if(this.target){
//同じセルか
	if(myObj==this.target){
		return false;//スキップ
	}else{
//違うセルなのでいったん終了
		nas.editTableCell(this.inputArea);
	}
}
/*	事前処理終了
初期化が行われたので必要なあたらしいターゲットを設定
ターゲットと同サイズのインプットを開く
初期値は、引数で与えられた場合はそちら、なければテーブルの内容
*/
	this.target=myObj;
	this.updCount=0;
	this.orgContent=(!(myContent==undefined))? myContent:myObj.innerHTML.replace(/<.+>/g,"");//控える
//ここでテーブルから取得される内容はタグを払った状態になる。タグを編集する必要がある場合はあらかじめ引数で内容を与えること
	this.newContent=this.orgContent;
	if(!this.inputArea){this.inputArea=null}
	var myWidth=myObj.clientWidth;var myHeight=myObj.clientHeight;
if(inputType=="textarea"){
	myObj.innerHTML="<textArea id=\""+myObj.id+"_ipt\">"+this.orgContent+"</textArea>";
}else{
	myObj.innerHTML="<input type=\"text\" id=\""+myObj.id+"_ipt\" value=\""+this.orgContent+"\">";
}
//入力を設定
	this.inputArea=document.getElementById(myObj.id+"_ipt");

	this.inputArea.style.width=myWidth+"px";
	this.inputArea.style.height=myHeight+"px";
	this.inputArea.parentCell=myObj;
	this.inputArea.onchange =function(e){nas.editTableCell(this);}
	this.inputArea.onblur   =function(e){nas.editTableCell(null);};//no button
	this.inputArea.onkeyup	=function(e){if(getKEYCODE(e)==27){nas.editTableCell(null);};return true;}
	this.inputArea.focus();
}
/*=====================================*/
//モーダルダイアログパネル
/*
alert/confirm/propmpt 等の代替モーダルダイアログパネルを表示させる。
機能的にはブラウザ本来のものとほぼ同等
AIRにはそもそも"showModalDialog"メソッドがなかったでのAIRでは不使用! とほほ
nas.showModalDialog(type[,msg[,title[,startValue[,myFunction]]]])

type	"alert","confirm","confirm2","prompt","prompt2";//サブナンバつきのタイプは選択肢が(yes/no/cancel)になる。
msg	メッセージテキスト メッセージはタグ使用可能
title	ウインドウタイトル
startValue	プロンプト初期値
ネイティブなモーダルパネルではなくなるので終了関数が必要 終了関数自体は自分自身を呼び出してその中で実行している
終了関数内部で参照する一般プロパティは
	this.startValue=startValue;//プロンプト初期値
	this.status=0;//状態初期値　0:yes 1:no 2:cancel
	this.value=this.startValue;//プロンプトの終了値

*/
nas.showModalDialog =function(type,msg,title,startValue,myFunction)
{
if(!(type=="result")){
	if(! type)      {type="alert"};//"alert","confirm","confirm2","prompt","prompt2","result"
	if(! msg)       {msg=""};
	if(! title)     {title=type};
	if(! startValue){startValue=""};
	if(! myFunction){myFunction=null};

	this.type=type;
	this.msg=msg.replace(/\r?\n/g,"<br>");
	this.title=title
	this.startValue=startValue;
	this.status=0;//状態初期値　0:yes 1:no 2:cancel
	this.value=this.startValue;
	this.exFunction=myFunction;
//初回実行時にモーダルパネルオブジェクトを生成しておく
	if (!this.modalLayer){
		var mdlPnl=document.createElement("div");
		mdlPnl.id="nas_modalLayer";
		var mdlLyr=document.body.appendChild(mdlPnl);
		mdlLyr.style.position="fixed";
		mdlLyr.style.left="0px";
		mdlLyr.style.top="0px";
		mdlLyr.style.width="100%";
		mdlLyr.style.height="100%";
//		mdlLyr.style.background="#FFCCCC";

var myContent="<span id='nas_modalDialog' style='padding:6px;background:#EEEEEE;position:fixed;top:192px;left:240px;border-style:double'>";
myContent+="<b id='nas_modalTitle'>Title</b><br><hr>";
myContent+="<span id='nas_modalMsg'>Message</span><br>";
myContent+="<input id='nas_modalInput'></input><br>";
myContent+="<button id='nas_modalBt0'>OK</button>";
myContent+="<button id='nas_modalBt1'>NO</button>";
myContent+="<button id='nas_modalBt2'>CANCEL</button>";
myContent+="</span>";
mdlLyr.innerHTML=myContent;
		document.getElementById("nas_modalInput").style.width="90%";
		document.getElementById("nas_modalBt0").style.width="6em";
		document.getElementById("nas_modalBt1").style.width="6em";
		document.getElementById("nas_modalBt2").style.width="6em";
		document.getElementById("nas_modalInput").onchange=function(){nas.showModalDialog("result",0)};
		document.getElementById("nas_modalBt0").onclick=function(){nas.showModalDialog("result",0)};
		document.getElementById("nas_modalBt1").onclick=function(){nas.showModalDialog("result",1)};
		document.getElementById("nas_modalBt2").onclick=function(){nas.showModalDialog("result",2)};

		mdlLyr.style.display="none";
		this.modalLayer=mdlLyr;
	}
//パネル初期化
	document.getElementById("nas_modalTitle").innerHTML=this.title;
	document.getElementById("nas_modalMsg").innerHTML=this.msg;
	document.getElementById("nas_modalInput").value=this.value;
	switch(this.type){
	case	"alert":;
		document.getElementById("nas_modalBt0").style.display="inline";
		document.getElementById("nas_modalBt1").style.display="none";
		document.getElementById("nas_modalBt2").style.display="none";
	break;
	case	"confirm2":;
	case	"prompt2" :;
		document.getElementById("nas_modalBt0").style.display="inline";
		document.getElementById("nas_modalBt1").style.display="inline";
		document.getElementById("nas_modalBt2").style.display="inline";
	break;
	case	"prompt":;
	case	"confirm":;
		document.getElementById("nas_modalBt0").style.display="inline";
		document.getElementById("nas_modalBt1").style.display="none";
		document.getElementById("nas_modalBt2").style.display="inline";
	}
	switch(this.type){
	case	"alert":;
	case	"confirm2":;
	case	"confirm":;
		document.getElementById("nas_modalInput").style.display="none";
	break;
	case	"prompt2" :;
	case	"prompt":;
		document.getElementById("nas_modalInput").style.display="inline";
	break;
	}
	this.modalLayer.style.display="inline";
}else{
//	return;
if(false){
	window.showModalDialog(
		"./template/nasDialog.html",
		this,
		"dialogWidth:320px;dialogHeight:192px;center:yes;status:off"
	);
}
this.status=msg;
this.value=document.getElementById("nas_modalInput").value;
	var myResult;//ync以外はjavaScript互換の値を返す
	switch(this.type){
	case    "alert":
	case  "confirm":
		myResult =(this.status==0)?true:false;
		break;
	case "prompt":
		myResult =(this.status==0)?this.value:null;
		break;
	case "prompt2":
	case "confirm2":
		myResult =[this.status,this.value]
		break;

	}
	this.modalLayer.style.display="none";
	if(this.exFunction){this.exFunction()};//ファンクション内では各種プロパティ参照可能

//	alert(myResult);
}
}
//代用別名関数　Javascript 置換用
/*
	NAS.showModalDialog() をラップしてJavascript（書式）互換の機能を提供します。置き換え可能なのはalertのみ
*/
nas.alert  =function(msg){nas.showModalDialog("alert",msg)};//代用alert
//nas.confirm=function(msg){return nas.showModalDialog("confirm",msg)};//代用confirm
//nas.prompt =function(msg,value){return nas.showModalDialog("prompt",msg,false,value)};//代用prompt

//ウインドウをコンテンツにフィットさせる関数、引数は特になし

function nas_sizeToContent(){
if (! MSIE){
//	if(ckUA()[1]!='MSIE'){}
//モジラ系の場合は、sizeToContent()を呼ぶだけ。
	try{sizeToContent();}catch(e){return;
	//alert(e);
	}
	}else{
//IE系の場合は大雑把にマッチ
//このプロパティはinnerWidth/Height と等価だった
		try{
	var WinW=document.getElementById("uiTable").clientWidth+60;
	var WinH=document.getElementById("uiTable").clientHeight+120;
	window.resizeTo(WinW,WinH);
		}catch(e){
	return e;
//	alert(e);
		}
	}
}
/*	cssルールセットから値を取得する関数
		nasメソッド
	nas.getCssRule( セレクタ, プロパティ, シートインデックス )
セレクタ	cssのセレクタを指定
プロパティ	プロパティを置く
シートインデック	"screen"=0 "print"=1
*** 	このメソッドは必0番にスクリーン用スタイルシート・1番にプリント用スタイルシートが
	ロード済みであることが前提条件　注意！！ IDの方が良いかも
*/
nas.getCssRule=function( selector, property, sheetindex ) {
	selector = selector.toLowerCase( )
	if( sheetindex == undefined ) sheetindex = 0;
	if( property.indexOf( "-" ) != -1 ) property = property.camelize( );
	var rules = document.styleSheets[ sheetindex ].rules //IE
	|| document.styleSheets[ sheetindex ].cssRules; //Mozilla

  for( var i = rules.length - 1; i >= 0; i-- ) {
      var rule = rules[i];
      if( rule.selectorText.toLowerCase( ) != selector
      || rule.style[ property ] == "" ) continue;
      return rule.style[ property ];
  }

  return null;
}

/*	cssにルールセットを追加する関数
		nasのメソッド
	nas.addCssRule( セレクタ, プロパティ, 適用範囲 )
セレクタ	cssのセレクタを指定
プロパティ	プロパティを置く
適用範囲	"screen""print"または"both"(0,1 or both)
*** 	このメソッドは必0番にスクリーン用スタイルシート・1番にプリント用スタイルシートが
	ロード済みであることが前提条件　注意！！ IDの方が良いかも
 */

nas.addCssRule= function( selector, property, region ) {
	if(! region){region="both"}

//	if(( document.styleSheets[0].addRule)&&(! Safari) ){}
//Safari３は、addRuleとinsertRule両方のメソッドを持っているが、Mozilla互換っぽいので判定変更
	if(MSIE){
//IE
switch(region){
case	"both":
	document.styleSheets[0].addRule( selector, "{" + property + "}" );
	document.styleSheets[1].addRule( selector, "{" + property + "}" );
	break;
case	"screen":
	document.styleSheets[0].addRule( selector, "{" + property + "}" );
	break;
case	"print":
	document.styleSheets[1].addRule( selector, "{" + property + "}" );
	break;
default:
}
	return;
	}else{
		if( document.styleSheets[0].insertRule ){
//Mozilla
switch(region){
case	"both":
	document.styleSheets[0].insertRule( selector + "{" + property + "}", document.styleSheets[0].cssRules.length );
	document.styleSheets[1].insertRule( selector + "{" + property + "}", document.styleSheets[1].cssRules.length );
	break;
case	"screen":
	document.styleSheets[0].insertRule( selector + "{" + property + "}", document.styleSheets[0].cssRules.length );
	break;
case	"print":
	document.styleSheets[1].insertRule( selector + "{" + property + "}", document.styleSheets[1].cssRules.length );
	break;
default:
}
	return;
		}else{	return false;}
}}

/*
	htmlオブジェクトのテキストの選択状態を返すメソッド
	nas.getAreaRange(htmlObject)
	返値はオブジェクト
	result.start	整数
	result.end	整数
*/
nas.getAreaRange=function(obj) {
	var pos = new Object();

	if (MSIE) {
		obj.focus();
		var range = document.selection.createRange();
		var clone = range.duplicate();

		clone.moveToElementText(obj);
		clone.setEndPoint( 'EndToEnd', range );

		pos.start = clone.text.length - range.text.length;
		pos.end = clone.text.length - range.text.length + range.text.length;
	}

	else if(window.getSelection()) {
		pos.start = obj.selectionStart;
		pos.end = obj.selectionEnd;
	}
return pos;
// alert(pos.start + "," + pos.end);
}
//テキストエリアに挿入メソッド追加

HTMLTextAreaElement.prototype.insert=function(insertText){
	//自分自身のカレット位置を出す
	var myPos=nas.getAreaRange(this);
	var range = this.value.slice(myPos.start, myPos.end);
	var beforeNode = this.value.slice(0, myPos.start);
	var afterNode = this.value.slice(myPos.end);
	this.value=beforeNode+insertText+afterNode;

}
//お道具箱汎用データ操作関数群オワリ
} catch(err){alert(err.toString());}

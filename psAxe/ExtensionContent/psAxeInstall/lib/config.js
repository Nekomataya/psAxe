/*	////// nas ユーザ設定ファイル //////
	新規作成時の標準値になります。
	説明を読んでお好きな値に書き換えて下さい。
	一部の情報は、クッキーで保存可能(予定)です。
		2005/04/06
		2005/04/28	デバッグフラグ追加(そのうちなくなるかもね)
		2005/08/09	クッキー調整
		2005/08/25	cssに合わせて背景色を追加
		2005/09/01	クッキー内容追加
		2005/09/04	クッキー内容追加/修正
		2005/10/17	タイトル装飾追加
		2005/12/11	読み込み時データシフトスイッチの動作を変更

	**レンダー乙女用に別ファイルを作成 2006/01/07
		HTML依存部分・クッキー関連部分等は削除
*/
	var dbg=true	;	//デバッグモード

/*
	開始メッセージ
		お好きなメッセージに入れ替えできます。
		ただし開始メッセージが抑制されている場合は表示されません。
*/

	var welcomeMsg="レンダー乙女パイロット版\(アルファテスト中要注意\)\!";


//---作業オプション 主にデフォルト値
var myTitle="タイトル未定"	;
			//タイトル 現行の作品名を入れておくとラクです
var mySubTitle="サブタイトル未定"	;
			//サブタイトル 同上
var myOpus="第  話"	;
			//制作話数等
var myFrameRate=24	;
			//初期フレームレートを置いてください。フレーム毎秒
var Sheet="6+0"	;
			//カット尺初期値
var SheetLayers=5;
			//レイヤ数初期値
//---

var myScene=""	;
			//A.Bパート等。空白でも良いでしょう。
var myCut="C# "	;
			//カット番号

var myName=(function(){var myName=(Folder.desktop.parent.fsName).replace(/[\/\\]/g,",").split(",");myName=myName[myName.length-1];return myName})();//---作業ユーザ名	*cookie[2]
//var myName="your name";
var NameCheck=true	;
	// NameCheckを有効にすると起動時に名前を入力するプロンプトがでます。
	// 名前は保存できます。


//////////////////////////////////////////////
//---キー変換オプション	*cookie[3]
var BlankMethod	="opacity";
			//カラセル方式デフォルト値
			//	"file",		カラセルファイル
			//	"opacity",	不透明度で処理
			//	"wipe",		ワイプで処理
			//	"expression1"	エクスプレッションで処理
			//	"expression2"	エクスプレッションで処理
			//
var BlankPosition	="end";
			//カラセル位置デフォルト値
			//	"build",	自動生成(現在無効)
			//	"first",	最初
			//	"end",		最後
			//	"none"		カラセルなし
var AEVersion	="8.0";
			//AEバージョン 4.0 5.0 
	// 現在 6.0 / 6.5 は非対応 こっそり対応開始
	// AE に下位互換性があるので5.0をつかってください
var KEYMethod	="min";
			//AEキータイプ
			//	"min"	キーの数が最少
			//		(自分で停止にする必要がある)
			//	"opt"	最適化
			//		(変化点の前後にキーをつける)
			//	"max"	最大
			//		(すべてのフレームにキーをつける)
var TimeShift	=true	;
			//AEキー取り込みの際0.5フレームのオフセットを自動でつける
			//	 true	つける(標準)
			//	false	つけない
var FootageFramerate	="auto";
			//フッテージのフレームレート
			//	"auto"	コンポのフレームレートに合わせる
			//	数値	指定の数値にする

var defaultSIZE	="640,480,1";
			//コンポサイズが指定されていない場合の標準値
			//"横,縦,アスペクト"
//UIオプション(乙女用)
//---カウンタタイプ
var Counter0	=[4,0];

var SheetLength=6;
			//タイムシート1枚の秒数
			//	どう転んでも普通６秒シート。でも一応可変。
			//	2列シートを使う時は偶数の秒数がおすすめ。


var uiLocale="en";	//現在は　"en""ja"のみ　有効	
//---
if(false){
//---シートオプション	*cookie[4]
var SpinValue	=3;
			//スピン量初期値
var SpinSelect	=true;
			//選択範囲指定でスピン量の指定を行うか

var SheetPageCols=2;
			//シートの列数。
			//	シート秒数を割り切れる数を置いて下さい。
			//	実際問題としては１または２以外は
			//	使いづらくてダメだと思うよ。
var FootMark	=true;
			//足跡機能
			// 使う=true / 使わない=false
//---

//---カウンタタイプ	*cookie[5]
var Counter0	=[3,0];
var Counter1	=[5,1];
			//カウンタのタイプ
			//[表示形式,開始番号]
			//
			//カウンタのタイプは、5種類。いずれかを数字で
			//	type 1	00000		
			//	type 2	0:00:00		
			//	type 3	000 + 00	
			//	type 4	p 0 / 0 + 00	
			//	type 5	p 0 / + 000	
			//開始番号は、0 または 1	

//--

//---ユーザインターフェースオプション	*cookie[6]
var SLoop	=false;
var CLoop	=true;
			//スピンループ・カーソルループ
			//する=true / しない=false
var AutoScroll	=true;
			//自動スクロール
			//する=true / しない=false
//---	
var TSXEx	=false;
			//TSX互換機能を使うか
//var TMSEx	=false;
		//TMS互換機能を使うか?この機能はまだありません
		//TMS については、http://www.nekora.main.jp/ あたりを参照
if(navigator==undefined){var MSIE	=false};//ブラウザの互換変数
////////////
var SheetSubSeparator	=6;
			//サブセパレータの間隔
var FavoriteWords =["X","","カラ","→","←","移動","↑","｜","↓","∥","___","----","[#]","(#)","<#>","[*]","(*)","<*>"];
			//ツールボックスの「よく使う文字」のエントリ
			// * は、現在の内容(現在無効)
			// # は、現在の数値 と置き換えられます。(現在無効)

}



/*
	クッキーで保存する情報
	true の情報を保存します。保存したくない情報は、false にしてください。
	情報の種類にしたがってクッキーで保存する情報と保存したくない情報を
	選んでください。
	記録しなかった情報はこのファイルの設定に従います。
	どの情報も使用中に切り替え可能です。

*/
if(false){
var	useCookie	=[true];//クッキーを使う場合は"true"にしてください。
//クッキーの期限 
//	0		ゼロ > そのセッション限り
//	日数	数値を与えると、最後に使った日からその日数の間有効
	useCookie.expiers	=3	;
//[0]	ウィンドウサイズの記録と復帰
	useCookie.WinSize	=true	;
//[1]	最後に編集したシートの尺数。レイヤ数などを記録するかどうか?
 	useCookie.XPSAttrib	=true	;
//[2]	最後に作業したユーザ名
 	useCookie.UserName	=true	;
//[3]	キー変換オプション
 	useCookie.KeyOptions	=true	;
//[4]	シートオプション
 	useCookie.SheetOptions	=true	;
//[5]	カウンタ種別
 	useCookie.CounterType	=true	;
//[6]	ユーザインターフェース
 	useCookie.UIOptions	=true	;
}
// この設定ファイルは、Javascriptのソースです。書き換えるときはご注意を
// エラーが出た時のためにバックアップをお忘れ無く。
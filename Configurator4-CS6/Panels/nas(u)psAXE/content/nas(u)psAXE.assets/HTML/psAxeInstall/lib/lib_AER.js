//XPSオブジェクトを介したシートコンバータ 当座はこれで行く
/*			AER2XPS(myOpenFile)
 *		AERemaファイルをXPS互換テキストにコンバートする
 *		引数	AEDデータをポイントするファイルオブジェクト
 *		拡張子は ard/txt のみ。
 *		ヘッダ検査あり。ファイルの破損は検査なし
 *		全ファイルを配列にとらない方が良いかも…
 */
function AER2XPS(myOpenFile)
{
//識別文字列位置を確認してファイルフォーマット判定
	myOpenFile.open("r");
	checkVer=myOpenFile.read(24);
	myOpenFile.close();
if (! checkVer.match(/^#TimeSheetGrid\ SheetData$/)){ return false;};

//オープンして配列にとる
	myOpenFile.open("r");
	myContent=myOpenFile.read();
	myOpenFile.close();
//ARDデータをXPSでオブジェクト化する
	var myARD=new Xps();
	myARD.readIN(myContent);
	if(myARD.cut==myCut){myARD.cut=myOpenFile.name.replace(/\.[^\.]+$/,"")};//デフォルト値なのでファイル名で置き換える
	if(myARD.title==myTitle){myARD.title=nas.workTitles.selectedName};//デフォルトで置き換える
	
	return myARD.toString();
}
//end converter
function TSH2XPS(myOpenFile)
{
//識別文字列位置を確認してファイルフォーマット判定
	myOpenFile.open("r");
	checkVer=myOpenFile.read(52);
	myOpenFile.close();
if (! checkVer.match(/^\x22([^\x09]+\x09){25}[^\x09]+$/)){ return false;};

//オープンして配列にとる
	myOpenFile.open("r");
	myContent=myOpenFile.read();
	myOpenFile.close();
//ARDデータをXPSでオブジェクト化する
	var myTSH=new Xps();
	myTSH.readIN(myContent);
	if(myTSH.cut==myCut){myTSH.cut=myOpenFile.name.replace(/\.[^\.]+$/,"")};//デフォルト値なのでファイル名で置き換える
	if(myTSH.title==myTitle){myTSH.title=nas.workTitles.selectedName};//デフォルトで置き換える
	
	return myTSH.toString();
}

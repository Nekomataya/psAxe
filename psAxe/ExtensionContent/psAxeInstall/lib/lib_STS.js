/*			STS2XPS(myOpenFile)
 *		STSファイルをXPS互換テキストにコンバートする
 *		引数	STSデータをポイントするファイルオブジェクト
 *		拡張子は sts/STS のみ。
 *		ヘッダ検査あり。ファイルの破損は検査なし
 *		要 乙女バイナリ拡張
 *		全ファイルを配列にとらない方が良いかも…
 */
function STS2XPS(myOpenFile)
{
//識別文字列位置を確認してファイルフォーマット判定
	myOpenFile.open("r");
	checkVer=myOpenFile.read(18);
	myOpenFile.close();
if (! checkVer.match(/^\x11ShiraheiTimeSheet$/)){ return false;};

//オープンして配列にとる
	myOpenFile.open("r");
	mySTS=myOpenFile.getBin();
	myOpenFile.close();
//STSデータをオブジェクト化する
	mySTS.file=myOpenFile;//参照可能なようにオリジナルのファイルをプロパティｌにぶら下げる
	mySTS.frameDuration	=mySTS[19]*1+mySTS[20]*256;
					//フレーム継続数
	mySTS.layerCount	=mySTS[18]*1;
					//レイヤ数
	mySTS.dataLength	=2;
					//1フレームあたりのデータ長2バイト整数
	mySTS.body=function(layerID,frameID)
	{
		//2bite/1data : offset 23bite : IDは0オリジン アドレスを計算して値を戻すメソッド
		var myAddress= (layerID)*(this.frameDuration*this.dataLength)+(frameID*this.dataLength)+23;
		return this[myAddress]+this[myAddress+1]*256;
	}
//ラベル取得はファイル読み込みで(S-JIS)*大丈夫かな?
	mySTS.layerLabel	=new Array(mySTS.layerCount);//ラベル配列
	var labelDataLength	=new Array(mySTS.layerCount);//ラベルデータ長配列
//ラベルの位置と長さを取得
//		ラベル0のシーク位置
	var labelOffset=mySTS.layerCount*(mySTS.frameDuration*mySTS.dataLength)+23;
//		ラベル長(バイト数)
	labelDataLength[0]=mySTS[labelOffset];
//open
	myOpenFile.open("r");
	myOpenFile.encoding="CP932";
//	最初のラベルを取得
	myOpenFile.seek(labelOffset+1,0);
	mySTS.layerLabel[0]=myOpenFile.read(labelDataLength[0]);
	for(idx=1;idx<mySTS.layerCount;idx++)
	{
		labelOffset=labelOffset+mySTS.layerLabel[idx-1].length + 1;//新アドレス
		labelDataLength[idx]=mySTS[labelOffset];//ラベル長(バイト数)
		myOpenFile.seek(labelOffset+1,0);//シーク
		mySTS.layerLabel[idx]=myOpenFile.read(labelDataLength[idx]);//取得
	}
//close
	myOpenFile.close();
//XPS互換ストリームに変換
mySTS.toSrcString = function()
{
	var resultStream="nasTIME-SHEET 0.4";
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="#ShiraheiTimeSheet";
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="##TITLE="+nas.workTitles.selectedName;
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="##CUT="+this.file.name.replace(/\.[^\.]+$/,"");
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="##TIME="+nas.Frm2FCT(this.frameDuration,3,0);
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="##TRIN=0+00.,\x22\x22";
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="##TROUT=0+00.,\x22\x22";
	resultStream	+=nas.GUI.LineFeed;
//	ラベル配置
	resultStream	+="[CELL\tN\t";
	for(idx=0;idx<this.layerCount;idx++)
	{	resultStream	+=this.layerLabel[idx]+"\t";};
	resultStream	+="]";
	resultStream	+=nas.GUI.LineFeed;
	
	for(frm=0;frm<this.frameDuration;frm++)
	{
		resultStream	+="\t\t";
		for(idx=0;idx<this.layerCount;idx++)
		{
			if(frm==0)
			{
				var currentValue=this.body(idx,frm);
			}else{
				var currentValue=(this.body(idx,frm)==this.body(idx,(frm-1)))?"-":this.body(idx,frm);
			}
			resultStream	+=(currentValue===0)?"X\t":currentValue+"\t";
		}
		resultStream	+=nas.GUI.LineFeed;
	}
	resultStream	+="[END]";
	resultStream	+=nas.GUI.LineFeed;
	resultStream	+="Convert from STS"
	return resultStream;
}
return mySTS.toSrcString();
}
//end converter

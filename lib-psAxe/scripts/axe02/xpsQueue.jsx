/*
	ｘｐｓからPsキューフレーム列を生成する関数
	
*/
var myXps=XPS;

var qFrames=new Array;//配列コレクション
//キューフレームオブジェクトコンストラクタ
QFrame=function(myIndex,myBody,myDuration)
{
	if(!(myBody instanceof Array)){myBody=[];}
	if(! myDuration){myDuration=1;}
//入力をフィルタしておく
	this.index=myIndex;//開始フレームindex
	this.orderingBody=myBody;//並び配列
	this.duration=myDuration;//継続時間（フレーム数）
	this.isSame=function (myTarget){
		//ターゲットオブジェクトとbody配列を比較するメンバ関数
		if((myTarget instanceof QFrame)&&(myTarget.orderingBody.length==this.orderingBody.length))
		{
			

for(var ix=0;ix<this.orderingBody.length;ix++){
				if(this.orderingBody[ix]!=myTarget.orderingBody[ix]){return false;}
			}
			return true;//ループを最後まで抜けるとtrue
		}else{
			return null;//比較要件を満たしていないのでnullを返す
		}
	}
}

//XPSからパース済みデータ列をレイヤの数だけ取得
var tempArray=new Array();
	for(var lix=0;lix<myXps.layers.length;lix++){
		tempArray[lix]=myXps.timeline(lix+1).parseTm();
	}

//XPSのフレームを順次検査してユニークなキューフレーム配列を形成する
var myQueue=new Array();
myQueue.toString=function(){
	var myResult="";
	for(var ix=0;ix<this.length;ix++){
		myResult+="["+ix+"]"+this[ix].index+"\t:"+this[ix].orderingBody.join(",")+":("+this[ix].duration+")\n";
	}
	return myResult;
}
var currentQF=null;
var previewQF=new QFrame(-1,new Array(),1);//要素０なので必ず判定に失敗する比較オブジェクト
for(var fidx=0;fidx<myXps.duration();fidx++){



	var myOrderingArray=new Array();
	for(var lix=0;lix<myXps.layers.length;lix++){myOrderingArray.push(tempArray[lix][fidx])};
	currentQF=new QFrame(fidx,myOrderingArray,1);
//	alert(previewQF.isSame(currentQF))
	if(previewQF.isSame(currentQF)){
		//同内容のエントリなので継続時間だけを加算して次へ
		myQueue[myQueue.length-1].duration++;
	}else{
		//新しいエントリなので時間を積算してキューに加える
		myQueue.push(currentQF);
		previewQF=currentQF;//比較用に保存
	}
}

//うーむ　「やっつけ」っぽい　2011 03 06

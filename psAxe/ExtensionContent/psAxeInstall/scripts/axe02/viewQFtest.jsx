/*
	ｘｐｓからPsキューフレーム列を生成する関数
	
*/

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

/*	以下QFrameオブジェクトで表示を制御する拡張メソッド
QFrame オブジェクトまたは表示配列を引数で与える

*/
function _setView(params){
	if(params instanceof QFrame){params=params.orderingBody}
	if(!(params instanceof Array)){params=[params]}
	var mx=this.layers.length
	for(var ix=0;ix<mx;ix++)
	{
				//alert(this.layers[mx-ix-1].viewQF+":::::  >")
		var elX=this.layers[mx-ix-1];
		var qX=params[ix%params.length];
		if(qX==0){
			elX.visible=false;//セット全体でカラ処理
			for(var qix=0;qix<elX.layers.length;qix++){elX.layers[qix].visible=false;}
		}else{
			elX.visible=true;
			var qmx=elX.layers.length
			for(var qix=0;qix<qmx;qix++)
			{
				var lidx=qmx-qix-1;
				elX.layers[lidx].visible=((qix+1)==qX)?true:false;//表示指定があれば表示
			}
		}
	}
}
//アクティブドキュメントに対して拡張　
app.activeDocument.setView=_setView;

//試験
var myQF=new QFrame(0,[1,2,3],1);
app.activeDocument.setView(myQF);



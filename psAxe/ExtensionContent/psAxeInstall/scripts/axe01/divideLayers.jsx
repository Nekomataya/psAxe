/*
	divideLayers.jsx
	レイヤ名をキーにしてレイヤを仕分けしたドキュメントを作成する
主な使用目的は、レイアウト・原画や動画等をそれぞれレイヤごとにレイヤセットに
分類されたドキュメントを作成するための作業補助スクリプトである。



*/
/*
			layerSort(レイヤコレクション[,並び順]);
	汎用レイヤソート関数
		指定されたレイヤコレクションをレイヤ名でソートする。
		引数にfalseを与えると、逆順ソートになる（アニメのセルでは逆順がスキなのでデフォルト）
		同名のレイヤがある場合は、警告を出して処理を続行。
		二つ目以降は処理対象にならずに下にたまって残る
		並び順オプションはtrue/falseで指定
		レイヤコレクションは、Layers,ArtLayers,LayerSets など
*/

layerSort= function(targetCol,revFlag){
//	並び替え対象を設定
	var myTarget=targetCol;
//	引数がレイヤコレクションでなかった場合、キャンセル
	if(!(targetCol instanceof Layers)){return false;};
//	引数なければ下から正順
	if(! revFlag) revFlag=false;//
//	並び替え対称のレイヤが1つしかない場合は、並び替え不能なのでキャンセル
	if(myTarget.length<=1){return false;};
//	ソート用配列を作る
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//レイヤが背景だったら無視
		}else{
			sortOrder.push(myTarget[idx].name);
		}
	}
//まず並び替える(この時点で下から正順)
		sortOrder.sort();
	if (revFlag){
//反転フラグあれば反転
		sortOrder.reverse();
	}
//並び替えた配列から同名レイヤのチェック
	for (idx=1;idx<sortOrder.length;idx++){
		if(sortOrder[idx-1]==sortOrder[idx]){
			alert("同名のレイヤがあります。\n二つ目以降のレイヤは並び替えの対象になりません。");
			break;
		}
	}
	for (idx=0;idx<sortOrder.length;idx++){
		myTarget.getByName(sortOrder[idx]).move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
	return sortOrder;
}
/*
		layerReverse(レイヤコレクション);
	レイヤ並び順反転サブプロシージャ
	レイヤの並び順を反転する。引数はレイヤコレクション(~.layers)
*/
layerReverse= function(targetCol){
//	並び替え対象を設定
	var myTarget=targetCol;
//	引数がレイヤコレクションでなかった場合、キャンセル
	if(!(targetCol instanceof Layers)){return false;};
//	並び替え対称のレイヤが1つしかない場合は、並び替え不能なのでキャンセル
	if(myTarget.length<=1){return false;};

//	ソート用配列を作る
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//レイヤが背景だったら無視
		}else{
//レイヤ自体を配列に格納
			sortOrder.push(myTarget[idx]);
		}
	}
//逆順で配置
	for (idx=0;idx<sortOrder.length;idx++){  
		sortOrder[idx].move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
	return;
}


/*
		reductString(対象文字列);
	文字列を解釈して要素分解する関数
	引数は文字列
	戻り値は、エレメントコレクション配列
	[[オリジナルのエレメント名,ステージ,グループラベル,エレメントID,修正記述子],[(同左)],[(同左)]…]
*/
reductString=function(myString){
	if(!myString){return false};
	var resultArray=new Array();

var stgRegex=new RegExp("^(cont|layout|rough|key|cell|コンテ|レイアウト|ラフ原|原画|一原|二原|セル)","i");
var lblRegex=new RegExp("^(BG|BOOK|SLIDE|PAN|T\\.U|T\\.B|Z\\.I|Z\\.O|L\/?O|背景|原図|ブック|[A-Z])","i");

var revRegex=new RegExp("(演出?|作監?|メカ?|エ(フェクト)?|監督?|カ(ブセ)?|修正?|\\*+)$");
//エレメントセパレータとして"/","_"を使用しているのでラベルとIDの間にこれらの文字がある場合はあらかじめ置換してからこのスクリプトに渡すこと

	if(myString.match(/(.+)\..+$/)){myString=RegExp.$1};//ファイル拡張子は捨てる
	if(myString.match(/^([^\/\_\ ]+)[\/\_\ ]([0-9]+)$/)){myString=RegExp.$1+"-"+RegExp.$2};//文字列全体が1ラベル＋数値だと思われる場合はラベルセパレータを削除
//引数文字列をエレメント配列に分割
	myElements=myString.replace(/\s*[\/\_]\s*/g,"/").split("/");
//各エレメントを解析
	for (var idx=0;idx<myElements.length;idx++){

		myPattern=myElements[idx].replace(/\ *[\-\ ]\ */g,"-").split("-");
		if(myPattern.length==4){
			//要素4の場合は、無条件で全指定とみなす
		}else{
			
		}
		switch (myPattern.length){
		case 4:;//要素数4なので全指定とみなしてマッピング
			myStgPrefix	=myPattern[0];
			myGrpLabel	=myPattern[1];
			myElmIndex	=myPattern[2];
			myRevPostfix	=myPattern[3];
		break;
		case 3:;//要素数3は、第一要素で判定 2分岐
			if(myPattern[0].match(stgRegex)){
				myStgPrefix	=myPattern[0];
				myGrpLabel	=myPattern[1];
				myElmIndex	=myPattern[2];
				myRevPostfix	="";
			}else{
				myStgPrefix	="";
				myGrpLabel	=myPattern[0];
				myElmIndex	=myPattern[1];
				myRevPostfix	=myPattern[2];
			}
		break;
		case 2:;//要素数2の場合は、ラベルとインデックスの対として処理
				myStgPrefix	="";
				myGrpLabel	=myPattern[0];
				myElmIndex	=myPattern[1];
				myRevPostfix	="";
		break;
		default:;//標準処理
			myTestStr=myElements[idx];
//	冒頭はステージ指定か?
	if(myTestStr.match(stgRegex)){
		myStgPrefix=RegExp.$1;
//						評価文字列更新
		myTestStr=myTestStr.replace(myStgPrefix,"");
	}else{
		myStgPrefix="";
	}
//	末尾に修正レベル指定があるか
	if(myTestStr.match(revRegex)){
		myRevPostfix=RegExp.$1;
//						評価文字列更新
		myTestStr=myTestStr.replace(myRevPrefix,"");
	}else{
		myRevPostfix="";
	}
//	ラベルマッチ？
	if(myTestStr.match(lblRegex)){
		myGrpLabel=RegExp.$1;
//						評価文字列更新
		myElmIndex=myTestStr.replace(myGrpLabel,"");
	}else{
		myGrpLabel="";
		myElmIndex=myTestStr;
	}
//評価後にグループラベルとインデックスに空文字列が現れた場合補完する
//空文字列は禁止
		if(myElmIndex==""){myElmIndex=myElements[idx];};
		if(myGrpLabel==""){myGrpLabel=myElmIndex;};
//フォーマット側でグループ内にエントリが1点のみの場合は、エレメントインデックスとグループ名を一致させる方向性をつける
//	------ 暫定版エレメント名評価
		break;
		}
				resultArray.push([myElements[idx],myStgPrefix,myGrpLabel,myElmIndex,myRevPostfix]);
	}

return resultArray;
}
/*
		classify(ターゲットレイヤトレーラ)
	ターゲットのレイヤトレーラを対象にレイヤを分類整理(仕分け)するナリよ
	引数は、レイヤトレーラ(layers をもつオブジェクト)
*/
classify=function(targetObject){
//	ターゲット内にアートレイヤが無い場合は処理中止
	if(targetObject.artLayers.length==0){return false;}
	var moveActions=new Array();
//		まず情報収集
	for (var idx=0;idx<targetObject.artLayers.length;idx++){
		//	名前を分解
			myElements=reductString(targetObject.artLayers[idx].name);
			for (var id=0;id<myElements.length;id++){
//			var newLayerName=myElements[id].join("-").replace(/^\-/,"").replace(/\-$/,"");
			var newLayerName=myElements[id][0];
//				moveActions.push([targetObject.artLayers[idx],myElements[id][2],myElements[id][3],id]);
				moveActions.push([targetObject.artLayers[idx],myElements[id][2],newLayerName,id]);
		//		処理スタックに[レイヤオブジェクト/ターゲットフォルダ名/新レイヤ名/アクションフラグ]で積む
			}
	}
//	alert(moveActions.toString());
//
	for (var idl=0;idl<moveActions.length;idl++){
		var targetLayer	=moveActions[idl][0];
		var dstFolderName	=moveActions[idl][1];
		var dstLayerName	=moveActions[idl][2];
		var actionFlag	=(moveActions[idl][3]==0)? true : false;
		var myDestFolder =new Object();
//	移動先フォルダを設定(getByNameでアクセスして失敗したら作成・設定する)これはCSでは動くが CS2以降ではダメ
//		try{myDestFolder=targetObject.layerSets.getByName(dstFolderName);}catch(e){myDestFolder=targetObject.layerSets.add(dstFolderName);}
//		dstFolderName=prompt("dstFolderName",dstFolderName);
var folderExists=false;
for(var ids=0;ids<targetObject.layerSets.length;ids++){
	if(dstFolderName==targetObject.layerSets[ids].name){folderExists=true;break;}
}
if(folderExists){
	myDestFolder=targetObject.layerSets.getByName(dstFolderName);
}else{
	myDestFolder=targetObject.layerSets.add();//新セット作って名前をつけないとダメっぽい
	myDestFolder.name=dstFolderName;//怒るよもう!
}
//	アクションフラグが0以外なら複製
//	0ならば、ターゲット自身を移動
//	dstLayerName=prompt(targetLayer.name + " to targetLayerName?",dstLayerName);
		if(! actionFlag){
			newLayer=targetLayer.duplicate(myDestFolder,ElementPlacement.INSIDE);
			newLayer.name=dstLayerName;
		}else{
			targetLayer.move(myDestFolder,ElementPlacement.INSIDE);
			targetLayer.name=dstLayerName;
		}

//	リネーム
	}
//フォルダ内をソート
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	layerSort(targetObject.layerSets[idf].layers);
}
//ターゲットをソート
	layerSort(targetObject.layers);
/* */
//背景レイヤを最も下へ
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/BG/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATEND);
	}
}
//ブックレイヤがあれば最も上へ
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/BOOK/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATBEGINNING);
	}
}
//レイアウトがあればさらに上へ
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/L\/?O|レイアウト/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATBEGINNING);
	}
}
//レイヤセットは通過ではなく通常にしておくこと?(スイッチつけよう)
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	targetObject.layerSets[idf].blendMode=BlendMode.NORMAL;
}
//終了
return true;
}
/*
レイヤコレクションのgetByNameは大変使いづらいので
自前の関数をつくっておくこと

*/
//逆順でコール
//var tgt=activeDocument.activeLayer.parent.layers;
//alert(layerSort(tgt,false).toString());

//	layerReverse(activeDocument.layers);
//	reductString(app.project.item(1).name).toSource();
// alert(reductString(activeDocument.activeLayer.name).toSource());
//	
//alert(activeDocument.name);
if(app.documents.length){
var myUndo="レイヤ仕分け";var myAction="classify(activeDocument.activeLayer.parent)";


if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
}


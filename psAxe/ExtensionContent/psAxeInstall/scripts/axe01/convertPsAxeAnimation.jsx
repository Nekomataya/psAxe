/*
	フレームアニメーションモードからタイムラインモードへの変換を行う
	2015.05.24 kiyo
	
*/
//Photoshop用ライブラリ読み込み
nas=app.nas;

//フレームアニメーションモードでない場合は全処理スキップ
var currentMode=nas.axeCMC.getAnimationMode();


main:if(currentMode=="frameAnimation"){
var abortProcess=false;//処理中断フラグ
//サブプロシジャ
/*getOpacityGrid(レイヤ)
引数:レイヤまたはレイヤの配列
戻値:配列分のデータマトリックス

	同時に多数のレイヤのパラメータを取得できること
	いったん取得した情報でキューを組んで一括して処理できること
	単一ターゲットでもあまり速度が低下しないように組むこと
	このルーチンが最も時間がかかるので要注意
	全スキャンと同様のグリッドを返すキースキャン版
	キーは不透明度を使用

*/
getOpacityGrid=function(myTargets){

// var C=new Date(); var startScan =C.getTime();//timecheck

	if(!(myTargets instanceof Array)){myTargets=[myTargets];};

	var myDuration=nas.axeVTC.getDuration();//var currentFrame=nas.axeVTC.getCurrentFrame();
	var myStack=new Array(myTargets.length);for(var idl=0;idl<myTargets.length;idl++){myStack[idl]=[];};

scan:	for(var idl=0;idl<myTargets.length;idl++){
		app.activeDocument.activeLayer=myTargets[idl];//レイヤ毎の処理　レイヤフォーカス
		//開始フレームへ移動
		nas.axeVTC.playheadMoveTo(0);//タイムライン自体が移動していることがあるが無視する
	//第一要素の値をとる
		var currentValue=null;var currentFrame=0;//初期値
		while(currentFrame!==false){
   	if (ScriptUI.environment.keyboardState.shiftKey){abortProcess=true;break scan;}

			currentValue=app.activeDocument.activeLayer.opacity;
			nextFrame=nas.axeVTC.playheadMoveToOpacityKey("nextKeyframe");
//alert(currentFrame+" to "+nextFrame +" value :"+currentValue);
			for(var ix=currentFrame;ix<nextFrame;ix++){myStack[idl].push(currentValue);}
			currentFrame=nextFrame;
		};
		currentValue=app.activeDocument.activeLayer.opacity;
		for(var ix=currentFrame;ix<myDuration;ix++){myStack[idl].push(currentValue);}
	}

	if(abortProcess){return false;};//スキャン中断

//レンジスタックがないので所得したグリッドデータから計算する
	var myRangeStack=[];//区間毎のdurationをスタックする配列
	var rangeID=0;//レンジID初期値
	    myRangeStack[rangeID]=1;//第一区間の初期化
	var prevStatus="";//最前のステータス
	var currentStatus="";//全レイヤ比較用status

	for(var ix=0;ix<myDuration;ix++){
		for(var idl=0;idl<myTargets.length;idl++){
		    currentStatus+=(myStack[idl][ix])?"1":"0";
		}
//レイヤステータスが異なっていたらレンジスタックに新規エントリを積む同じ値の場合はレンジ継続時間を加算
	if(ix==0){prevStatus=currentStatus;currentStatus="";continue;}
	if(prevStatus!==currentStatus){rangeID++;myRangeStack[rangeID]=1;prevStatus=currentStatus;}else{myRangeStack[rangeID]++;}
	currentStatus="";
	}
	//データマトリックスを手に入れた
	myStack.rangeStack=myRangeStack;
//timecheck 
//var C=new Date(); var endScan =C.getTime();
//alert((endScan-startScan)/1000+"sec:"+myTargets.length +"layers/"+myDuration+"frames");

	return myStack;
}


//kStackを入力してレイヤタイムラインを必要に従って分割し・長さを調整する
/*clopLayer(kStack,targetLayer)
引数:キースタック/配列 ターゲット/レイヤ
戻値:なし
  キー配列を渡して実際に継続時間に展開する
   ターゲットレイヤが与えられなかった場合は、アクティブレイヤを処理
   ターゲットレイヤがレイヤセットだった場合は、レイヤセット内のアートレイヤ全てをクロップ
   キースタック中に可視状態が2つ以上ある場合はレイヤを複製して各自に適用するレイヤ名は全てコピー
*/
clopLayer=function(kStack,targetLayer){
	if(! kStack){kStack=[[true]];kStack[0].frame=0;kStack.duration=nas.axeVTC.getDuration();}
	if(! targetLayer){targetLayer=app.activeDocument.activeLayer};
	
	app.activeDocument.activeLayer=targetLayer;
//処理をスタック
	var doStack=[];var Lcount=0;//処理スタック　レイヤカウント
	for (var ix=0 ;ix<kStack.length;ix++){
		nxFrame=((ix+1)>=kStack.length)? kStack.duration:kStack[ix+1].frame;
		if(kStack[ix][0]==true){
			doStack.push([kStack[ix].frame,nxFrame-kStack[ix].frame]);
			Lcount++;
		};
		//set [start,duration]
	}
//alert("doStack:"+doStack.length);
	var targetLayers=[app.activeDocument.activeLayer];//ターゲットスタック初期化・初期ターゲットセット
	if(Lcount>1){for (var dix=0;dix<Lcount;dix++){
		if(dix){
			var newLayer=app.activeDocument.activeLayer.duplicate();
			newLayer.name=targetLayer.name;
			targetLayers.push(newLayer);
			app.activeDocument.activeLayer=newLayer;
		}
	}}
	for (var dix=0;dix<Lcount;dix++){
		nas.axeVTC.playheadMoveTo(doStack[dix][0]);
//alert("playhead move To :"+ doStack[dix][0]+":"+doStack[dix][1]);
		if(targetLayers[dix] instanceof LayerSet){
			var mySetter=nas.axeCMC.getAllItems(targetLayers[dix].layers);
			for(var myIdx=0;myIdx<mySetter.length;myIdx++){
				if(mySetter[myIdx] instanceof ArtLayer){
					app.activeDocument.activeLayer=mySetter[myIdx];
					nas.axeCMC.execWithReference("timelineMoveLayerInPoint");
					//nas.axeVTC.moveInPoint();
					nas.axeVTC.setDuration(doStack[dix][1]);
				}
			}
		}else{
			app.activeDocument.activeLayer=targetLayers[dix];
			nas.axeCMC.execWithReference("timelineMoveLayerInPoint");
			//nas.axeVTC.moveInPoint();
			nas.axeVTC.setDuration(doStack[dix][1]);
		}
	}
}
//ドキュメント内のビデオグループを全て解除するサブプロシジャ
/*
トレーラ以下を再帰で検索してレイヤセットを全て取得
*/
function _getLayerGroups(myTarget){
	if(! myTarget){myTarget=app.activeDocument;}
var myLayerGroups=new Array;
//内包するレイヤセットを検査
	for (var ix=0;ix<myTarget.layerSets.length;ix++){
		myLayerGroups.push(myTarget.layerSets[ix]);
		if(myTarget.layerSets[ix].layerSets.length>0){
			myLayerGroups=myLayerGroups.concat(_getLayerGroups(myTarget.layerSets[ix]));
		}
	}
return myLayerGroups;
}
/*
ビデオグループを全て削除
*/
function _expandVideoGroups(myTarget){
	if(! myTarget){myTarget=app.activeDocument}
	var mySets=_getLayerGroups(myTarget);
	var myVideoGroups=[];
 if(mySets.length>0){
//	内包するレイヤセットを検査
//レイヤセットに内にレイヤが何もなければ悪さしないのでビデオグループの判定をパス
	for (var ix=0;ix<mySets.length;ix++){
		app.activeDocument.activeLayer=mySets[ix];
	  if(app.activeDocument.activeLayer.layers.length>0){
		if(nas.axeCMC._isVideoGroup()){myVideoGroups.push(mySets[ix]);}
	  }
	}
 }
//	ビデオグループが存在したら削除
 if(myVideoGroups.length>0){

//alert("check :"+app.activeDocument.activeLayer.name);
	for (var ix=0;ix<myVideoGroups.length;ix++){
		app.activeDocument.activeLayer=myVideoGroups[ix];
//alert("expand :"+ app.activeDocument.activeLayer.name);
// =========================ビデオグループのレイヤセット解除
var idungroupLayersEvent = stringIDToTypeID( "ungroupLayersEvent" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref.putEnumerated( idLyr, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
executeAction( idungroupLayersEvent, desc, DialogModes.NO );
	}
//ビデオグループ解除後は、レイヤが複数選択状態になっているのでそれを解除するためにフォーカスを再設定
	nas.axeCMC.focusTop();
 }
}

//=================================================================================================================
/*	実行条件
フレームアニメーションモードであること
処理可能なレイヤが存在すること
*/
//処理対象のレイヤをリストアップする
/*
	処理対象は
	第一階層レイヤセット内のアートレイヤ及びレイヤセット

	モード変換時にビデオグループが存在した場合は、継続時間が正常に処理されないので
	変換前に全て解除する
*/

	_expandVideoGroups();

var myTargets=[];

for(var sidx=0;sidx<app.activeDocument.layers.length;sidx++){
// /Frames/　が最上段にある場合はその内部レイヤは除く
	if((app.activeDocument.layers[sidx].name=="Frames")&&(sidx==0)){continue;};
//第一階層のアートレイヤは背景レイヤ以外を無条件で追加して後処理をスキップ
	if(app.activeDocument.layers[sidx] instanceof ArtLayer){
		if(!(app.activeDocument.layers[sidx].isBackgroundLayer)){myTargets.push(app.activeDocument.layers[sidx])};
		continue;
	};
//第一階層のレイヤセットは内包する要素を全てターゲットに追加する

	for(var ix=0;ix<app.activeDocument.layers[sidx].layers.length;ix++){
		myTargets.push(app.activeDocument.layers[sidx].layers[ix]);
	}
}

/*============================================================================================*/
//ターゲットに処理対象が残らなかった場合は終了
if(myTargets.length==0){
	alert("処理できるフレーム/レイヤがありません");
}else{

// alert(myTargets.length +":entryes")
//実際の処理
var currentFPS=nas.FRATE;//現作業のfpsを取得
//ビデオグループ解除後は解除されたグループ内の全てのレイヤがセレクトされているので、これを解除するためにレイヤを改めてセレクト

//app.activeDocument.activaLayer=app.activeDocument.artLayers[0];
//app.activeDocument.activaLayer=app.activeDocument.layers[0].artLayers[0];

//ビデオモードに変換
nas.axeCMC.execWithReference("convertAnimation");//システムによるコンバート(30fps固定)
//ビデオモードのフレームレートを設定(30fps)
nas.FRATE=nas.axeVTC.getFrameRate();
//処理時間警告
var ExProcessingTime= Math.floor(myTargets.length*(4.5)*0.02);
if(ExProcessingTime>60){abortProcess=(confirm("警告：\nデータスキャンの処理予想時間が"+Math.floor(ExProcessingTime/60)+"分以上です\n処理全体はそれ以上の時間がかかります\nスキャン中は[shift]キーで中断が可能です\n処理を続けますか？"))?false:true;}

if(abortProcess){alert("process aborted.");nas.axeCMC.undo();break main;}
//	データグリッド取得
	var myGrid=getOpacityGrid(myTargets);//配列で与えて一括処理する
//	alert(myGrid);
//	alert(myGrid.rangeStack);
	if(! myGrid){alert("process aborted.");nas.axeCMC.undo();}
//データグリッド取得後はコンバート先フレームレートに変換 

//変換後のタイムライン長を求める
	myGrid.convertedRange=[];
	myGrid.convertedFrames=0;
	for(var rix=0;rix<myGrid.rangeStack.length;rix++){
		var convertedValue=Math.round(myGrid.rangeStack[rix]*currentFPS/30);//
		myGrid.convertedFrames+=convertedValue;
		myGrid.convertedRange.push(convertedValue);
	}
	nas.axeVTC.setFrameRate(currentFPS);//フレームレート変更
	var extendedTimeline=false;
	if(myGrid.convertedFrames > nas.axeVTC.getDuration()){
		extendedTimeline=true;
		nas.axeVTC.playheadMoveTo(0);
		var myExtender=app.activeDocument.artLayers.add();//一時レイヤ追加
		myExtender.name=myGrid.convertedFrames+"frames";
		nas.axeVTC.setDuration(myGrid.convertedFrames);
	}
//alert(myGrid.convertedRange.join(":") +"\nall:" +myGrid.convertedFrames);
//alert("convert2 "+currentFPS+"/30");
//alert(nas.axeVTC.getFrameRate());
	//以降はレイヤごとの処理
	for(var tIdx=0;tIdx<myTargets.length;tIdx++){
		//レイヤごとに処置
	  var kStack=[];var currentValue=(myGrid[tIdx][0]==0)?false:true;var kidx=1;//キースタック初期化
	      kStack.duration=myGrid.convertedFrames;//durationを付ける
	    kStack.push([currentValue]);kStack[0].frame=0;//第一キーを作成（[値=bool].frame=フレーム）プロパティ付き配列
	if(myGrid[tIdx].length>1){
//要素数1以上だった場合のみ処理継続
//レンジスタックの回数で回す
	    var orgCurrentFrame=0;var newCurrentFrame=0;

	    for (var ridx=0;ridx<(myGrid.rangeStack.length-1);ridx++){
		orgCurrentFrame+=myGrid.rangeStack[ridx];
		newCurrentFrame+=myGrid.convertedRange[ridx];
	       	var dataValue=(myGrid[tIdx][orgCurrentFrame]==0)?false:true;
		if(dataValue!=currentValue){
		  kStack[kidx]=[dataValue];kStack[kidx].frame=newCurrentFrame;
		  kidx++;currentValue=dataValue;
		}
	    }
	}

//レイヤクロップ
		clopLayer(kStack,myTargets[tIdx]);
//システムコンバート時のopacityのキーを削除
app.activeDocument.activeLayer=myTargets[tIdx];
// ==================================================キーフレーム全選択
    var descSel = new ActionDescriptor();
      var refSel = new ActionReference();
        refSel.putEnumerated( stringIDToTypeID( "animationKey" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Al  " ) );
    descSel.putReference( charIDToTypeID( "null" ), refSel );
executeAction( charIDToTypeID( "slct" ), descSel, DialogModes.NO );
// =======================================================削除
    var descDel = new ActionDescriptor();
      var refDel = new ActionReference();
        refDel.putEnumerated( stringIDToTypeID( "animationKey" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    descDel.putReference( charIDToTypeID( "null" ), refDel );
executeAction( charIDToTypeID( "Dlt " ), descDel, DialogModes.NO );
//=========================opacity set 100%
myTargets[tIdx].opacity=100;
	};//レイヤ処理
//=========================
if(extendedTimeline){myExtender.remove();}
  };//myTarget>0
}else{
 switch(currentMode){
 case "timelineAnimation":;//シンプルにフレームアニメーションモードへ変換する
	//事前処理及び判定は保留 2015.05.21
		nas.axeCMC.execNoReference("convertTimeline");
 break;
 case "timelineAnimationNI":;//ビデオモードを初期化するために背景レイヤを通常レイヤにする
	if(app.activeDocument.layers[0].isBackgroundLayer)app.activeDocument.layers[0].isBackgroundLayer=false;
	//自動で30fpsに初期化されるためnas.FRATEと同期
	nas.axeVTC.setFrameRate();
	//初期レイヤ継続時間セット
	app.activeDocument.activeLayer=app.activeDocument.layers[0];
	nas.axeVTC.setDuration(nas.axe.skipFrames+1);
　break;
 case "NI":;//フレームアニメーションモードを初期化　psAxeだからフレームアニメだ！異議は認めません
	nas.axeCMC.execNoDescriptor("makeFrameAnimation");
 break;
//	alert(currentMode);
 }
}



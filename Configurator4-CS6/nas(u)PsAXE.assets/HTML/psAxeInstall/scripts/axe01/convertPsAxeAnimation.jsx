/*	フレームアニメーションモードからタイムラインモードへの変換を行う	2015.05.24 kiyo	06.06	フレーム静止画レイヤを変換エントリーに入れる		既存キー削除ルーチンをレイヤークロップに折込		既存キー値コンバート組み込み		*///Photoshop用ライブラリ読み込みif(typeof app.nas =="undefined"){   var myLibLoader=new File(Folder.userData.fullName+"/nas/lib/Photoshop_Startup.jsx");   $.evalFile(myLibLoader);}else{   nas=app.nas;}//フレームアニメーションモードでない場合は全処理スキップvar currentMode=nas.axeCMC.getAnimationMode();//ターゲットモードを判定var targetMode=""switch(currentMode){case "frameAnimation":targetMode="timelineAnimation";break;case "timelineAnimation":targetMode="frameAnimation";break;default:targetMode="InitAnimation";}	if(targetMode == "InitAnimation"){		initAnimationModes();	}else{/*モード変換時のモーダルパネル*/var　cAm=new Object;cAm.abortProcess=false;//処理中断フラグ/*	UI言語リソース	*/cAm.uiMsg=new Object;cAm.uiMsg.modeConvert	={en:"animation mode convert",ja:"アニメーションモード変換"};cAm.uiMsg.currentMode	={en:"current animation mode : ",ja:"現在のモード :"};cAm.uiMsg.converetTo	={en:"mode convert to : ",ja:"コンバート先 :"};cAm.uiMsg.startConvert	={en:"start convert OK ?( [shift] to abort )",ja:"コンバートを開始してよろしいですか ?( [shift]キーで中断 )"};cAm.uiMsg.abortConvert	={en:"convert aborted",ja:"コンバートを中断しました"};cAm.uiMsg.converting	={en:"...converting ( [shift] to abort )",ja:"...コンバート中 ( [shift]キーで中断 )"};cAm.uiMsg.allowDuplicate	={en:"allow duplicate of layers",ja:"レイヤの複製を許可"};cAm.uiMsg.useOpcityKey	={en:"use opacity keyframe all",ja:"全て不透明度キー変換"};//cAm.uiMsg.	={en:"",ja:""};cAm.uiMsg.convOptToVis	={en:"convert opacity to visivility",ja:"不透明度を表示状態に変換"};cAm.uiMsg.cantProcess	={en:"no frames/layers for prcess",ja:"処理できるフレーム/レイヤがありません"};cAm.uiMsg.warnTimeOver={	en:"Warning: I processing the expected time of the data scan %PARAM% minutes or more.\nThe entire process will take more time.\nIt can be interrupted with [shift] key during the scan.\nDo you want to continue the process?",	ja:"警告：\nデータスキャンの処理予想時間が %PARAM%分以上です\n処理全体はそれ以上の時間がかかります\nスキャン中は[shift]キーで中断が可能です\n処理を続けますか？"}cAm.processCount=0;	cAm.w=nas.GUI.newWindow("dialog",nas.localize(cAm.uiMsg.modeConvert),9,6,480,480);	cAm.msgCurrent=nas.GUI.addStaticText(cAm.w,nas.localize(cAm.uiMsg.currentMode)+currentMode,0,0,9,1);	cAm.msgTarget=nas.GUI.addStaticText(cAm.w,nas.localize(cAm.uiMsg.converetTo)+targetMode,0,1,9,1);if(targetMode=="timelineAnimation"){	cAm.chackAllowD=nas.GUI.addCheckBox(cAm.w,nas.localize(cAm.uiMsg.allowDuplicate),1,2,4,1);		cAm.chackAllowD.value=nas.axe.mcDuplicateLayers;		cAm.chackAllowD.onClick=function(){nas.axe.mcDuplicateLayers=this.value;}		cAm.checkOpck=nas.GUI.addCheckBox(cAm.w,nas.localize(cAm.uiMsg.useOpcityKey),5,2,4,1);		cAm.checkOpck.value=nas.axe.mcUseOpacityKeyAll;		cAm.checkOpck.onClick=function(){nas.axe.mcUseOpacityKeyAll=this.value;}}else{	cAm.convOpt=nas.GUI.addCheckBox(cAm.w,nas.localize(cAm.uiMsg.convOptToVis),1,2,8,1);		cAm.convOpt.value=nas.axe.mcOpt2Vis;		cAm.convOpt.onClick=function(){nas.axe.mcOpt2Vis=this.value;}}	cAm.msg=nas.GUI.addStaticText(cAm.w,nas.localize(cAm.uiMsg.startConvert),0,4,9,1);	cAm.msg.justify="right";//cAm.abortButton=nas.GUI.addButton(cAm.w,nas.localize(nas.uiMsg.Abort),3,5,2,1);cAm.abortButton.enabled=false;cAm.cancelButton=nas.GUI.addButton(cAm.w,"cancel",5,5,2,1);cAm.okButton=nas.GUI.addButton(cAm.w,"OK",7,5,2,1);/*	main		*///cAm.abortButton.onClick	=function(){cAm.abortProcess=true;}cAm.cancelButton.onClick	=function(){this.parent.close()};cAm.okButton.onClick	=function(){//	cAm.abortButton.enabled=true;//	cAm.msg.text=nas.localize(cAm.uiMsg.converting);//	alert();	doConvert();//	app.activeDocument.suspendHistory("convertAnimation","doConvert();");}cAm.w.show();	}function doConvert(){main:if(currentMode=="frameAnimation"){//サブプロシジャ/*getOpacityGrid(レイヤ)引数:レイヤまたはレイヤの配列戻値:配列分のデータマトリックス	同時に多数のレイヤのパラメータを取得できること	いったん取得した情報でキューを組んで一括して処理できること	単一ターゲットでもあまり速度が低下しないように組むこと	このルーチンが最も時間がかかるので要注意	全スキャンと同様のグリッドを返すキースキャン版	キーは不透明度を使用*/getOpacityGrid=function(myTargets){// var C=new Date(); var startScan =C.getTime();//timecheck	if(!(myTargets instanceof Array)){myTargets=[myTargets];};	var myDuration=nas.axeVTC.getDuration();//var currentFrame=nas.axeVTC.getCurrentFrame();	var myStack=new Array(myTargets.length);for(var idl=0;idl<myTargets.length;idl++){myStack[idl]=[];};scan:	for(var idl=0;idl<myTargets.length;idl++){		app.activeDocument.activeLayer=myTargets[idl];//レイヤ毎の処理　レイヤフォーカス		//開始フレームへ移動		nas.axeVTC.playheadMoveTo(0);//タイムライン自体が移動していることがあるが無視する	//第一要素の値をとる		var currentValue=null;var currentFrame=0;//初期値		while(currentFrame!==false){   	if (ScriptUI.environment.keyboardState.shiftKey){cAm.abortProcess=true;break scan;}			currentValue=app.activeDocument.activeLayer.opacity;			nextFrame=nas.axeVTC.playheadMoveToOpacityKey("nextKeyframe");//alert(currentFrame+" to "+nextFrame +" value :"+currentValue);			for(var ix=currentFrame;ix<nextFrame;ix++){myStack[idl].push(currentValue);}			currentFrame=nextFrame;		};		currentValue=app.activeDocument.activeLayer.opacity;		for(var ix=currentFrame;ix<myDuration;ix++){myStack[idl].push(currentValue);}	}	if(cAm.abortProcess){return false;};//スキャン中断//レンジスタックがないので所得したグリッドデータから計算する	var myRangeStack=[];//区間毎のdurationをスタックする配列	var rangeID=0;//レンジID初期値	    myRangeStack[rangeID]=1;//第一区間の初期化	var prevStatus="";//最前のステータス	var currentStatus="";//全レイヤ比較用status	for(var ix=0;ix<myDuration;ix++){		for(var idl=0;idl<myTargets.length;idl++){		    currentStatus+=(myStack[idl][ix])?"1":"0";		}//レイヤステータスが異なっていたらレンジスタックに新規エントリを積む同じ値の場合はレンジ継続時間を加算	if(ix==0){prevStatus=currentStatus;currentStatus="";continue;}	if(prevStatus!==currentStatus){rangeID++;myRangeStack[rangeID]=1;prevStatus=currentStatus;}else{myRangeStack[rangeID]++;}	currentStatus="";	}	//データマトリックスを手に入れた	myStack.rangeStack=myRangeStack;//timecheck //var C=new Date(); var endScan =C.getTime();//alert((endScan-startScan)/1000+"sec:"+myTargets.length +"layers/"+myDuration+"frames");	return myStack;}//kStackを入力してレイヤタイムラインを必要に従って分割し・長さを調整する/*cropTimeline(kStack,targetLayer)引数:キースタック/配列 ターゲット/レイヤ戻値:なし  キー配列を渡して実際に継続時間に展開する   ターゲットレイヤが与えられなかった場合は、アクティブレイヤを処理   ターゲットレイヤがレイヤセットだった場合は、レイヤセット内のアートレイヤ全てをクロップ   キースタック中に可視状態が2つ以上ある場合はレイヤを複製して各自に適用するレイヤ名は全てコピー   複製時にキーを削除して不透明度を100％リセットする*/cropTimeline=function(kStack,targetLayer){	if(! kStack){kStack=[[true]];kStack[0].frame=0;kStack.duration=nas.axeVTC.getDuration();}	if(! targetLayer){targetLayer=app.activeDocument.activeLayer};		app.activeDocument.activeLayer=targetLayer;//ターゲットをアクティブレイヤーに//処理をスタック	var doStack=[];var Lcount=0;//処理スタック　レイヤカウント	for (var ix=0 ;ix<kStack.length;ix++){		nxFrame=((ix+1)>=kStack.length)? kStack.duration:kStack[ix+1].frame;		if(kStack[ix][0]==true){			doStack.push([kStack[ix].frame,nxFrame-kStack[ix].frame]);			Lcount++;		};		//set [start,duration]	}//alert("doStack:"+doStack.length);	var targetLayers=[app.activeDocument.activeLayer];//ターゲットスタック初期化・初期ターゲットセット	if(Lcount>1){for (var dix=0;dix<Lcount;dix++){		if(dix){			var newLayer=app.activeDocument.activeLayer.duplicate();			newLayer.name=targetLayer.name;			targetLayers.push(newLayer);			app.activeDocument.activeLayer=newLayer;		}	}}crop:	for (var dix=0;dix<Lcount;dix++){   	    if (ScriptUI.environment.keyboardState.shiftKey){cAm.abortProcess=true;break crop;}		app.activeDocument.activeLayer=targetLayers[dix];//実処理ターゲットを設定//システムコンバート時のopacityのキーを削除//app.activeDocument.activeLayer=myTargets[tIdx];// ==================================================キーフレーム全選択    var descSel = new ActionDescriptor();      var refSel = new ActionReference();        refSel.putEnumerated( stringIDToTypeID( "animationKey" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Al  " ) );    descSel.putReference( charIDToTypeID( "null" ), refSel );executeAction( charIDToTypeID( "slct" ), descSel, DialogModes.NO );// =======================================================削除    var descDel = new ActionDescriptor();      var refDel = new ActionReference();        refDel.putEnumerated( stringIDToTypeID( "animationKey" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );    descDel.putReference( charIDToTypeID( "null" ), refDel );executeAction( charIDToTypeID( "Dlt " ), descDel, DialogModes.NO );//=========================opacity set 100%	app.activeDocument.activeLayer.opacity=100;//キースタックごとの開始点へ再生ヘッドを移動		nas.axeVTC.playheadMoveTo(doStack[dix][0]);//alert("playhead move To :"+ doStack[dix][0]+":"+doStack[dix][1]);		if(targetLayers[dix].typename =="LayerSet"){			var mySetter=nas.axeCMC.getAllItems(targetLayers[dix].layers);			for(var myIdx=0;myIdx<mySetter.length;myIdx++){				if(mySetter[myIdx].typename =="ArtLayer"){					app.activeDocument.activeLayer=mySetter[myIdx];//ターゲットレイヤセット内包レイヤ					nas.axeCMC.execWithReference("timelineMoveLayerInPoint");					//nas.axeVTC.moveInPoint();					nas.axeVTC.setDuration(doStack[dix][1]);				}			}		}else{//			app.activeDocument.activeLayer=targetLayers[dix];			nas.axeCMC.execWithReference("timelineMoveLayerInPoint");			//nas.axeVTC.moveInPoint();			nas.axeVTC.setDuration(doStack[dix][1]);		}	}}/*correctKey(kStack,targetLayer,extend)引数:キースタック/配列 ターゲット/レイヤ コンバート時継続時間延長/bool戻値:なし*/correctKey=function(kStack,targetLayer,extend){	if(! kStack){kStack=[[true]];kStack[0].frame=0;kStack.duration=nas.axeVTC.getDuration();}	if(! targetLayer){targetLayer=app.activeDocument.activeLayer};	app.activeDocument.activeLayer=targetLayer;//ターゲットをアクティブレイヤーに	nas.axeVTC.setDuration(kStack.duration);//タイムライン長調整	nas.axeVTC.playheadMoveTo(0);//	開始点へ再生ヘッドを移動	nas.axeVTC.switchKeyTrack("disable");//不透明度キー全削除	nas.axeVTC.switchKeyTrack("enable");	nas.axeVTC.switchKeyInterp("hold");	app.activeDocument.activeLayer.opacity=(kStack[0][0])?100:0;correct:	for (var ix=1 ;ix<kStack.length;ix++){   	    if (ScriptUI.environment.keyboardState.shiftKey){cAm.abortProcess=true;break correct;}		nas.axeVTC.playheadMoveTo(kStack[ix].frame);//指定位置へ移動		app.activeDocument.activeLayer.opacity=(kStack[ix][0])?100:0;		nas.axeVTC.selectAnimationKeyAt();//選択		nas.axeVTC.switchKeyInterp("hold");	}}/*トレーラ以下を再帰で検索してレイヤセットを全て取得*/function _getLayerGroups(myTarget){	if(! myTarget){myTarget=app.activeDocument;}var myLayerGroups=new Array;//内包するレイヤセットを検査	for (var ix=0;ix<myTarget.layerSets.length;ix++){		myLayerGroups.push(myTarget.layerSets[ix]);		if(myTarget.layerSets[ix].layerSets.length>0){			myLayerGroups=myLayerGroups.concat(_getLayerGroups(myTarget.layerSets[ix]));		}	}return myLayerGroups;}/*ビデオグループを全て削除//ドキュメント内のビデオグループを全て解除するサブプロシジャ*/function _expandVideoGroups(myTarget){	if(! myTarget){myTarget=app.activeDocument}	var mySets=_getLayerGroups(myTarget);	var myVideoGroups=[]; if(mySets.length>0){//	内包するレイヤセットを検査//レイヤセットに内にレイヤが何もなければ悪さしないのでビデオグループの判定をパス	for (var ix=0;ix<mySets.length;ix++){		app.activeDocument.activeLayer=mySets[ix];	  if(app.activeDocument.activeLayer.layers.length>0){		if(nas.axeCMC._isVideoGroup()){myVideoGroups.push(mySets[ix]);}	  }	} }//	ビデオグループが存在したら削除 if(myVideoGroups.length>0){//alert("check :"+app.activeDocument.activeLayer.name);	for (var ix=0;ix<myVideoGroups.length;ix++){		app.activeDocument.activeLayer=myVideoGroups[ix];//alert("expand :"+ app.activeDocument.activeLayer.name);// =========================ビデオグループのレイヤセット解除var idungroupLayersEvent = stringIDToTypeID( "ungroupLayersEvent" );    var desc = new ActionDescriptor();    var idnull = charIDToTypeID( "null" );        var ref = new ActionReference();        var idLyr = charIDToTypeID( "Lyr " );        var idOrdn = charIDToTypeID( "Ordn" );        var idTrgt = charIDToTypeID( "Trgt" );        ref.putEnumerated( idLyr, idOrdn, idTrgt );    desc.putReference( idnull, ref );executeAction( idungroupLayersEvent, desc, DialogModes.NO );	}//ビデオグループ解除後は、レイヤが複数選択状態になっているのでそれを解除するためにフォーカスを再設定	nas.axeCMC.focusTop(); }}//=================================================================================================================/*	実行条件フレームアニメーションモードであること処理可能なレイヤが存在すること*///処理対象のレイヤをリストアップする/*	処理対象は	第一階層レイヤセット内のアートレイヤ及びレイヤセット	モード変換時にビデオグループが存在した場合は、継続時間が正常に処理されないので	変換前に全て解除する*/	_expandVideoGroups();var myTargets=[];for(var sidx=0;sidx<app.activeDocument.layers.length;sidx++){// /Frames/　が最上段にある場合はその内部レイヤは除いてレイヤセットをエントリする	if((app.activeDocument.layers[sidx].name=="Frames")&&(sidx==0)){		myTargets.push(app.activeDocument.layers[sidx]);		continue;	};//第一階層のアートレイヤは背景レイヤ以外を無条件で追加して後処理をスキップ	if(app.activeDocument.layers[sidx] instanceof ArtLayer){		if(!(app.activeDocument.layers[sidx].isBackgroundLayer)){myTargets.push(app.activeDocument.layers[sidx])};		continue;	};//第一階層のレイヤセットは内包する要素を全てターゲットに追加する	for(var ix=0;ix<app.activeDocument.layers[sidx].layers.length;ix++){		myTargets.push(app.activeDocument.layers[sidx].layers[ix]);	}}/*============================================================================================*///ターゲットに処理対象が残らなかった場合は終了if(myTargets.length==0){	alert(nas.localize(cAm.uiMsg.cantProcess));}else{// alert(myTargets.length +":entryes")//実際の処理var currentFPS=nas.FRATE;//現作業のfpsを取得//ビデオグループ解除後は解除されたグループ内の全てのレイヤがセレクトされているので、これを解除するためにレイヤを改めてセレクト//app.activeDocument.activaLayer=app.activeDocument.artLayers[0];//app.activeDocument.activaLayer=app.activeDocument.layers[0].artLayers[0];//ビデオモードに変換nas.axeCMC.execWithReference("convertAnimation");//システムによるコンバート(30fps固定)	cAm.processCount++;//ビデオモードのフレームレートを設定(30fps)nas.FRATE=nas.axeVTC.getFrameRate();	cAm.processCount++;//処理時間警告var ExProcessingTime= Math.floor(myTargets.length*(4.5)*0.02);if(ExProcessingTime>60){cAm.abortProcess=(confirm(nas.localize(cAm.uiMsg.warnTimeOver).replace( /%PARAM%/ ,Math.floor(ExProcessingTime/60))))?false:true;}if(cAm.abortProcess){	alert(nas.localize(nas.uiMsg.aborted));	nas.axeCMC.undo(cAm.processCount);	break main ;}//	データグリッド取得	var myGrid=getOpacityGrid(myTargets);//配列で与えて一括処理する//	alert(myGrid);//	alert(myGrid.rangeStack);	if(! myGrid){alert(nas.localize(nas.uiMsg.aborted));nas.axeCMC.undo(cAm.processCount);}//データグリッド取得後はコンバート先フレームレートに変換 //変換後のタイムライン長を求める	myGrid.convertedRange=[];	myGrid.convertedFrames=0;	for(var rix=0;rix<myGrid.rangeStack.length;rix++){		var convertedValue=Math.round(myGrid.rangeStack[rix]*currentFPS/30);//		myGrid.convertedFrames+=convertedValue;		myGrid.convertedRange.push(convertedValue);	}	nas.axeVTC.setFrameRate(currentFPS);//フレームレート変更	var extendedTimeline=false;	if(myGrid.convertedFrames > nas.axeVTC.getDuration()){		extendedTimeline=true;		nas.axeVTC.playheadMoveTo(0);		var myExtender=app.activeDocument.artLayers.add();//一時レイヤ追加		myExtender.name=myGrid.convertedFrames+"frames";		nas.axeVTC.setDuration(myGrid.convertedFrames);	}//alert(myGrid.convertedRange.join(":") +"\nall:" +myGrid.convertedFrames);//alert("convert2 "+currentFPS+"/30");//alert(nas.axeVTC.getFrameRate());function mcTL2TL(){	//以降はレイヤごとの処理process:	for(var tIdx=0;tIdx<myTargets.length;tIdx++){if(cAm.abortProcess){break process;};//処理中断		//レイヤごとに処置	  var kStack=[];var currentValue=(myGrid[tIdx][0]==0)?false:true;var kidx=1;//キースタック初期化	  	kStack.displayCount=(currentValue)?1:0;//表示カウントをプロパティで	      kStack.duration=myGrid.convertedFrames;//durationを付ける	    kStack.push([currentValue]);kStack[0].frame=0;//第一キーを作成（[値=bool].frame=フレーム）プロパティ付き配列	if(myGrid[tIdx].length>1){//要素数1以上だった場合のみ処理継続//レンジスタックの回数で回す	    var orgCurrentFrame=0;var newCurrentFrame=0;	    for (var ridx=0;ridx<(myGrid.rangeStack.length-1);ridx++){		orgCurrentFrame+=myGrid.rangeStack[ridx];		newCurrentFrame+=myGrid.convertedRange[ridx];	       	var dataValue=(myGrid[tIdx][orgCurrentFrame]==0)?false:true;		if(dataValue!=currentValue){		  if(dataValue){kStack.displayCount++};//表示カウント加算		  kStack[kidx]=[dataValue];kStack[kidx].frame=newCurrentFrame;		  kidx++;currentValue=dataValue;		}	    }	}//動作オプションを確認/*cAm.checkOpck.checked/nas.axe.mcUseOpacityKeyAll:全てキーフレームで展開cAm.checkAllowD.checked/nas.axe.mcDuplicateLayers:レイヤ複製許可*/ if(nas.axe.mcUseOpacityKeyAll){     correctKey(kStack,myTargets[tIdx],extendedTimeline); }else{  if((kStack.displayCount>1)&&(!(nas.axe.mcDuplicateLayers))){//キー位置補正     correctKey(kStack,myTargets[tIdx],extendedTimeline);  }else{//レイヤクロップ     cropTimeline(kStack,myTargets[tIdx]);  } } 	};//レイヤ処理 }//レイヤ処理を一括コール	app.activeDocument.suspendHistory("reformatTimeline","mcTL2TL();");	cAm.processCount++;if(cAm.abortProcess){	nas.axeCMC.undo(cAm.processCount);	alert(nas.localize(cAm.uiMsg.abortConvert));};//中断処理//=========================:trimLayersif(extendedTimeline){myExtender.remove();}  };//myTarget>0}else{/*	タイムラインからフレームアニメーションモードへの変換	//事前処理及び判定は保留 2015.06.05	*///シンプルにフレームアニメーションモードへ変換する	nas.axeCMC.execNoReference("convertTimeline");	cAm.processCount++;//オプションがあれば、不透明度を表示オプションへ変換する	if(nas.axe.mcOpt2Vis){		var frameCounts=nas.axeAFC.countFrames();		var allItems=nas.axeCMC.getAllItems();function mcOpt2Vis(){		nas.axeAFC.selectFrame(1);//第一フレーム選択		nas.axeAFC.duplicateFrame();//複製//第一フレームを除外して操作optview:	　　for(var frmNo=frameCounts+1;frmNo>1;frmNo--){		nas.axeAFC.selectFrame(frmNo);//対象フレームへ移動		for(var ix=0;ix<allItems.length;ix++){	if (ScriptUI.environment.keyboardState.shiftKey){cAm.abortProcess=true;break optview;}			if(allItems[ix].typename == "ArtLayer"){		if((allItems[ix].opacity==0)&&(allItems[ix].visible==true)){//	alert("artLayer :"+allItems[ix].name+":"+allItems[ix].opacity+":"+allItems[ix].visible);			allItems[ix].opacity=100;			allItems[ix].visible=false;		}			}		}	    }		nas.axeAFC.selectFrame(1);//第一フレームへ移動		nas.axeAFC.removeSelection();//第一フレームへ移動}	app.activeDocument.suspendHistory("convertOpt2Vis","mcOpt2Vis();");	cAm.uiMsg.abortConvert++;	}	 if(cAm.abortProcess){	nas.axeCMC.undo(cAm.processCount);	alert(nas.localize(cAm.uiMsg.abortConvert)); }}cAm.w.close();}//function initAnimationModes(){ switch(currentMode){ case "timelineAnimationNI":;//ビデオモードを初期化するために背景レイヤを通常レイヤにする	if(app.activeDocument.layers[0].isBackgroundLayer)app.activeDocument.layers[0].isBackgroundLayer=false;	//自動で30fpsに初期化されるためnas.FRATEと同期	nas.axeVTC.setFrameRate();	//初期レイヤ継続時間セット	app.activeDocument.activeLayer=app.activeDocument.layers[0];	nas.axeVTC.setDuration(nas.axe.skipFrames+1);　break; case "NI":;//フレームアニメーションモードを初期化　psAxeだからフレームアニメだ！異議は認めません	nas.axeCMC.execNoDescriptor("makeFrameAnimation"); break;//	alert(currentMode); }}
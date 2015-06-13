/*
    exportLayersAsFile.jsx
    
    レイヤ状態を個別のファイルとして保存する。
    オプションでグループフォルダの作成を行う
    
手順としては、
	MAPビルドを行う
	ネームスペースをコレクションで作成する
	システムフォルダ以下のグループデータを順次表示するXPSを生成する。
	ビルドする
	フレームをレイヤに統合する
	レイヤを1点づつファイルにとって保存する。
	オリジナルドキュメントを保存せずに閉じる
というのが望ましいアプローチだけど、今回はやらない
コーディングに時間がかかる上に　動作速度が遅いのも保障付
マップビルドの省略プロセスでそのまま書き出しをかける。
-----------
レイヤ名からファイル名を作成するときにファイルシステムで禁止されている文字をトラップする
アニメビルド以外の最終操作は、ファイルの複製をとって書き出しを行う仕様に変更
20111203

オプションとして出力前にコマンド実行を可能にする。
スムージング等に必要なコマンドをoptCodeに置く（アクション実行　又はフィルタ実行コードなど）
不要な場合は　false を置いといてください
コードは保存の直前に実行されます。
20120416

CS6でアニメーションが初期化されていない状態が発生したのでその対応（エラー停止の回避）コードを算定的に追加
20120617
*/
var optCode=false;
/*
var optCode="";
// ======================================================= OLM Smoother
optCode+="var idFltr = charIDToTypeID( \"Fltr\" );";
optCode+="var desc4 = new ActionDescriptor();";
optCode+="var idUsng = charIDToTypeID( \"Usng\" );";
optCode+="desc4.putString( idUsng, \"OLM Smoother...\" );";
optCode+="executeAction( idFltr, desc4 );";

// ========================================アクション実行
var aSetName="animationTools";
var actionName="Smoother";

optCode+="var idPly = charIDToTypeID( \"Ply \" );";
optCode+="    var descAct = new ActionDescriptor();";
optCode+="    var idnull = charIDToTypeID( \"null\" );";
optCode+="        var refAct = new ActionReference();";
optCode+="        var idActn = charIDToTypeID( \"Actn\" );";
optCode+="        refAct.putName( idActn, actionName );";
optCode+="       var idASet = charIDToTypeID( \"ASet\" );";
optCode+="        refAct.putName( idASet, aSetName );";
optCode+="    descAct.putReference( idnull, refAct );";
optCode+="executeAction( idPly, descAct, DialogModes.NO );";
*/

//Photoshop用ライブラリ読み込み
	var nas=app.nas;
	var bootFlag=false;
	var nasLibFolderPath =Folder.nas.fullName+ "/lib/";
//+++++++++++++++++++++++++++++++++ここまで共用

var noSave=false;
//-----------------------操作開始時に未保存の場合警告
if((app.documents.length)&&(! app.activeDocument.saved)){
    noSave=true;
    noSave=confirm(nas.localize(nas.uiMsg.dm017));
   //017:"ドキュメントは保存されていません。保存しますか？"
//一度も保存されていないファイルに名前をつけて保存するルーチンが必要
//または明示的に保存されたファイルのみを扱うようにトラップする
    if(noSave){app.activeDocument.save();noSave=false;}
}
//-----------------------保存しなくても操作は続行
if((! noSave)&&(app.documents.length)&&(app.activeDocument.layers.length)){
var exportFiles=new Object;
 exportFiles.targetDoc=app.activeDocument;
try{
 exportFiles.currentTargetFolder=app.activeDocument.fullName.parent;
    }catch(eRR){
 exportFiles.currentTargetFolder=Folder.current;
    }
//操作用の一時ドキュメントを作っておく
 exportFiles.tempDoc=app.activeDocument.duplicate("__exportTempDoc__");//ここでアクティブドキュメントが切り替わる
 if(nas.axeAFC.checkAnimationMode()!="frameAnimation"){
	executeAction( stringIDToTypeID( "makeFrameAnimation" ), undefined, DialogModes.NO );
 };
 exportFiles.mkFolder=true;
 exportFiles.withRegister=true;
 exportFiles.byAFC=false;
 exportFiles.opForms=[".png",".psd",".tiff",".tga",".jpg"];
 exportFiles.opForm=0;
 exportFiles.guideLayers=[];
 exportFiles.guideLayersA=[];
 exportFiles.outputList=[];
 exportFiles.outputListA=[];
 exportFiles.outputListView=[];

exportFiles.isMenber=function(myObject){
    //引数判定してメンバ条件を判定
	if(( myObject.typename=="ArtLayer")&&
	    ((myObject.kind==LayerKind.NORMAL)||(myObject.kind==LayerKind.SMARTOBJECT))
    ){return true};
    return false;
}
exportFiles.refresh=function(){
//リセット時の再取得も含むので配列を初期化
	 this.guideLayers.length=0;this.outputList.length=0;
 for (var ix=0;ix<this.tempDoc.layers.length;ix++){
	if(this.tempDoc.layers[ix].name.match(/(frames?|peg|memo|system)/i)){
	 this.guideLayers.push(this.tempDoc.layers[ix]);
	 this.guideLayersA.push(this.targetDoc.layers[ix]);
	 continue;
	};//フレームレイヤ・レイヤセットをスキップ
//================ArtLayer　でノーマルとスマートオブジェクトを選択
	if(this.isMenber(this.tempDoc.layers[ix])){this.outputList.push(this.tempDoc.layers[ix]);this.outputListA.push(this.targetDoc.layers[ix]);continue;}
//=================レイヤセットでかつ、配下にレイヤを含んでいる場合（１段のみ掘下げ レイヤセットもメンバーにする）
	if((true)&&(this.tempDoc.layers[ix].typename == "LayerSet")&&(this.tempDoc.layers[ix].layers.length)){
		for (var lx=0;lx<this.tempDoc.layers[ix].layers.length;lx++){
            this.outputList.push(this.tempDoc.layers[ix].layers[lx]);
            this.outputListA.push(this.targetDoc.layers[ix].layers[lx]);
            continue;
		}
	}
 };//メンバ収集終了
//リストに登録
//	this.w.fileList.items
}
exportFiles.viewUpdate=function(){
    this.outputListView.length=0;
    if(this.byAFC){
        var myFrameCount=nas.axeAFC.countFrames();
        for(var fct=0;fct<myFrameCount;fct++){
//=============プレフィクスは、ターゲットから取得する
            this.outputListView.push(this.targetDoc.name.replace(/\.[^.]*$/,"")+nas.Zf(fct+1,3));
        }
    }else{
      for(fl in this.outputList){
	    if((! this.mkFolder)||(this.outputList[fl].parent.typename == "Document")){
		this.outputListView.push(this.outputList[fl].name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_"));
	    }else{
		this.outputListView.push(("[ "+this.outputList[fl].parent.name +" ] "+this.outputList[fl].name).replace(/[\\\/\:\?\*\"\>\<\|]/g,"_"));
	    }
      }
    }
}
//インデックスで与えられたレイヤを残して他を非表示にする。
//オプションでフレームを非表示
//アニメフレームビルドとセット対象が異なるので対応
 exportFiles.set=function(index){
	 for(var ix=0;ix<this.guideLayers.length;ix++){
	  this.guideLayers[ix].visible=(this.withRegister==false)?false:true;
	} 
	for(var ix=0;ix<this.outputList.length;ix++){
	 this.outputList[ix].visible=(index==ix)?true:false;
	}
 }
//アニメフレームビルド用のターゲット操作
 exportFiles.setA=function(index){
	 for(var ix=0;ix<this.guideLayers.length;ix++){
	  this.guideLayersA[ix].visible=(this.withRegister==false)?false:true;
	} 
	for(var ix=0;ix<this.outputList.length;ix++){
	 this.outputListA[ix].visible=(index==ix)?true:false;
	}
 }

	exportFiles.refresh();
	exportFiles.viewUpdate();

exportFiles.export=function(){
//
//
        var mySaveDocument=null;
        var myTargetFolder=this.currentTargetFolder;
        var mySaveOptions=null;
        switch(this.opForms[this.opForm]){
            case ".tiff":;
                mySaveOptions=new TiffSaveOptions;
            break;
            case ".tga":;
                mySaveOptions=new TargaSaveOptions;
                //mySaveOptions.
            break;
            case ".png":;
                mySaveOptions=new PNGSaveOptions;
		if(! isNaN(mySaveOptions.compression)){mySaveOptions.compression=1;}
            break;
            case ".jpg":;
                mySaveOptions=new JPEGSaveOptions;
            break;
            default:
                mySaveOptions=new PhotoshopSaveOptions;
        }
//=================================== 実際の操作 ======================================//
    var myTempDoc=this.tempDoc;//対象ドキュメントをターゲット本体に設定
	app.activeDocument=myTempDoc;
         if(this.byAFC){
//     var myFrameCount=nas.axeAFC.countFrames();
     var myFrameCount=this.outputList.length;
     for(var fidx=0;fidx<myFrameCount;fidx++){
       //アニメフレームを出力 現在のファイル名から拡張子をのぞいたものをプレフィックスにして指定フォルダ直下に保存
                 nas.axeAFC.selectFrame(fidx+1);//表示セット
                 var storeName=this.targetDoc.name.replace(/\.[^.]*$/,"")+nas.Zf(fidx+1,3)+this.opForms[this.opForm]
                 mySaveDocument=myTempDoc.duplicate (storeName, true)
         if(mySaveDocument){
             app.activeDocument=mySaveDocument;nas.axeAFC.initFrames();//アニメフレームを初期化
             mySaveDocument.layers[0].visible=true;//表示が消えるので復帰しておく             
             var mySaveFile=new File(myTargetFolder.fullName+"/"+mySaveDocument.name)
         //可能なら保存する
         try{
             mySaveDocument.saveAs(mySaveFile,mySaveOptions,true);
             }catch(eRR){alert(eRR)}
             mySaveDocument.close(SaveOptions.DONOTSAVECHANGES);//閉じる
             app.activeDocument =myTempDoc;
       }
   }
         }else{
    for(var fidx=0;fidx<this.outputList.length;fidx++){
       //レイヤをたどって指定に従ってガイドレイヤのあるなしを選択して出力
                if(this.mkFolder)
                {
                   var folderName=this.outputList[fidx].parent.name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_");
                   myTargetFolder=new Folder(this.currentTargetFolder.fullName+"/"+folderName);
                };
                if(! myTargetFolder.exists){myTargetFolder.create();}
                 this.set(fidx);//表示セット
                   var fileName=this.outputList[fidx].name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_");
                mySaveDocument=myTempDoc.duplicate (fileName+this.opForms[this.opForm], true);
         if(mySaveDocument){
/*
	単独ファイルとして保存するためにレイヤ統合を行う。
元のドキュメントにアニメフレームがあった場合（かなりの確率で有る）
psdドキュメントに存在しないレイヤを指すフレームやアニメサムネールのキャッシュがつくので何かと不都合である。
アニメフレームを削除するために初期化を行う。
単純な初期化では第一フレームの表状態が再生されるため、当該レイヤが非表示のまま保存される場合があるので再表示を行う。
*/
             app.activeDocument=mySaveDocument;nas.axeAFC.initFrames();//アニメフレームを初期化
             mySaveDocument.layers[0].visible=true;//表示が消えるので復帰しておく
	if(optCode){eval(optCode);};
             var mySaveFile=new File(myTargetFolder.fullName+"/"+mySaveDocument.name);
         //可能なら保存する
         try{
             mySaveDocument.saveAs(mySaveFile,mySaveOptions,true);
             }catch(eRR){alert(eRR)}
             mySaveDocument.close(SaveOptions.DONOTSAVECHANGES);//閉じる
             app.activeDocument =myTempDoc;
         }
    }
         }
//             myTempDoc.close(SaveOptions.DONOTSAVECHANGES);//一時ファイルなので保存せずに閉じる
/*
    テンポラリのとり方は一考
    編集後のデータ構造を移植可能なら実装することにして宿題 2011/09/28
    */
}
//==============================================UI
exportFiles.w=nas.GUI.newWindow("dialog",　nas.localize({en:"save layer as each file",ja:"レイヤをファイルとして保存"}),6,12);

exportFiles.w.msgBox=nas.GUI.addStaticText(exportFiles.w,nas.localize({
	en:"It will save the layer as each file.\nspecify a destination.",
	ja:"レイヤをファイルとして保存します。保存先を指定してください。"
}),0,0,6,1);


exportFiles.w.folderTargetName=nas.GUI.addEditText(exportFiles.w,exportFiles.currentTargetFolder.fsName,0,1,5,1);
exportFiles.w.chgFolder=nas.GUI.addButton(exportFiles.w,nas.localize(nas.uiMsg.Change),5,1,1,1);

exportFiles.w.fileList=nas.GUI.addListBoxO(exportFiles.w,exportFiles.outputListView,null,0,2,4,7,{multiselect:true});
//チェックコントロール
exportFiles.w.mkSF=nas.GUI.addCheckBox(exportFiles.w,nas.localize({en:"create a subfolder",ja:"サブフォルダを作る"}),0,9,4,1);
	exportFiles.w.mkSF.value=exportFiles.mkFolder;
exportFiles.w.regOpt=nas.GUI.addCheckBox(exportFiles.w,nas.localize({en:"View the peg and the frame",ja:"タップとフレームを表示する"}),0,10,4,1);
	exportFiles.w.regOpt.value=exportFiles.withRegister;
exportFiles.w.afcOpt=nas.GUI.addCheckBox(exportFiles.w,nas.localize({en:"Outputs animation-frame",ja:"アニメフレームを出力する"}),0,11,4,1);
	exportFiles.w.afcOpt.value=exportFiles.byAFC;
//ボタンコントロール
exportFiles.w.ffLb=nas.GUI.addStaticText(exportFiles.w,"file format:",4,2,2,1);
exportFiles.w.ffBt=nas.GUI.addDropDownList(exportFiles.w,exportFiles.opForms,exportFiles.opForm,4,3,2,1);
//exportFiles.w.FlBt=nas.GUI.addButton(exportFiles.w,"addFile",4,3,2,1);
exportFiles.w.rmBt=nas.GUI.addButton(exportFiles.w,"remove",4,4,2,1);
exportFiles.w.rstBt=nas.GUI.addButton(exportFiles.w,"reset",4,5,2,1);


exportFiles.w.bdBt=nas.GUI.addButton(exportFiles.w,"makeAnimation",4,9,2,1);
exportFiles.w.okBt=nas.GUI.addButton(exportFiles.w,"OK",4,10,2,1);
exportFiles.w.cnBt=nas.GUI.addButton(exportFiles.w,"cancel",4,11,2,1);
//==================================コントロールメソッド
//保存フォルダ変更
exportFiles.w.chgFolder.onClick=function(){
    var newFolder=exportFiles.currentTargetFolder.selectDlg("select Save folder");
    if(newFolder){
        exportFiles.currentTargetFolder=newFolder;
        this.parent.folderTargetName.text=exportFiles.currentTargetFolder.fsName;
    }
}
//リスト編集（削除）
exportFiles.w.rmBt.onClick=function(){
    //選択されたIDのレイヤを削除してアップデート
    if(this.parent.fileList.selection){
var removeItemList=new Array();
for(ecItem in this.parent.fileList.selection){removeItemList.push(this.parent.fileList.selection[ecItem].index);}
removeItemList.sort(function(a,b){return(b-a);});
    for(var itmId=0;itmId<removeItemList.length;itmId++){
        exportFiles.outputList.splice(removeItemList[itmId],1);
    }
	exportFiles.viewUpdate();
    this.parent.fileList.update();
    }
 }
//フォーマット選択
exportFiles.w.ffBt.onChange=function(){
    exportFiles.opForm=this.selection.index;
}
//リストをリセット
exportFiles.w.rstBt.onClick=function(){
	exportFiles.refresh();
	exportFiles.viewUpdate();
    this.parent.fileList.update();
}
//パラメータ変更
exportFiles.w.fileList.update=function(){
    this.removeAll();
    for(var lid=0;lid<exportFiles.outputListView.length;lid++){
        this.add("item",exportFiles.outputListView[lid]);
          //("text",exportFiles.outputView[lid]);
    }
}
exportFiles.w.mkSF.onClick=function(){
    exportFiles.mkFolder=this.value;
      exportFiles.viewUpdate();
      this.parent.fileList.update();//クリアして
      
}
//タップ出力オプション
exportFiles.w.regOpt.onClick=function(){
    exportFiles.withRegister=this.value;
}
//アニメフレーム出力オプション
exportFiles.w.afcOpt.onClick=function(){
      exportFiles.byAFC=this.value;
      if(this.value){
        this.parent.mkSF.enabled=false;
        this.parent.regOpt.enabled=false;
        this.parent.bdBt.enabled=false;
      }else{
        this.parent.mkSF.enabled=true;
        this.parent.regOpt.enabled=true;
        this.parent.bdBt.enabled=true;
      }
      exportFiles.viewUpdate();
      this.parent.fileList.update();//クリアして
}
//アニメフレームをビルドする
exportFiles.w.bdBt.onClick=function(){
　app.activeDocument=exportFiles.targetDoc;
 var UndoString=nas.localize({en:"layers to animation frames",ja:"レイヤからアニメフレーム"});
 var myExecute="nas.axeAFC.initFrames();for(var fix=0;fix<this.parent.fileList.items.length;fix++){if(fix>0){nas.axeAFC.duplicateFrame();}exportFiles.setA(fix);};nas.axeAFC.reverseAnimationFrames();";

 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory(UndoString,myExecute);
 }else{
     evel(myExecute);
 }

    exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    this.parent.close();
}

exportFiles.w.okBt.onClick=function(){
 var UndoString="output";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory(UndoString, "exportFiles.export();");
          // =================== UNDOバッファを使用して復帰
var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var id10 = charIDToTypeID( "HstS" );
        var id11 = charIDToTypeID( "Ordn" );
        var id12 = charIDToTypeID( "Prvs" );
        ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
executeAction( id8, desc5, DialogModes.NO );
 }else{
     evel("exportFiles.export();");
 }

    exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    this.parent.close();
}
//キャンセルして終了
exportFiles.w.cnBt.onClick=function(){
	exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
	this.parent.close();
}
//

exportFiles.w.show();

}

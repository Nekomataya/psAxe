/*(nas_psAxeLib.js)
	photoshop用アニメーション拡張ライブラリ Photo Shop Animation eXtEntion
	アイコンは斧だ！ ざっくり ばっさり行こう
	$Id: nas_psAxeLib.js,v 1.5 2015/05/06  kiyo Exp $
*/
nas.axe = new Object;//アニメ拡張オブジェクト AEのotome に相当するオブジェクト
var moduleName="psAxeLib"
var myFilename=("$RCSfile: nas_psAxeLib.js,v $").split(":")[1].split(",")[0];
var myFilerevision=("$Revision: 1.5 $").split(":")[1].split("$")[0];

	if(nas.Version)
	{	nas.Version[moduleName]=moduleName+" :"+myFilename+" :"+myFilerevision;};

//======================================== 斧とりつきプロパティ
/*
	システムオブジェクトに取り付いてイロイロ拡張プロパティを貼り付けます。
*/
//Folder.nas=(System.osName.match(/Windows/))?
//	new Folder(Folder.startup.fsName+"\\Scripts\\nas"):
//	new Folder(Folder.startup.fsName+"/Scripts/nas");
		Folder.nas=nas.baseLocation;
Folder.scripts=app.path+"/"+localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts");//この方法でローカライズパスが取得可能なはず OK?
/*	AE用コード
if(isWindows){
	if(app.version.split(".")[0]<7){
		Folder.scripts=Folder(Folder.startup.path.toString()+"/"+Folder.startup.name.toString()+"/Scripts")
	}else{
		Folder.appPackage.path+"/"+localize("$$$/ScriptingSupport/InstalledScripts=Support\ Files/Scripts");//WinAE7以降
	}
	File.currentApp=File(Folder.startup.path.toString()+"/AfterFX.exe");//Windows
}else{
	if(app.version.split(".")[0]<7){
		Folder.scripts=Folder(Folder.startup.parent.parent.parent.path.toString()+"/Scripts");
	}else{
		Folder.scripts=Folder(Folder.appPackage.path+"/"+localize("$$$/InstalledScripts=Scripts"));//MacAE7以降
//		Folder.scripts=Folder(Folder.appPackage.path.toString()+"/Scripts");//AE8
	}
	File.currentApp=File(Folder.startup.path.toString()+"/AfterFX");//MacOSX
}

*/
//AE用プロパティ AE/PS同時使用の際にバッティングするので、ダミーオブジェクトとして初期化する
//実際には使用されない AEサイドでも同様の処置が必要
	nas.expressions=false;
	nas.ftgFolders=false;

//Photoshop用作画プロパティ
	nas.axe.newLayerTpr=true;//新規レイヤの透過 有・無
	nas.axe.onsOpc=0.65;//オニオンスキンの標準不透過率
	nas.axe.lyBgColor=0;//選択色
	nas.axe.lyBgColors=[
		["透明"  ,[1.0,1.0,1.0,0.0]],
		["白"    ,[1.0,1.0,1.0,1.0]],
		["黄色"	 ,[1.0,1.0,0.8,1.0]],
		["ピンク",[1.0,0.9,0.9,1.0]],
		["あさぎ",[0.9,0.9,1.0,1.0]],
		["若草"  ,[0.9,1.0,0.9,1.0]],
	];
	nas.axe.ovlBgColor=0;//修正レイヤ背景色
	nas.axe.ovlBgColors=[
		["透明"  ,[1.0,1.0,1.0,0.0]],
		["白"    ,[1.0,1.0,1.0,1.0]],
		["黄色"	 ,[1.0,1.0,0.8,1.0]],
		["ピンク",[1.0,0.9,0.9,1.0]],
		["あさぎ",[0.9,0.9,1.0,1.0]],
		["若草"  ,[0.9,1.0,0.9,1.0]],
	];

//カラー配列 ["色名",[r,g,b,a]] float 背景色用の仮配列そのうちオブジェクトを作って交換

//	フレームアニメーションプレビュー操作プロパティ
	nas.axe.focusMove=true;//アニメウインドウのコマ送り時のフォーカス移動 有・無
	nas.axe.skipFrames=1;//タイムラインモードのヘッド移動スキップ量
	nas.axe.useOptkey=true;//タイムラインモードのヘッド移動に不透明度キーを使用・不使用
//	ドキュメントマネージャ関連
	nas.axe.dmDialog=true;//新規ファイルダイアログをカスタムするか否か
	nas.axe.dmCurrent=[0,0,0,0];//最後に操作したドキュメント情報[タイトルDBid,opusNo.,cutNo.,time]
    //ドキュメント・シート等の新規作成時に参照・更新する値
    	nas.axe.pegAlignment="N";//    タップ画像配置　N:上　S:下???? どう扱うか考えとく
    	nas.axe.pegBlend=true;//    タップ画像を差の絶対値にする
	nas.axe.frameOpc=true;//    フレーム画像を不透明度２０％にする
//================================================================以下は作業タイトルDB

//インポートフィルタ
	nas.importFilter = new RegExp(".*\.(mov|mpg|avi|tiff?|tga|psd|png|jpe?g|gif|sgi|eps)$","i");
//タイムシート判別フィルタ
	nas.xpSheetRegex = new RegExp(".*\.(xps|ard|tsh|sts)$","i");
//セルシーケンス判定(レイヤソース名に対して適用。 $1 がセルラベルになる)これはレイヤ名に対するフィルタ(またはシーケンス名)
	nas.cellRegex = new RegExp("[\-_\/\s0-9]?([^\-_\/\s\[]*)[\-_\/]?\[[0-9]+\-[0-9]+\]\.(tga|tiff?|png|gif|jpe?g|eps|sgi|bmp)$","i")
//背景・下絵判定
	nas.bgRegex=new RegExp("(bg|back|背景?|下絵?)","i");
//レイアウト、参照画
	nas.mgRegex=new RegExp("book|fg|mid|mg|fore|fg|[前中]景?|[中上]絵","i");
	nas.loRegex=new RegExp("lo|cf|z\.[io]|t\.?[ub]|sl(ide)?|cam(era)?|fr(ame)?|pan|mill?|(キャ|カ)メラ|フレーム|引き|ヒキ|スライド|組|クミ|くみ","i");

//	作画フレームDB
//	PegBarDB(ダミー)
//	"識別名",[[配置座標],テンプレート画像パス,ポイント数,]
/*
	作画用紙DB

*/
	nas.paperSizes=new nTable();
		nas.paperSizes.onChange=function(){
		}

			nas.paperSizes.push("A4横(297x210)",[297,210]);
			nas.paperSizes.push("A3横(420x297)",[420,297]);
			nas.paperSizes.push("A3縦(297x420)",[297,420]);
			nas.paperSizes.push("B4横(353x250)",[353,250]);
			nas.paperSizes.push("B3横(500x353)",[500,353]);
			nas.paperSizes.push("OLD-STD(268x244)",[268,244]);
			nas.paperSizes.push("OLD-横x2(536x244)",[536,244]);
			nas.paperSizes.push("OLD-縦x2(268x488)",[268,488]);

/*
	作画用レジスターマークDB
	実際の描画はテンプレート画像を配置して行うので、対照に注意 テンプレート画像の配置は現在システム固定で lib/resource/Pegs/
	各レジスタの原点は画像中央なのでテンプレート画像を作成する場合はその点に注意

*/
	nas.registerMarks=new nTable();
		nas.registerMarks.onChange=function(){
		}

			nas.registerMarks.push("3穴トンボ",["peg3p1.eps"]);//0
			nas.registerMarks.push("3穴白抜き",["peg3p2.eps"]);//1
			nas.registerMarks.push("3穴ベタ",["peg3p3.eps"]);//2
			nas.registerMarks.push("3穴外黒",["peg3p4.eps"]);//2
			nas.registerMarks.push("2穴トンボ",["peg2p1.eps"]);//3
			nas.registerMarks.push("2穴白抜き",["peg2p2.eps"]);//4
			nas.registerMarks.push("2穴ベタ",["peg2p3.eps"]);//5

//	作画(ソース)データの標準フレーム
//  "識別名",[横幅(mm),フレーム縦横比(文字列),基準解像度(dpi),フレームレート(,PegID,[配置座標])]
/*
	入力メディアDBの本質は作画情報
	何センチのフレームに対してどのくらいの解像度で処理を行なうかが情報のポイント
	ピクセルアスペクトは入力ファイルごとにことなる可能性があるのでDB上では標準値を1と置き、
	フッテージに記録のない場合のみ仮の値として使用する
	オプション情報追加
	標準的なタップの種別を記録する。タップの配置は座標と回転角を記録
	配置座標 [X,Y,R]　X,Yはフレーム中心からのタップの位置　Rは360度法によるタップの向き
	下タップの場合は、Y座標がマイナスの値となる　配置オプションが加わった場合は値を反転させる？
	ちと考えとく
*/

	nas.inputMedias=new nTable();
		nas.inputMedias.onChange=function(){
			//メディアがセレクトされたらシステムの解像度とフレームレートを変更する
			if(nas.LENGTH!=this.selectedRecord[1]){nas.LENGTH=this.selectedRecord[1]}
			if(nas.ASPECT!=this.selectedRecord[2]){nas.ASPECT=this.selectedRecord[2]}
			var myDPC=this.selectedRecord[3]/ 2.540;//解像度をDPCに変換
			if(nas.RESOLUTION!=myDPC){nas.RESOLUTION=myDPC}
			if(nas.FRATE!=this.selectedRecord[4]){nas.FRATE=this.selectedRecord[4]};

			nas.registerMarks.select(this.selectedRecord[5]);
			}

			nas.inputMedias.push("254mm/16:9/200dpi",[254,"16/9",200,24,2,0,105,0]);//(AJA)index=0
			nas.inputMedias.push("225mm/4:3/144dpi",[225,"4/3",144,24,2,0,115,0]);//(NA) index 1 以下順に増加
			nas.inputMedias.push("240mm/4:3/150dpi",[240,"4/3",150,24,2,0,120,0]);//(I.G)
			nas.inputMedias.push("265mm/16:9/144dpi",[265,"16/9",144,24,2,0,105,0]);//max
			nas.inputMedias.push("240mm/16:9/150dpi",[240,"16/9",150,34,2,0,105,0]);//
			nas.inputMedias.push("203mm/16:9/200dpi",[203,"16/9",200,24,2,0,105,0]);//pocopoco
			nas.inputMedias.push("260mm/16:9/200dpi",[260,"16/9",200,24,2,0,105,0]);//
			nas.inputMedias.push("260mm/16:9/150dpi",[260,"16/9",150,24,2,0,105,0]);//
			nas.inputMedias.push("303mm/16:9/150dpi",[303,"16/9",150,24,2,0,120,0]);//(I.G large)
			nas.inputMedias.push("305mm/16:9/300dpi",[305,"16/9",300,24,2,0,120,0]);//(12in 120mm)

//	出力メディアDB(ダミー)
//	"識別名",[横幅(px),ライン数,ピクセルアスペクト,フレームレート]
/*
	出力メディアDBの本質はムービー情報
	どのメディアに対して処理を行なうかが情報のポイント
	ピクセルアスペクトはメディア限定なので標準値を指定する
	逆に線密度には意味がなくなるので記載がない
*/
	nas.outputMedias=new nTable();
		nas.outputMedias.onChange=function(){
			
			if(nas.COMP_W!=this.selectedRecord[1]){nas.COMP_W=this.selectedRecord[1]}
			if(nas.COMP_H!=this.selectedRecord[2]){nas.COMP_H=this.selectedRecord[2]}
			if(nas.COMP_A!=this.selectedRecord[3]){nas.COMP_A=this.selectedRecord[3]}
//			if(nas.FRATE!=this.selectedRecord[4]){nas.FRATE=this.selectedRecord[4]};//出力は一般系を切り替えない
		}

			nas.outputMedias.push("wideSD/24p",[950,540,1,24]);
			nas.outputMedias.push("DV",[720,480,0.9,29.97]);
			nas.outputMedias.push("DV(wide)",[720,480,1.2,29.97]);
			nas.outputMedias.push("HD720/24p",[1280,720,1,24]);
			nas.outputMedias.push("HD1080/24p",[1920,1080,1,24]);
			nas.outputMedias.push("SD486/24p",[720,486,0.9,24]);
			nas.outputMedias.push("SD540/24p",[720,540,1,24]);
			nas.outputMedias.push("SD486",[720,486,0.9,29.97]);
			nas.outputMedias.push("SD540",[720,540,1,29.97]);
			nas.outputMedias.push("VGA/24p",[640,480,1,24]);
			nas.outputMedias.push("VGA/30p",[640,480,1,30]);

//	作業タイトルDB(ダミー) 
//WorkTitleDBは共用（環境非依存ライブラリ）側に
	nas.workTitles=new nTable();

			nas.workTitles.push("タイトル",["略称","記号",0,3]);
			nas.workTitles.push("ぽこあぽこ・られんたんど",["poco","PP",5,3]);
			nas.workTitles.push("かちかち山",["KachiKachi","KT",1,4]);
			nas.workTitles.push("かちかち山Max",["KachiMax","ktM",2,5]);

			nas.workTitles.onChange=function(){
				nas.inputMedias.select(this.selectedRecord[3]);
				nas.outputMedias.select(this.selectedRecord[4]);
			}
//タイトルデータベース初期化（仮）
			nas.workTitles.select(0);
			nas.inputMedias.select(nas.workTitles.selectedRecord[3]);
			nas.registerMarks.select(nas.inputMedias.selectedRecord[5]);
			nas.outputMedias.select(nas.workTitles.selectedRecord[4]);
			nas.paperSizes.select(0);//A4用紙を選択しておく

//セレクトメソッドで選択
/*			上記のDBは最後に登録したものがカレントになっています。
	自分の必要なものを追加してご使用ください
*/

//以下拡張メソッド アニメーションフレーム操作関数などが多い トレーラは nas.axeAFC
	nas.axeAFC=new Object;
/*
	psAnimationFrameClass.jsxの関数はラッパに変更 後でコードをはずしてゆくよ2011.08.20
	
Phostoshop CS2以降のフレームアニメーションを操作するオブジェクト

*/
//アニメウインドウ操作関数 現状取得ができないのはヘボいが今のトコはカンベン 後で整理する
/*
	復帰は不要でトレーラー内部の表示状態だけセットするスクリプトをまず作る
	フレームは初期化！
	nas.axeAFC.setDly(myTime)
		フレームにディレイを設定する 継続時間とほぼ同一だが最短時間は保証されない
	nas.axeAFC.duplicateFrame()
		カレントフレームを複製する
	nas.axeAFC.selectFrame(index)
		フレームを選択する Indexは整数（1オリジン）単独選択でカレントが移動
	nas.axeAFC.selectFramesAll()
		全フレーム選択
	nas.axeAFC.removeSlection()
		選択フレームを削除 ただし全削除を行なっても仕様上フレームカウントが0にはならない。必ずフレームID-0が残る
	nas.axeAFC.activateFrame(kwd)
		カレントフレームを移動する kwd = Nxt ,Prvs,Frst (各4bite)
	nas.axeAFC.goFrame(kwd)
		アニメーションフレームを移動 kwd = n,p,f,e　フォーカス移動あり。
	nas.axeAFC.countFrames()
		アニメーフレームの現在の数をカウントする。ひどく裏技だけどまあ、使えるからヨシ
*/
// ======================================================= 選択フレームの遅延を設定
nas.axeAFC.setDly=function(myTime){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
        var descT = new ActionDescriptor();
        descT.putDouble( stringIDToTypeID( "animationFrameDelay" ), myTime );
    desc.putObject( charIDToTypeID( "T   " ), stringIDToTypeID( "animationFrameClass" ), descT );
executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );
}
// =======================================================選択フレーム複製
nas.axeAFC.dupulicateFrame=function(){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
return executeAction( charIDToTypeID( "Dplc" ), desc, DialogModes.NO );
}
// =======================================================フレーム選択
nas.axeAFC.selectFrame=function(idx){
    var desc = new ActionDescriptor();
        var ref = new ActionReference(); 
        ref.putIndex( stringIDToTypeID( "animationFrameClass" ), idx );
    desc.putReference( charIDToTypeID( "null" ), ref );
var M=executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
return M;
}
// =======================================================フレーム全選択
nas.axeAFC.selectFramesAll=function(){
    var desc = new ActionDescriptor();
return executeAction( stringIDToTypeID( "animationSelectAll" ), desc, DialogModes.NO );
}
// =======================================================選択フレーム削除
nas.axeAFC.removeSelection=function(){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( charIDToTypeID( "Dlt " ), desc, DialogModes.NO );
}
// =======================================================アニメーションフレーム順反転
nas.axeAFC.reverseAnimationFrames=function(){
 var desc = new ActionDescriptor();
 var ref = new ActionReference();
 ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
 desc.putReference( charIDToTypeID( "null" ), ref );
return  executeAction( charIDToTypeID( "Rvrs" ), desc, DialogModes.NO );
}
//===================== 操作関数 アニメフレーム移動(フォーカス移動なし)
// =======================================================アニメーションフレームをアクティブに
//（正逆順送り）セレクトとアクティブが別概念のようなので注意だ　'End 'はバージョンによる？
nas.axeAFC.activateFrame=function(kwd){
//kwd = Nxt ,End ,Prvs,Frst(各４バイト)
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( kwd ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
return executeAction( stringIDToTypeID( "animationFrameActivate" ), desc, DialogModes.NO );
}
// =======================================================フレームをレイヤに変換
nas.axeAFC.convertFrs2Lyrs=function(){
return executeAction(
	stringIDToTypeID( "animationFramesToLayers" ),
	new ActionDescriptor(),
	DialogModes.NO
);
}

// ======================================================= アニメフレームの数をカウントする

nas.axeAFC.countFrames=function(){
//================== rootトレーラーのレイヤ数を控える
var currentLayerCounts=app.activeDocument.layers.length;
app.activeDocument.activeLayer.name=app.activeDocument.activeLayer.name;
executeAction(
	stringIDToTypeID( "animationFramesToLayers" ),
	new ActionDescriptor(),
	DialogModes.NO
);//外部関数にして呼び出しすると妙に遅いので注意だ
//差分を取得してフレーム数を取得
var myFrameCounts = app.activeDocument.layers.length-currentLayerCounts;
// =================== UNDOバッファを使用して復帰
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
       ref.putEnumerated( charIDToTypeID( "HstS" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Prvs" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );

return myFrameCounts;
}
//======================================アニメーションフレームをクリア（初期化）
nas.axeAFC.initFrames=function(){
  var desc = new ActionDescriptor();
    var ref = new ActionReference();
     ref.putEnumerated( stringIDToTypeID( "animationClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
   desc.putReference( charIDToTypeID( "null" ), ref );
 executeAction( charIDToTypeID( "Dlt " ), desc, DialogModes.NO );
}
//===================================animationNewLayerPerFrame
nas.axeAFC.chgModeNLPF=function(){
 var desc = new ActionDescriptor();
   var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID( "Mn  " ), charIDToTypeID( "MnIt" ), stringIDToTypeID( "animationNewLayerPerFrame" ) );
   desc.putReference( charIDToTypeID( "null" ), ref );
 executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
}
//====================== goFrame(kwd) 移動ラッパー 引数は "f","p","n","e" いずれか
//レイヤフォーカス移動つき
nas.axeAFC.goFrame=function(kwd){
 switch (kwd){
 case	"f":this.activateFrame("Frst");break;
 case	"p":this.activateFrame("Prvs");break;
 case	"n":this.activateFrame("Nxt ");break;
 case	"e":this.activateFrame("Frst");this.activateFrame("Prvs");break;
 }
 if(nas.axe.focusMove){this.focusTop();}
}
//====

//axeCMC CommonManipulatorClass　Photoshopの操作系全般を格納するオブジェクト
	nas.axeCMC=new Object();
/*
: nas.axeCMC.execWithReference(commandStringID:String) 抽象化コマンドを実行
: nas.axeCMC.execNoReference(commandStringID:String) 抽象化コマンドを実行
: nas.axeCMC.execNoDescriptor(commandStringID:String) 抽象化コマンドを実行
: nas.axeCMC.getAnimationMode() アニメーションモード取得
: nas.axeCMC.getSelectedItemId() 選択されているアイテムをIDの配列で取得
: nas.axeCMC.getItemById(idx) アイテムIDを指定してオブジェクトを取得
: nas.axeCMC.getItemsById(idx) アイテムIDを指定してオブジェクト配列を取得
: nas.axeCMC.getItemByLid(idx,myTrailer) レイヤIDを指定してオブジェクトを指定
: nas.axeCMC.getAllItems(myTrailer) トレーラー配下の全アイテムを配列で取得
: nas.axeCMC.selectItemsById(idie:Array) アイテムIDを指定して選択
: nas.axeCMC.undo() undo
: nas.axeCMC.evalA(undoString,codeChip) undoグループでコード片を実行
: nas.axeCMC._isBlocked() レイヤが操作可能か判定
: nas.axeCMC._isVideoGroup() ビデオグループ判定
: nas.axeCMC.focusTop() アクティブなレイヤセット内で最も表示順位の高いレイヤをアクティブにする
: nas.axeCMC.placeEps() ファイルを指定してスマートオブジェクトとして配置する
*/
/*
nas.axeCMC.execWithReference(commandStringID:String)
引数:StringIDで抽象化されたコマンドを実行する
戻値:アクションディスクリプタ/null　またはエラーイベント

実行可能コマンドは以下のとおり(多分以降増加あり)
//タイムラインアニメーション
timelineGoToFirstFrame	最初のフレームへ
timelineGoToLastFrame	最後のフレームへ
timelineGoToPreviousFrame	前のフレームへ
timelineGoToNextFrame	次のフレームへ
timelineGoToTime	時間指定パネル
timelineSetStartOfWorkArea	ワークエリアの開始点に設定
timelineSetEndOfWorkArea	ワークエリアの終点に設定
timelineGoToWorkAreaStart	ワークエリアの開始点へ移動
timelineGoToWorkAreaEnd	ワークエリアの終点へ移動
timelineLiftWorkArea	ワークエリアをリフト
timelineExtractWorkArea	ワークエリアを抽出（すっこ抜くとか引っこ抜くとか削除の方が適切）
timelineTrimLayerStart	開始点にトリミング
timelineTrimLayerEnd	終了点にトリミング
timelineMoveLayerInPoint	IN点に移動
timelineMoveLayerEndPoint	OUT点に移動
timelineSplitLayer	レイヤ分割
timelineShowAllLayers	全レイヤを表示
timelineShowFavoriteLayers	お気に入りのレイヤのみ表示
timelineShowSetFavoriteLayers	お気に入りのレイヤに設定
timelineOnionSkinSettings	オニオンスキン設定
timelineEnableOnionSkins	オニオンスキン表示
timelinePaletteOptions	パネルオプション
timelineEnableShortcutKeys	タイムラインショートカットキーを使う
timelineDocumentSettings	タイムラインのフレームレートを設定

//フレームアニメーション
animationShowNewLayersInFrames	全てのフレームで新規レイヤを表示
animationNewLayerPerFrame	新規フレームごとにレイヤを作成
animationGoToFirstFrame	最初のフレームへ
animationGoToLastFrame	最後のフレームへ
animationGoToPreviousFrame	前のフレームへ
animationGoToNextFrame	次のフレームへ
convertAnimation	タイムラインへコンバート
animationPanelOptions	パネルオプション
animationSelectAll	全てのフレームを選択
*/

nas.axeCMC.execWithReference=function(myStringID){
  try {   
    var desc = new ActionDescriptor();    var ref = new ActionReference();                 
    
    ref.putEnumerated( charIDToTypeID( 'Mn  ' ), charIDToTypeID( 'MnIt' ), stringIDToTypeID( myStringID) );     
    desc.putReference( charIDToTypeID( 'null' ), ref ); 
    return executeAction( charIDToTypeID( 'slct' ), desc, DialogModes.NO );
  }catch(e){return e}
}

/*nas.axeCMC.execWithDescriptor(myStringID)
引数:抽象化コマンド
戻値:ディスクリプタ

//レイヤ操作系
ungroupLayersEvent	レイヤグループ解除

*/
nas.axeCMC.execWithDescriptor=function(myStringID){
    var desc = new ActionDescriptor();var ref = new ActionReference();

        ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ));
    desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( stringIDToTypeID( myStringID ), desc, DialogModes.NO );
}
/*nas.axeCMC.execNoReference(myStringID)
引数:コマンド文字列
戻値:ディスクリプタ

//タイムラインアニメーション
splitVideoLayer	再生ヘッドで分割
moveInTime	再生ヘッドを開始点としてトリミング
moveOutTime	再生ヘッドを終了点としてトリミング
makeFramesFromLayers	クリップからフレームを作成（ヘッド位置で１フレームにする）
makeLayersFromFrames	フレームをクリップに統合（）
convertTimeline	フレームアニメーションに変換
extractWorkArea	ワークエリアを抽出
liftWorkArea	ワークエリアをリフト
copyKeyframes	キーフレーム複製
pasteKeyframes	キーフレームペースト
splitVideoLayer	レイヤをスプリット

*/
nas.axeCMC.execNoReference=function(myStringID){
  try {
    var desc = new ActionDescriptor();
	if(myStringID.length==4){
    return executeAction( charIDToTypeID( myStringID ), desc, DialogModes.NO );
	}else{
    return executeAction( stringIDToTypeID( myStringID ), desc, DialogModes.NO );
	}
  }catch(e){return e}
}
/*nas.axeCMC.execNoDescriptor(myStringID)
引数:コマンド文字列
戻値:

//charID
ShrE	シャープ（輪郭のみ）
FndE	輪郭検出
Mrg2	下のレイヤと結合
copy	セレクションコピー
CpyM	結合部分をコピー
Cls 	閉じる（要保存）
Dlt 	消去
Dstt	彩度を下げる
save	上書き保存
Invr	反転
FltI	画像統合
//StirngID
makeFrameAnimation	フレームアニメーション作成
makeTimeline	タイムライン作成
*/
nas.axeCMC.execNoDescriptor=function(myID){
  try {
	if(myID.length==4){
    return executeAction( charIDToTypeID( myID ), undefined, DialogModes.NO );
	}else{
    return executeAction( stringIDToTypeID( myID ), undefined, DialogModes.NO );
	}
  }catch(e){return e}
}
//-------------------nas.axeCMC.doInSelectedItems(myFunction,undoString)
/*nas.axeCMC.doInSelectedItems(myFunction,undoString)

processAbortを組んだほうが良さそうグローバルじゃなくて　nas配下

*/
nas.axeCMC.doInSelectedItems = function(myFunction){
	var currentFrame=nas.axeVTC.getCurrentFrame();//?
	var selectedItems = this.getSelectedItemId();
	if(selectedItems.length){
		for(var ix=0;ix<selectedItems.length;ix++){
			this.getItemById(selectedItems[ix]);
			(myFunction)();
		}
	  this.selectItemsById(selectedItems);//復旧
	}
}

//=================================================アニメーションモード取得
/*nas.axeCMC.getAnimationMode()
引数:なし
戻値:String　//"frameAnimation","timelineAnimation","timelineAnimationNI","NI"

アニメーションモードを検査する関数
状態の遷移を以下のようにする
アニメーション初期化前	NI
フレームアニメーションモード	frameAnimation
タイムラインアニメーションモード	timelineAnimation timelineAnimationNI
さらに
タイムラインアニメーションモードにはサブモードとしてタイムライン初期化前・後 がある
識別するモードは以上4種

CS6以降のアニメーションモードはアニメーション初期化前がデフォルト

確認の手順
背景レイヤのみのドキュメントは、タイムラインの初期化が行われていないので除外
AMコードでタイムラインのdurationを取得
初期化済みのタイムラインモードでは必ず1フレーム以上継続時間があるので判定
フレームアニメ用移動を行う　次＞前
エラーが無ければフレームアニメーションモード
エラーが発生した場合は初期化前のビデオタイムラインモードまたはアニメーション初期化前である
この時点で　総レイヤ数が1以上

*/
nas.axeCMC.getAnimationMode=function(){
var myResult="timelineAnimation";
var flatOne=((app.activeDocument.layers.length==1)&&(app.activeDocument.layers[0].isBackgroundLayer))? true:false ;
    if(! flatOne){
    var ref = new ActionReference();  
      ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID( "frameCount" ) );  
      ref.putClass( stringIDToTypeID( "timeline" ) );  
    var desc = new ActionDescriptor();  
      desc.putReference( charIDToTypeID( 'null' ), ref );  
    var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );  
     if(resultDesc.getInteger( stringIDToTypeID( "frameCount" ) )>0){return myResult;};
//継続時間があれば必ずタイムラインモードなので以降のチェックをスキップ
    }
  try{
  var descCP = new ActionDescriptor();
    var refCP = new ActionReference();
        refCP.putEnumerated( stringIDToTypeID( "animationFrameClass" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
      descCP.putReference( charIDToTypeID( "null" ), refCP );
    executeAction( charIDToTypeID( "copy" ), descCP, DialogModes.NO );
  myResult="frameAnimation"
  }catch(er){
//フレームアニメーションのエラーを受けた場合は基本的にタイムラインモード
if(flatOne){app.activeDocument.activeLayer.isBackgroundLayer=false;}
    var ref = new ActionReference();  
      ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID( "frameCount" ) );  
      ref.putClass( stringIDToTypeID( "timeline" ) );  
    var desc = new ActionDescriptor();  
      desc.putReference( charIDToTypeID( 'null' ), ref );  
    var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );  
     myResult=(resultDesc.getInteger( stringIDToTypeID( "frameCount" ) )==0)?"NI":"timelineAnimationNI";
if(flatOne){nas.axeCMC.undo();}
  }
 return myResult;
}
//=======================　セレクト状態のアイテムID取得
/*nas.axeCMC.getSelectedItemId()
引数:なし
戻値:現在アクティブなアイテムIDの配列

アイテムIDは、内部アイテムID レイヤコレクションのindexではない
DOMのレイヤーオブジェクトのidプロパティと互換あり
*/
nas.axeCMC.getSelectedItemId=function(){
      var selectedItems = new Array;//リザルトキャリア
      var ref = new ActionReference();
      ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	var desc = executeActionGet(ref);
      if ( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
          desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
          var c = desc.count;
          for(var i=0;i<c;i++){ 
            try{
               activeDocument.backgroundLayer;
               selectedItems.push(  desc.getReference( i ).getIndex() );
            }catch(e){
               selectedItems.push(  desc.getReference( i ).getIndex()+1 );
            }
          }
       }else{
        var ref = new ActionReference();
        ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
        ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
         try{
            activeDocument.backgroundLayer; 
            selectedItems.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1); 
         }catch(e){ 
            selectedItems.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))); 
         }
     var vis = app.activeDocument.activeLayer.visible;
        if (vis == true) app.activeDocument.activeLayer.visible = false;
        var descE = new ActionDescriptor();

    var listE = new ActionList();
    var refE = new ActionReference();

    refE.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    listE.putReference( refE );
    descE.putList( charIDToTypeID('null'), listE );

    executeAction( charIDToTypeID('Shw '), descE, DialogModes.NO );

    if (app.activeDocument.activeLayer.visible == false) selectedItems.shift();
        app.activeDocument.activeLayer.visible = vis;
      }
      return selectedItems; 
}
//======================= IDでアイテムを取得
/* nas.axeCMC.getItemById(idx)
引数:idx アイテムindex
戻値:layerItemObject (レイヤセット・ビデオグループ・調整レイヤ等のアイテムを含むLayer)
参考スクリプトは背景レイヤを除外してあったが、背景レイヤもハンドリングする
アイテムをアクティベートしてアクティブアイテムで戻すので、必ず選択操作が伴う
*/
nas.axeCMC.getItemById =function(idx){
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
          ref.putIndex( charIDToTypeID( 'Lyr ' ), idx );
          desc.putReference( charIDToTypeID('null'), ref );
          executeAction( charIDToTypeID( 'slct' ), desc, DialogModes.NO );
	var myResult=app.activeDocument.activeLayer;
        return myResult;
}
//======================= IDでアイテムを取得
/* nas.axeCMC.getItemsById([idx])
引数:idx アイテムindex配列
戻値:layerItemObject (レイヤセット・ビデオグループ・調整レイヤ等のアイテムを含むLayer)配列
参考スクリプトは背景レイヤを除外してあったが、背景レイヤもハンドリングする
アイテムをアクティベートしてアクティブアイテムで戻す　復旧操作が入るので動作は遅い
*/
nas.axeCMC.getItemsById =function(idx){
 if(!(idx instanceof Array)){idx=[idx]}
 var myResult=[];
	var activeItem=app.activeDocument.activeLayer; 
for(var ix=0;ix<idx.length;ix++){
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
          ref.putIndex( charIDToTypeID( 'Lyr ' ), idx[ix] );
          desc.putReference( charIDToTypeID('null'), ref );
          executeAction( charIDToTypeID( 'slct' ), desc, DialogModes.NO );
	myResult.push(app.activeDocument.activeLayer);
}
	  app.activeDocument.activeLayer=activeItem;
        return myResult;
}
//======================= IDでアイテムを取得DOM版
/* nas.axeCMC.getItemByLidD(idx)
引数:idx レイヤindex
戻値:layerItemObject (レイヤセット・ビデオグループ・調整レイヤ等のアイテムを含むLayer)
マッチIDがない場合は null
ダメでした　Layer.idはアクションマネージャのidと互換性無い　セッションユニークidだった
よって基本的に意味なし
全アイテム取得のほうが使い道あり？
*/
nas.axeCMC.getItemByLid =function(idx,myTrailer){
	if(! idx){idx=0;};//指定なければ0で数値化
	if(! myTrailer){myTrailer=app.activeDocument.layers;};//指定がない場合はアクティブドキュメントのルートトレーラー
	for(
		var layerId=0;
		layerId < myTrailer.length;
		layerId++
	){
//			IDがマッチしたらレイヤを返す
		if(myTrailer[layerId].id==idx){return myTrailer[layerId]};
		//	レイヤがトレーラーであっても無くても戻す
		//	さらにレイヤがトレーラであってアイテムを内包する場合 再帰呼び出しをかけて
		if((myTrailer[layerId].typename =="LayerSet")&&(myTrailer[layerId].layers.length)){
			var myReturn=this.getItemByIdD(idx,myTrailer[layerId].layers);
			if(myReturn){return myReturn;};//戻り値がnull以外ならそこで終了
		}
	}
//	マッチしないのでnull
	return null;
}
//======================= 全アイテム（隠しアイテム除外）取得
/* nas.axeCMC.getAllItems(myTrailer)
引数:なし
戻値:指定トレーラーの配下のアイテム全て
全アイテム取得
*/
nas.axeCMC.getAllItems =function(myTrailer){
	if(! myTrailer){myTrailer=app.activeDocument.layers;};//指定がない場合はアクティブドキュメントのルートトレーラー
	var myResult=new Array();//戻り値ローカルに
	for(
		var layerId=0;
		layerId < myTrailer.length;
		layerId++
	){
		//	レイヤをリザルトに積む
		myResult.push(myTrailer[layerId]);
		//	さらにレイヤがトレーラであってアイテムを内包する場合 再帰呼び出しをかけてリザルトを積む
		if((myTrailer[layerId].typename =="LayerSet")&&(myTrailer[layerId].layers.length)){
			var myResult=myResult.concat(this.getAllItems(myTrailer[layerId].layers));
		}
	}
//	フラットなレイヤトレーラ配列を返す
	return myResult;
}

//=======================ID配列を与えてアイテムを選択状態にする
/*nas.axeCMC.selectItemsById(idie:Array)
引数:選択状態にするアイテムID配列
戻値:処理成功時は、選択状態にしたアイテム数　エラー終了時は -1
単独で指定をかけることもできるが、戻り値はアイテム自身ではない

*/
nas.axeCMC.selectItemsById=function(idx){
   if ( idx.constructor != Array ) idx = [ idx ];
   for( var i = 0; i < idx.length; i++ ){
       
      var desc = new ActionDescriptor();
      var ref = new ActionReference();
      ref.putIndex(charIDToTypeID( "Lyr " ), idx[i])
      desc.putReference( charIDToTypeID( "null" ), ref );
      
      if ( i > 0 ) {
          
         var idselectionModifier = stringIDToTypeID( "selectionModifier" );
         var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
         var idaddToSelection = stringIDToTypeID( "addToSelection" );
         desc.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
         
      }
  
      //desc.putBoolean( charIDToTypeID( "MkVs" ), visible );
      executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
   }   
}
// =================== UNDOバッファを使用して復帰
/*　nas.axeCMC.undo()
引数:なし
戻値:アクションディスクリプタ　またはエラーイベント
	undo実行
	これよりはヒストリをさかのぼって消去の方が良いか？
*/
nas.axeCMC.undo=function(){
      var descUndo = new ActionDescriptor();
      var ref = new ActionReference();
      ref.putEnumerated(charIDToTypeID( "HstS" ) ,charIDToTypeID( "Ordn" ) ,charIDToTypeID( "Prvs" ) );
      descUndo.putReference( charIDToTypeID( "null" ), ref );
try{var myResult=executeAction(charIDToTypeID( "slct" ), descUndo, DialogModes.NO )}catch(e){return e};
	return myResult;
}
//=======================　undo保留を判定してコードを実行　CMCへ
/*nas.axeCMC.evalA(undoString,codeChip)
引数:undoString : コード片
戻値:なし
*/
nas.axeCMC.evalA=function(undoString,codeChip){
 if((app.documents.length)&&(app.activeDocument.suspendHistory)){
     app.activeDocument.suspendHistory(undoString,codeChip);
 }else{
     evel(codeCHip);
 }
}

//==================アクティブレイヤがヘッド位置か否かを返す 可能な限り高速な判定が望ましい
//キャッシュを打つ？
/*nas.axeCMC._isBlocked()
引数:なし
戻値:ブール　true:編集ブロック状態/false:編集可能状態
	エラー検出で対象レイヤが現在編集可能か否かをチェックする関数
	編集可能なアートレイヤであるか否か・背景レイヤであるか否かも判定が必要
*/
nas.axeCMC._isBlocked=function(myLayer){
     app.displayDialogs = DialogModes.NO
     var currentLyr = app.activeDocument.activeLayer;
     if(!myLayer){myLayer = currentLyr};
      if(myLayer.isBackgroundLayer){app.activeDocument.activeLayer=currentLyr;return false;};//背景レイヤだったらfalseを返す
      if(myLayer.typename =="LayerSet"){app.activeDocument.activeLayer=currentLyr;return true;};//レイヤセットならばtrueを返す
     var errornumber = 1;
     var myGray = new SolidColor();myGray.rgb.red=127;myGray.rgb.green=127;myGray.rgb.blue=127;
    try{
	app.activeDocument.suspendHistory(
	"check",
	"app.activeDocument.selection.fill(myGray,ColorBlendMode.OVERLAY,100,true);"
	);
//ここがエラー発生ポイント

// ===========================成功時のみチェック操作ヒストリの削除
 //   var desc = new ActionDescriptor();
//    var ref = new ActionReference();
//     ref.putProperty( charIDToTypeID( "HstS" ), charIDToTypeID( "CrnH" ) );
 //    desc.putReference( charIDToTypeID( "null" ), ref );
// executeAction( charIDToTypeID( "Dlt " ), desc, DialogModes.NO );	
    } catch(e){
        errornumber=e.number;
    }
    if(errornumber==-25920){app.activeDocument.activeLayer=currentLyr;return true;}else{app.activeDocument.activeLayer=currentLyr;return false;}
}
//========================================ビデオグループ判定
/*nas.axeCMC._isVideoGroup()
引数:なし
戻値:ブール
ビデオグループの判定

レイヤセット内のアートレイヤを選択した状態で
プレイヘッドをタイム０へ移動してスタートトリミングする

エラーが出たらビデオグループ　他のエレメントではエラーが発生しない…はず
タイムラインモードであることが判定条件なので　アニメーションモード時はいったんモード変更する必要あり

*/
nas.axeCMC._isVideoGroup=function(){
	var myTarget=app.activeDocument.activeLayer;
	if(!(myTarget.typename =="LayerSet")){return false};//レイヤセットであることを確認
	var AM=nas.axeCMC.getAnimationMode();//アニメーションモード取得
	var byDummy=false;//ダミーアイテムを作ったか否か
	//レイヤセットのメンバーがあるか否かをチェック　レイヤセットのメンバーがない場合は、ダミーレイヤを作成する
	var currentArtLayerLength=myTarget.artLayers.length;
	var myEx="";
	myEx+='switch(AM){';
	myEx+='case "frameAnimation":nas.axeCMC.execWithReference("convertAnimation");break;';
	myEx+='case "NI":nas.axeCMC.execNoDescriptor("makeTimeline");break;';
	myEx+='}';
	myEx+='if(currentArtLayerLength==0){';
	myEx+='	var myTestLayer=myTarget.artLayers.add();';
	myEx+='	byDummy=true;';
	myEx+='}';
	myEx+='var myTestLayer=myTarget.artLayers[0];';
	myEx+='app.activeDocument.activeLayer=myTestLayer;';//アクティブレイヤセット
	myEx+='app.activeDocument.activeLayer.name=app.activeDocument.activeLayer.name;';//捨て操作
//	プレイヘッドをタイム0へ
//    nas.axeCMC.execWithReference("timelineGoToFirstFrame");
//	スタートトリミング
	app.activeDocument.suspendHistory("----",myEx);
	try{
   var desc = new ActionDescriptor();
   var ref  = new ActionReference();                 
    ref.putEnumerated( charIDToTypeID( 'Mn  ' ), charIDToTypeID( 'MnIt' ), stringIDToTypeID("timelineTrimLayerStart") );     
    desc.putReference( charIDToTypeID( 'null' ), ref ); 
    executeAction( charIDToTypeID( 'slct' ), desc, DialogModes.NO );
//	コード片を実行してエラーが出ればビデオグループである
//	それ以外は通常のレイヤセットなのでfalseを返す
	}catch(er){
	//処理のための操作を復帰
//	if(byDummy){myTestLayer.remove();};
	if((AM).indexOf("timeline")==-1){nas.axeCMC.undo();}
	app.activeDocument.activeLayer=myTarget;//アクティブレイヤセット
		return true;
	}
// ===================成功時のみ UNDOバッファを使用して復帰
    var desc = new ActionDescriptor();
    var ref  = new ActionReference();
        ref.putEnumerated( charIDToTypeID( "HstS" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Prvs" ) );
        desc.putReference( charIDToTypeID( "null" ), ref );
executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );

//	if(byDummy){myTestLayer.remove();};
//	if((AM).indexOf("timeline")==-1){nas.axeCMC.undo();}
	app.activeDocument.activeLayer=myTarget;//アクティブレイヤセット
		return false;
}
//=========================epsファイルを配置
/*nas.axeCMC.placeEps(filePath)
引数:文字列/ファイルパス
戻値:新規に追加されたレイヤオブジェクト
	ファイルを指定してスマートオブジェクトとして配置する
*/
nas.axeCMC.placeEps=function(myFile){
var plceID = charIDToTypeID( "Plc " );
    var myDescriptor = new ActionDescriptor();
    myDescriptor.putPath( charIDToTypeID( "null" ), myFile);
    myDescriptor.putEnumerated( charIDToTypeID( "FTcs" ), charIDToTypeID( "QCSt" ), charIDToTypeID( "Qcsa" ) );
        var desc = new ActionDescriptor();
        desc.putUnitDouble( charIDToTypeID( "Hrzn" ), charIDToTypeID( "#Rlt" ), 0.000000 );
        desc.putUnitDouble( charIDToTypeID( "Vrtc" ), charIDToTypeID( "#Rlt" ), 0.000000 );
    myDescriptor.putObject( charIDToTypeID( "Ofst" ), charIDToTypeID( "Ofst" ), desc );
    myDescriptor.putBoolean( charIDToTypeID( "AntA" ), true );
         executeAction( plceID, myDescriptor, DialogModes.NO );
	return app.activeDocument.activeLayer;
}

//========== アクティブなレイヤのあるレイヤセット内で最も表示順位の高いレイヤをアクティブにする
/*nas.axeCMC.focusTop()
引数: なし
戻値: アクティベートしたレイヤ

*/
nas.axeCMC.focusTop=function(){
	var kwd="Bckw";
    if(app.activeDocument.activeLayer.parent.typename=="Document"){
    	kwd="Frwr";
    }else{
 app.activeDocument.activeLayer=app.activeDocument.activeLayer.parent;	
    }
// 
    var deskFocus = new ActionDescriptor();var refForcus = new ActionReference();
        refForcus.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( kwd ));
    deskFocus.putReference( charIDToTypeID( "null" ), refForcus );
    deskFocus.putBoolean( charIDToTypeID( "MkVs" ), false );
executeAction( charIDToTypeID( "slct" ), deskFocus, DialogModes.NO );
  return app.activeDocument.activeLayer;
}
// =======================レイヤフォーカス移動
/*nas.axeCMC.moveFocus(kwd)
引数:移動キーワード　Frwrで前面へ　Bckwで後面へ　
戻値:移動後のアクティブレイヤ
		これはデフォルトのショートカットと動作が同じ
表示（可視）状態のレイヤ間でのみ移動が発生するのでフレームアニメーションモードでは十分注意されたし
*/
nas.axeCMC.moveFocus = function(myFocusWord){
    var deskFocus = new ActionDescriptor();
        var refForcus = new ActionReference();
        refForcus.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( myFocusWord ));
    deskFocus.putReference( charIDToTypeID( "null" ), refForcus );
    deskFocus.putBoolean( charIDToTypeID( "MkVs" ), false );
executeAction( charIDToTypeID( "slct" ), deskFocus, DialogModes.NO );
  return app.activeDocument.activeLayer;
}

// ==================================レイヤフォーカスをループ移動
/*nas.axeCMC.loopFocus(kwd)
引数: 移動方向キーワード Frwr,Bckw
戻値:アクティブレイヤ
	標準の動作をラップしてループ移動をさせる
	移動後にアクティブレイヤのトレーラーを以前と比較して異なっていたら
	前面移動時はトレーラーの底（最後面）へ
	後面移動時はトレーラーの表（最前面）へ移動…
	ループ先が非表示の場合は、表示されちゃうのでご注意
*/
nas.axeCMC.loopFocus = function(myFocusWord){
 var myParent=app.activeDocument.activeLayer.parent;//親Trailerを記録
 var myLoopTarget=(myFocusWord=="Bwd")? myParent.layers[0]:myParent.layers[myParent.layers.length-1];
	this.moveFocus(myFocusWord);
//移動後にレイヤトレーラーを判定
  if(myParent !== app.activeDocument.activeLayer.parent){
		app.activeDocument.activeLayer=myLoopTarget;
 }
  return app.activeDocument.activeLayer;
}
//========ラベルカラーを設定
/*
引数:カラーコード,Rd  ,Orng,Ylw ,Grn ,Bl  ,Vlt ,Gry ,None,
戻値:ディスクリプタ

*/
nas.axeCMC.applyLabelColored =function(_color){ 
    var descTrg = new ActionDescriptor();
    var ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
        descTrg.putReference( charIDToTypeID( "null" ), ref );
    var descCol = new ActionDescriptor();
        descCol.putEnumerated( charIDToTypeID( "Clr " ), charIDToTypeID( "Clr " ), charIDToTypeID( _color ) );
        descTrg.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Lyr " ), descCol );
    
return    executeAction( charIDToTypeID( "setd" ), descTrg, DialogModes.NO );
}


//axeVTC VideoTimelineClass　PhotoshopのVideoTimeline系操作を格納するオブジェクト

/*
: nas.axeVTC.getCurrentFrame() 再生ヘッドの現在位置を取得
: nas.axeVTC.getFrameRate() ビデオタイムラインのフレームレートを取得
: nas.axeVTC.setFrameRate(myValue,myOption) ビデオタイムラインのフレームレートを設定
: nas.axeVTC.getTimelineDuration(resultForm) コンポ継続時間を取得　指定形式
: nas.axeVTC.getDuration(resultForm)　コンポ継続時間を取得　形式指定
: nas.axeVTC.moveInPoint(myOffset)	オフセット指定してレイヤーのIN点を移動
: nas.axeVTC.moveOutPoint(myOffset)	オフセット指定してレイヤーのOUT点を移動
: nas.axeVTC.playheadMoveTo(dest)　フレーム指定で再生ヘッドを移動
: nas.axeVTC.playheadMoveToOpcityKey(myWord) 不透明度キーフレームを使ったヘッド移動
: nas.axeVTC.setDuration(myLength)　レイヤーの継続時間を設定
: nas.axeVTC.getInPoint()　レイヤーのIN点を取得(未完成)
*/
	nas.axeVTC=new Object();

//=======================================================カレントフレーム取得
/*
ビデオタイムラインが初期化されていない場合はfalseが戻る　が
判定が重いと操作が混乱するタイプの取得ルーチンなので判定は一考の余地あり
*/
nas.axeVTC.getCurrentFrame= function() {
/*このコマンドの問題点　2015.03.15
背景レイヤのみのドキュメントではアニメーションモードにかかわらずエラー発生（nullを戻す）
上記以外の場合フレームアニメーションモードでは、必ず０が戻るっぽい
よってタイムラインアニメーションでかつタイムラインの初期化が終了している場合以外は、戻り値がアテにならない
使いドコロ要注意　代わりにモード判定に使える
*/
   try{
    var ref = new ActionReference();  
      ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('currentFrame'));  
      ref.putClass(stringIDToTypeID('timeline'));  
    var desc=new ActionDescriptor();  
      desc.putReference(charIDToTypeID('null'), ref);           
    var TC=executeAction(charIDToTypeID('getd'), desc, DialogModes.NO);
       
    return TC.getInteger(stringIDToTypeID('currentFrame'));
    }catch(e){return null;}  
}
//======================================================フレームレート取得
/*nas.axeVTC.getFrameRate()
引数:なし
戻値:フレームレート
	タイムライン初期化前では戻り値がnull
*/
nas.axeVTC.getFrameRate=function(){  
    try{
        var ref = new ActionReference();  
        ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID("documentTimelineSettings") );  
        ref.putClass( stringIDToTypeID( "timeline" ) );  
        var desc = new ActionDescriptor();  
        desc.putReference( charIDToTypeID( 'null' ), ref );  
        var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );
        return resultDesc.getDouble( stringIDToTypeID('frameRate') ); 
    }
    catch(e){return null;}
}

//==========================タイムラインのフレームレートを設定
/*nas.axeVTC.setFrameRate(myValue,force)
引数:設定するフレームレート数値 fps 0以下は不正値　小数値指定はOK:強制オプション　ブール
戻値:設定されている値nas.FRATEとの同期をとるために同じ値をnas.FRATEにセットする
	引数が省略された場合は、現在のnas.FRATEをドキュメントに対して設定する
	オプションtrueで単独設定可
nas.axeVTC.setFrameRate()	←nas.FRATEの値をドキュメントにセット
nas.axeVTC.setFrameRate(24)	←nas.FRATEへ同時に24を代入する
nas.axeVTC.setFrameRate(30,true)←ドキュメントのみ30fpsにする(nas.FRATEは手を付けず)
*/
nas.axeVTC.setFrameRate=function(myValue,myOption){
	if((!myValue)||(myValue<=0)){myValue=nas.FRATE;};
	if(!myOption){myOption=false;};
try{
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putProperty( charIDToTypeID( "Prpr" ), stringIDToTypeID( "documentTimelineSettings" ) );
        ref.putClass( stringIDToTypeID( "timeline" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
    desc.putDouble( stringIDToTypeID( "frameRate" ), myValue );
	executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );
	var currentFR = this.getFrameRate();
   if((! myOption)&&(nas.FRATE!=currentFR)){nas.FRATE=currentFR;};
}catch(er){	return null; }
	return currentFR;
}
//==================================== ドキュメントの継続時間をTCで取得
/* nas.axeVTC.getTimelineDuration()
 引数:戻値の指定形式　0:TC文字列 1:TC配列 2:フレーム数
 戻値:フレーム数　または　TC配列　または　TC文字列 または null
ビデオタイムラインモード以外ではnull
*/
nas.axeVTC.getTimelineDuration=function(resultForm){  
 var myResult=null
    try{
        var ref=new ActionReference();
         ref.putProperty(charIDToTypeID('Prpr'),stringIDToTypeID('duration'));
         ref.putClass(stringIDToTypeID('timeline'));
         var desc=new ActionDescriptor();
          desc.putReference(charIDToTypeID('null'),ref);
          var TC=executeAction(charIDToTypeID('getd'),desc,DialogModes.NO);
           TC=TC.getObjectValue(stringIDToTypeID('duration'));
          var H=0;
          try{ H = TC.getInteger(stringIDToTypeID('hours')); }catch(e){}
         var M=0;
        try{ M = TC.getInteger(stringIDToTypeID('minutes')); }catch(e){}
       var S=0;
      try{S=TC.getInteger(stringIDToTypeID('seconds'));}catch(e){}
    var F=TC.getInteger(stringIDToTypeID('frame'));
      var FR=TC.getInteger(stringIDToTypeID('frameRate'));
	var myTC=[nas.Zf(H,2),nas.Zf(M,2),nas.Zf(S,2),nas.Zf(F,2)].join(":");

	switch(resultForm){
	  case 2:;//frames
		myResult=nas.FCT2Frm(myTC,FR);//迂遠だけどこの方が良い
//		myResult=H*36000*FR+M*60*FR+S+FR+F;//これはドロップフレームが考慮されないので実は完全OUT
	  break;
	  case 1:;//nasCalc互換TC配列+FR
		myResult=[[H,M,S,F],FR]
	  break;
	  default:
		myResult=myTC;
	}
    }catch(e){ return myResult; }  
      return myResult;
}
//===========================================ドキュメントの継続時間を取得
/* nas.axeVTC.getDuration(resultForm)
 引数:戻値の指定形式　0:TC文字列 1:TC配列 2:フレーム数
 戻値:フレーム数　または　TC配列　または　TC文字列
この関数は初期化前のビデオタイムラインまたはフレームアニメーションに関して
背景レイヤのみのドキュメントに対してはエラーが出るのでトラップしてnullを返し
その他の場合は常に0をリザルトする
デフォルトの戻り値はフレーム数
*/
nas.axeVTC.getDuration = function(resultForm){
    var myResult=null;
   if((app.activeDocument.layers.length==1)&&(app.activeDocument.layers[0].isBackgroundLayer)){return myResult;}
    var ref = new ActionReference();  
     ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID( "frameCount" ) );  
      ref.putClass( stringIDToTypeID( "timeline" ) );  
       var desc = new ActionDescriptor();  
      desc.putReference( charIDToTypeID( 'null' ), ref );  
     var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );  
    myFC= resultDesc.getInteger( stringIDToTypeID( "frameCount" ) );  

	switch(resultForm){
	  case 0:;//文字列TC
		myResult=nas.Frm2FCT(myFC,9,0)[0].join(":");
	  break;
	  case 1:;//nasCalc互換TC配列+FR
		myResult=nas.Frm2FCT(myFC,9,0);//迂遠だけどこの方が良い
	  break;
	  default:;//frames
		myResult=myFC;
	}
	return myResult;
};
//タイムラインのIN/OUT点を設定
/*
	オブジェクトメソッドにしたい　すごく　でもコンストラクタもプロトタイプも出てないからちょっとムリ
	アクティブアイテムをラッピングするエージェントを作る？んーん なるべく単純なライブラリにする
	引数はオフセット nasFCTまたはフレーム数　
nas.axeVTC.moveInPoint(myOffset)
nas.axeVTC.moveOutPoint(myOffset)
引数:オフセット量　nasFCT または フレーム数
戻値:なし

引数が0指定の場合はタイムライン端点をカレントフレームへ移動するようにトライする

*/
nas.axeVTC.moveInPoint=function(myOffset){
    if(! myOffset){myOffset=0};
var mvTL=(myOffset)?false:true;//未指定または0の場合移動フラグを立てる
    if(isNaN(myOffset)){myOffset = nas.FCT2Frm(myOffset);};

    var descA = new ActionDescriptor();
    var idtimeOffset =(mvTL)?stringIDToTypeID( "time" ):stringIDToTypeID( "timeOffset" );
    var descO = new ActionDescriptor();
        descO.putInteger( stringIDToTypeID( "hours" ), 0 );
        descO.putInteger( stringIDToTypeID( "minutes" ), 0 );
        descO.putInteger( stringIDToTypeID( "seconds" ), 0);
        descO.putInteger( stringIDToTypeID( "frame" ), myOffset );
        descO.putDouble( stringIDToTypeID( "frameRate" ), nas.FRATE);
       descA.putObject( idtimeOffset, stringIDToTypeID( "timecode" ), descO );

    executeAction( stringIDToTypeID( "moveInTime" ), descA, DialogModes.NO );
}
nas.axeVTC.moveOutPoint=function(myOffset){
    if(! myOffset){myOffset=0};
var mvTL=(myOffset)?false:true;//未指定または0の場合移動フラグを立てる
    if(isNaN(myOffset)){myOffset = nas.FCT2Frm(myOffset);};
    var idmoveOutTime = stringIDToTypeID( "moveOutTime" );
    var descA = new ActionDescriptor();
    var idtimeOffset =(mvTL)?stringIDToTypeID( "time" ):stringIDToTypeID( "timeOffset" );
    var descO = new ActionDescriptor();
        descO.putInteger( stringIDToTypeID( "hours" ), 0 );
        descO.putInteger( stringIDToTypeID( "minutes" ), 0 );
        descO.putInteger( stringIDToTypeID( "seconds" ), 0);
        descO.putInteger( stringIDToTypeID( "frame" ), myOffset );
        descO.putDouble( stringIDToTypeID( "frameRate" ), nas.FRATE);
    var idtimecode = stringIDToTypeID( "timecode" );
        descA.putObject( idtimeOffset, idtimecode, descO );

    executeAction( idmoveOutTime, descA, DialogModes.NO );
}
// ======================プレイヘッド移動
/* nas.axeVTC.playheadMoveTo(dest)
 引数:　行き先フレーム　nasFCT または フレーム数で
 戻値:　不定
*/
nas.axeVTC.playheadMoveTo=function(dest){
  if(!dest){dest=0};
    if(isNaN(dest)){nas.FCT2Frm(dest);};
    var descA = new ActionDescriptor();
        var refTL = new ActionReference();
            refTL.putProperty( charIDToTypeID( "Prpr" ), stringIDToTypeID( "time" ) );
            refTL.putClass( stringIDToTypeID( "timeline" ) );
    descA.putReference( charIDToTypeID( "null" ), refTL );
        var descTC = new ActionDescriptor();
            descTC.putInteger( stringIDToTypeID( "seconds" ), 0 );
            descTC.putInteger( stringIDToTypeID( "frame" ), dest );
        descTC.putDouble( stringIDToTypeID( "frameRate" ), this.getFrameRate() );
    descA.putObject( charIDToTypeID( "T   " ), stringIDToTypeID( "timecode" ), descTC );
  return executeAction( charIDToTypeID( "setd" ), descA, DialogModes.NO );
}

//============================不透明度キーフレームを使ったヘッド移動
/*nas.axeVTC.playheadMoveToOpacityKey(kwd)
引数:移動方向　"previousKeyframe" "nextKeyframe"
戻値:移動成功時にカレントフレーム 失敗時に false
*/
nas.axeVTC.playheadMoveToOpacityKey=function(kwd){
	var startFrame=nas.axeVTC.getCurrentFrame();
var idmoveKeyframe = stringIDToTypeID( kwd );
    var desc = new ActionDescriptor();
      var descOpc = new ActionDescriptor();
    descOpc.putEnumerated( stringIDToTypeID( "trackID" ), stringIDToTypeID( "stdTrackID" ), stringIDToTypeID( "opacityTrack" ) );
  desc.putObject( stringIDToTypeID( "trackID" ), stringIDToTypeID( "animationTrack" ), descOpc );
executeAction( idmoveKeyframe, desc, DialogModes.NO );
	var endFrame=nas.axeVTC.getCurrentFrame();
if(startFrame==endFrame){return false;}else{return endFrame;}
}


//==================アクティブレイヤに継続時間をセット
/*nas.axeVTC.setDuration(myLength)
引数:整数　または　nasFCT
戻値:なし
	out点をタイムライン継続時間分前方オフセットする＝必ず1フレーム長になる
	(指定フレーム数-1)後方オフセットして指定長のレイヤにする
	nas.FRATEを参照するので、実行前にnas.FRATEがタイムラインのフレームレートと一致している必要あり
*/
nas.axeVTC.setDuration = function(myLength){
	if(app.activeDocument.activeLayer.typename == "LayerSet" ){return false}
	if(isNaN(myLength)){myLength=nas.FCT2Frm(myLength);}
    if(myLength>=1){
      this.moveOutPoint(this.getDuration()*-1);
        if(myLength>1){this.moveOutPoint(myLength-1)};
    }
}

//====================アクティブレイヤのIN点を取得
/*
	タイムラインのIN点を取得　実験コード　あとでヒストリ操作
間違い　durationの取得ができないのでIN点の取得も不能　後ほど調整
しょうがないのでアレで書く…チェックがもう少し早けりゃ　フレーム移動してるからダメか

*/

nas.axeVTC.getInPoint=function(){
/*
アクティブアイテムを判別
	背景レイヤ→inPoint=0;return inPoint;
	レイヤセットならば取得はスキップ
	アートレイヤーのみ取得する
	０からスキャン
*/
	var myTarget=app.activeDocument.activeLayer;
	if (myTarget.layers){return false;}
	if (myTarget.isBackgroundLayer){return 0;}
var currentDuration=this.getDuration();var currentFrame=this.getCurrentFrame();
var inPoint=0;
for (var inPoint=0;inPoint<currentDuration;inPoint++){this.playheadMoveTo(inPoint);if(!(nas.axeCMC._isBlocked())){this.playheadMoveTo(currentFrame);return inPoint;}}
/*	durationが取得可能ならこの方が早い…かも知れない
	var currentHeadPosition=nas.axeVTC.getCurrentFrame();//ヘッド位置を取得
	  if(currentHeadPosition!=0){nas.axeVTC.playheadMoveTo(0);}//移動の必要があればヘッドを0フレームへ
	var timelineDuration=nas.axeVTC.getTimelineDuration(2);//タイムラインの長さをフレームで取得
	  nas.axeVTC.moveInPoint(0);//引数0でIN点を0フレームへ移動
	var offsetDuration=nas.axeVTC.getTimelineDuration(2);//タイムラインの長さをフレームで取得
// alert(timelineDuration+":"+offsetDuration) ;//<前後で尺の差はない
	var myInpoint=offsetDuration-timelineDuration;//durationの前後差を使って先のタイムラインの開始位置を取得
	  nas.axeVTC.moveInPoint(myInpoint);//差分を使ってタイムラインを復帰
	  if(currentHeadPosition!=0){nas.axeVTC.playheadMoveTo(currentHeadPosition)};//ヘッド位置を復帰
	return myInpoint;//フレームで戻す
*/
}

//=====================再生ヘッド移動抽象化ラッパー
/*nas.axeVTC.goFrame(kwd)
引数:キーワード f,p,n,e いずれか
戻値:カレントフレーム 移動失敗時はfalse

以下の判定動作を行う
オプションがあれば、アクティブレイヤが第二階層レイヤまたは第三階層レイヤで親トレーラが第二階層でかつ第一階層と同名であった場合
指定方向に対して第一階層レイヤセットの不透明度キーに対してキーフレーム移動を試みる
失敗した場合は、ループを行う
またはそれ以外の場合は指定フレーム分移動する　移動に失敗した場合（タイムラインの両端）ループ

オプション指定が存在する場合、移動の結果アクティブレイヤが編集不能状態になった場合　移動方向に合わせてレイヤのフォーカスをループ移動する

*/
nas.axeVTC.goFrame=function(kwd){
	var currentHeadPos=this.getCurrentFrame();
	var destHeadPos;
	var currentDuration=this.getDuration();
	var currentLyr=app.activeDocument.activeLayer;
	var keyHolder=currentLyr;//
	if ((keyHolder.parent.typename =="LayerSet")&&(keyHolder.parent.parent === app.activeDocument )){keyHolder=currentLyr.parent;};//第一階層フォルダなら移行
	if ((keyHolder.parent.name == keyHolder.parent.parent.name )&&(keyHolder.parent.parent !== app.activeDocument )){keyHolder=keyHolder.parent.parent;};//同名フォルダなら親へ移行
 switch (kwd){
  case "f":;
  case "start":;
	this.playheadMoveTo(0);
	destHeadPos=this.getCurrentFrame();
	break;
  case "e":;
  case "end":;
	this.playheadMoveTo(currentDuration);
	destHeadPos=this.getCurrentFrame();
	break;
  case "n":
  case "next":
	if(nas.axe.useOptKey){
		app.activeDocument.activeLayer=keyHolder;
	destHeadPos=this.playheadMoveToOpacityKey("nextKeyframe");
	 if(destHeadPos===false){
		this.playheadMoveTo(0);
		destHeadPos=0;
	 }
	 	app.activeDocument.activeLayer=currentLyr	;
	}else{
		this.playheadMoveTo((currentHeadPos+nas.axe.skipFrames)%currentDuration);
		destHeadPos=this.getCurrentFrame();
	}
	break;
  case "p":
  case "previous":
	if(nas.axe.useOptKey){
		app.activeDocument.activeLayer=keyHolder;
	destHeadPos=this.playheadMoveToOpacityKey("previousKeyframe");
	 if(destHeadPos===false){
		this.playheadMoveTo(currentDuration);
		destHeadPos=this.playheadMoveToOpacityKey("previousKeyframe");
	 }
	 	app.activeDocument.activeLayer=currentLyr	;
	}else{
		this.playheadMoveTo((currentHeadPos-nas.axe.skipFrames+currentDuration)%currentDuration);
		destHeadPos=this.getCurrentFrame();
	}
 	break;
 }
//移動後にアクティブレイヤが編集可能か否かを判定
 if(nas.axe.focusMove){
  if(nas.axeCMC._isBlocked()){
	var myTrailer=app.activeDocument.activeLayer.parent;
	var myLayerCount =app.activeDocument.activeLayer.parent.layers.length;
    switch(kwd){
     case "s":;
     case "start":;
	app.activeDocument.activeLayer=myTrailer.layers[myLayerCount-1];
	break;
     case "e":;
     case "end":;
	app.activeDocument.activeLayer=myTrailer.layers[0];
	break;
     case "n":;
     case "next":;
	nas.axeCMC.loopFocus("Frwr");
	break;
     case "p":;
     case "previous":;
	nas.axeCMC.loopFocus("Bckw");
	break;
    }
  }
 }
}
// ==========================================キートラックを有効・無効
/*nas.axeVTC.switchKeyTrack(kwd)
引数:キーワード　"enable" "disable"
戻値:
*/
nas.axeVTC.switchKeyTrack = function(kwd){
var idSwitch = stringIDToTypeID( kwd );
    var descSwitch = new ActionDescriptor();
        var refSwitch = new ActionReference();
        var idTrack = stringIDToTypeID( "opacityTrack" );//opacityTrack,sheetPositionTrack,styleTrack
        refSwitch.putEnumerated( stringIDToTypeID( "animationTrack" ), stringIDToTypeID( "stdTrackID" ), idTrack );
    descSwitch.putReference( charIDToTypeID( "null" ), refSwitch );
executeAction( idSwitch, descSwitch, DialogModes.NO );
}
// =================================アニメーションキーフレーム追加・削除
/*nas.axeVTC.switchKeyFrame (kwd)
引数:キーワード　"Mk  " "Dlt "
戻値:
*/
nas.axeVTC.switchKeyFrame = function(kwd){
var idSwitch = charIDToTypeID( kwd );
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putClass( stringIDToTypeID( "animationKey" ) );
        var idTrack = stringIDToTypeID( "opacityTrack" );//opacityTrack,sheetPositionTrack,styleTrack
        ref.putEnumerated( stringIDToTypeID( "animationTrack" ), stringIDToTypeID( "stdTrackID" ), idTrack );
    desc.putReference( charIDToTypeID( "null" ), ref );
return 
executeAction( idSwitch, desc, DialogModes.NO );
}
// =======================================キー補間法の設定
/*nas.axeVTC.switchKeyInterp(kwd)
引数:キーワード　"hold" "Lnr "
戻値:
キーが選択状態である必要性あり ヘッド位置であるだけでは条件不足　要注意
*/
nas.axeVTC.switchKeyInterp = function(kwd){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
         ref.putProperty( charIDToTypeID( "Prpr" ), stringIDToTypeID( "animInterpStyle" ) );
        ref.putEnumerated( stringIDToTypeID( "animationKey" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    desc.putReference( charIDToTypeID( "null" ), ref );
    var idInterp = (kwd=="Lnr ")?charIDToTypeID("Lnr "):stringIDToTypeID("hold");
    desc.putEnumerated( charIDToTypeID( "T   " ), stringIDToTypeID( "animInterpStyle" ), idInterp );
executeAction( charIDToTypeID( "setd" ), desc, DialogModes.NO );
}
// ===============================アクティブレイヤ指定時間位置のキーを選択
/*nas.axeVTC.selectAnimationKeyAtPlayhead(selectionAdd,frame,keyKind)
引数:selectionAdd/bool 追加フラグ frame/Int  指定フレーム　keyKind/String　キー種別
戻値:
指定がない場合は、追加なし　カレント位置　不透明度キーを操作
後ほど複数選択等の操作を記録すること
*/
nas.axeVTC.selectAnimationKeyAt= function(selectionAdd,atFrame,keyKind){
	if(! selectionAdd){selectionAdd=false;};
	if(atFrame === undefined){atFrame=this.getCurrentFrame();}
	if(! keyKind){keyKind="opacityTrack";}
    var desc = new ActionDescriptor();
            var ref = new ActionReference();
        ref.putClass( stringIDToTypeID( "animationKey" ) );
        var idKeyKind = stringIDToTypeID( keyKind );//"sheetPositionTrack","opacityTrack","styleTrack"
        ref.putEnumerated( stringIDToTypeID( "animationTrack" ), stringIDToTypeID( "stdTrackID" ), idKeyKind );
    desc.putReference( charIDToTypeID( "null" ), ref );
if(selectionAdd){
    desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
}
        var descTC = new ActionDescriptor();
        descTC.putInteger( stringIDToTypeID( "frame" ), atFrame );
        descTC.putDouble( stringIDToTypeID( "frameRate" ), this.getFrameRate() );
    desc.putObject( charIDToTypeID( "At  " ), stringIDToTypeID( "timecode" ), descTC );
return executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
}
/*
旧コード用ラッパ関数
*/
//========== アクティブなレイヤセット内で最も表示順位の高いレイヤをアクティブにする(AFC外)
nas.axeAFC.focusTop=nas.axeCMC.focusTop;
//=================================================placeEps()
nas.axeAFC.placeEps=nas.axeCMC.placeEps;
//======================================checkAnimationMode()
nas.axeAFC.checkAnimationMode=nas.axeCMC.getAnimationMode;
//================================test code

serchActiveLayer=function(){
	//後方移動のみでまずテスト
	nas.axeCMC.execWithReference("timelineGoToNextFrame");//次のフレームへ
	if(nas.axeCMC._isBlocked()){serchActiveLayer()};
}

/* for TEST */
//nas.axeVTC.getCurrentFrame();
//nas.axeCMC.getAnimationMode();
//nas.axeCMC.execWithReference("timelineGoToPreviousFrame");
//nas.axeCMC.getSelectedItemId().join(":")
//nas.axeCMC.getItemById(0);
//nas.axeCMC.selectItemsById();
//nas.axeCMC.getItemById(12);
//nas.axeCMC.getItemByIdD(12);
//nas.axeCMC._isBlocked()
//nas.axeCMC._isVideoGroup();

//nas.axeVTC.getTimelineDuration();
//nas.axeVTC.getDuration(0);
//nas.axeVTC.timelineGoTo(frames);
//nas.axeVTC.getFrameRate()
//nas.axeVTC.setDuration(12); 
//nas.axeVTC.setFrameRate(24);
//nas.axeVTC.getInPoint()


//serchActiveLayer();

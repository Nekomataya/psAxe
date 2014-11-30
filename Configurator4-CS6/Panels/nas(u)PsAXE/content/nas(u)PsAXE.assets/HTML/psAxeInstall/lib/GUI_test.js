/*
 *	TEST nas.GUI ライブラリ動作試験スクリプト
 *		nas GUI-Library test script
 *	このファイルは、「レンダー乙女」GUIライブラリの使用サンプルです。
 *	Adobe AE 環境でのグリッド指定による GUI部品へのアクセス方法と
 *	何種類かの複合コントロールを提供します。
 *	詳しい使用方法は、以下のURLを参照してください。
 *
 *	http://hpcgi2.nifty.com/Nekomata/nekojyarashi/wiki.cgi?ScriptLibrary
 *
 *	なおこのライブラリは、開発中の暫定版です。
 *	細部は変更になる可能性が有りますので、サイトの情報をご確認ください。
 */
if (! app.nas){
//iclude nasライブラリに必要な基礎オブジェクトを作成する
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
//	ライブラリのロード　CS2-4用 CS5はチェックしていないがたぶん実行可能
//==================== ライブラリを登録して事前に読み込む
/*
	includeLibs配列に登録されたファイルを順次読み込む。
	登録はパスで行う。(Fileオブジェクトではない)
	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む
*/
//var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/BenderSig/App/ScriptingSupport/InstalledScripts=Adobe/Adobe Photoshop CS4/Presets/Scripts") + "/"
//var nasLibFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
//										+ localize("$$$/nas/lib=nas/lib/");

if($.fileName){
//	CS3以降は　$.fileNameオブジェクトがあるのでロケーションフリーにできる
	var nasLibFolderPath = new File($.fileName).parent.path +"/lib/";
}else{
//	$.fileName オブジェクトがない場合はインストールパスをきめうちする
	var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas/lib=nas/lib/");
}
var includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
];
/*
	nasLibFolderPath+"nas.XpsStore.js"

	nasLibFolderPath+"xpsio.js",
	nasLibFolderPath+"mapio.js",
	nasLibFolderPath+"lib_STS.js",
	nasLibFolderPath+"dataio.js",
	nasLibFolderPath+"fakeAE.js",
	nasLibFolderPath+"io.js",
	nasLibFolderPath+"psAnimationFrameClass.js",
	nasLibFolderPath+"xpsQueue.js"
*/
for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile ファンクションがあれば実行する
//		alert("loading with $.evalFile: "+myScriptFileName)
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile が存在しないバージョンではevalにファイルを渡す
//		var prevCurrentFolder = Folder.current;
		var scriptFile = new File(myScriptFileName);
//		Folder.current = scriptFile.path ;
		if(scriptFile.exists){
//			alert("eval :"+scriptFile.name)
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}
app.nas=nas;
}else{
alert("has nas")
nas=app.nas;
}
/* ウィンドウの初期化
 * newWindow(ウィンドウタイプ,ウィンドウタイトル[,ウィンドウ幅,ウィンドウ高さ[,初期位置X,初期位置Y]])
 *	ウインドウを作成します。
 *	戻り値:ウィンドウオブジェクト
 *	タイプには"dialog"または"palette"を指定
 *	高さと幅は、グリッド単位で指定（省略可能）
 *	ウィンドウ初期位置は、ピクセルで（省略可能）指定してください。
*/
	var w= nas.GUI.newWindow       ("dialog" ,"テスト ウインドウ" ,13 ,25);
//	var w= new Window	("palette","テスト ウインドウ",[X,Y,X+7*nas.GUI.colUnit+nas.GUI.leftMargin+nas.GUI.rightMargin,Y+25*nas.GUI.lineUnit+nas.GUI.topMargin+nas.GUI.bottomMargin]);//等価のAEオリジナル書式
/* ウインドウ配下にコントロールを置く。
 *	詳細はドキュメントを読んでね。
 *	初期化されたコントロールは、初期化順に親エレメントの配下に登録されます。
 *	一般的には、オブジェクトにわかりやすい名前を与えてアクセスがしやすくなるように
 *	以下のように初期化します。
 *
 *	アクセス変数 = 初期化コマンド(初期化引数…);
 */
//	ボタンエレメント
	w.btn  =nas.GUI.addButton      (w ,"ボタン" ,0 ,1 ,3 ,1);

//	アイコンボタンエレメント
	w.iBtn  =nas.GUI.addIconButton      (w ,"アイコンボタン" ,3 ,5,1,1.5,"");

//	編集可能テキスト
	w.etx  =nas.GUI.addEditText    (w ,"編集可能テキスト" ,0 ,2 ,6 ,2);

//	テキスト
	w.stx  =nas.GUI.addStaticText  (w ,"テキスト" ,0 ,4 ,6 ,1,{style:"red"});

//	チェックボックス
	w.cbx  =nas.GUI.addCheckBox    (w ,"チェックボックス" ,0 ,5 ,3 ,1);

//	ラジオボタン
	w.rbt0 =nas.GUI.addRadioButton (w ,"ラジオボタン0" ,0 ,6 ,3 ,1);
	w.rbt1 =nas.GUI.addRadioButton (w ,"ラジオボタン1" ,0 ,7 ,3 ,1);

//	スライダ
	w.sld  =nas.GUI.addSlider      (w ,0 ,0 ,10 ,0 ,8 ,6 ,"top");

//	スクロールバー
	w.srb  =nas.GUI.addScrollBar   (w ,0 ,0 ,10 ,6 ,1 ,8);

//複合コントロール群にAE7以降の互換メソッドを作成
/*
	対象は ListBox DropDownList
*/
//	複合コントロール・セレクトスイッチ
//		addSelecteSwitch(親エレメント,[オプション],選択ID,X,Y,幅,高さ)

	myOptions=["☆","○","△","×"];//配列で
	w.ss1  =nas.GUI.addSelectSwitch(w ,myOptions ,0 ,4 ,5.5 ,0.7 ,1);

	w.ss2  =nas.GUI.addSelectSwitch(w ,myOptions ,0 ,5 ,5 ,1 ,1.5,true);

//	複合コントロール・セレクトボタン
//		addSelecteButton(親エレメント,[オプション],選択ID,X,Y,幅,高さ)

	myOptions=["<セレクトボタン>","その1","その2","その3","その4","その5","その6","その7","その8","その9"];//配列で
	w.sbt  =nas.GUI.addSelectButton(w ,myOptions ,7 ,3 ,1 ,3 ,1,4);

	w.ddl  =nas.GUI.addDropDownList(w,myOptions,7, 3, 7 , 3, 1);
/*	
	w.ddl  =w.add("dropdownlist"  ,nas.GUI.Grid(3, 7 ,3,1,w),"noitem");
w.ddl.add("item","1");
w.ddl.add("item","2");
w.ddl.add("item","3");
*/
//	w.ddl =w.add("dropdownlist",nas.GUI.Grid(3,1,3,1,w),)
//	複合コントロール・リストボックス シングルセレクト
/*
 初期化
	addListBox(親オブジェクト,[オプションリスト],[セレクト初期値],X,Y,幅,高さ[,動作オプション])
	または
	addListBox(親オブジェクト,[オプションリスト],セレクトID,X,Y,幅,高さ[,動作オプション])

 戻り値
	アクセスベース
 プロパティ
	value 選択された値・または選択された値の配列(マルチセレクト時)
	options 選択可能な値のリスト
	selected 
	selects 
	選択された値を取得する時は、リストボックスオブジェクトの
	 value プロパティを参照してください。
 */
	w.lbx0 =nas.GUI.addListBox (w ,["いか","たこ","たい","ひらめ","くらげ","かつお","まぐろ"] ,1 ,0 ,9 ,3 ,4 ,"editable");

//	複合コントロール・リストボックス マルチセレクト
	w.lbx1 =nas.GUI.addListBox (w ,["りんご","みかん","いちご","にんじん","きゃべつ","しいたけ","しょうが"] ,[true,false,true,false,true,false,true] ,3 ,9 ,3 ,5 ,"multiselect");
//	複合コントロール マルチコントロール
/*
	マルチコントロールは引数で複合コントロールを作って返します
	nas.GUI.addMultiControl(親オブジェクト,キーワード,次元数,Left,Top,Width,Height,値制限,[ラベルテキスト],[初期値],[最小値].[最大値])
	親オブジェクト以外の引数は省略可能ですが、途中の引数をスキップする場合はfalse等で間を埋めておいてください。
*/

	w.mc0 =nas.GUI.addMultiControl(w,"number",1,7,1,6,1,true,false,0,-100,100,);
	w.mc1 =nas.GUI.addMultiControl(w,"angle",1,7,3,6,2,true);
	w.mc2 =nas.GUI.addMultiControl(w,"position",2,7,6,6,3,false);
	w.mc3 =nas.GUI.addMultiControl(w,"color",3,7,9,6,3,true);
	w.mc4 =nas.GUI.addMultiControl(w,"gamma",5,7,13,6,2,true,false,1,1/8,8);
// コンボボックス
	w.cBox=nas.GUI.addComboBox(w,["コンボボックス",1,2,3,4,5],"ばかぼこ",7,19,3,1)
	w.cBox=nas.GUI.addEditText(w,"ばかぼこ",7,20,3,1)
	
//	パネルを置いてさらにその配下にコントロールを置く

	w.pnl  =nas.GUI.addPanel       (w ,"PANEL" ,0 ,15 ,7 ,10);

//	パネル配下のコントロールは、パネルのローカル座標下に入る。
	w.pnl.btn  =nas.GUI.addButton      (w.pnl ,"BUTTON" ,0 ,1 ,3 ,1);
	w.pnl.etx  =nas.GUI.addEditText    (w.pnl ,"EDIT TEXT" ,0 ,2 ,6 ,2);
	w.pnl.stx  =nas.GUI.addStaticText  (w.pnl ,"STATIC TEXT" ,0 ,4 ,6 ,1);
	w.pnl.cbx  =nas.GUI.addCheckBox	   (w.pnl ,"CHECKBOX" ,0 ,5 ,3 ,1);
	w.pnl.rbt0 =nas.GUI.addRadioButton (w.pnl ,"RADIOBUTTON0" ,0 ,6 ,3 ,1);
	w.pnl.rbt1 =nas.GUI.addRadioButton (w.pnl ,"RADIOBUTTON1" ,0 ,7 ,3 ,1);
	w.pnl.sld  =nas.GUI.addSlider      (w.pnl ,0 ,0 ,10 ,0 ,8 ,6 ,"bottom");	w.pnl.srb  =nas.GUI.addScrollBar   (w.pnl ,0 ,0 ,10 ,6 ,1 ,8);

//セレクトボタンは、以下のような初期化のやりかたも可能です
w.pnl.sbt  =nas.GUI.addSelectButton(w.pnl ,"<SelectBUTTON>" ,0 ,3 ,1 ,3 ,1);
	w.pnl.sbt.options.push("1st");
	w.pnl.sbt.options.push("2nd");
	w.pnl.sbt.options.push("3rd");
	w.pnl.sbt.options.push("4th");

//ここに stb.add()を実装してAdobeスクリプトと互換を増すこと

/*
 *	設定されたコントロールには、なにかの機能を割りつけるのが普通です。
 *	コントロールが操作された時に「イベント」が発生しますので。そのイベントに
 *	機能を登録します。
 *
 *	たとえば、ボタンをクリックすると"Click"イベントが発生するので、
 *	"Click"イベントが発生した時に起動される onClick() メソッドを定義してやります。
 */
	w.btn.onClick=function(){alert("ボタンをクリックしました");};

/*
 *	値の変更が起きた時に起きる "Change"イベント
 *	この例では、編集可能テキストの値を書き換えています。
 */
	w.sbt.onChange=function(){w.etx.text+=this.value+nas.GUI.LineFeed;};

/*
 * 	どうもスクロールバーの戻り値がちがう?
 *	試験です
 *
 */
	w.srb.onChange=function(){w.etx.text+="srb\value : "+this.value+nas.GUI.LineFeed;};
/*
 *	このファイルの 他のエレメントには、なにも動作を設定してありません。
 *	練習用に書き換えてみてください。
 *
 *
 *	すべてのエレメントの定義が終わったら、ウインドウを表示します。
 *	show()メソッドで表示するまで、画面には何も表示されません。 
 *	当然、操作もできません。
 *	最後に表示を忘れないように。
 */

	w.show();



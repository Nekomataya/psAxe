/*
	application 側の環境を初期化する手続き
*/
if(app.version > "13.9.9"){
	/**
	 * この関数は、CSX環境下では不要
	 * @param arg
	 * @returns {Object}
	 */
		function getApplicationResult(arg) {return eval(arg);}
	};
	if(true){
	var myInstallFolder=Folder.userData.fullName+"/nas";
	//すでに１回以上インストールされている場合は選択的にインストール・アンインストールを行う
	 if(!(File(myInstallFolder).exists)||!(File(myInstallFolder+"/lib/nas_psAxeLib.js").exists)){
	alert(localize({
		en:"Installation is not complete\nPlease install the library in the upper left corner of the ax icon of panel",
		ja:"インストールが完了していません\nパネルの左上の斧アイコンでライブラリをインストールして下さい"
	}));
	//ライブラリインストール前なのでapplication locale を判定して仮設オブジェクトとして設定
	var nas=new Object;
	 nas.locale="ja";//判定不能時はとりあえずjaにするので初期値を与える
	
		if(typeof locale != "undefined"){
			nas.locale=locale.split("_")[0];//"ja_JP"等の前置部分のみをとる
		}else{
			if(typeof uiLocale != "undefined" ){
				nas.locale=uiLocale; 
			}else{
				if(typeof app !="undefined"){
					if(app.locale){nas.locale=app.locale.split("_")[0];}
				}else{
					if(typeof $ != "undefined"){
						if($.locale){nas.locale=$.locale.split("_")[0];}
					}else{
						if(typeof navigator != "undefined"){
							nas.locale=(navigator.userLanguage||navigator.browserLanguage||navigator.language).substr(0,2);
						};
					};
				};
			};
		};
		nas.Version={};
		nas.libNotInstalled="true";//ライブラリが未インストールであるフラグを与える
		app.nas=nas;//アタッチ
	//$.evalFile("psAxe/scripts/psAxeSplash.jsx");
	 }else{
	/* ここでnasオブジェクトの初期化を行う
	 * 同様のinitializeをCSX環境下ではnas(u)PsAXE.xml内部に書き込む
	 */
	/* Photoshop用ライブラリ読み込み CS6以降初期化専用 */
			var includeLibs=[];//読み込みライブラリを格納する配列
	/* iclude相当 nasライブラリに必要な基礎オブジェクトを作成する */
			var nas     = new Object();
			nas.Version = new Object();
			nas.isAdobe = true;
			nas.axe     = new Object();
			nas.baseLocation     = new Folder(Folder.userData.fullName+ "/nas");
			var nasLibFolderPath = nas.baseLocation.fullName+"/lib/";
	/*	ライブラリのロード CS6-CC用
	 *==================== ライブラリを登録して事前に読み込む
	 *
	 *	includeLibs配列に登録されたファイルを順次読み込む。
	 *	登録はパスで行う。(Fileオブジェクトではない)
	 *	$.evalFile メソッドが存在する場合はそれを使用するがCS2以前の環境ではglobal の eval関数で読み込む
	 *＝＝＝ ライブラリリスト（以下は読み込み順位に一定の依存性があるので注意）
	 *  ext-lib/JSON/json2.js              JSONライブラリ
	 *  ext-lib/MDN/adobeex.js             javascript補完ライブラリ
	 *  config.js              一般設定ファイル（デフォルト値書込）このルーチン外では参照不能
	 *  nas_common.js              AE・HTML・node 共用一般アニメライブラリ
	 *  nas_AnimationValues.js     AE・HTML・node 共用一般アニメライブラリ
	 *  cameraworkDescriptionDB.js AE・HTML・node 共用一般アニメライブラリ
	 *  pmio.js                    制作管理DBライブラリ
	 *  configPMDB.js              制作管理DBライブラリ
	 *  nas_GUIlib.js          Adobe環境共用GUIライブラリ
	 *  nas_psAxeLib.js        PS用環境ライブラリ
	 *  nas_prefarenceLib.js   Adobe環境共用データ保存ライブラリ
	 *  nas_axeEventHandler.js Adobe環境共用ライブラリ
	 *  nas_locale.js          Adobe環境用言語ライブラリ
	 *  messages.js            言語リソース
	 *  psCCfontFix.js         Adobeフォントサイズバグ修正ライブラリ
	 *
	 *  nasXpsStore.js   PSほかAdobe汎用XpsStoreライブラリ(AE用は特殊)
	 *  xpsio.js         汎用Xpsライブラリ
	 *  mapio.js         汎用Mapライブラリ
	 *  lib_STS.js       Adobe環境共用STSライブラリ
	 *  lib_AEK.js       Adobe環境共用AEKライブラリ
	 *  --dataio.js        Xpsオブジェクト入出力ライブラリ（廃止）
	 *  --fakeAE.js        中間環境ライブラリ (廃止 nas_commonに統合)
	 *  --io.js            りまぴん入出力ライブラリ（廃止）
	 *  psAnimationFrameClass.js	PS用フレームアニメーション操作ライブラリ
	 *  xpsQueue.js         PS用Xps-FrameAnimation連携ライブラリ(廃止予定)
	 */
	includeLibs=[
		nas.baseLocation.fullName+"/ext-lib/JSON/json2.js",
		nas.baseLocation.fullName+"/ext-lib/MDN/adobeex.js",
		nasLibFolderPath+"config.js",
		nasLibFolderPath+"nas_common.js",
	
		nasLibFolderPath+"nas_AnimationValues.js",
		nasLibFolderPath+"cameraworkDescriptionDB.js",
		nasLibFolderPath+"pmio.js",
	//	nasLibFolderPath+"etc/pmdb/configPMDB.js",
	
		nasLibFolderPath+"nas_GUIlib.js",
		nasLibFolderPath+"nas_psAxeLib.js",
		nasLibFolderPath+"nas_preferenceLib.js",
		nasLibFolderPath+"nas_axeEventHandler.js",
	
		nasLibFolderPath+"nas_locale.js",
		nasLibFolderPath+"messages.js",
		nasLibFolderPath+"psCCfontFix.js"
	];
	//============================== Application Objectに参照をつける
		app.nas=nas;
		bootFlag=true;
	/*	ライブラリ読み込み
	ここで必要なライブラリをリストに加えてから読み込みを行う
	*/
	includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
	includeLibs.push(nasLibFolderPath+"xpsio.js");
	includeLibs.push(nasLibFolderPath+"mapio.js");
	includeLibs.push(nasLibFolderPath+"storyboard.js");//pmioに依存
	includeLibs.push(nasLibFolderPath+"lib_STS.js");
	//includeLibs.push(nasLibFolderPath+"dataio.js");
	//includeLibs.push(nasLibFolderPath+"fakeAE.js");
	//includeLibs.push(nasLibFolderPath+"io.js");
	includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	for(var ix = 0 ;ix < includeLibs.length ; ix ++){
		var myScriptFileName=includeLibs[ix];
		//$.evalFile ファンクションで実行する
		$.evalFile(myScriptFileName);
	};
	//=====================================保存してあるカスタマイズ情報を取得
	nas.readPreference();nas.workTitles.select();
	//=====================================startup
	 };
	};
	//+++++++++++++++++++++++++++++++++初期化終了
	
	
//言語リソースをローカライズオブジェクトに分離
/*
	設定オブジェクトがあればキーとして取得
*/
	
	if(typeof uiLocale === undefined ){
		nas.locale=app.locale.split("_")[0];
	}else{
		nas.locale=uiLocale;
	}
	nas.locale=(nas.locale=="en")?"en":"ja";
//内部で使用するlocalizeファンクションを作っておく
	nas.localize=function(myObject){return myObject[nas.locale]};
	if( typeof localize===undefined ){localize=nas.localize;}
//
nas.uiMsg={};
 nas.uiMsg.Preference		={en:"Preference"		,ja:"各種設定"};
 nas.uiMsg.Medias		={en:"Medias"			,ja:"メディア設定"};
 nas.uiMsg.Common		={en:"Common"			,ja:"一般環境"};
 nas.uiMsg.Action		={en:"Action"			,ja:"動作設定"};
 nas.uiMsg.Drawing		={en:"Drawing"			,ja:"作画設定"};
// nas.uiMsg.Name		={en:"Name"			,ja:"作業者名"};
 nas.uiMsg.userName			={en:"NAME"			,ja:"Name"};
 nas.uiMsg.baseResolution		={en:"BaseResolution"		,ja:"基準解像度"};
 nas.uiMsg.Framerate		={en:"Framerate"		,ja:"フレームレート"};
 nas.uiMsg.SheetLength		={en:"XsheetLength"		,ja:"シート１枚の長さ"};
 nas.uiMsg.workTitles		={en:"workTitles"		,ja:"作品タイトル登録"};
 nas.uiMsg.Registration		={en:"Registration"		,ja:"新規登録"};
 nas.uiMsg.Delete		={en:"Delete"			,ja:"削除"};
 nas.uiMsg.Update		={en:"Update"			,ja:"更新"};
 nas.uiMsg.IMset		={en:"ImputMedias"		,ja:"入力メディア登録"};
 nas.uiMsg.IMedit		={en:"ImputMedias"		,ja:"入力メディア編集"};
 nas.uiMsg.OMset		={en:"OutputMedias"		,ja:"出力メディア登録"};
 nas.uiMsg.OMedit		={en:"OutputMedias"		,ja:"出力メディア編集"};
 nas.uiMsg.ElementsFilter	={en:"footages"		,ja:"素材フィルタ"};
 nas.uiMsg.Filter		={en:"Filter"			,ja:"フィルタ"};
 nas.uiMsg.BG			={en:"BG"			,ja:"背景"};
 nas.uiMsg.Book			={en:"MG/FG"			,ja:"BOOK"};
 nas.uiMsg.Layout		={en:"Layout"			,ja:"レイアウト"};
 nas.uiMsg.Cell			={en:"Cell"			,ja:"セル"};
 nas.uiMsg.Frame		={en:"Frame"			,ja:"フレーム"};
 nas.uiMsg.Xsheet		={en:"Xsheet"			,ja:"タイムシート"};
 nas.uiMsg.Drawing		={en:"Drawing"			,ja:"動画"};
 nas.uiMsg.KeyDrawing		={en:"KeyDrawing"		,ja:"原画"};
 nas.uiMsg.Sounds		={en:"Sounds"			,ja:"サウンド"};
 nas.uiMsg.othet		={en:"other"			,ja:"その他"};
 nas.uiMsg.NORMAL		={en:"NORMAL"			,ja:"通常"};
 nas.uiMsg.MULTIPLY		={en:"MULTIPLY"			,ja:"乗算"};
 nas.uiMsg.LIGHTEN		={en:"LIGHTEN"			,ja:"比較（明）"};
 nas.uiMsg.DARKER		={en:"DARKER"			,ja:"比較（暗）"};
 nas.uiMsg.DIFFERENCE		={en:"DIFFERENCE"		,ja:"差の絶対値"};
 nas.uiMsg.SILHOUETTE_LUMA	={en:"SILHOUETTE_LUMA"		,ja:"シルエットルミナンス"};
 nas.uiMsg.setGuideLayer	={en:"setGuideLayer"		,ja:"ガイドレイヤにする"};
 nas.uiMsg.withColorKey		={en:"withColorKey"		,ja:"カラーキーで白を透過"};
 nas.uiMsg.overrideAlpha	={en:"overrideAlpha"		,ja:"アルファチャンネル優先"};
 nas.uiMsg.overrideColorKey	={en:"overrideColorKey"		,ja:"カラーキー優先"};
 nas.uiMsg.withSmoothing	={en:"withSmoothing"		,ja:"スムージングする"};
 nas.uiMsg.drawingFunctions	={en:"drawingFunctions"		,ja:"作画機能設定"};
 nas.uiMsg.layerControl		={en:"layerControl"		,ja:"レイヤコントロール"};
 nas.uiMsg.atCreateNewLayer	={en:"to Create a new Layer"	,ja:"新規レイヤ作成時に"};
 nas.uiMsg.withTransparent	={en:"with transparent"		,ja:"透過させる"};
 nas.uiMsg.newLayerBgColor	={en:"bgColor of new layer"	,ja:"新規レイヤの背景色"};
 nas.uiMsg.overlayBgColor	={en:"bgColor of overlay"	,ja:"修正レイヤの背景色"};
 nas.uiMsg.previewControl	={en:"preview Control"		,ja:"プレビューコントロール"};
 nas.uiMsg.Documents		={en:"Documents"		,ja:"ドキュメント設定"};
 nas.uiMsg.Load			={en:"Load"			,ja:"読込"};
 nas.uiMsg.Save			={en:"Save"			,ja:"保存"};
 nas.uiMsg.Destruction		={en:"Destruction"		,ja:"破棄"};
 nas.uiMsg.Close		={en:"Close"			,ja:"閉じる"};
 nas.uiMsg.Cancel		={en:"Cancel"			,ja:"取消"};
 nas.uiMsg.addNewLayer		={en:"add new layer"		,ja:"新規動画レイヤ作成"};
 nas.uiMsg.addNewOvl		={en:"add new overlay"		,ja:"新規修正レイヤ作成"};
 nas.uiMsg.noDocument		={en:"no document"		,ja:"ドキュメントがありません"};
 nas.uiMsg.activateUpperLayer	={en:"activate upper layer"	,ja:"上位レイヤをアクティブ"};
 nas.uiMsg.Edit			={en:"Edit"			,ja:"編集"};
 nas.uiMsg.backgroundColor	={en:"background color"		,ja:"背景色"};
 nas.uiMsg.title		={en:"title"			,ja:"題名"};
 nas.uiMsg.opus			={en:"Opus"			,ja:"制作番号"};
 nas.uiMsg.sceneCut		={en:"S-C"			,ja:"S-C"};
 nas.uiMsg.scene		={en:"Scene"			,ja:"シーン"};
 nas.uiMsg.cut			={en:"Cut"			,ja:"カット番号"};
 nas.uiMsg.time			={en:"time"			,ja:"time"};
 nas.uiMsg.transition		={en:"transition"		,ja:"トランジション"};
 nas.uiMsg.removeAnimationFrame	={en:"remove animation frame"	,ja:"アニメフレームを削除"};
 nas.uiMsg.duplicateAnimationFrame	={en:"duplicate animation frame"	,ja:"アニメフレームを複製"};
 nas.uiMsg.reverseAnimationFrame	={en:"reverse animation frame"		,ja:"アニメフレームを反転"};
 nas.uiMsg.animationFrameSelectAll	={en:"animation frame selectAll"	,ja:"アニメフレーム全選択"};
 nas.uiMsg.install		={en:"install"		,ja:"インストール"};
 nas.uiMsg.uninstall		={en:"uninstall"		,ja:"削除"};
 nas.uiMsg.shortcutKey		={en:"shartcut key scripts"		,ja:"ショートカットツール"};
 nas.uiMsg.noLayers		={en:"no layer for deploying"		,ja:"展開するレイヤがありません"};
 nas.uiMsg.resetSmartObj	={en:"reset smartObj"		,ja:"スマートオブジェクトをリセット"};
/*
 nas.uiMsg.		={en:""		,ja:""};
 nas.uiMsg.		={en:""		,ja:""};
 nas.uiMsg.		={en:""		,ja:""};
*/
//dialog messages
 nas.uiMsg.dm001={
	en:"The effect is limited to the session.\n If you need record, please click Save button below.",
	ja:"このパネルの変更はセッション限りです。記録が必要な場合は下のボタンで保存してください。"
  };
 nas.uiMsg.dm002={
	en:"Switching the active layer with the movement of animation frames"+nas.GUI.LineFeed+"(only valid when using psAxe)",
	ja:"フレーム移動時にアクティブレイヤの移動をする"+nas.GUI.LineFeed+"(エクステンション使用時のみ有効)"
  };
 nas.uiMsg.dm003={
	en:"Dialog to create a new file",
	ja:"新規ファイル作成ダイアログ"
  };
 nas.uiMsg.dm004={
	en:"PsAxe use the advanced features when you create a new document",
	ja:"新規ドキュメント作成時にアニメ拡張機能を使う"
  };
 nas.uiMsg.dm005={
	en:"Can not drop to zero because the number of entries.",
	ja:"エントリ数が0になるので削除できません。"
  };
 nas.uiMsg.dm006={
	en:"Drop the selected entry. Are you sure?",
	ja:"選択されたエントリを削除します。よろしいですか？"
  };
 nas.uiMsg.dm007={
	en:"Load the saved settings. Current settings will be overwritten.",
	ja:"保存中の設定を読み込みます。現在の設定は上書きされます。"
  };
 nas.uiMsg.dm008={
	en:"You can not cancel. Are you sure?",
	ja:"取消はできません。よろしいですか？"
  };
 nas.uiMsg.dm009={
	en:"Save the configuration to the directory ["+nas.prefarenceFolder.fsName+"]."+nas.GUI.LineFeed+"The previous file is overwritten. Are you sure? ",
	ja:"設定を["+nas.prefarenceFolder.fsName+"]以下に保存します。"+nas.GUI.LineFeed+"以前のファイルは上書きされます。よろしいですか？"
  };
nas.uiMsg.dm010={
	en:"Use the opacity key to the head movement (timeline)",
	ja:"ヘッド移動に不透明度キーを使用(timeline)"
  };
nas.uiMsg.dm011={
	en:"frame skip (timeline)",
	ja:"フレームスキップ(timeline)"
  };
nas.uiMsg.dm012={
	en:"frame skip (timeline)",
	ja:"フレームスキップ(timeline)"
  };
nas.uiMsg.dm013={
	en:"use difference mode when peg image placement",
	ja:"タップ画像配置時に差の絶対値にする"
  };
nas.uiMsg.dm014={
	en:"use semi-transparent when picture-frame arrangement",
	ja:"フレーム画像配置時に半透明にする"
  };
nas.uiMsg.dm015={
	en:"",
	ja:""
  };
/*

 nas.uiMsg.		={en:""		,ja:""};
nas.uiMsg.dm={
	en:"",
	ja:""
  };
*/
//=========nas.uiMsg
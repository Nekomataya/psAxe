//言語リソースをローカライズオブジェクトに分離
//alert(nas.toSource());
nas.uiMsg={};
 nas.uiMsg.Preferrence	={en:"Preferrence"	,ja:"各種設定"};
 nas.uiMsg.Medias	={en:"Medias"		,ja:"メディア設定"};
 nas.uiMsg.Common	={en:"Common"		,ja:"一般環境"};
 nas.uiMsg.Action	={en:"Action"		,ja:"動作設定"};
 nas.uiMsg.Drawing	={en:"Drawing"		,ja:"作画設定"};
// nas.uiMsg.Name		={en:"Name"		,ja:"作業者名"};
 nas.uiMsg.Name		={en:"NAME"		,ja:"Name"};
 nas.uiMsg.Resolution	={en:"BaseResolution"	,ja:"基準解像度"};
 nas.uiMsg.Framerate	={en:"Framerate"	,ja:"フレームレート"};
 nas.uiMsg.SheetLength	={en:"XsheetLength"	,ja:"シート１枚の長さ"};
 nas.uiMsg.workTitles	={en:"workTitles"	,ja:"作品タイトル登録"};
 nas.uiMsg.Registration	={en:"Registration"	,ja:"新規登録"};
 nas.uiMsg.Delete	={en:"Delete"		,ja:"削除"};
 nas.uiMsg.Update	={en:"Update"		,ja:"更新"};
 nas.uiMsg.IMset		={en:"ImputMedias"	,ja:"入力メディア登録"};
 nas.uiMsg.IMedit	={en:"edit IM"		,ja:"入力メディア編集"};
 nas.uiMsg.OMset		={en:"OutputMedias"	,ja:"出力メディア登録"};
 nas.uiMsg.OMedit	={en:"edit OM"		,ja:"出力メディア編集"};
 nas.uiMsg.ErementsFilter={en:"ErementsFilter"	,ja:"素材フィルタ"};
 nas.uiMsg.Filter	={en:"Filter"		,ja:"フィルタ"};
 nas.uiMsg.BG		={en:"BG"		,ja:"背景"};
 nas.uiMsg.Book		={en:"Book"		,ja:"BOOK"};
 nas.uiMsg.Layout	={en:"Layout"		,ja:"レイアウト"};
 nas.uiMsg.Cell		={en:"Cell"		,ja:"セル"};
 nas.uiMsg.Frame		={en:"Frame"		,ja:"フレーム"};
 nas.uiMsg.Xsheet	={en:"Xsheet"		,ja:"タイムシート"};
 nas.uiMsg.Drawing	={en:"Drawing"		,ja:"動画"};
 nas.uiMsg.KeyDrawing	={en:"KeyDrawing"	,ja:"原画"};
 nas.uiMsg.Sounds	={en:"Sounds"		,ja:"サウンド"};
 nas.uiMsg.othet		={en:"other"		,ja:"その他"};
 nas.uiMsg.NORMAL	={en:"NORMAL"		,ja:"通常"};
 nas.uiMsg.MULTIPLY	={en:"MULTIPLY"		,ja:"乗算"};
 nas.uiMsg.LIGHTEN	={en:"LIGHTEN"		,ja:"比較（明）"};
 nas.uiMsg.DARKER	={en:"DARKER"		,ja:"比較（暗）"};
 nas.uiMsg.DIFFERENCE	={en:"DIFFERENCE"	,ja:"差の絶対値"};
 nas.uiMsg.SILHOUETTE_LUMA={en:"SILHOUETTE_LUMA"	,ja:"シルエットルミナンス"};
 nas.uiMsg.setGuideLayer	={en:"setGuideLayer"	,ja:"ガイドレイヤにする"};
 nas.uiMsg.withColorKey	={en:"withColorKey"	,ja:"カラーキーで白を透過"};
 nas.uiMsg.overrideAlpha	={en:"overrideAlpha"	,ja:"アルファチャンネル優先"};
 nas.uiMsg.overrideColorKey={en:"overrideColorKey"	,ja:"カラーキー優先"};
 nas.uiMsg.withSmoothing	={en:"withSmoothing"	,ja:"スムージングする"};
 nas.uiMsg.drawingFunctions={en:"drawingFunctions"		,ja:"作画機能設定"};
 nas.uiMsg.layerControl	={en:"layerControl"		,ja:"レイヤコントロール"};
 nas.uiMsg.atCreateNewLayer={en:"to Create a new Layer"	,ja:"新規レイヤ作成時に"};
 nas.uiMsg.withTransparent={en:"with transparent"		,ja:"透過させる"};
 nas.uiMsg.bgColor	={en:"bgColor of new layer"	,ja:"新規レイヤの背景色"};
 nas.uiMsg.obgColor	={en:"bgColor of overlay"	,ja:"修正レイヤの背景色"};
 nas.uiMsg.previewControl={en:"preview Control"		,ja:"プレビューコントロール"};
 nas.uiMsg.Documents	={en:"Documents"		,ja:"ドキュメント設定"};
 nas.uiMsg.Load		={en:"Load"		,ja:"読込"};
 nas.uiMsg.Save		={en:"Save"		,ja:"保存"};
 nas.uiMsg.Destruction	={en:"Destruction"	,ja:"破棄"};
 nas.uiMsg.Close		={en:"Close"		,ja:"閉じる"};
 nas.uiMsg.Cancel	={en:"Cancel"		,ja:"取消"};
//dialog messages
 nas.uiMsg.dm001={
	en:"The effect of changes in this panel is limited to the session. If you need a record of changes, please click the Save button below.",
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

/*
 nas.uiMsg.		={en:""		,ja:""};
 nas.uiMsg.		={en:""		,ja:""};
 nas.uiMsg.		={en:""		,ja:""};
*/
;
//alert(nas.uiMsg.toSource());

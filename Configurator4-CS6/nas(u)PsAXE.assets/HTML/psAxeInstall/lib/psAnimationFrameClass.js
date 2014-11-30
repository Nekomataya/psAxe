/*
	psAnimationFrameClass.jsx
	
Phostoshop CS2以降のフレームアニメーションを操作するオブジェクト

*/
//アニメウインドウ操作関数　現状取得ができないのはヘボいが今のトコはカンベン　後で整理する
/*
	復帰は不要でトレーラー内部の表示状態だけセットするスクリプトをまず作る
	フレームは初期化！
	setDly(myTime)
		フレームにディレイを設定する　継続時間とほぼ同一だが最短時間は保証されない
	duplicateFrame()
		カレントフレームを複製する
	selectFrame(index)
		フレームを選択する Indexは整数（1オリジン）単独選択でカレントが移動
	selectFramesAll()
		全フレーム選択
	removeSlection()
		選択フレームを削除　ただし全削除を行なっても仕様上フレームカウントが0にはならない。必ずフレームID-0が残る
	activateFrame(kwd)
		カレントフレームを移動する　kwd = Nxt ,Prvs,Frst　(各4bite)
	countFrames()
		アニメーフレームの現在の数をカウントする。ひどく裏技だけどまあ、使えるからヨシ
*/
setDly         =nas.axeAFC.setDly;
dupulicateFrame=nas.axeAFC.dupulicateFrame;
selectFrame    =nas.axeAFC.selectFrame;
selectFramesAll=nas.axeAFC.selectFramesAll;
removeSelection=nas.axeAFC.removeSelection;
activateFrame  =nas.axeAFC.activateFrame;
convertFrs2Lyrs=nas.axeAFC.convertFrs2Lyrs;
countFrames    =nas.axeAFC.countFrames;
intFrames      =nas.axeAFC.initFrames;
chgModeNLPF    =nas.axeAFC.chgModeNLPF;
activateFrame  =nas.axeAFC.activateFrame
focusTop       =nas.axeAFC.focusTop
goFrame        =nas.axeAFC.goFrame
//ラッパ関数になりました。そのうち置換するよ　置換がおわったらこのファイルは不要 2011.08.20

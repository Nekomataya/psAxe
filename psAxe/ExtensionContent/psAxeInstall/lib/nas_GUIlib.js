/*
 *	nas 簡易GUIライブラリ
 *
 *	$Id: nas_GUIlib.js,v 1.3 2012/02/05 23:31:35 kiyo Exp $
 *	AE等のAdobe Script 環境で比較的平易なGUI記述をサポートします。
 *	nas.GUI.Grid(left,top,width,height)::returns [bounds-Array]
 *	パネル動作に対応開始 2007/08/09
 *	パレットに最小化機能作成 2007/08/21
 */
 myFilename=("$RCSfile: nas_GUIlib.js,v $").split(":")[1].split(",")[0];
 myFilerevision=("$Revision: 1.3 $").split(":")[1].split("$")[0];

// 
/*
try {
	nas.Version["GUI-lib"]="GUI-lib:"+myFilename+" :"+myFilerevision;
}catch(err){
	alert("nasツールの読み込みに失敗しました。");
}
*/

	nas.Version["GUI-lib"]="GUI-lib:"+myFilename+" :"+myFilerevision;

// GUI Setup
	nas["GUI"] = new Object();

/*
	Photoshopにsettingsオブジェクトがない
*/
if(app.name.match(/AfterEffects/i)){
/*AE専用
	UIレベル設定　現状は
	0:最初のAE6.5基準
	1:listbox等itemクラスの拡張
	2:ScriptUiImageの拡張
	3:SCriptUI.newImageメソッドの拡張
*/
	nas.GUI.UIlvl=(app.version.split(".")[0]<7)? 0:2;

// セッティング取り込み
	if(app.settings.haveSetting("nas","winOffset"))
	{
	nas.GUI.winOffset=eval(app.settings.getSetting("nas","winOffset"));
	}else{
	nas.GUI.winOffset=new Object();
	}
	if(app.settings.haveSetting("nas","currentFolder"))
	{
	nas.GUI.currentFolder=new Folder(app.settings.getSetting("nas","currentFolder"));
	}else{
	nas.GUI.currentFolder=Folder.current;
	}
/*
チョト考慮中まだsetteigsには入れない 01/26
そもそもsettingsに記録するならpath_Stringにしておかないとまずそう。
	if(app.settings.haveSetting("nas","workBases"))
	{
	nas.GUI.workBases=eval(app.settings.getSetting("nas","workBases"));
	}else{
	nas.GUI.workBases=new Object();
	}
 */
//シャットダウン処理
nas.GUI.shutdown=function()
	{
		app.settings.saveSetting("nas","winOffset",nas.GUI.winOffset.toSource());
		app.settings.saveSetting("nas","currentFolder",nas.GUI.currentFolder.fsName);
	};
}else{
/*　AE以外用
	UIレベル判定　現状は
	0:最初のAE6.5基準
	1:listbox等itemクラスの拡張
	2:ScriptUiImageの拡張
	3:SCriptUI.newImageメソッドの拡張
*/
	nas.GUI.UIlvl=(app.version.split(".")[0]<9)? 0:1;
// セッティング取り込み
	nas.GUI.winOffset=new Object();
	nas.GUI.currentFolder=Folder.current;
/*
チョト考慮中まだsetteigsには入れない 01/26
そもそもsettingsに記録するならpath_Stringにしておかないとまずそう。
	if(app.settings.haveSetting("nas","workBases"))
	{
	nas.GUI.workBases=eval(app.settings.getSetting("nas","workBases"));
	}else{
	nas.GUI.workBases=new Object();
	}
 */

//シャットダウン処理
nas.GUI.shutdown=function()
	{
		;//AE7(バグ)・AE以外のアプリケーションのために自前ルーチンが必要…どしましょ
	};
}

//簡易GUIライブラリ 基礎プロパティ
	nas.GUI.leftMargin=4;
	nas.GUI.rightMargin=4;
	nas.GUI.topMargin=2;
	nas.GUI.bottomMargin=10;

	nas.GUI.leftPadding=8;
	nas.GUI.rightPadding=8;
	nas.GUI.topPadding=2;
	nas.GUI.bottomPadding=2;

	nas.GUI.colUnit=60;
	nas.GUI.lineUnit=26;

	nas.GUI.defaultWinsize=[8,6];//指定なしの場合のウィンドウサイズ(unit)
	nas.GUI.dafaultOffset=[240,40];//指定なしの場合のウインドウ初期位置(px)
	nas.GUI.defaultName="No Name";//ウインドウタイトルデフォルト

//GUI要記録設定
//	nas.GUI.currentFolder=Folder.current;//最終アクセスフォルダ
	nas.GUI.prevCurrentFolder=Folder.current;//AEサイド最終アクセスフォルダ退避用オブジェクト
//作業ベースヒストリ保存オブジェクト パスを文字列(fsName)で格納 プラットフォーム依存
//設定移行不能 読み込み時に無効フォルダを捨てる処理検討
	nas.GUI.workBase=new Array();//
//		ヒストリ保存数はここで設定 ?
		nas.GUI.workBase[0]=Folder(nas.GUI.currentFolder.path).fsName;//ひとつ上

		nas.GUI.workBase.maxLength=4;//最大値
		nas.GUI.workBase.selected=0;//現在のフォルダ
		nas.GUI.workBase.current= function()
		{
			return this[this.selected];//カレントを返す
		};
		nas.GUI.workBase.insert= function(newFolder)
		{
	//既存のエントリに同じフォルダがあればそれをアクティブにして終了
	//引数はオブジェクトと文字列両方を受け入れ
			if (newFolder instanceof Folder)
			{
				newFolder=newFolder.fsName;
			};
			for(id=0;id<this.length;id++)
			{
				if(newFolder == this[id])
				{
					this.selected=id;return this[id];
				};
			};
	//ループ抜けたら新規フォルダなのでエントリを追加
			this[(this.selected+1)%this.maxLength]=newFolder;
			this.selected=(this.selected+1)%this.length;
			return this[this.selected];//挿入
		};
		nas.GUI.workBase.change= function()
		{
			this.selected=(this.length+this.selected-1)%this.length;
			return this[this.selected];//ひとつズラす
		};

//	nas.GUI.winOffset=new Object();//ウィンドウオフセット記録オブジェクト

//var isWindows=(system.osName.match(/Windows/))? true : false;
var isWindows=(Folder.system.name.match(/SYSTEM32/i))? true : false;

if(isWindows){
	nas.GUI.LineFeed="\x0d\x0a";
}else{
	nas.GUI.LineFeed="\x0d";
};
	nas.GUI.quartsOffset=(isWindows)? 0:3;//Macの場合4pxボタン等の高さを減ずる

/*
	edittextに初期状態で256バイトでペーストや手入力が打ち止めになる現象がある。
	スクリプトでのデータ追加を行うと動的にメモリが確保されているようなので、
	これは、edittextに無理やり空白を追加してフラッシュするメソッド。
	このバグが解消したら不要。	引数はループ回数。1回アタリ1kb
*/
nas.GUI.addBuf_ = function (KB)
{
	var xStr="";
	for(m=0;m<KB;m++){for(n=0;n<1024;n++) xStr+=" "};
	this.text +=xStr;
	this.text ="";
	return this.text;
};

//エレメントのスクリーン座標を返す関数

nas.GUI.screenLocation=function(baseObject)
{
	var myX=0;
	var myY=0;
	targetObject=baseObject;
	while (targetObject){
		myX+=targetObject.bounds.x;
		myY+=targetObject.bounds.y;
		targetObject=targetObject.parent;
	}
	return [myX,myY];
}

//グリッド位置計算メソッド(bounds配列を返す)
nas.GUI.Grid = function (col,line,width,height,parent)
{
var M=(parent.type=="panel")?0:1;
	left	= (col * this.colUnit) + this.leftMargin*M + this.leftPadding;
	top	= (line * this.lineUnit) + this.topMargin*M + this.topPadding;
	right	= left*1 + width*this.colUnit - this.rightPadding -this.leftPadding;
	bottom	= (height <= this.lineUnit) ?
top*1 + height*this.lineUnit - this.bottomPadding - this.topPadding - this.quartsOffset : top*1 + height*this.lineUnit - this.bottomPadding - this.topPadding;

//	alert( [left,top,right,bottom]);
	return [left,top,right,bottom];
};
//
//ウインドウ作成メソッド(AE専用?ダイアログとパレットしかできません)
/*	nas.GUI.newWindow(Type,Name,width,height,offsetX,offsetY)
高さ、幅の指定でウインドウを作成する
ウインドウタイプ以外は全て省略可能

引数：
	Type	String	"dialog" or "palette"
	Name	String	window name text[省略可能]
	width	Number	ウインドウ幅を列数で(少数指定可)[省略可能]
	heiht	Number	ウインドウ高さを行数で(少数指定可)[省略可能]
	offsetX	Number	初期表示位置X (pixel)[省略可能]
	offsetY	Number	初期表示位置Y (pixel)[省略可能]

戻値：
	object Window ウインドウオブジェクト

パレットを作成した場合は最小化(タイトルラベル化)機能のついたWindowを返します。
これはAE7でウインドウの最小化機能がなくなったための処置です　
*/
nas.GUI.newWindow = function (Type,Name,width,height,offsetX,offsetY) {
//
	Type=(Type=="dialog")? "dialog":"palette";
	if(! Name){Name=nas.GUI.defaultName;};
	if(! width){width=nas.GUI.defaultWinsize[0];};
	if(! height){height=nas.GUI.defaultWinsize[1];};
	if(! offsetX){offsetX=nas.GUI.dafaultOffset[0];};
	if(! offsetY){offsetY=nas.GUI.dafaultOffset[1];};

	var resultWin=new Window(Type,Name,[offsetX,offsetY,offsetX+width*this.colUnit+this.leftMargin+this.rightMargin,offsetY+height*this.lineUnit+this.topMargin+this.bottomMargin]);
	if(Type=='palette'){
//パレットの場合だけウィンドウタイトルをラベルで表示する。
if(this.UIlvl>=0){
	resultWin.titleLabel=resultWin.add
		(
		"button"
		,[	this.leftMargin+this.leftPadding,
			this.topMargin+this.topPadding,
			width*this.colUnit-(this.leftPadding+this.rightPadding),
			this.lineUnit-(this.topPadding+this.bottomPadding)
		],
		Name
		);
	resultWin.titleLabel.minimize=false;
//ボタンに最小化機能をつける
	resultWin.titleLabel.onClick=function(){
var bods=this.parent.bounds;
//writeLn(bods);

this.backupBaoundsLeft=this.parent.bounds.left;
this.backupBaoundsTop=this.parent.bounds.top;

//writeLn([this.parent.bounds.left,this.parent.bounds.top].toString());

		if(this.minimize){

			myBounds=[
				this.backupBaoundsLeft,
				this.backupBaoundsTop,
				this.backupBaoundsLeft+this.backupBaoundsWidth,
				this.backupBaoundsTop+this.backupBaoundsHeight
			];

//this.parent.bounds.width	=this.backupBaoundsWidth;
//this.parent.bounds.height	=this.backupBaoundsHeight;
			this.minimize=false;
		}else{
			this.backupBaoundsWidth=this.parent.bounds.width;
			this.backupBaoundsHeight=this.parent.bounds.height;

			myBounds=[
				this.backupBaoundsLeft,
				this.backupBaoundsTop,
				this.backupBaoundsLeft+(this.bounds.width+this.bounds.left*2),
				this.backupBaoundsTop+(this.bounds.height+this.bounds.top*2)
			];

//this.parent.bounds.width	=(this.bounds.width+this.bounds.left*2);
//this.parent.bounds.height	=(this.bounds.height+this.bounds.top*2);

			this.minimize=true;
		}
//this.parent.bounds.left	=this.backupBaoundsLeft;
//this.parent.bounds.top	=this.backupBaoundsTop;
//	writeLn(bods.toString()+" : "+this.parent.bounds.toString());

	this.parent.bounds=myBounds;
if(bods[0]!=this.parent.bounds[0])
{
	this.parent.bounds=myBounds;
	writeLn("エラー検知/調整しました")
};//AE8のバグ回避 値の再入力で何とかなる?
	};//最少化関数オワリ

	}else{
	resultWin.titleLabel=resultWin.add
		(
		"statictext"
		,[	this.leftMargin+this.leftPadding,
			this.topMargin+this.topPadding,
			width*this.colUnit-(this.leftPadding+this.rightPadding),
			this.lineUnit-(this.topPadding+this.bottomPadding)
		],
		Name
		);
}
	resultWin.titleLabel.justify='right';
		}
	return resultWin;
}
//ボタン作成メソッド
nas.GUI.addButton = function (Parent,Label,left,top,width,height)
{
return Parent.add("button",this.Grid(left,top,width,height,Parent),Label);
};
/*=====================この一角はアイコンボタン関連コードなのでAE7以前では実行されないようにする（Psならば9(CS2)）*/
//AE.PSの判定が必要　オブジェクトの有無は考査外（AE8で裏技を使っているから）
	if(nas.GUI.UIlvl>1)
	{
//ScriptUIImage取得メソッド
//腐ってるけど勘弁しちゃう
nas.GUI.newImage=function(myFile)
{
	if(this.UIlvl<2){return false};//
	if(false)
	{
		var myImage= new ScriptUI.newImage(myFile);//はやくサポートして判定式を書かせてほしい
	}else{
		if(! nas.GUI.stabWindow){nas.GUI.stabWindow=new Window("palette","nasGUIStab",[0,0,100,100])};//なかったら仮ウィンドウ作る
		if( (! myFile)||(! (myFile.exists))||(!(myFile.name.match(/\.png$/i))) ){myFile=new File(Folder.nas.path+"/nas/lib/resource/Icons/default.png")}
//var myImage=new ScriptUIImage();
		var myIconButton=nas.GUI.stabWindow.add("iconbutton",[0,0,10,10],myFile,{style:"toolbutton"});
		var myImage=myIconButton.icon;//このiconプロパティがScriptUIImageオブジェクトになってる…裏技じゃのう
//	var myIconButton=Parent.add("iconbutton",[100,100,132,132],myFile,{style:"toolbutton"});
		delete myIconButton;
		nas.GUI.stabWindow.hide();
	}
	return myImage;
};

//アイコンボタン作成メソッド
//iconButton=w.add("iconbutton",[left,top,right,bottom],File,{style:"toolbutton"});
nas.GUI.addIconButton = function (Parent,Label,left,top,width,height,myFile)
{
	if( (! myFile)||(! (myFile.exists))||(!(myFile.name.match(/\.png$/i))) ){myFile=new File(Folder.nas.path+"/nas/lib/resource/Icons/default.png")}
//var myImage=new ScriptUIImage();
	var myIconButton=Parent.add("iconbutton",this.Grid(left,top,width,height,Parent),myFile,{style:"toolbutton"});
//	var myIconButton=Parent.add("iconbutton",[100,100,132,132],myFile,{style:"toolbutton"});
	myIconButton.helpTip=Label;
	return myIconButton;
};

//システムリソースとしてアイコントレーラを作る
	nas.GUI.systemIcons=new Object();
	var myIconFolder=new Folder(nas.baseLocation.path+"/nas/lib/resource/Icons");
	var myIconFiles=myIconFolder.getFiles("*.png")
	for(var fIdx=0;fIdx<myIconFiles.length;fIdx++)
	{
		var myImageName=myIconFiles[fIdx].name.replace(/.png$/,"");
		nas.GUI.systemIcons[myImageName]=nas.GUI.newImage(myIconFiles[fIdx]);
	}

//ファイルを指定してＩｍａｇｅを返すユーティリティ関数
//同フォルダ内に同名のpngがあればそのアイコンを返し
//存在しなければ拡張子に従ったシステムアイコンを返す
nas.GUI.getIcon=function(myFile)
{
	if((! myFile)||(!(myFile.exists))){return this.systemIcons["default"]}
	if(myFile.name.match(/(.+)\.([^\.]+)$/))
	{
		var myFileName=RegExp.$1;var myFileExt=RegExp.$2;
	}else{
		var myFileName=myFile.name;var myFileExt="";
	}
	if(myFile.parent.getFiles(myFileName+".png").length)
	{
//		alert(myFile.path+"/"+myFileName+".png")
		var myImage=nas.GUI.newImage(new File(myFile.path+"/"+myFileName+".png"));
	}else{
		if(nas.GUI.systemIcons[myFileExt])
		{
			var myImage=nas.GUI.systemIcons[myFileExt];
		}else{
			var myImage=nas.GUI.systemIcons["default"];
		}
	}
	return myImage;
}
	}else{
/*アイコンボタンが必要な局面でも動作を継続させるためにダミーの画像オブジェクトや代用ボタンなどを作ればAE7以前でも何がしか動作するかも まだ未対応(2010 0308)*/
//AE7以前用の代替コード=ダミーオブジェクトに値を置く
		nas.GUI.systemIcons	=false;
		nas.GUI.newImage	=function(){return false};
		nas.GUI.getIcon	=function(){return false};
		nas.GUI.addIconButton = function (Parent,Label,left,top,width,height,myFile)
		{return this.addButton(Parent,Label,left,top,width,height);};//ラップしておく

	}
//チェックボックス作成メソッド
nas.GUI.addCheckBox = function (Parent,Label,left,top,width,height)
{
return Parent.add("checkbox",this.Grid(left,top,width,height,Parent),Label);
};
//ラジオボタン作成メソッド
nas.GUI.addRadioButton = function (Parent,Label,left,top,width,height)
{
return Parent.add("radiobutton",this.Grid(left,top,width,height,Parent),Label);
};

//staticText作成メソッド
nas.GUI.addStaticText = function (Parent,Text,left,top,width,height)
{
if(height>1){
return Parent.add("statictext",this.Grid(left,top,width,height,Parent),Text,{multiline:true});
}else{
return Parent.add("statictext",this.Grid(left,top,width,height,Parent),Text);
}
};
//EditText作成メソッド
nas.GUI.addEditText = function (Parent,Text,left,top,width,height)
{
	if(height>1){
return Parent.add("edittext",this.Grid(left,top,width,height,Parent),Text,{multiline:true});
	}else{
return Parent.add("edittext",this.Grid(left,top,width,height,Parent),Text,{multiline:false});
	}
};
//ScrollBar作成メソッド
nas.GUI.addScrollBar = function (Parent,Value,minValue,maxValue,left,top,height,align)
{
if(!align){align="right";};
switch(align){
case	"center"	:
	var alignOffset=(this.colUnit-this.lineUnit*.7)/2 -this.leftPadding;break;
case	"left"	:
	var alignOffset=0;break;
case	"right"	:;
default :
	var alignOffset=this.colUnit-(this.lineUnit*.7)- this.leftPadding;
//	 -this.leftPadding;
}
var barBaunds=this.Grid(left+alignOffset/this.colUnit,top,this.lineUnit/this.colUnit,height,Parent);

return Parent.add("scrollbar",[barBaunds[0],barBaunds[1],barBaunds[0]+Math.round(this.lineUnit*.5),barBaunds[3]],Value,minValue,maxValue);
};
//Slider作成メソッド
nas.GUI.addSlider = function (Parent,Value,minValue,maxValue,left,top,width,align)
{
if(!align){align="middle";};
switch(align){
case	"top"	:var alignOffset=0;
case	"bottom"	:var alignOffset=1;
case	"middle"	:;
default:var alignOffset=0.5;
}
return Parent.add("slider",this.Grid(left,top+alignOffset,width,0.7,Parent),Value,minValue,maxValue);
};

//Panel作成メソッド
nas.GUI.addPanel = function (Parent,Label,left,top,width,height)
{
return Parent.add("panel",[left*this.colUnit+this.leftMargin,top*this.lineUnit+(this.lineUnit/2),(width+left)*this.colUnit+this.leftMargin,(top+height)*this.lineUnit+this.topMargin],Label);
}

//複合コントロール SelectButton
/*
SelctButton.options	array(items相当)
SelctButton.selected	
SelctButton.value
SelctButton.text
SelctButton.select()
*/
nas.GUI.addSelectButton = function (Parent,Label,Select,left,top,width,height)
{
// AE7以前は元のコード　以降はネイティブのドロップダウンリストを使用するように改装
//しようかと思ったけどメソッド互換があまりに低いのでヤメ　かわりに　selectOptions　ドロップダウンリスト版を作成しようそうしよう
		var newUI =	(this.UIlvl>0)? false:false;
if(newUI){
	var mySB = nas.GUI.addPanel(Parent,"",left,top-0.5,width,height+0.5);//トレーラ初期化(文字なし)
	mySB.ddl = nas.GUI.addDropDownList(mySB,Label,Select,0,0,width,height);//リスト初期化
	if(Label instanceof Array){
		mySB.options= Label;
	}else{
		mySB.options= new Array();mySB.options[0]=Label;
	}
	mySB.selected = (Select>=mySB.options.length || Select<0 || isNaN(Select))?
	0	:	Math.floor(Select)	;
	mySB.value=mySB.options[mySB.selected];
	mySB.text="";//ボタン表示

	mySB.select=function(aRg){
	if(! aRg && aRg != 0) aRg=this.selected;
if(isNaN(aRg)){
	switch (aRg){
case	"enable":
	this.enabled=true;break;
case	"disable":
	this.enabled=false;break;
case	"prev":
	this.selected=Math.abs(this.selected-1)%this.options.length;
	this.ddl.items[this.selected].selected=true;
//	this.text=this.options[this.selected];break;
	this.value=this.options[this.selected];
	break;
case	"next":
default	:
	this.selected=(this.selected+1)%this.options.length;
	this.ddl.items[this.selected].selected=true;
//	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
	}
}else{
	this.selected=Math.abs(Math.floor(aRg) % this.options.length);
	this.ddl.items[this.selected].selected=true;
//	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
}
//	this.onChange();
	};
//onChangeのさいに更新するプロパティ
//this.value
//this.selected
//this
//mySB.onClick= function(){this.select("next");};
mySB.ddl.onChange= function(){
	this.parent.select(this.selection.index);
};
}else{
	var mySB = Parent.add("button",this.Grid(left,top,width,height,Parent),"");//ボタン初期化(文字なし)
	if(Label instanceof Array){
		mySB.options= Label;
	}else{
		mySB.options= new Array();mySB.options[0]=Label;
	}
	mySB.selected = (Select>=mySB.options.length || Select<0 || isNaN(Select))?
	0	:	Math.floor(Select)	;
	mySB.value=mySB.options[mySB.selected];
	mySB.text=mySB.value;//ボタン表示

	mySB.select=function(aRg){
	if(! aRg && aRg != 0) aRg=this.selected;
if(isNaN(aRg)){
	switch (aRg){
case	"enable":
	this.enabled=true;break;
case	"disable":
	this.enabled=false;break;
case	"prev":
	this.selected=Math.abs(this.selected-1)%this.options.length;
	this.text=this.options[this.selected];break;
	this.value=this.options[this.selected];
case	"next":
default	:
	this.selected=(this.selected+1)%this.options.length;
	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
	}
}else{
	this.selected=Math.abs(Math.floor(aRg) % this.options.length);
	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
}
//	this.onChange();
	};
//mySB.onClick= function(){this.select("next");};
mySB.onClick= function(){
	var myLocation=nas.GUI.screenLocation(this);
	this.select(nas.GUI.selectOptions(
		this.options,
		this.selected,
		this
	));
	this.onChange();
};
}
//mySB.onClick= function(){nas.GUI.selectOptions(this.options,this.selected,this.bounds[0],this.bounds[1],(this.bounds[2]-this.bounds[0])/nas.GUI.colUnit,this.);};
mySB.onChange=function(){return;};
return mySB;
}
/* AE8以降のネイティブDropDownList
 *
 * addDropDownList = function (親,オプション,選択ID,X,Y,幅,高さ,動作オプション)
 *	親 : 
 *	オプション : 
 *	選択状態 :
 *	X,Y :
 *	幅,高さ :**高さはリスト表示段数
 *	動作オプション : 
 *  オリジナルのドロップダウンリストを設定する。ネイティブ動作する
 *	元のnasセレクトボタンは別オブジェクトとして維持する
 */
nas.GUI.addDropDownList = function (Parent,Options,Select,left,top,width,height,props)
{
		if(!(Options instanceof Array)) {
		Options=[Options];
	}
/*
		if(!(Select)){
	var multiSelect=true;
		}else{
	var multiSelect=false;	Selected=[Selected];
		}
		*/
		if(! props){
	var myDDL = Parent.add("dropdownlist",this.Grid(left,top,width,height,Parent),"");	
		}else{
	var myDDL = Parent.add("dropdownlist",this.Grid(left,top,width,height,Parent),"",props);	
		}
	//add items
	for(var itmIdx =0;itmIdx<Options.length;itmIdx++){myDDL.add("item",Options[itmIdx]);}
	
	//select item
		if(! isNaN(Select)){
			myDDL.items[Select].selected=true;
		}
	return myDDL;
}
/* AE8以降のネイティブListBox
 *
 * addListBoxO = function (親,オプション,選択状態,X,Y,幅,高さ,動作オプション)
 *	親 : 
 *	オプション :要素配列
 *	選択状態 :選択リスト配列
 *	X,Y :
 *	幅,高さ :**高さはリスト表示段数
 *	動作オプション : 
 *  オリジナルのリストボックスを設定する。こちらはネイティブ動作する
 *	元のnasリストボックスはAE8以降ではラッパとして動作する
 */
nas.GUI.addListBoxO = function (Parent,Options,Selected,left,top,width,height,props)
{
		if(!(Options instanceof Array)) {
			Options=[Options];
		}
		if(Selected instanceof Array){
			var multiSelect=true;
//			props={multiselect:true}
		}else{
			var multiSelect=false;	Selected=[Selected];
//			props={multiselect:false}
		}
		if(! props){
	var myLB = Parent.add("listbox",this.Grid(left,top,width,height,Parent),Options);	
		}else{
	var myLB = Parent.add("listbox",this.Grid(left,top,width,height,Parent),Options,props);	
		}
		if(Selected.length>0){
	for(var slIdx=(Selected.length-1);slIdx>=0;slIdx--){
		for(itmIdx=0;itmIdx<myLB.items.length;itmIdx++){
		if(myLB.items[itmIdx].index==Selected[slIdx]){myLB.items[itmIdx].selected=true;}
		}
	};
		}
	return myLB;
}
/*	複合コントロール ListBox
 *
 * addListBox = function (親,オプション,選択状態,X,Y,幅,高さ,動作オプション)
 *	親 : 
 *	オプション : 
 *	選択状態 :
 *	X,Y :
 *	幅,高さ :**高さはリスト表示段数
 *	動作オプション :
 set()
 select()
 */
nas.GUI.addListBox = function (Parent,Options,Selected,left,top,width,height,option)
{
// AE7以前は元のコード　以降は本来のリストボックスを使用するように改装
	var newUI =	(this.UIlvl>=1)? true:false;
//リストボックスの配列数は自由・表示エレメント数は height
	if(!(Options instanceof Array)) {
		Options=[Options];
	}
	if(Selected instanceof Array) 
	{
		//selected引数の入力形式 [index,index,in...] / index / null を
		//内部形式(ブーリアンの配列)に揃える
			new_selected=new Array(Options.length);
		for(idx=0;idx<Options.length;idx++)
		{
			new_selected[idx]=false;
		}
		for(idx=0;idx<Selected.length;idx++)
		{
			if((! isNaN(Selected[idx])) && Selected[idx]<new_selected.length && Selected[idx]>=0 )
			{
				new_selected[Math.floor(Selected[idx])]=true;
			}
		}
		Selected=new_selected;
	}else {
		if(isNaN(Selected) || Selected==null ||Selected >= Options.length || Selected < 0)
		{
			Selected=new Array(Options.length);
			for(idx=0;idx<Selected.length;idx++)
			{
				Selected[idx]=false;
			}
		}else{
			var new_selected=new Array(Options.length);
			for(idx=0;idx<new_selected.length;idx++)
			{
				new_selected[idx]=(idx==Selected)?true:false;
			}
			Selected=new_selected;
		}
	}
//親パネル設定
	var myLB =nas.GUI.addPanel(Parent,"",left,top,width,height+.5);
		myLB.multiSelect =(option=="multiselect")?true:false;//マルチセレクトフラグ
		myLB.editable =(option=="editable")?true:false;//?
		myLB.DisplayHeight =height;//表示最大高さ
//ラベルテキスト(編集可能な場合のみ作成)
		if(myLB.editable){
			myLB.bounds=[left*this.colUnit+this.leftMargin,top*this.lineUnit+(this.lineUnit/2),(width+left)*this.colUnit+this.leftMargin,(top+height+1.5)*this.lineUnit+this.topMargin];
			myLB.labelText =nas.GUI.addEditText(myLB,"",0,.1,width-0.3,1);
		}

//値セットメソッド
	myLB.set=function(myValue){
			return;//後で書く
	}
//インデックス選択メソッド
		myLB.select=function(myIndex){
			if((myIndex>=0)&&(myIndex<this.options.length)){
				var newSelected=new Array();
				for(var idx=0;idx<this.options.length;idx++){
					if(this.multiSelect){
						if(myIndex==idx){newSelected[idx]=(this.checks[idx])?false:true}else{newSelected[idx]=this.checks[idx]};//multi
					}else{
						if(myIndex==idx){newSelected[idx]=(this.checks[idx])?false:true}else{newSelected[idx]=false};//single
					}
					this.setOptions(this.options,newSelected);
				};
				return this.checks[myIndex];
			}
			return false;
		}

if(newUI)
{
//ネイティブリストボックスを作成＋初期化
		var boxOffset=(myLB.editable)?1:0;
		if(myLB.multiSelect)
		{
	myLB.listBox= nas.GUI.addListBoxO(myLB,Options,Selected,0,boxOffset,width,height,{multiselect:true});
		}else{
	myLB.listBox= nas.GUI.addListBoxO(myLB,Options,Selected,0,boxOffset,width,height);
		}
//	myLB.display= new Array(Options.length);

//初期化兼用 オプション(再)設定
	myLB.setOptions = function (newOptions,newSelected)
	{
		this.options= new Array(newOptions.length);
		this.checks= new Array(newOptions.length);
		this.listBox.removeAll();//クリア
		//リストボックスのアイテムコレクションを初期化
		for(n=0;n<newOptions.length;n++){
			this.options[n]=newOptions[n];
			var myItem=this.listBox.add("item",newOptions[n]);
			this.checks[n]=(newSelected[n])?true:false;
		};
		for(n=0;n<this.listBox.items.length;n++){
			this.listBox.items[n].selected=(newSelected[n])?true:false;
//			this.listBox.items[n].selected=this.checks[n]
		};
	
	if(this.checks.length!=this.listBox.items.length){alert("err")};
//value初期値設定
		if(this.multiSelect)
		{
			this.value=new Array();
			this.selected=new Array();
			for(id=0;id<this.checks.length;id++)
			{	if(this.checks[id])
				{
					this.value.push(this.options[id]);
					this.selected.push(id);
				}
			}
			if(myLB.editable){
//選択テキスト表示
				if(this.value.length==0)
				{
					this.labelText.text="<no-selected>";
				}else{
					if(this.value.length==1){this.labelText.text=this.value[0];
					}else{
						this.labelText.text="<<multi-selected>>";
					}
				}
			}
		}else{
			for(id=0;id<this.checks.length;id++){if(this.checks[id]){break;}}

			this.value=(id<this.checks.length)?this.options[id]:null;
			this.selected=(this.value)?id:null;
			if(myLB.editable){
//選択テキスト表示
				this.labelText.text=(this.value)?this.value:"<no-selected>";
			}
		}

	};
//初期化実行
	myLB.setOptions(Options,Selected);

//チェック動作メソッド
	myLB.check=function(id)
	{
		if(this.multiSelect)
		{
			//マルチセレクト
//			if(id) {this.checks[id]=this.listBox.items[id].selected};//値を更新
			this.value=new Array();
			this.selected=new Array();
			for(var idx=0;idx<this.options.length;idx++)
			{
				this.checks[idx]=this.listBox.items[idx].selected;
				if(this.listBox.items[idx].selected)
				{
					this.value.push(this.options[idx].toString());
					this.selected.push(idx);

				}
			}
		}else{//シングルセレクト
			if((id>=0)&&(id<this.options.length))
			{
				this.value=this.options[id].toString();
				//プロパティ更新
				this.selected=id;
			}else{
				this.value=null
				//プロパティ更新
				this.selected=null;
			}
				//プロパティ更新
			if(id) {
//if(dbg)	nas.otome.writeConsole(this.checks.length+" | "+this.listBox.items.length);
				for(var idx=0;idx<this.checks.length;idx++)
				{
					this.checks[idx]=(this.listBox.items[idx])?this.listBox.items[idx].selected:false;
				}
			};//値を更新
//	if(this.checks[optId]){this.selected=optId;}else{this.selected=null;}
		}
		if(myLB.editable){
//	選択テキスト更新
			if(this.multiSelect)
			{
				if(this.value.length==0)
				{
					this.labelText.text="<no-selected>";
				}else{
					if(this.value.length==1){this.labelText.text=this.value[0];
					}else{
						this.labelText.text="<<multi-selected>>";
					}
				}
			}else{
				this.labelText.text=(this.value == null)?"":this.value;
			}
		}
//	this.onChange();
	};
	if(myLB.editable){

//エディットボックス変更
		myLB.labelText.onChange=function()
		{
			this.parent.value=this.text;//値を更新
			var myItem=this.parent.listBox.find(this.text);
			if(myItem){var myIndex=myItem.index}else{var myIndex=myItem};
			this.parent.selected=myIndex;
			if(myIndex)
			{
				this.parent.checks[myIndex]=true;
				this.parent.listBox.items[myIndex].selected=true;
			}
			for(var idx=0;idx<this.parent.checks.length;idx++)
			{
				if(idx!=myIndex)
				{
					this.parent.checks[idx]=false;
				}
			}
			this.parent.onChange();
		}
	}
//listBox変更
	myLB.listBox.onChange=function()
	{
		if(this.selection instanceof ListItem)
		{
			//シングルセレクト
			this.parent.check(this.selection.index);
		}else{
			//マルチセレクト
			if((this.selection)&&(this.selection.length))
			{
				this.parent.check(this.selection[0].index)
			}else{
				this.parent.check(null)
			}
		}		
		this.parent.onChange();
	}
//listBox変更(changing)
//	myLB.listBox.addEventListener("click",function(){alert("click")});
}else{	
//リスト用チェックボックス作成
		myLB.display= new Array(myLB.DisplayHeight);
		var boxOffset=(myLB.editable)?1:0;
		for(n=0;n<myLB.DisplayHeight;n++)
		{//チェックボックス作成
			myLB.display[n]=nas.GUI.addCheckBox(myLB,"",0,n+(boxOffset*1.1),width-0.7,1);
			myLB.display[n].value=false;
			myLB.display[n].id=n;
			myLB.display[n].onClick=function(){this.parent.check(this.id);};
//			myLB.display[n].hide();
		};

//表示範囲移動スクロールバー
		myLB.ChgRange=nas.GUI.addScrollBar(myLB,0,0,0,width-1,boxOffset*.9,myLB.DisplayHeight,"right");
//		myLB.ChgRange.viewOffset=0;//スクロールバーのvalueを使用

//初期化兼用 オプション(再)設定
	myLB.setOptions = function (newOptions,newSelected)
	{
		this.options= new Array(newOptions.length);
		this.checks= new Array(newOptions.length);
		for(n=0;n<newOptions.length;n++){
			this.options[n]=newOptions[n];
			this.checks[n]=(newSelected[n])?true:false;
		};

		this.DisplayLines=(this.DisplayHeight<newOptions.length)?this.DisplayHeight:newOptions.length;
		for(n=0;n<this.DisplayHeight;n++)
		{//チェックボックス表示
	if(n < this.DisplayLines)
	{
//		this.display[n].text="\[ "+n+" \] "+this.options[n].toString();
		this.display[n].text=this.options[n].toString();
		this.display[n].value=(this.checks[n])? true:false;
		this.display[n].show();
	}else{
		this.display[n].text="";
		this.display[n].value=false;
		this.display[n].hide();
	}
		}
//value初期値設定
		if(this.multiSelect)
		{
			this.value=new Array();
			this.selected=new Array();
			for(id=0;id<this.checks.length;id++)
			{	if(this.checks[id])
				{
					this.value.push(this.options[id]);
					this.selected.push(id);
				}
			}
			if(myLB.editable){
//選択テキスト表示
				if(this.value.length==0)
				{
					this.labelText.text="<no-selected>";
				}else{
					if(this.value.length==1){this.labelText.text=this.value[0];
					}else{
						this.labelText.text="<<multi-selected>>";
					}
				}
			}
		}else{
			for(id=0;id<this.checks.length;id++)
				{if(this.checks[id]){break;}}
			this.value=(id<this.checks.length)?this.options[id]:null;
			this.selected=(this.value)?id:null;
			if(myLB.editable){
//選択テキスト表示
				this.labelText.text=(this.value)?this.value:"<no-selected>";
			}
		}
//表示範囲移動スクロールバー初期化
		if(this.options.length<this.DisplayLines)
		{
			this.ChgRange.hide();
		}else{
			this.ChgRange.maxvalue=this.options.length-this.DisplayLines;
			this.ChgRange.value=0;//スタートに戻す
			this.ChgRange.show();
		}
	};
//初期化実行
	myLB.setOptions(Options,Selected);

//表示範囲移動スクロールバーメソッド
	myLB.ChgRange.onChange=function()
	{
		for(idx=0;idx<this.parent.DisplayLines;idx++){
		var id=idx+Math.round(this.value);
//		this.parent.display[idx].text="\[ "+id.toString()+" \] "+this.parent.options[id];
		this.parent.display[idx].text=this.parent.options[id];
		this.parent.display[idx].value=this.parent.checks[id];
		}
	}
//チェック動作メソッド
	myLB.check=function(id)
	{
		if(this.multiSelect)
		{//マルチセレクト
			this.checks[id+Math.round(this.ChgRange.value)]=this.display[id].value;//値を更新
			this.value=new Array();
			this.selected=new Array();
			for(var idx=0;idx<this.options.length;idx++)
			{
				if(this.checks[idx])
				{
					this.value.push(this.options[idx].toString());
					this.selected.push(idx);
				}
			}
		}else{//シングルセレクト
			var optId = id+Math.round(this.ChgRange.value);//オプションID
			this.checks[optId]=(this.checks[optId])?false:true;//値更新
//	オプションスキャン
			for(var idx=0;idx<this.options.length;idx++)
			{//対象外を更新
				if(idx!=optId){this.checks[idx]=false};
			}
			for(var idx=0;idx<this.DisplayLines;idx++)
			{//表示更新
				this.display[idx].value=this.checks[idx+Math.round(this.ChgRange.value)];
//				this.display[idx].text="\[ "+Math.floor(idx+this.ChgRange.value).toString()+" \] "+this.options[Math.floor(idx+this.ChgRange.value)];
				this.display[idx].text=this.options[idx+Math.round(this.ChgRange.value)];
			}
			this.value=(this.checks[optId])?this.options[optId].toString():null;//プロパティ更新
			//プロパティ更新
	if(this.checks[optId]){this.selected=optId;}else{this.selected=null;}
		}
		if(myLB.editable){
//	選択テキスト更新
			if(this.multiSelect)
			{
				if(this.value.length==0)
				{
					this.labelText.text="<no-selected>";
				}else{
					if(this.value.length==1){this.labelText.text=this.value[0];
					}else{
						this.labelText.text="<<multi-selected>>";
					}
				}
			}else{
				this.labelText.text=this.value;
			}
		}
	this.onChange();
	};
	if(myLB.editable){

//エディットボックス変更
		myLB.labelText.onChange=function()
		{
			this.parent.value=this.text;//値を更新
			var noSelect=true;
			for(var idx=0;idx<this.parent.checks.length;idx++)
			{
				if(this.parent.options[idx]==this.text)
				{
					noSelect=false;
					this.parent.checks[idx]=true;
					this.parent.selected=idx;
				}else{
					this.parent.checks[idx]=false;
				}
			}
			if(noSelect){this.parent.selected=null;}
			for(var idx=0;idx<this.parent.display.length;idx++)
			{	this.parent.display[idx].value=this.parent.checks[idx+Math.round(this.parent.ChgRange.value)];}
			this.parent.onChange();
		}
	}
}
//リストボックスにonChangeを作成(何もしない。ユーザ側でオーバライドする)
	myLB.onChange=function(){return;};

//設定したリストボックスを返す
return myLB;
}

//複合コントロール TabPanel
//暫定版、現在ウインドウに付き1組のタブ限定です。
//与えられた親エレメントに直接タブを埋めます。
//	戻り値は 選択されているタブID (不要かも？)
//タブ自身を指すオブジェクト（エレメント）がありません。
//タブパネルにアクセスする際は
//	Parent["tabPanel"][id].<property or method> こんな感じで　
//id　は、0からの配列idです。
nas.GUI.setTabPanel = function (Parent,TabNames,left,top,width,height)
{
	if(! TabNames instanceof Array){TabNames=[TabNames];};
//切り換えボタン作成
	Parent.tabSelector=new Array();
	var btw=1.5;//ボタン幅
	var startLeft=width-(btw*TabNames.length);
	for (var n=0 ; n < TabNames.length ; n++){

		Parent.tabSelector[n]=nas.GUI.addButton(Parent,TabNames[n],startLeft+(btw*n),top,btw,0.8);
//		Parent.tabSelector[n]=nas.GUI.addButton(Parent,TabNames[n],1+left+(btw*n),top,btw,1);
		Parent.tabSelector[n].id=n;
		Parent.tabSelector[n].onClick=function(){
	this.parent.selectTab(this.id);
		}
	}

	Parent.tabSelector[0].enabled=false;//セレクト状態？

//タブ用パネル作成
	Parent.tabPanel=new Array();
	for (n=0 ; n < TabNames.length ; n++){
		Parent.tabPanel[n] =
		nas.GUI.addPanel(Parent,"",left,top+0.5,width,height-0.5);
//		nas.GUI.addPanel(Parent,TabNames[n],left,top,width,height);
//		Parent.tabPanel[n].hide()
	};
//切り換えメソッド設定　0<=id<=this.length 数値のみ
	Parent.selectedTab=0;//タブ選択変数
Parent.selectTab = function(id)
{
	if(isNaN(id)){return false;}
	this.selectedTab=Math.round(Math.abs(id)) % this.tabPanel.length
	for (n=0 ; n < this.tabPanel.length ; n++){
		if(n==id){
		this.tabSelector[n].enabled=false;
		this.tabPanel[n].show();
		}else{
		this.tabSelector[n].enabled=true;
		this.tabPanel[n].hide();
		}
	}
}

Parent.selectTab(0);
//	戻す
return Parent.selectedTab;
}


//配列2つをたばねて操作するオブジェクト セレクトボタン等で結構使うけど…
//	なんかもっと良い方法が有りそうな気もする。が、とりあえず。コンストラクタにしておく
function nTable()
{
//	this.names =new Array();
	this.bodys =new Array();
	this.length =0;//
	this.selected =0;//index
	this.selectedName = "";//第一フィールド
	this.selectedRecord =null;
}

	nTable.prototype.select= function(idx)
	{
		if(!isNaN(idx)){
			this.selected =Math.floor((idx+this.bodys.length)% this.bodys.length);
		}else{
switch(idx){
case "next":	this.selected ++;this.selected = this.selected % this.bodys.length ; break;
case "prev":	this.selected --;this.selected = (this.selected + this.bodys.length) % this.bodys.length ; break;
default :	this.selected=this.selected % this.bodys.length;
}
		}
		this.selectedRecord=this.bodys[this.selected];
		this.selectedName=this.bodys[this.selected][0];
		if(this.onChange){this.onChange()};
		return this.bodys[this.selected];
	};

	nTable.prototype.names=function(id)
	{
		if(! id)id=0;
		myNames=new Array();
		if(isNaN(id))
		{
			for (ix=0;ix<this.bodys.length;ix++){myNames.push(this.bodys[ix].join("/"));};
		}else{
			for (ix=0;ix<this.bodys.length;ix++){myNames.push(this.bodys[ix][id]);};
		}
		return myNames;
	}

	nTable.prototype.push= function(nAme,bOdy)
	{
		if(!(bOdy instanceof Array)) bOdy=[bOdy];
		this.bodys.push([nAme].concat(bOdy))
		this.length=this.bodys.length;
		this.select(-1);
	}
	nTable.prototype.pop= function()
	{
		this.bodys.pop();
		this.length=this.bodys.length;
//		this.select(this.selected % this.length);
	}
	nTable.prototype.del= function(idx)
	{
		if(this.bodys.length<=1) return false;
		if(idx!=(this.length-1)){
			for(ix=idx;ix<(this.bodys.length-1);ix++)
			{
				this.bodys[ix]=this.bodys[ix+1];
			}
		}
		this.bodys.pop();
		this.length=this.bodys.length;
		this.select();
	}

	nTable.prototype.change= function(nAme,bOdy,idx)
	{
		if(!(bOdy instanceof Array)) bOdy=[bOdy];
		idx=idx % this.length;
		this.bodys[idx]=[nAme].concat(bOdy);
		this.select(idx);
	}
//onChangeが存在すればコールするように設定
 	nTable.prototype.onChange= function()
	{
		return;
	}

/*	ボタンリスト形式でオプションを選択する
 *	
 *		汎用的に利用　ウソ代用リストボックスおよびコンボボックスから呼び出し。
 * 		さらに一般呼出も可能
 * nas.GUI.selectOptions(オプションリスト,[選択ID[,ダイアログ位置左,上[,ダイアログ幅,ダイアログ行数]]])
 * nas.GUI.selectOptions(オプションリスト,[選択ID[,ボタンオブジェクト[,ダイアログ行数]])
 *		第二形式の場合は、ボタンオブジェクトの幅と位置を継承します。
 *
 * 	戻り値は選択されたオプションID オプションリストは、要素数2以上の配列
 *
 */
if(false){

nas.GUI.selectOptions = function(options,selectedId,left,top,width,lines)
{
//第一引数が配列でない、または配列であっても要素数が1の場合はfalseを返して終了
	if(!(options instanceof Array) || (options.length<2)){return false;};
//引数の事前処理
//	第三引数がButton/Panel/EditTextオブジェクトだった場合は、GUIオブジェクトから位置と幅を取得
//	その場合、第四引数が表示行数
	if((left instanceof Button)||(left instanceof Panel)||(left instanceof EditText)){
		var myButton=left;
		var myLocation=nas.GUI.screenLocation(myButton);//スクリーン位置取得
		lines	=top;//入れ替え
		width	=myButton.bounds.width/nas.GUI.colUnit;//幅を列数で取得
		top	=myLocation[1];
		left	=myLocation[0];
	}

	left	=(left)? left:-1;
	top	=(top)? top:-1;

	if (isNaN(selectedId)||(selectedId>=options.length)||(selectedId<0)) {selectedId=null;};

//ダイアログ作成 以前のダイアログがあった場合は無条件で削除

if(nas.GUI.optionSelector){
	if(nas.GUI.optionSelector.visible){nas.GUI.optionSelector.close();}
	delete nas.GUI.optionSelector;
};
	var winName=options[selectedId];
	nas.GUI.optionSelector	=new Window("dialog",winName,[0,0,100,100]);//仮のバウンズで初期化

	nas.GUI.optionSelector.options	=options;
	nas.GUI.optionSelector.selected	=selectedId;
	nas.GUI.optionSelector.maxLines	=(lines)?lines:7;//セレクタ高さ
	nas.GUI.optionSelector.Width	=(width)?width:2;//セレクトボタン幅
//	nas.GUI.optionSelector.selector=new Array();//セレクトボタン格納配列(後で初期化する)
	nas.GUI.optionSelector.init=function()
	{
		//	セレクタのサイズはオプション数がmaxLines以下ならオプション数
		//	それ以上の場合はmaxLinseでスクロールバーを追加(オプション数1以下は論外)
		this.displayLines=(this.options.length<this.maxLines)?this.options.length:this.maxLines;
		this.selector=new Array();
//プラットフォーム別にボタンつくる
		for (var idx=0;idx<this.displayLines;idx++)
		{
			if(isWindows){
var appleOffset=0;
				this.selector[idx]=this.add("button",[0,idx*nas.GUI.lineUnit,this.Width*nas.GUI.colUnit,(idx+1)*nas.GUI.lineUnit],this.options[idx]);
			}else{
var appleOffset=12;//どうすれ、ばいんだー
				this.selector[idx]=this.add("button",nas.GUI.Grid(0,idx+appleOffset/nas.GUI.lineUnit,this.Width,1,this),
					this.options[idx]);
			}
//
			this.selector[idx].id=idx;
			if(idx==this.selected){
				this.selector[idx].text ="* "+this.selector[idx].text +" *";
				//this.selector[idx].justify="left";
			};
			this.selector[idx].onClick=function(){this.parent.selected=this.id;this.parent.close();};
		}
//	ウィンドウのサイズをボタンサイズにフィット
		this.bounds.width	=this.Width*nas.GUI.colUnit;
		this.bounds.height	=(this.displayLines*nas.GUI.lineUnit)+appleOffset;
//	選択アイテムが表示行数を超過した場合のみセレクタにスクロールバーを設置
		if(this.displayLines<this.options.length)
		{
//	スクロールバーバウンズ
		barBounds=[
			this.bounds.width+appleOffset,
			0,
			this.bounds.width+(nas.GUI.lineUnit/2)+appleOffset,
			this.bounds.height
		];
//	バウンズを拡張
		this.bounds.width+=(nas.GUI.lineUnit/2)+appleOffset;
//	スクロールバー設置
		this.chgRange=this.add(
			"scrollbar",
			barBounds,
			0,
			0,
			this.options.length-this.displayLines
		);
//	変更メソッド
			this.chgRange.onChange=function()
			{
//alert(this.parent.selected+" / "+this.parent.options[this.parent.selected])
				for(idx=0;idx<this.parent.displayLines;idx++){

				var myIdx=idx+Math.round(this.value);//id設定ループインデックス+スクロール量
//	if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].justify="center";};
if(myIdx == this.parent.selected){
	this.parent.selector[idx].text="* "+this.parent.options[myIdx]+" *";
}else{
	this.parent.selector[idx].text=this.parent.options[myIdx];
}
//if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].text="* "+this.parent.selector[idx].text+" *";};
				this.parent.selector[idx].id=myIdx;
//	if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].justify="left";};
				}
				this.value=Math.round(this.value);//this.value=Math.floor(this.value);
			}
		}
	}
//	ダイアログを表示
	nas.GUI.optionSelector.bounds.left	= left;
	nas.GUI.optionSelector.bounds.top	= top+22;

	nas.GUI.optionSelector.init();
//	if(nas.GUI.optionSelector.chgRange)nas.GUI.optionSelector.chgRange.onChange();
//	nas.GUI.optionSelector.text=nas.GUI.optionSelector.options[nas.GUI.optionSelector.selected].toString();
	nas.GUI.optionSelector.onShow=function(){this.selector[0].active=true;};
if(left<0 || top<0)nas.GUI.optionSelector.center(); //
	nas.GUI.optionSelector.show();
	return nas.GUI.optionSelector.selected;

};

}else{
nas.GUI.selectOptions = function(options,selectedId,left,top,width,lines)
{
	var newUI=(AEVersion>=8)?true:false;
//第一引数が配列でない、または配列であっても要素数が1の場合はfalseを返して終了
	if(!(options instanceof Array) || (options.length<2)){return false;};
//引数の事前処理
//	第三引数がButtonオブジェクトだった場合は、GUIオブジェクトから位置と幅を取得
//	その場合、第四引数が表示行数
	if(left instanceof Button){
		var myButton=left;
		var myLocation=nas.GUI.screenLocation(myButton);//スクリーン位置取得
		lines	=top;//入れ替え
		width	=myButton.bounds.width/nas.GUI.colUnit;//幅を列数で取得
		top	=myLocation[1];
		left	=myLocation[0];
	}

	left	=(left)? left:-1;
	top	=(top)? top:-1;

	if (isNaN(selectedId)||(selectedId>=options.length)||(selectedId<0)) {selectedId=null;};

//ダイアログ作成 以前のダイアログがあった場合は無条件で削除

if(nas.GUI.optionSelector){
	if(nas.GUI.optionSelector.visible){nas.GUI.optionSelector.close();}
	delete nas.GUI.optionSelector;
};
	var winName=options[selectedId];
	nas.GUI.optionSelector	=new Window("dialog",winName,[0,0,100,100]);//仮のバウンズで初期化

	nas.GUI.optionSelector.options	=options;
	nas.GUI.optionSelector.selected	=selectedId;
	nas.GUI.optionSelector.maxLines	=(lines)?lines:7;//セレクタ高さ
	nas.GUI.optionSelector.Width	=(width)?width:2;//セレクトボタン幅
//	nas.GUI.optionSelector.selector=new Array();//セレクトボタン格納配列(後で初期化する)
	nas.GUI.optionSelector.init=function()
	{
		
			if(newUI){
		//	セレクタ内最大サイズでリストボックス作成
		this.selector=this.add("listbox",[0,0,this.Width*nas.GUI.colUnit,this.maxLines*nas.GUI.lineUnit],this.options);
		if(this.selected){this.selector.items[this.selected].selected=true}
		this.selector.onChange=function(){this.parent.selected=this.selection.index;this.parent.close();};

//	ウィンドウのサイズをリストボックスにフィット
		this.bounds.width	=this.Width*nas.GUI.colUnit;
		this.bounds.height	=(this.maxLines*nas.GUI.lineUnit);
			}else{
		//	セレクタのサイズはオプション数がmaxLines以下ならオプション数
		//	それ以上の場合はmaxLinseでスクロールバーを追加(オプション数1以下は論外)
		this.displayLines=(this.options.length<this.maxLines)?this.options.length:this.maxLines;
		this.selector=new Array();

//プラットフォーム別にボタンつくる
		for (var idx=0;idx<this.displayLines;idx++)
		{
			if(isWindows){
var appleOffset=0;
				this.selector[idx]=this.add("button",[0,idx*nas.GUI.lineUnit,this.Width*nas.GUI.colUnit,(idx+1)*nas.GUI.lineUnit],this.options[idx]);
			}else{
var appleOffset=12;//どうすれ、ばいんだー
				this.selector[idx]=this.add("button",nas.GUI.Grid(0,idx+appleOffset/nas.GUI.lineUnit,this.Width,1,this),
					this.options[idx]);
			}
//
			this.selector[idx].id=idx;
			if(idx==this.selected){
				this.selector[idx].text ="* "+this.selector[idx].text +" *";
				//this.selector[idx].justify="left";
			};
			this.selector[idx].onClick=function(){this.parent.selected=this.id;this.parent.close();};
		}


//	ウィンドウのサイズをボタンサイズにフィット
		this.bounds.width	=this.Width*nas.GUI.colUnit;
		this.bounds.height	=(this.displayLines*nas.GUI.lineUnit)+appleOffset;
//	選択アイテムが表示行数を超過した場合のみセレクタにスクロールバーを設置
		if(this.displayLines<this.options.length)
		{
//	スクロールバーバウンズ
		barBounds=[
			this.bounds.width+appleOffset,
			0,
			this.bounds.width+(nas.GUI.lineUnit/2)+appleOffset,
			this.bounds.height
		];
//	バウンズを拡張
		this.bounds.width+=(nas.GUI.lineUnit/2)+appleOffset;
//	スクロールバー設置
		this.chgRange=this.add(
			"scrollbar",
			barBounds,
			0,
			0,
			this.options.length-this.displayLines
		);
//	変更メソッド
			this.chgRange.onChange=function()
			{
//alert(this.parent.selected+" / "+this.parent.options[this.parent.selected])
				for(idx=0;idx<this.parent.displayLines;idx++){

				var myIdx=idx+Math.round(this.value);//id設定ループインデックス+スクロール量
//	if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].justify="center";};
if(myIdx == this.parent.selected){
	this.parent.selector[idx].text="* "+this.parent.options[myIdx]+" *";
}else{
	this.parent.selector[idx].text=this.parent.options[myIdx];
}
//if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].text="* "+this.parent.selector[idx].text+" *";};
				this.parent.selector[idx].id=myIdx;
//	if (this.parent.selector[idx].id==this.parent.selected){this.parent.selector[idx].justify="left";};
				}
				this.value=Math.round(this.value);//this.value=Math.floor(this.value);
			}
		}
			}
	}
//	ダイアログを表示
	nas.GUI.optionSelector.bounds.left	= left;
	nas.GUI.optionSelector.bounds.top	= top+22;

	nas.GUI.optionSelector.init();
//	if(nas.GUI.optionSelector.chgRange)nas.GUI.optionSelector.chgRange.onChange();
//	nas.GUI.optionSelector.text=nas.GUI.optionSelector.options[nas.GUI.optionSelector.selected].toString();

if(!(newUI))	nas.GUI.optionSelector.onShow=function(){this.selector[0].active=true;};
if(left<0 || top<0)nas.GUI.optionSelector.center(); //
	nas.GUI.optionSelector.show();
	return nas.GUI.optionSelector.selected;

};

}

//////////////////// 2010.0308 追加コントロール デバッグ中
/*	複合コントロールComboBox
 *
 * addComboBox = function (親,オプション,選択状態,X,Y,幅,高さ)
 *	親 : 
 *	オプション : 
 *	選択ID または 初期値:
 *	X,Y :
 *	幅,高さ :
 */
nas.GUI.addComboBox = function (Parent,Options,Selected,left,top,width,height)
{
//コンボボックスの配列数は自由・表示エレメント数は height
	if(!(Options instanceof Array)) {
		Options=[Options];
	}
	if(Selected instanceof Array) 
	{
		Selected=Selected[0];
	}
		//コンボボックスは必ずシングルセレクトなので配列が与えられたら最初の要素を値にとる。
		if(isNaN(Selected) || Selected==null ||Selected >= Options.length || Selected < 0){var noSelect=true;}

//親パネル設定
//	var myCB =nas.GUI.addPanel(Parent,"",left,top,width,height+0.4);//必ずtextは""で初期化
	var myCB =Parent.add("panel",[
		(left+0.1)*this.colUnit+this.leftMargin,
		top*this.lineUnit+(this.lineUnit*0.1),
		(width+left-0.1)*this.colUnit+this.leftMargin,
		(top+height)*this.lineUnit+this.topMargin
		],"");

	//ライブラリを使用するとパネル用オフセットが乗るので、補正値をのせるかまたは直接メソッドコールをすること
		//オブジェクトプロパティ
			myCB.options=Options;
			myCB.value=(noSelect)? Selected:Options[Selected];//テキスト
			myCB.selected=(noSelect)?null:Selected;//選択ID(ユーザ入力時はnull)
			var buttonSpan=(this.quartsOffset)? 0.5 : 0.35 ;//Macの場合ボタンとテキストの割合を変える= バージョンを見てアイコンボタンにしたほうがよさそうだけど今日はコレ
//ラベルテキスト
			myCB.labelText =nas.GUI.addEditText(myCB,myCB.value,0,0,width-0.6,height);
			myCB.labelText .bounds=[0,0,myCB.bounds.width-(nas.GUI.colUnit*buttonSpan)-2,myCB.bounds.height];//adjust
//セレクトボタン
			myCB.selectButton =nas.GUI.addButton(myCB, "▼",width-0.4,.1,0.7,height);
			myCB.selectButton.bounds=[myCB.bounds.width-(nas.GUI.colUnit*buttonSpan),0,myCB.bounds.width-4,myCB.bounds.height-4];//adjust
//値セットメソッド
		myCB.set=function(myValue){
			this.value=myValue.toString();//値を更新
			this.labelText.text=this.value;//値を更新
			var noSelect=true;
			for(var idx=0;idx<this.options.length;idx++)
			{
				if(this.options[idx]==this.value)
				{
					noSelect=false;
					this.selected=idx;
					break;
				}
			}
			if(noSelect){this.selected=null;}
		}
//インデックス選択メソッド
		myCB.select=function(myIndex){
			if((myIndex>=0)&&(myIndex<this.options.length)){
				this.selected=myIndex;
				this.value=this.options[myIndex];
				this.labelText.text=this.value;
			}
		}
//セレクトボタンのクリックメソッド
		myCB.selectButton.onClick=function()
		{
			var myLocation=nas.GUI.screenLocation(this.parent)
			
			var mySelect=nas.GUI.selectOptions(
				this.parent.options,
				this.parent.selected,
				myLocation[0],myLocation[1],this.parent.bounds.width/nas.GUI.colUnit,this.parent.options.length
			);
			this.parent.select(mySelect);
			this.parent.onChange();
				}
//エディットボックス変更
		myCB.labelText.onChange=function(){
			this.parent.set(this.text)
			this.parent.onChange();
		}
//コンボボックスにonChangeを作成(何もしない。ユーザ側でオーバライドする)
	myCB.onChange=function(){return;};

//設定したコンボボックスを返す
return myCB;
}


/*		nas.GUI.addMultiControl(Parent,type,dim,left,top,width,height,option,labelText,defaultValue,minValue,maxValue)

	回転コントロール
複合コントロール
UIに簡易的なコントロールエレメントを設定する
戻り値は拡張メソッドをもったパネルコントロール

コントロールはパネルオブジェクトの中にあらかじめUIが配置されているので簡単に使用できる。

Parent	親オブジェクト
type	コントロールタイプ angle number color position speed
dim	コントロールの次元 1～5
labelText	ラベルテキスト　(多次元配列の場合は 順次割り当て)
defaultValue	初期値　省略値はタイプ依存　(多次元配列の場合は 順次割り当て　単数の場合は全てに適用)
minValue	スライダの最小値　省略値はタイプ依存　(多次元配列の場合は 順次割り当て　単数の場合は全てに適用)
maxValue	スライダの最大値　省略値はタイプ依存　(多次元配列の場合は 順次割り当て　単数の場合は全てに適用)

left,top	描画位置　ユニットで
widhth,height 	コントロールサイズ ユニットで
option 正規化オプション　trueなら値をスライダの制限値におさめる。初期値は false

	コントロールプロパティ
MultiCntrol.type	文字列　コントロールタイプを表す　初期化時以外書き換え禁止
MultiCntrol.dim	整数　コントロールの次元を表す。　初期化時以外書き換え禁止
MultiCntrol.value	コントロールの現在の値を持つ　多次元コントロールの場合は配列

	コントロールメソッド
MultiControl.set(値[,インデックス])	外部から値を設定するメソッド　数値のみ受付る。多次元モードの場合は配列で与えるか、インデックスで指定できる

タイプごとに初期値・次元数は異なる

----type	次元数	初期値	最小	最大	ラベル
   number	1	0	0	  100	数値 00 01 02 03 ...
      angle	1	0	0	  360	角度(°)01 02 03...
   positon	2	0	0	3000	位置 x y z 01 02 03...
       color	3	0	0	       1	色(rgb) r g b a 00 01 02 ...
 gamma	1	1	0	8	Gamma 00 01 02 03 ...
次元数は、ユーザの自由だが、コントロール配置は必ず縦方向に行なわれるのであまり多いと使いづらくなるはず

*/
	nas.GUI.addMultiControl=function(Parent,type,dim,left,top,width,height,option,labelText,defaultValue,minValue,maxValue)
	{
		//type別初期値
		defValue=new Object();
		defValue["number"]=[1,0,0,100,["数値"]];
		defValue["angle"]=[1,0,0,360,["角度(°)"]];
		defValue["position"]=[2,0,-3000,3000,["位置","x","y","z"]];
		defValue["color"]=[3,0,0,1,["RGB","r","g","b","a"]];
		defValue["gamma"]=[1,1,1/8,8,["Gamma"]];
		//type特定
			if(! type){type="number"};
		//タイプ別に初期値を出す
			if(! dim){dim=defValue[type][0]}else{dim=Math.round(Math.abs(dim))}
			if(! left){left=0};
			if(! top){top=0};
			if((! width)||(width<3)){width=3};
//			if((! height)||(height<(2*dim+1))){height=(2*dim+1)};//最小サイズあり
			if((! height)||(height<dim+1)){height=dim+1};//最小サイズあり
			if(type=="angle"){height+=dim};
			if(! labelText){
				labelText=defValue[type][4];//内部的には配列で統一
			}else{
				if(!(labelText instanceof Array)){	labelText=[labelText]}
			}
			if(labelText.length<(dim+1))
			{var addCount=(dim+3)-labelText.length;
				for(var myCount=1;myCount<=addCount;myCount++)
				{
					labelText.push(nas.Zf(myCount,2));
				}
			}
			if(! defaultValue){	defaultValue=defValue[type][1]};
			if(! minValue){	minValue=defValue[type][2]};
			if(! maxValue){	maxValue=defValue[type][3]};
		//トレーラ（パネル）
		var myMC=nas.GUI.addPanel(Parent,labelText[0],left,top,width,height);
			myMC.valueType=type
			myMC.dim=dim
		//タイプ別各値設定
			if(myMC.dim>1){
				myMC.value        =new Array(dim);
				myMC.minValue  =new Array(dim);
				myMC.maxValue =new Array(dim);
				if(defaultValue instanceof Array){
					//指定値が複数なら　あるだけ順に設定　不足分は規定値で埋める
					for(var idx=0;idx<dim;idx++)
					{
						if(defaultValue.length<idx)
						{
							myMC.value[idx]=defaultValue[idx]
						}else{
							myMC.value[idx]=defValue[type][1]
						}
					}
				}else{
					//値がひとつだけなら全ての要素に適用
					for(var idx=0;idx<myMC.dim;idx++)
					{
							myMC.value[idx]=defaultValue;
					}
				}

				if(minValue instanceof Array){
					//指定値が複数なら　あるだけ順に設定　不足分は規定値で埋める
					for(var idx=0;idx<dim;idx++)
					{
						if(minValue.length<idx)
						{
							myMC.minValue[idx]=minValue[idx]
						}else{
							myMC.minValue[idx]=defValue[type][2]
						}
					}
				}else{
					//値がひとつだけなら全ての要素に適用
					for(var idx=0;idx<dim;idx++)
					{
							myMC.minValue[idx]=minValue;
					}
				}

				if(maxValue instanceof Array){
					//指定値が複数なら　あるだけ順に設定　不足分は規定値で埋める
					for(var idx=0;idx<dim;idx++)
					{
						if(maxValue.length<idx)
						{
							myMC.maxValue[idx]=maxValue[idx]
						}else{
							myMC.maxValue[idx]=defValue[type][2]
						}
					}
				}else{
					//値がひとつだけなら全ての要素に適用
					for(var idx=0;idx<dim;idx++)
					{
							myMC.maxValue[idx]=maxValue;
					}
				}

			}else{
				myMC.value=defaultValue;
				myMC.minValue  =minValue;
				myMC.maxValue =maxValue;
			}

			myMC.isReg=(option)?option:false;
//値テキスト初期化
			var shiftL=(type=="angle")? 1:0;			var spanT=(type=="angle")? 2:1;
	if(dim>1){
					myMC.labelText=new Array();
					myMC.valueText=new Array();
					myMC.valueSlider=new Array();
					myMC.ri=new Array();
for(var idx=0;idx<dim;idx++){
			myMC.labelText[idx]=nas.GUI.addStaticText(myMC,labelText[idx+1].toString(),0,0.2+(idx*spanT),0.5,1);
			myMC.valueText[idx]=nas.GUI.addEditText(myMC,myMC.value[idx].toString(),0.5+shiftL,0.2+(idx*spanT),1,1);
			myMC.valueText[idx].index=idx;
			myMC.valueText[idx].onChange=function()
			{
				if((this.text != this.parent.value[this.index])&&(!(isNaN(this.text))))
				{
					var myValue=this.text*1;
					if(this.parent.isReg)
					{
						if(myValue<this.parent.minValue[this.index]){myValue=this.parent.minValue[this.index]};
						if(myValue>this.parent.maxValue[this.index]){myValue=this.parent.maxValue[this.index]};
					}
					this.parent.set(myValue,this.index);
				}else{this.text=this.parent.value[this.index].toString()}
			}
//値スライダ gamma指定時は対数動作
	if(type=="gamma"){
		//10000基数で対数計算
		var sliderMax=(myMC.maxValue[idx]*10000)/(1+myMC.maxValue[idx]);
		var sliderMin=(myMC.minValue[idx]*10000)/(1+myMC.minValue[idx]);
		var sliderVal=(myMC.value[idx]*10000)/(1+myMC.value[idx]);
			myMC.valueSlider[idx]=nas.GUI.addSlider(myMC,sliderVal,sliderMin,sliderMax,1.5,(shiftL)-0.2+(idx*spanT),width-1.5);
			myMC.valueSlider[idx].bounds.height=20;
			myMC.valueSlider[idx].index=idx;
			myMC.valueSlider[idx].onChanging=function()
			{
				var myGamma=((this.value>this.minvalue)&&(this.value<this.maxvalue))?this.value/(1+this.maxvalue-this.value):1;
				if(myGamma>this.parent.maxValue[this.index]){this.value=this.maxvalue;}
				if(myGamma<this.parent.minValue[this.index]){this.value=this.minvalue;}
				if( myGamma != this.parent.value[this.index]){		this.parent.set(myGamma,this.index,true)	};
			}
			myMC.valueSlider[idx].onChange=function()
			{
				var myGamma=((this.value>this.minvalue)&&(this.value<this.maxvalue))?this.value/(1+this.maxvalue-this.value):1;
				if(myGamma>this.parent.maxValue[this.index]){this.value=this.maxvalue;}
				if(myGamma<this.parent.minValue[this.index]){this.value=this.minvalue;}
				if( myGamma != this.parent.value[this.index]){		this.parent.set(myGamma,this.index,skip=true)	};
			}
	}else{
//値スライダ
			myMC.valueSlider[idx]=nas.GUI.addSlider(myMC,myMC.value[idx],myMC.minValue[idx],myMC.maxValue[idx],1.5,(shiftL)-0.2+(idx*spanT),width-1.5);
			myMC.valueSlider[idx].bounds.height=20;
			myMC.valueSlider[idx].index=idx;
			myMC.valueSlider[idx].onChanging=function()
			{
				if(this.value != this.parent.value[this.index]){		this.parent.set(this.value,this.index,skip=true)	};
			}
			myMC.valueSlider[idx].onChange=function()
			{
				this.parent.set(this.value,this.index);
			}
		}
	if(type=="angle"){	
//回転アイコン初期化
		var iconWidth=1;var iconHeight=2;var myFile=new File();
		myMC.ri[idx]=nas.GUI.addIconButton(myMC,"add degrees 45",0.5,0.2+(idx*2),iconWidth,iconHeight,myFile);//rollButton
		myMC.ri[idx].icon=nas.GUI.systemIcons["rot_01"];
		myMC.ri[idx].enabled=true;
		myMC.ri[idx].index=idx;
		myMC.ri[idx].onClick=function(){
			this.parent.set(this.parent.value[this.index]+45,this.index);
		}
	}
}
	}else{
			myMC.valueText=nas.GUI.addEditText(myMC,myMC.value.toString(),shiftL,0.2,1,1);
			myMC.valueText.onChange=function()
			{
				if((this.text != this.parent.value)&&(!(isNaN(this.text))))
				{
					var myValue=this.text*1;
					if(this.parent.isReg)
					{
						if(myValue<this.parent.minValue){myValue=this.parent.minValue};
						if(myValue>this.parent.maxValue){myValue=this.parent.maxValue};
					}
					this.parent.set(myValue);
				}else{this.text=this.parent.value.toString()}
			}
//値スライダ gamma指定時は対数動作
	if(type=="gamma"){
		//10000基数で対数計算
		var sliderMax=(myMC.maxValue*10000)/(1+myMC.maxValue);
		var sliderMin=(myMC.minValue*10000)/(1+myMC.minValue);
		var sliderVal=(myMC.value*10000)/(1+myMC.value);
			myMC.valueSlider=nas.GUI.addSlider(myMC,sliderVal,sliderMin,sliderMax,1,shiftL-0.2,width-1);
			myMC.valueSlider.bounds.height=20;
			myMC.valueSlider.onChanging=function()
			{
				var myGamma=this.value/(10000-this.value);
				if(myGamma>this.parent.maxValue){this.value=this.maxvalue;}
				if(myGamma<this.parent.minValue){this.value=this.minvalue;}
				if( myGamma != this.parent.value){		this.parent.set(myGamma,false,skip=true)	};
			}
			myMC.valueSlider.onChange=function()
			{
				var myGamma=this.value/(10000-this.value);
				if(myGamma>this.parent.maxValue){this.value=this.maxvalue;}
				if(myGamma<this.parent.minValue){this.value=this.minvalue;}
				if( myGamma != this.parent.value){		this.parent.set(myGamma,false,skip=true)	};
			}
	}else{
			myMC.valueSlider=nas.GUI.addSlider(myMC,myMC.value,myMC.minValue,myMC.maxValue,1,shiftL-0.2,width-1);
			myMC.valueSlider.bounds.height=20;
			myMC.valueSlider.onChanging=function()
			{
				if(this.value != this.parent.value){		this.parent.set(this.value,false,skip=true)	};
			}
			myMC.valueSlider.onChange=function()
			{
				this.parent.set(this.value);
			}
	}

			if(type=="angle"){
//回転アイコン初期化
		var iconWidth=1;var iconHeight=2;var myFile=new File();
		myMC.ri=nas.GUI.addIconButton(myMC,"add degrees 45",0,0.2,iconWidth,iconHeight,myFile);//rollButton
		myMC.ri.icon=nas.GUI.systemIcons["rot_01"];
		myMC.ri.enabled=true;
		myMC.ri.index=idx;
		myMC.ri.onClick=function(){
			this.parent.set(this.parent.value+45);
		}
	}
}
//次元拡張を行なったのでset()メソッドも配列を扱うように拡張が必要
//ガンマモードの際は対数動作を行なう
/*
	set( [ 配列 ] )　か　set( 値,ID )　かはたまた両方？
*/
		myMC.set=function(newValue,myIndex,skip)
		{
			if(this.dim>1){
				if(! skip){skip=false};
				if(newValue instanceof Array)
				{
					for(var idx=0;idx<this.dim;idx++){if(newValue.length<idx){this.set(newValue[idx],idx)}}
				}else{
					if(!(isNaN(newValue))){
						if(! myIndex){myIndex=0};
						if(this.isReg){
							if(this.valueType=="angle"){
								this.value[myIndex]=this.value[myIndex]%this.maxValue[myIndex]
							}else{
								if(newValue<this.minValue[myIndex]){newValue=this.minValue[myIndex]}
								if(newValue>this.maxValue[myIndex]){newValue=this.maxValue[myIndex]}
							}
						}
						this.value[myIndex]=newValue;
						if(this.valueType=="gamma"){newValue=Math.floor(newValue*100)/100;};//gammaの表示を下2桁に制限
						if(this.valueText[myIndex].text !=newValue){this.valueText[myIndex].text=newValue};
						if(this.valueType=="gamma")
						{
							var mySlider=(this.value[myIndex]*10000)/(1+this.value[myIndex]);
							if(this.valueSlider[myIndex].value !=mySlider){this.valueSlider[myIndex].value=mySlider};
						}else{
							if(this.valueSlider[myIndex].value !=newValue){this.valueSlider[myIndex].value=this.value[myIndex]};
						}
//角度アイコンありの時のみ
						if(this.valueType=="angle"){
							if(this.isReg){this.value[myIndex]=this.value[myIndex]%this.maxValue[myIndex]};
							var count=1+(Math.round(((this.value[myIndex]%360)/360)*24)+24)%24;
							this.ri[myIndex].icon=nas.GUI.systemIcons["rot_"+nas.Zf(count,2)];
						}
						if(skip){
							this.onChanging();//メソッドの最後にonChangingをコール
						}else{
							this.onChange();//メソッドの最後にonChangeをコール
						}
					}
				}
				//
			}else{
				if(! skip){skip=false}
				if(!(isNaN(newValue))){
					if(this.isReg){
						if(this.valueType=="angle")
						{
							this.value=this.value%this.maxValue
						}else{
							if(newValue<this.minValue){newValue=this.minValue}
							if(newValue>this.maxValue){newValue=this.maxValue}
						}
					}
					this.value=newValue;
					if(this.valueType=="gamma"){newValue=Math.floor(newValue*100)/100;};//gammaの表示を下2桁に制限
					if(this.valueText.text !=newValue){this.valueText.text=newValue};
					if(this.valueType=="gamma"){
						var mySlider=(this.value*10000)/(1+this.value);
						if(this.valueSlider.value !=mySlider){this.valueSlider.value=mySlider};
					}else{
						if(this.valueSlider.value !=newValue){this.valueSlider.value=this.value};
					}
//角度アイコンありの時のみ
					if(this.valueType=="angle"){
						var count=1+(Math.round(((this.value%360)/360)*24)+24)%24;
						this.ri.icon=nas.GUI.systemIcons["rot_"+nas.Zf(count,2)];
					}
					if(skip)
					{
						this.onChanging();//メソッドの最後にonChangingをコール
					}else{
						this.onChange();//メソッドの最後にonChangeをコール
					}
				}
			}
		}
		myMC.onChanging=function()
		{
			//空ファンクション　ユーザは上書きできる
			return;
		}
		myMC.onChange=function()
		{
			//空ファンクション　ユーザは上書きできる
			return;
		}
		return myMC;
	}
//multiControlBox

//複合コントロール SelectSwitch
/*
SelectSwitch.options	array(items相当)
SelectSwitch.selected	
SelectSwitch.value
SelectSwitch.text
SelectSwitch.select()
*/
nas.GUI.addSelectSwitch = function (Parent,Label,Select,left,top,width,height,icons)
{
//省スペースUIとして以前のバージョンのセレクトボタンと同等のコントロールを復活セレクタ内のオプションをクリックのたびに切りかえる
//アイコン対応
		var newUI =	(AEVersion>=8)? true:false;
if((newUI)&&(icons)){
/*==================アイコンボタンモード */
	var mySS = nas.GUI.addIconButton(Parent,"",left,top,width,height);//文字なしで初期化
	//`オプショントレーラ初期化
	if(Label instanceof Array){
		mySS.options= Label;
	}else{
		mySS.options= new Array();mySS.options[0]=Label;
	}
	//アイコントレーラ初期化
	mySS.optionIcons= new Array(mySS.options.length);
	if(!(icons instanceof Array)){icons=[icons];}
	
//アイコントレーラの中身を検査してアイコンでなければデフォルトアイコンと置き換え
	for(var idx=0;idx<mySS.options.length;idx++)
	{
		if(icons.length>idx){mySS.optionIcons[idx]=icons[idx];}else{mySS.optionIcons[idx]=null;};//あれば取得なければnull
		if(!(mySS.optionIcons[idx] instanceof ScriptUIImage))
		{
			if(idx<10){
			mySS.optionIcons[idx]=nas.GUI.systemIcons["chr_"+["a","b","c","d","e","f","g","h","i","j"][idx]];//0-9はアルファベット
			}else{
			mySS.optionIcons[idx]=nas.GUI.systemIcons["nas"];//その先は茄子
			}
		}
	}
//アイテム初期化
	mySS.selected = (Select>=mySS.options.length || Select<0 || isNaN(Select))?
	0	:	Math.floor(Select)	;
	mySS.value=mySS.options[mySS.selected];
	mySS.helpTip=mySS.value;
	mySS.icon=mySS.optionIcons[mySS.selected];

	mySS.select=function(aRg){
	if(! aRg && aRg != 0) aRg=this.selected;
if(isNaN(aRg)){
	switch (aRg){
case	"enable":
	this.enabled=true;break;
case	"disable":
	this.enabled=false;break;
case	"prev":
	this.selected=Math.abs(this.selected-1)%this.options.length;
	this.value=this.options[this.selected];
	this.icon=this.optionIcons[this.selected];
	this.helpTip=this.value
	break;
case	"next":
default	:
	this.selected=(this.selected+1)%this.options.length;
	this.value=this.options[this.selected];
	this.icon=this.optionIcons[this.selected];
	this.helpTip=this.value
	}
}else{
	this.selected=Math.abs(Math.floor(aRg) % this.options.length);
	this.value=this.options[this.selected];
	this.icon=this.optionIcons[this.selected];
	this.helpTip=this.value
}
//	this.onChange();
	};

}else{
/*==================ボタンモード */
	var mySS = Parent.add("button",this.Grid(left,top,width,height,Parent),"");//ボタン初期化(文字なし)
	if(Label instanceof Array){
		mySS.options= Label;
	}else{
		mySS.options= new Array();mySS.options[0]=Label;
	}
	mySS.selected = (Select>=mySS.options.length || Select<0 || isNaN(Select))?
	0	:	Math.floor(Select)	;
	mySS.value=mySS.options[mySS.selected];
	mySS.text=mySS.value;//ボタン表示

	mySS.select=function(aRg){
	if(! aRg && aRg != 0) aRg=this.selected;
if(isNaN(aRg)){
	switch (aRg){
case	"enable":
	this.enabled=true;break;
case	"disable":
	this.enabled=false;break;
case	"prev":
	this.selected=Math.abs(this.selected-1)%this.options.length;
	this.text=this.options[this.selected];break;
	this.value=this.options[this.selected];
case	"next":
default	:
	this.selected=(this.selected+1)%this.options.length;
	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
	}
}else{
	this.selected=Math.abs(Math.floor(aRg) % this.options.length);
	this.text=this.options[this.selected];
	this.value=this.options[this.selected];
}
//	this.onChange();
	};
}
//mySS.onClick= function(){this.select("next");};
mySS.onClick= function(){
	this.select("next");
	this.onChange();
};
//mySS.onClick= function(){nas.GUI.selectOptions(this.options,this.selected,this.bounds[0],this.bounds[1],(this.bounds[2]-this.bounds[0])/nas.GUI.colUnit,this.);};
mySS.onChange=function(){return;};
return mySS;
}
//selectSwitch Button
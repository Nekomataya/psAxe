/*(簡易コンソール)
//	Nekomataya/kiyo	2005.11.07
//	改行コード調整追加	11.08
//	ファイル読み込み追加	11.09
//	mac上での表示の改善・簡易GUIライブラリ試験　11.17
//	調整　11.23  これでおわりかな
//	保存対応することにした。一応
//	ついでにPhotoshop対応 inDesignとか他のCS組はもってないのでワカリマセン。12/21

	このコンソールは、下段のテキストボックスの内容ををeval()で実行して、
	上段のテキストボックスに戻値を表示する簡易コンソールです。
	特定のライブラリには依存しておりませんので 大半のAdobeScript環境で動作可能です。
	簡単なコードの試験やデバッグ等にご利用ください。
	下段の読み込みと 上下段別々の保存が可能です。
	マルチランゲージ対応処理
 */
try{if(app.isProfessionalVersion)
	{
		app.name="Adobe AfterEffects";
		var isWindows=(system.osName.match(/Windows/))?true:false;
	}else{
		isWindows=false;
	};
	if(isWindows){var LineFeed="\x0d\x0a"}else{var LineFeed="\x0d"};
}catch(ERR){
	isWindows =true;
}
/*
	edittextに初期状態で256バイトでペーストや手入力が打ち止めになる現象がある。
	スクリプトでのデータ追加を行うと動的にメモリが確保されているようなので、
	これは、edittextに無理やり空白を追加してフラッシュするメソッド。
	このバグが解消したら不要。	引数はループ回数。1回アタリ1kb

	AE7.0 256バイトではなくなったが同バグ依然有り。さらに削除操作後にキー入力不全追加
	ただし、コンソール機能はオリジナルのスクリプトエディタがあるので、このツール自体は
	お役御免状態なのでアップデートはしない

	AE8(CS3) あいかわらずバグだらけ。
	手がるなのでこのコンソールもあいかわらず現役
	今度は、キーボードから改行が入力できない模様?うーん

*/
function getScript()
{
if(isWindows){
	var scriptfile = File.openDialog(localize({en:"select script to read.",ja:"読み込むスクリプトを選んでください"}),"JSX-Script(*.jsx *.js):*.JSX;*.JS");
}else{
	var scriptfile = File.openDialog(localize({en:"select script to read.",ja:"読み込むスクリプトを選んでください"}));
}
if (scriptfile && scriptfile.name.match(/^[a-z_\-\#0-9]+\.jsx?$/i)){
	var myOpenfile = new File(scriptfile.fsName);
	myOpenfile.open("r");
	myContent = myOpenfile.read();
	return myContent.replace(/(\r\n?|\n)/g,LineFeed);
}else {return false;};
}
function addBuf_(KB)
{
	var xStr="";
	for(m=0;m<KB;m++){for(n=0;n<1024;n++) xStr+=" "};
	this.text +=xStr;
	this.text ="";
	return this.text;
};


function saveText(myText)
{
if (! myText.length){alert(localize({en:"no data to save.",ja:"保存するデータがありません"}));return false;}
if(isWindows)
{
	var mySavefile = File.saveDialog(localize({en:"specify the file name for export",ja:"書き出しのファイル名を指定してください"}),"File (*.js *.jsx *.txt):*.JS;*.JSX;*.TXT");
}else{
	var mySavefile = File.saveDialog(localize({en:"specify the file name for export",ja:"書き出しのファイル名を指定してください"}),"");
}
if(! mySavefile){return};
if(mySavefile.exists)
{
if(! confirm(localize({en:"There is already a file with the same name.\nAre you sure you want to overwrite?",ja:"同名のファイルがすでにあります.\n上書きしてよろしいですか?"}))){return false;};
}

if (mySavefile && mySavefile.name.match(/^[a-z_\-\#0-9]+\.(jsx?|txt)$/i)){
var myOpenfile = new File(mySavefile.fsName);
	myOpenfile.open("w");
	myOpenfile.write(myText);
	myOpenfile.close();
}else {
	alert(localize({en:"Extension Please specify js/jsx/txt ",ja:"拡張子は js/jsx/txt を指定してください。"}))
	return false;
};
}
// GUI Setup
//すごく簡易GUIライブラリ
	var leftMargin=12;
	var rightMargin=24;
	var topMargin=2;
	var bottomMargin=24;
	var leftPadding=8;
	var rightPadding=8;
	var topPadding=2;
	var bottomPadding=2;
	var colUnit=96;
	var lineUnit=24;
	var quartsOffset=(isWindows)? 0:4;
function nasGrid(col,line,width,height){
	left=(col*colUnit)+leftMargin+leftPadding;
	top=(line*lineUnit)+topMargin+topPadding;
	right=left+width-rightPadding;
	bottom=(height <= lineUnit)?top+height-bottomPadding-quartsOffset:top+height-bottomPadding;
		return [left,top,right,bottom];
}
	myWinsize=[512,480];	myWinOffset=[239,40];

if (app.name=="Adobe AfterEffects"){
if((this)&&(this.type=="panel"))
{
	var testConsole= this;
}else{
	var testConsole= new Window("palette","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}
//var testConsole= new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
// new Window("window","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}else{
var testConsole= new Window("dialog","nas-Console",[myWinOffset[0],myWinOffset[1],myWinsize[0]+myWinOffset[0],myWinsize[1]+myWinOffset[1]]);
}

/*	ウィンドウにGUIパーツを配置	*/
testConsole.titleLabel=testConsole.add("statictext",nasGrid(0,0,480,24),"試験コンソール nas(u) tools (Nekomataya/2009)",{multiline:false});testConsole.titleLabel.justify="right";

testConsole.resultBox=testConsole.add("edittext",nasGrid(0,1,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){testConsole.resultBox.addBuf=addBuf_;}

testConsole.commandBox=testConsole.add("edittext",nasGrid(0,11,480,192),"",{multiline:true});
	if(app.name=="Adobe AfterEffects"){testConsole.commandBox.addBuf=addBuf_;}

testConsole.actButton=testConsole.add("button",nasGrid(0,9,480,24),"evalCommand");
testConsole.cluButton=testConsole.add("button",nasGrid(0,10,96,24),"clearResult");
testConsole.clbButton=testConsole.add("button",nasGrid(1,10,96,24),"clearCommand");
testConsole.loadButton=testConsole.add("button",nasGrid(2,10,96,24),"loadCommand");
testConsole.saveButton=testConsole.add("button",nasGrid(3,10,96,24),"saveCommand");
testConsole.writeButton=testConsole.add("button",nasGrid(4,10,96,24),"writeResult");


	testConsole.actButton.onClick = function (){try{testConsole.resultBox.text += eval(testConsole.commandBox.text)+LineFeed;}catch(err){testConsole.resultBox.text +=err.toString()+LineFeed;}};
	testConsole.cluButton.onClick = function (){testConsole.resultBox.text ="";};
	testConsole.clbButton.onClick = function (){testConsole.commandBox.text ="";};
	testConsole.loadButton.onClick = function (){newContents=getScript();if(newContents){testConsole.commandBox.text=newContents;}};
	testConsole.saveButton.onClick = function (){saveText(this.parent.commandBox.text);};
	testConsole.writeButton.onClick = function (){saveText(this.parent.resultBox.text);};
//	testConsole.closeButton.onClick = function (){this.parent.close();};

/*	GUIパーツを再配置	*/
testConsole.onResize=function(){
var myWidth=(testConsole.bounds.width-leftMargin-rightMargin)/colUnit;
var myHeight=(testConsole.bounds.height-topMargin-bottomMargin)/lineUnit;

testConsole.titleLabel.bounds=nasGrid(0,0,myHeight*lineUnit,24);
testConsole.resultBox.bounds=nasGrid(0,1,myWidth*colUnit,192);
testConsole.commandBox.bounds=nasGrid(0,11,myWidth*colUnit,192);
testConsole.commandBox.onChange=function(){
	writeLn("onChange!");
	if(this.backupText) {this.backupText=this.text}
	if(this.backupText!=this.text){this.text+=LineFeed;}else{return false;};
	this.backupText=this.text;
	return false;
}
testConsole.actButton.bounds	=nasGrid(0,9,myWidth*colUnit,24);
testConsole.cluButton.bounds	=nasGrid(0,10,myWidth*colUnit/5,24);
testConsole.clbButton.bounds	=nasGrid((myWidth/5)*1,10,myWidth*colUnit/5,24);
testConsole.loadButton.bounds	=nasGrid((myWidth/5)*2,10,myWidth*colUnit/5,24);
testConsole.saveButton.bounds	=nasGrid((myWidth/5)*3,10,myWidth*colUnit/5,24);
testConsole.writeButton.bounds	=nasGrid((myWidth/5)*4,10,myWidth*colUnit/5,24);
}

if((this)&&(this.type=="panel")){
	testConsole.onResize();
}else{
	testConsole.show();
}
if(app.name=="Adobe AfterEffects")
{		testConsole.resultBox.addBuf(20);
		testConsole.commandBox.addBuf(10);
}
		testConsole.commandBox.text=localize({
			en:"/*\t*Please write the code in this box\t*/",
			ja:"/*\tこのボックスにコードを書き込んでください\t*/"
		})+LineFeed;
//理由はわからないが初期状態だと256bでペーストが打ち止めになるのでスクリプト側からedittextの拡張をかけてやる。

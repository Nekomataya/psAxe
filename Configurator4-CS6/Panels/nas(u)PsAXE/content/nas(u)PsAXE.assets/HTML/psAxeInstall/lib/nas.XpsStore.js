//	Ps等AE(乙女)以外の環境にXPSStoreを移植
//コンポ参照を行なわず、Javascript環境全般に対応　要nas_lib

/* XPSStore　(シートトレーラ)
	XPSheetStore オブジェクト
	プロジェクト内部にタイムシートを複数記録維持して切り換えて使用する仕組み
	フッテージストア内部にコンポの形で記録する
	インデックスがあり、選択値を切り換えてバッファとの間にやりとりを行う
	バッファはXPS(=従来のXPSオブジェクトをそのまま使用)
	XpsStore.body		実際にシートを格納する配列
			改行は"\\r\\n"に置換　内部的には各環境ごとのエンコーディングによる文字列
XpsStore.selected	カレントのタイムシートオブジェクト。カレントがない場合もあるその場合はnull または　false
			デフォルトの値（ストア内のデータが無い）ではnull / ストア内にデータがありかつ選択の無い場合はfalseを値とする
			AEではレイヤが配置されるが、他の環境ではXPSオブジェクトが配置されるので注意
			XPS自体を取得する際はgetメソッドを使用すること
			XPS.index プロパティが増設されている

XpsStore.currentIndex	カレントインデックスを記録する内部変数　外部操作禁止

XpsStore.getLength()	シート総数を返す
			０を返さずにfalseを返す場合は現状でシート操作環境がない事を表している。(この機能は乙女専用)
			もし、シート操作環境が必要な場合は　XpsStore.initBody()メソッドで初期化すると環境が構築される。
XpsStore.get(index)	indexで指定されたレイヤからXpsオブジェクトを取得
XpsStore.set(index,Xps)	indexで指定されたレイヤにXpsオブジェクトを登録する
XpsStore.pop(index)	indexで指定されたシートのデータをXPSバッファに転送する。
			indexが指定されなければカレントのシートに対して実行
XpsStore.push(index)	indexで指定されたシートにXPSバッファのデータをセットする。内部でsetInfo()を実行する。
			indexが指定されなければカレントのシートに対して実行
XpsStore.select(index)	カレントインデックスを切り替えバッファ内容を更新する。
	戻り値は選択されているシートのインデックス。数値のほかにキーワード"fwd,prv,start,end"を受け付ける
XpsStore.getInfo(index)	指定indexのシートのモディファイド情報を取得
			戻り値は情報オブジェクト
			indexが指定されなければカレントのシートに対して実行
XpsStore.setInfo(index)	指定indexのシートに現行のXPSバッファのモディファイド情報を設定
			戻り値は情報オブジェクト
			indexが指定されなければカレントのシートに対して実行
XpsStore.add(Xps)	Xpsオブジェクトを直接渡して新規にシート(テキストレイヤ)を作成する。
			XPSバッファを同時更新
			カラ指定の場合はXPSバッファから作成
			既存シートとの重複は関知しないのであらかじめ確認は必要
			戻値は追加成功したテキストレイヤ
XpsStore.remove(index)	指定indexのシートをプロジェクトから削除する。インデックスは必ず指定すること。
			インデックス不指定時は失敗させる
			成功時の戻り値は新たなバッファ内容(Xps)またはnull(残シートなしの時)
XpsStore.duplicate(index,name)	指定indexのシートをnameで複製する。インデックスは必ず指定すること。
			名前が指定されなかった場合は元のカット番号に"copy of "を前置する
			成功時の戻り値は新たなバッファ内容(Xps)　失敗時はfalse (未実装　2010 12 19)
XpsStore.setBody()	内部で使用するメソッド、ライブラリを参照してbodyを自身のオブジェクトとして再設定する
			設定済みの場合は何もしない。外部アクセス禁止

XpsStore.initBody()	内部で使用する初期化メソッド
			カラのトレーラを作るので注意
*/

function XpsStore()
{
if((nas.isAdobe)&&(app.name.match(/After/i))){
	this.body=false;//false or CompItem
}else{
	this.body=new Array();//シート保存変数
}
	this.selected=null;//null or TextLayer
	this.currentIndex=0;//選択状態なし
/*
	ストアしたシートには若い順に１からIDが振られる。これはAEとの互換性に加えて０を非選択フラグとして使用するための措置
*/
//AE65用ダミープロパティ
//新規プロパティを作る
	var myProp="{";
		myProp+="\"name\" :\"AE65dummyProp\",";
		myProp+="\"modified\" :\""+new Date().toNASString() +"\",";
		myProp+="\"length\" :\"==000000==\",";//"=="でエスケープしてある場合はファイルなし
		myProp+="\"url\" :\"\"}";//"=="でエスケープしてある場合はファイルなし
	this.AE65Prop=eval("\("+myProp+"\)");

//
	
	this.setBody=function(myIndex){
		return true;
		//AE環境下以外ではこのメソッドは意味を持たない
		//myIndexは整数で与えること　初期値はcurrentIndex
		var myTarget=app.project.items.getByName(nas.sheetBinder);//あとで変更
//		if(myIndex<0)myIndex=0;
//		if(myIndex>myTarget.layers.length)myIndex=myTarget.layers.length;
		if(
			(myTarget)&&
			(myTarget.parentFolder.name==nas.ftgFolders["etc"][0])&&
			(myTarget.parentFolder.parentFolder.name==nas.ftgFolders["ftgBase"][0])
		){
			this.body=myTarget;
			if((isNaN(myIndex))||(myIndex>this.body.length)){myIndex=this.currentIndex};
			this.selected=((myTarget.layers.length)&&(myIndex))?myTarget.layers[Math.floor(myIndex)]:null;
		}else{
			//ないときに初期化したほうが良いかも？
			this.body=false;
			this.selected=null;
			this.currentIndex=0;
	}
		return myTarget;
	}

	this.initBody=function(){
//AE環境下以外ではこのメソッドは意味を持たない
		return this.body;
//すでにあれば空コンポに初期化する。　コンポがなければ新規に作る。　初期化用
//初期状態のシート保持数は0 選択インデックスは0

		var myTarget=app.project.items.getByName(nas.sheetBinder);
		if(
			(myTarget)&&
			(myTarget.parentFolder.name==nas.ftgFolders["etc"][0])&&
			(myTarget.parentFolder.parentFolder.name==nas.ftgFolders["ftgBase"][0])
		){
			this.body=myTarget;
			for(var lIdx=1;lIdx<=this.body.length;lIdx++){this.body[lIdx].remove();}
		}else{
			if(! (app.project.items.getByName(nas.ftgFolders["ftgBase"][0])) )
			{	app.project.items.addFolder(nas.ftgFolders["ftgBase"][0]) ;}
			if(! (app.project.items.getByName(nas.ftgFolders.ftgBase[0]).items.getByName(nas.ftgFolders.etc[0])))
			{	app.project.items.getByName(nas.ftgFolders.ftgBase[0]).items.addFolder(nas.ftgFolders.etc[0]) ;}
			
			this.body=app.project.items.getByName(nas.ftgFolders.ftgBase[0]).items.getByName(nas.ftgFolders.etc[0]).items.addComp(nas.sheetBinder,640,480,1,1,1);
		}
		this.select(0);
		return this.body;
	}
/*
	暫定操作メソッド
*/
//getLength of XpSheets
//	
	this.getLength=function(){return this.body.length};
//select selectIndex chicetimesheetIndex
	this.select=function(index)
	{
		//indexのズレに注意
		if((!index)&&(this.selected instanceof Xps)){if(index != 0){return this.selected.index}}
		if(index<0){index=0};//-.select(0) はアンセレクトコマンドである
		if(index>this.body.length){index=this.body.length};//上限一致
		//現状ではキーワードは未サポート
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}
//			nas.otome.writeConsole("start isSame : index= "+this.selected.index);
		if(index==0){this.currentIndex=0;this.selected=null;return 0};//解除（バッファの内容は残る。注意　初期化はしない）;
		if(isNaN(index)){return this.currentIndex};
		if (index>this.getLength()){return this.selected.index};
		this.selected=this.body[index-1];//１オリジンなので配列IDは-1
		this.currentIndex=index;
//			nas.otome.writeConsole("before isSame : index= "+this.selected.index);
		if(! XPS.isSame(this.get(index))){this.pop(index)};//現行のバッファの内容をアップデートする　（ないほうが良いかも？？）
//			nas.otome.writeConsole("after isSame : index= "+this.selected.index);
		return this.selected.index;
	}
//get Xps from XPSStore
//このメソッドは取得のみでバッファは無視
	this.get=function(index)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}
		if(!index){index=(this.selected)?this.selected.index:0};
		if((isNaN(index))||(index<1)||(index>this.getLength())){return false};
		var myXps=this.body[index-1];
//		var myXps=new Xps();
//		myXps.readIN(this.body.layers[index].sourceText.value.text.replace(/\\r\\n/g,"\n"));
		return myXps;
	}		
//set XPSStore from Object Xps
//このメソッドはセットのみでバッファは無視? セレクトしたほうが重宝かも　一考中
	this.set=function(index,myXps)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}
		if((isNaN(index))||(index<1)||(index>this.getLength())){return false};
		if(! myXps){myXps=XPS;}
		if(myXps instanceof Xps) {
			this.body[index-1]=myXps;
			this.body[index-1].index=index;//インデックス更新
//			this.body.layers[index].sourceText.setValue(myXps.toString().replace(/\n/g,"\\r\\n"));;
			this.pop(index);//バッファセット どうしようかな
			return index;
		}
		return false;
	}		
//add XPSStore from Object Xps
//直接addした場合はsetInfo忘れずに
//引数なしの場合は新規Xpsを追加する
	this.add=function(myXps)
	{
//		if(! this.getLength()){if(! this.setBody()){return false;}}
		if(! myXps){
			myXps=new Xps();
			myXps.readIN(XPS.toString());
		}
//		alert((myXps instanceof Xps))
		if(myXps instanceof Xps)
		{
			var newIx=this.body.length;
			var myNewTimeSheet=this.body.push(myXps);
			this.body[newIx].index=newIx+1;//要素を加えたのでプロパティを追加しておく
			this.body[newIx].name=[myXps.scene,myXps.cut].join("_");
//			var myNewTimeSheet=this.body.layers.addText(new TextDocument(myXps.toString().replace(/\n/g,"\\r\\n")));

//			myNewTimeSheet.name=[myXps.scene,myXps.cut].join("_");
//			if(XPS.toString()!=myXps.toString()){XPS.readIN(myXps.toString());};//このルーチンの最後のselect()メソッドで解決するのでこの行不要
//プロパティ転記
	//		this.setInfo(myNewTimeSheet.index);
			if(this.select(newIx+1)){return this.selected};//現行シートを新規ストアしたのでカレントを移す
			//成功時レイヤを戻す
		}

		return false;
	}		
//remove timesheet
	this.remove=function(index)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}

		if(! index){if(this.selected!=null){index=this.selected.index;}else{return false;}}
		if(index>this.body.length){return false;};
		if((this.selected!=null)&&(index<=this.selected.index)){
//			削除レイヤがカレントより上ならそのまま削除
//			削除レイヤがカレント以下ならカレントが移動する（元のインデックスを第一候補にして元のインデックスがなくなる場合は一番下げる。ラストならヌルで選択解除）
		var nextIndex=index-1;//すでに0が除外されているので負にはならない。
//			if(nextIndex==this.body.layers.length) nextIndex--;//
//			this.body.layers[index].remove();//削除する
			this.body.splice(index-1,1);//削除する
			for(var ix=0;ix<this.body.length;ix++){this.body[ix].index=ix+1};//インデックス更新
			if(this.body.length){this.select(nextIndex)};//カレント移動（0なら解除 ＜この仕様一考の要あり）
//			if(nextIndex){this.selected=this.body.layers[nextIndex];}else{this.selected=null;}
		}else{
				//this.body.layers[index].remove();//レイヤ削除する
			this.body.splice(index-1,1);//削除する
			for(var ix=0;ix<this.body.length;ix++){this.body[ix].index=ix+1};//インデックス更新
		}
			return this.selected;
	}
//pop XPSContents from XPSStore currentStack toXPSBuffer
	this.pop=function(index)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}

		if(! index){if(this.selected){index=this.selected.index;}else{return false;}}
		if(index>this.body.length){return false;};
		if(this.body[index-1]){
			this.selected=this.body[index-1];
			this.currentIndex=index;
//			var myContents=this.selected.sourceText.value.text.replace(/\\r\\n/g,"\n");
			var myXps=this.body[index-1];
			if(!XPS.isSame(myXps)){XPS.readIN(myXps.toString())};//現行のバッファの内容をアップデートする
			return index;
		}
		return false;
	};//
//push XPSContents from XPSBuffer to XPSStore currentStack
	this.push=function(index)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}

		if(! index){if(this.selected){index=this.selected.index;}else{return false;}}
		this.selected=this.body[index-1];
		this.currentIndex=index;
		if(! XPS.isSame(this.selected)){
			this.body[index-1].leadIN(XPS.toString());
			this.setInfo(index);
			return index
		}
		return false;
	};//
//toString resultXPSContent from currentSheet
	this.toString=function(index)
	{
//		if(! this.getLength()){if(! this.setBody(index)){return false;}}

		if(! index){if(this.selected){index=this.selected.index;}else{return false;}}
		if(index>this.body.length){return false;};
		if(this.body[index-1]){
//			this.selected=index;//切り替えない
			return this.body[index-1].toString().replace(/\\r\\n/g,"\n")+"\n";
		}
	};//
//get XPSInfo from currentSheet
	this.getInfo=function(index)
	{
//		if(AEVersion<7){return this.AE65Prop};//AE65の場合はダミープロパティを返す
		if(! index){if(this.selected){index=this.selected.index;}else{return false;}}
		if(index>this.body.length){return false;};
		if(this.body[index-1]){
		var myProps=eval("\("+this.body[index-1].comment+"\)");//JSONのはずなんだけど怖いよね
		return myProps;
		}
		return false;
	};//

//setXPSInfo to currentSheet from XPSBuffer
	this.setInfo=function(myIndex,myFile)
	{
		if(! myIndex){if(this.selected){index=this.selected.index}else{return false}}
		if(myIndex>this.body.length){return false;};
		if(this.body[myIndex-1]){
			var storeName=[XPS.scene,XPS.cut].join("_");//
			var myContent=XPS.toString();
//新規プロパティを作る
//ファイルが与えられた場合は、ファイルから　ない場合は現状のデータから
			if(myFile){		
			var newProp="{";
				newProp+="\"name\" :\""+myFile.name +"\",";
				newProp+="\"modified\" :\""+myFile.modified.toNASString() +"\",";
				newProp+="\"length\" :\""+myFile.length  +"\",";
				newProp+="\"url\" :\""+myFile.absoluteURI ;
				newProp+="\"}";
			}else{
				var newProp=XPS.getInfo().toSource();
			}

//				alert(newProp + myFile.toString() );
			this.body[myIndex-1].comment=newProp;
//レイヤ名を識別子で置き換え
			this.body[myIndex-1].name=storeName;


			return eval("\("+newProp+"\)");
		}
	return false;
	};//
//関連付けられているコンポのupdate//このメソッドはAEのみで意味を持つので他の環境ではコールしないこと 
	this.update=function(indx){
		return false;
		//indxはシートindex =シートキャリアのレイヤインデックスと一致　1～
		var myIdentifier=this.get(indx).getIdentifier();
		//チェックするシートの識別を取得
			//アイテム総当り
		var myResult=0;
		for(var idx=1;idx<=app.project.items.length;idx++){
//CompItem && ステージプレフィックスありコメントシグネチャあり
//3条件を自動更新の必要条件にする…かためカモ
			if(
				(app.project.item(idx) instanceof CompItem)&&
				(app.project.item(idx).name.match(new RegExp("^\\("+nas.itmFootStamps.stage[0]+"\\)")))&&
				(app.project.item(idx).comment.match(new RegExp("^"+nas.itmFootStamps.stage[1])))
			){
				var myXps=app.project.item(idx).getRootXps();//コンポからXPS取得
				if(myXps){
					//Xpsがあれば識別情報を比較　一致したら適用
					if(myIdentifier==myXps.getIdentifier()){
						app.project.item(idx).applyXPS(myXps);
						nas.otome.writeConsole("updated Comp ["+idx+"] "+app.project.item(idx).name);
					//	myComps.push(app.project.item(idx));
						myResult++;
					}
				}
			}
		}
		return myResult;
	};//
/*
	このアルゴリズムだと、カット識別が重複した（コンポが複数ある）場合複数のコンポが誤認で更新される場合があるが、それは仕様とする。
	同一プロジェクト内部での関連付けの重複である。コンフリクトに注意
*/
}


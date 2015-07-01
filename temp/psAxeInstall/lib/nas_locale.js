/*
HTML言語リソースを別ファイルにまとめる
他のアプリケーションも同等に処理したいよ

スタートアップで1度だけ実行としたいけど初期化のたびに実行が必要かもしれない

LanguagePack Object

nas.HTM.LangPack[Locale][kind][propertyName]=value;

Locale	言語コード　カントリーコードまたはロケール文字列で
kind	UIのオブジェクト種別innerHTMLはjQueryで変更 他のプロパティは直接更新
propertyName	オブジェクトを文字列で指定 HTMLならばid AESオブジェクトならばUIオブジェクトの参照

*/
if(typeof nas =="undefined"){var nas = new Object ;};
//HTML	JQueryを使う	$("#"+propertyName).html(value);
//AES	textプロパティを更新	eval[propertyName+'.txt="'+value+'"';]
//変更書式　["エレメントid","プロパティ","値"]
//===========================================初期化

/*
	localeを取得
	uiLocaleが存在しないシステムでは、
	navigator文字列から取得
グローバルにlocaleがあればlocaleから
uiLocaleはAEのみ

*/
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
	        }
	      }
	    }
	  }
	}

//現状"en","ja"リソースのみなので日本語以外は全て英語扱いとする
	nas.locale=(nas.locale=="ja")?"ja":"en";
/* nas.localize(anyString or languageResource [, replaceStrings ])
 *引数:zStirng または　何らかの文字列　または　nas.LanguageResouce　第二引数以降は置換文字列
 *	内部で使用するlocalizeファンクションを作っておく
 *	置きかえ機能ありadobe拡張スクリプトのlocalizeの前段として使用可能nasオブジェクトの場合は自前で処理して
 *	引数が文字列で、かつZStringだった場合のみlocalizeのリザルトを戻す 
*/
	nas.localize=function(myObject){
	  if((typeof app != "undefined")&&(localize instanceof Function)&&(localize !== nas.localize )&&(myObject instanceof String)&&(myObject.indexOf("$$$/")==0)){
//引数がZStringでかつAdobe環境(グローバルのlocalizeがある)なら渡して終了
//localize  が自分自身である場合も排除
		var myEx="localize(myObject ";
		if(arguments.length>1){for(var aid=1;aid<arguments.length;aid++){myEx+=",arguments["+aid+"] "}};
		myEx+=");"
		return eval(myEx);
	  }else{
//自前処理　localize がない場合(html等)は自前で処理
		var myArg=[];
		if( arguments.length>1 ){for(var aId=1;aId<arguments.length;aId++){myArg.push(arguments[aId]);}}
		if(typeof myObject == "string"){
			var myResult=myObject.replace(/^\$\$\$[^=]+=/,"");
		}else{
			var myResult=myObject[nas.locale];
		}
			
			if(myArg.length>0){
			 // 言語リソース内の%d(1,2,3…)を置き換える　　引数は不定
				for (var rId=0;rId<myArg.length;rId++){
			var myRegex=new RegExp("%"+(rId+1),"g");myResult=myResult.replace(myRegex,myArg[rId]);
				}
			}
			return myResult;
	  }
	};
//ローカライズ関数がない場合は上書き
	if( typeof localize=="undefined" ){localize=nas.localize;}
//
/*test
A={en:"eng%1 1%2 3"};
nas.localize(A,"Q","B");
アドビのlocalizeとわずかに動作が違うが堪忍
パラメータ置換の際にadobe版では"%d"パラメータの後方に空白文字を入れないと、そこで処理を中断するらしい
実際上この位置には空白が入るケースが圧倒的なので問題はないものとする
この動作はマッチさせない(自前処理では空白はなくても置換を行う)
adobe の localizeのほうが早いのでそちらになるべく流したほうが良い
2015 06-25
*/ 

nas.LanguagePack=function(){
	this["en"]=[];
	this["ja"]=[];
};

nas.LanguagePack.prototype.chgLocale=function(myLocale){
    if (!myLocale){myLocale="ja"}
    for (var idx=0;idx<nas.LangPack[myLocale].length;idx++){
	 var eId=nas.LangPack[myLocale][idx][0];
	 var eType=nas.LangPack[myLocale][idx][1];
	 var value=nas.LangPack[myLocale][idx][2];
try{	if(document.getElementById(eId)){document.getElementById(eId)[eType]=value;}}catch(err){alert(err);}
    }
}


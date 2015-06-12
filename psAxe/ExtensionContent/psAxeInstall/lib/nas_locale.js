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
if(typeof nas =="undefined"){var nas = new Object};
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
//内部で使用するlocalizeファンクションを作っておく
	nas.localize=function(myObject,myArg){
		if(typeof myObject != "string"){
			return myObject[nas.locale];
		}else{
			 return( typeof localize=="undefined" )? myObject:localize(myObject,myArg);
		}
	};
	if( typeof localize=="undefined" ){localize=nas.localize;}
//
 

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

try{	document.getElementById(eId)[eType]=value;}catch(err){alert(err);}
    }
}


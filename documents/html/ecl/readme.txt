+-----------------------------------------------------------------------------+
| タイトル | Escape Codec Library                                             |
|バージョン| Ver.041208                                                       |
|ファイル名| ecl.js, TransEscape.html                                         |
| 形    式 | HTML4.01 + JavaScript1.3                                         |
| 動作環境 | 上記の形式をサポートするブラウザ                                 |
| 動作確認 | InternetExplorer6.0, MozillaFirefox1.0, Netscape7.1, Opera7.53   |
|ソフト種別| フリーソフト                                                     |
|転載の可否| 可                                                               |
| 著 作 権 | ヌルコムアーカイブス・デジタル制作室                             |
| Ｕ Ｒ Ｌ | http://nurucom-archives.hp.infoseek.co.jp/digital/               |
+-----------------------------------------------------------------------------+

[説明]
・文字列をすべてのコンピュータで読めるような形式に変換したり、
　変換されたものを元の文字列にデコードすることができる関数のライブラリです。

・ビルトイン関数の escape() , unescape() とは異なり、どの種類のブラウザでも
　同じ変換結果が得られます。

・JISコード変換テーブルを搭載しているので、従来JavaScriptでは実現が
　困難であった、Shift_JISコードやEUC-JPコードなどの文字コードとしての
　エンコード・デコードも可能となっています。
　なお、この変換テーブルは、直接漢字は記述せず、Unicode 番号を圧縮したデータ
　をASCIIコードの文字のみで記述しているため、任意の文字コードで使用可能です。

・動作確認用の入力フォーム TransEscape.html を付属しているので、
　すぐに使用することもできます。


[関数の説明]
◆EscapeSJIS(string)
　string をShift_JISコードのタイプで escape エンコードした値を返します。
　ｉモードの絵文字領域の文字も扱うことができます。

◆UnescapeSJIS(escapedString)
　Shift_JISコードのタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。

◆EscapeEUCJP(string)
　string をEUC-JPコードのタイプで escape エンコードした値を返します。

◆UnescapeEUCJP(escapedString)
　EUC-JPコードのタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。

◆EscapeJIS7(string)
　string をJISコードのタイプで escape エンコードした値を返します。
　半角カタカナも使用可能で、7ビットでエンコードされます。

◆UnescapeJIS7(escapedString)
　JISコードのタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。
　7ビットでエンコードされた半角カタカナもデコードすることができます。

◆EscapeJIS8(string)
　string をJISコードのタイプで escape エンコードした値を返します。
　半角カタカナは、8ビットでエンコードされます。

◆UnescapeJIS8(escapedString)
　JISコードのタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。
　8ビットでエンコードされた半角カタカナもデコードすることができます。

◆EscapeUnicode(string)
　string を Unicode のタイプで escape エンコードした値を返します。
　IE4.0以上の escape() と互換性があります。
　◎ライブラリから切り取って単体で使用することも可能です。

◆UnescapeUnicode(escapedString)
　Unicode のタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。
　IE4.0以上の unescape() と互換性があります。
　◎ライブラリから切り取って単体で使用することも可能です。

◆EscapeUTF7(string)
　string を UTF-7コードのタイプで escape エンコードした値を返します。
　◎ライブラリから切り取って単体で使用することも可能です。

◆UnescapeUTF7(escapedString)
　UTF-7コードの escapedString を元の文字列にデコードした値を返します。
　◎ライブラリから切り取って単体で使用することも可能です。

◆EscapeUTF8(string)
　string を UTF-8コードのタイプで escape エンコードした値を返します。
　IE5.5 以上で実装されている encodeURI() もしくは encodeURIComponent() とは、
　エンコードする文字の範囲が異なるため、同一の値は得られませんが、
　同じくIE5.5 以上で実装される decodeURI() , decodeURIComponent()
　で問題なくデコードすることができます。
　◎ライブラリから切り取って単体で使用することも可能です。

◆UnescapeUTF8(escapedString)
　UTF-8コードのタイプで escape エンコードされた escapedString を
　元の文字列にデコードした値を返します。
　IE5.5 以上で実装されている decodeURI() , decodeURIComponent()
　と互換性があります。
　◎ライブラリから切り取って単体で使用することも可能です。
　◎ビルトイン関数の decodeURI() よりも高速にデコードします（IE6.0で確認）

◆EscapeUTF16LE(string)
　string を UTF-16LE（リトルエンディアン）コードのタイプで
　escape エンコードした値を返します。
　◎ライブラリから切り取って単体で使用することも可能です。

◆UnescapeUTF16LE(escapedString)
　UTF-16LE（リトルエンディアン）コードのタイプで escape エンコードされた
　escapedString を元の文字列にデコードした値を返します。
　◎ライブラリから切り取って単体で使用することも可能です。

◆GetEscapeCodeType(escapedString)
　escape エンコードされた escapedString を解析し、
　どのコードのタイプかを判定します。
　※半角カタカナのみからなる文字列をエンコードしたものや、
　　一部分を抜き出したもの、壊れたものなどは、
　　正確に判定できない場合があります。
　※UTF-7は判定されません。
　※コードのタイプが ASCII の場合、"EUCJP" と判定されます。
　◎ライブラリから切り取って単体で使用することも可能です。
　◎以下のようにすることで、自動判別機能付き Unescape 関数が実現します。
    UnescapeAutoDetect=function(str){
        return window["Unescape"+GetEscapeCodeType(str)](str)
    };

◆JCT11280 【String Object】
　JIS規格（JIS X 0208-1997）に取り込まれている文字に加えて、
　Windowsで使用できる○付き数字やｉモードの絵文字領域の文字
　（Shift_JIS および Unicode 系のコードで使用可能）
　なども加えた11280文字（未定義領域も含む）が、JISコード順で代入されています。
　これを生成する関数は、11280文字分のUnicode 番号を差分圧縮して、
　ASCIIコードの文字のみを使って符号化したデータとデコードプログラムからなり、
　ファイル読み込み時に実行されて、元の文字を生成するようになっています。
　この仕組みにより、11280文字を記述するのに必要なバイト数の半分近くにまで
　サイズが縮小され、そして漢字等が直接記述されていないので、
　任意の文字コードで使用することが可能となります。
　また、</ といったブラウザを混乱させるおそれのある文字列も含まれていないので、
　直接HTMLファイルにこの生成関数を記述することも可能です。
　EscapeSJIS() , UnescapeSJIS() で使用しています。

◆JCT8836 【String Object】
　上記の JCT11280 の先頭から8836文字までが代入されています。
　EscapeEUCJP() , UnescapeEUCJP() , EscapeJIS7() , UnescapeJIS7() , 
　EscapeJIS8() , UnescapeJIS8() で使用しています。


[注意]
・Shift_JIS、EUC-JP、JISコードでは、JISコード変換テーブルに無い文字
（JIS X 0212-1990 の補助漢字など）は「・」となりますので注意してください。

・現在のバージョンでは、Netscape 4.x での動作は保障していません。

・Escape Codec Library および TransEscape を使うことによって
　不利益等が生じたとしても、当方では一切責任は負いません。


[更新履歴]
Ver.041208  JCT11280 生成関数の高圧縮率化
            GetEscapeCodeType() でUTF-7は判定しないようにした
            その他、コードの効率化

Ver.041122  EscapeUTF7() , UnescapeUTF7() , EscapeUTF16LE() ,
            UnescapeUTF16LE() をあらたに追加し、
            これらのコードも判定できるように GetEscapeCodeType() を改良

Ver.041121  UnescapeSJIS() , UnescapeEUCJP() , UnescapeJIS7() ,
            UnescapeJIS8() , UnescapeUTF8() で escapedString に
            不正な部分がある場合、その部分はデコードしないようにした

Ver.041120  EscapeSJIS() , UnescapeSJIS() の、JIS X 0208 の範囲を
            超える文字を扱う際に生じる不具合を修正
            JISコード変換テーブルの文字数を11280文字に増加

Ver.041118  Netscape 4.x のサポートを終了
            EscapeJIS7() , EscapeJIS8() の高速化
            GetEscapeCodeType() の判定の精度向上および高速化
            その他、コードの効率化

Ver.041104  GetEscapeCodeType() のパラメータを修正
            その他、コードの効率化

Ver.041101  文字コードタイプの判定関数 GetEscapeCodeType() をライブラリに追加
            その他、コードの効率化

Ver.041028  UnescapeJIS7() , UnescapeJIS8() の
            エスケープシーケンスの守備範囲を広げた
            その他、コード全体の効率化

Ver.041021  Netscape 4.x での UnescapeUnicode() の不具合を完全修正

Ver.041014  UnescapeUnicode() の戻り値のlength が異常だったのを修正
            （Netscape 4.x では、length は異常なままです）

Ver.041007  Netscape 4.78 に対応した

Ver.040927  公開開始


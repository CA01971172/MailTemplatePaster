# Mail Template Paster

## 仕様
[Web版Outlook](https://outlook.office.com/mail/)において、メールを送る画面で、予め用意しておいたテンプレートを貼り付けることができる。

## 使用目的
テンプレートを貼り付けることによる、メール送信時のテンプレート記入の手間の削減を目的としている。

## 設計書
### Web版Outlookの仕様
メール本文が記入される場所は以下の通り。  
1. id属性 "editorParent_?" を持つdiv要素の中の、(?は任意の整数、最大値が最新の作成中のメール)  
1. class属性 "(dFCbN k1Ttj dPKNh DziEnなど、一定の文字列)" を持つdiv要素の中の、  
1. class属性 "elementToProof" を持つdiv要素の中  
1. (あるいは、class属性 "elementToProof" を持つdiv要素の中  の、span要素の中)

なお、改行などを行うと【3】「class属性 "elementToProof" を持つdiv要素」が行数分作成されるようだ。

### 設計
#### ウェブページ
- メールのテンプレートをWeb版Outlookに貼り付けるためのブックマークレットを作成するウェブページを作成する。
1. input要素を使用し、ユーザーからメールのテンプレートを入力してもらう。
2. 受け取った文字列データを使用し、Web版Outlookにメールのテンプレートを貼り付けるためのブックマークレットを作成する。
   1. 空白文字と改行を削除したjsプログラムのソースコードを、javascript:(function(){実行するプログラム})()といった形式の中に入れる。
3. 作成したブックマークレットをユーザーのクリップボードに出力する。
#### ブックマークレット
- メールのテンプレートをWeb版Outlookに貼り付けるためのブックマークレット用のプログラムを作成する。
##### pasteTemplate()
- まず、メールのテンプレートをWeb版Outlookに貼り付けるための関数 pasteTemplate(template) を用意し(templateはメールのテンプレート)、
その中に以下のソースコードを記述する。
(Outlook以外のページで実行された際など、要素を取得できなかった際の例外処理も行うこと)

「Web版Outlookの仕様(1)」で記述した要素を取得する。
```js
const elements = document.querySelectorAll("[id^='editorParent_']"); // IDがeditorParent_から始まっている要素を配列型で取得する
```
取得した要素からID名のみを文字列型配列で取得する。
```js
const idNames = new Array;
for (let i = 0; i < elements.length; i++) {
    idNames.push(elements[i].id); // 要素のIDを文字列型で配列に挿入する
}
```
正規表現を使用し、取得した文字列型配列から「Web版Outlookの仕様(1)」で記述した、目的のIDと要素を取得する。  
[参考文献](https://qiita.com/mascii/items/0a505698a9e5b7c70d93)
```js
const idNamesComplete = idNames.filter(RegExp.prototype.test,/^editorParent_\d$/); // 目的のIDに末尾の数字部分以外完全一致するID名群を文字列型配列で取得する
idNamesComplete.sort();
const rewriteId = idNamesComplete[idNamesComplete.length-1]; // 末尾の数字部分が最大のID名を取得する
const rewriteElement = document.getElementById(rewriteId).children[0]; // 書き換える対象の要素を取得する
```
取得した要素の子要素として、メールのテンプレートを含んだdiv要素を追加する。
```js
const templateDiv = document.createElement('div');
templateDiv.textContent = template;
rewriteElement.appendChild(templateDiv);
```
##### deleteSpaceEnter()
- 文字列から空白文字と改行を削除する関数 deleteSpaceEnter(value) を作成し(valueは受け取る文字列)、  
その中に以下のプログラムを記述する。
```js
let result = ""
const result0 = value.replace(" ", "");
const result1 = result0.replace("\n", "");
const result2 = result1.replace("　", "");
result = result2
return result
```

##### pasteClipboard()
- 受け取った文字列をクリップボードに貼り付ける関数 pasteClipboard(value) を作成し(valueは受け取る文字列)、  
その中に以下のプログラムを記述する。
```js
if(navigator.clipboard){//サポートしているかを確認
    navigator.clipboard.writeText(value)//クリップボードに出力
}
```
##### まとめ
関数 pasteTemplate() のソースコードを文字列 pasteTemplate として宣言する。
```js
const template = "メールのテンプレート"; // ユーザーがウェブページにメールのテンプレートととして入力したものを取得したもの
const encodedTemplate = encodeURI(template); // メールのテンプレートをURLエンコードする
const pasteTemplate = `
pasteTemplate(template){
    ソースコード
}
pasteTemplate(${encodedTemplate})
`;
```
受け取った文字列から空白文字と改行を削除してブックマークレットの型にはめ込む関数 convertBookmarklet() を以下の手順で用意・使用し、クリップボードに出力する文字列 bookmarklet を作成する。
1. 関数 deleteSpaceEnter() を使用し、文字列 sourceCode から空白文字と改行を削除した文字列 formattedSourceCode を作成する。
1. formattedSourceCode をブックマークレットの型にはめ込んだ文字列 bookmarklet を作成する。
```js
function convertBookmarklet(sourceCode){
const formattedSourceCode = deleteSpaceEnter(sourceCode);
const result = `javascript:(function(){${formattedSourceCode}})()`;
}
const bookmarklet = convertBookmarklet(pasteTemplate)
```
作成した文字列 bookmarklet をユーザーのクリップボードに貼り付ける。
```js
pasteClipboard(bookmarklet)
```
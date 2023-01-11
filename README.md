# Mail Template Paster

## 仕様
[Web版Outlook](https://outlook.office.com/mail/)において、メールを送る画面で、予め用意しておいたテンプレートを貼り付けることができる。

## 使用目的
テンプレートを貼り付けることによる、メール送信時のテンプレート記入の手間の削減を目的としている。

## 設計書
### Web版Outlookの仕様
- メール本文が記入される場所は以下の通り。  
id属性 "editorParent_1" を持つdiv要素の中の、  
class属性 "(dFCbN k1Ttj dPKNh DziEnなど、一定の文字列)" を持つdiv要素の中の、
class属性 "elementToProof" を持つspan要素の中
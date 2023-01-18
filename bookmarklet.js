function pasteTemplate(template){ // メールのテンプレートをWeb版Outlookに貼り付けるための関数
    const elements = document.querySelectorAll("[id^='editorParent_']");

    const idNames = new Array;
    for (let i = 0; i < elements.length; i++) {
        idNames.push(elements[i].id);
    }

    const idNamesComplete = idNames.filter(RegExp.prototype.test,/^editorParent_\d$/);
    idNamesComplete.sort();
    const rewriteId = idNamesComplete[idNamesComplete.length-1];
    const rewriteElement = document.getElementById(rewriteId).children[0];

    const templateDiv = document.createElement('div');
    templateDiv.textContent = template;
    rewriteElement.insertBefore(templateDiv, rewriteElement.firstChild);
}

const templateString = "よろしくお願いします"

try {
    pasteTemplate(templateString)
}
catch (exception) {
    window.alert("Outlookページ内のメール作成画面上で実行してください。")
}
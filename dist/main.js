function exportBookmarklet(){//完成したbookmarkletをクリップボードに出力する関数
    const template=encodeURIComponent(document.getElementById("importArea").value)
    console.log(template)
    const pasteTemplate=`
        function pasteTemplate(template){
            const elements = document.querySelectorAll("[id^='editorParent_']");
        
            const idNames = new Array;
            for (let i = 0; i < elements.length; i++) {
                idNames.push(elements[i].id);
            }

            const rewriteId = idNames[idNames.length-1];
            const rewriteElement = document.getElementById(rewriteId).children[0];
        
            const templateDiv = document.createElement('div');
            templateDiv.textContent = decodeURIComponent(template);
            rewriteElement.insertBefore(templateDiv, rewriteElement.firstChild);
        }
        
        try {
            pasteTemplate("${template}")
        }
        catch (exception) {
            window.alert("Outlookページ内のメール作成画面上で実行してください。")
        }
    `
    const bookmarklet=convertBookmarklet(pasteTemplate)
    pasteClipboard(bookmarklet)
}

function convertBookmarklet(sourceCode){//受け取った文字列をブックマークレットの型にはめ込む関数
    const formattedSourceCode=encodeURIComponent(sourceCode)
    const result=`javascript:(function(){${formattedSourceCode}})()`
    return result
}

function pasteClipboard(value){//受け取った文字列をクリップボードに貼り付ける関数
    if(navigator.clipboard){//サポートしているかを確認
        navigator.clipboard.writeText(value)//クリップボードに出力
        window.alert("クリップボードに出力しました。")
    }
}

function exportBookmarklet(){//完成したbookmarkletをクリップボードに出力する関数
    const template=document.getElementById("importArea").value
    const replacedTemplate=template.replace(/\n/g, '<br>');
    const encodedTemplate=encodeURIComponent(replacedTemplate)
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
            templateDiv.innerHTML = decodeURIComponent(template);
            rewriteElement.insertBefore(templateDiv, rewriteElement.firstChild);
        }
        
        try {
            pasteTemplate("${encodedTemplate}")
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


function setTextareaAutoResize(idName){//textareaの高さを自動調整する処理を適用する関数
    //textareaの要素を取得
    let textarea = document.getElementById(idName);
    //textareaのデフォルトの要素の高さを取得
    let clientHeight = textarea.clientHeight;

    //textareaのinputイベント
    textarea.addEventListener('input', ()=>{
        //textareaの要素の高さを設定（rows属性で行を指定するなら「px」ではなく「auto」で良いかも！）
        textarea.style.height = clientHeight + 'px';
        //textareaの入力内容の高さを取得
        let scrollHeight = textarea.scrollHeight;
        //textareaの高さに入力内容の高さを設定
        textarea.style.height = scrollHeight + 'px';
    });
}
setTextareaAutoResize('importArea');
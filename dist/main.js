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


function setTextareaAutoResize(){//textareaの高さを自動調整する処理を適用する関数
    window.addEventListener("DOMContentLoaded", () => {
        // textareaタグを全て取得
        const textareaEls = document.querySelectorAll("textarea");
        
        textareaEls.forEach((textareaEl) => {
          // デフォルト値としてスタイル属性を付与
            textareaEl.setAttribute("style", `height: ${textareaEl.scrollHeight}px;`);
          // inputイベントが発生するたびに関数呼び出し
            textareaEl.addEventListener("input", setTextareaHeight);
        });
        
        // textareaの高さを計算して指定する関数
        function setTextareaHeight() {
            this.style.height = "auto";
            this.style.height = `${this.scrollHeight}px`;
        }
    });
}
setTextareaAutoResize();
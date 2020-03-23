function onUpdatedTab (tabId, changeInfo, tabInfo) {
    console.log(changeInfo.status);
    if (changeInfo.status != "complete") {
        return;
    }

    browser.tabs.executeScript(
        tabId,
        { code: "var result = document.body.innerText; document.body.innerHTML = ''; result" }
    ).then(function (response) {
        browser.tabs.insertCSS(tabId, {
            file: "preview.css"
        });

        var data = JSON.parse(response);
        
        data.forEach(element => {
            var preview = element.preview_url;
            browser.tabs.executeScript(
                tabId,
                { code: "document.body.innerHTML += '<div class=\"previewdiv\"><img class = \"previewimg\" src=\"" + preview + "\"></img></div>';"}
            ).then(function (response) {
                console.log("test");
            });

            browser.runtime.sendMessage({
                element: element,
                downloadFolder: tags
            });
        });
    });

    //browser.tabs.onUpdated.removeListener(onUpdatedTab);
}

var tags;
function owo (e) {
    if (e.target.id != "button_download") {
        return;
    }
    
    /*var limit = document.getElementById("input_limit").value;
    limit = Math.min(Math.max(limit, 1), 100);*/

    tags = document.getElementById("input_tags").value;
    tags = tags.split(' ').join('_');
    tags = tags.split('+').join('%2B');

    var url = "https://onewaifuaday.000webhostapp.com/getkonachan.php?tags=" + tags;

    browser.tabs.onUpdated.addListener(onUpdatedTab);
    var creating = browser.tabs.create({
        url: url
    });
}

document.addEventListener("click", owo);
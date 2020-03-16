function onUpdatedTab (tabId, changeInfo, tabInfo) {
    if (changeInfo.status != "complete") {
        return;
    }
    
    console.log("owo");
    browser.tabs.executeScript(
        tabId,
        { code: "var result = document.body.innerText; result" }
    ).then(function (response) {
        var data = JSON.parse(response);
        
        data.forEach(element => {
            browser.runtime.sendMessage({
                element: element,
                downloadFolder: tags
            });
        });
    });

    browser.tabs.onUpdated.removeListener(onUpdatedTab);
}

var tags;
function owo (e) {
    if (e.target.id != "button_download") {
        return;
    }
    
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
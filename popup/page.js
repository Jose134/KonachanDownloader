function onUpdatedTab (tabId, changeInfo, tabInfo) {
    if (changeInfo.status != "complete") {
        return;
    }

    /*
    browser.tabs.executeScript(
        tabId,
        { code: "console.log(input.jsonPretty.textContent);"}
    ).then(function (response) {
        console.log(response);
    });
    */

    browser.tabs.executeScript(
        tabId,
        { code: "var object = document.getElementsByTagName('posts')[0]; var result = { count: object.attributes.count.value, text: object.innerHTML }; object.innerHTML=''; document.body=document.createElement('body'); result" }
    ).then(function (response) {
        browser.tabs.insertCSS(tabId, {
            file: "preview.css"
        });
        var count = response[0].count;
        var text = response[0].text;
        text = "<posts>" + text + "</posts>";

        var json = xmlToJson($.parseXML(text));
        json = json.posts.post;

        console.log(response[0].count);
        console.log(json);

        json.forEach(element => {
            element = element['@attributes'];
            console.log(element);
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

    browser.tabs.onUpdated.removeListener(onUpdatedTab);
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

    //var url = "https://onewaifuaday.000webhostapp.com/getkonachan.php?tags=" + tags;
    var url = "https://konachan.com/post.xml?tags=" + tags;

    browser.tabs.onUpdated.addListener(onUpdatedTab);
    var creating = browser.tabs.create({
        url: url
    });
}

document.addEventListener("click", owo);
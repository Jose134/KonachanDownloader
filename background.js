function onStarted (id) {
    console.log(`started download: ${id}`);
}

function onFailed (error) {
    console.log(`Failed to download ${error}`);
}

function download (request, sender, sendResponse) {
    var fileFormat = request.element.file_url.substr(request.element.file_url.lastIndexOf('.')+1, 3);

    var downloading = browser.downloads.download({
        url: request.element.file_url,
        filename: request.downloadFolder + "/konachan_" + request.element.id + "." + fileFormat
    });

    downloading.then(onStarted, onFailed);
}

browser.runtime.onMessage.addListener(download);

// var params= {
//     url: "https://www.youtube.com"
// }

// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange = () => onLoad();
// xhr.open('POST', '/linkPreview');
// xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// xhr.send(JSON.stringify(params))

// function onLoad() {
//     if (xhr.readyState === 4)
//         console.log(xhr.responseText);
// }


/*
doPost('/rpc/persistence/newNode', { parentId: "card-data", node: { type: "Space", name: "HardcodedSpace" } }, (xhr) => {
    if (xhr.readyState === 4)
        print("Write response: " + xhr.responseText);
});*/

doPost('/test', { parentId: "card-data", node: { type: "Space", name: "HardcodedSpace" } }, (xhr) => {
    if (xhr.readyState === 4)
        print("Write response: " + xhr.responseText);
});


// doPost('/db/writeKeyValue', { key: "KEE", value: "WALUE" }, (xhr) => {
//     if (xhr.readyState === 4)
//         print("Write response: " + xhr.responseText);
// });

// doPost('/db/readKey', { key: "KEE" }, (xhr) => {
//     if (xhr.readyState === 4)
//         print("Read response: " + xhr.responseText);
// });


function doPost(path: string, params: any, onread: (request: XMLHttpRequest) => void): void {
    params.test = true;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => onread(xhr);
    xhr.open('POST', path);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(params));
}

function print(s: string) {
    console.log("[preview.ts] " + s);
}

/*
const x = require("link-preview-generator")

x.linkPreviewGenerator(
    "https://www.youtube.com/watch?v=8mqqY2Ji7_g"
).then(function (previewData: any) {
    console.log(previewData);
});*/
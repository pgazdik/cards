
var params= {
    url: "https://www.youtube.com"
}

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => onLoad();
xhr.open('POST', '/preview');
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.send(JSON.stringify(params))

function onLoad() {
    if (xhr.readyState === 4)
        console.log(xhr.responseText);
}

/*
const x = require("link-preview-generator")

x.linkPreviewGenerator(
    "https://www.youtube.com/watch?v=8mqqY2Ji7_g"
).then(function (previewData: any) {
    console.log(previewData);
});*/
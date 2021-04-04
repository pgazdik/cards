var lp = require('link-preview-js')

exports.getLinkPreview = async function getLinkPreview(req) {
    const url = req.body?.url;
    if (!url)
        throw 'No url provided via body: ' + body;

    return lp.getLinkPreview(url)
}
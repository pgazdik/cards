import { Request } from 'express';
import lp from 'link-preview-js'

exports.getLinkPreview = async function getLinkPreview(req: Request) {
    const url = req.body?.url;
    if (!url)
        throw 'No url provided via body: ' + req.body;

    return lp.getLinkPreview(url)
}
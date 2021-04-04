


export class RpcTools {

    // static doPost(path: string, params: any, onread: (request: XMLHttpRequest) => void): void {
    //     var xhr = new XMLHttpRequest();
    //     xhr.onreadystatechange = () => onread(xhr);
    //     xhr.open('POST', path);
    //     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //     xhr.send(JSON.stringify(params))
    // }

    static async doPost(url: string, params: any): Promise<string> {
        return RpcTools.doPostStringified(url, JSON.stringify(params));
    }

    private static doPostStringified(url: string, params: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = () => reject({
                status: xhr.status,
                statusText: xhr.statusText
            });

            xhr.send(params);
        });
    }
}
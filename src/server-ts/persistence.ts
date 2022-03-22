import { NewNodeRequest } from '../client/model/ServiceModel';
/// <reference path="../../dist/client/model/DataModel.d.ts" />

const nodePersist = require('node-persist');
const uuid = require('uuid')

const CARD_DATA_ID = "card-data";

exports.Storage = class Storage {

    storage: any;

    constructor(dirPath: string) {
        this.storage = nodePersist.create({ dir: dirPath });
    }

    async init() {
        let cardData = await this.readValue(CARD_DATA_ID)
        if (cardData) {
            print("CardData already exists: " + cardData);
            return;
        }

        print("No CardData exists, creating a new one");

        cardData = { id: CARD_DATA_ID, type: "CardData", children: [] }
        await this.writeKeyValue(CARD_DATA_ID, cardData);
    }

    async dispatch(operation: string, params: any): Promise<any> {
        switch (operation) {
            case "newNode":
                return this.newNode(params);
            case "nodeChanged":
                return this.nodeChanged(params);
        }

        throw new Error("Unsupported operation: " + operation);
    }

    async newNode(params: NewNodeRequest) {
        const { node, parentId } = params;
        if (!node)
            throw 'No node to store in body: ' + params;
        if (!parentId)
            throw 'No parentId to store in body: ' + params;

        const parent = await this.requireValue(parentId);
        this.verifyValidParent(parent, node);

        node.id = uuid.v1();
        node.children = []; // TODO cannot store node, new node must be created based on node type

        await this.writeKeyValue(node.id, node);

        return node.id;
    }

    verifyValidParent(parent: any, child: any) {
        const parentToChild = new Map([
            ["CardData", "Space"],
            ["Space:", "MainTab"],
            ["MainTab", "SubTab"],
            ["SubTab", "CardHolder"]
        ]);

        const expectedChild = parentToChild.get(parent.type);
        if (!expectedChild)
            throw new Error("Invalid parameter, unknown parent type. Parent: " + parent);

        if (child.type !== expectedChild)
            throw new Error("Invalid parameter, wrong child type. Allowed: " + expectedChild + ", but was: " + child.type + ". Child: " + child);
    }

    async nodeChanged(params: any) {
        const { node, parentId } = params;
        if (!node)
            throw 'No node to store in body: ' + params;
        if (!parentId)
            throw 'No parentId to store in body: ' + params;

        const parent = await this.requireValue(parentId);

        await this.writeKeyValue(node.id, node);
        return "OK";
    }

    async writeKeyValue(key: string, value: any): Promise<void> {
        await this.storage.setItem(key, value);
        print("Written: " + value + " for key: " + key);
    }

    async requireValue(key: string): Promise<any> {
        const value = await this.readValue(key);
        if (!value)
            throw new Error("No value found for key: " + key);
        return value;
    }


    async readValue(key: string): Promise<any> {
        const value = await this.storage.getItem(key);
        print("Read: " + value + " for key: " + key);
        return value;
    }


}

/* DB */


/* Generic Key/Value OPs */

// exports.handleWrite = async function (req: Request) {
//     if (!req.body?.key)
//         throw 'No key to store in body: ' + req.body;

//     await writeKeyValue(req.body.key, req.body.value, req);
//     return "OK";
// }

// exports.handleRead = async function (req: Request) {
//     if (!req.body?.key)
//         throw 'No key to read in body: ' + req.body;

//     return readValue(req.body.key, req.body);
// }

function print(s: any) {
    console.log("[persistence.js] " + s);
}
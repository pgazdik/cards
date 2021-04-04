import * as Model from "../model/Model.js";
import { RpcTools } from "../rpc/Rpc.js";

export class Session {

    async newNode<T extends Model.Identifiable>(node: T): Promise<T> {
        node.id = await RpcTools.doPost('/rpc', { operation: "newNode", params: { node } });
        return node;
    }


    async write(key: string, value: any): Promise<void> {
        // TODO some kind of response
        RpcTools.doPost('/db/writeKeyValue', { key, value });
    }

    async read(key: string): Promise<any> {
        const x = await RpcTools.doPost('/db/readKey', { key });
        return JSON.parse(x);
    }


    async loadAppData(): Promise<Model.CardData> {
        const hello1Card = new Model.TextCard("Hello1");
        hello1Card.text = "Hello 1";

        const hello2Card = new Model.TextCard("Hello2");
        hello2Card.text = "Hello 2";

        const hello3Card = new Model.TextCard("Hello3");
        hello3Card.text = "Hello 3";

        const hello4Card = new Model.TextCard("Hello4");
        hello4Card.text = "Hello 4";

        const diesIraeCard = new Model.TextCard("diesirae");
        diesIraeCard.text = "Dies irae\ndies illa";

        const ravenCard = new Model.TextCard("raven");
        ravenCard.text = "Once upon a midnight dreary,\nwhile I pondered, weak and weary,";

        const libSubTab = new Model.SubTab("Library");
        libSubTab.cards.push(hello1Card, diesIraeCard, hello2Card, hello3Card, ravenCard, hello4Card);

        const shopSubTab = new Model.SubTab("Online shops");
        const finishedSubTab = new Model.SubTab("Finished");

        const booksTab = new Model.MainTab("Books");
        booksTab.subTabs.push(libSubTab, shopSubTab, finishedSubTab);

        const cookingTab = new Model.MainTab("Cooking");
        const videosTab = new Model.MainTab("Videos");
        const drawingTab = new Model.MainTab("Drawing");
        const stockTab = new Model.MainTab("Stock");

        const space = new Model.Space("The space");
        space.mainTabs.push(booksTab, cookingTab, videosTab, drawingTab, stockTab)

        const space2 = new Model.Space("The space2");
        const space3 = new Model.Space("The space3");

        const cardData = new Model.CardData();
        cardData.spaces.push(space, space2, space3);

        console.log(JSON.stringify(cardData));

        return cardData;
    }

}


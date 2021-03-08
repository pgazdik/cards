module Model {

    export class CardApp {
        configuration: Configuration;
        cardData: CardData;

        constructor(cardData: CardData, configuration: Configuration) {
            this.cardData = cardData;
            this.configuration = configuration;
        }
    }


    export class Configuration {
        activeSpace: Space;
        activeMainTab: MainTab;
        activeSubTab: SubTab;

        constructor(activeSpace: Space, activeMainTab: MainTab, activeSubTab: SubTab) {
            this.activeSpace = activeSpace;
            this.activeMainTab = activeMainTab;
            this.activeSubTab = activeSubTab;
        }
    }

    export class CardData {
        spaces: Space[] = [];
    }


    export class Space {
        mainTabs: MainTab[] = [];
    }

    export class MainTab {
        subTabs: SubTab[] = [];
    }

    export class SubTab {
        cards: Card[] = [];
    }


    /** Cards */

    export abstract class Card {

        name: string = "";
        customProperties: Map<string, string> = new Map();

    }

    export class TextCard {
        text: string = "";
    }

    export class Link {
        url: string = "";
    }

    export class Folder {
        cards: Card[] = [];
    }
}
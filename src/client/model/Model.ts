export abstract class Identifiable {
    type: string;

    constructor() {
        this.type = typeof (this);
    }
}

export abstract class NamedElement extends Identifiable {
    name: string = "";

    constructor(name: string) {
        super();
        this.name = name;
    }
}

export class CardData {
    spaces: Space[] = [];
}

export class Space extends NamedElement {
    mainTabs: MainTab[] = [];
    constructor(name: string) { super(name); }
}

export class MainTab extends NamedElement {
    subTabs: SubTab[] = [];
    constructor(name: string) { super(name); }
}

export class SubTab extends NamedElement {
    cards: Card[] = [];
    constructor(name: string) { super(name); }
}


/** Cards */

export abstract class Card extends NamedElement {
    customProperties: Map<string, string> = new Map();
}

export class TextCard extends Card {
    text: string = "";
    constructor(name: string) { super(name); }
}

export class Link extends Card {
    url: string = "";
    constructor(name: string) { super(name); }
}

export class Folder extends Card {
    cards: Card[] = [];
    constructor(name: string) { super(name); }
}

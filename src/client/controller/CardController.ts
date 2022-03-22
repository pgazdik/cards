import { Context } from "../CardApp.js";
import { Card } from "../model/DataModel.js";

export class CardController {
    card: Card;
    cardDiv: HTMLElement;

    constructor(context: Context, parentDiv: HTMLElement, card: Card) {
        this.card = card;

        this.cardDiv = Context.createCardDiv(card);
        parentDiv.appendChild(this.cardDiv);


    }

}
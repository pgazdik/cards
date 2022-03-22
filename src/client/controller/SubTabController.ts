import { Context } from "../CardApp.js";
import { SubTab } from "../model/DataModel.js";
import { CardController } from "./CardController.js";
import { DragSorter } from "./DragSorter.js";

export class SubTabController {
    subTab: SubTab;
    subTabDiv: HTMLElement;
    // we need to wrap cardContainer in another div, because cardContainer has display="flex", thus it cannot be hidden
    hidableCardContainer: HTMLElement;
    cardContainer: HTMLElement;
    activeCardController: CardController | null = null;

    constructor(context: Context, parentDiv: HTMLElement, subTab: SubTab) {
        this.subTab = subTab;

        this.subTabDiv = Context.createSubTabDiv(subTab);
        parentDiv.appendChild(this.subTabDiv);

        this.hidableCardContainer = Context.createHiddenDiv();
        context.cardContainers.appendChild(this.hidableCardContainer);

        this.cardContainer = Context.createCardContainer();
        this.hidableCardContainer.appendChild(this.cardContainer);

        for (const card of subTab.cards) {
            new CardController(context, this.cardContainer, card);
        }

        DragSorter.makeReSortable(this.cardContainer);
    }

    bindSelected(callback: (e: MouseEvent) => void): void {
        this.subTabDiv.addEventListener("click", (e: MouseEvent) => callback(e));
    }

    activate(): void {
        Context.setActive(this.subTabDiv);
        this.hidableCardContainer.hidden = false;
    }

    deactivate(): void {
        Context.unsetActive(this.subTabDiv);
        this.hidableCardContainer.hidden = true;
    }

}

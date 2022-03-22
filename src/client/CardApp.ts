import { SpaceController } from "./controller/SpaceController.js";
import { Card, MainTab, Space, SubTab, TextCard } from "./model/DataModel.js";
import { Session } from "./session/Session.js";

export class Context {
    spaceChangeButton = Context.get('space-change-button');
    spaceTabContainer = Context.get('space-tab-container');

    mainTabContainers = Context.get('main-tab-containers');
    subTabContainers = Context.get('sub-tab-containers');
    cardContainers = Context.get('card-containers');

    static get(id: string): HTMLElement {
        const result = document.getElementById(id);
        if (result == null)
            throw ("Initialization failed. Cannot find element with id: " + id);

        return result;
    }

    static setActive(element: HTMLElement): void {
        element.classList.add("active");
    }

    static unsetActive(element: HTMLElement): void {
        element.classList.remove("active");
    }

    static createSpaceDiv(space: Space): HTMLElement {
        const result = this.createDiv();
        result.classList.add("tab", "space-tab");
        result.textContent = space.name;

        return result;
    }

    static createMainTabDiv(mainTab: MainTab): HTMLElement {
        const result = this.createDiv();
        result.classList.add("tab", "main-tab");
        result.textContent = mainTab.name;

        return result;
    }

    static createSubTabDiv(subTab: SubTab): HTMLElement {
        const result = this.createDiv();
        result.classList.add("tab", "sub-tab");
        result.textContent = subTab.name;

        return result;
    }

    static createCardContainer(): HTMLElement {
        const result = this.createDiv();
        result.classList.add("card-container");

        return result;
    }

    static createCardDiv(card: Card): any {
        const textArea = document.createElement("textarea");
        textArea.value = (<TextCard>card).text;
        textArea.readOnly = true;

        const result = this.createDiv();
        result.classList.add("card");
        result.appendChild(textArea);

        return result;
    }

    static createHiddenDiv(): HTMLElement {
        const result = this.createDiv();
        result.hidden = true;
        return result;
    }

    static createDiv(): HTMLElement {
        return document.createElement("div");
    }


}

export class CardApp {

    context: Context;
    session: Session;
    activeSpaceController: SpaceController | null = null;

    constructor(context: Context, session: Session) {
        this.context = context;
        this.session = session;
    }

    async run(): Promise<void> {
        const cardData = await this.session.loadAppData();

        this.context.spaceChangeButton.addEventListener("click", (e: MouseEvent) => this.flipSpaceTabsVisibility());

        for (const space of cardData.spaces) {
            const spaceController = new SpaceController(this.context, space);
            spaceController.bindSelected((e: MouseEvent) => this.setActiveSpace(spaceController, e));

            if (this.activeSpaceController == null)
                this.setActiveSpace(spaceController);
        }
    }

    flipSpaceTabsVisibility(): void {
        this.context.spaceTabContainer.hidden = !this.context.spaceTabContainer.hidden;
    }

    setActiveSpace(newActiveController: SpaceController, e?: MouseEvent) {
        if (this.activeSpaceController != newActiveController) {
            this.activeSpaceController?.deactivate();
            this.activeSpaceController = newActiveController;
            this.activeSpaceController.activate();
        }

        // if we are holding the ctrl key while selecting a space, the selection div won't be hidden after we pick!
        if (!e || !e.ctrlKey)
            this.context.spaceTabContainer.hidden = true;
    }

}

/*

X - Card, Tab, SubTab

XView
    DomElement
    bindOnDelete
    bindOnEdit

XController
    XView
    XData

    registers listeners
*/

new CardApp(new Context(), new Session()).run();


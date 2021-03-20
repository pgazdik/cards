import { Context } from "../CardApp.js";
import { MainTab } from "../model/Model.js";
import { SubTabController } from "./SubTabController.js";

export class MainTabController {

    mainTab: MainTab;
    mainTabDiv: HTMLElement;
    subTabContainer: HTMLElement;
    activeSubTabController: SubTabController | null = null;


    constructor(context: Context, parentDiv: HTMLElement, mainTab: MainTab) {
        this.mainTab = mainTab;

        this.mainTabDiv = Context.createMainTabDiv(mainTab);
        parentDiv.appendChild(this.mainTabDiv);

        this.subTabContainer = Context.createHiddenDiv();
        context.subTabContainers.appendChild(this.subTabContainer);

        for (const subTab of mainTab.subTabs) {
            const subTabController = new SubTabController(context, this.subTabContainer, subTab);
            subTabController.bindSelected(() => this.setActiveSubTab(subTabController));

            if (this.activeSubTabController == null)
                this.setActiveSubTab(subTabController);
        }
    }

    bindSelected(callback: (e: MouseEvent) => void): void {
        this.mainTabDiv.addEventListener("click", (e: MouseEvent) => callback(e));
    }

    setActiveSubTab(newActiveController: SubTabController) {
        if (this.activeSubTabController != newActiveController) {
            this.activeSubTabController?.deactivate();
            this.activeSubTabController = newActiveController;
            this.activeSubTabController.activate();
        }
    }

    activate(): void {
        Context.setActive(this.mainTabDiv);
        this.subTabContainer.hidden = false;
        this.activeSubTabController?.activate();
    }

    deactivate(): void {
        Context.unsetActive(this.mainTabDiv);
        this.subTabContainer.hidden = true;
        this.activeSubTabController?.deactivate();
    }

}
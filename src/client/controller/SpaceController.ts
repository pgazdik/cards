import { Space } from "../model/DataModel.js";
import { MainTabController } from "./MainTabController.js";
import { Context } from "../CardApp.js";

export class SpaceController {

    space: Space;
    spaceTabDiv: HTMLElement;
    mainTabContainer: HTMLDivElement;
    activeMainTabController: MainTabController | null = null;

    constructor(context: Context, space: Space) {
        this.space = space;

        this.spaceTabDiv = Context.createSpaceDiv(space);
        context.spaceTabContainer.appendChild(this.spaceTabDiv);


        this.mainTabContainer = document.createElement("div");
        this.mainTabContainer.hidden = true;

        context.mainTabContainers.appendChild(this.mainTabContainer);

        for (const mainTab of space.mainTabs) {
            const mainTabController = new MainTabController(context, this.mainTabContainer, mainTab);
            mainTabController.bindSelected(() => this.setActiveMainTab(mainTabController));

            if (this.activeMainTabController == null)
                this.setActiveMainTab(mainTabController);
        }
    }

    bindSelected(callback: (e: MouseEvent) => void): void {
        this.spaceTabDiv.addEventListener("click", (e: MouseEvent) => callback(e));
    }

    setActiveMainTab(newActiveController: MainTabController) {
        if (this.activeMainTabController != newActiveController) {
            this.activeMainTabController?.deactivate();
            this.activeMainTabController = newActiveController;
            this.activeMainTabController.activate();
        }
    }

    activate() {
        Context.setActive(this.spaceTabDiv);
        this.mainTabContainer.hidden = false;
        this.activeMainTabController?.activate();
    }

    deactivate() {
        Context.unsetActive(this.spaceTabDiv);
        this.mainTabContainer.hidden = true;
        this.activeMainTabController?.deactivate();
    }


}
import Game from "../../Game.js";
import UI from "../UI.js";
import GameWindow from "../GameWindow.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import Inventory from "../../resources/Inventory.js";

// the production screen is where the player selects the priority order for resource conversions

export default class ProductionScreen {
    private html: HTMLElement;
    private run: Game;



    constructor(run: Game) {
        this.run= run;
        this.html = UI.makeDiv();
        this.refresh();
    }

    refresh() {
        let title = UI.makePara("Resource Production Report");

        // show inventory resources currently available
        let initialInventorySummary = this.renderInventory(this.run.inventory);

        // represents what the inventory will be after this turn's conversions are applied
        let inventoryCopy = this.run.inventory.clone();

        let freeConversions = this.run.getResourceConversions().filter((conversion: Conversion) => (conversion.inputs.length == 0));
        let freeConversionsHTML = freeConversions.map((conversion: Conversion) => this.renderConversion(conversion, true, false));
        
        // apply free conversions to inventory copy
        inventoryCopy.applyConversions(freeConversions);

        let costlyConversions = this.run.getResourceConversions().filter((conversion: Conversion) => (conversion.inputs.length != 0));
        let costlyConversionsHTML: HTMLElement[] = [];
        costlyConversions.forEach((conversion: Conversion) => {
            if (inventoryCopy.canAfford(conversion.inputs)) {
                costlyConversionsHTML.push(this.renderConversion(conversion, true, true));
                inventoryCopy.applyConversions([conversion]);
            } else {
                costlyConversionsHTML.push(this.renderConversion(conversion, false, true));
            }
        });

        // TODO don't duplicate inventory rendering code
        let finalInventorySummary = this.renderInventory(inventoryCopy);

        let exitButton = UI.makeButton("Back", () => {GameWindow.showWorldScreen();});

        UI.fillHTML(this.html, [
            title,
            UI.makePara("Resources available at start of next production cycle:"),
            initialInventorySummary,
            UI.makePara("Resource generation in next production cycle:"),
            UI.makeDivContaining(freeConversionsHTML),
            UI.makePara("Resource conversion in next production cycle:"),
            UI.makeDivContaining(costlyConversionsHTML),
            UI.makePara("Resources available at end of next production cycle:"),
            finalInventorySummary,
            exitButton,
        ]);
    }

    getHTML() {
        return this.html;
    }

    private renderInventory(inventory: Inventory): HTMLElement {
        let resourceDescriptions = inventory.getInventoryStrings().map((resourceString: string) => UI.makePara(resourceString));
        return UI.makeDivContaining(resourceDescriptions);
    }

    renderConversion(conversion: Conversion, canAfford: boolean, showMoveButtons: boolean) {
        let div = UI.makeDiv(['flex-horizontal']);

        let text = conversion.toString();
        let cssClass = 'conversion-description-normal';
        if (!conversion.enabled) {
            text = `(disabled) ${conversion.toString()}`;
            cssClass = 'conversion-description-disabled';
        } else if (!this.run.inventory.canAfford(conversion.inputs)) {
            text = `(cannot afford) ${conversion.toString()}`;
            cssClass = `conversion-description-cannot-afford`;
        }
        
        let conversionToggleButton = UI.makeButton(text, () => {this.toggle(conversion);}, [cssClass]);
        div.appendChild(conversionToggleButton);

        if (showMoveButtons) {
            div.appendChild(UI.makeButton("Move Up", () => this.moveUp(conversion)));
            div.appendChild(UI.makeButton("Move Down", () => this.moveDown(conversion)));
        }

        return div;
    }

    private moveUp(conversion: Conversion) {
        this.run.increasePriority(conversion);
        this.refresh();
    }

    private moveDown(conversion: Conversion) {
        this.run.decreasePriority(conversion);
        this.refresh();
    }

    private toggle(conversion: Conversion) {
        conversion.enabled = !conversion.enabled;
        this.refresh();
    }
}
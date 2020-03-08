import { UI } from "../UI.js";
import Inventory from "../../resources/Inventory.js";
import Game from "../../Game.js";
import { Page } from "../GameWindow.js";

export default class InventorySidebar implements Page {

    readonly html: HTMLElement;
    private inventory: Inventory;

    constructor(game: Game) {
        this.inventory = game.inventory;
        this.html = UI.makeDiv(["world-screen-inventory"]);
        this.refresh();
    }

    refresh(): void {

        const populationHTML = UI.makeDiv();
        for (const description of this.inventory.getPopulationStrings()) {
            populationHTML.appendChild(UI.makePara(description));
        }

        const resourceListHTML = UI.makeDiv();
        for (const description of this.inventory.getInventoryStrings()) {
            resourceListHTML.appendChild(UI.makePara(description));
        }
        if (this.inventory.getResourceList().length === 0) {
            resourceListHTML.appendChild(UI.makePara("(none)"));
        }

        UI.fillHTML(this.html, [UI.makeDivContaining([
            UI.makeDivContaining([UI.makeHeader("Population", 1, [])], ["world-screen-population-header"]),
            UI.makePara(`Available workers: ${this.inventory.getAvailableWorkers()}`),
            UI.makePara(`Total population:${(this.inventory.getTotalPopulation() === 0) ? " 0" : ""}`),
            populationHTML,
            UI.makeHeader("Inventory", 1),
            resourceListHTML,
        ])]);
    }
}

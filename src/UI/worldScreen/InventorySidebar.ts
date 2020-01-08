import UI from "../UI.js";
import Inventory from "../../resources/Inventory.js";
import Game from "../../Game.js";

export default class InventorySidebar {

    private html: HTMLElement;
    private inventory: Inventory;

    constructor(game: Game) {
        this.inventory = game.inventory;
        this.html = UI.makeDiv(['world-screen-inventory']);
        this.refresh();
    }

    getHTML() {
        return this.html;
    }

    refresh() {
        const populationLabel = UI.makeHeader(`Population: ${this.inventory.getTotalPopulation()}`, 1);
        const availableWorkerLabel = UI.makePara(`Available workers: ${this.inventory.getAvailableWorkers()}`);
        const populationHTML = UI.makeDiv();
        this.inventory.getPopulationStrings().forEach((description: string) => {
            populationHTML.appendChild(UI.makePara(description));
        });

        const resourceListHTML = UI.makeDiv();
        this.inventory.getInventoryStrings().forEach((description: string) => {
            resourceListHTML.appendChild(UI.makePara(description));
        });

        UI.fillHTML(this.html, [UI.makeDivContaining([
            populationLabel,
            availableWorkerLabel,
            populationHTML,
            UI.makeHeader("Inventory:", 1),
            resourceListHTML,
        ])]);
    }
}

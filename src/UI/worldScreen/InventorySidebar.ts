import UI from "../UI.js";
import Inventory from "../../resources/Inventory.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";

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
        let resourceListHTML = UI.makeDiv();
        this.inventory.getInventoryStrings().forEach((description: string) => {
            resourceListHTML.appendChild(UI.makePara(description));
        });

        UI.fillHTML(this.html, [UI.makeDivContaining([
            UI.makePara("Inventory:"),
            resourceListHTML,
        ])])
    }
}
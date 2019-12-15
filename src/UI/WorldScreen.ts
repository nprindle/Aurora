import UI from "./UI.js";
import MapUI from "./MapUI.js";
import Game from "../Game.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen {

    private mapUI: MapUI;
    private inventoryHTML: HTMLElement;
    private sidebar: HTMLElement;
    private headerHTML: HTMLElement;
    worldScreenHTML: HTMLElement;

    constructor() {
        this.mapUI = new MapUI(Game.world);
        this.inventoryHTML = UI.makePara("To be assembled in rerender");
        this.sidebar = UI.makePara("To be assembled in rerender");
        this.headerHTML = UI.makePara("To be assembled in rerender");
        this.worldScreenHTML = UI.makePara("To be assembled in rerender");
        this.rerenderWorldScreen();
    }

    /* Refreshes all components of the world screen and returns then new HTML
     */
    rerenderWorldScreen(): HTMLElement {
        this.mapUI.rerenderFullMap();
        let mapHTML = this.mapUI.getViewCanvas();
        this.inventoryHTML = UI.makePara("Resource List Goes Here", ['world-screen-inventory']);
        this.sidebar = UI.makePara("Project options go here", ['world-screen-sidebar']);
        this.headerHTML = UI.makePara("Status Header goes here", ['world-screen-header']);

        this.worldScreenHTML = UI.makeDivContaining([

            this.headerHTML,

            UI.makeDivContaining([
                this.inventoryHTML,
                UI.makeDivContaining([mapHTML], ['world-screen-map-box']),
                this.sidebar
            ], ['world-screen-hbox']),

        ], ['flex-vertical']);

        return this.worldScreenHTML;
    }
}
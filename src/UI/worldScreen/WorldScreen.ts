import UI from "../UI.js";
import MapUI from "./MapUI.js";
import TileSidebar from "./TileSidebar.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import Game from "../../Game.js";
import InventorySidebar from "./InventorySidebar.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen {

    private mapUI: MapUI;
    private inventorySidebar: InventorySidebar;
    private tileSidebar: TileSidebar;
    private headerHTML: HTMLElement;
    worldScreenHTML: HTMLElement;

    constructor(run: Game) {
        this.mapUI = new MapUI(this, run.world);
        this.tileSidebar = new TileSidebar(this, run);

        let mapHTML = this.mapUI.getViewCanvas();
        this.inventorySidebar = new InventorySidebar(run);
        let tileSidebarHTML = this.tileSidebar.getHTML();
        let inventoryHTML = this.inventorySidebar.getHTML();
        this.headerHTML = UI.makePara("Status Header goes here", ['world-screen-header']);

        this.worldScreenHTML = UI.makeDivContaining([

            this.headerHTML,

            UI.makeDivContaining([
                inventoryHTML,
                UI.makeDivContaining([mapHTML], ['world-screen-map-box']),
                tileSidebarHTML,
            ], ['world-screen-hbox']),

        ], ['flex-vertical']);
    }

    public getHTML(): HTMLElement {
        return this.worldScreenHTML;
    }

    refreshComponents() {
        this.mapUI.refreshViewableArea(); //TODO fix problem where tile changes are sometimes not shown on update
        this.tileSidebar.refresh();
        this.inventorySidebar.refresh();
        // TODO refresh status bar UI
    }



    // keyboard events when on this page are passed to the map ui, which uses arrow keys or wasd to move around the map
    handleKeyDown(ev: KeyboardEvent) {
        this.mapUI.handleKeyDown(ev);
    }

    changeSidebarTile(position: GridCoordinates | null) {
        this.tileSidebar.changeTile(position);
    }
}
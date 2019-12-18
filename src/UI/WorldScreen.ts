import UI from "./UI.js";
import MapUI from "./MapUI.js";
import TileSidebar from "./TileSidebar.js";
import GridCoordinates from "../world/GridCoordinates.js";
import Game from "../Game.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen {

    private mapUI: MapUI;
    private inventoryHTML: HTMLElement;
    private sidebar: TileSidebar;
    private headerHTML: HTMLElement;
    worldScreenHTML: HTMLElement;

    constructor(run: Game) {
        this.mapUI = new MapUI(this, run.world);
        this.sidebar = new TileSidebar(this, run);

        let mapHTML = this.mapUI.getViewCanvas();
        this.inventoryHTML = UI.makePara("Resource List Goes Here", ['world-screen-inventory']);
        let sidebarHTML = this.sidebar.getHTML();
        this.headerHTML = UI.makePara("Status Header goes here", ['world-screen-header']);

        this.worldScreenHTML = UI.makeDivContaining([

            this.headerHTML,

            UI.makeDivContaining([
                this.inventoryHTML,
                UI.makeDivContaining([mapHTML], ['world-screen-map-box']),
                sidebarHTML,
            ], ['world-screen-hbox']),

        ], ['flex-vertical']);
    }

    public getHTML(): HTMLElement {
        return this.worldScreenHTML;
    }

    refreshComponents() {
        this.mapUI.refreshViewableArea();
        this.sidebar.refresh();
        // TODO refresh status bar UI
        // TODO refresh inventory UI
    }



    // keyboard events when on this page are passed to the map ui, which uses arrow keys or wasd to move around the map
    handleKeyDown(ev: KeyboardEvent) {
        this.mapUI.handleKeyDown(ev);
    }

    changeSidebarTile(position: GridCoordinates | null) {
        this.sidebar.changeTile(position);
    }
}
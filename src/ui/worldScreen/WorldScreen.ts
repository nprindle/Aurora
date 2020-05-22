import { UI } from "../UI.js";
import MapUI from "./MapUI.js";
import TileSidebar from "./TileSidebar.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import Game from "../../Game.js";
import InventorySidebar from "./InventorySidebar.js";
import WorldScreenHeader from "./WorldScreenHeader.js";
import QuestIndicator from "./QuestIndicator.js";
import { Page } from "../Page.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen implements Page {

    private mapUI: MapUI;
    private inventorySidebar: InventorySidebar;
    private tileSidebar: TileSidebar;
    private header: WorldScreenHeader;
    private questIndicator: QuestIndicator;
    readonly html: HTMLElement;

    constructor(
        game: Game,
        // disabling the header buttons prevents the player from accessing menu pages or advancing to the next turn
        headerButtonState: "enabled" | "disabled" = "enabled"
    ) {
        this.mapUI = new MapUI(this, game.world);
        this.tileSidebar = new TileSidebar(this, game);
        this.inventorySidebar = new InventorySidebar(game.inventory);
        this.header = new WorldScreenHeader(game, headerButtonState);
        this.questIndicator = new QuestIndicator(game);

        this.html = UI.makeDivContaining([
            this.header.html,
            this.questIndicator.html,
            UI.makeDivContaining([
                this.inventorySidebar.html,
                UI.makeDivContaining([this.mapUI.html], ["world-screen-map-box"]),
                this.tileSidebar.html,
            ], ["world-screen-hbox"]),
        ], ["world-screen"]);
    }

    refresh(): void {
        this.mapUI.refresh();
        this.tileSidebar.refresh();
        this.inventorySidebar.refresh();
        this.questIndicator.refresh();
    }

    // keyboard events for this page are passed to the map ui, which uses arrow keys or wasd to move around the map
    handleKeyDown(ev: KeyboardEvent): void {
        this.mapUI.handleKeyDown(ev);
    }

    changeSidebarTile(position: GridCoordinates | undefined): void {
        this.tileSidebar.changeTile(position);
    }
}

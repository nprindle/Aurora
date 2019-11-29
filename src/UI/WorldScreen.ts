import UI from "./UI.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen {

    private mapHTML: HTMLElement;
    private inventoryHTML: HTMLElement;
    private sidebar: HTMLElement;
    private headerHTML: HTMLElement;
    worldScreenHTML: HTMLElement;

    constructor() {
        this.mapHTML = UI.makePara("To be assembled in rerender");
        this.inventoryHTML = UI.makePara("To be assembled in rerender");
        this.sidebar = UI.makePara("To be assembled in rerender");
        this.headerHTML = UI.makePara("To be assembled in rerender");
        this.worldScreenHTML = UI.makePara("To be assembled in rerender");
        this.rerenderWorldScreen();
    }

    /* Refreshes all components of the world screen and returns then new HTML
     *
     */
    rerenderWorldScreen(): HTMLElement {
        //TODO call renderers for components
        this.mapHTML = UI.makePara("MAP GOES HERE", ['map-display', 'fill-vertical']);
        this.inventoryHTML = UI.makePara("Resource List Goes Here", ['world-screen-inventory']);
        this.sidebar = UI.makePara("Project options go here", ['world-screen-sidebar']);
        this.headerHTML = UI.makePara("Status Header goes here", ['world-screen-header']);

        this.worldScreenHTML = UI.makeDivContaining([
            this.headerHTML,

            UI.makeDivContaining([
                this.mapHTML,
                this.sidebar
            ], ['flex-horizontal', 'fill-horizontal']),

            this.inventoryHTML,
        ], ['flex-vertical']);

        return this.worldScreenHTML;
    }
}
import GridCoordinates from "../world/GridCoordinates.js";
import UI from "./UI.js";
import World from "../world/World.js";

export default class TileSidebar {
    position: GridCoordinates | null = null;
    world: World;

    private root: HTMLElement;


    constructor(world: World) {
        this.world = world;
        this.root = UI.makeDiv(['world-screen-sidebar']);

        this.refresh();
    }

    getHTML() {
        return this.root;
    }

    changeTile(newPosition: GridCoordinates | null) {
        this.position = newPosition;
        this.refresh();
    }

    private refresh() {
        console.log(`Refresh sidebar`);
        if (this.position != null) {
            let tile = this.world.getTileAtCoordinates(this.position);
            console.log(`selected`);
            UI.fillHTML(this.root, [
                UI.makePara(`${tile.getTileName()}`),
                UI.makePara(`Coordinates: ${this.position.x}, ${this.position.y}`),
            ]);
        } else {
            console.log(`unselected`);
            UI.fillHTML(this.root, [
                UI.makePara(`No structure or terrain tile selected`),
            ]);
        }
    }




}
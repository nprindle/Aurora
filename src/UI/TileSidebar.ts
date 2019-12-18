import GridCoordinates from "../world/GridCoordinates.js";
import UI from "./UI.js";
import World from "../world/World.js";
import TileProject from "../tileProjects/TileProject.js";
import WorldScreen from "./WorldScreen.js";

export default class TileSidebar {
    position: GridCoordinates | null = null;
    world: World;
    parentScreen: WorldScreen;

    private root: HTMLElement;


    constructor(parentScreen: WorldScreen, world: World) {
        this.parentScreen = parentScreen;
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

    refresh() {
        if (this.position != null) {
            let tile = this.world.getTileAtCoordinates(this.position);

            let projectsHTML = UI.makeDiv();
            tile.possibleProjects.forEach((project: TileProject) => {
                let button = UI.makeButton(project.title, () => {
                    project.action(tile.position, this.world);
                    this.parentScreen.refreshComponents();
                });

                projectsHTML.appendChild(button);
            });

            UI.fillHTML(this.root, [
                UI.makePara(`${tile.getTileName()}`),
                UI.makePara(`Coordinates: ${this.position.x}, ${this.position.y}`),
                projectsHTML,
            ]);
        } else {
            UI.fillHTML(this.root, [
                UI.makePara(`No structure or terrain tile selected`),
            ]);
        }
    }




}
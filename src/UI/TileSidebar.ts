import GridCoordinates from "../world/GridCoordinates.js";
import UI from "./UI.js";
import World from "../world/World.js";
import TileProject from "../tileProjects/TileProject.js";
import WorldScreen from "./WorldScreen.js";
import Game from "../Game.js";
import Cost from "../resources/Cost.js";
import { Resource } from "../resources/Resource.js";

export default class TileSidebar {
    position: GridCoordinates | null = null;
    run: Game;
    parentScreen: WorldScreen;

    private root: HTMLElement;


    constructor(parentScreen: WorldScreen, run: Game) {
        this.parentScreen = parentScreen;
        this.run = run;
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
            let tile = this.run.world.getTileAtCoordinates(this.position);

            let projectsHTML = UI.makeDiv();
            tile.possibleProjects.forEach((project: TileProject) => {
                let disabled = !project.canDo(tile.position, this.run);
                let button = UI.makeButton(project.title, () => {
                    project.doAction(tile.position, this.run);
                    this.parentScreen.refreshComponents();
                }, [], disabled);

                projectsHTML.appendChild(button);

                if (project.costs.length == 0) {
                    projectsHTML.appendChild(UI.makePara("Cost: Free"));
                } else {
                    let costDescriptions = project.costs.map((cost: Cost) => `${Resource.getName(cost.resource)} x${cost.quantity}`);
                    let costsString = "Cost: " + costDescriptions.join(', ');
                    projectsHTML.appendChild(UI.makePara(costsString));
                }
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
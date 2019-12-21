import GridCoordinates from "../../world/GridCoordinates.js";
import UI from "../UI.js";
import TileProject from "../../tileProjects/TileProject.js";
import WorldScreen from "./WorldScreen.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import AbstractTile from "../../world/AbstractTile.js";
import TilePredicate from "../../predicates/TilePredicate.js";

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
                projectsHTML.appendChild(this.makeProjectHTML(tile, project));
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

    private makeProjectHTML(tile: AbstractTile, project: TileProject): HTMLElement {
        let projectHTML = UI.makeDiv();

        let disabled = !project.canDo(tile.position, this.run);
        let button = UI.makeButton(project.title, () => {
            this.doProject(project, tile);
        }, [], disabled);
        projectHTML.appendChild(button);

        if (project.costs.length == 0) {
            projectHTML.appendChild(UI.makePara("Cost: Free"));
        } else {
            let costDescriptions = project.costs.map((cost: Cost) => `${cost.resource.name} x${cost.quantity}`);
            let costsString = "Cost: " + costDescriptions.join(', ');
            projectHTML.appendChild(UI.makePara(costsString));
        }

        if (project.completionRequirements.length > 0) {
            let requirementsString = project.completionRequirements.map((req: TilePredicate) => `- ${req.toString()}\n`).join('');
            projectHTML.appendChild(UI.makePara(`Requirements:\n${requirementsString}`));
        }               


        return projectHTML;
    }

    private doProject(project: TileProject, tile: AbstractTile) {
        project.doAction(tile.position, this.run);
        this.parentScreen.refreshComponents();
    }


}
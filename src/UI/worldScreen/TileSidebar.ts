import GridCoordinates from "../../world/GridCoordinates.js";
import UI from "../UI.js";
import TileProject from "../../tileProjects/TileProject.js";
import WorldScreen from "./WorldScreen.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import AbstractTile from "../../world/AbstractTile.js";
import TilePredicate from "../../predicates/TilePredicate.js";
import Conversion from "../../resources/Conversion.js";

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
            if(tile.possibleProjects.length > 0) {
                projectsHTML.appendChild(UI.makePara("Projects:"));
            }
            tile.possibleProjects.forEach((project: TileProject) => {
                projectsHTML.appendChild(this.makeProjectHTML(tile, project));
            });

            let conversionsHTML = UI.makeDiv();
            if(tile.resourceConversions.length > 0) {
                conversionsHTML.appendChild(UI.makePara("Production:"))
            }
            tile.resourceConversions.forEach((conversion: Conversion) => {
                conversionsHTML.appendChild(this.makeConversionHTML(conversion));
            });

            UI.fillHTML(this.root, [
                UI.makePara(`${tile.getTileName()}`),
                UI.makePara(`Coordinates: ${this.position.x}, ${this.position.y}`),
                projectsHTML,
                conversionsHTML,
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
            let costDescriptions = project.costs.map((cost: Cost) => `${cost.toString()}`);
            let costsString = "Cost: " + costDescriptions.join(', ');
            projectHTML.appendChild(UI.makePara(costsString));
        }

        if (project.completionRequirements.length > 0) {
            let requirementsString = project.completionRequirements.map((req: TilePredicate) => `- ${req.toString()}\n`).join('');
            projectHTML.appendChild(UI.makePara(`Requirements:\n${requirementsString}`));
        }               


        return projectHTML;
    }

    private makeConversionHTML(conversion: Conversion): HTMLElement {
        let conversionHTML = UI.makeDiv();

        let inputDescription = conversion.inputs.map((input: Cost) => input.toString()).join(', ');
        let outputDescription = conversion.outputs.map((output: Cost) => output.toString()).join(', ');

        // TODO standardize conversion tostring
        let description = (conversion.inputs.length == 0) ? `- Produce ${outputDescription}` : `- Convert ${inputDescription} into ${outputDescription}`

        return UI.makePara(description);
    }

    private doProject(project: TileProject, tile: AbstractTile) {
        project.doAction(tile.position, this.run);
        this.parentScreen.refreshComponents();
    }


}
import GridCoordinates from "../../world/GridCoordinates.js";
import UI from "../UI.js";
import TileProject from "../../tileProjects/TileProject.js";
import WorldScreen from "./WorldScreen.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Tile from "../../world/Tile.js";
import TilePredicate from "../../predicates/TilePredicate.js";
import Conversion from "../../resources/Conversion.js";

export default class TileSidebar {
    position: GridCoordinates | null = null;

    private html: HTMLElement;


    constructor(
        private parentScreen: WorldScreen,
        private run: Game
    ) {
        this.html = UI.makeDiv(['world-screen-sidebar']);

        this.refresh();
    }

    getHTML() {
        return this.html;
    }

    changeTile(newPosition: GridCoordinates | null) {
        this.position = newPosition;
        this.refresh();
    }

    refresh() {
        if (this.position == null) {
            UI.fillHTML(this.html, [
                UI.makePara(`No structure or terrain tile selected`),
            ]);
        } else {
            let tile = this.run.world.getTileAtCoordinates(this.position);

            let projectsHTML = UI.makeDiv();
            if(tile.possibleProjects.length > 0) {
                projectsHTML.appendChild(UI.makePara("Projects:"));
                tile.possibleProjects.forEach((project: TileProject) => {
                    projectsHTML.appendChild(this.makeProjectHTML(tile, project));
                });
            }

            let conversionsHTML = UI.makeDiv();
            if(tile.resourceConversions.length > 0) {
                conversionsHTML.appendChild(UI.makePara("Production:"))
                tile.resourceConversions.forEach((conversion: Conversion) => {
                    conversionsHTML.appendChild(this.makeConversionHTML(conversion));
                });
            }

            UI.fillHTML(this.html, [
                UI.makePara(tile.getTileName()),
                UI.makePara(`Coordinates: ${this.position.x}, ${this.position.y}`),
                projectsHTML,
                conversionsHTML,
            ]);
        }
    }

    private makeProjectHTML(tile: Tile, project: TileProject): HTMLElement {
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
        return UI.makePara(`- ${conversion.toString()}`);
    }

    private doProject(project: TileProject, tile: Tile) {
        project.doAction(tile.position, this.run);
        this.parentScreen.refreshComponents();
    }
}

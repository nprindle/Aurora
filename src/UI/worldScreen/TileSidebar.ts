import GridCoordinates from "../../world/GridCoordinates.js";
import { UI } from "../UI.js";
import TileProject from "../../tileProjects/TileProject.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Tile from "../../world/Tile.js";
import { Page } from "../GameWindow.js";

export default class TileSidebar implements Page {
    position: GridCoordinates | undefined = undefined;

    readonly html: HTMLElement;

    constructor(
        private parentScreen: Page,
        private game: Game
    ) {
        this.html = UI.makeDiv(["world-screen-sidebar"]);
        this.refresh();
    }

    changeTile(newPosition: GridCoordinates | undefined): void {
        this.position = newPosition;
        this.refresh();
    }

    refresh(): void {
        if (this.position === undefined) {
            UI.fillHTML(this.html, [
                UI.makePara(`No structure or terrain tile selected`, ["sidebar-tile-name"]),
            ]);
        } else {
            const tile = this.game.world.getTileAtCoordinates(this.position)!;

            const housingHTML = UI.makeDiv();
            if (tile.populationCapacity) {
                const capacity = tile.populationCapacity.capacity;
                const species = tile.populationCapacity.species;
                housingHTML.appendChild(UI.makePara(
                    `Population capacity for ${capacity} ${species.name}`
                ));
            }

            const projectsHTML = UI.makeDiv();
            const visibleProjects = tile.possibleProjects.filter(
                project => project.isVisible(this.position!, this.game)
            );
            for (const project of visibleProjects) {
                projectsHTML.appendChild(this.makeProjectHTML(tile, project));
            }

            const conversionsHTML = UI.makeDiv();
            if (tile.resourceConversions.length > 0) {
                conversionsHTML.appendChild(UI.makePara("Production:"));
                for (const conversion of tile.resourceConversions) {
                    conversionsHTML.appendChild(UI.makePara(`- ${conversion.toString()}`));
                }
            }

            UI.fillHTML(this.html, [
                UI.makePara(tile.getTileName(), ["sidebar-tile-name"]),
                UI.makePara(tile.getTileDescription()),
                housingHTML,
                conversionsHTML,
                projectsHTML,
            ]);
        }
    }

    private makeProjectHTML(tile: Tile, project: TileProject): HTMLElement {
        const projectHTML = UI.makeDiv(["tile-project"]);

        const button = UI.makeButton(
            project.title,
            () => { this.doProject(project, tile); },
            [],
            project.canDo(tile.position, this.game) ? "enabled" : "disabled",
        );
        projectHTML.appendChild(button);

        projectHTML.appendChild(UI.makePara(project.projectDescription));

        if (project.costs.length === 0) {
            projectHTML.appendChild(UI.makePara("Cost: Free"));
        } else {
            const inventoryClone = this.game.inventory.clone();
            const costParas = project.costs.map((cost: Cost) => {
                const affordable = inventoryClone.canAfford([cost]);
                const para = UI.makePara(cost.toString(),
                    [affordable ? "project-requirement-met" : "project-requirement-unmet"]);
                if (affordable) {
                    inventoryClone.payCost([cost]);
                }
                return para;
            });
            projectHTML.appendChild(UI.makeDivContaining([UI.makePara("Costs: "), ...costParas]));
        }

        if (project.completionRequirements.length > 0) {
            projectHTML.appendChild(UI.makePara("Requirements:"));
        }
        for (const requirement of project.completionRequirements) {
            const cssClass = requirement.evaluate(this.game, this.position!)
                ? "project-requirement-met"
                : "project-requirement-unmet";
            projectHTML.appendChild(UI.makePara(`- ${requirement.toString()}`, [cssClass]));
        }

        return projectHTML;
    }

    private doProject(project: TileProject, tile: Tile): void {
        project.doAction(tile.position, this.game);
        this.game.updateQuestState(); // effects of project may cause a quest objective to be completed
        this.parentScreen.refresh();
    }
}

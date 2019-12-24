import Game from "../../Game.js";
import UI from "../UI.js";
import GameWindow from "../GameWindow.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";

// the production screen is where the player selects the priority order for resource conversions

export default class ProductionScreen {
    private html: HTMLElement;
    private run: Game;



    constructor(run: Game) {
        this.run= run;
        this.html = UI.makeDiv();
        this.refresh();
    }

    refresh() {
        let title = UI.makePara("Resource Production Report");

        // show inventory resources currently available
        let resourceStrings = this.run.inventory.getResourceList().map((res: Resource) => `${res.name}: ${this.run.inventory.getQuantity(res)}`);
        let initialInventorySummary = UI.makePara(resourceStrings.join("\n"));

        let freeConversions = this.run.getResourceConversions().filter((conversion: Conversion) => (conversion.inputs.length == 0));
        let freeConversionsHTML = freeConversions.map((conversion: Conversion) => this.renderConversion(conversion));

        let costlyConversions = this.run.getResourceConversions().filter((conversion: Conversion) => (conversion.inputs.length != 0));
        let costlyConversionsHTML = costlyConversions.map((conversion: Conversion) => this.renderConversion(conversion));
        
        let exitButton = UI.makeButton("Back", () => {GameWindow.showWorldScreen();});

        UI.fillHTML(this.html, [
            title,
            initialInventorySummary,
            UI.makePara("Resource generation in next production cycle:"),
            UI.makeDivContaining(freeConversionsHTML),
            UI.makePara("Resource conversion in next production cycle:"),
            UI.makeDivContaining(costlyConversionsHTML),
            exitButton,
        ]);
    }

    getHTML() {
        return this.html;
    }

    renderConversion(conversion: Conversion) {
        let div = UI.makeDiv(['flex-horizontal']);

        let inputDescription = conversion.inputs.map((input: Cost) => input.toString()).join(', ');
        let outputDescription = conversion.outputs.map((output: Cost) => output.toString()).join(', ');

        // TODO standardize conversion tostring method
        let description = (conversion.inputs.length == 0) ? `Produce ${outputDescription}` : `Convert ${inputDescription} into ${outputDescription}`
        div.appendChild(UI.makePara(description));

 
        return div;
    }
}
import Cost from "./Cost";
import { NonEmptyArray } from "../util/Util";

// a conversion from input resources to output resources that can be performed between turns by a tile if its input respurces are available
export default class Conversion {

    private static nextNumber = 1;

    /* conversions are sorted by priority to determine the order in which conversions are applied
     * lower numbered conversions are applied first; conversions with no imputs are priority 0
     */
    public priority: number;
    public enabled: boolean = true; // conversion will be skipped when disabled

    constructor(
        public readonly inputs: Cost[],
        public readonly outputs: NonEmptyArray<Cost>,
    ) {
        if (inputs.length == 0) {
            this.priority = 0;
        } else {
            this.priority = Conversion.nextNumber;
            Conversion.nextNumber++;
        }
    }

    toString() {
        let inputDescription = this.inputs.map((input: Cost) => input.toString()).join(', ');
        let outputDescription = this.outputs.map((output: Cost) => output.toString()).join(', ');
        if (this.inputs.length == 0) {
            return `Produce ${outputDescription}`;
        } else {
            return `Convert ${inputDescription} into ${outputDescription}`;
        }
    }
}
import Cost from "./Cost.js";
import { NonEmptyArray } from "../util/Arrays.js";

// a conversion from input resources to output resources that a tile can perform between turns if the conversion's input respurces are available
export default class Conversion {

    private static nextNumber = 1; // the initial priority of the next non-free conversion that will be created

    /* conversions are sorted by priority to determine the order in which conversions are applied
     * lower numbered conversions are applied first; conversions with no imputs are priority 0
     * because they should always be applied before any other conversions
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
        const outputDescription = this.outputs.map((output: Cost) => output.toString()).join(', ');
        if (this.inputs.length == 0) {
            return `Produce ${outputDescription}`;
        } else {
            const inputDescription = this.inputs.map((input: Cost) => input.toString()).join(', ');
            return `Convert ${inputDescription} into ${outputDescription}`;
        }
    }
}

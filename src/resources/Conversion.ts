import Cost from "./Cost.js";
import { NonEmptyArray } from "../util/Arrays.js";

/* a conversion from input resources to output resources that a tile can perform between turns if the conversion's
 * input resources are available
 */
export default class Conversion {

    private static nextNumber = 0; // the initial priority of the next non-free conversion that will be created

    /* conversions are sorted by priority to determine the order in which conversions are applied
     * lower numbered conversions are applied first
     */
    public priority: number;
    public enabled: boolean = true; // conversion will be skipped when disabled

    constructor(
        public readonly inputs: Cost[],
        public readonly outputs: NonEmptyArray<Cost>,
        public readonly requiredWorkers: number = 0,
    ) {
        this.priority = Conversion.nextNumber;
        Conversion.nextNumber++;
    }

    toString(): string {
        const outputDescription = this.outputs.map((output: Cost) => output.toString()).join(", ");
        const inputStrings = this.inputs.map(cost => cost.toString());
        if (this.requiredWorkers !== 0) {
            inputStrings.push(`${this.requiredWorkers} workers`);
        }
        const inputDescription = inputStrings.join(", ");

        if (inputStrings.length === 0) {
            return `Produce ${outputDescription}`;
        } else {
            return `Produce ${outputDescription} using ${inputDescription}`;
        }
    }
}

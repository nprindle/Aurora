import Cost from "./Cost.js";
import { NonEmptyArray } from "../util/Arrays.js";
import { Schemas as S } from "@nprindle/augustus";
import World from "../world/World.js";

/* a conversion from input resources to output resources that a tile can perform between turns if the conversion's
 * input resources are available
 */
export default class Conversion {

    public enabled: boolean = true; // conversion will be skipped when disabled

    constructor(
        public readonly inputs: Cost[],
        public readonly outputs: NonEmptyArray<Cost>,
        public readonly requiredWorkers: number,
        // Conversions are sorted by priority to determine the order in which
        // conversions are applied. Lower numbered conversions are applied first
        public priority: number,
    ) {}

    static newConversion(world: World, inputs: Cost[], outputs: NonEmptyArray<Cost>, requiredWorkers: number = 0): Conversion {
        const priority = world.nextConversionPriority();
        return new Conversion(inputs, outputs, requiredWorkers, priority);
    }

    isFree(): boolean {
        return this.inputs.length === 0 && this.requiredWorkers === 0;
    }

    toString(): string {
        const outputDescription = this.outputs.map(output => output.toString()).join(", ");
        if (this.isFree()) {
            return `Produce ${outputDescription}`;
        } else {
            const inputStrings = this.inputs.map(cost => cost.toString());
            if (this.requiredWorkers !== 0) {
                inputStrings.push(`${this.requiredWorkers} workers`);
            }
            const inputDescription = inputStrings.join(", ");
            return `Produce ${outputDescription} using ${inputDescription}`;
        }
    }

    static readonly schema = S.classOf({
        priority: S.aNumber,
        enabled: S.aBoolean,
        inputs: S.arrayOf(Cost.schema),
        outputs: S.nonEmptyArrayOf(Cost.schema),
        requiredWorkers: S.aNumber,
    }, ({ priority, enabled, inputs, outputs, requiredWorkers }) => {
        const c = new Conversion(inputs, outputs, requiredWorkers, priority);
        c.enabled = enabled;
        return c;
    });
}

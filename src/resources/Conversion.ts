import Cost from "./Cost";

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
        public readonly outputs: Cost[],
    ) {


        if (outputs.length == 0) {
            // TODO do something with types to get compile-time checking of this instead of needing a runtime exception?
            throw "Tried to create a conversion that has no outputs. This should never exist.";
        }

        if (inputs.length == 0) {
            this.priority = 0;
        } else {
            this.priority = Conversion.nextNumber;
            Conversion.nextNumber++;
        }
    }
}
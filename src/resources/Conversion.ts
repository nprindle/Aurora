import Cost from "./Cost";

// a conversion from input resources to output resources that can be performed between turns by a tile if its input respurces are available
export default class Conversion {

    constructor(
        public readonly inputs: Cost[],
        public readonly outputs: Cost[],
    ) {
        if (outputs.length == 0) {
            throw "Tried to create a conversion that has no outputs. This should never exist.";
        }
    }
}
import WorldPredicate from "../predicates/WorldPredicate.js";
import Game from "../Game.js";
import Ending from "./Ending.js";

export class QuestPath {
    constructor(
        readonly requirement: WorldPredicate,
        readonly next: QuestStage | Ending,
    ) { }
}

export class QuestStage {
    constructor(
        readonly description: string,
        readonly paths: QuestPath[],
        readonly hint?: string
    ) { }

    // returns the next quest-stage or ending if an advancement path requirement is met, otherwise returns this stage
    nextState(run: Game): QuestStage | Ending {
        for (const path of this.paths) {
            if (path.requirement.evaluate(run)) {
                return path.next;
            }
        }
        return this;
    }
}

import Game from "../Game.js";
import Ending from "./Ending.js";
import { WorldPredicate } from "../predicates/predicates.js";

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
    nextState(game: Game): QuestStage | Ending {
        for (const path of this.paths) {
            if (path.requirement(game)) {
                return path.next;
            }
        }
        return this;
    }
}

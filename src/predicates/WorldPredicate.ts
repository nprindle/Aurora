import Game from "../Game.js";

// represents a boolean predicate that can be evaluated relative to the state of the whole game, not just one tile
export default abstract class WorldPredicate {
    abstract evaluate(run: Game): boolean;
    abstract toString(): string;
}

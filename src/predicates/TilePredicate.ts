import Game from "../Game";
import GridCoordinates from "../world/GridCoordinates";

// a predicate that is evaluated relative to a specific location, e.g. "adjacent to a highway" or "not within 2 tiles of a habitat"
export default abstract class TilePredicate {
    abstract evaluate(run: Game, position: GridCoordinates): boolean;
    abstract toString(): string;
}
import Game from "../Game";

export default abstract class WorldPredicate {
    abstract evaluate(run: Game): boolean;
    abstract toString(): string;
}

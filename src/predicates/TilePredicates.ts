import TilePredicate from "./TilePredicate.js";
import GridCoordinates from "../world/GridCoordinates.js";
import Game from "../Game.js";
import AbstractTile from "../world/AbstractTile.js";



// file for putting different implementations of TilePredicate

export class TileWithinDistancePredicate extends TilePredicate {
    radius: number;
    targetType: typeof AbstractTile;

    constructor(radius: number, targetType: typeof AbstractTile) {
        super();
        this.radius = radius;
        this.targetType = targetType;
    }

    evaluate(run: Game, position: GridCoordinates): Boolean {
        let tilesInDistance: AbstractTile[] = run.world.getTilesInCircle(position, this.radius);
        
        let matchingTilesInDistance = tilesInDistance.filter((tile: AbstractTile) => {
            return tile instanceof this.targetType;
        });
        console.log(`evaluated distance preidcate from ${position}, found ${matchingTilesInDistance.length} matches out of ${tilesInDistance.length} tiles in radius`);
        return (matchingTilesInDistance.length > 0);
    }

    toString(): string {

        if (this.radius == 1) {
            return `adjacent to a ${this.targetType.tileName}`;
        } else {
            return `within ${this.radius} units of a ${this.targetType.tileName}`;
        }
    }
}
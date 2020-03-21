import TilePredicate from "./TilePredicate.js";
import GridCoordinates from "../world/GridCoordinates.js";
import Game from "../Game.js";
import Tile, { NamedTileType } from "../world/Tile.js";
import Species from "../resources/Species.js";
import Road from "../world/Tiles/Road.js";

// file for implementations of TilePredicate

// predicate which checks whether the tile at the given coordinates is within a certain distance from at least one tile of a certain type
export class TileWithinDistancePredicate extends TilePredicate {
    constructor(
        public radius: number,
        public targetType: NamedTileType,
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        const tilesInDistance: Tile[] = run.world.getTilesInCircle(position, this.radius);

        const matchingTilesInDistance = tilesInDistance.filter(tile => (tile instanceof this.targetType));
        return (matchingTilesInDistance.length > 0);
    }

    toString(): string {
        if (this.radius === 1) {
            return `adjacent to a ${this.targetType.tileName}`;
        } else {
            return `within ${this.radius} units of a ${this.targetType.tileName}`;
        }
    }
}

// we use this specific requirement on a lot of tiles so we define it here for convenience
export const adjacentToRoad: TileWithinDistancePredicate = new TileWithinDistancePredicate(1, Road);

export class ConversionCountPredicate extends TilePredicate {
    constructor(
        private requiredCount: number
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        const tile = run.world.getTileAtCoordinates(position);
        if (tile) {
            return (tile.resourceConversions.length === this.requiredCount);
        } else {
            return false;
        }

    }
    toString(): string {
        return `${this.requiredCount} resource conversions on this tile`;
    }
}


export class SpeciesPopulationPredicate extends TilePredicate {
    constructor(
        private species: Species,
        private minCount: number,
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        return (run.inventory.getPopulation(this.species) >= this.minCount);
    }
    toString(): string {
        return `have at least ${this.minCount} ${this.species.name}`;
    }
}

export class NotTilePredicate extends TilePredicate {
    constructor(
        private inverse: TilePredicate
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        return !this.inverse.evaluate(run, position);
    }
    toString(): string {
        return `not ${this.inverse.toString()}`;
    }
}

export class OrTilePredicate extends TilePredicate {

    constructor(
        private possibilities: [TilePredicate, TilePredicate, ...TilePredicate[]]
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        return this.possibilities.some((predicate: TilePredicate) => predicate.evaluate(run, position));
    }

    toString(): string {
        return this.possibilities.map(predicate => predicate.toString()).join(" or ");
    }

}

/* like the OrTilePredicate, except that only the first option is visible in the toString()
 * this is used to hide possible alternate versions; for example a Nanotech Foundry
 * can be constructed near a Reprogrammed Monolith tile and not just a normal monolith tile
 */
export class HiddenAlternateTilePredicate extends TilePredicate {
    constructor(
        private possibilities: [TilePredicate, TilePredicate, ...TilePredicate[]]
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        return this.possibilities.some((predicate: TilePredicate) => predicate.evaluate(run, position));
    }

    toString(): string {
        return this.possibilities[0].toString();
    }
}

import Game from "../Game";
import GridCoordinates from "../world/GridCoordinates";
import Technology from "../techtree/Technology";
import Species from "../resources/Species";
import Tile from "../world/Tile";
import Road from "../world/Tiles/Road";
import Resource from "../resources/Resource";

// a predicate evaluated relative to a specific position in the world
export type TilePredicate = (game: Game, position: GridCoordinates) => boolean;
// a predicate on the overall game state, not specific to one position
export type WorldPredicate = (game: Game) => boolean;


export function hasTech(technology: Technology): WorldPredicate {
    return (game: Game) => game.hasUnlockedTechnology(technology);
}

export function speciesHasPopulation(species: Species, minPopulation: number): WorldPredicate {
    return (game: Game) => game.inventory.getPopulation(species) >= minPopulation;
}

export function tileWithinDistance(tileType: typeof Tile, radius: number): TilePredicate {
    return (game: Game, position: GridCoordinates) => {
        const tilesInDistance: Tile[] = game.world.getTilesInCircle(position, radius);
        return tilesInDistance.some(tile => (tile instanceof tileType));
    };
}

export const adjacentToRoad: TilePredicate = tileWithinDistance(Road, 1);

export function tileExists(tileType: typeof Tile): WorldPredicate {
    return (game: Game) => game.world.getTiles().some(tile => tile instanceof tileType);
}

export function allTilesAreOfType(tileTypes: (typeof Tile)[]): WorldPredicate {
    return (game: Game) => {
        for (const tile of game.world.getTiles()) {
            if (!tileTypes.some(tileType => tile instanceof tileType)) {
                return false;
            }
        }
        return true;
    };
}

export function hasResource(resource: Resource, minQuantity: number) {
    return (game: Game) => game.inventory.getResourceQuantity(resource) >= minQuantity;
}

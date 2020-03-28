import Game from "../Game";
import GridCoordinates from "../world/GridCoordinates";
import Technology from "../techtree/Technology";
import Species from "../resources/Species";
import Tile from "../world/Tile";
import Road from "../world/Tiles/Road";
import Resource from "../resources/Resource";
import { impossible } from "../util/Util";

// a predicate evaluated relative to a specific position in the world
export type TilePredicate = (game: Game, position: GridCoordinates) => boolean;

// a predicate on the overall game state, not specific to one position
export type WorldPredicate = (game: Game) => boolean;

/**
 * An abstract syntax tree describing possible queries about the game. Any query
 * must be expressed using one of these structures. This can be
 * folded/interpreted into a 'WorldPredicate' using 'queryWorld'.
 */
export type WorldQuery =
    | { queryType: "hasTech"; technology: Technology; }
    | { queryType: "speciesHasPopulation"; species: Species; minPopulation: number; }
    | { queryType: "hasTotalPopulation"; minPopulation: number; }
    | { queryType: "availableHousing"; species: Species; minAvailableCapacity: number; }
    | { queryType: "tileExists"; tileType: typeof Tile; }
    | { queryType: "allTilesAreOfType"; tileTypes: (typeof Tile)[]; }
    | { queryType: "hasResource"; resource: Resource; minQuantity: number; }
    ;

/**
 * An abstract syntax tree describing possible queries about the game,
 * particularly about a tile at a specific location. Any query must be expressed
 * using one of these structures. This can be folded/interpreted into a
 * 'TilePredicate' using 'queryTile'.
 *
 * Note: all 'WorldQuery's are valid 'TileQuery's, witnessed by discarding the
 * tile location being queried.
 */
export type TileQuery =
    // Any WorldQuery is a valid TileQuery, discarding the additional
    // information about the tile.
    | WorldQuery
    | { queryType: "tileWithinDistance"; tileType: typeof Tile; radius: number; }
    | { queryType: "anyTileWithinDistance"; tileTypes: (typeof Tile)[]; radius: number; }
    | { queryType: "not"; query: TileQuery; }
    | { queryType: "or"; query1: TileQuery; query2: TileQuery; }
    | { queryType: "and"; query1: TileQuery; query2: TileQuery; }
    ;

export function hasTech(technology: Technology): WorldQuery {
    return { queryType: "hasTech", technology };
}

export function speciesHasPopulation(species: Species, minPopulation: number): WorldQuery {
    return { queryType: "speciesHasPopulation", species, minPopulation };
}

export function hasTotalPopulation(minPopulation: number): WorldQuery {
    return { queryType: "hasTotalPopulation", minPopulation };
}

export function availableHousing(species: Species, minAvailableCapacity: number): WorldQuery {
    return { queryType: "availableHousing", species, minAvailableCapacity };
}

export function tileWithinDistance(tileType: typeof Tile, radius: number): TileQuery {
    return { queryType: "tileWithinDistance", tileType, radius };
}

export function anyTileWithinDistance(tileTypes: (typeof Tile)[], radius: number): TileQuery {
    return { queryType: "anyTileWithinDistance", tileTypes, radius };
}

export const adjacentToRoad: TileQuery = tileWithinDistance(Road, 1);

export function tileExists(tileType: typeof Tile): WorldQuery {
    return { queryType: "tileExists", tileType };
}

export function allTilesAreOfType(tileTypes: (typeof Tile)[]): WorldQuery {
    return { queryType: "allTilesAreOfType", tileTypes };
}

export function hasResource(resource: Resource, minQuantity: number): WorldQuery {
    return { queryType: "hasResource", resource, minQuantity };
}

export function notQuery(query: TileQuery): TileQuery {
    return { queryType: "not", query };
}

export function andQuery(query1: TileQuery, query2: TileQuery): TileQuery {
    return { queryType: "and", query1, query2 };
}

export function orQuery(query1: TileQuery, query2: TileQuery): TileQuery {
    return { queryType: "or", query1, query2 };
}

/**
 * Interpret a query about the game back into its corresponding predicate.
 */
export function queryWorld(query: WorldQuery): WorldPredicate {
    switch (query.queryType) {
    case "hasTech":
        return (game: Game) => game.hasUnlockedTechnology(query.technology);
    case "speciesHasPopulation":
        return (game: Game) => game.inventory.getPopulation(query.species) >= query.minPopulation;
    case "hasTotalPopulation":
        return (game: Game) => game.inventory.getTotalPopulation() >= query.minPopulation;
    case "availableHousing":
        return (game: Game) => {
            const capacity = game.world.getPopulationCapacity(query.species);
            const population = game.inventory.getPopulation(query.species);
            return capacity - population >= query.minAvailableCapacity;
        };
    case "tileExists":
        return (game: Game) => game.world.getTiles().some(tile => tile instanceof query.tileType);
    case "allTilesAreOfType":
        return (game: Game) => game.world.getTiles().every(tile => {
            return query.tileTypes.some(tileType => tile instanceof tileType);
        });
    case "hasResource":
        return (game: Game) => game.inventory.getResourceQuantity(query.resource) >= query.minQuantity;
    default:
        impossible(query);
    }
}

/**
 * Interpret a query about a tile, or about the world in general, back into its
 * corresponding predicate.
 */
export function queryTile(query: TileQuery): TilePredicate {
    switch (query.queryType) {
    case "tileWithinDistance":
        return (game: Game, position: GridCoordinates) => {
            const tilesInDistance: Tile[] = game.world.getTilesInCircle(position, query.radius);
            return tilesInDistance.some(tile => (tile instanceof query.tileType));
        };
    case "anyTileWithinDistance":
        return (game: Game, position: GridCoordinates) => {
            const tilesInDistance: Tile[] = game.world.getTilesInCircle(position, query.radius);
            return tilesInDistance.some(tile => {
                return query.tileTypes.some(tileType => tile instanceof tileType);
            });
        };
    case "not":
        return (game: Game, position: GridCoordinates) => {
            return !queryTile(query.query)(game, position);
        };
    case "and":
        return (game: Game, position: GridCoordinates) => {
            return queryTile(query.query1)(game, position) && queryTile(query.query2)(game, position);
        };
    case "or":
        return (game: Game, position: GridCoordinates) => {
            return queryTile(query.query1)(game, position) || queryTile(query.query2)(game, position);
        };
    default:
        return queryWorld(query);
    }
}


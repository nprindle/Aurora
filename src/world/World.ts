import Tile, { tileSchema } from "./Tile.js";
import { Arrays } from "../util/Arrays.js";
import Wasteland from "./tiles/Wasteland.js";
import Mountain from "./tiles/Mountain.js";
import { Random } from "../util/Random.js";
import GridCoordinates from "./GridCoordinates.js";
import Species from "../resources/Species.js";
import Ruins from "./tiles/Ruins.js";
import { WorldGenerationParameters } from "./WorldGenerationParameters.js";
import { Schemas as S } from "@nprindle/augustus";

export default class World {

    public width: number;
    public height: number;

    // coordinates of the view area's top-left tile, used by MapUI
    // this is stored as part of the world so that the current position persists between screens
    viewPosition: GridCoordinates = new GridCoordinates(0, 0);

    /* conversions have a 'priority' number that determines the order in which they are applied
     * conversions on newly-created tiles start out with undefined priority, and will be assigned
     * the next sequential number when they are added to the world
     */

    private constructor(
        // world grid is indexed grid[row][column]
        private grid: Tile[][],
        private nextConversionPriority: number = 0
    ) {
        this.height = grid.length;
        this.width = grid[0].length;

        // assign priority numbers to any conversions within the initial grid that have not already been assigned
        for (const tile of Arrays.flatten(grid)) {
            for (const conversion of tile.resourceConversions.filter(conversion => conversion.priority === undefined)) {
                conversion.priority = this.nextConversionPriority;
                this.nextConversionPriority++;
            }
        }
    }

    static generateWorld(): World {
        const width = WorldGenerationParameters.width;
        const height = WorldGenerationParameters.height;

        // generate empty map
        const grid = new Array(height);
        for (let row = 0; row < height; row++) {
            grid[row] = new Array(width);
            for (let column = 0; column < width; column++) {
                grid[row][column] = new Wasteland(new GridCoordinates(column, row));
            }
        }

        const world = new World(grid);

        // place random mountains
        const mountainNumber = Random.intBetween(...WorldGenerationParameters.mountainRange);
        for (let i = 0; i < mountainNumber; i++) {
            const wastelandTiles = world.getTiles().filter((tile: Tile) => (tile instanceof Wasteland));
            if (Arrays.isNonEmpty(wastelandTiles)) {
                const position = Random.fromArray(wastelandTiles).position;
                world.placeTile(new Mountain(position));
            }
        }

        // place random alien ruins
        const ruinsNumber = Random.intBetween(...WorldGenerationParameters.ruinRange);
        for (let i = 0; i < ruinsNumber; i++) {
            const wastelandTiles = world.getTiles().filter((tile: Tile) => (tile instanceof Wasteland));
            if (Arrays.isNonEmpty(wastelandTiles)) {
                const position = Random.fromArray(wastelandTiles).position;
                world.placeTile(new Ruins(position));
            }
        }

        // place the tiles specified in the parameters
        for (const tile of WorldGenerationParameters.nonrandomTiles()) {
            world.placeTile(tile);
        }

        return world;
    }

    // place a tile into the grid in the position given by the tile's coordinates
    placeTile(tile: Tile): void {
        // assign sequential priorities to new resource conversions
        for (const conversion of tile.resourceConversions.filter(conversion => conversion.priority === undefined)) {
            conversion.priority = this.nextConversionPriority;
            this.nextConversionPriority++;
        }

        this.grid[tile.position.y][tile.position.x] = tile;
    }

    getTiles(): Tile[] {
        return Arrays.flatten(this.grid);
    }

    getTilesInRectangle(leftX: number, topY: number, width: number, height: number): Tile[] {
        if (topY < 0) {
            topY = 0;
        }
        if (leftX < 0) {
            leftX = 0;
        }

        const tiles: Tile[] = [];

        const rowsInRange = this.grid.slice(topY, topY + height);
        for (const row of rowsInRange) {
            const tilesInRange = row.slice(leftX, leftX + width);
            for (const tile of tilesInRange) {
                tiles.push(tile);
            }
        }

        return tiles;
    }

    getTileAtCoordinates(coordinates: GridCoordinates): Tile | undefined {
        if (coordinates.x < 0 || coordinates.x >= this.width || coordinates.y < 0 || coordinates.y >= this.height) {
            return undefined;
        }
        return this.grid[coordinates.y][coordinates.x];
    }

    getTilesInCircle(center: GridCoordinates, radius: number): Tile[] {
        return this.getTiles().filter(tile => (center.distanceFrom(tile.position) <= radius));
    }

    getPopulationCapacity(species: Species): number {
        let capacity = 0;

        for (const tile of this.getTiles()) {
            if (tile.populationCapacity && tile.populationCapacity.species === species) {
                capacity = capacity + tile.populationCapacity.capacity;
            }
        }

        return capacity;
    }

    static readonly schema = S.contra(
        S.recordOf({
            grid: S.constrain(
                S.arrayOf(S.arrayOf(tileSchema)),
                (Arrays.isRectangle) // jagged arrays are not valid world grids
            ),
            nextConversionPriority: S.aNumber,
        }),
        (w: World) => ({ grid: w.grid, nextConversionPriority: w.nextConversionPriority }),
        ({ grid, nextConversionPriority }) => {
            const w = new World(grid, nextConversionPriority);
            return w;
        },
    );
}

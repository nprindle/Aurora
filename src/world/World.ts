import AbstractTile from "./AbstractTile.js";
import Arrays from "../util/Arrays.js"
import Wasteland from "./Tiles/Wasteland.js";
import Habitat from "./Tiles/Habitat.js";

export default class World {
    
    width: number;
    height: number;

    // world grid is indexed grid[row][column]
    grid: AbstractTile[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // generate empty map

        this.grid = Arrays.generate(height, () => {
            // populate row
            return Arrays.generate(width, () => {
                return new Wasteland(0, 0)
            });
        });

        // set correct coordinates for tiles
        for (let row: number = 0; row < height; row++) {
            for (let column: number = 0; column < width; column++) {
                this.grid[row][column].xPosition = column;
                this.grid[row][column].yPosition = row;
            }
        }

        // place starting tiles
        this.placeTile(new Habitat(1, 2));
    }

    // place a tile into the grid in the position given by the tile's coordinates
    placeTile(tile: AbstractTile) {
        this.grid[tile.yPosition][tile.xPosition] = tile;
    }

    getTiles(): AbstractTile[] {
        return Arrays.flatten(this.grid);
    }

    getTileAtCoordinates(x: number, y: number) {
        return this.grid[y][x];
    }
}
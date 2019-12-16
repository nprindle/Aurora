import AbstractTile from "./AbstractTile.js";
import Arrays from "../util/Arrays.js"
import Wasteland from "./Tiles/Wasteland.js";
import Habitat from "./Tiles/Habitat.js";
import Mountain from "./Tiles/Mountain.js";
import Random from "../util/Random.js";
import Util from "../util/Util.js";
import GridCoordinates from "./GridCoordinates.js";

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
                this.grid[row][column].position = new GridCoordinates(column, row);
            }
        }

        // randomly place terrain
        let mountainNumber = Random.intBetween(20, 25);
        for(let i = 0; i < mountainNumber; i++) {
            let x = Random.intBetween(0, width);
            let y = Random.intBetween(0, height);
            
            this.placeTile(new Mountain(x, y));
        }

        // place starting tiles
        this.placeTile(new Habitat(1, 2));

    }

    // place a tile into the grid in the position given by the tile's coordinates
    placeTile(tile: AbstractTile) {
        this.grid[tile.position.y][tile.position.x] = tile;
    }

    getTiles(): AbstractTile[] {
        return Arrays.flatten(this.grid);
    }

    getTilesInRectangle(top: number, left: number, width: number, height: number): AbstractTile[] {
        if (top < 0) {
            top = 0;
        }
        if (left < 0) {
            left = 0;
        }

        let bottom = top + height;
        let right = left + width;

        let tiles: AbstractTile[] = [];

        let rowsInRange = this.grid.slice(top, top + height + 1);
        rowsInRange.forEach((row: AbstractTile[]) => {
            let tilesInRange = row.slice(left, left + width + 1);
            tilesInRange.forEach((tile: AbstractTile) => tiles.push(tile));
        });

        return tiles;
    }

    getTileAtCoordinates(x: number, y: number) {
        return this.grid[y][x];
    }
}
import AbstractTile from "./AbstractTile.js";
import Arrays from "../util/Arrays.js"
import Wasteland from "./Tiles/Wasteland.js";
import Habitat from "./Tiles/Habitat.js";
import Mountain from "./Tiles/Mountain.js";
import Random from "../util/Random.js";
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
                return new Wasteland(new GridCoordinates(0, 0));
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
            
            this.placeTile(new Mountain(new GridCoordinates(x, y)));
        }

        // place starting tiles
        this.placeTile(new Habitat(new GridCoordinates(1, 2)));

    }

    // place a tile into the grid in the position given by the tile's coordinates
    placeTile(tile: AbstractTile) {
        this.grid[tile.position.y][tile.position.x] = tile;
    }

    getTiles(): AbstractTile[] {
        return Arrays.flatten(this.grid);
    }

    getTilesInRectangle(leftX: number, topY: number, width: number, height: number): AbstractTile[] {
        if (topY < 0) {
            topY = 0;
        }
        if (leftX < 0) {
            leftX = 0;
        }

        let tiles: AbstractTile[] = [];

        let rowsInRange = this.grid.slice(topY, topY + height);
        rowsInRange.forEach((row: AbstractTile[]) => {
            let tilesInRange = row.slice(leftX, leftX + width);
            tilesInRange.forEach((tile: AbstractTile) => tiles.push(tile));
        });

        return tiles;
    }

    getTileAtCoordinates(coordinates: GridCoordinates) {
        return this.grid[coordinates.y][coordinates.x];
    }
}
import GridCoordinates from "./GridCoordinates.js";
import Wasteland from "./tiles/Wasteland.js";
import Mountain from "./tiles/Mountain.js";
import Lander from "./tiles/Lander.js";
import Monolith from "./tiles/Monolith.js";
import Tile from "./Tile.js";
import World from "./World.js";

export namespace WorldGenerationParameters {

    // tiles which are always placed in the same location
    export function nonrandomTiles(world: World): Tile[] {
        return [
            new Wasteland(world, new GridCoordinates(0, 0)),
            new Wasteland(world, new GridCoordinates(1, 0)),
            new Wasteland(world, new GridCoordinates(2, 0)),

            new Mountain(world, new GridCoordinates(0, 1)),
            new Mountain(world, new GridCoordinates(1, 1)),
            new Mountain(world, new GridCoordinates(2, 1)),

            new Wasteland(world, new GridCoordinates(0, 2)),
            new Wasteland(world, new GridCoordinates(1, 2)),
            new Wasteland(world, new GridCoordinates(2, 2)),

            new Wasteland(world, new GridCoordinates(0, 3)),
            new Lander(world, new GridCoordinates(1, 3)),
            new Wasteland(world, new GridCoordinates(2, 3)),

            new Wasteland(world, new GridCoordinates(0, 4)),
            new Wasteland(world, new GridCoordinates(1, 4)),
            new Wasteland(world, new GridCoordinates(2, 4)),


            new Monolith(world, new GridCoordinates(13, 15)),
        ];
    }

    export const width: number = 20;
    export const height: number = 20;

    export const mountainRange: [number, number] = [20, 25];
    export const ruinRange: [number, number] = [5, 7];
}

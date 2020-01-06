import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";
import Wasteland from "./Wasteland.js";
import Cost from "../../resources/Cost.js";

export default class Mountain extends Tile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Strip Mining", 
            (position: GridCoordinates, run: Game) => {
                run.inventory.addQuantity(Resource.Metal, 150);
                run.world.placeTile(new Wasteland(position));
            },
            [new Cost(Resource.Energy, 25)],
            [],
        ),
    ];

    getImgSrc(): string {
        return "assets/tiles/mountain.png";
    }

    static readonly tileName: string = "Mountain";
    getTileName(): string {
        return Mountain.tileName;
    }
}

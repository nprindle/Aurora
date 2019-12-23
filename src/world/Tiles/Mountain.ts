import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Game from "../../Game.js";
import Resource from "../../resources/Resource.js";
import Wasteland from "./Wasteland.js";

export default class Mountain extends AbstractTile {

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Strip Mining", 
            (position: GridCoordinates, run: Game) => {
                run.inventory.addQuantity(Resource.Metal, 550);
                run.world.placeTile(new Wasteland(position));
            }, [], []
        ),
    ];

    resourceConversions = [];

    getImgSrc(): string {
        return "assets/tiles/mountain.png";
    }

    static readonly tileName: string = "Mountain";
    getTileName(): string {
        return Mountain.tileName;
    }
}
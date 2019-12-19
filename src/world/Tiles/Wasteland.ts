import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Habitat from "./Habitat.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import { Resource } from "../../resources/Resource.js";


export default class Wasteland extends AbstractTile {
    

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", 
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Habitat(position));
            },
            [new Cost(Resource.metal, 100)]
        ),
    ];

    getImgSrc(): string {
        return "assets/tiles/wasteland.png";
    }

    getTileName(): string {
        return "Wasteland";
    }
}
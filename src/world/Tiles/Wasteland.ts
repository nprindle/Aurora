import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import World from "../World.js";
import Habitat from "./Habitat.js";
import Game from "../../Game.js";


export default class Wasteland extends AbstractTile {
    

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", 
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Habitat(position));
            }
        ),
    ];

    getImgSrc(): string {
        return "assets/tiles/wasteland.png";
    }

    getTileName(): string {
        return "Wasteland";
    }
}
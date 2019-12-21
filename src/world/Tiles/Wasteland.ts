import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Habitat from "./Habitat.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import { TileWithinDistancePredicate } from "../../predicates/TilePredicates.js";



export default class Wasteland extends AbstractTile {
    

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", 
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Habitat(position));
            },
            [new Cost(Resource.Metal, 100)],
            [new TileWithinDistancePredicate(1, Habitat)]
        ),
    ];

    getImgSrc(): string {
        return "assets/tiles/wasteland.png";
    }

    static readonly tileName: string = "Wasteland"
    getTileName(): string {
        return Wasteland.tileName;
    }
}
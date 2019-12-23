import AbstractTile from "../AbstractTile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Habitat from "./Habitat.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import { TileWithinDistancePredicate } from "../../predicates/TilePredicates.js";
import Conversion from "../../resources/Conversion.js";
import MiningFacility from "./MiningFacility.js";
import Mountain from "./Mountain.js";



export default class Wasteland extends AbstractTile {
    

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", 
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Habitat(position));
            },
            [new Cost(Resource.BuildingMaterials, 100)],
            [new TileWithinDistancePredicate(1, Habitat)]
        ),

        new TileProject("Construct ore processing center", 
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new MiningFacility(position));
            },
            [new Cost(Resource.Energy, 200), new Cost(Resource.Metal, 300)],
            [new TileWithinDistancePredicate(5, Mountain)]
        ),
    ];

    resourceConversions = [];

    getImgSrc(): string {
        return "assets/tiles/wasteland.png";
    }

    static readonly tileName: string = "Wasteland"
    getTileName(): string {
        return Wasteland.tileName;
    }
}
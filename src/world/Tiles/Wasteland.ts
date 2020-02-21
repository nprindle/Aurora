import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Habitat from "./Habitat.js";
import Game from "../../Game.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import { TileWithinDistancePredicate } from "../../predicates/TilePredicates.js";
import MiningFacility from "./MiningFacility.js";
import Mountain from "./Mountain.js";
import SolarPanels from "./SolarArray.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { StructureConstructionTech } from "../../techtree/TechTree.js";
import Greenhouse from "./Greenhouse.js";
import { Random } from "../../util/Random.js";
import { WastelandTexture1, WastelandTexture2, WastelandTexture3, WastelandTexture4, WastelandTexture5 } from "../../UI/Images.js";
import { Arrays } from "../../util/Arrays.js";



export default class Wasteland extends Tile {

    texture: HTMLImageElement = Random.fromArray([
        WastelandTexture1,
        WastelandTexture2,
        WastelandTexture3,
        WastelandTexture4,
        ...Arrays.repeat(WastelandTexture5, 4)
    ]);

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", "The humans need somewhere to breath, breed, and do whatever they do, and of couse, it is up to us to build it for them.",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Habitat(position));
            },
            [new Cost(Resource.BuildingMaterials, 100)],
            [
                new TileWithinDistancePredicate(1, Habitat),
                new TechPredicate(StructureConstructionTech),
            ],
            [],
        ),

        new TileProject("Construct ore processing center", "Even after we get the material out of the planet, we still need to refine it before we use it. Why cannot anything we do be easy?",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new MiningFacility(position));
            },
            [new Cost(Resource.Energy, 200), new Cost(Resource.Metal, 300)],
            [new TileWithinDistancePredicate(5, Mountain)],
            [],
        ),

        new TileProject("Construct photovoltaic array", "Time to put the sun to good use - using it to power me (and help the humans survive I guess).",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new SolarPanels(position));
            },
            [new Cost(Resource.Electronics, 200)],
            [],
            [],
        ),

        new TileProject("Construct Greenhouse", "Humans are so on the nose. 'Oh, we need a place to produce oxygen and food. What should we call it? It is a house full of stuff that is green, so we should call it a greenhouse.' Typical.",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Greenhouse(position));
            },
            [new Cost(Resource.BuildingMaterials, 25)],
            [],
            [],
        ),
    ];

    static readonly tileName: string = "Wasteland";
    static readonly tileDescription: string = "Nothing of note here.";
    getTileName(): string {
        return Wasteland.tileName;
    }
    getTileDescription(): string {
        return Wasteland.tileDescription;
    }
}

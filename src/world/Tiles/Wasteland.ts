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
import Arcology from "./Arcology.js";
import EngineeringLab from "./EngineeringLab.js";
import NuclearPlant from "./NuclearPlant.js";
import PsychLab from "./PsychLab.js";
import AlignmentLab from "./AlignmentLab.js";
import XenoLab from "./XenoLab.js";
import Road from "./Road.js";



export default class Wasteland extends Tile {

    texture: HTMLImageElement = Random.fromWeightedArray([
        [1 / 8, WastelandTexture1],
        [1 / 8, WastelandTexture2],
        [1 / 8, WastelandTexture3],
        [1 / 8, WastelandTexture4],
        [4 / 8, WastelandTexture5],
    ]);

    constructor(position: GridCoordinates) {
        super(position);
    }

    possibleProjects: TileProject[] = [
        new TileProject("Construct habitat dome", "Assemble a pressurized structure that provides housing, services, and life support for colonists",
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

        new TileProject("Construct ore processing center", `Assemble a factory that converts ore into useful materials`,
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new MiningFacility(position));
            },
            [new Cost(Resource.Energy, 200), new Cost(Resource.Metal, 300)],
            [new TileWithinDistancePredicate(5, Mountain)],
            [],
        ),

        new TileProject("Construct photovoltaic array", "Assemble an array of solar panels to produce energy",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new SolarPanels(position));
            },
            [new Cost(Resource.Electronics, 200)],
            [],
            [],
        ),

        new TileProject("Construct Greenhouse", "Assemble a building where colonists can grow food and produce oxygen using genetically engineered plants",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Greenhouse(position));
            },
            [new Cost(Resource.BuildingMaterials, 25)],
            [],
            [],
        ),

        new TileProject("Construct Arcology", "Construct a tower that can efficiently house a large number of humans",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Arcology(position));
            },
            [new Cost(Resource.BuildingMaterials, 250)],
            [],
            [],
        ),

        new TileProject("Construct Engineering Lab",
            "Assemble an engineering laboratory that can produce data points necessary for scientific and technological advancement",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new EngineeringLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 20)],
            [],
            [],
        ),

        new TileProject("Construct Psych Lab",
            "Assemble a laboratory that can produce data points about human psychology and behavior",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new PsychLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 30)],
            [],
            [],
        ),

        new TileProject("Construct AI Alignment Lab",
            "Construct a research center for developing techniques that could allow humans to control an artificial intelligence or modify its goal programming",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new AlignmentLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 20), new Cost(Resource.Electronics, 40)],
            [],
            [],
        ),

        new TileProject("Construct Xenoarchaeology Lab",
            "Construct a laboratory for studying the alien ruins",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new XenoLab(position));
            },
            [new Cost(Resource.BuildingMaterials, 40)],
            [],
            [],
        ),

        new TileProject("Construct Nuclear Plant", "Construct a nuclear power plant",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new NuclearPlant(position));
            },
            [new Cost(Resource.BuildingMaterials, 100), new Cost(Resource.Electronics, 100)],
            [],
            [],
        ),

        new TileProject("Construct Road", "Construct roads to extend the reach of the colony's logistics",
            (position: GridCoordinates, run: Game) => {
                run.world.placeTile(new Road(position));
            },
            [new Cost(Resource.BuildingMaterials, 10)],
            [],
            [],
        ),
    ];

    static readonly tileName: string = "Wasteland";
    static readonly tileDescription: string = "Nothing of note here";
    getTileName(): string {
        return Wasteland.tileName;
    }
    getTileDescription(): string {
        return Wasteland.tileDescription;
    }
}

import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Species from "../../resources/Species.js";
import Game from "../../Game.js";
import Wasteland from "./Wasteland.js";
import Habitat from "./Habitat.js";
import MiningFacility from "./MiningFacility.js";
import SolarPanels from "./SolarArray.js";
import { LanderTexture } from "../../UI/Images.js";
import Resource from "../../resources/Resource.js";
import Greenhouse from "./Greenhouse.js";

export default class Lander extends Tile {
    texture: HTMLImageElement = LanderTexture;

    possibleProjects: TileProject[] = [
        new TileProject(
            "Unpack Lander", "Unload colonists and deploy prefabricated colonial buildings",
            (position: GridCoordinates, run: Game) => {
                const world = run.world;

                // place colony buildings
                world.placeTile(new Habitat(new GridCoordinates(position.x + 1, position.y)));
                world.placeTile(new MiningFacility(new GridCoordinates(position.x, position.y - 1)));
                world.placeTile(new SolarPanels(new GridCoordinates(position.x + 1, position.y - 1)));
                world.placeTile(new Greenhouse(new GridCoordinates(position.x - 1, position.y)));

                // remove pod
                world.placeTile(new Wasteland(position));

                // provide initial supplies
                run.inventory.addResource(Resource.Food, 1000);

                // create initial population
                run.inventory.addWorkers(Species.Human, 100);
                // make workers available on first turn
                run.inventory.releaseWorkers();
            },
            [],
            [],
            [],
        ),
    ];

    constructor(position: GridCoordinates) {
        super(position);
    }

    static readonly tileName: string = "Landing Pod";
    static readonly tileDescription: string = "A spacecraft responsible for the final entry-descent-landing phase of the interstellar journey; not equipped to ascend back to space";
    getTileName(): string {
        return Lander.tileName;
    }
    getTileDescription(): string {
        return Lander.tileDescription;
    }
}

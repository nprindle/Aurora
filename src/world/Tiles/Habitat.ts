import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import Resource from "../../resources/Resource.js";
import Species from "../../resources/Species.js";
import Housing from "../../resources/Housing.js";
import UI from "../../UI/UI.js";
import {HabitatTexture} from "../../UI/Images.js";

export default class Habitat extends Tile {

    texture: HTMLImageElement = HabitatTexture;

    populationCapacity: Housing = new Housing(Species.Human, 200);

    constructor(position: GridCoordinates) {
        super(position);
    }

    static readonly tileName: string = "Habitat Dome";
    getTileName(): string {
        return Habitat.tileName;
    }
}

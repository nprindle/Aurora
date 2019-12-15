import World from "../world/World";
import UI from "./UI.js";
import Wasteland from "../world/Tiles/Wasteland.js";
import WorldScreen from "./WorldScreen";
import AbstractTile from "../world/AbstractTile";

// class to manage the UI canvas that shows the map
export default class MapUI {
    world: World;
    canvas: HTMLCanvasElement;
    tileScale: number = 100; // pixels per tile (before being stretched)
    highlightedCoordinates: [number, number] | null = null; // [x, y] grid coordinates of the selected tile, or null if no tile is selected

    constructor(world: World) {
        this.world = world;
        this.canvas = UI.makeCanvas(this.world.width * this.tileScale, this.world.height * this.tileScale, ['map-canvas']);

        this.rerenderFullMap();

        this.canvas.addEventListener('click', ev => {
    
            let x = Math.floor((ev.pageX - this.canvas.offsetLeft) * (this.world.width / this.canvas.clientWidth));
            let y = Math.floor((ev.pageY - this.canvas.offsetTop) * (this.world.height / this.canvas.clientHeight));
        
            let targetTile = this.world.getTileAtCoordinates(x, y);
            
            this.selectTile(targetTile);

            //TODO update world screen sidebar
        });
    }

    rerenderFullMap(): HTMLElement {
        this.world.getTiles().forEach(tile => {
            this.rerenderTile(tile);
        });
        return this.canvas;
    }

    drawImageAtCoordinates(src: string, gridX: number, gridY: number) {
        let context = this.canvas.getContext('2d')!;
        let image = new Image();
        image.onload = () => {
            context.drawImage(image, gridX * this.tileScale, gridY * this.tileScale, this.tileScale, this.tileScale);
        }

        image.src = src;
        console.log(`Draw ${src} at ${gridX}, ${gridY}`);
    }

    // redraws the given tile at its selected location, and returns the edited canvas
    rerenderTile(tile: AbstractTile): HTMLElement {
        this.drawImageAtCoordinates(tile.getImgSrc(), tile.xPosition, tile.yPosition);

        if ([tile.xPosition, tile.yPosition] === this.highlightedCoordinates) {
            console.log("Redrawing selected");
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition);
        }

        return this.canvas;
    }

    selectTile(tile: AbstractTile | null) {

        // deselect previous highlight
        if (this.highlightedCoordinates) {
            let [prevX, prevY] = this.highlightedCoordinates;
            console.log(`unselect ${prevX}, ${prevY}`);
            let prevSelection = this.world.getTileAtCoordinates(prevX, prevY);
            this.highlightedCoordinates = null;
            this.rerenderTile(prevSelection);
        }

        // highlight new tile
        if (tile) {
            console.log(`select ${tile?.xPosition}, ${tile?.yPosition}`);
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition);
            this.highlightedCoordinates = [tile.xPosition, tile.yPosition];
        } else {
            this.highlightedCoordinates = null;
        }
    }
}   
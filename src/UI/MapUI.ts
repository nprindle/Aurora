import World from "../world/World";
import UI from "./UI.js";
import Wasteland from "../world/Tiles/Wasteland.js";
import WorldScreen from "./WorldScreen";
import AbstractTile from "../world/AbstractTile";

// class to manage the UI canvas that shows the map
export default class MapUI {
    world: World;
    worldCanvas: HTMLCanvasElement; // canvas containing the whole world
    viewCanvas: HTMLCanvasElement; // the canvas we actually show, containing a subset of the world

    viewWidth: number = 8;
    viewHeight: number = 5

    tileScale: number = 128; // pixels per tile (before being stretched)
    highlightedCoordinates: [number, number] | null = null; // [x, y] grid coordinates of the selected tile, or null if no tile is selected

    constructor(world: World) {
        this.world = world;

        this.worldCanvas = UI.makeCanvas(this.world.width * this.tileScale, this.world.height * this.tileScale);
        this.viewCanvas = UI.makeCanvas(this.viewWidth * this.tileScale, this.viewHeight * this.tileScale, ['map-canvas']);

        this.viewCanvas.addEventListener('click', ev => {
    
            // TODO adjust when view coords are nonzero
            let x = Math.floor((ev.pageX - this.viewCanvas.offsetLeft) * (this.world.width / this.viewCanvas.clientWidth));
            let y = Math.floor((ev.pageY - this.viewCanvas.offsetTop) * (this.world.height / this.viewCanvas.clientHeight));
        
            let targetTile = this.world.getTileAtCoordinates(x, y);
            
            this.selectTile(targetTile);

            //TODO update world screen sidebar
        });

        this.rerenderFullMap();
    }

    getViewCanvas() {
        return this.viewCanvas;
    }

    updateViewCanvas() {
        let context = this.viewCanvas.getContext('2d')!;
        context.drawImage(this.worldCanvas, 0, 0, this.viewCanvas.width, this.viewCanvas.height);
    }

    rerenderFullMap() {
        this.world.getTiles().forEach(tile => {
            this.rerenderTile(tile);
        });
    }

    drawImageAtCoordinates(src: string, gridX: number, gridY: number) {
        let context = this.worldCanvas.getContext('2d')!;
        let image = new Image();
        image.onload = () => {
            context.drawImage(image, gridX * this.tileScale, gridY * this.tileScale, this.tileScale, this.tileScale);
            this.updateViewCanvas();
        }

        image.src = src;
        console.log(`Draw ${src} at ${gridX}, ${gridY}`);
        
    }

    // redraws the given tile at its selected location
    rerenderTile(tile: AbstractTile) {
        // draw tile
        this.drawImageAtCoordinates(tile.getImgSrc(), tile.xPosition, tile.yPosition);

        // draw highlight icon
        if ([tile.xPosition, tile.yPosition] === this.highlightedCoordinates) {
            console.log("Redrawing selected");
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition);
        }
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
            console.log(`select ${tile.xPosition}, ${tile.yPosition}`);
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition);
            this.highlightedCoordinates = [tile.xPosition, tile.yPosition];
        } else {
            this.highlightedCoordinates = null;
        }
    }
}   
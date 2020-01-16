import World from "../../world/World.js";
import UI from "../UI.js";
import Tile from "../../world/Tile.js";
import {clamp} from "../../util/Util.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import WorldScreen from "./WorldScreen.js";

// class to manage the UI canvas that shows the map
export default class MapUI {

    private static pixelsPerTile: number = 64;

    private world: World;

    private worldCanvas: HTMLCanvasElement; // canvas containing the whole world (not shown directly to the user)
    private viewCanvas: HTMLCanvasElement; // the canvas we actually show, containing the currently viewed subsection of the world

    private parentScreen: WorldScreen; // the WorldScreen instance that contains this MapUI

    private viewWidth: number = 12; // width of viewable area in tiles
    private viewHeight: number = 8; // height of viewable area in tiles
    

    private viewPosition: GridCoordinates = new GridCoordinates(0, 0); //coordinates of the current view area's top-left tile
    private highlightedCoordinates: GridCoordinates | null = null; // coordinates of current selected tile, null if no tile is selected

    constructor(parent: WorldScreen, world: World) {
        this.world = world;
        this.parentScreen = parent;

        this.worldCanvas = UI.makeCanvas(this.world.width * MapUI.pixelsPerTile, this.world.height * MapUI.pixelsPerTile);
        const worldContext = this.worldCanvas.getContext('2d')!;

        // we fill the canvas with placeholder color so that it will be obvious when an area fails to render
        worldContext.beginPath();
        worldContext.rect(0, 0, this.worldCanvas.width, this.worldCanvas.height);
        worldContext.fillStyle = "black";
        worldContext.fill();

        this.viewCanvas = UI.makeCanvas(this.viewWidth * MapUI.pixelsPerTile, this.viewHeight * MapUI.pixelsPerTile, ['map-canvas']);

        // attach click listener for tile selection
        this.viewCanvas.addEventListener('click', ev => this.handleClick(ev));

        // render the starting area
        this.refreshViewableArea();
    }

    getViewCanvas(): HTMLCanvasElement {
        return this.viewCanvas;
    }

    // copies the view area from the world canvas to the view canvas
    private updateViewCanvas() {
        const context = this.viewCanvas.getContext('2d')!;
        const pixelWidth = this.viewWidth * MapUI.pixelsPerTile;
        const pixelHeight = this.viewHeight * MapUI.pixelsPerTile;
        const pixelPositionX = this.viewPosition.x * MapUI.pixelsPerTile;
        const pixelPositionY = this.viewPosition.y * MapUI.pixelsPerTile;
        context.drawImage(this.worldCanvas, pixelPositionX, pixelPositionY, pixelWidth, pixelHeight, 0, 0, pixelWidth, pixelHeight);
    }

    public refreshViewableArea() {
        const tilesInViewableArea = this.world.getTilesInRectangle(this.viewPosition.x, this.viewPosition.y, this.viewWidth, this.viewHeight);
        for (const tile of tilesInViewableArea)  {
            this.rerenderTile(tile);
        }
    }

    private drawImageAtCoordinates(src: string, coordinates: GridCoordinates) {
        const context = this.worldCanvas.getContext('2d')!;
        context.imageSmoothingEnabled = false; // disable antialiasing to allow crispy pixel art
        const image = new Image();
        image.onload = () => {
            context.drawImage(image, coordinates.x * MapUI.pixelsPerTile, coordinates.y * MapUI.pixelsPerTile, MapUI.pixelsPerTile, MapUI.pixelsPerTile);
            this.updateViewCanvas();
        }
        image.src = src;
    }

    // redraws the given tile at its selected location
    private rerenderTile(tile: Tile) {
        this.drawImageAtCoordinates(tile.getImgSrc(), tile.position);

        if (tile.position === this.highlightedCoordinates) {
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.position);
        }
    }

    private selectTile(tile: Tile | null) {
        // deselect previous highlight
        if (this.highlightedCoordinates) {
            const prevSelection = this.world.getTileAtCoordinates(this.highlightedCoordinates);
            this.highlightedCoordinates = null;
            this.rerenderTile(prevSelection);
        }

        // highlight new tile
        if (tile) {
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.position);
            this.highlightedCoordinates = tile.position;
        } else {
            this.highlightedCoordinates = null;
        }

        this.parentScreen.changeSidebarTile(this.highlightedCoordinates);
    }

    private moveViewArea(right: number, down: number) {
        const oldX = this.viewPosition.x;
        const oldY = this.viewPosition.y;

        const newX = clamp(0, this.viewPosition.x + right, this.world.width - this.viewWidth);
        const newY = clamp(0, this.viewPosition.y + down, this.world.height - this.viewHeight);
        this.viewPosition = new GridCoordinates(newX, newY);

        right = this.viewPosition.x - oldX;
        down = this.viewPosition.y - oldY;

        // rerender newly visible tiles
        if (right > 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x + this.viewWidth - right), (this.viewPosition.y),  right, this.viewHeight);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
        if (right < 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y),  right * -1, this.viewHeight);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
        if (down > 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y + this.viewHeight - down),  this.viewWidth, down);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        } if (down < 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y),  this.viewWidth, down * -1);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
    }

    handleClick(ev: MouseEvent) {
        const x = Math.floor((ev.pageX - this.viewCanvas.offsetLeft) * (this.viewWidth / this.viewCanvas.clientWidth)) + this.viewPosition.x;
        const y = Math.floor((ev.pageY - this.viewCanvas.offsetTop) * (this.viewHeight / this.viewCanvas.clientHeight)) + this.viewPosition.y;
        
        const targetTile = this.world.getTileAtCoordinates(new GridCoordinates(x, y));
        this.selectTile(targetTile);
    }

    handleKeyDown(ev: KeyboardEvent) {
        const code = ev.code;
        if(code === "ArrowUp" || code === "KeyW") {
            this.moveViewArea(0, -1);
        }
        if(code === "ArrowLeft" || code === "KeyA") {
            this.moveViewArea(-1, 0);
        }
        if(code === "ArrowDown" || code === "KeyS") {
            this.moveViewArea(0, 1);
        }
        if(code === "ArrowRight" || code === "KeyD") {
            this.moveViewArea(1, 0);
        }
    }
}

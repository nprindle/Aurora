import World from "../world/World.js";
import UI from "./UI.js";
import AbstractTile from "../world/AbstractTile.js";
import Util from "../util/Util.js";
import GridCoordinates from "../world/GridCoordinates.js";
import WorldScreen from "./WorldScreen.js";

// class to manage the UI canvas that shows the map
export default class MapUI {
    private world: World;
    private worldCanvas: HTMLCanvasElement; // canvas containing the whole world (not shown directly to the user)
    viewCanvas: HTMLCanvasElement; // the canvas we actually show, containing the currently viewed area

    private parentScreen: WorldScreen;

    private viewWidth: number = 10;
    private viewHeight: number = 6;

    private viewPositionX: number = 0; // x-coord of the top-left corner of the currently viewed area
    private viewPositionY: number = 0; // y-coord of the top-left corner of the currently viewed area

    private tileScale: number = 64; // pixels per tile (before being stretched)

    private highlightedCoordinates: GridCoordinates | null = null;

    constructor(parent: WorldScreen, world: World) {
        this.world = world;
        this.parentScreen = parent;

        // TODO change viewable area dimensions to scale with screen size?

        this.worldCanvas = UI.makeCanvas(this.world.width * this.tileScale, this.world.height * this.tileScale);
        let worldContext = this.worldCanvas.getContext('2d')!;

        // this is for debug reasons, to let us see when an area has failed to render
        worldContext.beginPath();
        worldContext.rect(0, 0, this.worldCanvas.width, this.worldCanvas.height);
        worldContext.fillStyle = "black";
        worldContext.fill();

        this.viewCanvas = UI.makeCanvas(this.viewWidth * this.tileScale, this.viewHeight * this.tileScale, ['map-canvas']);

        // attach click listener to for tile selection
        this.viewCanvas.addEventListener('click', ev => {

            let x = Math.floor((ev.pageX - this.viewCanvas.offsetLeft) * (this.viewWidth / this.viewCanvas.clientWidth)) + this.viewPositionX;
            let y = Math.floor((ev.pageY - this.viewCanvas.offsetTop) * (this.viewHeight / this.viewCanvas.clientHeight)) + this.viewPositionY;
        
            let targetTile = this.world.getTileAtCoordinates(new GridCoordinates(x, y));
            
            this.selectTile(targetTile);
        });

        // render the starting area
        this.refreshViewableArea();

    }

    getViewCanvas(): HTMLCanvasElement {
        return this.viewCanvas;
    }

    private updateViewCanvas() {
        let context = this.viewCanvas.getContext('2d')!;
        let pixelWidth = this.viewWidth * this.tileScale;
        let pixelHeight = this.viewHeight * this.tileScale;
        context.drawImage(this.worldCanvas, this.viewPositionX * this.tileScale, this.viewPositionY * this.tileScale, pixelWidth, pixelHeight, 0, 0, pixelWidth, pixelHeight);
    }

    public refreshViewableArea() {
        this.world.getTilesInRectangle(this.viewPositionX, this.viewPositionY, this.viewWidth, this.viewHeight).forEach((tile: AbstractTile) => {
            this.rerenderTile(tile, true);
        });
        this.updateViewCanvas();
    }


    private drawImageAtCoordinates(src: string, coordinates: GridCoordinates, skipViewUpdate?: boolean) {
        let context = this.worldCanvas.getContext('2d')!;
        context.imageSmoothingEnabled = false; // disable antialiasing to allow crispy pixel art
        let image = new Image();
        image.onload = () => {
            context.drawImage(image,coordinates.x * this.tileScale, coordinates.y * this.tileScale, this.tileScale, this.tileScale);
            if(!skipViewUpdate) {
                this.updateViewCanvas();
            }
        }

        image.src = src;
        
    }

    // redraws the given tile at its selected location
    private rerenderTile(tile: AbstractTile, skipViewUpdate?: boolean) {
        // draw tile
        this.drawImageAtCoordinates(tile.getImgSrc(), tile.position);

        // draw highlight icon
        if (tile.position === this.highlightedCoordinates) {
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.position, skipViewUpdate);
        }
    }

    private selectTile(tile: AbstractTile | null) {

        // deselect previous highlight
        if (this.highlightedCoordinates) {
            let prevSelection = this.world.getTileAtCoordinates(this.highlightedCoordinates);
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

    getHighlightedCoordinates(): GridCoordinates | null {
        return this.highlightedCoordinates;
    }

    handleKeyDown(ev: KeyboardEvent) {
        let code = ev.code;
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

    private moveViewArea(right: number, down: number) {
        let oldPositionX = this.viewPositionX;
        let oldPositionY = this.viewPositionY;

        this.viewPositionX = Util.clamp(0, this.viewPositionX + right, this.world.width - this.viewWidth);
        this.viewPositionY = Util.clamp(0, this.viewPositionY + down, this.world.height - this.viewHeight);

        right = this.viewPositionX - oldPositionX;
        down = this.viewPositionY - oldPositionY;

        // make sure that the are we're moving into has been rendered
        if (right > 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX + this.viewWidth - right),  right, this.viewHeight)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }
        if (right < 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX),  right * -1, this.viewHeight)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }
        if (down > 0) {
            this.world.getTilesInRectangle((this.viewPositionY + this.viewHeight - down), (this.viewPositionX),  this.viewWidth, down)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        } if (down < 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX),  this.viewWidth, down * -1)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }

        this.updateViewCanvas();
    }
}   
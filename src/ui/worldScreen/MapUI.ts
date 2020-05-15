import World from "../../world/World.js";
import { UI } from "../UI.js";
import Tile from "../../world/Tile.js";
import { clamp } from "../../util/Util.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import { HighlightSelectionImage } from "../Images.js";
import { Settings } from "../../persistence/Settings.js";
import { Page } from "../Page.js";

// class to manage the UI canvas that shows the map
export default class MapUI implements Page {

    private static readonly pixelsPerTile: number = 100;

    readonly html: HTMLCanvasElement; // the html for this component is an html canvas that we draw tiles onto

    private viewWidth: number = Settings.currentOptions.viewWidth; // width of viewable area in tiles
    private viewHeight: number = Settings.currentOptions.viewHeight; // height of viewable area in tiles

    // coordinates of current selected tile, undefined if no tile is selected
    private highlightedCoordinates: GridCoordinates | undefined = undefined;

    constructor(
        private parentScreen: { changeSidebarTile(position: GridCoordinates | undefined): void; },
        private world: World
    ) {
        this.html = UI.makeCanvas(
            this.viewWidth * MapUI.pixelsPerTile,
            this.viewHeight * MapUI.pixelsPerTile,
            ["map-canvas"]
        );

        // attach click listener for tile selection
        this.html.addEventListener("click", ev => this.handleClick(ev));

        // render the starting area
        this.refresh();
    }

    // re-draws all tiles in the viewable area
    public refresh(): void {
        const viewPosition = this.world.viewPosition;
        const tilesInViewableArea = this.world.getTilesInRectangle(
            viewPosition.x, viewPosition.y,
            this.viewWidth, this.viewHeight
        );

        for (const tile of tilesInViewableArea) {
            this.drawSquareAtCoordinates(tile.getTexture(this.world), tile.position);
        }
        // render the selected-tile highlight border
        if (this.highlightedCoordinates !== undefined) {
            this.drawSquareAtCoordinates(HighlightSelectionImage, this.highlightedCoordinates);
        }
    }

    private drawSquareAtCoordinates(image: HTMLImageElement, coordinates: GridCoordinates): void {
        const context = this.html.getContext("2d")!;
        context.imageSmoothingEnabled = false; // disable antialiasing to allow crispy pixel art

        const x = coordinates.x - this.world.viewPosition.x;
        const y = coordinates.y - this.world.viewPosition.y;

        if ((x < 0) || (y < 0) || (x >= this.viewWidth) || (y >= this.viewHeight)) {
            return; // don't attempt to draw tiles outside the viewable area
        }

        const ratio = MapUI.pixelsPerTile / image.width;

        const screenWidth = MapUI.pixelsPerTile;
        const screenHeight = image.height * ratio; // necessary scaling for non 100xN images

        const screenX = x * MapUI.pixelsPerTile;
        // make sure tall images line up properly
        const screenY = y * MapUI.pixelsPerTile - screenHeight + MapUI.pixelsPerTile;

        context.drawImage(image, screenX, screenY, screenWidth, screenHeight);
    }

    private selectTile(tile: Tile | undefined): void {
        this.highlightedCoordinates = tile?.position;
        this.refresh();
        this.parentScreen.changeSidebarTile(this.highlightedCoordinates);
    }

    private moveViewArea(right: number, down: number): void {
        const newX = clamp(0, this.world.viewPosition.x + right, this.world.width - this.viewWidth);
        const newY = clamp(0, this.world.viewPosition.y + down, this.world.height - this.viewHeight);
        this.world.viewPosition = new GridCoordinates(newX, newY);

        this.refresh();
    }

    handleClick(ev: MouseEvent): void {
        const x = this.world.viewPosition.x
            + Math.floor((ev.pageX - this.html.offsetLeft) * (this.viewWidth / this.html.clientWidth));
        const y = this.world.viewPosition.y
            + Math.floor((ev.pageY - this.html.offsetTop) * (this.viewHeight / this.html.clientHeight));

        const targetTile = this.world.getTileAtCoordinates(new GridCoordinates(x, y));
        this.selectTile(targetTile);
    }

    handleKeyDown(ev: KeyboardEvent): void {
        const code = ev.code;
        if (code === "ArrowUp" || code === "KeyW") {
            ev.preventDefault();
            this.moveViewArea(0, -1);
        }
        if (code === "ArrowLeft" || code === "KeyA") {
            ev.preventDefault();
            this.moveViewArea(-1, 0);
        }
        if (code === "ArrowDown" || code === "KeyS") {
            ev.preventDefault();
            this.moveViewArea(0, 1);
        }
        if (code === "ArrowRight" || code === "KeyD") {
            ev.preventDefault();
            this.moveViewArea(1, 0);
        }
    }
}

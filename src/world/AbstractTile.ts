/**
 * A tile is an object in the world that occupies a map square
 * They can be natural formations (wasteland, mountains, etc),
 * or artificial constructions (habitat, factory, highway, etc)
 */

 export default abstract class AbstractTile {
    xPosition: number;
    yPosition: number;

    constructor(x: number, y: number) {
        this.xPosition = x;
        this.yPosition = y;
    }

    abstract getImgSrc(): string; // the path to the map texture for this tile type
 }
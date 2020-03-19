import { Note } from "./Notes.js";

export default abstract class Instrument {

    constructor(public volume: number) {}

    abstract async scheduleNote(context: AudioContext, note: Note): Promise<AudioNode>;

}

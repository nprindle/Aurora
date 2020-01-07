import Species from "./Species";

// a single tile's population capacity for a specific species of worker
export default class Housing {
    constructor(
        public readonly species: Species,
        public readonly capacity: number,
    ) {}
}

// enforces compile-tile check that an array have at least one element
export type NonEmptyArray<T> = [T, ...T[]];

export class Arrays {
    // creates a list of the desired length, filling it with values produced by the given function
    public static generate<T>(length: number, func: () => T): T[] {
        const result: T[] = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = func();
        }
        return result;
    }

    // create a 1-dimensional array containing all of the elements from a 2-dimensional array
    public static flatten<T>(arr: T[][]): T[] {
        return arr.reduce((acc = [], x) => acc.concat(x));
    }
}
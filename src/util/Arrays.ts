export default class Arrays {

    // creates a list of the desired length, filling it with values produced by the given function
    public static generate<T>(length: number, func: () => T): T[] {
        const result: T[] = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = func();
        }
        return result;
    }

    public static flatten<T>(arr: T[][]): T[] {
        return arr.reduce((acc = [], x) => acc.concat(x));
    }
}
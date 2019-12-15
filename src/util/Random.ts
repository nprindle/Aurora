/* random number generation helper methods
 * adapted from Prototype Inheritance by May Lawver
 */
export default class Random {

    // random real number (almost always non-integer) within the given range
    public static realBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    // random integer within the given range
    public static intBetween(min: number, max: number): number {
        return Math.floor(Random.realBetween(min, max));
    }

    public static fromArray<T>(arr: T[]): T {
        return arr[Random.intBetween(0, arr.length)];
    }
}
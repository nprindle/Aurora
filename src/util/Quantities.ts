import { Schema, Schemas as S } from "@nprindle/augustus";

/* Counts quantities of instances of some type.
 * e.g. the amounts of each resource in the inventory
 *
 * Quantities that reach 0 are removed, so having 0 of something and not having the thing at all are the same thing.
 *
 * This is intended for use cases where negative values don't make sense (e.g. can't have negative population),
 * so a warning will be printed if any entry is set to a negative value.
 */
export default class Quantities<T> {
    private map: Map<T, number> = new Map<T, number>();

    constructor() {}

    add(key: T, quantity: number): void {
        this.set(key, this.get(key) + quantity);
    }

    subtract(key: T, quantity: number): void {
        this.set(key, this.get(key) - quantity);
    }

    get(key: T): number {
        return this.map.get(key) ?? 0;
    }

    set(key: T, quantity: number): void {
        if (quantity < 0) {
            console.warn(`set quantity of ${key} to negative value ${quantity}`);
        }
        if (quantity === 0) {
            this.map.delete(key);
        } else {
            this.map.set(key, quantity);
        }
    }

    getSum(): number {
        return (Array.from(this.map.values())).reduce((sum: number, current: number) => (sum + current), 0);
    }

    // all of the keys in the backing map should be associated with positive values
    positiveQuantityKeys(): T[] {
        return Array.from(this.map.keys());
    }

    clone(): Quantities<T> {
        const copy = new Quantities<T>();
        for (const key of this.positiveQuantityKeys()) {
            copy.add(key, this.get(key));
        }
        return copy;
    }

    // A 'Quantities' is serialized as a single-key record containing its
    // internal 'Map', serialized as an array of key-value tuples.
    static schema<K, R>(keys: Schema<K, R>): Schema<Quantities<K>, { map: [R, number][]; }> {
        return S.contra(
            S.recordOf({ map: S.map(keys, S.aNumber) }),
            (q: Quantities<K>) => ({ map: q.map }),
            rec => {
                const q = new Quantities<K>();
                q.map = rec.map;
                return q;
            },
        );
    }
}

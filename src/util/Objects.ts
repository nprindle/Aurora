export namespace Objects {
    export function safeKeys<T>(x: T): (keyof T)[] {
        return Object.keys(x) as (keyof T)[];
    }
}

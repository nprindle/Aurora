export function clamp(min: number, value: number, max: number) {
    return Math.max(Math.min(value, max), min);
}

// enforces compile-tile check that an array have at least one element
export type NonEmptyArray<T> = [T, ...T[]];
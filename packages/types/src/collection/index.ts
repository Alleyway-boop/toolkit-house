/**
 * Collection type utilities for arrays, objects, and other collections
 */

// MARKER: Deep Collection Utilities

/**
 * Deep readonly collection
 */
export type DeepReadonlyCollection<T> = T extends (infer U)[]
  ? readonly DeepReadonlyCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepReadonlyCollection<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonlyCollection<T[K]> }
  : T;

/**
 * Deep mutable collection (removes readonly)
 */
export type DeepMutableCollection<T> = T extends readonly (infer U)[]
  ? DeepMutableCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? DeepMutableCollection<U>[]
  : T extends object
  ? { -readonly [K in keyof T]: T[K] }
  : T;

/**
 * Deep partial collection (all properties optional)
 */
export type DeepPartialCollection<T> = T extends (infer U)[]
  ? DeepPartialCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? DeepPartialCollection<U>[]
  : T extends object
  ? { [K in keyof T]?: DeepPartialCollection<T[K]> }
  : T;

/**
 * Deep required collection (all properties required)
 */
export type DeepRequiredCollection<T> = T extends (infer U)[]
  ? DeepRequiredCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? DeepRequiredCollection<U>[]
  : T extends object
  ? { -readonly [K in keyof T]-?: DeepRequiredCollection<T[K]> }
  : T;

/**
 * Deep non-nullable collection
 */
export type DeepNonNullableCollection<T> = T extends (infer U)[]
  ? DeepNonNullableCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? DeepNonNullableCollection<U>[]
  : T extends object
  ? { [K in keyof T]: DeepNonNullableCollection<T[K]> }
  : NonNullable<T>;

// MARKER: Array Type Utilities

/**
 * Filter array to specific type
 */
export type ArrayFilter<T, U> = T extends U ? T : never;

/**
 * Filter array to exclude specific type
 */
export type ArrayExclude<T, U> = T extends U ? never : T;

/**
 * Remove null and undefined from array
 */
export type NonNullableArray<T extends readonly unknown[]> = ArrayFilter<T, NonNullable<T[number]>>[];

/**
 * Create tuple type from array
 */
export type ArrayToTuple<T extends readonly unknown[]> = [...T];

/**
 * Convert tuple to array type
 */
export type TupleToArray<T extends readonly unknown[]> = T[number][];

/**
 * Reverse tuple type
 */
export type ReverseTuple<T extends readonly unknown[]> = T extends readonly [...infer Rest, infer Last]
  ? [Last, ...ReverseTuple<Rest>]
  : T;

/**
 * Sort tuple type ascending
 */
export type SortTuple<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? [...SortTuple<Rest>, First]
  : T;

/**
 * Unique elements in array type
 */
export type UniqueArray<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends UniqueArray<Rest>[number]
    ? UniqueArray<Rest>
    : [First, ...UniqueArray<Rest>]
  : [];

/**
 * Remove duplicates from array type
 */
export type RemoveDuplicates<T extends readonly unknown[]> = UniqueArray<T>;

/**
 * Zip two array types
 */
export type Zip<A extends readonly unknown[], B extends readonly unknown[]> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
};

/**
 * Concatenate two array types
 */
export type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];

/**
 * Slice array type from start to end
 */
export type Slice<
  T extends readonly unknown[],
  Start extends number,
  End extends number = T['length']
> = T extends readonly [...infer Rest, infer Last]
  ? Rest['length'] extends Start
    ? [Last]
    : T extends readonly [infer First, ...infer Tail]
    ? [First, ...Slice<Tail, Start, End>]
    : []
  : [];

// MARKER: Object Collection Utilities

/**
 * Extract values as array type
 */
export type Values<T> = T[keyof T];

/**
 * Extract keys as array type
 */
export type Keys<T> = keyof T;

/**
 * Create object from array with index keys
 */
export type ArrayToObject<T extends readonly unknown[]> = {
  [K in keyof T]: T[K];
} & { length: T['length'] };

/**
 * Pick properties with specific value type
 */
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * Omit properties with specific value type
 */
export type OmitByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? never : K }[keyof T]>;

/**
 * Create readonly object from keys and values
 */
export type ReadonlyObject<K extends readonly PropertyKey[], V> = {
  readonly [P in K[number]]: V;
};

/**
 * Create object with mapped keys
 */
export type MapObjectKeys<T, M extends Record<keyof T, PropertyKey>> = {
  [K in keyof T as M[K]]: T[K];
};

/**
 * Create object with mapped values
 */
export type MapObjectValues<T, M> = {
  [K in keyof T]: M extends (value: T[K]) => infer R ? R : M;
};

/**
 * Merge two objects with union of properties
 */
export type MergeObjects<T, U> = Omit<T, keyof U> & U;

/**
 * Intersection of two objects
 */
export type IntersectObjects<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
};

/**
 * Difference of two objects (properties in first but not in second)
 */
export type DiffObjects<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

/**
 * Symmetric difference of two objects
 */
export type SymDiffObjects<T, U> = DiffObjects<T, U> & DiffObjects<U, T>;

// MARKER: Set and Map Type Utilities

/**
 * Set type utilities
 */
export type SetType<T> = Set<T>;

/**
 * Read-only set type
 */
export type ReadonlySetType<T> = ReadonlySet<T>;

/**
 * Map type utilities
 */
export type MapType<K, V> = Map<K, V>;

/**
 * Read-only map type
 */
export type ReadonlyMapType<K, V> = ReadonlyMap<K, V>;

/**
 * Extract keys from map as type
 */
export type MapKeys<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;

/**
 * Extract values from map as type
 */
export type MapValues<T extends Map<any, any>> = T extends Map<any, infer V> ? V : never;

/**
 * Create map type from object
 */
export type ObjectToMap<T extends Record<PropertyKey, any>> = Map<keyof T, T[keyof T]>;

/**
 * Create object type from map
 */
export type MapToObject<T extends Map<PropertyKey, any>> = {
  [K in keyof T]: T[K];
};

// MARKER: Collection Transformation Utilities

/**
 * Flatten nested array type
 */
export type Flatten<T> = T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? Flatten<U>
    : U
  : T;

/**
 * Flatten nested collection (arrays and objects)
 */
export type DeepFlatten<T> = T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? [...DeepFlatten<U>]
    : [U]
  : T extends object
  ? { [K in keyof T]: DeepFlatten<T[K]> }
  : T;

/**
 * Group array by key extractor type
 */
export type GroupBy<T, K extends PropertyKey> = {
  [P in K]: Array<T extends { key: infer GK } ? GK extends P ? T : never : never>;
};

/**
 * Paginate array type
 */
export type Paginate<T extends readonly unknown[], PageSize extends number> = Array<{
  page: number;
  data: Slice<T, number, PageSize>;
  hasMore: boolean;
}>;

/**
 * Chunk array into groups of specific size
 */
export type Chunk<T extends readonly unknown[], Size extends number> = T extends readonly []
  ? []
  : T extends readonly [...infer First, ...infer Rest]
  ? Size extends 0
    ? []
    : Size extends 1
    ? [[First], ...Chunk<Rest, Size>]
    : ChunkHelper<T, Size, []>
  : [];

type ChunkHelper<
  T extends readonly unknown[],
  Size extends number,
  Acc extends readonly unknown[]
> = Acc['length'] extends Size
  ? [Acc, ...Chunk<T, Size>]
  : T extends readonly [infer First, ...infer Rest]
  ? ChunkHelper<Rest, Size, readonly [...Acc, First]>
  : [Acc];
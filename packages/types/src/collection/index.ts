/**
 * Collection type utilities for arrays, objects, and other collections
 * 集合类型工具，用于数组、对象和其他集合
 */

// MARKER: Deep Collection Utilities
// 标记：深度集合工具

/**
 * Deep readonly collection
 * 深度只读集合
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
 * 深度可变集合（移除只读）
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
 * 深度可选集合（所有属性可选）
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
 * 深度必需集合（所有属性必需）
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
 * 深度不可为空集合
 */
export type DeepNonNullableCollection<T> = T extends (infer U)[]
  ? DeepNonNullableCollection<U>[]
  : T extends ReadonlyArray<infer U>
  ? DeepNonNullableCollection<U>[]
  : T extends object
  ? { [K in keyof T]: DeepNonNullableCollection<T[K]> }
  : NonNullable<T>;

// MARKER: Array Type Utilities
// 标记：数组类型工具

/**
 * Filter array to specific type
 * 过滤数组为特定类型
 */
export type ArrayFilter<T, U> = T extends U ? T : never;

/**
 * Filter array to exclude specific type
 * 过滤数组以排除特定类型
 */
export type ArrayExclude<T, U> = T extends U ? never : T;

/**
 * Remove null and undefined from array
 * 从数组中移除 null 和 undefined
 */
export type NonNullableArray<T extends readonly unknown[]> = ArrayFilter<T, NonNullable<T[number]>>[];

/**
 * Create tuple type from array
 * 从数组创建元组类型
 */
export type ArrayToTuple<T extends readonly unknown[]> = [...T];

/**
 * Convert tuple to array type
 * 将元组转换为数组类型
 */
export type TupleToArray<T extends readonly unknown[]> = T[number][];

/**
 * Reverse tuple type
 * 反转元组类型
 */
export type ReverseTuple<T extends readonly unknown[]> = T extends readonly [...infer Rest, infer Last]
  ? [Last, ...ReverseTuple<Rest>]
  : T;

/**
 * Sort tuple type ascending
 * 升序排序元组类型
 */
export type SortTuple<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? [...SortTuple<Rest>, First]
  : T;

/**
 * Unique elements in array type
 * 数组类型中的唯一元素
 */
export type UniqueArray<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends UniqueArray<Rest>[number]
    ? UniqueArray<Rest>
    : [First, ...UniqueArray<Rest>]
  : [];

/**
 * Remove duplicates from array type
 * 从数组类型中移除重复项
 */
export type RemoveDuplicates<T extends readonly unknown[]> = UniqueArray<T>;

/**
 * Zip two array types
 * 将两个数组类型配对
 */
export type Zip<A extends readonly unknown[], B extends readonly unknown[]> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
};

/**
 * Concatenate two array types
 * 连接两个数组类型
 */
export type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];

/**
 * Slice array type from start to end
 * 对数组类型进行切片从起始到结束
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
// 标记：对象集合工具

/**
 * Extract values as array type
 * 将值提取为数组类型
 */
export type Values<T> = T[keyof T];

/**
 * Extract keys as array type
 * 将键提取为数组类型
 */
export type Keys<T> = keyof T;

/**
 * Create object from array with index keys
 * 从数组创建带有索引键的对象
 */
export type ArrayToObject<T extends readonly unknown[]> = {
  [K in keyof T]: T[K];
} & { length: T['length'] };

/**
 * Pick properties with specific value type
 * 挑选具有特定值类型的属性
 */
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;

/**
 * Omit properties with specific value type
 * 省略具有特定值类型的属性
 */
export type OmitByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? never : K }[keyof T]>;

/**
 * Create readonly object from keys and values
 * 从键和值创建只读对象
 */
export type ReadonlyObject<K extends readonly PropertyKey[], V> = {
  readonly [P in K[number]]: V;
};

/**
 * Create object with mapped keys
 * 创建具有映射键的对象
 */
export type MapObjectKeys<T, M extends Record<keyof T, PropertyKey>> = {
  [K in keyof T as M[K]]: T[K];
};

/**
 * Create object with mapped values
 * 创建具有映射值的对象
 */
export type MapObjectValues<T, M> = {
  [K in keyof T]: M extends (value: T[K]) => infer R ? R : M;
};

/**
 * Merge two objects with union of properties
 * 合并两个对象，属性取并集
 */
export type MergeObjects<T, U> = Omit<T, keyof U> & U;

/**
 * Intersection of two objects
 * 两个对象的交集
 */
export type IntersectObjects<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
};

/**
 * Difference of two objects (properties in first but not in second)
 * 两个对象的差集（在第一个对象中但不在第二个对象中的属性）
 */
export type DiffObjects<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

/**
 * Symmetric difference of two objects
 * 两个对象的对称差集
 */
export type SymDiffObjects<T, U> = DiffObjects<T, U> & DiffObjects<U, T>;

// MARKER: Set and Map Type Utilities
// 标记：Set 和 Map 类型工具

/**
 * Set type utilities
 * Set 类型工具
 */
export type SetType<T> = Set<T>;

/**
 * Read-only set type
 * 只读 Set 类型
 */
export type ReadonlySetType<T> = ReadonlySet<T>;

/**
 * Map type utilities
 * Map 类型工具
 */
export type MapType<K, V> = Map<K, V>;

/**
 * Read-only map type
 * 只读 Map 类型
 */
export type ReadonlyMapType<K, V> = ReadonlyMap<K, V>;

/**
 * Extract keys from map as type
 * 从 Map 中提取键作为类型
 */
export type MapKeys<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;

/**
 * Extract values from map as type
 * 从 Map 中提取值作为类型
 */
export type MapValues<T extends Map<any, any>> = T extends Map<any, infer V> ? V : never;

/**
 * Create map type from object
 * 从对象创建 Map 类型
 */
export type ObjectToMap<T extends Record<PropertyKey, any>> = Map<keyof T, T[keyof T]>;

/**
 * Create object type from map
 * 从 Map 创建对象类型
 */
export type MapToObject<T extends Map<PropertyKey, any>> = {
  [K in keyof T]: T[K];
};

// MARKER: Collection Transformation Utilities
// 标记：集合转换工具

/**
 * Flatten nested array type
 * 展平嵌套数组类型
 */
export type Flatten<T> = T extends readonly (infer U)[]
  ? U extends readonly unknown[]
    ? Flatten<U>
    : U
  : T;

/**
 * Flatten nested collection (arrays and objects)
 * 展平嵌套集合（数组和对象）
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
 * 按键提取器类型对数组进行分组
 */
export type GroupBy<T, K extends PropertyKey> = {
  [P in K]: Array<T extends { key: infer GK } ? GK extends P ? T : never : never>;
};

/**
 * Paginate array type
 * 数组分页类型
 */
export type Paginate<T extends readonly unknown[], PageSize extends number> = Array<{
  page: number;
  data: Slice<T, number, PageSize>;
  hasMore: boolean;
}>;

/**
 * Chunk array into groups of specific size
 * 将数组分块为特定大小的组
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

/**
 * Helper type for Chunk implementation
 * Chunk 实现的辅助类型
 */
type ChunkHelper<
  T extends readonly unknown[],
  Size extends number,
  Acc extends readonly unknown[]
> = Acc['length'] extends Size
  ? [Acc, ...Chunk<T, Size>]
  : T extends readonly [infer First, ...infer Rest]
  ? ChunkHelper<Rest, Size, readonly [...Acc, First]>
  : [Acc];
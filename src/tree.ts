/**
 * toTree 方法参数
 */
export interface ToTreeOption<T extends Record<string, any>> {
  /** 数据 */
  data?: T[] | null;
  /** id 字段名称 */
  idField?: keyof T | string | null;
  /** parentId 字段名称 */
  parentIdField?: keyof T | string | null;
  /** 生成的 children 字段名称 */
  childrenField?: string | null;
  /** 最顶级的 parentId 值 */
  parentId?: number | string | (number | string)[] | null;
  /** 是否添加包含所有父级 id 的字段 */
  addParentIds?: boolean | null;
  /** 包含所有父级 id 字段的名称 */
  parentIdsField?: string | null;
  /** 所有父级的 id */
  parentIds?: (number | string)[] | null;
}

/**
 * parentId 形式数据转 children 形式
 * @param option ToTreeOption
 */
export function toTree<T extends Record<string, any>>(
  option: ToTreeOption<T>
): T[] {
  const data = option.data;
  const idField = option.idField || "id";
  const parentIdField = option.parentIdField || "parentId";
  const childrenField = option.childrenField || "children";
  const parentIdIsNull = option.parentId == null;
  const parentId = parentIdIsNull ? [] : option.parentId;
  const parentIdIsArray = Array.isArray(parentId);
  const addParentIds = option.addParentIds;
  const parentIdsField = option.parentIdsField || "parentIds";
  const parentIds = option.parentIds ?? [];

  if (data == null) {
    return [];
  }

  if (parentIdIsNull) {
    data.forEach((d) => {
      if (
        !data.some(
          (t) => d[parentIdField as keyof T] == t[idField as keyof T]
        ) &&
        !(parentId as unknown[]).includes(d[parentIdField as keyof T])
      ) {
        (parentId as unknown[]).push(d[parentIdField as keyof T]);
      }
    });
  }

  const result: T[] = [];
  data.forEach((d) => {
    if (d[idField as keyof T] == d[parentIdField as keyof T]) {
      const error = {
        [idField]: d[idField as keyof T],
        [parentIdField]: d[parentIdField as keyof T],
        data: d,
      };
      console.warn(
        "Invalid tree node detected (id equals parentId), skipping:",
        error
      );
      return;
    }
    if (
      parentIdIsArray
        ? parentId.includes(d[parentIdField as keyof T])
        : d[parentIdField as keyof T] == parentId
    ) {
      const t = { ...d };
      const children = toTree({
        data,
        idField,
        parentIdField,
        childrenField,
        parentId: d[idField as keyof T],
        addParentIds,
        parentIdsField,
        parentIds: [...parentIds, d[idField as keyof T]],
      });
      if (children.length > 0) {
        (t as any)[childrenField] = children;
      }
      if (addParentIds) {
        (t as any)[parentIdsField] = parentIds;
      }
      result.push(t);
    }
  });
  return result;
}

/**
 * 遍历 children 形式数据
 * @param data 数据
 * @param callback 回调
 * @param childrenField children 字段名
 * @param parent 当前的父级
 */
export function eachTree<T extends Record<string, any>>(
  data?: T[],
  callback?: (item: T, index: number, parent?: T) => void | boolean,
  childrenField: keyof T | string = "children",
  parent?: T
): Boolean | void {
  if (!data) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const flag = callback ? callback(data[i], i, parent) : void 0;
    if (flag === false) {
      return false;
    }
    if (data[i][childrenField as keyof T]?.length) {
      if (
        eachTree(
          data[i][childrenField as keyof T],
          callback,
          childrenField,
          data[i]
        ) === false
      ) {
        return false;
      }
    }
  }
}

/**
 * 查找树形数据
 * @param data 数据
 * @param predicate 查找条件
 * @param childrenField children 字段名
 */
export function findTree<T extends Record<string, any>>(
  data: T[] | undefined,
  predicate: (value: T, index: number) => unknown,
  childrenField: keyof T | string = "children"
): T | undefined {
  let temp: T | undefined;
  eachTree(
    data,
    (d, i) => {
      if (predicate(d, i)) {
        temp = d;
        return false;
      }
    },
    childrenField
  );
  return temp;
}

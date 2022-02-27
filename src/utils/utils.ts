import { BaseType, ObjType } from '../types/common';
export function promptsCancel() {
  process.exit(0);
}

export const getType = (v?: unknown): string => Object.prototype.toString.call(v).slice(8, -1).toLowerCase();

export const space = (num = 1) => {
  const spaceCode = '\xa0';
  return spaceCode.repeat(num);
};

export const intersection = (a: BaseType[], b: BaseType[]): BaseType[] => {
  const s = Array.isArray(b) ? new Set(b) : new Set([b]);
  return [...new Set(a)].filter(x => s.has(x));
};

export const omit = <T>(obj: ObjType, arr: string[]): T => {
  if (!Array.isArray(arr)) return obj;
  return Object.keys(obj)
    .filter(key => !arr.includes(key))
    .reduce((acc: ObjType, key: string) => ((acc[key] = obj[key]), acc), {});
};

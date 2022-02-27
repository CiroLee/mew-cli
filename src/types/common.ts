export type BaseType = string | number | undefined | null | boolean | symbol;
export type LogContent = Omit<BaseType, symbol> | object;
export type ObjType = Record<string | number | symbol, any>;

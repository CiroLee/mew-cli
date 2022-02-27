import { green, yellow, lightGray } from 'kolorist';
import { getType } from './utils/utils';
import type { LogContent } from './types/common';
export default class Log {
  stringify(args: LogContent) {
    const validates = [
      getType(args) === 'number',
      getType(args) === 'string',
      getType(args) === 'null',
      getType(args) === 'undefined',
      getType(args) === 'boolean',
    ];
    // 基础类型直接返回打印
    if (validates.some(Boolean)) {
      return args;
    } else if (Array.isArray(args) && !args.length) {
      return '';
    }

    return JSON.stringify(args, null, 2)?.replace(/^"|"$/g, '');
  }
  success(content: LogContent, ...args: LogContent[]) {
    console.log(green(`[LOG] ${this.stringify(content)} ${this.stringify(args)}`));
  }
  warn(content: LogContent, ...args: LogContent[]) {
    console.log(yellow(`[WARN] ${this.stringify(content)} ${this.stringify(args)}`));
  }
  info(content: LogContent, ...args: LogContent[]) {
    console.log(lightGray(`[INFO] ${this.stringify(content)} ${this.stringify(args)}`));
  }
  log(content: LogContent, ...args: LogContent[]) {
    console.log(lightGray(`${this.stringify(content)} ${this.stringify(args)}`));
  }
}

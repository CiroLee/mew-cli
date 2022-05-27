import pkg from '../package.json';
import { intersection } from './utils/utils';
import Log from './log';
const logger = new Log();
const strategies: {
  [key: string]: () => void;
} = {
  version: () => {
    logger.log(pkg.version);
  },
  help: () => {
    const helps = `Options:
  init                 初始化项目
  commit               使用commitlint规范提交信息
  deploy [-u]          将当前分支推送到远程仓库。如果是新仓库, 请使用 mew/mew-cli deploy -u
  page                 创建页面(自动同步到路由配置)
  -v, --version        输出本版号
  -h, --help           输出帮助信息
    `;
    logger.log(helps);
  },
};
const strategyMap = [
  {
    name: 'version',
    alias: (val: string[]) => intersection(['version', 'v'], val),
  },
  {
    name: 'help',
    alias: (val: string[]) => intersection(['help', 'h'], val),
  },
];

const getStragegyName = (optionsArgs: object) => {
  const keys = Object.keys(optionsArgs);
  return strategyMap.find(item => item.alias(keys).length)?.name;
};

export const executeFeature = (feature: object) => {
  const strategy = getStragegyName(feature);
  return strategy && strategies[strategy]();
};

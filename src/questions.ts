import * as kolorist from 'kolorist';
const { gray } = kolorist;
export const initProjectMsg = [
  {
    type: 'text',
    name: 'project-name',
    message: '项目名称',
    initial: 'demo-project',
  },
  {
    type: 'select',
    name: 'template',
    choices: [
      { title: 'vue-ts', value: 'vue-ts' },
      { title: 'react-ts', value: 'react-ts' },
    ],
    message: '选择项目模板',
    initial: 0,
  },
];

export const installNowMsg = {
  type: 'toggle',
  name: 'isInstallNow',
  message: '是否立即安装项目依赖?',
  initial: true,
  active: 'yes',
  inactive: 'no',
};

export const installToolMsg = {
  type: 'select',
  name: 'tool',
  message: '选择安装工具',
  choices: [
    { title: 'npm', value: 'npm' },
    { title: 'pnpm', value: 'pnpm' },
    { title: 'yarn', value: 'yarn' },
  ],
};

export const overWriteFiles = {
  type: 'toggle',
  name: 'isOverWrite',
  message: '工程目录/文件已存在, 是否覆盖?',
  initial: true,
  active: 'yes',
  inactive: 'no',
};

export const pathName = {
  type: 'text',
  name: 'dirName',
  message: '访问路径',
};

const commitTypes = {
  type: 'select',
  name: 'commitType',
  message: '提交类型',
  choices: [
    {
      title: `feat: ${gray('新增 feature')}`,
      value: 'feat',
    },
    {
      title: `fix: ${gray('修复 bug')}`,
      value: 'fix',
    },
    {
      title: `docs: ${gray('仅修改文档, 如README, CHANGELOG, CONTRIBUTE等')}`,
      value: 'docs',
    },
    {
      title: `style: ${gray('仅修改了空格、格式缩进、逗号等等, 不改变代码逻辑')}`,
      value: 'style',
    },
    {
      title: `refactor: ${gray('代码重构, 没有加新功能或者修复 bug')}`,
      value: 'refactor',
    },
    {
      title: `perf: ${gray('优化相关, 比如提升性能、体验')}`,
      value: 'perf',
    },
    {
      title: `test: ${gray('测试用例, 包括单元测试、集成测试等')}`,
      value: 'test',
    },
    {
      title: `chore: ${gray('改变构建流程、或者增加依赖库、工具等')}`,
      value: 'chore',
    },
    {
      title: `revert: ${gray('回滚到上一个版本')}`,
      value: 'revert',
    },
  ],
};

const commitMsg = {
  type: 'text',
  name: 'commitMessage',
  message: '简要概述本次提交的内容',
};

export const createPageMsg = [
  {
    type: 'text',
    name: 'pageName',
    message: `页面名称${gray('(名称以英文开头, 可包含数字和中划线)')}`,
  },
  {
    type: 'text',
    name: 'dirName',
    message: `访问路径${gray('(不需要/开头)')}`,
  },
];

export const bindRepositoryMsg = {
  type: 'text',
  name: 'repo',
  message: `请填写Github远程仓库地址${gray('(https/ssh)')}`,
};

export const commitLintsMsg = [commitTypes, commitMsg];

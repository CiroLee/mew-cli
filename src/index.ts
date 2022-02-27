#!/usr/bin/env node
import minimist from 'minimist';
import { initProject } from './commands';
import Git from './git';
import { executeFeature } from './features';
import { omit } from './utils/utils';
import createPage from './page';
import type { ObjType } from './types/common';

const argv = minimist(process.argv.slice(2));
const noOptionsArgs = argv._ || [];
const optionsArgs = omit<ObjType>(argv, ['_']);
const cmd = noOptionsArgs[0];
const git = new Git();
/**
 * todo
 * 迁移git操作
 * 迁移创建页面操作
 */
(async function run() {
  switch (cmd) {
    case 'init':
      initProject();
      break;
    case 'commit':
      git.commit();
      break;
    case 'deploy':
      git.deploy(optionsArgs);
      break;
    case 'page':
      createPage();
      break;
    default:
      executeFeature(optionsArgs);
  }
})();

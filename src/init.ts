// 命令响应模块
import ora from 'ora';
import Git from './git';
import path from 'path';
import Log from './log';
import ChildProcess from './child-process';
import { createDir } from './utils/fs-utils';
import { promptsCancel, space } from './utils/utils';
import prompts, { PromptObject } from 'prompts';
import { initProjectMsg, installNowMsg, installToolMsg } from './questions';

const git = new Git();
const spinner = ora();
const logger = new Log();
const childProcess = new ChildProcess();
/**
 * 初始化项目 init命令
 * 1. 创建项目目录
 * 2. 下载远程仓库代码
 * 3. 安装依赖
 */
export async function initProject() {
  try {
    const { projectName, template } = await prompts(initProjectMsg as PromptObject[], {
      onCancel: promptsCancel,
    });
    await createDir(path.resolve(process.cwd(), projectName));
    await git.download({
      templateName: `${template}-tpl`,
      destination: path.resolve(process.cwd(), projectName),
      callback: installPackage,
    });
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

async function installPackage(directory: string): Promise<void> {
  try {
    const { isInstallNow } = await prompts(installNowMsg as PromptObject, { onCancel: promptsCancel });
    if (isInstallNow) {
      const { tool } = await prompts(installToolMsg as PromptObject, { onCancel: promptsCancel });
      spinner.start('installing package...\n');
      await childProcess.spawn(`${tool} install`, { cwd: directory });
      spinner.succeed('success to install packages');
      logger.success(`cd ${directory.split('/').slice(-1)[0]} \n${space(6)}run npm run dev to START 🎉🎉`);
    } else {
      logger.info(
        `cd ${directory.split('/').slice(-1)[0]}\n ${space(6)}npm/yarn install\n${space(7)}npm run dev to START`
      );
      process.exit(0);
    }
  } catch (error) {
    console.error('install package failed', error);
    process.exit(0);
  }
}

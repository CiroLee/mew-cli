// git 操作
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import Log from './log';
import { promptsCancel } from './utils/utils';
import prompts, { PromptObject } from 'prompts';
import { commitLintsMsg, bindRepositoryMsg } from './questions';
import ChildProcess from './child-process';
import { download as downloadGitRepo } from 'obtain-git-repo';
import type { GitDownload } from './types/git';

const logger = new Log();
const spinner = ora();

export default class Git extends ChildProcess {
  async version() {
    try {
      const { stdout } = await this.exec('git version');
      return stdout;
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
  async commit(options?: { u?: boolean }) {
    try {
      const result = await prompts(commitLintsMsg as PromptObject[], { onCancel: promptsCancel });
      const { commitType, commitMessage } = result;
      if (!result.commitType || !result.commitMessage) {
        throw new Error(JSON.stringify(result));
      }
      options?.u && (await this.spawn('git init'));
      await this.spawn('git add .');
      await this.spawn(`git commit -m "${commitType}: ${commitMessage}"`);
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
  async push(options: { u?: boolean }) {
    try {
      // 新仓自动初始化，提示绑定远程仓库
      if (options?.u) {
        const { repo } = await prompts(bindRepositoryMsg as PromptObject, {
          onCancel: promptsCancel,
        });
        if (repo) {
          // 修改当前分支为main, 符合github默认分支规则
          this.spawn('git branch -M master main');
          await this.spawn(`git remote add origin ${repo}`);
          await this.spawn(`git push --set-upstream origin main`);
        } else {
          logger.warn('请填写有效的远程仓库地址');
          this.push({ u: true });
        }
      } else {
        this.spawn('git push');
      }
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
  async deploy(options: { u?: boolean }) {
    try {
      await this.commit(options);
      await this.push(options);
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }

  async download({ templateName, destination, options = {}, callback }: GitDownload) {
    try {
      const gitRepo = `CiroLee/${templateName}`;
      const templatePath = path.resolve(__dirname, templateName);
      if (fs.existsSync(templatePath)) {
        fs.remove(templatePath);
      }
      spinner.start('downloading template...');
      downloadGitRepo(gitRepo, destination, options, err => {
        if (err) {
          spinner.fail('fail to download rempalte');
          throw Error(JSON.stringify(err, null, 2));
        }
        spinner.succeed('success to download template!');
        callback?.(destination);
      });
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
}

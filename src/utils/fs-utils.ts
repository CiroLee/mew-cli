import fs from 'fs-extra';
import prompts, { PromptObject } from 'prompts';
import { overWriteFiles } from '../questions';
import { promptsCancel } from './utils';
export async function createDir(directory: string): Promise<void> {
  try {
    if (fs.existsSync(directory)) {
      const { isOverWrite } = await prompts(overWriteFiles as PromptObject, { onCancel: promptsCancel });
      if (isOverWrite) {
        fs.mkdirs(directory);
      } else {
        process.exit(0);
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

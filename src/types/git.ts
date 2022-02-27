import { ExecOptions } from 'child_process';
export interface GitDownload {
  templateName: string;
  destination: string;
  options?: ExecOptions;
}

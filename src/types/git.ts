export interface GitDownload {
  templateName: string;
  destination: string;
  options?: {
    clone?: boolean;
    headers?: Record<string, string>;
  };
  callback?: (path: string) => void;
}

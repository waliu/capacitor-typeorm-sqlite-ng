import { Tree } from '@angular-devkit/schematics';

export function readJson<T>(tree: Tree, path: string): T {
  const buffer = tree.read(path);

  if (!buffer) {
    throw new Error(`Required JSON file not found: ${path}`);
  }

  return JSON.parse(buffer.toString('utf-8')) as T;
}

export function writeJson(tree: Tree, path: string, value: unknown): void {
  tree.overwrite(path, `${JSON.stringify(value, null, 2)}\n`);
}

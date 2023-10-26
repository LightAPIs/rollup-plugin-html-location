import fs from 'node:fs';
import chalk from 'chalk';
import type { Plugin } from 'rollup';

export type RollupPlugin = Plugin;

export interface LocationOptions {
  /**
   * Root directory
   * @description The path is relative to the `output.dir` of Rollup
   */
  dir?: string;
  /** Specify the file name of HTML */
  filename?:
    | {
        [path: string]: string;
      }
    | ((path: string) => string);
  /** Disable remove empty folders in bundle */
  disableClearEmptyFolder?: boolean;
  /** Print operation log */
  logging?: boolean;
}

function getDest(destDir: string, path: string): string {
  return destDir + (path.startsWith('/') ? path.substring(1) : path);
}

function getPreDir(path: string): string {
  while (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path.slice(0, path.lastIndexOf('/') + 1);
}

/**
 * Specify the output location of the html entry file
 * @param pluginOptions Plugin otpions
 * @returns
 */
function htmlLocation(pluginOptions: LocationOptions = {}): RollupPlugin {
  const pluginName = 'html-location';

  return {
    name: pluginName,
    writeBundle: {
      order: 'post',
      handler(options, bundle) {
        const buildDir = (options.dir?.endsWith('/') ? options.dir : options.dir + '/') || '';
        const { dir, filename, disableClearEmptyFolder, logging } = pluginOptions;

        let destDir = '';

        if (dir && dir.trim().replace(/\.+\//g, '')) {
          const dest = dir.trim().replace(/\.+\//g, '').trim();
          if (dest) {
            destDir = dest.endsWith('/') ? dest : dest + '/';
            if (destDir === '/') {
              destDir = '';
            }
          }
        }

        const filesPath: string[] = [];

        for (const module of Object.values(bundle)) {
          const filePath = module.fileName;
          if (filePath.endsWith('.html')) {
            filesPath.push(filePath);
          }
        }

        const moveFiles: { source: string; dest: string }[] = [];

        if (filename) {
          if (typeof filename === 'function') {
            filesPath.forEach(p => {
              const r = filename(p);
              if (r && r.endsWith('.html') && r !== p) {
                moveFiles.push({
                  source: p,
                  dest: getDest(destDir, r),
                });
              }
            });
          } else if (typeof filename === 'object') {
            const keys = Object.keys(filename);
            filesPath.forEach(p => {
              if (keys.includes(p)) {
                if (filename[p].endsWith('.html') && p !== filename[p]) {
                  moveFiles.push({
                    source: p,
                    dest: getDest(destDir, filename[p]),
                  });
                }
              }
            });
          }
        }

        const sourceDir: string[] = [];
        for (const move of moveFiles) {
          const { source, dest } = move;
          const buildSource = buildDir + source;
          const buildDest = buildDir + dest;
          if (fs.existsSync(buildSource) && !fs.existsSync(buildDest)) {
            const preDir = getPreDir(buildDest);
            if (!fs.existsSync(preDir)) {
              fs.mkdirSync(preDir, { recursive: true });
            }
            fs.renameSync(buildSource, buildDest);
            sourceDir.push(getPreDir(buildSource));
            if (logging) {
              console.log(`${pluginName}: `, chalk.green(`[${source}] ==> [${dest}]`));
            }
          }
        }

        if (!disableClearEmptyFolder) {
          let clearState = false;
          sourceDir.forEach(dir => {
            while (dir && fs.existsSync(dir)) {
              const subList = fs.readdirSync(dir);
              if (subList.length === 0) {
                fs.rmdirSync(dir);
                clearState = true;
              }
              dir = getPreDir(dir);
            }
          });

          if (clearState && logging) {
            console.log(`${pluginName}: `, chalk.red(`clear empty folder!`));
          }
        }
      },
    },
  };
}

export default htmlLocation;

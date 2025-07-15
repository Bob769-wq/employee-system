import {
  applicationGenerator,
  E2eTestRunner,
  UnitTestRunner,
} from '@nx/angular/generators';
import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  OverwriteStrategy,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';

import { AppGeneratorSchema } from './schema';

export async function angularAppGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
) {
  const prefix = 'app';
  const port = options.port ?? 4200;
  const ssr = options.ssr ?? false;
  const serverRouting = ssr;

  const directoryForApp = `web/apps/${options.name}`;
  await applicationGenerator(tree, {
    name: options.name,
    directory: directoryForApp,
    prefix: prefix,
    routing: true,
    standalone: true,
    style: 'css',
    inlineStyle: true,
    inlineTemplate: true,
    skipTests: true,
    addTailwind: true,
    linter: 'eslint',
    unitTestRunner: UnitTestRunner.Vitest,
    e2eTestRunner: E2eTestRunner.None,
    strict: true,
    port,
    bundler: 'esbuild',
    ssr,
    serverRouting,
  });

  const directory = `${directoryForApp}/src/app`;
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    directory,
    {},
    {
      overwriteStrategy: OverwriteStrategy.Overwrite,
    },
  );

  const projectRoot = readProjectConfiguration(tree, options.name).sourceRoot; // Should be `web/apps/${options.name}/src`.
  if (!projectRoot) {
    throw new Error(
      `${options.name} is not a project found in project configuration`,
    );
  }
  tree.delete(joinPathFragments(projectRoot, 'app', 'nx-welcome.ts'));

  await formatFiles(tree);
}

export default angularAppGenerator;

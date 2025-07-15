import { libraryGenerator } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';

import { AngularGeneratorSchema } from './schema';

export async function angularLibraryGenerator(
  tree: Tree,
  options: AngularGeneratorSchema,
) {
  const prefix = 'app';
  const app = options.app;

  await libraryGenerator(tree, {
    name: `${prefix}-${app}-${options.domain}-${options.type}-${options.name}`,
    directory: `web/libs/${app}/${options.domain}/${options.type}/${options.name}`,
    buildable: options.type === 'utils' || options.type === 'api',
    selector: `${prefix}-${options.name}`,

    importPath: `@${prefix}/${app}/${options.domain}/${options.type}/${options.name}`,
    standalone: true,
    simpleName: true,
    inlineTemplate: true,
    inlineStyle: true,
    changeDetection: 'OnPush',
    style: 'css',
    publishable: false,
    spec: false,
    flat: true,
    prefix: prefix,
    skipModule: true,
    skipTests: true,
  });

  if (options.type === 'api') {
    // Add .gitignore file in the generated library
    const gitignorePath = `web/libs/${app}/${options.domain}/${options.type}/${options.name}/.gitignore`;
    const gitignoreContent = `/src/lib`;
    tree.write(gitignorePath, gitignoreContent);
    // Update the index.ts file to export all the files in the lib folder
    const indexPath = `web/libs/${app}/${options.domain}/${options.type}/${options.name}/src/index.ts`;
    const indexContent = `export * from './lib';\n`;
    tree.write(indexPath, indexContent);
  }
}

export default angularLibraryGenerator;

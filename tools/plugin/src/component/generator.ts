import { componentGenerator as ngComponentGenerator } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';

import { ComponentGeneratorSchema } from './schema';

export async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema,
) {
  const prefix = 'app';

  await ngComponentGenerator(tree, {
    name: options.name,
    path: options.name, // though this is likely not used, it can't be empty string, or it'll throw error
    prefix: prefix,
    selector: `${prefix}-${options.name}`,
    standalone: true,
    style: 'css',
    inlineStyle: true,
    inlineTemplate: true,
    changeDetection: 'OnPush',
    skipTests: true,
    type: 'component',
  });
}

export default componentGenerator;

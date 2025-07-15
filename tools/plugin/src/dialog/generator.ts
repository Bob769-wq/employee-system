import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  Tree,
} from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

import { DialogGeneratorSchema } from './schema';

export async function dialogGenerator(
  tree: Tree,
  options: DialogGeneratorSchema,
) {
  const prefix = 'app';

  const { directory } = await determineArtifactNameAndDirectoryOptions(tree, {
    name: options.name,
    path: options.name, // though this is likely not used, it can't be empty string, or it'll throw error
    allowedFileExtensions: ['ts'],
    fileExtension: 'ts',
  });

  const { className, fileName } = names(options.name);
  generateFiles(tree, joinPathFragments(__dirname, 'files'), directory, {
    prefix,
    className,
    fileName,
  });
  await formatFiles(tree);
}

export default dialogGenerator;

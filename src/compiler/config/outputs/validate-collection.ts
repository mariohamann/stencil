import type * as d from '../../../declarations';
import { getAbsolutePath } from '../config-utils';
import { isOutputTargetDistCollection } from '../../output-targets/output-utils';

/**
 * Validate and return DIST_COLLECTION output targets, ensuring that the `dir`
 * property is set on them.
 *
 * @param config a validated configuration object
 * @param userOutputs an array of output targets
 * @returns an array of validated DIST_COLLECTION output targets
 */
export const validateCollection = (
  config: d.ValidatedConfig,
  userOutputs: d.OutputTarget[]
): d.OutputTargetDistCollection[] => {
  return userOutputs.filter(isOutputTargetDistCollection).map((outputTarget) => {
    return {
      ...outputTarget,
      dir: getAbsolutePath(config, outputTarget.dir || 'dist/collection'),
    };
  });
};

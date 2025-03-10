import type * as d from '../../../declarations';
import { isOutputTargetDocsJson } from '../../output-targets/output-utils';
import { join } from 'path';

export const generateJsonDocs = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  docsData: d.JsonDocs,
  outputTargets: d.OutputTarget[]
) => {
  const jsonOutputTargets = outputTargets.filter(isOutputTargetDocsJson);
  if (jsonOutputTargets.length === 0) {
    return;
  }
  const docsDtsPath = join(config.sys.getCompilerExecutingPath(), '..', '..', 'internal', 'stencil-public-docs.d.ts');
  const docsDts = await compilerCtx.fs.readFile(docsDtsPath);
  const typesContent = `
/**
 * This is an autogenerated file created by the Stencil compiler.
 * DO NOT MODIFY IT MANUALLY
 */
${docsDts}
declare const _default: JsonDocs;
export default _default;
`;

  const json = {
    ...docsData,
    components: docsData.components.map((cmp) => ({
      filePath: cmp.filePath,

      encapsulation: cmp.encapsulation,
      tag: cmp.tag,
      readme: cmp.readme,
      docs: cmp.docs,
      docsTags: cmp.docsTags,
      usage: cmp.usage,
      props: cmp.props,
      methods: cmp.methods,
      events: cmp.events,
      listeners: cmp.listeners,
      styles: cmp.styles,
      slots: cmp.slots,
      parts: cmp.parts,
      dependents: cmp.dependents,
      dependencies: cmp.dependencies,
      dependencyGraph: cmp.dependencyGraph,
      deprecation: cmp.deprecation,
    })),
  };
  const jsonContent = JSON.stringify(json, null, 2);
  await Promise.all(
    jsonOutputTargets.map((jsonOutput) => {
      return writeDocsOutput(compilerCtx, jsonOutput, jsonContent, typesContent);
    })
  );
};

export const writeDocsOutput = async (
  compilerCtx: d.CompilerCtx,
  jsonOutput: d.OutputTargetDocsJson,
  jsonContent: string,
  typesContent: string
) => {
  return Promise.all([
    compilerCtx.fs.writeFile(jsonOutput.file, jsonContent),
    jsonOutput.typesFile ? compilerCtx.fs.writeFile(jsonOutput.typesFile, typesContent) : (Promise.resolve() as any),
  ]);
};

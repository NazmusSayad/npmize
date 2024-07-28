export default {
  name: 'npmize' as Lowercase<string>,
  description: 'A tool to help you publish your package to npm with ease',
  defaultOutDir: './dist',
  tempBuildDir: './.npmize',
  ghWorkflowDir: './.github/workflows',
}

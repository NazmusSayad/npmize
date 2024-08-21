export default {
  name: 'npmize' as Lowercase<string>,
  description: 'A tool to help you publish your package to npm with ease',
  defaultOutDir: './dist',
  tempOutDir: './.npmize',
  ghWorkflowDir: './.github/workflows',
}

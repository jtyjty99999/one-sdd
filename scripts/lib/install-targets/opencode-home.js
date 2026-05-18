const { createInstallTargetAdapter, planSpecifyAwareModuleScaffoldOperations } = require('./helpers');

module.exports = createInstallTargetAdapter({
  id: 'opencode-home',
  target: 'opencode',
  kind: 'home',
  rootSegments: ['.opencode'],
  installStatePathSegments: ['ecc-install-state.json'],
  nativeRootRelativePath: '.opencode',
  planOperations(input, adapter) {
    return planSpecifyAwareModuleScaffoldOperations(input, adapter);
  },
});

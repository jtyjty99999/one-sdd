const { createInstallTargetAdapter, planSpecifyAwareModuleScaffoldOperations } = require('./helpers');

module.exports = createInstallTargetAdapter({
  id: 'claude-home',
  target: 'claude',
  kind: 'home',
  rootSegments: ['.claude'],
  installStatePathSegments: ['ecc', 'install-state.json'],
  nativeRootRelativePath: '.claude-plugin',
  planOperations(input, adapter) {
    return planSpecifyAwareModuleScaffoldOperations(input, adapter);
  },
});

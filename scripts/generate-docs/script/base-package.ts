import { Package } from 'dgeni';
import { BEFORE_HANDLE, AFTER_HANDLE } from './const/run-time';
export const BasePackage = new Package('base-package', [
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/typescript'),
])
  .processor({ name: BEFORE_HANDLE, $runBefore: ['docs-processed'], $process: function () {} })
  .processor({
    name: AFTER_HANDLE,
    $runBefore: ['docs-processed'],
    $runAfter: [BEFORE_HANDLE],
    $process: function () {},
  });

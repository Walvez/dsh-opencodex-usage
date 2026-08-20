import assert from 'node:assert/strict';
import * as hostMod from '../lib/index.js';

console.log('--- Running smoke tests for dsh-opencodex-usage ---');

// 1. 验证 Host 导出
assert.equal(typeof hostMod.apply, 'function', 'host module should export apply function');
assert.equal(hostMod.name, 'dsh-opencodex-usage', 'host module name should match');
assert.deepEqual(hostMod.inject, ['webServer'], 'host module inject should contain webServer');

// 2. 验证路由注册逻辑
const routes = [];
const fakeCtx = {
  webServer: {
    register: (r) => {
      routes.push(r);
      return () => {};
    },
  },
  effect: (fn) => fn(),
};

hostMod.apply(fakeCtx);
assert.equal(routes.length, 2, 'should register 2 routes (/stats and /health)');
assert.ok(routes.some(r => r.path === '/api/dsh-opencodex/stats'), 'should have stats route');
assert.ok(routes.some(r => r.path === '/api/dsh-opencodex/health'), 'should have health route');

console.log('✅ All smoke tests passed successfully!');

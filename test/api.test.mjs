import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import {
  BicycleWheelSVG,
  HubSVGGenerator,
  WheelFaceSVGGenerator,
  WheelSideSVGGenerator,
  calculateSpokeLength,
  calculateWheelBuild,
  lacingMap,
  renderHubFaceSvg,
  renderHubSideSvg,
  renderWheelFaceSvg,
  renderWheelSideSvg,
  renderWheelSvg
} from '../src/index.js';

describe('public API', () => {
  test('exports facade, render functions, classes, and math helpers', () => {
    assert.equal(typeof BicycleWheelSVG, 'function');
    assert.equal(typeof HubSVGGenerator, 'function');
    assert.equal(typeof WheelFaceSVGGenerator, 'function');
    assert.equal(typeof WheelSideSVGGenerator, 'function');
    assert.equal(typeof renderWheelSvg, 'function');
    assert.equal(typeof renderWheelFaceSvg, 'function');
    assert.equal(typeof renderWheelSideSvg, 'function');
    assert.equal(typeof renderHubFaceSvg, 'function');
    assert.equal(typeof renderHubSideSvg, 'function');
    assert.equal(typeof calculateSpokeLength, 'function');
    assert.equal(typeof calculateWheelBuild, 'function');
    assert.equal(typeof lacingMap, 'function');
  });

  test('facade renders every view as SVG strings', () => {
    const generator = new BicycleWheelSVG();

    assert.match(generator.wheel(), /^<svg /);
    assert.match(generator.wheelFace({ view: { wheelFaceSide: 'right' } }), /^<svg /);
    assert.match(generator.wheelSide(), /^<svg /);
    assert.match(generator.hubFace(), /^<svg /);
    assert.match(generator.hubSide(), /^<svg /);
    assert.equal(generator.spokeBuild().roundedLeft, 291.6);
  });

  test('CommonJS bundle can be required', () => {
    const require = createRequire(import.meta.url);
    const api = require('../dist/index.cjs');

    assert.equal(typeof api.renderWheelFaceSvg, 'function');
    assert.match(api.renderHubSideSvg(), /^<svg /);
  });

  test('runtime source avoids Node and DOM globals', async () => {
    const files = [
      'src/index.js',
      'src/math.js',
      'src/paths.js',
      'src/svg.js',
      'src/wheelFaceSvgGenerator.js',
      'src/wheelSideSvgGenerator.js',
      'src/hubSvgGenerator.js'
    ];
    const forbidden = /(?:from ['"]node:|require\(|module\.exports|process\.|document\.|window\.)/;

    await Promise.all(files.map(async (file) => {
      const content = await readFile(file, 'utf8');
      assert.equal(forbidden.test(content), false, `${file} includes a forbidden runtime global`);
    }));
  });

  test('generated examples include expected visualizer groups', async () => {
    const face = await readFile('examples/svg/wheel-rear-drive-hg.svg', 'utf8');
    const side = await readFile('examples/svg/wheel-side-projection.svg', 'utf8');
    const hub = await readFile('examples/svg/hub-face-centerlock.svg', 'utf8');

    assert.match(face, /hub-cylinder-freehub/);
    assert.match(face, /wheel-front-spokes/);
    assert.match(side, /hub-side-group/);
    assert.match(hub, /hub-brake-mount/);
  });
});

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
  renderHubFaceSvg,
  renderHubSideSvg,
  renderWheelFaceSvg,
  renderWheelSideSvg,
  renderWheelSvg,
  stylePresets
} from '../src/index.js';

describe('public API', () => {
  test('exports facade, classes, functions, and presets', () => {
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
    assert.ok(stylePresets.technical);
    assert.ok(stylePresets.debug);
  });

  test('facade renders every view as SVG strings', () => {
    const generator = new BicycleWheelSVG();

    assert.match(generator.wheel({ style: 'technical' }), /^<svg /);
    assert.match(generator.wheelFace({ style: 'blueprint' }), /^<svg /);
    assert.match(generator.wheelSide({ style: 'technical' }), /^<svg /);
    assert.match(generator.hubFace({ style: 'debug' }), /^<svg /);
    assert.match(generator.hubSide({ style: 'productPreview' }), /^<svg /);
    assert.equal(generator.spokeBuild().roundedLeft, 292.3);
  });

  test('drive and non-drive filters alter visible spoke classes', () => {
    const leftOnly = renderWheelFaceSvg({ view: 'left' });
    const rightOnly = renderWheelFaceSvg({ view: 'right' });

    assert.match(leftOnly, /wheel-spoke left pulling"/);
    assert.match(leftOnly, /wheel-spoke right pulling muted"/);
    assert.match(rightOnly, /wheel-spoke right pulling"/);
    assert.match(rightOnly, /wheel-spoke left pulling muted"/);
  });

  test('optional cassette mode works without drivetrain dependency', () => {
    const placeholder = renderWheelFaceSvg({ cassette: { enabled: true } });
    const rendered = renderWheelFaceSvg({
      cassette: {
        enabled: true,
        renderer: ({ cogs }) => `<svg viewBox="0 0 10 10"><text>${cogs.length}</text></svg>`
      }
    });

    assert.match(placeholder, /wheel-cassette-placeholder/);
    assert.match(rendered, /wheel-cassette-slot/);
    assert.match(rendered, />12<\/text>/);
  });

  test('CommonJS bundle can be required', () => {
    const require = createRequire(import.meta.url);
    const api = require('../dist/index.cjs');

    assert.equal(typeof api.renderWheelFaceSvg, 'function');
    assert.match(api.renderHubSideSvg({ style: 'technical' }), /^<svg /);
  });

  test('runtime source avoids Node and DOM globals', async () => {
    const files = [
      'src/index.js',
      'src/math.js',
      'src/presets.js',
      'src/svg.js',
      'src/wheelGeometry.js',
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

  test('sample SVG files are present and include expected groups', async () => {
    const wheel = await readFile('examples/svg/wheel-32h-3x-both.svg', 'utf8');
    const cassette = await readFile('examples/svg/wheel-rear-drive-cassette.svg', 'utf8');
    const hub = await readFile('examples/svg/hub-side.svg', 'utf8');

    assert.match(wheel, /wheel-spokes-group/);
    assert.match(wheel, /wheel-valve-group/);
    assert.match(cassette, /wheel-cassette-slot/);
    assert.match(hub, /OLD 142\.0mm/);
  });
});

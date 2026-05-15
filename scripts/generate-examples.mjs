import { mkdir, writeFile } from 'node:fs/promises';
import { renderHubFaceSvg, renderHubSideSvg, renderWheelFaceSvg, renderWheelSideSvg } from '../src/index.js';

await mkdir('examples/svg', { recursive: true });

const rearWheel = {
  wheel: { erd: 601, outerDiameter: 622, rimDepth: 28, rimWidth: 25, spokeCount: 32 },
  hub: {
    old: 142,
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3,
    spokeHoleDia: 2.6,
    shellDiameter: 36
  },
  lacing: { leftCross: 3, rightCross: 3 }
};

const frontRadial = {
  wheel: { erd: 600, outerDiameter: 622, rimDepth: 32, rimWidth: 27, spokeCount: 24 },
  hub: {
    old: 100,
    leftFlangeDia: 42,
    rightFlangeDia: 42,
    leftFlangeCenter: 34,
    rightFlangeCenter: 34,
    spokeHoleDia: 2.6,
    shellDiameter: 30
  },
  lacing: { leftCross: 0, rightCross: 0, leftPattern: 'radial', rightPattern: 'radial' }
};

const fakeCassetteRenderer = ({ cogs }) => {
  const rings = cogs.slice().reverse().map((cog, index) => {
    const r = 26 + (index * 5.5);
    return `<circle cx="160" cy="160" r="${r}" fill="none" stroke="#64748b" stroke-width="3" opacity=".55"><title>${cog}T</title></circle>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">${rings}</svg>`;
};

const examples = {
  'wheel-32h-3x-both.svg': renderWheelFaceSvg({ ...rearWheel, view: 'both', style: 'technical' }),
  'wheel-rear-drive-cassette.svg': renderWheelFaceSvg({
    ...rearWheel,
    view: 'right',
    style: 'productPreview',
    cassette: { enabled: true, renderer: fakeCassetteRenderer }
  }),
  'wheel-front-radial.svg': renderWheelFaceSvg({ ...frontRadial, view: 'both', style: 'blueprint' }),
  'wheel-side-profile.svg': renderWheelSideSvg({ ...rearWheel, style: 'technical' }),
  'hub-face.svg': renderHubFaceSvg({ ...rearWheel, style: 'debug' }),
  'hub-side.svg': renderHubSideSvg({ ...rearWheel, style: 'technical' })
};

await Promise.all(Object.entries(examples).map(([file, svg]) => writeFile(`examples/svg/${file}`, `${svg}\n`, 'utf8')));

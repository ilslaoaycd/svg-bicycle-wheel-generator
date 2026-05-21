import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { renderHubFaceSvg, renderHubSideSvg, renderWheelFaceSvg, renderWheelSideSvg } from '../src/index.js';

const execFileAsync = promisify(execFile);

await mkdir('examples/svg', { recursive: true });
await mkdir('examples/png', { recursive: true });

const rearWheel = {
  wheel: { outerDia: 634, erd: 601, rimWidth: 25, rimOffset: 0, spokeCount: 32, valveType: 'presta' },
  hub: {
    hubPosition: 'rear',
    brakeType: '6bolt',
    hubType: 'jbend',
    showHubHoles: 'visible',
    leftFlangeDia: 58,
    rightFlangeDia: 52,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.3
  },
  lacing: { crossPattern: 3 },
  style: { spokeColor: 'color', nippleStyle: 'nipples', nippleColor: 'silver', spokeLayering: '3d' }
};

const frontRadial = {
  wheel: { outerDia: 596, erd: 560, rimWidth: 30, rimOffset: 0, spokeCount: 24, valveType: 'schrader' },
  hub: {
    hubPosition: 'front',
    brakeType: 'centerlock',
    hubType: 'straightpull',
    showHubHoles: 'hidden',
    leftFlangeDia: 42,
    rightFlangeDia: 42,
    leftFlangeCenter: 34,
    rightFlangeCenter: 34
  },
  lacing: { crossPattern: 0 },
  style: { spokeColor: 'silver', nippleStyle: 'nipples', nippleColor: 'black', spokeLayering: '3d' }
};

const examples = {
  'wheel-rear-left-3x.svg': renderWheelFaceSvg({ ...rearWheel, view: { wheelFaceSide: 'left' } }),
  'wheel-rear-drive-hg.svg': renderWheelFaceSvg({ ...rearWheel, view: { wheelFaceSide: 'right' } }),
  'wheel-front-straightpull.svg': renderWheelFaceSvg({ ...frontRadial, view: { wheelFaceSide: 'left' } }),
  'wheel-side-projection.svg': renderWheelSideSvg(rearWheel),
  'wheel-side-cross-section.svg': renderWheelSideSvg({ ...rearWheel, style: { ...rearWheel.style, spokeLayering: 'flat' } }),
  'hub-face-centerlock.svg': renderHubFaceSvg({ ...frontRadial, view: { hubFaceSide: 'left' } }),
  'hub-side-rear.svg': renderHubSideSvg(rearWheel)
};

await Promise.all(Object.entries(examples).map(([file, svg]) => writeFile(`examples/svg/${file}`, `${svg}\n`, 'utf8')));

const realisticHubSamples = [
  {
    slug: 'dt-swiss-350-mtb-boost-rear-6bolt',
    title: 'DT Swiss 350 MTB Boost Rear 6-Bolt',
    source: 'DT Swiss MTB 350 product page and Velodrop DT Swiss MTB Classic dimensions',
    reference: 'https://www.dtswiss.com/en/components/hubs-and-rws/hubs-mtb/350',
    notes: 'Smooth tapered shell, compact 6-bolt brake shoulder, asymmetric 60/50.5 mm flanges, and 148 mm Boost spacing.'
  },
  {
    slug: 'dt-swiss-240-exp-boost-rear-centerlock',
    title: 'DT Swiss 240 EXP Boost Rear Center Lock',
    source: 'DT Swiss 240 product page and Velodrop DT Swiss MTB Classic dimensions',
    reference: 'https://www.dtswiss.com/en/components/hubs-and-rws/hubs-road/240',
    notes: 'Slimmer DT Swiss shell, equal 50.4 mm centerlock flanges, short centerlock spline stack, and visible bearing rings.'
  },
  {
    slug: 'industry-nine-hydra2-boost-rear-6bolt',
    title: 'Industry Nine Hydra2 Classic 12x148 Rear 6-Bolt',
    source: 'Industry Nine official Hydra2 28h rear 12x148 6-bolt XD drawing',
    reference: 'https://industrynine.com/documents/hydra2-classic-28h-rear-12x148-6b-xd.pdf',
    notes: 'Larger 59.5/62 mm flanges, scalloped flange pockets, fluted shell cues, and six-bolt hardware.'
  },
  {
    slug: 'industry-nine-solix-road-rear-centerlock',
    title: 'Industry Nine Solix CL Road Rear',
    source: 'Industry Nine Solix CL product page and Modern Bike wheelbuilding dimensions',
    reference: 'https://industrynine.com/hubs/road_disc/solix-cl-rear/',
    notes: 'Road centerlock profile with scalloped flanges, smaller left flange, tall drive-side flange, and compact 142 mm spacing.'
  }
];

const hubExampleEntries = [];
const visualizerSamples = [];
for (const sample of realisticHubSamples) {
  const config = {
    wheel: { spokeCount: sample.slug.includes('hydra2') ? 28 : sample.slug.includes('solix') ? 28 : 32 },
    hub: { preset: sample.slug },
    lacing: { crossPattern: sample.slug.includes('solix') ? 2 : 3 },
    style: { hubRenderStyle: 'blueprint' }
  };
  const realisticConfig = { ...config, style: { hubRenderStyle: 'realistic' } };
  hubExampleEntries.push([`hub-${sample.slug}-side.svg`, renderHubSideSvg(config)]);
  hubExampleEntries.push([`hub-${sample.slug}-realistic-side.svg`, renderHubSideSvg(realisticConfig)]);
  hubExampleEntries.push([`hub-${sample.slug}-face-left.svg`, renderHubFaceSvg({ ...config, view: { hubFaceSide: 'left' } })]);
  hubExampleEntries.push([`hub-${sample.slug}-face-right.svg`, renderHubFaceSvg({ ...config, view: { hubFaceSide: 'right' } })]);
  hubExampleEntries.push([`hub-${sample.slug}-realistic-face-left.svg`, renderHubFaceSvg({ ...realisticConfig, view: { hubFaceSide: 'left' } })]);
  hubExampleEntries.push([`hub-${sample.slug}-realistic-face-right.svg`, renderHubFaceSvg({ ...realisticConfig, view: { hubFaceSide: 'right' } })]);
  visualizerSamples.push({ ...sample, config, realisticConfig });
}

await Promise.all(hubExampleEntries.map(([file, svg]) => writeFile(`examples/svg/${file}`, `${svg}\n`, 'utf8')));

async function renderPng(svgFile) {
  const pngFile = svgFile.replace(/^examples\/svg\//, 'examples/png/').replace(/\.svg$/, '.png');
  await execFileAsync('magick', ['-background', 'white', '-density', '192', svgFile, '-resize', '800x600', pngFile]);
}

await Promise.all(Object.keys(examples).map((file) => renderPng(`examples/svg/${file}`)));

await Promise.all(hubExampleEntries.map(([file]) => renderPng(`examples/svg/${file}`)));

await execFileAsync('magick', [
  'montage',
  ...realisticHubSamples.map((sample) => `examples/png/hub-${sample.slug}-side.png`),
  '-tile',
  '2x2',
  '-geometry',
  '800x600+12+12',
  '-background',
  'white',
  'examples/png/hub-blueprint-side-contact-sheet.png'
]);

await execFileAsync('magick', [
  'montage',
  ...realisticHubSamples.map((sample) => `examples/png/hub-${sample.slug}-realistic-side.png`),
  '-tile',
  '2x2',
  '-geometry',
  '800x600+12+12',
  '-background',
  'white',
  'examples/png/hub-realistic-side-contact-sheet.png'
]);

function innerHubSvg(svg) {
  const match = svg.match(/<svg[^>]*>(?:<style>[\s\S]*?<\/style>)?([\s\S]*)<\/svg>/);
  return match ? match[1] : svg;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const visualizerProfiles = [
  {
    title: 'Rear - DT Swiss 240 EXP Centerlock',
    old: 148,
    svg: renderHubSideSvg(visualizerSamples[1].realisticConfig)
  },
  {
    title: 'Rear - Industry Nine Hydra2 6-Bolt',
    old: 148,
    svg: renderHubSideSvg(visualizerSamples[2].realisticConfig)
  },
  {
    title: 'Front - MTB Boost 6-Bolt',
    old: 110,
    svg: renderHubSideSvg({
      wheel: { spokeCount: 32 },
      hub: {
        hubPosition: 'front',
        brakeType: '6bolt',
        hubType: 'jbend',
        builtInDimension: 110,
        leftFlangeDia: 58,
        rightFlangeDia: 45,
        leftFlangeCenter: 31,
        rightFlangeCenter: 33,
        spokeHoleDia: 2.6,
        brandStyle: 'generic',
        shellStyle: 'smooth-taper',
        shellWaistDia: 22,
        shellBodyDia: 30,
        flangeThickness: 4,
        endcapLength: 8,
        endcapDia: 19,
        freehubLength: 0,
        freehubDia: 0,
        brakeMountWidth: 5,
        brakeMountDia: 44,
        flangeCutoutStyle: 'lightening-slots'
      },
      style: { hubRenderStyle: 'realistic' }
    })
  },
  {
    title: 'Front - Classic Road Rim Brake',
    old: 100,
    svg: renderHubSideSvg({
      wheel: { spokeCount: 28 },
      hub: {
        hubPosition: 'front',
        brakeType: 'rim',
        hubType: 'jbend',
        builtInDimension: 100,
        leftFlangeDia: 46,
        rightFlangeDia: 46,
        leftFlangeCenter: 34,
        rightFlangeCenter: 34,
        spokeHoleDia: 2.5,
        brandStyle: 'generic',
        shellStyle: 'smooth-taper',
        shellWaistDia: 18,
        shellBodyDia: 24,
        flangeThickness: 3.5,
        endcapLength: 8,
        endcapDia: 16,
        freehubLength: 0,
        freehubDia: 0,
        brakeMountWidth: 0,
        brakeMountDia: 0,
        flangeCutoutStyle: 'none'
      },
      style: { hubRenderStyle: 'realistic' }
    })
  }
];

const cards = visualizerProfiles.map((profile, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const x = 60 + (col * 570);
  const y = 70 + (row * 330);
  return `
    <g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="510" height="285" fill="#fff" stroke="#d1d5db" stroke-width="1.2" rx="10"/>
      <text x="255" y="34" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#374151">${escapeXml(profile.title)}</text>
      <g transform="translate(100 54) scale(1.55)">
        ${innerHubSvg(profile.svg)}
      </g>
      <g opacity="0.42" font-family="system-ui, sans-serif" font-size="13" fill="#111">
        <line x1="115" y1="258" x2="395" y2="258" stroke="#111" stroke-width="1" stroke-dasharray="5 5"/>
        <line x1="115" y1="249" x2="115" y2="267" stroke="#111" stroke-width="1"/>
        <line x1="395" y1="249" x2="395" y2="267" stroke="#111" stroke-width="1"/>
        <text x="255" y="252" text-anchor="middle">O.L.D. ${profile.old}mm</text>
      </g>
    </g>
  `;
}).join('');

const appearanceVisualizer = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="735" viewBox="0 0 1200 735">
  <defs>
    <pattern id="draft-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#e5e7eb"/>
    </pattern>
  </defs>
  <rect width="1200" height="735" fill="#f3f4f6"/>
  <rect width="1200" height="735" fill="url(#draft-grid)"/>
  <text x="600" y="36" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#1f2937">Realistic Hub Appearance Visualizer</text>
  ${cards}
</svg>`;

await writeFile('examples/svg/hub-appearance-visualizer.svg', `${appearanceVisualizer}\n`, 'utf8');
await renderPng('examples/svg/hub-appearance-visualizer.svg');

const reportRows = realisticHubSamples.map((sample) => {
  const side = `svg/hub-${sample.slug}-side.svg`;
  const png = `png/hub-${sample.slug}-side.png`;
  const realisticSide = `svg/hub-${sample.slug}-realistic-side.svg`;
  const realisticPng = `png/hub-${sample.slug}-realistic-side.png`;
  return `| ${sample.title} | ${sample.source} | [Blueprint SVG](${side}) / [Blueprint PNG](${png}) / [Realistic SVG](${realisticSide}) / [Realistic PNG](${realisticPng}) | ${sample.notes} |`;
}).join('\n');

const report = `# Hub Blueprint Comparison

Generated hub samples compare the SVG model against manufacturer product pages, official engineering drawings, and reputable wheelbuilding dimension tables. Product images are referenced as feedback sources rather than copied into this repository.

Side-view QA contact sheets: [Blueprint PNG](png/hub-blueprint-side-contact-sheet.png) / [Realistic PNG](png/hub-realistic-side-contact-sheet.png)

Static visualizer: [SVG](svg/hub-appearance-visualizer.svg) / [PNG](png/hub-appearance-visualizer.png)

| Hub | Source basis | Generated side sample | Visual feedback applied |
| --- | --- | --- | --- |
${reportRows}

## Source Links

- DT Swiss 350 MTB: https://www.dtswiss.com/en/components/hubs-and-rws/hubs-mtb/350
- DT Swiss 240: https://www.dtswiss.com/en/components/hubs-and-rws/hubs-road/240
- DT Swiss wheelbuilding dimensions: https://velodrop.com/resources/hubs/dt-swiss-mtb-classic-hub-dimensions/
- Industry Nine Hydra2 drawing: https://industrynine.com/documents/hydra2-classic-28h-rear-12x148-6b-xd.pdf
- Industry Nine Solix CL: https://industrynine.com/hubs/road_disc/solix-cl-rear/
- Industry Nine Solix dimensions fill-in: https://www.modernbike.com/405682

## Model Notes

- DT Swiss presets bias toward smooth, tapered shell surfaces with restrained lightening-slot cues.
- Industry Nine presets bias toward scalloped flanges and shell fluting because those are strong visual identifiers in engineering drawings and product references.
- The second-pass side renderer uses smooth hubshell profiles, stepped endcaps, serrated centerlock stacks, six-bolt boss rings, and lengthwise freehub splines.
- The output remains blueprint-like: dimensionally suggestive, cleanly stroked, and source-driven rather than photorealistic.
`;

await writeFile('examples/hub-comparison.md', report, 'utf8');

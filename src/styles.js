const BASE_PALETTE = {
  svgBackground: '#ffffff',
  rimFaceFill: '#343a40',
  rimSideFill: '#343a40',
  rimStroke: '#212529',
  rimOutlineStroke: '#111111',
  rimHighlightStroke: 'rgba(255,255,255,.15)',
  rimHoleFill: '#111111',
  rimHoleStroke: '#343a40',
  valveFill: '#ffffff',
  valveStroke: '#111111',
  valveLabelFill: '#495057',
  spokeLeftPulling: '#111111',
  spokeLeftTrailing: '#111111',
  spokeRightPulling: '#111111',
  spokeRightTrailing: '#111111',
  spokeBlack: '#111111',
  spokeSilver: '#ced4da',
  nippleSilver: '#111111',
  nippleBlack: '#111111',
  nippleDotFill: '#ffffff',
  nippleDotStroke: '#111111',
  hubAxleFill: '#ffffff',
  hubAxleStroke: '#111111',
  hubEndcapFill: '#ffffff',
  hubEndcapStroke: '#111111',
  hubShellFill: '#ffffff',
  hubShellStroke: '#111111',
  hubShellDtSwissFill: '#ffffff',
  hubShellIndustryNineFill: '#ffffff',
  hubFlangeLeftFill: '#ffffff',
  hubFlangeLeftStroke: '#111111',
  hubFlangeRightFill: '#ffffff',
  hubFlangeRightStroke: '#111111',
  hubMountFill: '#ffffff',
  hubMountStroke: '#111111',
  hubFreehubFill: '#ffffff',
  hubFreehubStroke: '#111111',
  hubBearingFill: '#ffffff',
  hubBearingStroke: '#111111',
  hubCutoutFill: '#ffffff',
  hubCutoutStroke: '#111111',
  hubHoleFill: '#111111',
  hubDetailStroke: '#111111',
  hubBlueprintStroke: '#111111',
  hubFluteStroke: '#111111',
  hubHighlightStroke: '#111111'
};

export const STYLE_PRESETS = {
  drawing: {
    name: 'Drawing',
    hubRenderStyle: 'blueprint',
    wheel: { valveType: 'presta' },
    hub: { showHubHoles: 'hidden' },
    style: {
      spokeColor: 'black',
      nippleStyle: 'nipples',
      nippleColor: 'black',
      spokeLayering: '3d'
    },
    palette: {
      ...BASE_PALETTE,
      rimFaceFill: '#e9ecef',
      rimSideFill: '#ffffff',
      rimStroke: '#111111',
      spokeBlack: '#111111',
      nippleBlack: '#111111',
      nippleSilver: '#111111',
      hubBlueprintStroke: '#6b7280'
    }
  },
  technical: {
    name: 'Technical',
    hubRenderStyle: 'blueprint',
    wheel: { valveType: 'presta' },
    hub: { showHubHoles: 'visible' },
    style: {
      spokeColor: 'color',
      nippleStyle: 'dots',
      nippleColor: 'black',
      spokeLayering: '3d'
    },
    palette: {
      ...BASE_PALETTE,
      rimFaceFill: '#111111',
      rimSideFill: '#111111',
      rimStroke: '#111111',
      spokeLeftPulling: '#0d6efd',
      spokeLeftTrailing: '#0dcaf0',
      spokeRightPulling: '#fd7e14',
      spokeRightTrailing: '#ffc107',
      nippleDotFill: '#ffffff',
      nippleDotStroke: '#111111',
      hubFlangeLeftFill: '#e7f1ff',
      hubFlangeLeftStroke: '#0d6efd',
      hubFlangeRightFill: '#fff3cd',
      hubFlangeRightStroke: '#fd7e14',
      hubHoleFill: '#111111',
      hubBlueprintStroke: '#8aa8c2'
    }
  },
  realistic: {
    name: 'Realistic',
    hubRenderStyle: 'realistic',
    wheel: { valveType: 'presta' },
    hub: { showHubHoles: 'hidden' },
    style: {
      spokeColor: 'black',
      nippleStyle: 'nipples',
      nippleColor: 'black',
      spokeLayering: '3d'
    },
    palette: {
      ...BASE_PALETTE,
      svgBackground: '#ffffff',
      rimFaceFill: '#222529',
      rimSideFill: '#222529',
      rimStroke: '#111111',
      rimOutlineStroke: '#111111',
      rimHighlightStroke: 'rgba(255,255,255,.18)',
      rimHoleFill: '#101214',
      rimHoleStroke: '#101214',
      valveFill: '#2f3438',
      valveStroke: '#111111',
      spokeBlack: '#111111',
      nippleBlack: '#111111',
      nippleSilver: '#111111',
      hubAxleFill: '#d9dcde',
      hubAxleStroke: '#222222',
      hubEndcapFill: '#7d848a',
      hubEndcapStroke: '#25282b',
      hubShellFill: '#bfc4c8',
      hubShellStroke: '#3c4145',
      hubShellDtSwissFill: '#c9ced2',
      hubShellIndustryNineFill: '#b5bcc1',
      hubFlangeLeftFill: '#d2d6d9',
      hubFlangeLeftStroke: '#3c4145',
      hubFlangeRightFill: '#aeb5ba',
      hubFlangeRightStroke: '#3c4145',
      hubMountFill: '#969da3',
      hubMountStroke: '#2c3033',
      hubFreehubFill: '#c8ccd0',
      hubFreehubStroke: '#3c4145',
      hubBearingFill: '#6f767c',
      hubBearingStroke: '#2c3033',
      hubCutoutFill: '#f1f2f3',
      hubCutoutStroke: '#3c4145',
      hubHoleFill: '#111111',
      hubDetailStroke: '#24272a',
      hubBlueprintStroke: '#24272a',
      hubFluteStroke: '#6d747a',
      hubHighlightStroke: '#eceff1'
    }
  },
  light: {
    name: 'Light',
    hubRenderStyle: 'realistic',
    wheel: { valveType: 'presta' },
    hub: { showHubHoles: 'hidden' },
    style: {
      spokeColor: 'silver',
      nippleStyle: 'nipples',
      nippleColor: 'silver',
      spokeLayering: '3d'
    },
    palette: {
      ...BASE_PALETTE,
      svgBackground: '#0b0f14',
      rimFaceFill: '#d9e2ea',
      rimSideFill: '#d9e2ea',
      rimStroke: '#f8fafc',
      rimOutlineStroke: '#f8fafc',
      rimHighlightStroke: 'rgba(255,255,255,.42)',
      rimHoleFill: '#f8fafc',
      rimHoleStroke: '#d9e2ea',
      valveFill: '#f8fafc',
      valveStroke: '#e5eef7',
      spokeSilver: '#edf4fb',
      nippleSilver: '#f8fafc',
      hubAxleFill: '#fbfdff',
      hubAxleStroke: '#d9e2ea',
      hubEndcapFill: '#d7e0e8',
      hubEndcapStroke: '#f8fafc',
      hubShellFill: '#eef4fa',
      hubShellStroke: '#d6e1ea',
      hubShellDtSwissFill: '#f5f9fc',
      hubShellIndustryNineFill: '#e7f0f7',
      hubFlangeLeftFill: '#f6fbff',
      hubFlangeLeftStroke: '#d6e1ea',
      hubFlangeRightFill: '#dce7ef',
      hubFlangeRightStroke: '#d6e1ea',
      hubMountFill: '#d5dee7',
      hubMountStroke: '#f8fafc',
      hubFreehubFill: '#eef4fa',
      hubFreehubStroke: '#d6e1ea',
      hubBearingFill: '#c8d4de',
      hubBearingStroke: '#f8fafc',
      hubCutoutFill: '#0b0f14',
      hubCutoutStroke: '#d6e1ea',
      hubHoleFill: '#f8fafc',
      hubDetailStroke: '#f8fafc',
      hubBlueprintStroke: '#c7d7e5',
      hubFluteStroke: '#d6e1ea',
      hubHighlightStroke: '#ffffff'
    }
  }
};

const TOKEN_TO_VAR = Object.fromEntries(Object.keys(BASE_PALETTE).map((key) => [
  key,
  `--wheel-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
]));

function compact(object) {
  return Object.fromEntries(Object.entries(object || {}).filter(([, value]) => value !== undefined));
}

export function defineStylePreset(name, preset = {}) {
  return {
    name,
    ...preset,
    palette: {
      ...(STYLE_PRESETS[preset.extends]?.palette || {}),
      ...(preset.palette || {})
    }
  };
}

export function resolveStyleOptions(style = {}) {
  const themeName = style.theme || style.hubRenderStyle || 'drawing';
  const preset = STYLE_PRESETS[themeName] || STYLE_PRESETS.drawing;
  const presetStyle = preset.style || {};
  const hubRenderStyle = style.hubRenderStyle || preset.hubRenderStyle || 'blueprint';

  return {
    ...presetStyle,
    ...style,
    theme: themeName,
    hubRenderStyle,
    paintMode: style.paintMode || presetStyle.paintMode || 'hybrid',
    palette: {
      ...BASE_PALETTE,
      ...compact(preset.palette),
      ...compact(style.palette)
    }
  };
}

export function stylePresetOptions(style = {}) {
  const themeName = style.theme || style.hubRenderStyle || 'drawing';
  const preset = STYLE_PRESETS[themeName] || STYLE_PRESETS.drawing;
  return {
    wheel: preset.wheel || {},
    hub: preset.hub || {},
    style: preset.style || {}
  };
}

function cssVar(token, fallback) {
  return `var(${TOKEN_TO_VAR[token]}, ${fallback})`;
}

export function paintValue(style, token) {
  const resolved = resolveStyleOptions(style);
  const value = resolved.palette[token] || BASE_PALETTE[token];
  if (resolved.paintMode === 'css') return undefined;
  if (resolved.paintMode === 'inline') return value;
  return cssVar(token, value);
}

export function paintAttrs(style, map) {
  return Object.fromEntries(Object.entries(map).flatMap(([attribute, token]) => {
    const value = paintValue(style, token);
    return value === undefined ? [] : [[attribute, value]];
  }));
}

export function hubPaintStyles(style = {}) {
  const line = {
    ...paintAttrs(style, { stroke: 'hubBlueprintStroke' }),
    fill: 'none',
    'stroke-width': 0.7,
    'stroke-dasharray': '3 3'
  };
  const detail = {
    ...paintAttrs(style, { stroke: 'hubDetailStroke' }),
    fill: 'none',
    'stroke-width': 1,
    'stroke-linecap': 'round'
  };

  return {
    axle: { ...paintAttrs(style, { fill: 'hubAxleFill', stroke: 'hubAxleStroke' }), 'stroke-width': 0.8 },
    endcap: { ...paintAttrs(style, { fill: 'hubEndcapFill', stroke: 'hubEndcapStroke' }), 'stroke-width': 1 },
    shell: { ...paintAttrs(style, { fill: 'hubShellFill', stroke: 'hubShellStroke' }), 'stroke-width': 1.2 },
    flangeLeft: { ...paintAttrs(style, { fill: 'hubFlangeLeftFill', stroke: 'hubFlangeLeftStroke' }), 'stroke-width': 1.1 },
    flangeRight: { ...paintAttrs(style, { fill: 'hubFlangeRightFill', stroke: 'hubFlangeRightStroke' }), 'stroke-width': 1.1 },
    mount: { ...paintAttrs(style, { fill: 'hubMountFill', stroke: 'hubMountStroke' }), 'stroke-width': 1 },
    freehub: { ...paintAttrs(style, { fill: 'hubFreehubFill', stroke: 'hubFreehubStroke' }), 'stroke-width': 1 },
    bearing: { ...paintAttrs(style, { fill: 'hubBearingFill', stroke: 'hubBearingStroke' }), 'stroke-width': 1 },
    cutout: { ...paintAttrs(style, { fill: 'hubCutoutFill', stroke: 'hubCutoutStroke' }), 'stroke-width': 0.7 },
    hole: { ...paintAttrs(style, { fill: 'hubHoleFill' }), stroke: 'none' },
    line,
    detail,
    faceReference: line,
    faceBearing: {
      ...paintAttrs(style, { stroke: 'hubAxleStroke' }),
      fill: 'none',
      'stroke-width': 2,
      'stroke-dasharray': '2 2'
    }
  };
}

function rule(selector, declarations) {
  return `${selector}{${Object.entries(declarations)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([property, value]) => `${property}:${value}`)
    .join(';')}}`;
}

function v(token, palette) {
  return cssVar(token, palette[token] || BASE_PALETTE[token]);
}

export function createVisualizerStyle(style = {}) {
  const { palette } = resolveStyleOptions(style);
  return [
    rule('.wheel-svg,.hub-svg', { background: v('svgBackground', palette) }),
    rule('.rim-body', { fill: v('rimSideFill', palette), stroke: v('rimStroke', palette), 'stroke-width': 1, 'fill-rule': 'evenodd' }),
    rule('.rim-outline', { fill: 'none', stroke: v('rimOutlineStroke', palette), 'stroke-width': 1.5 }),
    rule('.rim-highlight', { fill: 'none', stroke: v('rimHighlightStroke', palette), 'stroke-width': 1 }),
    rule('.rim-hole', { fill: v('rimHoleFill', palette), stroke: v('rimHoleStroke', palette), 'stroke-width': 0.5 }),
    rule('.valve-hole-marker', { fill: v('valveFill', palette) }),
    rule('.valve-hole-line', { stroke: v('valveStroke', palette), 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
    rule('.valve-label', { 'font-family': 'sans-serif', 'font-size': '14px', fill: v('valveLabelFill', palette), 'font-weight': 'bold' }),
    rule('.wheel-valve-part', { fill: v('valveFill', palette), stroke: v('valveStroke', palette), 'stroke-width': 1 }),
    rule('.spoke-nipple', { 'stroke-width': 5, 'stroke-linecap': 'butt' }),
    rule('.spoke-nipple-dot', { fill: v('nippleDotFill', palette), stroke: v('nippleDotStroke', palette), 'stroke-width': 1 }),
    rule('.nipple-theme-silver .spoke-nipple', { stroke: v('nippleSilver', palette) }),
    rule('.nipple-theme-black .spoke-nipple', { stroke: v('nippleBlack', palette) }),
    rule('.spoke', { 'stroke-width': 1.5, 'stroke-linecap': 'round' }),
    rule('.spoke-theme-color .spoke-left.spoke-pulling', { stroke: v('spokeLeftPulling', palette) }),
    rule('.spoke-theme-color .spoke-left.spoke-trailing', { stroke: v('spokeLeftTrailing', palette) }),
    rule('.spoke-theme-color .spoke-right.spoke-pulling', { stroke: v('spokeRightPulling', palette), 'stroke-dasharray': '4 4' }),
    rule('.spoke-theme-color .spoke-right.spoke-trailing', { stroke: v('spokeRightTrailing', palette), 'stroke-dasharray': '4 4' }),
    rule('.spoke-theme-black .spoke', { stroke: v('spokeBlack', palette) }),
    rule('.spoke-theme-silver .spoke', { stroke: v('spokeSilver', palette) }),
    rule('.hub-axle,.hub-axle-tip', { fill: v('hubAxleFill', palette), stroke: v('hubAxleStroke', palette), 'stroke-width': 0.8 }),
    rule('.hub-endcap', { fill: v('hubEndcapFill', palette), stroke: v('hubEndcapStroke', palette), 'stroke-width': 1 }),
    rule('.hub-cylinder,.hub-shell-body', { fill: v('hubShellFill', palette), stroke: v('hubShellStroke', palette), 'stroke-width': 1.2, 'fill-rule': 'evenodd' }),
    rule('.hub-brand-dt-swiss .hub-shell-body', { fill: v('hubShellDtSwissFill', palette) }),
    rule('.hub-brand-industry-nine .hub-shell-body', { fill: v('hubShellIndustryNineFill', palette) }),
    rule('.hub-flange-left', { fill: v('hubFlangeLeftFill', palette), stroke: v('hubFlangeLeftStroke', palette), 'stroke-width': 1, 'fill-rule': 'evenodd' }),
    rule('.hub-flange-right', { fill: v('hubFlangeRightFill', palette), stroke: v('hubFlangeRightStroke', palette), 'stroke-width': 1, 'fill-rule': 'evenodd' }),
    rule('.hub-flange-plate', { 'stroke-width': 1.1 }),
    rule('.hub-brake-mount,.hub-centerlock-side,.hub-sixbolt-side', { fill: v('hubMountFill', palette), stroke: v('hubMountStroke', palette), 'stroke-width': 1, 'fill-rule': 'evenodd' }),
    rule('.hub-cylinder-freehub', { fill: v('hubFreehubFill', palette), stroke: v('hubFreehubStroke', palette), 'stroke-width': 1, 'fill-rule': 'evenodd' }),
    rule('.hub-cylinder-dark,.hub-bearing-ring,.hub-freehub-inner-shoulder,.hub-freehub-thread-step', { fill: v('hubBearingFill', palette), stroke: v('hubBearingStroke', palette), 'stroke-width': 1 }),
    rule('.hub-flange-cutout,.hub-flange-scallop', { fill: v('hubCutoutFill', palette), stroke: v('hubCutoutStroke', palette), 'stroke-width': 0.7 }),
    rule('.hub-spoke-hole-side', { fill: v('hubHoleFill', palette), stroke: 'none' }),
    rule('.hub-bolt-head-side', { fill: v('hubCutoutFill', palette), stroke: v('hubDetailStroke', palette), 'stroke-width': 0.6 }),
    rule('.hub-spline-line,.hub-freehub-spline,.hub-centerlock-tooth,.hub-sixbolt-side-line,.hub-freehub-thread-line,.hub-freehub-final-step-line,.hub-straightpull-slot-side', { stroke: v('hubDetailStroke', palette), 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none' }),
    rule('.hub-blueprint-line', { stroke: v('hubBlueprintStroke', palette), 'stroke-width': 0.7, 'stroke-dasharray': '3 3', fill: 'none', opacity: 0.9 }),
    rule('.hub-shell-flute', { stroke: v('hubFluteStroke', palette), 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none' }),
    rule('.hub-shell-highlight', { stroke: v('hubHighlightStroke', palette), 'stroke-width': 1, 'stroke-linecap': 'round' }),
    rule('.hub-centerlock-solid-ring,.hub-freehub-xd-center-ring', { fill: 'none', stroke: v('hubDetailStroke', palette), 'stroke-width': 1 }),
    rule('.hub-centerlock-dashed-ring,.hub-freehub-xd-middle-ring', { fill: 'none', stroke: v('hubDetailStroke', palette), 'stroke-width': 1, 'stroke-dasharray': '1 1' })
  ].join('');
}

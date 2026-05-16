export const DEFAULT_WHEEL = {
  outerDia: 634,
  erd: 601,
  rimWidth: 25,
  rimOffset: 0,
  spokeCount: 32,
  valveType: 'presta'
};

export const DEFAULT_HUB = {
  hubPosition: 'rear',
  brakeType: '6bolt',
  hubType: 'jbend',
  showHubHoles: 'visible',
  leftFlangeDia: 58,
  rightFlangeDia: 52,
  leftFlangeCenter: 36.6,
  rightFlangeCenter: 23.3,
  spokeHoleDia: 2.6
};

export const DEFAULT_LACING = {
  crossPattern: 3
};

export const DEFAULT_VIEW = {
  wheelFaceSide: 'left',
  hubFaceSide: 'left'
};

export const DEFAULT_STYLE = {
  spokeLayering: '3d',
  spokeColor: 'color',
  nippleStyle: 'nipples',
  nippleColor: 'silver'
};

export function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function polar(centerX, centerY, radius, angle) {
  return {
    x: centerX + (radius * Math.cos(angle)),
    y: centerY + (radius * Math.sin(angle)),
    angle
  };
}

export function normalizeOptions(options = {}) {
  const flatWheel = {
    outerDia: options.outerDia,
    erd: options.erd,
    rimWidth: options.rimWidth,
    rimOffset: options.rimOffset,
    spokeCount: options.spokeCount,
    valveType: options.valveType
  };
  const flatHub = {
    hubPosition: options.hubPosition,
    brakeType: options.brakeType,
    hubType: options.hubType,
    showHubHoles: options.showHubHoles,
    leftFlangeDia: options.leftFlangeDia,
    rightFlangeDia: options.rightFlangeDia,
    leftFlangeCenter: options.leftFlangeCenter,
    rightFlangeCenter: options.rightFlangeCenter,
    spokeHoleDia: options.spokeHoleDia
  };
  const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
  const view = typeof options.view === 'string'
    ? { wheelFaceSide: options.view, hubFaceSide: options.view }
    : options.view || {};

  return {
    wheel: { ...DEFAULT_WHEEL, ...compact(flatWheel), ...(options.wheel || {}) },
    hub: { ...DEFAULT_HUB, ...compact(flatHub), ...(options.hub || {}) },
    lacing: { ...DEFAULT_LACING, ...(options.lacing || {}) },
    view: { ...DEFAULT_VIEW, ...view },
    style: { ...DEFAULT_STYLE, ...(typeof options.style === 'object' ? options.style : {}) }
  };
}

export function calculateSpokeLength(params) {
  const theta = (4 * Math.PI * params.crossPattern) / params.spokeCount;
  const erdRadius = params.erd / 2;
  const flangeRadius = params.flangeDia / 2;
  const planarDistance = Math.sqrt(
    (erdRadius ** 2) +
      (flangeRadius ** 2) -
      (2 * erdRadius * flangeRadius * Math.cos(theta))
  );

  return Math.sqrt((planarDistance ** 2) + (params.flangeCenter ** 2)) -
    ((params.spokeHoleDia || 2.6) / 2) +
    (params.lengthAdjustment || 0);
}

export function calculateWheelBuild(options = {}) {
  const config = normalizeOptions(options);
  const { wheel, hub, lacing } = config;
  const left = calculateSpokeLength({
    erd: wheel.erd,
    flangeDia: hub.leftFlangeDia,
    flangeCenter: hub.leftFlangeCenter,
    spokeHoleDia: hub.spokeHoleDia,
    spokeCount: wheel.spokeCount,
    crossPattern: lacing.crossPattern
  });
  const right = calculateSpokeLength({
    erd: wheel.erd,
    flangeDia: hub.rightFlangeDia,
    flangeCenter: hub.rightFlangeCenter,
    spokeHoleDia: hub.spokeHoleDia,
    spokeCount: wheel.spokeCount,
    crossPattern: lacing.crossPattern
  });

  return { left, right, roundedLeft: round(left, 1), roundedRight: round(right, 1) };
}

export function validateWheelBuild(options = {}) {
  const { wheel, hub, lacing } = normalizeOptions(options);
  const warnings = [];
  [
    ['outer diameter', wheel.outerDia],
    ['ERD', wheel.erd],
    ['rim width', wheel.rimWidth],
    ['spoke count', wheel.spokeCount],
    ['left flange diameter', hub.leftFlangeDia],
    ['right flange diameter', hub.rightFlangeDia],
    ['left center-to-flange', hub.leftFlangeCenter],
    ['right center-to-flange', hub.rightFlangeCenter],
    ['cross pattern', lacing.crossPattern]
  ].forEach(([label, value]) => {
    if (!Number.isFinite(value)) warnings.push(`${label} must be a number.`);
  });

  if (Number.isFinite(wheel.spokeCount) && (wheel.spokeCount < 4 || wheel.spokeCount % 2 !== 0)) {
    warnings.push('Spoke count must be an even number of at least 4.');
  }
  if (Number.isFinite(wheel.spokeCount) && lacing.crossPattern >= (wheel.spokeCount / 4)) {
    warnings.push(`${lacing.crossPattern}x is too high for a ${wheel.spokeCount} spoke wheel.`);
  }
  if (wheel.erd >= wheel.outerDia) warnings.push('ERD must be smaller than the outer diameter.');

  return warnings;
}

export function rimHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const radius = layout.radius || (config.wheel.erd / 2);
  const count = config.wheel.spokeCount;
  const step = (2 * Math.PI) / count;
  return Array.from({ length: count }, (_item, index) => {
    const angle = (-Math.PI / 2) + (step / 2) + (index * step);
    return { index, ...polar(center, center, radius, angle) };
  });
}

export function hubHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const spokesPerSide = config.wheel.spokeCount / 2;
  const rimStep = (2 * Math.PI) / config.wheel.spokeCount;
  const hubStep = (2 * Math.PI) / spokesPerSide;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = (safeCross % 2 === 0 && safeCross > 0) ? 2 : 0;
  const hubAngleOffset = patternShift * rimStep;

  return {
    left: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = (-Math.PI / 2) + (rimStep / 2) + (index * hubStep) + hubAngleOffset;
      return { index, ...polar(center, center, config.hub.leftFlangeDia / 2, angle) };
    }),
    right: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = (-Math.PI / 2) + (rimStep / 2) + (index * hubStep) + hubAngleOffset + (hubStep / 2);
      return { index, ...polar(center, center, config.hub.rightFlangeDia / 2, angle) };
    })
  };
}

export function lacingMap(options = {}) {
  const config = normalizeOptions(options);
  const count = config.wheel.spokeCount;
  const spokesPerSide = count / 2;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = (safeCross % 2 === 0 && safeCross > 0) ? 2 : 0;

  function sideMap(side, rimOffset) {
    return Array.from({ length: spokesPerSide }, (_item, index) => {
      const isPulling = index % 2 === 0;
      const rawIndex = safeCross === 0
        ? (index * 2) + rimOffset + patternShift
        : (index * 2) + (isPulling ? safeCross * 2 : -safeCross * 2) + rimOffset + patternShift;
      return {
        side,
        hubIndex: index,
        rimIndex: ((Math.round(rawIndex) % count) + count) % count,
        type: isPulling ? 'pulling' : 'trailing',
        crosses: safeCross,
        patternShift
      };
    });
  }

  return [...sideMap('left', 0), ...sideMap('right', 1)];
}

export const DEFAULT_WHEEL = {
  erd: 601,
  outerDiameter: 622,
  rimDepth: 24,
  rimWidth: 24,
  rimOffset: 0,
  spokeCount: 32,
  valveAngle: -90
};

export const DEFAULT_HUB = {
  old: 100,
  leftFlangeDia: 44,
  rightFlangeDia: 44,
  leftFlangeCenter: 22.4,
  rightFlangeCenter: 35,
  spokeHoleDia: 2.6,
  axleDiameter: 12,
  shellDiameter: 32
};

export const DEFAULT_LACING = {
  leftCross: 3,
  rightCross: 3,
  leftPattern: 'cross',
  rightPattern: 'cross'
};

export function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function polar(centerX, centerY, radius, angle) {
  return {
    x: centerX + (radius * Math.cos(angle)),
    y: centerY + (radius * Math.sin(angle))
  };
}

export function normalizeOptions(options = {}) {
  return {
    ...options,
    wheel: { ...DEFAULT_WHEEL, ...(options.wheel || {}) },
    hub: { ...DEFAULT_HUB, ...(options.hub || {}) },
    lacing: { ...DEFAULT_LACING, ...(options.lacing || {}) },
    view: options.view || 'both',
    style: options.style || 'technical',
    styleConfig: options.styleConfig || {},
    cassette: {
      enabled: false,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 52],
      selectedCog: 18,
      style: 'xrayCassette',
      ...(options.cassette || {})
    }
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
    (params.spokeHoleDia / 2) +
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
    crossPattern: lacing.leftPattern === 'radial' ? 0 : lacing.leftCross,
    lengthAdjustment: options.lengthAdjustment || 0
  });
  const right = calculateSpokeLength({
    erd: wheel.erd,
    flangeDia: hub.rightFlangeDia,
    flangeCenter: hub.rightFlangeCenter,
    spokeHoleDia: hub.spokeHoleDia,
    spokeCount: wheel.spokeCount,
    crossPattern: lacing.rightPattern === 'radial' ? 0 : lacing.rightCross,
    lengthAdjustment: options.lengthAdjustment || 0
  });

  return {
    left,
    right,
    roundedLeft: round(left, 1),
    roundedRight: round(right, 1)
  };
}

export function validateWheelBuild(options = {}) {
  const { wheel, hub, lacing } = normalizeOptions(options);
  const warnings = [];
  const numbers = [
    ['ERD', wheel.erd],
    ['hub OLD', hub.old],
    ['left flange PCD', hub.leftFlangeDia],
    ['right flange PCD', hub.rightFlangeDia],
    ['left center-to-flange', hub.leftFlangeCenter],
    ['right center-to-flange', hub.rightFlangeCenter],
    ['spoke hole diameter', hub.spokeHoleDia],
    ['spoke count', wheel.spokeCount],
    ['left cross pattern', lacing.leftCross],
    ['right cross pattern', lacing.rightCross]
  ];

  numbers.forEach(([label, value]) => {
    if (!Number.isFinite(value)) warnings.push(`${label} must be a number.`);
  });

  if (Number.isFinite(wheel.spokeCount)) {
    if (wheel.spokeCount < 4 || wheel.spokeCount % 2 !== 0) {
      warnings.push('Spoke count must be an even number of at least 4.');
    }
    const spokesPerSide = wheel.spokeCount / 2;
    [['left', lacing.leftCross], ['right', lacing.rightCross]].forEach(([side, crosses]) => {
      if (crosses > 0 && crosses >= spokesPerSide / 2) {
        warnings.push(`${side} ${crosses}x is too high for a ${wheel.spokeCount} spoke wheel.`);
      }
    });
  }

  if (Number.isFinite(wheel.rimOffset) && wheel.rimOffset !== 0) {
    warnings.push('Rim offset is shown in previews but is not compensated in spoke length by default.');
  }

  return warnings;
}

export function rimHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const centerX = layout.centerX || 0;
  const centerY = layout.centerY || 0;
  const radius = layout.radius || config.wheel.erd / 2;
  const offset = layout.offset || 0;
  const count = config.wheel.spokeCount;
  const step = (2 * Math.PI) / count;
  const start = degreesToRadians(config.wheel.valveAngle) + (step / 2);

  return Array.from({ length: count }, (_item, index) => ({
    index,
    angle: start + (index * step),
    ...polar(centerX + offset, centerY, radius, start + (index * step))
  }));
}

export function hubHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const centerX = layout.centerX || 0;
  const centerY = layout.centerY || 0;
  const radiusScale = layout.radiusScale || 1;
  const count = config.wheel.spokeCount / 2;
  const step = (2 * Math.PI) / count;
  const start = degreesToRadians(config.wheel.valveAngle) + ((2 * Math.PI) / config.wheel.spokeCount / 2);
  const leftRadius = (config.hub.leftFlangeDia / 2) * radiusScale;
  const rightRadius = (config.hub.rightFlangeDia / 2) * radiusScale;

  return {
    left: Array.from({ length: count }, (_item, index) => ({
      index,
      angle: start + (index * step),
      ...polar(centerX, centerY, leftRadius, start + (index * step))
    })),
    right: Array.from({ length: count }, (_item, index) => ({
      index,
      angle: start + (step / 2) + (index * step),
      ...polar(centerX, centerY, rightRadius, start + (step / 2) + (index * step))
    }))
  };
}

export function lacingMap(options = {}) {
  const config = normalizeOptions(options);
  const count = config.wheel.spokeCount;
  const spokesPerSide = count / 2;

  function sideMap(side, rimOffset, crosses, pattern) {
    return Array.from({ length: spokesPerSide }, (_item, index) => {
      const isPulling = index % 2 === 0;
      const crossOffset = pattern === 'radial' ? 0 : crosses * 2;
      const rawIndex = pattern === 'radial'
        ? (index * 2) + rimOffset
        : (index * 2) + (isPulling ? crossOffset : -crossOffset) + rimOffset;

      return {
        side,
        hubIndex: index,
        rimIndex: ((Math.round(rawIndex) % count) + count) % count,
        type: isPulling ? 'pulling' : 'trailing',
        crosses: pattern === 'radial' ? 0 : crosses
      };
    });
  }

  return [
    ...sideMap('left', 0, config.lacing.leftCross, config.lacing.leftPattern),
    ...sideMap('right', 1, config.lacing.rightCross, config.lacing.rightPattern)
  ];
}

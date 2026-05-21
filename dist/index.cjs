var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  BicycleWheelSVG: () => BicycleWheelSVG,
  HUB_PRESETS: () => HUB_PRESETS,
  HubSVGGenerator: () => HubSVGGenerator,
  WheelFaceSVGGenerator: () => WheelFaceSVGGenerator,
  WheelSideSVGGenerator: () => WheelSideSVGGenerator,
  calculateSpokeLength: () => calculateSpokeLength,
  calculateWheelBuild: () => calculateWheelBuild,
  default: () => index_default,
  hubHolePositions: () => hubHolePositions,
  lacingMap: () => lacingMap,
  normalizeFreehubType: () => normalizeFreehubType,
  normalizeOptions: () => normalizeOptions,
  renderHubFaceSvg: () => renderHubFaceSvg,
  renderHubSideSvg: () => renderHubSideSvg,
  renderWheelFaceSvg: () => renderWheelFaceSvg,
  renderWheelSideSvg: () => renderWheelSideSvg,
  renderWheelSvg: () => renderWheelSvg,
  rimHolePositions: () => rimHolePositions,
  validateWheelBuild: () => validateWheelBuild
});
module.exports = __toCommonJS(index_exports);

// src/math.js
var DEFAULT_WHEEL = {
  outerDia: 634,
  erd: 601,
  rimWidth: 25,
  rimOffset: 0,
  spokeCount: 32,
  valveType: "presta"
};
var DEFAULT_HUB = {
  hubPosition: "rear",
  brakeType: "6bolt",
  hubType: "jbend",
  showHubHoles: "visible",
  builtInDimension: 142,
  leftFlangeDia: 58,
  rightFlangeDia: 52,
  leftFlangeCenter: 36.6,
  rightFlangeCenter: 23.3,
  spokeHoleDia: 2.6,
  brandStyle: "generic",
  shellStyle: "tapered",
  shellWaistDia: 24,
  shellBodyDia: 31,
  flangeThickness: 4,
  endcapLength: 8,
  endcapDia: 18,
  freehubLength: 36,
  freehubDia: 35,
  freehubType: "hg",
  brakeMountWidth: 5,
  brakeMountDia: 44,
  flangeCutoutStyle: "none",
  flangeStickOut: 4,
  centerShellDia: 25,
  curveDrama: 0.35
};
var HUB_PRESETS = {
  "dt-swiss-350-mtb-boost-rear-6bolt": {
    name: "DT Swiss 350 MTB Boost Rear 6-Bolt",
    hubPosition: "rear",
    brakeType: "6bolt",
    hubType: "jbend",
    builtInDimension: 148,
    leftFlangeDia: 60,
    rightFlangeDia: 50.5,
    leftFlangeCenter: 36.6,
    rightFlangeCenter: 23.4,
    spokeHoleDia: 2.6,
    brandStyle: "dt-swiss",
    shellStyle: "smooth-taper",
    shellWaistDia: 23,
    shellBodyDia: 32,
    flangeThickness: 4,
    endcapLength: 8,
    endcapDia: 19,
    freehubLength: 37,
    freehubDia: 34,
    freehubType: "xd",
    brakeMountWidth: 5,
    brakeMountDia: 44,
    flangeCutoutStyle: "lightening-slots",
    flangeStickOut: 4,
    centerShellDia: 25,
    curveDrama: 0.32
  },
  "dt-swiss-240-exp-boost-rear-centerlock": {
    name: "DT Swiss 240 EXP Boost Rear Center Lock",
    hubPosition: "rear",
    brakeType: "centerlock",
    hubType: "jbend",
    builtInDimension: 148,
    leftFlangeDia: 50.4,
    rightFlangeDia: 50.4,
    leftFlangeCenter: 37.3,
    rightFlangeCenter: 22.6,
    spokeHoleDia: 2.5,
    brandStyle: "dt-swiss",
    shellStyle: "smooth-taper",
    shellWaistDia: 22,
    shellBodyDia: 30,
    flangeThickness: 3.5,
    endcapLength: 8,
    endcapDia: 18,
    freehubLength: 37,
    freehubDia: 33,
    freehubType: "hg",
    brakeMountWidth: 5,
    brakeMountDia: 42,
    flangeCutoutStyle: "lightening-slots",
    flangeStickOut: 4,
    centerShellDia: 24,
    curveDrama: 0.3
  },
  "industry-nine-hydra2-boost-rear-6bolt": {
    name: "Industry Nine Hydra2 Classic 12x148 Rear 6-Bolt",
    hubPosition: "rear",
    brakeType: "6bolt",
    hubType: "jbend",
    builtInDimension: 148,
    leftFlangeDia: 59.5,
    rightFlangeDia: 62,
    leftFlangeCenter: 36.9,
    rightFlangeCenter: 23.7,
    spokeHoleDia: 2.6,
    brandStyle: "industry-nine",
    shellStyle: "fluted",
    shellWaistDia: 25,
    shellBodyDia: 34,
    flangeThickness: 5,
    endcapLength: 8,
    endcapDia: 19,
    freehubLength: 37,
    freehubDia: 36,
    freehubType: "xd",
    brakeMountWidth: 5,
    brakeMountDia: 46,
    flangeCutoutStyle: "scalloped",
    flangeStickOut: 5,
    centerShellDia: 28,
    curveDrama: 0.42
  },
  "industry-nine-solix-road-rear-centerlock": {
    name: "Industry Nine Solix CL Road Rear",
    hubPosition: "rear",
    brakeType: "centerlock",
    hubType: "jbend",
    builtInDimension: 142,
    leftFlangeDia: 41,
    rightFlangeDia: 53,
    leftFlangeCenter: 33,
    rightFlangeCenter: 19,
    spokeHoleDia: 2.5,
    brandStyle: "industry-nine",
    shellStyle: "fluted",
    shellWaistDia: 23,
    shellBodyDia: 31,
    flangeThickness: 4.5,
    endcapLength: 7,
    endcapDia: 18,
    freehubLength: 37,
    freehubDia: 34,
    freehubType: "xd",
    brakeMountWidth: 5,
    brakeMountDia: 42,
    flangeCutoutStyle: "scalloped",
    flangeStickOut: 4,
    centerShellDia: 24,
    curveDrama: 0.38
  }
};
var DEFAULT_LACING = {
  crossPattern: 3
};
var DEFAULT_VIEW = {
  wheelFaceSide: "left",
  hubFaceSide: "left"
};
var DEFAULT_STYLE = {
  spokeLayering: "3d",
  spokeColor: "color",
  nippleStyle: "nipples",
  nippleColor: "silver"
};
function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
function polar(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
    angle
  };
}
function normalizeFreehubType(type = "hg") {
  const normalized = String(type).toLowerCase();
  if (normalized.includes("micro")) return "microspline";
  if (normalized.includes("xd")) return "xd";
  return "hg";
}
function normalizeOptions(options = {}) {
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
    preset: options.preset,
    builtInDimension: options.builtInDimension,
    leftFlangeDia: options.leftFlangeDia,
    rightFlangeDia: options.rightFlangeDia,
    leftFlangeCenter: options.leftFlangeCenter,
    rightFlangeCenter: options.rightFlangeCenter,
    spokeHoleDia: options.spokeHoleDia,
    brandStyle: options.brandStyle,
    shellStyle: options.shellStyle,
    shellWaistDia: options.shellWaistDia,
    shellBodyDia: options.shellBodyDia,
    flangeThickness: options.flangeThickness,
    endcapLength: options.endcapLength,
    endcapDia: options.endcapDia,
    freehubLength: options.freehubLength,
    freehubDia: options.freehubDia,
    freehubType: options.freehubType,
    brakeMountWidth: options.brakeMountWidth,
    brakeMountDia: options.brakeMountDia,
    flangeCutoutStyle: options.flangeCutoutStyle,
    flangeStickOut: options.flangeStickOut,
    centerShellDia: options.centerShellDia,
    curveDrama: options.curveDrama
  };
  const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== void 0));
  const wheelOptions = { ...compact(flatWheel), ...options.wheel || {} };
  const hubOptions = { ...compact(flatHub), ...options.hub || {} };
  const hubPreset = HUB_PRESETS[hubOptions.preset] || {};
  const view = typeof options.view === "string" ? { wheelFaceSide: options.view, hubFaceSide: options.view } : options.view || {};
  const hub = { ...DEFAULT_HUB, ...hubPreset, ...hubOptions };
  hub.freehubType = normalizeFreehubType(hub.freehubType);
  if (hub.brakeType === "rim") {
    hub.brakeMountWidth = 0;
  }
  return {
    wheel: { ...DEFAULT_WHEEL, ...wheelOptions },
    hub,
    lacing: { ...DEFAULT_LACING, ...options.lacing || {} },
    view: { ...DEFAULT_VIEW, ...view },
    style: { ...DEFAULT_STYLE, ...typeof options.style === "object" ? options.style : {} }
  };
}
function calculateSpokeLength(params) {
  const theta = 4 * Math.PI * params.crossPattern / params.spokeCount;
  const erdRadius = params.erd / 2;
  const flangeRadius = params.flangeDia / 2;
  const planarDistance = Math.sqrt(
    erdRadius ** 2 + flangeRadius ** 2 - 2 * erdRadius * flangeRadius * Math.cos(theta)
  );
  return Math.sqrt(planarDistance ** 2 + params.flangeCenter ** 2) - (params.spokeHoleDia || 2.6) / 2 + (params.lengthAdjustment || 0);
}
function calculateWheelBuild(options = {}) {
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
function validateWheelBuild(options = {}) {
  const { wheel, hub, lacing } = normalizeOptions(options);
  const warnings = [];
  [
    ["outer diameter", wheel.outerDia],
    ["ERD", wheel.erd],
    ["rim width", wheel.rimWidth],
    ["spoke count", wheel.spokeCount],
    ["left flange diameter", hub.leftFlangeDia],
    ["right flange diameter", hub.rightFlangeDia],
    ["left center-to-flange", hub.leftFlangeCenter],
    ["right center-to-flange", hub.rightFlangeCenter],
    ["cross pattern", lacing.crossPattern]
  ].forEach(([label, value]) => {
    if (!Number.isFinite(value)) warnings.push(`${label} must be a number.`);
  });
  if (Number.isFinite(wheel.spokeCount) && (wheel.spokeCount < 4 || wheel.spokeCount % 2 !== 0)) {
    warnings.push("Spoke count must be an even number of at least 4.");
  }
  if (Number.isFinite(wheel.spokeCount) && lacing.crossPattern >= wheel.spokeCount / 4) {
    warnings.push(`${lacing.crossPattern}x is too high for a ${wheel.spokeCount} spoke wheel.`);
  }
  if (wheel.erd >= wheel.outerDia) warnings.push("ERD must be smaller than the outer diameter.");
  return warnings;
}
function rimHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const radius = layout.radius || config.wheel.erd / 2;
  const count = config.wheel.spokeCount;
  const step = 2 * Math.PI / count;
  return Array.from({ length: count }, (_item, index) => {
    const angle = -Math.PI / 2 + step / 2 + index * step;
    return { index, ...polar(center, center, radius, angle) };
  });
}
function hubHolePositions(options = {}, layout = {}) {
  const config = normalizeOptions(options);
  const center = layout.center || 0;
  const spokesPerSide = config.wheel.spokeCount / 2;
  const rimStep = 2 * Math.PI / config.wheel.spokeCount;
  const hubStep = 2 * Math.PI / spokesPerSide;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = safeCross % 2 === 0 && safeCross > 0 ? 2 : 0;
  const hubAngleOffset = patternShift * rimStep;
  return {
    left: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = -Math.PI / 2 + rimStep / 2 + index * hubStep + hubAngleOffset;
      return { index, ...polar(center, center, config.hub.leftFlangeDia / 2, angle) };
    }),
    right: Array.from({ length: spokesPerSide }, (_item, index) => {
      const angle = -Math.PI / 2 + rimStep / 2 + index * hubStep + hubAngleOffset + hubStep / 2;
      return { index, ...polar(center, center, config.hub.rightFlangeDia / 2, angle) };
    })
  };
}
function lacingMap(options = {}) {
  const config = normalizeOptions(options);
  const count = config.wheel.spokeCount;
  const spokesPerSide = count / 2;
  const safeCross = Math.floor(config.lacing.crossPattern);
  const patternShift = safeCross % 2 === 0 && safeCross > 0 ? 2 : 0;
  function sideMap(side, rimOffset) {
    return Array.from({ length: spokesPerSide }, (_item, index) => {
      const isPulling = index % 2 === 0;
      const rawIndex = safeCross === 0 ? index * 2 + rimOffset + patternShift : index * 2 + (isPulling ? safeCross * 2 : -safeCross * 2) + rimOffset + patternShift;
      return {
        side,
        hubIndex: index,
        rimIndex: (Math.round(rawIndex) % count + count) % count,
        type: isPulling ? "pulling" : "trailing",
        crosses: safeCross,
        patternShift
      };
    });
  }
  return [...sideMap("left", 0), ...sideMap("right", 1)];
}

// src/svg.js
function fmt(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : String(value);
}
function roundNumbers(value) {
  return String(value).replace(/-?(?:\d+\.\d+|\d+\.|\.\d+)(?:e[+-]?\d+)?|-?\d+e[+-]?\d+/gi, (match) => fmt(Number(match)));
}
function formatPathData(d) {
  return roundNumbers(d);
}
function formatAttribute(key, value) {
  if (typeof value === "number") return fmt(value);
  if (key === "d" || key === "viewBox" || key === "points" || key === "transform" || key === "stroke-dasharray") return roundNumbers(value);
  return value;
}
function escapeText(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function attrs(attributes = {}) {
  return Object.entries(attributes).filter(([, value]) => value !== void 0 && value !== null && value !== false).map(([key, value]) => value === true ? key : `${key}="${escapeText(formatAttribute(key, value))}"`).join(" ");
}
function tag(name, attributes = {}, content = "") {
  const attributeText = attrs(attributes);
  const open = attributeText ? `<${name} ${attributeText}` : `<${name}`;
  return content === null ? `${open}/>` : `${open}>${content}</${name}>`;
}
function line(x1, y1, x2, y2, attributes = {}) {
  return tag("line", { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), ...attributes }, null);
}
function circle(cx, cy, r, attributes = {}) {
  return tag("circle", { cx: fmt(cx), cy: fmt(cy), r: fmt(r), ...attributes }, null);
}
function rect(x, y, width, height, attributes = {}) {
  return tag("rect", { x: fmt(x), y: fmt(y), width: fmt(width), height: fmt(height), ...attributes }, null);
}
function path(d, attributes = {}) {
  return tag("path", { d: formatPathData(d), ...attributes }, null);
}
function svgDocument(width, height, viewBox, content, style = "", attributes = {}) {
  return tag("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width,
    height,
    viewBox,
    preserveAspectRatio: "xMidYMid meet",
    ...attributes
  }, `${style ? tag("style", {}, style) : ""}${content}`);
}
function visualizerStyle() {
  return `
    :root{--rim-color:#343a40;--spoke-left-pulling:#0d6efd;--spoke-left-trailing:#0dcaf0;--spoke-right-pulling:#fd7e14;--spoke-right-trailing:#ffc107}
    .wheel-svg,.hub-svg{background:#fff}
    .rim-body{fill:#343a40;stroke:#212529;stroke-width:1;fill-rule:evenodd}
    .rim-outline{fill:none;stroke:#111;stroke-width:1.5}
    .rim-highlight{fill:none;stroke:rgba(255,255,255,.15);stroke-width:1}
    .hub-flange-right{fill:#dce8f3;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-flange-left{fill:#e6eef6;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-brake-mount{fill:#d4e1ec;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder{fill:#eaf1f8;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder-dark{fill:#d8e4ef;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder-freehub{fill:#eef3f8;stroke:#244b6f;stroke-width:1;fill-rule:evenodd}
    .hub-axle{fill:#f8fbfd;stroke:#5d7f9e;stroke-width:.8}
    .hub-endcap{fill:#e7eef5;stroke:#315c82;stroke-width:1}
    .hub-axle-tip{fill:#f8fbfd;stroke:#5d7f9e;stroke-width:.8}
    .hub-shell-body{fill:#eaf1f8;stroke:#1f4b72;stroke-width:1.2}
    .hub-brand-dt-swiss .hub-shell-body{fill:#edf3f8}
    .hub-brand-industry-nine .hub-shell-body{fill:#e3edf6}
    .hub-shell-flute{stroke:#7399ba;stroke-width:.9;stroke-linecap:round;fill:none}
    .hub-shell-highlight{stroke:#9ab9d4;stroke-width:1;stroke-linecap:round}
    .hub-bearing-ring{fill:#d2e0ec;stroke:#244b6f;stroke-width:1}
    .hub-flange-plate{stroke-width:1.1}
    .hub-flange-cutout{fill:#fff;stroke:#5d7f9e;stroke-width:.7}
    .hub-spoke-hole-side{fill:#315c82;stroke:none}
    .hub-bolt-head-side{fill:#fff;stroke:#315c82;stroke-width:.6}
    .hub-centerlock-side{fill:#dce8f3}
    .hub-sixbolt-side{fill:#dce8f3}
    .hub-spline-line,.hub-freehub-spline{stroke:#315c82;stroke-width:1;stroke-linecap:round}
    .hub-blueprint-line{stroke:#78a9d4;stroke-width:.7;stroke-dasharray:3 3;fill:none;opacity:.9}
    .rim-hole{fill:#111;stroke:#343a40;stroke-width:.5}
    .valve-hole-marker{fill:#dc3545}
    .valve-hole-line{stroke:#dc3545;stroke-width:2.5;stroke-linecap:round}
    .valve-label{font-family:sans-serif;font-size:14px;fill:#495057;font-weight:bold}
    .spoke-nipple{stroke-width:5;stroke-linecap:butt}
    .nipple-theme-silver .spoke-nipple{stroke:#adb5bd}
    .nipple-theme-black .spoke-nipple{stroke:#212529}
    .spoke{stroke-width:1.5;stroke-linecap:round}
    .spoke-theme-color .spoke-left.spoke-pulling{stroke:#0d6efd}
    .spoke-theme-color .spoke-left.spoke-trailing{stroke:#0dcaf0}
    .spoke-theme-color .spoke-right.spoke-pulling{stroke:#fd7e14;stroke-dasharray:4 4}
    .spoke-theme-color .spoke-right.spoke-trailing{stroke:#ffc107;stroke-dasharray:4 4}
    .spoke-theme-black .spoke{stroke:#212529}
    .spoke-theme-silver .spoke{stroke:#ced4da}
  `;
}

// src/paths.js
function circlePath(cx, cy, r, clockwise = true) {
  const sweep = clockwise ? 1 : 0;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z `;
}
function closedFitSplinePath(points, tension = 0.45) {
  if (points.length < 3) return "";
  let d = `M ${points[0].x} ${points[0].y} `;
  points.forEach((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];
    const cp1 = {
      x: point.x + (next.x - previous.x) * tension / 6,
      y: point.y + (next.y - previous.y) * tension / 6
    };
    const cp2 = {
      x: next.x - (afterNext.x - point.x) * tension / 6,
      y: next.y - (afterNext.y - point.y) * tension / 6
    };
    d += `C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${next.x} ${next.y} `;
  });
  return `${d}Z `;
}
function createJBendFlangePath(cx, cy, outerRadius, holes, showHoles) {
  let d = circlePath(cx, cy, outerRadius, true);
  if (showHoles) {
    holes.forEach((point) => {
      d += circlePath(point.x, point.y, 1.8, false);
    });
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}
function create6BoltPath(cx, cy) {
  const points = [];
  for (let index = 0; index < 6; index += 1) {
    const angle = index * (Math.PI / 3);
    points.push(
      polar(cx, cy, 16.7, angle - 0.32),
      polar(cx, cy, 21.3, angle - 0.39),
      polar(cx, cy, 26, angle - 0.29),
      polar(cx, cy, 28.6, angle - 0.075),
      polar(cx, cy, 28.6, angle + 0.075),
      polar(cx, cy, 26, angle + 0.29),
      polar(cx, cy, 21.3, angle + 0.39),
      polar(cx, cy, 16.7, angle + 0.32),
      polar(cx, cy, 13.8, angle + Math.PI / 6)
    );
  }
  let d = closedFitSplinePath(points);
  for (let index = 0; index < 6; index += 1) {
    const boltCenter = polar(cx, cy, 22, index * (Math.PI / 3));
    d += circlePath(boltCenter.x, boltCenter.y, 2.8, false);
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}
function createFreehubSplineFacePath(cx, cy, options = {}) {
  const majorRadius = 17.45;
  const minorRadius = 15.9;
  const chamferDepth = 0.4;
  const chamferRad = 0.025;
  const toothCount = options.toothCount || 9;
  const innerRadius = options.innerRadius || 10;
  const splineScale = options.splineScale || 1;
  const standardSpline = 2 * Math.PI / toothCount * 0.6 * splineScale;
  const standardValley = 2 * Math.PI / toothCount - standardSpline;
  const pattern = Array.from({ length: toothCount }, (_item, index) => {
    if (toothCount === 9 && index === 0) return [standardSpline * 0.55, standardValley * 0.7];
    if (toothCount === 9 && index === toothCount - 1) return [standardSpline, standardValley * 1.25];
    return [standardSpline, standardValley];
  });
  let d = "";
  let currentAngle = -Math.PI / 2 - pattern[0][0] / 2;
  pattern.forEach(([splineWidth, valleyWidth], index) => {
    const start = currentAngle;
    const end = currentAngle + splineWidth;
    const nextStart = end + valleyWidth;
    const p1 = polar(cx, cy, minorRadius, start);
    const p2 = polar(cx, cy, majorRadius - chamferDepth, start);
    const p3 = polar(cx, cy, majorRadius, start + chamferRad);
    const p4 = polar(cx, cy, majorRadius, end - chamferRad);
    const p5 = polar(cx, cy, majorRadius - chamferDepth, end);
    const p6 = polar(cx, cy, minorRadius, end);
    const pNext = polar(cx, cy, minorRadius, nextStart);
    if (index === 0) d += `M ${p1.x} ${p1.y} `;
    d += `L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${majorRadius} ${majorRadius} 0 0 1 ${p4.x} ${p4.y} L ${p5.x} ${p5.y} L ${p6.x} ${p6.y} `;
    d += `A ${minorRadius} ${minorRadius} 0 0 1 ${pNext.x} ${pNext.y} `;
    currentAngle = nextStart;
  });
  return `${d}Z ${circlePath(cx, cy, innerRadius, false)}`;
}
function createHGFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy);
}
function createMicrosplineFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy, { toothCount: 18, splineScale: 0.72 });
}
function createXDFreehubFacePath(cx, cy) {
  return createFreehubSplineFacePath(cx, cy, { innerRadius: 15 });
}
function createStraightPullFlangePath(cx, cy, radius, holes) {
  const arms = Math.floor(holes.length / 2);
  if (arms === 0) return "";
  let firstAngle = Math.atan2(holes[0].y - cy, holes[0].x - cx);
  let secondAngle = Math.atan2(holes[1].y - cy, holes[1].x - cx);
  if (firstAngle < 0) firstAngle += 2 * Math.PI;
  if (secondAngle < 0) secondAngle += 2 * Math.PI;
  if (secondAngle < firstAngle) secondAngle += 2 * Math.PI;
  const armGap = secondAngle - firstAngle;
  const slice = 2 * Math.PI / arms;
  const emptySpace = slice - armGap;
  const outerRadius = radius + 6;
  const innerRadius = Math.max(14, radius - 8);
  const valleyRadius = Math.max(10, innerRadius - 5);
  const padLength = Math.min(5, emptySpace * innerRadius / 2 * 0.75);
  const outerPad = padLength / outerRadius;
  const innerPad = padLength / innerRadius;
  const armsData = Array.from({ length: arms }, (_item, armIndex) => {
    const h1 = holes[armIndex * 2];
    const h2 = holes[armIndex * 2 + 1];
    let a1 = Math.atan2(h1.y - cy, h1.x - cx);
    let a2 = Math.atan2(h2.y - cy, h2.x - cx);
    if (a1 < 0) a1 += 2 * Math.PI;
    if (a2 < 0) a2 += 2 * Math.PI;
    if (a2 < a1) a2 += 2 * Math.PI;
    return {
      pIL: polar(cx, cy, innerRadius, a1 - innerPad),
      pOL: polar(cx, cy, outerRadius, a1 - outerPad),
      pOR: polar(cx, cy, outerRadius, a2 + outerPad),
      pIR: polar(cx, cy, innerRadius, a2 + innerPad),
      aInnerLeft: a1 - innerPad,
      aInnerRight: a2 + innerPad
    };
  });
  let d = "";
  armsData.forEach((current, index) => {
    if (index === 0) {
      d += `M ${current.pIL.x} ${current.pIL.y} `;
    } else {
      const previous = armsData[index - 1];
      let leftAngle = previous.aInnerRight;
      let rightAngle2 = current.aInnerLeft;
      if (rightAngle2 < leftAngle) rightAngle2 += 2 * Math.PI;
      const valley2 = polar(cx, cy, valleyRadius, leftAngle + (rightAngle2 - leftAngle) / 2);
      d += `Q ${valley2.x} ${valley2.y} ${current.pIL.x} ${current.pIL.y} `;
    }
    d += `L ${current.pOL.x} ${current.pOL.y} A ${outerRadius} ${outerRadius} 0 0 1 ${current.pOR.x} ${current.pOR.y} L ${current.pIR.x} ${current.pIR.y} `;
  });
  const last = armsData[arms - 1];
  const first = armsData[0];
  let rightAngle = first.aInnerLeft;
  if (rightAngle < last.aInnerRight) rightAngle += 2 * Math.PI;
  const valley = polar(cx, cy, valleyRadius, last.aInnerRight + (rightAngle - last.aInnerRight) / 2);
  return `${d}Q ${valley.x} ${valley.y} ${first.pIL.x} ${first.pIL.y} Z ${circlePath(cx, cy, 6, false)}`;
}
function renderValve(config, center, innerRadius) {
  const valve = polar(center, center, innerRadius, -Math.PI / 2);
  if (config.wheel.valveType === "presta") {
    return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)">${rect(-3, 0, 6, 48, { fill: "#adb5bd", rx: 1 })}${rect(-5, 0, 10, 3, { fill: "#6c757d", rx: 0.5 })}${rect(-2, 48, 4, 6, { fill: "#ced4da", rx: 0.5 })}</g>`;
  }
  if (config.wheel.valveType === "schrader") {
    return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)">${rect(-4, 0, 8, 30, { fill: "#343a40", rx: 1 })}${rect(-5, 0, 10, 3, { fill: "#6c757d", rx: 0.5 })}${rect(-4.5, 22, 9, 8, { fill: "#212529", rx: 1 })}</g>`;
  }
  return `<g class="wheel-valve-group" transform="translate(${fmt(valve.x)} ${fmt(valve.y)}) rotate(0)"><text class="valve-label" transform="rotate(90)" x="8" y="0" dominant-baseline="middle" text-anchor="start" letter-spacing="2">VALVE</text></g>`;
}
function spokeNipple(hubPoint, rimPoint) {
  const dx = hubPoint.x - rimPoint.x;
  const dy = hubPoint.y - rimPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return { x2: rimPoint.x + dx / distance * 10, y2: rimPoint.y + dy / distance * 10 };
}

// src/hubSvgGenerator.js
var BLUEPRINT = {
  axle: { fill: "#f8fbfd", stroke: "#5d7f9e", "stroke-width": 0.8 },
  endcap: { fill: "#e7eef5", stroke: "#315c82", "stroke-width": 1 },
  shell: { fill: "#eaf1f8", stroke: "#1f4b72", "stroke-width": 1.2 },
  flangeLeft: { fill: "#e6eef6", stroke: "#244b6f", "stroke-width": 1.1 },
  flangeRight: { fill: "#dce8f3", stroke: "#244b6f", "stroke-width": 1.1 },
  mount: { fill: "#dce8f3", stroke: "#244b6f", "stroke-width": 1 },
  freehub: { fill: "#eef3f8", stroke: "#244b6f", "stroke-width": 1 },
  bearing: { fill: "#d2e0ec", stroke: "#244b6f", "stroke-width": 1 },
  cutout: { fill: "#ffffff", stroke: "#5d7f9e", "stroke-width": 0.7 },
  hole: { fill: "#315c82", stroke: "none" },
  line: { fill: "none", stroke: "#78a9d4", "stroke-width": 0.7, "stroke-dasharray": "3 3" },
  detail: { fill: "none", stroke: "#315c82", "stroke-width": 1, "stroke-linecap": "round" },
  faceReference: { fill: "none", stroke: "#78a9d4", "stroke-width": 0.7, "stroke-dasharray": "3 3" },
  faceBearing: { fill: "none", stroke: "#5d7f9e", "stroke-width": 2, "stroke-dasharray": "2 2" }
};
var REALISTIC = {
  axle: { fill: "#e8e8e8", stroke: "#1f1f1f", "stroke-width": 0.8 },
  endcap: { fill: "#8f9498", stroke: "#111111", "stroke-width": 1 },
  shell: { fill: "#c9cdd0", stroke: "#111111", "stroke-width": 1.2 },
  flangeLeft: { fill: "#d8dadd", stroke: "#111111", "stroke-width": 1.1 },
  flangeRight: { fill: "#babfc3", stroke: "#111111", "stroke-width": 1.1 },
  mount: { fill: "#9fa4a8", stroke: "#111111", "stroke-width": 1 },
  freehub: { fill: "#d7d9dc", stroke: "#111111", "stroke-width": 1 },
  bearing: { fill: "#757b80", stroke: "#111111", "stroke-width": 1 },
  cutout: { fill: "#f8f8f8", stroke: "#222222", "stroke-width": 0.7 },
  hole: { fill: "#171717", stroke: "none" },
  line: { fill: "none", stroke: "#1f1f1f", "stroke-width": 0.7, "stroke-dasharray": "3 3", opacity: 0.35 },
  detail: { fill: "none", stroke: "#222222", "stroke-width": 1, "stroke-linecap": "round" },
  faceReference: { fill: "none", stroke: "#222222", "stroke-width": 0.7, "stroke-dasharray": "3 3", opacity: 0.35 },
  faceBearing: { fill: "none", stroke: "#222222", "stroke-width": 2, "stroke-dasharray": "2 2" }
};
function activeStyle(config) {
  return config.style.hubRenderStyle === "realistic" ? REALISTIC : BLUEPRINT;
}
function isBlueprint(config) {
  return config.style.hubRenderStyle !== "realistic";
}
function bp(className, style, extra = {}) {
  return { class: className, ...style, ...extra };
}
function hubProfileClass(config) {
  return [
    "hub-side-group",
    `hub-brand-${config.hub.brandStyle || "generic"}`,
    `hub-shell-${config.hub.shellStyle || "tapered"}`,
    `hub-render-${config.style.hubRenderStyle || "blueprint"}`
  ].join(" ");
}
function contiguousPath(x1, x2, cy, r, chamfer = 1.5) {
  return [
    `M ${x1 + chamfer} ${cy - r}`,
    `L ${x2 - chamfer} ${cy - r}`,
    `L ${x2} ${cy - r + chamfer}`,
    `L ${x2} ${cy + r - chamfer}`,
    `L ${x2 - chamfer} ${cy + r}`,
    `L ${x1 + chamfer} ${cy + r}`,
    `L ${x1} ${cy + r - chamfer}`,
    `L ${x1} ${cy - r + chamfer}`,
    "Z"
  ].join(" ");
}
function endcapPath(x1, x2, cy, r, side, chamfer = 1.5) {
  if (side === "left") {
    return [
      `M ${x1 + chamfer} ${cy - r}`,
      `L ${x2} ${cy - r}`,
      `L ${x2} ${cy + r}`,
      `L ${x1 + chamfer} ${cy + r}`,
      `L ${x1} ${cy + r - chamfer}`,
      `L ${x1} ${cy - r + chamfer}`,
      "Z"
    ].join(" ");
  }
  return [
    `M ${x1} ${cy - r}`,
    `L ${x2 - chamfer} ${cy - r}`,
    `L ${x2} ${cy - r + chamfer}`,
    `L ${x2} ${cy + r - chamfer}`,
    `L ${x2 - chamfer} ${cy + r}`,
    `L ${x1} ${cy + r}`,
    "Z"
  ].join(" ");
}
function centeredYs(cy, radius, count) {
  return Array.from({ length: count }, (_, index) => cy - radius + (index + 1) * radius * 2 / (count + 1));
}
function renderCenterlockFaceRings(cx, cy, style) {
  return [
    circle(cx, cy, 17, {
      class: "hub-centerlock-solid-ring",
      fill: "none",
      stroke: style.detail.stroke,
      "stroke-width": 1
    }),
    circle(cx, cy, 17.5, {
      class: "hub-centerlock-dashed-ring",
      fill: "none",
      stroke: style.detail.stroke,
      "stroke-width": 1,
      "stroke-dasharray": "1 1"
    })
  ].join("");
}
function renderFreehubFace(cx, cy, config, style) {
  if (config.hub.freehubType === "microspline") {
    return path(createMicrosplineFreehubFacePath(cx, cy), bp("hub-cylinder-freehub hub-freehub-microspline-face", style.freehub));
  }
  if (config.hub.freehubType === "xd") {
    return [
      path(createXDFreehubFacePath(cx, cy), bp("hub-cylinder-freehub hub-freehub-xd-face", style.freehub)),
      circle(cx, cy, 13.5, {
        class: "hub-freehub-xd-middle-ring",
        fill: "none",
        stroke: style.detail.stroke,
        "stroke-width": 1,
        "stroke-dasharray": "1 1"
      }),
      circle(cx, cy, 11.5, {
        class: "hub-freehub-xd-center-ring",
        fill: "none",
        stroke: style.detail.stroke,
        "stroke-width": 1
      })
    ].join("");
  }
  return path(createHGFreehubFacePath(cx, cy), bp("hub-cylinder-freehub hub-freehub-hg-face", style.freehub));
}
function renderContiguousHubSideGroup(cx, cy, config) {
  const style = activeStyle(config);
  const old = config.hub.builtInDimension || (config.hub.hubPosition === "front" ? 100 : 142);
  const leftEndX = cx - old / 2;
  const rightEndX = cx + old / 2;
  const endcapLength = config.hub.endcapLength || 8;
  const endcapRadius = (config.hub.endcapDia || 18) / 2;
  const hasBrakeMount = config.hub.brakeType !== "rim";
  const brakeWidth = hasBrakeMount ? config.hub.brakeMountWidth ?? 5 : 0;
  const brakeCoreRadius = hasBrakeMount ? Math.max(15, Math.min(config.hub.brakeMountDia / 2, 18)) : Math.max(12, config.hub.shellBodyDia / 2);
  const freehubLength = config.hub.hubPosition === "rear" ? config.hub.freehubLength : 0;
  const freehubRadius = (config.hub.freehubDia || 34) / 2;
  const leftFlangeX = cx - config.hub.leftFlangeCenter;
  const rightFlangeX = cx + config.hub.rightFlangeCenter;
  const flangeThickness = (config.hub.flangeThickness || 4) * (config.hub.hubType === "straightpull" ? 1.5 : 1);
  const leftFlangeRadius = config.hub.leftFlangeDia / 2;
  const rightFlangeRadius = config.hub.rightFlangeDia / 2;
  const shellRadius = Math.max(12, config.hub.shellWaistDia / 2);
  const freehubType = config.hub.freehubType || "hg";
  const isXd = freehubType === "xd";
  const xBrakeStart = leftEndX + endcapLength;
  const xBrakeEnd = hasBrakeMount ? Math.min(xBrakeStart + brakeWidth, leftFlangeX - flangeThickness / 2 - 2) : xBrakeStart;
  const xLeftFlange1 = leftFlangeX - flangeThickness / 2;
  const xLeftFlange2 = leftFlangeX + flangeThickness / 2;
  const xRightFlange1 = rightFlangeX - flangeThickness / 2;
  const xRightFlange2 = rightFlangeX + flangeThickness / 2;
  const xRightEndcapStart = rightEndX - endcapLength;
  const xFreehubStart = Math.max(xRightEndcapStart - freehubLength, xRightFlange2 + 2);
  const xdSplineWidth = isXd ? Math.min(7, freehubLength * 0.22) : 0;
  const xdThreadWidth = isXd ? Math.min(5.5, freehubLength * 0.18) : 0;
  const xXdSplineEnd = xFreehubStart + xdSplineWidth;
  const xXdThreadEnd = xXdSplineEnd + xdThreadWidth;
  const xXdFinalStep = isXd ? Math.max(xXdThreadEnd + 1, xRightEndcapStart - 5) : xRightEndcapStart;
  const xdSplineRadius = freehubRadius;
  const xdThreadRadius = freehubRadius - 1;
  const xdSmoothRadius = freehubRadius - 2;
  const xdEndRadius = freehubRadius - 3;
  const flangeStickOut = Math.max(0, config.hub.flangeStickOut || 0);
  const leftAttachRadius = Math.max(shellRadius, leftFlangeRadius - flangeStickOut);
  const rightAttachRadius = Math.max(shellRadius, rightFlangeRadius - flangeStickOut);
  const centerRadius = Math.max(8, (config.hub.centerShellDia || config.hub.shellWaistDia) / 2);
  const curveDrama = Math.max(0.1, Math.min(1, config.hub.curveDrama || 0.35));
  const leftSpan = Math.max(1, cx - xLeftFlange2);
  const rightSpan = Math.max(1, xRightFlange1 - cx);
  const cpLeftX1 = xLeftFlange2 + leftSpan * curveDrama;
  const cpLeftX2 = cx - leftSpan * curveDrama;
  const cpRightX1 = cx + rightSpan * curveDrama;
  const cpRightX2 = xRightFlange1 - rightSpan * curveDrama;
  const leftEndcapPath = endcapPath(leftEndX, xBrakeStart, cy, endcapRadius, "left", 1.5);
  const rightEndcapPath = endcapPath(xRightEndcapStart, rightEndX, cy, endcapRadius, "right", 1.5);
  const leftFlangePath = contiguousPath(xLeftFlange1, xLeftFlange2, cy, leftFlangeRadius, Math.min(1.2, flangeThickness / 3));
  const rightFlangePath = contiguousPath(xRightFlange1, xRightFlange2, cy, rightFlangeRadius, Math.min(1.2, flangeThickness / 3));
  const brakePath = contiguousPath(xBrakeStart, xBrakeEnd, cy, brakeCoreRadius, 1.2);
  const shellPath = [
    `M ${xBrakeEnd} ${cy - brakeCoreRadius}`,
    `C ${xBrakeEnd + 4} ${cy - brakeCoreRadius} ${xLeftFlange1 - 5} ${cy - leftAttachRadius} ${xLeftFlange1} ${cy - leftAttachRadius}`,
    `L ${xLeftFlange2} ${cy - leftAttachRadius}`,
    `C ${cpLeftX1} ${cy - leftAttachRadius} ${cpLeftX2} ${cy - centerRadius} ${cx} ${cy - centerRadius}`,
    `C ${cpRightX1} ${cy - centerRadius} ${cpRightX2} ${cy - rightAttachRadius} ${xRightFlange1} ${cy - rightAttachRadius}`,
    `L ${xRightFlange2} ${cy - rightAttachRadius}`,
    `C ${xRightFlange2 + 4} ${cy - rightFlangeRadius} ${xFreehubStart - 4} ${cy - freehubRadius} ${xFreehubStart} ${cy - freehubRadius}`,
    `L ${xFreehubStart} ${cy + freehubRadius}`,
    `C ${xFreehubStart - 4} ${cy + freehubRadius} ${xRightFlange2 + 4} ${cy + rightFlangeRadius} ${xRightFlange2} ${cy + rightFlangeRadius}`,
    `L ${xRightFlange1} ${cy + rightAttachRadius}`,
    `C ${cpRightX2} ${cy + rightAttachRadius} ${cpRightX1} ${cy + centerRadius} ${cx} ${cy + centerRadius}`,
    `C ${cpLeftX2} ${cy + centerRadius} ${cpLeftX1} ${cy + leftAttachRadius} ${xLeftFlange2} ${cy + leftAttachRadius}`,
    `L ${xLeftFlange1} ${cy + leftAttachRadius}`,
    `C ${xLeftFlange1 - 5} ${cy + leftAttachRadius} ${xBrakeEnd + 4} ${cy + brakeCoreRadius} ${xBrakeEnd} ${cy + brakeCoreRadius}`,
    "Z"
  ].join(" ");
  const freehubPath = isXd ? [
    `M ${xFreehubStart} ${cy - xdSplineRadius}`,
    `L ${xXdSplineEnd} ${cy - xdSplineRadius}`,
    `L ${xXdSplineEnd} ${cy - xdThreadRadius}`,
    `L ${xXdThreadEnd} ${cy - xdThreadRadius}`,
    `L ${xXdThreadEnd} ${cy - xdSmoothRadius}`,
    `L ${xXdFinalStep} ${cy - xdSmoothRadius}`,
    `L ${xXdFinalStep} ${cy - xdEndRadius}`,
    `L ${xRightEndcapStart} ${cy - xdEndRadius}`,
    `L ${xRightEndcapStart} ${cy + xdEndRadius}`,
    `L ${xXdFinalStep} ${cy + xdEndRadius}`,
    `L ${xXdFinalStep} ${cy + xdSmoothRadius}`,
    `L ${xXdThreadEnd} ${cy + xdSmoothRadius}`,
    `L ${xXdThreadEnd} ${cy + xdThreadRadius}`,
    `L ${xXdSplineEnd} ${cy + xdThreadRadius}`,
    `L ${xXdSplineEnd} ${cy + xdSplineRadius}`,
    `L ${xFreehubStart} ${cy + xdSplineRadius}`,
    "Z"
  ].join(" ") : [
    `M ${xFreehubStart} ${cy - freehubRadius}`,
    `L ${xRightEndcapStart} ${cy - freehubRadius}`,
    `L ${xRightEndcapStart} ${cy + freehubRadius}`,
    `L ${xFreehubStart} ${cy + freehubRadius}`,
    "Z"
  ].join(" ");
  const maskId = `hub-mask-${String(config.hub.preset || "custom").replaceAll(/[^a-z0-9-]/gi, "-")}-${config.style.hubRenderStyle || "blueprint"}`;
  const components = [
    path(leftEndcapPath, bp("hub-endcap", style.endcap)),
    hasBrakeMount ? path(brakePath, bp(`hub-brake-mount hub-${config.hub.brakeType}-side`, style.mount)) : "",
    path(shellPath, bp("hub-cylinder hub-shell-body", style.shell)),
    path(leftFlangePath, bp("hub-flange-left hub-flange-plate", style.flangeLeft)),
    path(rightFlangePath, bp("hub-flange-right hub-flange-plate", style.flangeRight)),
    path(freehubPath, bp(`hub-cylinder-freehub hub-freehub-${freehubType}`, style.freehub)),
    path(rightEndcapPath, bp("hub-endcap", style.endcap))
  ];
  const details = [];
  if (config.style.hubRenderStyle === "realistic") {
    details.push(tag("defs", {}, tag("clipPath", { id: maskId }, [
      tag("path", { d: leftEndcapPath }, ""),
      hasBrakeMount ? tag("path", { d: brakePath }, "") : "",
      tag("path", { d: shellPath }, ""),
      tag("path", { d: leftFlangePath }, ""),
      tag("path", { d: rightFlangePath }, ""),
      tag("path", { d: freehubPath }, ""),
      tag("path", { d: rightEndcapPath }, "")
    ].join(""))));
  }
  if (config.hub.hubType === "straightpull") {
    const slotCount = Math.max(1, Math.round(config.wheel.spokeCount / 4));
    [
      [xLeftFlange1, xLeftFlange2, leftFlangeRadius],
      [xRightFlange1, xRightFlange2, rightFlangeRadius]
    ].forEach(([x1, x2, r]) => {
      centeredYs(cy, r, slotCount).forEach((y) => {
        details.push(line(x1 + 0.6, y, x2 - 0.6, y, bp("hub-straightpull-slot-side", style.detail, { opacity: 0.72, "stroke-width": 0.8 })));
      });
    });
  }
  if (config.hub.brakeType === "6bolt") {
    centeredYs(cy, brakeCoreRadius, 2).forEach((y) => {
      details.push(line(xBrakeStart + 0.7, y, xBrakeEnd - 0.7, y, bp("hub-sixbolt-side-line", style.detail, { opacity: 0.65, "stroke-width": 0.75 })));
    });
  }
  if (config.hub.brakeType === "centerlock") {
    for (let x = xBrakeStart + 1.5; x < xBrakeEnd; x += 1.6) {
      details.push(line(x, cy - brakeCoreRadius + 1, x, cy + brakeCoreRadius - 1, bp("hub-centerlock-tooth", style.detail, { opacity: 0.55, "stroke-width": 0.55 })));
    }
  }
  if (isXd) {
    for (let x = xXdSplineEnd + 0.7; x < xXdThreadEnd; x += 1.2) {
      details.push(line(x, cy - xdThreadRadius + 1, x, cy + xdThreadRadius - 1, bp("hub-freehub-thread-line", style.detail, { opacity: 0.45, "stroke-width": 0.55 })));
    }
    centeredYs(cy, xdSplineRadius, 6).forEach((y) => {
      details.push(line(xFreehubStart + 0.8, y, xXdSplineEnd, y, bp("hub-freehub-spline", style.detail, { opacity: 0.7, "stroke-width": 0.75 })));
    });
    details.push(line(xXdFinalStep, cy - xdSmoothRadius, xXdFinalStep, cy + xdSmoothRadius, bp("hub-freehub-final-step-line", style.detail, { opacity: 0.5, "stroke-width": 0.65 })));
  } else {
    const splineCount = freehubType === "microspline" ? 9 : 4;
    centeredYs(cy, freehubRadius, splineCount).forEach((y) => {
      details.push(line(xFreehubStart, y, xRightEndcapStart - 1, y, bp("hub-freehub-spline", style.detail, { opacity: 0.7, "stroke-width": 0.75 })));
    });
  }
  if (isBlueprint(config)) {
    details.push(line(leftEndX, cy + 55, leftEndX, cy + 65, bp("hub-blueprint-line", style.line)));
    details.push(line(rightEndX, cy + 55, rightEndX, cy + 65, bp("hub-blueprint-line", style.line)));
  }
  return tag("g", { class: hubProfileClass(config), "data-hub-preset": config.hub.preset }, [...components, ...details].join(""));
}
function renderHubSideGroup(cx, cy, config) {
  return renderContiguousHubSideGroup(cx, cy, config);
}
var HubSVGGenerator = class {
  renderFace(options = {}) {
    const config = normalizeOptions(options);
    const style = activeStyle(config);
    const center = 75;
    const isLeft = config.view.hubFaceSide !== "right";
    const frontRadius = isLeft ? config.hub.leftFlangeDia / 2 : config.hub.rightFlangeDia / 2;
    const backRadius = isLeft ? config.hub.rightFlangeDia / 2 : config.hub.leftFlangeDia / 2;
    const spokesPerSide = config.wheel.spokeCount / 2;
    const hubStep = 2 * Math.PI / spokesPerSide;
    const frontHoles = [];
    const backHoles = [];
    for (let index = 0; index < spokesPerSide; index += 1) {
      const leftAngle = -Math.PI / 2 + index * hubStep;
      const rightAngle = leftAngle + hubStep / 2;
      if (isLeft) {
        frontHoles.push(polar(center, center, frontRadius, leftAngle));
        backHoles.push(polar(center, center, backRadius, rightAngle));
      } else {
        frontHoles.push(polar(center, center, frontRadius, rightAngle));
        backHoles.push(polar(center, center, backRadius, leftAngle));
      }
    }
    const content = [];
    if (!isLeft && config.hub.brakeType === "6bolt") {
      content.push(path(create6BoltPath(center, center), bp("hub-brake-mount", style.mount)));
    } else if (!isLeft && config.hub.brakeType === "centerlock") {
      content.push(renderCenterlockFaceRings(center, center, style));
    }
    if (config.hub.hubType === "straightpull") {
      content.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), bp("hub-flange-right", style.flangeRight)));
      content.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), bp("hub-flange-left", style.flangeLeft)));
    } else {
      content.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, true), bp("hub-flange-right", style.flangeRight)));
      content.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, true), bp("hub-flange-left", style.flangeLeft)));
      if (config.hub.flangeCutoutStyle === "scalloped") {
        const scallopCount = Math.max(6, Math.floor(spokesPerSide / 2));
        for (let index = 0; index < scallopCount; index += 1) {
          const cut = polar(center, center, frontRadius * 0.72, -Math.PI / 2 + index * (2 * Math.PI / scallopCount));
          content.push(circle(cut.x, cut.y, 2.7, bp("hub-flange-cutout", style.cutout)));
        }
      } else if (config.hub.flangeCutoutStyle === "lightening-slots") {
        for (let index = 0; index < 6; index += 1) {
          const angle = index * (Math.PI / 3);
          const slot = polar(center, center, frontRadius * 0.67, angle);
          content.push(circle(slot.x, slot.y, 2.2, bp("hub-flange-cutout", style.cutout)));
        }
      }
    }
    if (config.hub.hubPosition === "rear" && !isLeft) {
      content.push(renderFreehubFace(center, center, config, style));
    }
    if (isLeft && config.hub.brakeType === "6bolt") {
      content.push(path(create6BoltPath(center, center), bp("hub-brake-mount", style.mount)));
    } else if (isLeft && config.hub.brakeType === "centerlock") {
      content.push(renderCenterlockFaceRings(center, center, style));
    }
    return svgDocument(150, 150, "0 0 150 150", tag("g", {
      class: `hub-face-group hub-brand-${config.hub.brandStyle || "generic"}`
    }, content.join("")), visualizerStyle(), {
      class: "hub-svg"
    });
  }
  renderSide(options = {}) {
    const config = normalizeOptions(options);
    return svgDocument(200, 150, "0 0 200 150", renderHubSideGroup(100, 75, config), visualizerStyle(), {
      class: "hub-svg"
    });
  }
  hubHoles(options = {}) {
    return hubHolePositions(options);
  }
};

// src/wheelFaceSvgGenerator.js
function renderCenterlockFaceRings2(cx, cy) {
  return [
    circle(cx, cy, 17, {
      class: "hub-centerlock-solid-ring",
      fill: "none",
      stroke: "#212529",
      "stroke-width": 1
    }),
    circle(cx, cy, 17.5, {
      class: "hub-centerlock-dashed-ring",
      fill: "none",
      stroke: "#212529",
      "stroke-width": 1,
      "stroke-dasharray": "1 1"
    })
  ].join("");
}
function renderFreehubFace2(cx, cy, config) {
  if (config.hub.freehubType === "microspline") {
    return path(createMicrosplineFreehubFacePath(cx, cy), { class: "hub-cylinder-freehub hub-freehub-microspline-face" });
  }
  if (config.hub.freehubType === "xd") {
    return [
      path(createXDFreehubFacePath(cx, cy), { class: "hub-cylinder-freehub hub-freehub-xd-face" }),
      circle(cx, cy, 13.5, {
        class: "hub-freehub-xd-middle-ring",
        fill: "none",
        stroke: "#212529",
        "stroke-width": 1,
        "stroke-dasharray": "1 1"
      }),
      circle(cx, cy, 11.5, {
        class: "hub-freehub-xd-center-ring",
        fill: "none",
        stroke: "#212529",
        "stroke-width": 1
      })
    ].join("");
  }
  return path(createHGFreehubFacePath(cx, cy), { class: "hub-cylinder-freehub hub-freehub-hg-face" });
}
var WheelFaceSVGGenerator = class {
  render(options = {}) {
    const config = normalizeOptions(options);
    const center = 350;
    const outerRadius = config.wheel.outerDia / 2;
    const innerRadius = config.wheel.erd / 2;
    const rimThickness = outerRadius - innerRadius;
    const rimMidRadius = innerRadius + rimThickness / 2;
    const rimHoles = rimHolePositions(config, { center, radius: innerRadius });
    const hubHoles = hubHolePositions(config, { center });
    const lacing = lacingMap(config);
    const isLeftView = config.view.wheelFaceSide !== "right";
    const frontRadius = isLeftView ? config.hub.leftFlangeDia / 2 : config.hub.rightFlangeDia / 2;
    const backRadius = isLeftView ? config.hub.rightFlangeDia / 2 : config.hub.leftFlangeDia / 2;
    const frontHoles = isLeftView ? hubHoles.left : hubHoles.right;
    const backHoles = isLeftView ? hubHoles.right : hubHoles.left;
    const backSpokes = [];
    const frontSpokes = [];
    const backNipples = [];
    const frontNipples = [];
    lacing.forEach((spoke) => {
      const hubPoint = hubHoles[spoke.side][spoke.hubIndex];
      const rimPoint = rimHoles[spoke.rimIndex];
      const isBackFlange = spoke.side === "left" && !isLeftView || spoke.side === "right" && isLeftView;
      const isFront = config.style.spokeLayering === "flat" ? true : !isBackFlange;
      const spokeSvg = line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, {
        class: `spoke spoke-${spoke.side} spoke-${spoke.type}`,
        "data-rim-index": spoke.rimIndex,
        "data-hub-index": spoke.hubIndex
      });
      (isFront ? frontSpokes : backSpokes).push(spokeSvg);
      if (config.style.nippleStyle === "nipples") {
        const nipple = spokeNipple(hubPoint, rimPoint);
        const nippleSvg = line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: "spoke-nipple" });
        (isFront ? frontNipples : backNipples).push(nippleSvg);
      }
    });
    const hubContent = [];
    if (!isLeftView && config.hub.brakeType === "6bolt") hubContent.push(path(create6BoltPath(center, center), { class: "hub-brake-mount" }));
    else if (!isLeftView && config.hub.brakeType === "centerlock") hubContent.push(renderCenterlockFaceRings2(center, center));
    if (config.hub.hubType === "straightpull") {
      hubContent.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), { class: "hub-flange-right" }));
      hubContent.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), { class: "hub-flange-left" }));
    } else {
      const showHoles = config.hub.showHubHoles === "visible";
      hubContent.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, showHoles), { class: "hub-flange-right" }));
      if (showHoles) {
        backHoles.forEach((point) => {
          hubContent.push(circle(point.x + 0.4, point.y + 0.4, 1.4, {
            fill: config.style.spokeColor === "black" ? "#343a40" : "#ced4da"
          }));
        });
      }
      hubContent.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, showHoles), { class: "hub-flange-left" }));
    }
    if (config.hub.hubPosition === "rear" && !isLeftView) {
      hubContent.push(renderFreehubFace2(center, center, config));
    }
    if (isLeftView && config.hub.brakeType === "6bolt") hubContent.push(path(create6BoltPath(center, center), { class: "hub-brake-mount" }));
    else if (isLeftView && config.hub.brakeType === "centerlock") hubContent.push(renderCenterlockFaceRings2(center, center));
    hubContent.push(circle(center, center, 9, { fill: "none", stroke: "#212529", "stroke-width": 6 }));
    const rim = tag("g", { id: "rimGroup" }, [
      circle(center, center, rimMidRadius, {
        fill: "transparent",
        stroke: "#343a40",
        "stroke-width": rimThickness
      }),
      circle(center, center, outerRadius, { class: "rim-outline" }),
      circle(center, center, innerRadius, { class: "rim-outline" }),
      circle(center, center, innerRadius + 1, { class: "rim-highlight" })
    ].join(""));
    const rimHoleSvg = tag("g", { class: "rim-holes-group" }, rimHoles.map((point) => circle(point.x, point.y, 2.2, { class: "rim-hole" })).join(""));
    const foregroundHubHeads = config.hub.hubType === "jbend" && config.hub.showHubHoles === "visible" ? frontHoles.map((point) => circle(point.x + 0.4, point.y + 0.4, 1.4, {
      fill: config.style.spokeColor === "black" ? "#343a40" : "#ced4da"
    })).join("") : "";
    const content = [
      rim,
      config.style.spokeLayering === "3d" ? tag("g", { class: `spoke-theme-${config.style.spokeColor} wheel-back-spokes` }, backSpokes.join("")) : "",
      config.style.spokeLayering === "3d" ? tag("g", { class: `nipple-theme-${config.style.nippleColor} wheel-back-nipples` }, backNipples.join("")) : "",
      tag("g", { class: "wheel-hub-face-group" }, hubContent.join("")),
      tag("g", { class: `spoke-theme-${config.style.spokeColor} wheel-front-spokes` }, frontSpokes.join("")),
      tag("g", { class: `nipple-theme-${config.style.nippleColor} wheel-front-nipples` }, frontNipples.join("")),
      rimHoleSvg,
      foregroundHubHeads ? tag("g", { class: "hub-spoke-heads-group" }, foregroundHubHeads) : "",
      renderValve(config, center, innerRadius)
    ].join("");
    return svgDocument(700, 700, "0 0 700 700", content, visualizerStyle(), { class: "wheel-svg" });
  }
};

// src/wheelSideSvgGenerator.js
var WheelSideSVGGenerator = class {
  render(options = {}) {
    const config = normalizeOptions(options);
    const cx = 100;
    const cy = 375;
    const rimCenter = cx + config.wheel.rimOffset;
    const outerRadius = config.wheel.outerDia / 2;
    const innerRadius = config.wheel.erd / 2;
    const leftHubRadius = config.hub.leftFlangeDia / 2;
    const rightHubRadius = config.hub.rightFlangeDia / 2;
    const leftHubX = cx - config.hub.leftFlangeCenter;
    const rightHubX = cx + config.hub.rightFlangeCenter;
    const rimDepth = (config.wheel.outerDia - config.wheel.erd) / 2;
    const width = config.wheel.rimWidth;
    const yOuterTop = cy - outerRadius;
    const yInnerTop = cy - innerRadius;
    const yMidTop = yOuterTop + rimDepth / 2;
    const yOuterBottom = cy + outerRadius;
    const yInnerBottom = cy + innerRadius;
    const yMidBottom = yOuterBottom - rimDepth / 2;
    const topPath = [
      `M ${rimCenter - width / 2} ${yOuterTop}`,
      `L ${rimCenter + width / 2} ${yOuterTop}`,
      `L ${rimCenter + width / 2} ${yMidTop}`,
      `L ${rimCenter + width / 6} ${yInnerTop}`,
      `L ${rimCenter - width / 6} ${yInnerTop}`,
      `L ${rimCenter - width / 2} ${yMidTop}`,
      "Z"
    ].join(" ");
    const bottomPath = [
      `M ${rimCenter - width / 6} ${yInnerBottom}`,
      `L ${rimCenter + width / 6} ${yInnerBottom}`,
      `L ${rimCenter + width / 2} ${yMidBottom}`,
      `L ${rimCenter + width / 2} ${yOuterBottom}`,
      `L ${rimCenter - width / 2} ${yOuterBottom}`,
      `L ${rimCenter - width / 2} ${yMidBottom}`,
      "Z"
    ].join(" ");
    const rimGroup = tag("g", { id: "rimGroup" }, [
      path(topPath, { class: "rim-body" }),
      path(bottomPath, { class: "rim-body" })
    ].join(""));
    const hubGroup = renderHubSideGroup(cx, cy, config);
    if (config.style.spokeLayering === "flat") {
      const spokes = [];
      const nipples = [];
      const draw = (hubPoint, rimPoint, side) => {
        spokes.push(line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, { class: `spoke spoke-${side} spoke-pulling` }));
        if (config.style.nippleStyle === "nipples") {
          const nipple = spokeNipple(hubPoint, rimPoint);
          nipples.push(line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: "spoke-nipple" }));
        }
      };
      draw({ x: leftHubX, y: cy - leftHubRadius }, { x: rimCenter, y: yInnerTop }, "left");
      draw({ x: rightHubX, y: cy - rightHubRadius }, { x: rimCenter, y: yInnerTop }, "right");
      draw({ x: leftHubX, y: cy + leftHubRadius }, { x: rimCenter, y: yInnerBottom }, "left");
      draw({ x: rightHubX, y: cy + rightHubRadius }, { x: rimCenter, y: yInnerBottom }, "right");
      return svgDocument(200, 750, "0 0 200 750", [
        tag("g", { class: `spoke-theme-${config.style.spokeColor}` }, spokes.join("")),
        hubGroup,
        tag("g", { class: `nipple-theme-${config.style.nippleColor}` }, nipples.join("")),
        rimGroup
      ].join(""), visualizerStyle(), { class: "wheel-svg" });
    }
    const spokesPerSide = config.wheel.spokeCount / 2;
    const rimStep = 2 * Math.PI / config.wheel.spokeCount;
    const hubStep = 2 * Math.PI / spokesPerSide;
    const safeCross = Math.floor(config.lacing.crossPattern);
    const patternShift = safeCross % 2 === 0 && safeCross > 0 ? 2 : 0;
    const hubAngleOffset = patternShift * rimStep;
    const backSpokes = [];
    const frontSpokes = [];
    const backNipples = [];
    const frontNipples = [];
    lacingMap(config).forEach((spoke) => {
      const isLeft = spoke.side === "left";
      const hubRadius = isLeft ? leftHubRadius : rightHubRadius;
      const hubX = isLeft ? leftHubX : rightHubX;
      const hubAngle = -Math.PI / 2 + rimStep / 2 + spoke.hubIndex * hubStep + hubAngleOffset + (isLeft ? 0 : hubStep / 2);
      const rimAngle = -Math.PI / 2 + rimStep / 2 + spoke.rimIndex * rimStep;
      const hubPoint = { x: hubX, y: cy + hubRadius * Math.sin(hubAngle) };
      const rimPoint = { x: rimCenter, y: cy + innerRadius * Math.sin(rimAngle) };
      const isFront = innerRadius * Math.cos(rimAngle) >= 0;
      const spokeSvg = line(hubPoint.x, hubPoint.y, rimPoint.x, rimPoint.y, {
        class: `spoke spoke-${spoke.side} spoke-${spoke.type}`
      });
      (isFront ? frontSpokes : backSpokes).push(spokeSvg);
      if (config.style.nippleStyle === "nipples") {
        const nipple = spokeNipple(hubPoint, rimPoint);
        const nippleSvg = line(rimPoint.x, rimPoint.y, nipple.x2, nipple.y2, { class: "spoke-nipple" });
        (isFront ? frontNipples : backNipples).push(nippleSvg);
      }
    });
    return svgDocument(200, 750, "0 0 200 750", [
      tag("g", { class: `spoke-theme-${config.style.spokeColor} wheel-back-spokes` }, backSpokes.join("")),
      tag("g", { class: `nipple-theme-${config.style.nippleColor} wheel-back-nipples` }, backNipples.join("")),
      hubGroup,
      tag("g", { class: `spoke-theme-${config.style.spokeColor} wheel-front-spokes` }, frontSpokes.join("")),
      tag("g", { class: `nipple-theme-${config.style.nippleColor} wheel-front-nipples` }, frontNipples.join("")),
      rimGroup
    ].join(""), visualizerStyle(), { class: "wheel-svg" });
  }
};

// src/index.js
var BicycleWheelSVG = class {
  constructor(config = {}) {
    this.config = config;
    this.faceGenerator = new WheelFaceSVGGenerator();
    this.sideGenerator = new WheelSideSVGGenerator();
    this.hubGenerator = new HubSVGGenerator();
  }
  options(options = {}) {
    return normalizeOptions({
      ...this.config,
      ...options,
      wheel: { ...this.config.wheel || {}, ...options.wheel || {} },
      hub: { ...this.config.hub || {}, ...options.hub || {} },
      lacing: { ...this.config.lacing || {}, ...options.lacing || {} },
      view: { ...this.config.view || {}, ...typeof options.view === "object" ? options.view : {} },
      style: { ...this.config.style || {}, ...typeof options.style === "object" ? options.style : {} }
    });
  }
  wheel(options = {}) {
    return this.wheelFace(options);
  }
  wheelFace(options = {}) {
    return this.faceGenerator.render(this.options(options));
  }
  wheelSide(options = {}) {
    return this.sideGenerator.render(this.options(options));
  }
  hubFace(options = {}) {
    return this.hubGenerator.renderFace(this.options(options));
  }
  hubSide(options = {}) {
    return this.hubGenerator.renderSide(this.options(options));
  }
  spokeBuild(options = {}) {
    return calculateWheelBuild(this.options(options));
  }
};
function renderWheelSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheel(options);
}
function renderWheelFaceSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheelFace(options);
}
function renderWheelSideSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheelSide(options);
}
function renderHubFaceSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).hubFace(options);
}
function renderHubSideSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).hubSide(options);
}
var index_default = BicycleWheelSVG;
//# sourceMappingURL=index.cjs.map

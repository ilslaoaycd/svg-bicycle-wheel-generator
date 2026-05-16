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
  HubSVGGenerator: () => HubSVGGenerator,
  WheelFaceSVGGenerator: () => WheelFaceSVGGenerator,
  WheelSideSVGGenerator: () => WheelSideSVGGenerator,
  calculateSpokeLength: () => calculateSpokeLength,
  calculateWheelBuild: () => calculateWheelBuild,
  default: () => index_default,
  hubHolePositions: () => hubHolePositions,
  lacingMap: () => lacingMap,
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
  leftFlangeDia: 58,
  rightFlangeDia: 52,
  leftFlangeCenter: 36.6,
  rightFlangeCenter: 23.3,
  spokeHoleDia: 2.6
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
    leftFlangeDia: options.leftFlangeDia,
    rightFlangeDia: options.rightFlangeDia,
    leftFlangeCenter: options.leftFlangeCenter,
    rightFlangeCenter: options.rightFlangeCenter,
    spokeHoleDia: options.spokeHoleDia
  };
  const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== void 0));
  const view = typeof options.view === "string" ? { wheelFaceSide: options.view, hubFaceSide: options.view } : options.view || {};
  return {
    wheel: { ...DEFAULT_WHEEL, ...compact(flatWheel), ...options.wheel || {} },
    hub: { ...DEFAULT_HUB, ...compact(flatHub), ...options.hub || {} },
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
function escapeText(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function attrs(attributes = {}) {
  return Object.entries(attributes).filter(([, value]) => value !== void 0 && value !== null && value !== false).map(([key, value]) => value === true ? key : `${key}="${escapeText(value)}"`).join(" ");
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
  return tag("path", { d, ...attributes }, null);
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
    .hub-flange-right{fill:#212529;stroke:#111;stroke-width:1;fill-rule:evenodd}
    .hub-flange-left{fill:#343a40;stroke:#1a1e21;stroke-width:1;fill-rule:evenodd}
    .hub-brake-mount{fill:#212529;stroke:#111;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder{fill:#343a40;stroke:#1a1e21;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder-dark{fill:#212529;stroke:#111;stroke-width:1;fill-rule:evenodd}
    .hub-cylinder-freehub{fill:#6c757d;stroke:#343a40;stroke-width:1;fill-rule:evenodd}
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
  let d = "";
  for (let index = 0; index < 6; index += 1) {
    const angle = index * (Math.PI / 3);
    const boltCenter = polar(cx, cy, 22, angle);
    const pRight = polar(boltCenter.x, boltCenter.y, 6, angle + Math.PI / 2);
    const pLeft = polar(boltCenter.x, boltCenter.y, 6, angle - Math.PI / 2);
    if (index === 0) d += `M ${pLeft.x} ${pLeft.y} `;
    else {
      const valley = polar(cx, cy, 15, angle - Math.PI / 6);
      d += `Q ${valley.x} ${valley.y} ${pLeft.x} ${pLeft.y} `;
    }
    d += `A 6 6 0 0 1 ${pRight.x} ${pRight.y} `;
  }
  const firstBolt = polar(cx, cy, 22, 0);
  const firstLeft = polar(firstBolt.x, firstBolt.y, 6, -Math.PI / 2);
  const lastValley = polar(cx, cy, 15, 5 * Math.PI / 3 + Math.PI / 6);
  d += `Q ${lastValley.x} ${lastValley.y} ${firstLeft.x} ${firstLeft.y} Z `;
  for (let index = 0; index < 6; index += 1) {
    const boltCenter = polar(cx, cy, 22, index * (Math.PI / 3));
    d += circlePath(boltCenter.x, boltCenter.y, 2.5, false);
  }
  d += circlePath(cx, cy, 6, false);
  return d;
}
function createCenterlockPath(cx, cy) {
  return `${circlePath(cx, cy, 21, true)}${circlePath(cx, cy, 6, false)}`;
}
function createHGFreehubFacePath(cx, cy) {
  const majorRadius = 17.45;
  const minorRadius = 15.9;
  const chamferDepth = 0.4;
  const chamferRad = 0.025;
  const standardSpline = 0.42;
  const narrowSpline = 0.2;
  const narrowValleyRight = 0.2;
  const wideValleyLeft = 0.4;
  const remaining = 2 * Math.PI - (8 * standardSpline + narrowSpline + narrowValleyRight + wideValleyLeft);
  const standardValley = remaining / 7;
  const pattern = [
    [narrowSpline, narrowValleyRight],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, standardValley],
    [standardSpline, wideValleyLeft]
  ];
  let d = "";
  let currentAngle = -Math.PI / 2 - narrowSpline / 2;
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
  return `${d}Z ${circlePath(cx, cy, 10, false)}`;
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
function createJBendFlangeSidePath(x, cy, flangeDia, spokesPerSide, hubStep, isLeft) {
  const width = 3;
  const height = flangeDia + 8;
  const startY = cy - flangeDia / 2 - 4;
  let d = `M ${x} ${startY} L ${x + width} ${startY} L ${x + width} ${startY + height} L ${x} ${startY + height} Z `;
  const radius = flangeDia / 2;
  const offset = isLeft ? 0 : hubStep / 2;
  for (let index = 0; index < spokesPerSide; index += 1) {
    const angle = -Math.PI / 2 + index * hubStep + offset;
    const holeY = cy + radius * Math.sin(angle);
    const apparentHeight = Math.max(0.3, 2.2 * Math.abs(Math.cos(angle)));
    const y = holeY - apparentHeight / 2;
    d += `M ${x} ${y} L ${x} ${y + apparentHeight} L ${x + width} ${y + apparentHeight} L ${x + width} ${y} Z `;
  }
  return d;
}
function renderValve(config, center, innerRadius) {
  const valve = polar(center, center, innerRadius, -Math.PI / 2);
  if (config.wheel.valveType === "presta") {
    return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)">${rect(-3, 0, 6, 48, { fill: "#adb5bd", rx: 1 })}${rect(-5, 0, 10, 3, { fill: "#6c757d", rx: 0.5 })}${rect(-2, 48, 4, 6, { fill: "#ced4da", rx: 0.5 })}</g>`;
  }
  if (config.wheel.valveType === "schrader") {
    return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)">${rect(-4, 0, 8, 30, { fill: "#343a40", rx: 1 })}${rect(-5, 0, 10, 3, { fill: "#6c757d", rx: 0.5 })}${rect(-4.5, 22, 9, 8, { fill: "#212529", rx: 1 })}</g>`;
  }
  return `<g class="wheel-valve-group" transform="translate(${valve.x} ${valve.y}) rotate(0)"><text class="valve-label" transform="rotate(90)" x="8" y="0" dominant-baseline="middle" text-anchor="start" letter-spacing="2">VALVE</text></g>`;
}
function spokeNipple(hubPoint, rimPoint) {
  const dx = hubPoint.x - rimPoint.x;
  const dy = hubPoint.y - rimPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return { x2: rimPoint.x + dx / distance * 10, y2: rimPoint.y + dy / distance * 10 };
}

// src/hubSvgGenerator.js
function renderHubSideGroup(cx, cy, config) {
  const old = config.hub.hubPosition === "front" ? 100 : 142;
  const leftFlangeDia = config.hub.leftFlangeDia;
  const rightFlangeDia = config.hub.rightFlangeDia;
  const leftCenter = config.hub.leftFlangeCenter;
  const rightCenter = config.hub.rightFlangeCenter;
  const leftEndX = cx - old / 2;
  const rightEndX = cx + old / 2;
  const leftFlangeX = cx - leftCenter;
  const rightFlangeX = cx + rightCenter;
  const leftFlangeTop = cy - leftFlangeDia / 2 + 2;
  const rightFlangeTop = cy - rightFlangeDia / 2 + 2;
  const waistTop = cy - 12;
  const groups = [];
  groups.push(rect(leftEndX, cy - 5, old, 10, { class: "hub-cylinder-dark" }));
  groups.push(rect(leftEndX - 4, cy - 9, 8, 18, { class: "hub-cylinder" }));
  groups.push(rect(rightEndX - 4, cy - 9, 8, 18, { class: "hub-cylinder" }));
  let leftHardwareX = leftEndX + 6;
  let rightHardwareX = rightEndX - 6;
  if (config.hub.brakeType === "6bolt") {
    groups.push(rect(leftEndX + 6, cy - 22, 6, 44, { class: "hub-brake-mount" }));
    leftHardwareX += 8;
  } else if (config.hub.brakeType === "centerlock") {
    groups.push(rect(leftEndX + 6, cy - 24, 8, 48, { class: "hub-brake-mount" }));
    for (let y = cy - 16; y < cy + 16; y += 3) {
      groups.push(line(leftEndX + 7, y, leftEndX + 13, y, { stroke: "#6c757d", "stroke-width": 1 }));
    }
    leftHardwareX += 10;
  }
  if (config.hub.hubPosition === "rear") {
    const freehubWidth = rightEndX - 6 - rightHardwareX;
    groups.push(rect(rightHardwareX, cy - 17.5, freehubWidth, 35, { class: "hub-cylinder-freehub" }));
    [-12, -7, -2, 3, 8, 13].forEach((offsetY) => {
      groups.push(line(rightHardwareX + 4, cy + offsetY, rightEndX - 10, cy + offsetY, {
        stroke: "#343a40",
        "stroke-width": 1
      }));
    });
    rightHardwareX -= 2;
  }
  const shellPath = [
    `M ${leftHardwareX} ${waistTop}`,
    `L ${leftFlangeX - 3} ${leftFlangeTop}`,
    `L ${leftFlangeX + 3} ${leftFlangeTop}`,
    `L ${leftFlangeX + 8} ${waistTop}`,
    `L ${rightFlangeX - 8} ${waistTop}`,
    `L ${rightFlangeX - 3} ${rightFlangeTop}`,
    `L ${rightFlangeX + 3} ${rightFlangeTop}`,
    `L ${rightHardwareX} ${waistTop}`,
    `L ${rightHardwareX} ${cy + 12}`,
    `L ${rightFlangeX + 3} ${cy + rightFlangeDia / 2 - 2}`,
    `L ${rightFlangeX - 3} ${cy + rightFlangeDia / 2 - 2}`,
    `L ${rightFlangeX - 8} ${cy + 12}`,
    `L ${leftFlangeX + 8} ${cy + 12}`,
    `L ${leftFlangeX + 3} ${cy + leftFlangeDia / 2 - 2}`,
    `L ${leftFlangeX - 3} ${cy + leftFlangeDia / 2 - 2}`,
    `L ${leftHardwareX} ${cy + 12}`,
    "Z"
  ].join(" ");
  groups.push(path(shellPath, { class: "hub-cylinder" }));
  const spokesPerSide = config.wheel.spokeCount / 2;
  const hubStep = 2 * Math.PI / spokesPerSide;
  if (config.hub.hubType === "jbend") {
    groups.push(path(createJBendFlangeSidePath(leftFlangeX, cy, leftFlangeDia, spokesPerSide, hubStep, true), {
      class: "hub-flange-left"
    }));
    groups.push(path(createJBendFlangeSidePath(rightFlangeX, cy, rightFlangeDia, spokesPerSide, hubStep, false), {
      class: "hub-flange-right"
    }));
  } else {
    groups.push(rect(leftFlangeX - 2, cy - leftFlangeDia / 2 - 4, 5, leftFlangeDia + 8, { class: "hub-flange-left" }));
    groups.push(rect(rightFlangeX - 2, cy - rightFlangeDia / 2 - 4, 5, rightFlangeDia + 8, { class: "hub-flange-right" }));
  }
  return tag("g", { class: "hub-side-group" }, groups.join(""));
}
var HubSVGGenerator = class {
  renderFace(options = {}) {
    const config = normalizeOptions(options);
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
    if (!isLeft && config.hub.brakeType === "6bolt") content.push(path(create6BoltPath(center, center), { class: "hub-brake-mount" }));
    if (!isLeft && config.hub.brakeType === "centerlock") content.push(path(createCenterlockPath(center, center), { class: "hub-brake-mount" }));
    if (config.hub.hubType === "straightpull") {
      content.push(path(createStraightPullFlangePath(center, center, backRadius, backHoles), { class: "hub-flange-right" }));
      content.push(path(createStraightPullFlangePath(center, center, frontRadius, frontHoles), { class: "hub-flange-left" }));
    } else {
      content.push(path(createJBendFlangePath(center, center, backRadius + 4, backHoles, true), { class: "hub-flange-right" }));
      content.push(path(createJBendFlangePath(center, center, frontRadius + 4, frontHoles, true), { class: "hub-flange-left" }));
    }
    if (config.hub.hubPosition === "rear" && !isLeft) {
      content.push(path(createHGFreehubFacePath(center, center), { class: "hub-cylinder-freehub" }));
    }
    if (isLeft && config.hub.brakeType === "6bolt") content.push(path(create6BoltPath(center, center), { class: "hub-brake-mount" }));
    if (isLeft && config.hub.brakeType === "centerlock") {
      content.push(path(createCenterlockPath(center, center), { class: "hub-brake-mount" }));
      content.push(circle(center, center, 18, { fill: "none", stroke: "#6c757d", "stroke-width": 4, "stroke-dasharray": "2 2" }));
      content.push(circle(center, center, 16, { fill: "none", stroke: "#212529", "stroke-width": 1 }));
    }
    content.push(circle(center, center, 9, { fill: "none", stroke: "#212529", "stroke-width": 6 }));
    return svgDocument(150, 150, "0 0 150 150", tag("g", { class: "hub-face-group" }, content.join("")), visualizerStyle(), {
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
    if (!isLeftView && config.hub.brakeType === "centerlock") hubContent.push(path(createCenterlockPath(center, center), { class: "hub-brake-mount" }));
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
      hubContent.push(path(createHGFreehubFacePath(center, center), { class: "hub-cylinder-freehub" }));
    }
    if (isLeftView && config.hub.brakeType === "6bolt") hubContent.push(path(create6BoltPath(center, center), { class: "hub-brake-mount" }));
    if (isLeftView && config.hub.brakeType === "centerlock") {
      hubContent.push(path(createCenterlockPath(center, center), { class: "hub-brake-mount" }));
      hubContent.push(circle(center, center, 18, { fill: "none", stroke: "#6c757d", "stroke-width": 4, "stroke-dasharray": "2 2" }));
      hubContent.push(circle(center, center, 16, { fill: "none", stroke: "#212529", "stroke-width": 1 }));
    }
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

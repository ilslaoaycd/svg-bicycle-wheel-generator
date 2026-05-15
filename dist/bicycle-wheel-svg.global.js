var BicycleWheelSVG = (() => {
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
    resolveStylePreset: () => resolveStylePreset,
    rimHolePositions: () => rimHolePositions,
    stylePresets: () => stylePresets,
    validateWheelBuild: () => validateWheelBuild
  });

  // src/math.js
  var DEFAULT_WHEEL = {
    erd: 601,
    outerDiameter: 622,
    rimDepth: 24,
    rimWidth: 24,
    rimOffset: 0,
    spokeCount: 32,
    valveAngle: -90
  };
  var DEFAULT_HUB = {
    old: 100,
    leftFlangeDia: 44,
    rightFlangeDia: 44,
    leftFlangeCenter: 22.4,
    rightFlangeCenter: 35,
    spokeHoleDia: 2.6,
    axleDiameter: 12,
    shellDiameter: 32
  };
  var DEFAULT_LACING = {
    leftCross: 3,
    rightCross: 3,
    leftPattern: "cross",
    rightPattern: "cross"
  };
  function round(value, decimals = 1) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  function polar(centerX, centerY, radius, angle) {
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }
  function normalizeOptions(options = {}) {
    return {
      ...options,
      wheel: { ...DEFAULT_WHEEL, ...options.wheel || {} },
      hub: { ...DEFAULT_HUB, ...options.hub || {} },
      lacing: { ...DEFAULT_LACING, ...options.lacing || {} },
      view: options.view || "both",
      style: options.style || "technical",
      styleConfig: options.styleConfig || {},
      cassette: {
        enabled: false,
        cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 52],
        selectedCog: 18,
        style: "xrayCassette",
        ...options.cassette || {}
      }
    };
  }
  function calculateSpokeLength(params) {
    const theta = 4 * Math.PI * params.crossPattern / params.spokeCount;
    const erdRadius = params.erd / 2;
    const flangeRadius = params.flangeDia / 2;
    const planarDistance = Math.sqrt(
      erdRadius ** 2 + flangeRadius ** 2 - 2 * erdRadius * flangeRadius * Math.cos(theta)
    );
    return Math.sqrt(planarDistance ** 2 + params.flangeCenter ** 2) - params.spokeHoleDia / 2 + (params.lengthAdjustment || 0);
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
      crossPattern: lacing.leftPattern === "radial" ? 0 : lacing.leftCross,
      lengthAdjustment: options.lengthAdjustment || 0
    });
    const right = calculateSpokeLength({
      erd: wheel.erd,
      flangeDia: hub.rightFlangeDia,
      flangeCenter: hub.rightFlangeCenter,
      spokeHoleDia: hub.spokeHoleDia,
      spokeCount: wheel.spokeCount,
      crossPattern: lacing.rightPattern === "radial" ? 0 : lacing.rightCross,
      lengthAdjustment: options.lengthAdjustment || 0
    });
    return {
      left,
      right,
      roundedLeft: round(left, 1),
      roundedRight: round(right, 1)
    };
  }
  function validateWheelBuild(options = {}) {
    const { wheel, hub, lacing } = normalizeOptions(options);
    const warnings = [];
    const numbers = [
      ["ERD", wheel.erd],
      ["hub OLD", hub.old],
      ["left flange PCD", hub.leftFlangeDia],
      ["right flange PCD", hub.rightFlangeDia],
      ["left center-to-flange", hub.leftFlangeCenter],
      ["right center-to-flange", hub.rightFlangeCenter],
      ["spoke hole diameter", hub.spokeHoleDia],
      ["spoke count", wheel.spokeCount],
      ["left cross pattern", lacing.leftCross],
      ["right cross pattern", lacing.rightCross]
    ];
    numbers.forEach(([label, value]) => {
      if (!Number.isFinite(value)) warnings.push(`${label} must be a number.`);
    });
    if (Number.isFinite(wheel.spokeCount)) {
      if (wheel.spokeCount < 4 || wheel.spokeCount % 2 !== 0) {
        warnings.push("Spoke count must be an even number of at least 4.");
      }
      const spokesPerSide = wheel.spokeCount / 2;
      [["left", lacing.leftCross], ["right", lacing.rightCross]].forEach(([side, crosses]) => {
        if (crosses > 0 && crosses >= spokesPerSide / 2) {
          warnings.push(`${side} ${crosses}x is too high for a ${wheel.spokeCount} spoke wheel.`);
        }
      });
    }
    if (Number.isFinite(wheel.rimOffset) && wheel.rimOffset !== 0) {
      warnings.push("Rim offset is shown in previews but is not compensated in spoke length by default.");
    }
    return warnings;
  }
  function rimHolePositions(options = {}, layout = {}) {
    const config = normalizeOptions(options);
    const centerX = layout.centerX || 0;
    const centerY = layout.centerY || 0;
    const radius = layout.radius || config.wheel.erd / 2;
    const offset = layout.offset || 0;
    const count = config.wheel.spokeCount;
    const step = 2 * Math.PI / count;
    const start = degreesToRadians(config.wheel.valveAngle) + step / 2;
    return Array.from({ length: count }, (_item, index) => ({
      index,
      angle: start + index * step,
      ...polar(centerX + offset, centerY, radius, start + index * step)
    }));
  }
  function hubHolePositions(options = {}, layout = {}) {
    const config = normalizeOptions(options);
    const centerX = layout.centerX || 0;
    const centerY = layout.centerY || 0;
    const radiusScale = layout.radiusScale || 1;
    const count = config.wheel.spokeCount / 2;
    const step = 2 * Math.PI / count;
    const start = degreesToRadians(config.wheel.valveAngle) + 2 * Math.PI / config.wheel.spokeCount / 2;
    const leftRadius = config.hub.leftFlangeDia / 2 * radiusScale;
    const rightRadius = config.hub.rightFlangeDia / 2 * radiusScale;
    return {
      left: Array.from({ length: count }, (_item, index) => ({
        index,
        angle: start + index * step,
        ...polar(centerX, centerY, leftRadius, start + index * step)
      })),
      right: Array.from({ length: count }, (_item, index) => ({
        index,
        angle: start + step / 2 + index * step,
        ...polar(centerX, centerY, rightRadius, start + step / 2 + index * step)
      }))
    };
  }
  function lacingMap(options = {}) {
    const config = normalizeOptions(options);
    const count = config.wheel.spokeCount;
    const spokesPerSide = count / 2;
    function sideMap(side, rimOffset, crosses, pattern) {
      return Array.from({ length: spokesPerSide }, (_item, index) => {
        const isPulling = index % 2 === 0;
        const crossOffset = pattern === "radial" ? 0 : crosses * 2;
        const rawIndex = pattern === "radial" ? index * 2 + rimOffset : index * 2 + (isPulling ? crossOffset : -crossOffset) + rimOffset;
        return {
          side,
          hubIndex: index,
          rimIndex: (Math.round(rawIndex) % count + count) % count,
          type: isPulling ? "pulling" : "trailing",
          crosses: pattern === "radial" ? 0 : crosses
        };
      });
    }
    return [
      ...sideMap("left", 0, config.lacing.leftCross, config.lacing.leftPattern),
      ...sideMap("right", 1, config.lacing.rightCross, config.lacing.rightPattern)
    ];
  }

  // src/presets.js
  var stylePresets = {
    technical: {
      background: "#ffffff",
      rimFill: "#424c57",
      rimInnerFill: "#ffffff",
      rimStroke: "#202832",
      leftSpoke: "#2563eb",
      rightSpoke: "#f97316",
      mutedSpoke: "#94a3b8",
      hubFill: "#1f2933",
      hubStroke: "#0f1720",
      holeFill: "#ffffff",
      marker: "#c0392b",
      guide: "#d7dee8",
      text: "#344054",
      dimension: "#10b981"
    },
    blueprint: {
      background: "#f7fbff",
      rimFill: "#dbeafe",
      rimInnerFill: "#f7fbff",
      rimStroke: "#1e40af",
      leftSpoke: "#2563eb",
      rightSpoke: "#0f766e",
      mutedSpoke: "#93c5fd",
      hubFill: "#bfdbfe",
      hubStroke: "#1d4ed8",
      holeFill: "#ffffff",
      marker: "#dc2626",
      guide: "#bfdbfe",
      text: "#1e3a8a",
      dimension: "#0891b2"
    },
    productPreview: {
      background: "#ffffff",
      rimFill: "#111827",
      rimInnerFill: "#ffffff",
      rimStroke: "#030712",
      leftSpoke: "#71717a",
      rightSpoke: "#3f3f46",
      mutedSpoke: "#a1a1aa",
      hubFill: "#27272a",
      hubStroke: "#09090b",
      holeFill: "#f8fafc",
      marker: "#ef4444",
      guide: "#e5e7eb",
      text: "#27272a",
      dimension: "#84cc16"
    },
    debug: {
      background: "#ffffff",
      rimFill: "#334155",
      rimInnerFill: "#ffffff",
      rimStroke: "#0f172a",
      leftSpoke: "#2563eb",
      rightSpoke: "#f97316",
      mutedSpoke: "#64748b",
      hubFill: "#111827",
      hubStroke: "#020617",
      holeFill: "#ffffff",
      marker: "#b91c1c",
      guide: "#cbd5e1",
      text: "#0f172a",
      dimension: "#eab308",
      showLabels: true
    }
  };
  function resolveStylePreset(style, overrides = {}) {
    const base = typeof style === "string" ? stylePresets[style] || stylePresets.technical : style || {};
    return { ...base, ...overrides };
  }

  // src/svg.js
  function fmt(value) {
    return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : String(value);
  }
  function attrs(attributes = {}) {
    return Object.entries(attributes).filter(([, value]) => value !== void 0 && value !== null && value !== false).map(([key, value]) => value === true ? key : `${key}="${String(value)}"`).join(" ");
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
  function text(x, y, content, attributes = {}) {
    return tag("text", { x: fmt(x), y: fmt(y), ...attributes }, escapeText(content));
  }
  function escapeText(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  function svgDocument(width, height, viewBox, content, style = "") {
    return tag("svg", { xmlns: "http://www.w3.org/2000/svg", width, height, viewBox }, `${style ? tag("style", {}, style) : ""}${content}`);
  }
  function baseStyle(style) {
    return `
    .wheel-bg{fill:${style.background}}
    .wheel-guide{stroke:${style.guide};stroke-width:1}
    .wheel-rim{fill:${style.rimFill};stroke:${style.rimStroke};stroke-width:2}
    .wheel-rim-inner{fill:${style.rimInnerFill};stroke:${style.rimStroke};stroke-width:1}
    .wheel-spoke{fill:none;stroke-linecap:round;stroke-width:2.2}
    .wheel-spoke.left{stroke:${style.leftSpoke}}
    .wheel-spoke.right{stroke:${style.rightSpoke}}
    .wheel-spoke.muted{stroke:${style.mutedSpoke};opacity:.42}
    .wheel-spoke.trailing{stroke-dasharray:7 5}
    .wheel-hub{fill:${style.hubFill};stroke:${style.hubStroke};stroke-width:2}
    .wheel-hole{fill:${style.holeFill};stroke:${style.marker};stroke-width:2}
    .wheel-marker{fill:${style.marker};stroke:${style.holeFill};stroke-width:3}
    .wheel-label{fill:${style.text};font:600 16px system-ui,sans-serif}
    .wheel-dim{stroke:${style.dimension};stroke-width:3;fill:none;stroke-linecap:round}
    .wheel-dim-text{fill:${style.text};font:600 14px system-ui,sans-serif}
    .wheel-shell{fill:${style.hubFill};stroke:${style.hubStroke};stroke-width:2}
    .wheel-cassette-slot svg{overflow:visible}
  `;
  }

  // src/wheelGeometry.js
  function createFaceGeometry(options = {}) {
    const config = normalizeOptions(options);
    const center = 325;
    const outerRadius = 290;
    const erdRadius = 270;
    const rimInnerRadius = Math.max(180, erdRadius - config.wheel.rimDepth * 1.6);
    const rimOffsetPixels = config.wheel.rimOffset * 3;
    const radiusScale = erdRadius / (config.wheel.erd / 2);
    const holes = rimHolePositions(config, { centerX: center, centerY: center, radius: erdRadius, offset: rimOffsetPixels });
    const hubHoles = hubHolePositions(config, { centerX: center, centerY: center, radiusScale });
    const lacing = lacingMap(config);
    return { config, center, outerRadius, erdRadius, rimInnerRadius, rimOffsetPixels, radiusScale, holes, hubHoles, lacing };
  }

  // src/hubSvgGenerator.js
  var HubSVGGenerator = class {
    renderFace(options = {}) {
      const config = normalizeOptions(options);
      const style = resolveStylePreset(config.style, config.styleConfig);
      const geometry = createFaceGeometry(config);
      const scale = 2.5;
      const leftRadius = config.hub.leftFlangeDia / 2 * scale;
      const rightRadius = config.hub.rightFlangeDia / 2 * scale;
      const center = 180;
      const convert = (point) => ({
        x: center + (point.x - geometry.center) / geometry.radiusScale * scale,
        y: center + (point.y - geometry.center) / geometry.radiusScale * scale
      });
      const content = [
        rect(0, 0, 360, 360, { class: "wheel-bg" }),
        circle(center, center, leftRadius, { class: "wheel-hub left" }),
        circle(center, center, rightRadius, { class: "wheel-hub right", opacity: ".7" }),
        circle(center, center, config.hub.shellDiameter * 1.2, { class: "wheel-shell" }),
        circle(center, center, config.hub.axleDiameter * 1.2, { fill: style.holeFill, stroke: style.hubStroke, "stroke-width": 2 }),
        tag("g", { class: "wheel-hub-face-holes" }, [...geometry.hubHoles.left, ...geometry.hubHoles.right].map((point) => {
          const p = convert(point);
          return circle(p.x, p.y, 4, { class: "wheel-hole" });
        }).join("")),
        text(center, 34, `${config.wheel.spokeCount}h hub face`, { class: "wheel-label", "text-anchor": "middle" })
      ].join("");
      return svgDocument(360, 360, "0 0 360 360", content, baseStyle(style));
    }
    renderSide(options = {}) {
      const config = normalizeOptions(options);
      const style = resolveStylePreset(config.style, config.styleConfig);
      const centerX = 360;
      const hubY = 175;
      const scale = Math.min(4.1, 440 / Math.max(config.hub.old, 1));
      const leftEdge = centerX - config.hub.old * scale / 2;
      const rightEdge = centerX + config.hub.old * scale / 2;
      const leftFlangeX = centerX - config.hub.leftFlangeCenter * scale;
      const rightFlangeX = centerX + config.hub.rightFlangeCenter * scale;
      const leftHalf = Math.max(24, config.hub.leftFlangeDia * 1.2);
      const rightHalf = Math.max(24, config.hub.rightFlangeDia * 1.2);
      const shellHalf = Math.max(24, config.hub.shellDiameter * 1.2);
      const shellPath = [
        `M ${leftEdge + 42} ${hubY - shellHalf}`,
        `L ${leftFlangeX - 10} ${hubY - leftHalf}`,
        `L ${leftFlangeX + 16} ${hubY - shellHalf * 0.7}`,
        `L ${rightFlangeX - 16} ${hubY - shellHalf * 0.7}`,
        `L ${rightFlangeX + 10} ${hubY - rightHalf}`,
        `L ${rightEdge - 42} ${hubY - shellHalf}`,
        `L ${rightEdge - 42} ${hubY + shellHalf}`,
        `L ${rightFlangeX + 10} ${hubY + rightHalf}`,
        `L ${rightFlangeX - 16} ${hubY + shellHalf * 0.7}`,
        `L ${leftFlangeX + 16} ${hubY + shellHalf * 0.7}`,
        `L ${leftFlangeX - 10} ${hubY + leftHalf}`,
        `L ${leftEdge + 42} ${hubY + shellHalf}`,
        "Z"
      ].join(" ");
      const content = [
        rect(0, 0, 720, 350, { class: "wheel-bg" }),
        line(centerX, 42, centerX, 308, { class: "wheel-guide", "stroke-dasharray": "8 8" }),
        rect(leftEdge - 34, hubY - 7, rightEdge - leftEdge + 68, 14, { class: "wheel-shell", rx: 4 }),
        rect(leftEdge - 22, hubY - 20, 34, 40, { class: "wheel-shell", rx: 5 }),
        rect(rightEdge - 12, hubY - 20, 34, 40, { class: "wheel-shell", rx: 5 }),
        path(shellPath, { class: "wheel-shell" }),
        line(leftFlangeX, hubY - leftHalf, leftFlangeX, hubY + leftHalf, { class: "wheel-dim left-flange" }),
        line(rightFlangeX, hubY - rightHalf, rightFlangeX, hubY + rightHalf, { class: "wheel-dim right-flange" }),
        line(leftEdge, 60, rightEdge, 60, { class: "wheel-dim" }),
        line(leftEdge, 48, leftEdge, 72, { class: "wheel-dim" }),
        line(rightEdge, 48, rightEdge, 72, { class: "wheel-dim" }),
        text(centerX, 38, `OLD ${config.hub.old.toFixed(1)}mm`, { class: "wheel-dim-text", "text-anchor": "middle" }),
        text(leftFlangeX, hubY + leftHalf + 26, `L ${config.hub.leftFlangeDia.toFixed(1)} PCD`, { class: "wheel-dim-text", "text-anchor": "middle" }),
        text(rightFlangeX, hubY + rightHalf + 26, `R ${config.hub.rightFlangeDia.toFixed(1)} PCD`, { class: "wheel-dim-text", "text-anchor": "middle" })
      ].join("");
      return svgDocument(720, 350, "0 0 720 350", content, baseStyle(style));
    }
  };

  // src/wheelFaceSvgGenerator.js
  var WheelFaceSVGGenerator = class {
    render(options = {}) {
      const config = normalizeOptions(options);
      const style = resolveStylePreset(config.style, config.styleConfig);
      const geometry = createFaceGeometry(config);
      const activeView = config.view || "both";
      const showSide = (side) => activeView === "both" || activeView === side || activeView === "detail";
      const groups = [];
      groups.push(tag("rect", { class: "wheel-bg", x: 0, y: 0, width: 650, height: 650 }, null));
      groups.push(tag("g", { class: "wheel-rim-group" }, [
        circle(geometry.center + geometry.rimOffsetPixels, geometry.center, geometry.outerRadius, { class: "wheel-rim" }),
        circle(geometry.center + geometry.rimOffsetPixels, geometry.center, geometry.rimInnerRadius, { class: "wheel-rim-inner" })
      ].join("")));
      groups.push(tag("g", { class: "wheel-spokes-group" }, geometry.lacing.map((spoke) => {
        const hub = geometry.hubHoles[spoke.side][spoke.hubIndex];
        const rim = geometry.holes[spoke.rimIndex];
        const muted = showSide(spoke.side) ? "" : " muted";
        return line(hub.x, hub.y, rim.x, rim.y, {
          class: `wheel-spoke ${spoke.side} ${spoke.type}${muted}`,
          "data-side": spoke.side,
          "data-rim-index": spoke.rimIndex,
          "data-hub-index": spoke.hubIndex
        });
      }).join("")));
      groups.push(tag("g", { class: "wheel-hub-face-group" }, [
        circle(geometry.center, geometry.center, Math.max(18, config.hub.leftFlangeDia / 2 * geometry.radiusScale), {
          class: `wheel-hub left${showSide("left") ? "" : " muted"}`
        }),
        circle(geometry.center, geometry.center, Math.max(18, config.hub.rightFlangeDia / 2 * geometry.radiusScale), {
          class: `wheel-hub right${showSide("right") ? "" : " muted"}`,
          opacity: "0.72"
        }),
        circle(geometry.center, geometry.center, Math.max(15, config.hub.shellDiameter * 0.7), { class: "wheel-hub shell" })
      ].join("")));
      groups.push(tag("g", { class: "wheel-rim-holes-group" }, geometry.holes.map((point, index) => {
        const label = style.showLabels && index % 2 === 0 ? text(point.x, point.y - 8, index + 1, { class: "wheel-dim-text", "text-anchor": "middle" }) : "";
        return circle(point.x, point.y, activeView === "detail" ? 3.5 : 2.8, { class: "wheel-hole" }) + label;
      }).join("")));
      const hubHoleSvg = [...geometry.hubHoles.left, ...geometry.hubHoles.right].map((point) => circle(point.x, point.y, 3.2, { class: "wheel-hole hub-hole" })).join("");
      groups.push(tag("g", { class: "wheel-hub-holes-group" }, hubHoleSvg));
      const valve = geometry.holes[0];
      groups.push(tag("g", { class: "wheel-valve-group" }, [
        line(geometry.center + geometry.rimOffsetPixels, geometry.center, valve.x, valve.y, { class: "wheel-dim valve-line" }),
        circle(valve.x, valve.y, 7, { class: "wheel-marker" }),
        text(valve.x, valve.y - 17, "Valve", { class: "wheel-label", "text-anchor": "middle" })
      ].join("")));
      if (config.cassette.enabled) groups.push(this.renderCassette(config));
      return svgDocument(650, 650, "0 0 650 650", groups.join(""), baseStyle(style));
    }
    renderCassette(config) {
      const renderer = config.cassette.renderer;
      if (typeof renderer !== "function") {
        return tag("g", { class: "wheel-cassette-placeholder", transform: "translate(325 325)" }, [
          circle(0, 0, 48, { fill: "none", stroke: "#64748b", "stroke-width": 8, "stroke-dasharray": "6 5" }),
          text(0, 5, "cassette", { class: "wheel-dim-text", "text-anchor": "middle" })
        ].join(""));
      }
      return tag("g", { class: "wheel-cassette-slot", transform: "translate(325 325) scale(.36) translate(-160 -160)" }, renderer({
        cogs: config.cassette.cogs,
        selectedCog: config.cassette.selectedCog,
        style: config.cassette.style
      }));
    }
  };

  // src/wheelSideSvgGenerator.js
  var WheelSideSVGGenerator = class {
    render(options = {}) {
      const config = normalizeOptions(options);
      const style = resolveStylePreset(config.style, config.styleConfig);
      const centerX = 360;
      const topY = 44;
      const hubY = 298;
      const rimScale = Math.min(0.78, 500 / Math.max(config.wheel.erd, 1));
      const hubScale = Math.min(4.1, 420 / Math.max(config.hub.old, 1));
      const rimHalfWidth = Math.max(14, config.wheel.rimWidth * rimScale * 1.9 / 2);
      const rimDepth = Math.max(18, config.wheel.rimDepth * rimScale * 2.2);
      const leftRimX = centerX - rimHalfWidth + config.wheel.rimOffset * 2.4;
      const rightRimX = centerX + rimHalfWidth + config.wheel.rimOffset * 2.4;
      const leftFlangeX = centerX - config.hub.leftFlangeCenter * hubScale;
      const rightFlangeX = centerX + config.hub.rightFlangeCenter * hubScale;
      const leftEdge = centerX - config.hub.old * hubScale / 2;
      const rightEdge = centerX + config.hub.old * hubScale / 2;
      const shellHalf = Math.max(22, config.hub.shellDiameter * 1.1);
      const leftAngle = Math.atan2(Math.abs(leftRimX - leftFlangeX), hubY - topY) * 180 / Math.PI;
      const rightAngle = Math.atan2(Math.abs(rightRimX - rightFlangeX), hubY - topY) * 180 / Math.PI;
      const rimPath = `M ${leftRimX} ${topY} L ${rightRimX} ${topY} L ${rightRimX - 5} ${topY + rimDepth} L ${leftRimX + 5} ${topY + rimDepth} Z`;
      const hubPath = [
        `M ${leftEdge + 36} ${hubY - shellHalf}`,
        `L ${leftFlangeX - 12} ${hubY - shellHalf * 1.3}`,
        `L ${leftFlangeX + 16} ${hubY - shellHalf * 0.62}`,
        `L ${rightFlangeX - 16} ${hubY - shellHalf * 0.62}`,
        `L ${rightFlangeX + 12} ${hubY - shellHalf * 1.3}`,
        `L ${rightEdge - 36} ${hubY - shellHalf}`,
        `L ${rightEdge - 36} ${hubY + shellHalf}`,
        `L ${rightFlangeX + 12} ${hubY + shellHalf * 1.3}`,
        `L ${rightFlangeX - 16} ${hubY + shellHalf * 0.62}`,
        `L ${leftFlangeX + 16} ${hubY + shellHalf * 0.62}`,
        `L ${leftFlangeX - 12} ${hubY + shellHalf * 1.3}`,
        `L ${leftEdge + 36} ${hubY + shellHalf}`,
        "Z"
      ].join(" ");
      const content = [
        rect(0, 0, 720, 380, { class: "wheel-bg" }),
        line(centerX, 24, centerX, 356, { class: "wheel-guide", "stroke-dasharray": "8 8" }),
        path(rimPath, { class: "wheel-rim side-rim" }),
        line(leftRimX, topY + rimDepth, leftFlangeX, hubY - shellHalf, { class: "wheel-spoke left" }),
        line(rightRimX, topY + rimDepth, rightFlangeX, hubY - shellHalf, { class: "wheel-spoke right" }),
        line(rightRimX, topY + rimDepth, leftFlangeX, hubY + shellHalf, { class: "wheel-spoke left trailing" }),
        line(leftRimX, topY + rimDepth, rightFlangeX, hubY + shellHalf, { class: "wheel-spoke right trailing" }),
        rect(leftEdge - 34, hubY - 7, rightEdge - leftEdge + 68, 14, { class: "wheel-shell", rx: 4 }),
        path(hubPath, { class: "wheel-shell" }),
        line(leftFlangeX, hubY - 70, leftFlangeX, hubY + 70, { class: "wheel-dim" }),
        line(rightFlangeX, hubY - 70, rightFlangeX, hubY + 70, { class: "wheel-dim" }),
        line(leftRimX, topY - 14, rightRimX, topY - 14, { class: "wheel-dim" }),
        text(centerX, topY - 22, `${config.wheel.rimWidth.toFixed(1)}mm rim`, { class: "wheel-dim-text", "text-anchor": "middle" }),
        text(centerX, 350, `Bracing angles L ${leftAngle.toFixed(1)}deg / R ${rightAngle.toFixed(1)}deg`, { class: "wheel-dim-text", "text-anchor": "middle" })
      ].join("");
      return svgDocument(720, 380, "0 0 720 380", content, baseStyle(style));
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
        styleConfig: { ...this.config.styleConfig || {}, ...options.styleConfig || {} },
        cassette: { ...this.config.cassette || {}, ...options.cassette || {} }
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
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=bicycle-wheel-svg.global.js.map

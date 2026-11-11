import { HubSVGGenerator } from './hubSvgGenerator.js';
import {
  SPOKE_LINE_STYLES,
  STYLE_PRESETS,
  defineStylePreset,
  showRimHoles,
  hubPaintStyles,
  resolveStyleOptions
} from './styles.js';
import {
  calculateSpokeLength,
  calculateRearHubMount,
  calculateWheelBuild,
  effectiveCross,
  HUB_PRESETS,
  hubHolePositions,
  isStraightPull,
  lacingMap,
  lateralSpokeDistance,
  maxRimOffset,
  straightPullDesignedCross,
  normalizeFreehubType,
  normalizeOptions,
  rimHolePositions,
  validateWheelBuild
} from './math.js';
import { WheelFaceSVGGenerator } from './wheelFaceSvgGenerator.js';
import { WheelSideSVGGenerator } from './wheelSideSvgGenerator.js';

export class BicycleWheelSVG {
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
      wheel: { ...(this.config.wheel || {}), ...(options.wheel || {}) },
      hub: { ...(this.config.hub || {}), ...(options.hub || {}) },
      lacing: { ...(this.config.lacing || {}), ...(options.lacing || {}) },
      view: { ...(this.config.view || {}), ...(typeof options.view === 'object' ? options.view : {}) },
      style: { ...(this.config.style || {}), ...(typeof options.style === 'object' ? options.style : {}) }
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
}

export function renderWheelSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheel(options);
}

export function renderWheelFaceSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheelFace(options);
}

export function renderWheelSideSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).wheelSide(options);
}

export function renderHubFaceSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).hubFace(options);
}

export function renderHubSideSvg(options = {}) {
  return new BicycleWheelSVG(options.generatorConfig).hubSide(options);
}

export function renderWheelFaceGroup(options = {}) {
  const svg = renderWheelFaceSvg(options);
  return `<g class="wheel-face-embedded">${svg}</g>`;
}

export function renderWheelSideGroup(options = {}) {
  const svg = renderWheelSideSvg(options);
  return `<g class="wheel-side-embedded">${svg}</g>`;
}

export {
  HubSVGGenerator,
  WheelFaceSVGGenerator,
  WheelSideSVGGenerator,
  calculateSpokeLength,
  calculateRearHubMount,
  calculateWheelBuild,
  effectiveCross,
  HUB_PRESETS,
  SPOKE_LINE_STYLES,
  STYLE_PRESETS,
  showRimHoles,
  hubHolePositions,
  isStraightPull,
  lateralSpokeDistance,
  maxRimOffset,
  straightPullDesignedCross,
  defineStylePreset,
  hubPaintStyles,
  lacingMap,
  normalizeFreehubType,
  normalizeOptions,
  resolveStyleOptions,
  rimHolePositions,
  validateWheelBuild
};

export default BicycleWheelSVG;

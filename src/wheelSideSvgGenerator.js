import { normalizeOptions } from './math.js';
import { resolveStylePreset } from './presets.js';
import { baseStyle, line, path, rect, svgDocument, text } from './svg.js';

export class WheelSideSVGGenerator {
  render(options = {}) {
    const config = normalizeOptions(options);
    const style = resolveStylePreset(config.style, config.styleConfig);
    const centerX = 360;
    const topY = 44;
    const hubY = 298;
    const rimScale = Math.min(0.78, 500 / Math.max(config.wheel.erd, 1));
    const hubScale = Math.min(4.1, 420 / Math.max(config.hub.old, 1));
    const rimHalfWidth = Math.max(14, (config.wheel.rimWidth * rimScale * 1.9) / 2);
    const rimDepth = Math.max(18, config.wheel.rimDepth * rimScale * 2.2);
    const leftRimX = centerX - rimHalfWidth + (config.wheel.rimOffset * 2.4);
    const rightRimX = centerX + rimHalfWidth + (config.wheel.rimOffset * 2.4);
    const leftFlangeX = centerX - (config.hub.leftFlangeCenter * hubScale);
    const rightFlangeX = centerX + (config.hub.rightFlangeCenter * hubScale);
    const leftEdge = centerX - ((config.hub.old * hubScale) / 2);
    const rightEdge = centerX + ((config.hub.old * hubScale) / 2);
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
      'Z'
    ].join(' ');
    const content = [
      rect(0, 0, 720, 380, { class: 'wheel-bg' }),
      line(centerX, 24, centerX, 356, { class: 'wheel-guide', 'stroke-dasharray': '8 8' }),
      path(rimPath, { class: 'wheel-rim side-rim' }),
      line(leftRimX, topY + rimDepth, leftFlangeX, hubY - shellHalf, { class: 'wheel-spoke left' }),
      line(rightRimX, topY + rimDepth, rightFlangeX, hubY - shellHalf, { class: 'wheel-spoke right' }),
      line(rightRimX, topY + rimDepth, leftFlangeX, hubY + shellHalf, { class: 'wheel-spoke left trailing' }),
      line(leftRimX, topY + rimDepth, rightFlangeX, hubY + shellHalf, { class: 'wheel-spoke right trailing' }),
      rect(leftEdge - 34, hubY - 7, (rightEdge - leftEdge) + 68, 14, { class: 'wheel-shell', rx: 4 }),
      path(hubPath, { class: 'wheel-shell' }),
      line(leftFlangeX, hubY - 70, leftFlangeX, hubY + 70, { class: 'wheel-dim' }),
      line(rightFlangeX, hubY - 70, rightFlangeX, hubY + 70, { class: 'wheel-dim' }),
      line(leftRimX, topY - 14, rightRimX, topY - 14, { class: 'wheel-dim' }),
      text(centerX, topY - 22, `${config.wheel.rimWidth.toFixed(1)}mm rim`, { class: 'wheel-dim-text', 'text-anchor': 'middle' }),
      text(centerX, 350, `Bracing angles L ${leftAngle.toFixed(1)}deg / R ${rightAngle.toFixed(1)}deg`, { class: 'wheel-dim-text', 'text-anchor': 'middle' })
    ].join('');

    return svgDocument(720, 380, '0 0 720 380', content, baseStyle(style));
  }
}

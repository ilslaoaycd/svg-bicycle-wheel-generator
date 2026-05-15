import { normalizeOptions } from './math.js';
import { resolveStylePreset } from './presets.js';
import { baseStyle, circle, line, path, rect, svgDocument, tag, text } from './svg.js';
import { createFaceGeometry } from './wheelGeometry.js';

export class HubSVGGenerator {
  renderFace(options = {}) {
    const config = normalizeOptions(options);
    const style = resolveStylePreset(config.style, config.styleConfig);
    const geometry = createFaceGeometry(config);
    const scale = 2.5;
    const leftRadius = (config.hub.leftFlangeDia / 2) * scale;
    const rightRadius = (config.hub.rightFlangeDia / 2) * scale;
    const center = 180;
    const convert = (point) => ({
      x: center + ((point.x - geometry.center) / geometry.radiusScale) * scale,
      y: center + ((point.y - geometry.center) / geometry.radiusScale) * scale
    });
    const content = [
      rect(0, 0, 360, 360, { class: 'wheel-bg' }),
      circle(center, center, leftRadius, { class: 'wheel-hub left' }),
      circle(center, center, rightRadius, { class: 'wheel-hub right', opacity: '.7' }),
      circle(center, center, config.hub.shellDiameter * 1.2, { class: 'wheel-shell' }),
      circle(center, center, config.hub.axleDiameter * 1.2, { fill: style.holeFill, stroke: style.hubStroke, 'stroke-width': 2 }),
      tag('g', { class: 'wheel-hub-face-holes' }, [...geometry.hubHoles.left, ...geometry.hubHoles.right].map((point) => {
        const p = convert(point);
        return circle(p.x, p.y, 4, { class: 'wheel-hole' });
      }).join('')),
      text(center, 34, `${config.wheel.spokeCount}h hub face`, { class: 'wheel-label', 'text-anchor': 'middle' })
    ].join('');

    return svgDocument(360, 360, '0 0 360 360', content, baseStyle(style));
  }

  renderSide(options = {}) {
    const config = normalizeOptions(options);
    const style = resolveStylePreset(config.style, config.styleConfig);
    const centerX = 360;
    const hubY = 175;
    const scale = Math.min(4.1, 440 / Math.max(config.hub.old, 1));
    const leftEdge = centerX - ((config.hub.old * scale) / 2);
    const rightEdge = centerX + ((config.hub.old * scale) / 2);
    const leftFlangeX = centerX - (config.hub.leftFlangeCenter * scale);
    const rightFlangeX = centerX + (config.hub.rightFlangeCenter * scale);
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
      'Z'
    ].join(' ');
    const content = [
      rect(0, 0, 720, 350, { class: 'wheel-bg' }),
      line(centerX, 42, centerX, 308, { class: 'wheel-guide', 'stroke-dasharray': '8 8' }),
      rect(leftEdge - 34, hubY - 7, (rightEdge - leftEdge) + 68, 14, { class: 'wheel-shell', rx: 4 }),
      rect(leftEdge - 22, hubY - 20, 34, 40, { class: 'wheel-shell', rx: 5 }),
      rect(rightEdge - 12, hubY - 20, 34, 40, { class: 'wheel-shell', rx: 5 }),
      path(shellPath, { class: 'wheel-shell' }),
      line(leftFlangeX, hubY - leftHalf, leftFlangeX, hubY + leftHalf, { class: 'wheel-dim left-flange' }),
      line(rightFlangeX, hubY - rightHalf, rightFlangeX, hubY + rightHalf, { class: 'wheel-dim right-flange' }),
      line(leftEdge, 60, rightEdge, 60, { class: 'wheel-dim' }),
      line(leftEdge, 48, leftEdge, 72, { class: 'wheel-dim' }),
      line(rightEdge, 48, rightEdge, 72, { class: 'wheel-dim' }),
      text(centerX, 38, `OLD ${config.hub.old.toFixed(1)}mm`, { class: 'wheel-dim-text', 'text-anchor': 'middle' }),
      text(leftFlangeX, hubY + leftHalf + 26, `L ${config.hub.leftFlangeDia.toFixed(1)} PCD`, { class: 'wheel-dim-text', 'text-anchor': 'middle' }),
      text(rightFlangeX, hubY + rightHalf + 26, `R ${config.hub.rightFlangeDia.toFixed(1)} PCD`, { class: 'wheel-dim-text', 'text-anchor': 'middle' })
    ].join('');

    return svgDocument(720, 350, '0 0 720 350', content, baseStyle(style));
  }
}

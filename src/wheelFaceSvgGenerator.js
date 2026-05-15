import { normalizeOptions } from './math.js';
import { resolveStylePreset } from './presets.js';
import { baseStyle, circle, line, svgDocument, tag, text } from './svg.js';
import { createFaceGeometry } from './wheelGeometry.js';

export class WheelFaceSVGGenerator {
  render(options = {}) {
    const config = normalizeOptions(options);
    const style = resolveStylePreset(config.style, config.styleConfig);
    const geometry = createFaceGeometry(config);
    const activeView = config.view || 'both';
    const showSide = (side) => activeView === 'both' || activeView === side || activeView === 'detail';
    const groups = [];

    groups.push(tag('rect', { class: 'wheel-bg', x: 0, y: 0, width: 650, height: 650 }, null));
    groups.push(tag('g', { class: 'wheel-rim-group' }, [
      circle(geometry.center + geometry.rimOffsetPixels, geometry.center, geometry.outerRadius, { class: 'wheel-rim' }),
      circle(geometry.center + geometry.rimOffsetPixels, geometry.center, geometry.rimInnerRadius, { class: 'wheel-rim-inner' })
    ].join('')));

    groups.push(tag('g', { class: 'wheel-spokes-group' }, geometry.lacing.map((spoke) => {
      const hub = geometry.hubHoles[spoke.side][spoke.hubIndex];
      const rim = geometry.holes[spoke.rimIndex];
      const muted = showSide(spoke.side) ? '' : ' muted';
      return line(hub.x, hub.y, rim.x, rim.y, {
        class: `wheel-spoke ${spoke.side} ${spoke.type}${muted}`,
        'data-side': spoke.side,
        'data-rim-index': spoke.rimIndex,
        'data-hub-index': spoke.hubIndex
      });
    }).join('')));

    groups.push(tag('g', { class: 'wheel-hub-face-group' }, [
      circle(geometry.center, geometry.center, Math.max(18, (config.hub.leftFlangeDia / 2) * geometry.radiusScale), {
        class: `wheel-hub left${showSide('left') ? '' : ' muted'}`
      }),
      circle(geometry.center, geometry.center, Math.max(18, (config.hub.rightFlangeDia / 2) * geometry.radiusScale), {
        class: `wheel-hub right${showSide('right') ? '' : ' muted'}`,
        opacity: '0.72'
      }),
      circle(geometry.center, geometry.center, Math.max(15, config.hub.shellDiameter * 0.7), { class: 'wheel-hub shell' })
    ].join('')));

    groups.push(tag('g', { class: 'wheel-rim-holes-group' }, geometry.holes.map((point, index) => {
      const label = style.showLabels && index % 2 === 0
        ? text(point.x, point.y - 8, index + 1, { class: 'wheel-dim-text', 'text-anchor': 'middle' })
        : '';
      return circle(point.x, point.y, activeView === 'detail' ? 3.5 : 2.8, { class: 'wheel-hole' }) + label;
    }).join('')));

    const hubHoleSvg = [...geometry.hubHoles.left, ...geometry.hubHoles.right]
      .map((point) => circle(point.x, point.y, 3.2, { class: 'wheel-hole hub-hole' }))
      .join('');
    groups.push(tag('g', { class: 'wheel-hub-holes-group' }, hubHoleSvg));

    const valve = geometry.holes[0];
    groups.push(tag('g', { class: 'wheel-valve-group' }, [
      line(geometry.center + geometry.rimOffsetPixels, geometry.center, valve.x, valve.y, { class: 'wheel-dim valve-line' }),
      circle(valve.x, valve.y, 7, { class: 'wheel-marker' }),
      text(valve.x, valve.y - 17, 'Valve', { class: 'wheel-label', 'text-anchor': 'middle' })
    ].join('')));

    if (config.cassette.enabled) groups.push(this.renderCassette(config));

    return svgDocument(650, 650, '0 0 650 650', groups.join(''), baseStyle(style));
  }

  renderCassette(config) {
    const renderer = config.cassette.renderer;
    if (typeof renderer !== 'function') {
      return tag('g', { class: 'wheel-cassette-placeholder', transform: 'translate(325 325)' }, [
        circle(0, 0, 48, { fill: 'none', stroke: '#64748b', 'stroke-width': 8, 'stroke-dasharray': '6 5' }),
        text(0, 5, 'cassette', { class: 'wheel-dim-text', 'text-anchor': 'middle' })
      ].join(''));
    }

    return tag('g', { class: 'wheel-cassette-slot', transform: 'translate(325 325) scale(.36) translate(-160 -160)' }, renderer({
      cogs: config.cassette.cogs,
      selectedCog: config.cassette.selectedCog,
      style: config.cassette.style
    }));
  }
}

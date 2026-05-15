export function fmt(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : String(value);
}

export function attrs(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? key : `${key}="${String(value)}"`)
    .join(' ');
}

export function tag(name, attributes = {}, content = '') {
  const attributeText = attrs(attributes);
  const open = attributeText ? `<${name} ${attributeText}` : `<${name}`;
  return content === null ? `${open}/>` : `${open}>${content}</${name}>`;
}

export function line(x1, y1, x2, y2, attributes = {}) {
  return tag('line', { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), ...attributes }, null);
}

export function circle(cx, cy, r, attributes = {}) {
  return tag('circle', { cx: fmt(cx), cy: fmt(cy), r: fmt(r), ...attributes }, null);
}

export function rect(x, y, width, height, attributes = {}) {
  return tag('rect', { x: fmt(x), y: fmt(y), width: fmt(width), height: fmt(height), ...attributes }, null);
}

export function path(d, attributes = {}) {
  return tag('path', { d, ...attributes }, null);
}

export function text(x, y, content, attributes = {}) {
  return tag('text', { x: fmt(x), y: fmt(y), ...attributes }, escapeText(content));
}

export function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function svgDocument(width, height, viewBox, content, style = '') {
  return tag('svg', { xmlns: 'http://www.w3.org/2000/svg', width, height, viewBox }, `${style ? tag('style', {}, style) : ''}${content}`);
}

export function baseStyle(style) {
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

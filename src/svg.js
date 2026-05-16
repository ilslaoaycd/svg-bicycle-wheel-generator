export function fmt(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : String(value);
}

export function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function attrs(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? key : `${key}="${escapeText(value)}"`)
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

export function svgDocument(width, height, viewBox, content, style = '', attributes = {}) {
  return tag('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox,
    preserveAspectRatio: 'xMidYMid meet',
    ...attributes
  }, `${style ? tag('style', {}, style) : ''}${content}`);
}

export function visualizerStyle() {
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

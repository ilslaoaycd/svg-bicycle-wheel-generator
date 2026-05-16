# Contributing

Thanks for helping improve the SVG Bicycle Wheel Generator.

## Development

```bash
npm install
npm test
```

The test command builds the package, regenerates the checked-in SVG examples,
and runs the Node.js test suite.

## Guidelines

- Keep runtime code DOM-free and Node-free so it works in browsers, bundlers,
  server renderers, and script tags.
- Prefer pure geometry helpers that return SVG strings.
- Update examples and tests when public rendering behavior changes.

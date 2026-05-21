# Gemini Handoff Prompt: Realistic Blueprint Hub Renderer

You are helping improve a JavaScript SVG bicycle hub generator. Use the attached generated hub images, SVG files, and source files as the current state. Your task is to redesign the hub rendering model so the output looks like realistic bicycle hubs in a clean technical/blueprint illustration style.

Do not stop after one pass. Work iteratively: generate or modify the renderer, inspect the produced images, critique them against the references, then continue improving until you are satisfied that the hub body shape, freehub, brake mounts, flanges, endcaps, spacing, and part transitions look mechanically plausible.

## Visual Goal

Create realistic looking rear bicycle hubs with isolated, recognizable parts:

- Hub shell/body
- Left and right flanges
- Brake mount: 6-bolt or centerlock
- Freehub body
- Endcaps and axle bore
- Bearing shoulders, collars, lockrings, and small stepped hardware

The hub should look like a real machined metal component, not a flat icon, black silhouette, toy diagram, or UI shape.

## Required Styles

Implement two visual modes:

1. `realistic`
   - Grey and black hub rendering.
   - Use solid fills, strokes, hatching, stippling, contour lines, and small shadow shapes.
   - Do not use SVG gradients.
   - Use layered grey fills to imply machining, depth, and cylindrical form.
   - Smooth curved profiles are required, especially around the shell shoulders, flange transitions, and endcaps.

2. `blueprint`
   - Black/blue only preview.
   - White or transparent background.
   - Use blue strokes, pale blue fills, dashed construction lines, and clean technical outlines.
   - Do not use gradients.

Both modes must use the same underlying geometry so the blueprint preview and realistic render match.

## Geometry Requirements

Model the side view as an axial stack of separate parts instead of one large silhouette:

- Non-drive endcap
- Brake mount stack
- Left flange
- Left shell shoulder
- Central hub body
- Right shell shoulder
- Right flange
- Bearing/freehub shoulder
- Freehub body
- Drive-side endcap

Use real hub dimensions where available:

- `builtInDimension`
- `leftFlangeDia`
- `rightFlangeDia`
- `leftFlangeCenter`
- `rightFlangeCenter`
- `flangeThickness`
- `freehubLength`
- `freehubDia`
- `brakeMountWidth`
- `brakeMountDia`
- `endcapLength`
- `endcapDia`

Preserve spacing: flanges must be visually centered at the configured center-to-flange positions. Brake mount, freehub, and endcaps should not float or overlap awkwardly.

## Shape Requirements

### Hub Body

- Replace angular polygon bodies with smooth machined contours.
- Use cubic curves or carefully segmented arcs for shell tapers.
- Avoid hooks, sharp accidental notches, and concave artifacts.
- DT Swiss-style shells should be smooth, understated, and tapered.
- Industry Nine-style shells should be more sculpted, with stronger shoulders and scalloped/fluted cues.

### Flanges

- Draw flanges as thick machined discs/rings, not vertical rectangular strips.
- Use bevel lines and visible thickness.
- Spoke holes should be small, correctly spaced, and should not look like giant square slots.
- Industry Nine flanges should have scalloped perimeter or pocket shapes.
- DT Swiss flanges should be cleaner and less ornate.

### Freehub

- The freehub side view must look like a splined cylinder.
- Use lengthwise ribs/splines along the freehub body, not horizontal ladder stripes.
- Include stepped shoulders, outer lockring/thread step, and drive-side bore/endcap transition.
- Differentiate HG, XD/XDR, and road-HG if possible:
  - HG/road-HG: longer straight splined cylinder with many even ribs.
  - XD/XDR: narrower/tapered or stepped outer thread area with fewer, sharper cues.

### Brake Mounts

- 6-bolt side view should look like a rotor mounting flange with bolt bosses/holes and a thin mounting face, not a detached flat plate.
- Centerlock side view should look like a serrated/splined cylindrical stack with lockring and bearing shoulder.
- Brake mount should sit near the non-drive endcap and integrate naturally with the hub shell.

### Endcaps

- Endcaps should be stepped cylinders with bore marks, chamfers, and shoulders.
- Avoid rounded rectangular UI-pill shapes.
- Show the axle centerline subtly.

## Output Requirements

Update the generator so these presets render well:

- `dt-swiss-350-mtb-boost-rear-6bolt`
- `dt-swiss-240-exp-boost-rear-centerlock`
- `industry-nine-hydra2-boost-rear-6bolt`
- `industry-nine-solix-road-rear-centerlock`

Generate and visually inspect:

- Side SVG and PNG for all four hubs in `blueprint` mode.
- Side SVG and PNG for all four hubs in `realistic` mode.
- Face SVG and PNG for at least one 6-bolt hub and one centerlock hub.
- A contact sheet comparing all generated side views.

Continue iterating until the generated images meet these acceptance criteria:

- No black silhouettes.
- No unstyled SVG output in PNG screenshots.
- No gradients.
- Hub parts are visually distinct.
- Freehub splines run lengthwise and look mechanically plausible.
- Brake mount types are visually distinguishable.
- Endcaps look cylindrical and machined.
- Shell transitions are smooth and natural.
- Model-specific silhouettes differ meaningfully between DT Swiss and Industry Nine.

## Files To Inspect

Start with:

- `src/hubSvgGenerator.js`
- `src/math.js`
- `src/svg.js`
- `scripts/generate-examples.mjs`
- `examples/hub-comparison.md`

Use the attached PNG/SVG examples as visual starting points, not as final quality.

## Suggested Implementation Direction

- Introduce a reusable axial-part layout model.
- Create helper functions for machined cylinders, bevel rings, collars, tapered shells, flange discs, centerlock spline stacks, 6-bolt boss rings, and freehub spline bodies.
- Keep SVG output pure string generation and DOM-free.
- Prefer inline SVG attributes for critical fills/strokes because PNG rendering tools may not honor CSS classes.
- Add tests that confirm model-specific classes/details exist, but rely on visual inspection for final quality.

## Final Response Requested

When finished, report:

- What files changed.
- What images were generated.
- Which images you inspected.
- What iterations you performed and what visual issues you fixed.
- Any remaining realism limitations.

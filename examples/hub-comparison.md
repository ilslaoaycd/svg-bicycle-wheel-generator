# Hub Blueprint Comparison

Generated hub samples compare the SVG model against manufacturer product pages, official engineering drawings, and reputable wheelbuilding dimension tables. Product images are referenced as feedback sources rather than copied into this repository.

Static visualizer: [SVG](svg/hub-appearance-visualizer.svg)

| Hub | Source basis | Generated side sample | Visual feedback applied |
| --- | --- | --- | --- |
| DT Swiss 350 MTB Boost Rear 6-Bolt | DT Swiss MTB 350 product page and Velodrop DT Swiss MTB Classic dimensions | [Blueprint SVG](svg/hub-dt-swiss-350-mtb-boost-rear-6bolt-side.svg) / [Realistic SVG](svg/hub-dt-swiss-350-mtb-boost-rear-6bolt-realistic-side.svg) | Smooth tapered shell, compact 6-bolt brake shoulder, asymmetric 60/50.5 mm flanges, and 148 mm Boost spacing. |
| DT Swiss 240 EXP Boost Rear Center Lock | DT Swiss 240 product page and Velodrop DT Swiss MTB Classic dimensions | [Blueprint SVG](svg/hub-dt-swiss-240-exp-boost-rear-centerlock-side.svg) / [Realistic SVG](svg/hub-dt-swiss-240-exp-boost-rear-centerlock-realistic-side.svg) | Slimmer DT Swiss shell, equal 50.4 mm centerlock flanges, short centerlock spline stack, and visible bearing rings. |
| Industry Nine Hydra2 Classic 12x148 Rear 6-Bolt | Industry Nine official Hydra2 28h rear 12x148 6-bolt XD drawing | [Blueprint SVG](svg/hub-industry-nine-hydra2-boost-rear-6bolt-side.svg) / [Realistic SVG](svg/hub-industry-nine-hydra2-boost-rear-6bolt-realistic-side.svg) | Larger 59.5/62 mm flanges, scalloped flange pockets, fluted shell cues, and six-bolt hardware. |
| Industry Nine Solix CL Road Rear | Industry Nine Solix CL product page and Modern Bike wheelbuilding dimensions | [Blueprint SVG](svg/hub-industry-nine-solix-road-rear-centerlock-side.svg) / [Realistic SVG](svg/hub-industry-nine-solix-road-rear-centerlock-realistic-side.svg) | Road centerlock profile with scalloped flanges, smaller left flange, tall drive-side flange, and compact 142 mm spacing. |

## Source Links

- DT Swiss 350 MTB: https://www.dtswiss.com/en/components/hubs-and-rws/hubs-mtb/350
- DT Swiss 240: https://www.dtswiss.com/en/components/hubs-and-rws/hubs-road/240
- DT Swiss wheelbuilding dimensions: https://velodrop.com/resources/hubs/dt-swiss-mtb-classic-hub-dimensions/
- Industry Nine Hydra2 drawing: https://industrynine.com/documents/hydra2-classic-28h-rear-12x148-6b-xd.pdf
- Industry Nine Solix CL: https://industrynine.com/hubs/road_disc/solix-cl-rear/
- Industry Nine Solix dimensions fill-in: https://www.modernbike.com/405682

## Model Notes

- DT Swiss presets bias toward smooth, tapered shell surfaces with restrained lightening-slot cues.
- Industry Nine presets bias toward scalloped flanges and shell fluting because those are strong visual identifiers in engineering drawings and product references.
- The second-pass side renderer uses smooth hubshell profiles, stepped endcaps, serrated centerlock stacks, six-bolt boss rings, and lengthwise freehub splines.
- The output remains blueprint-like: dimensionally suggestive, cleanly stroked, and source-driven rather than photorealistic.

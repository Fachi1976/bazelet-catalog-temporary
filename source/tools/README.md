# Model tools (3D "Brand it" parts)

Scripts used to edit the .glb models with glTF-Transform (`npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer`).
Paths inside are from the session that wrote them; adjust `M` in `lib.mjs` to a folder holding the models **before** the change (the scripts are not idempotent).

- `lib.mjs` – helpers: `pouch()` (two-sided printable pouch, artboard 450 x 150 mm), `label()` (bottle label 85 x 35 mm), `save()`
- `step1.mjs` – gift-box pouch + bottle labels (dropper, oil box, spritzer, spritzer box)
- `step2.mjs` – standard-box pouch, standalone pouches (`anim-pouch-h/v.glb`), single-tube carton (`anim-tube-box.glb`)
- `build.mjs` – flower + oil master box with the two inner cartons
- `art.py` – demo artwork and clean templates for the pouch and the label
- `cap2.py` – headless captures of a product page (open / sample / upload a file / camera orbit)

## Static studio images (`blender/`)
Blender runs as a Python module: `pip install bpy`. `plain.mjs` decodes a model for import, `render.py` renders it closed or open
(Cycles, shadow catcher, the catalog's studio HDR), `batch.sh` runs a set, `post.py` matches scale and colour to an existing
image of the same category, cleans the floor shadow and writes 1024 x 1024 PNGs.

## Notes from 24.11
- `save()` and `ao.mjs` call `prune({ keepSolidTextures: true, keepAttributes: true })`. With the defaults, a second save strips the
  texture coordinates of parts whose material has no texture yet (pouches, labels) and the print stops showing.
- `ao.mjs` clears the baked vertex-colour shading on the printed outer skin (it showed as dark bands and dashes).
- `step6.mjs`: oil carton 42 x 42 x 85 (dieline-16), DOY carton mapping on CD1316, closed DOY pouch bottom, jar stickers.

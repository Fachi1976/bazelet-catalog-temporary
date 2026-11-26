#!/bin/bash
cd /home/claude/work; MD=/home/claude/bazelet-catalog-temporary/images/models
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.6 KEY=28 RES=1024
for m in tube tube-slim tube-2; do node bl/plain.mjs $MD/anim-$m.glb bl/$m.glb
  python3 bl/render.py bl/$m.glb bl/out_$m-closed.png closed 40 >/dev/null 2>&1; python3 bl/render.py bl/$m.glb bl/out_$m-open.png open 40 >/dev/null 2>&1; echo "$m done $(date +%T)"; done
echo ALL DONE

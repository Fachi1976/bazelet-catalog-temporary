#!/bin/bash
cd /home/claude/work
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.38 KEY=14 RES=1630
for m in cone-15 cone-05 cone-025; do python3 bl/render.py bl/$m.glb bl/outhi_$m.png closed 40 >/dev/null 2>&1; echo "$m done $(date +%T)"; done
export RES=1024
for m in tube tube-slim tube-2; do python3 bl/render.py bl/$m.glb bl/out_$m-open.png open 40 >/dev/null 2>&1; echo "$m done $(date +%T)"; done
echo ALL DONE

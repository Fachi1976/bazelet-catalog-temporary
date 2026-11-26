#!/bin/bash
cd /home/claude/work
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.6 KEY=28 RES=1024
for m in p05 p15 p2; do python3 bl/render.py bl/card-$m.glb bl/out_card-$m.png closed 40 >/dev/null 2>&1; python3 bl/render.py bl/card-$m.glb bl/out_card-$m-hover.png open 40 >/dev/null 2>&1; echo "$m done $(date +%T)"; done
echo ALL DONE

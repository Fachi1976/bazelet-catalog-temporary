#!/bin/bash
cd /home/claude/work; MD=/home/claude/bazelet-catalog-temporary/images/models
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.6 KEY=28
for m in slims-gift slims-std dropper oil-box spritzer-box; do node bl/plain.mjs $MD/anim-$m.glb bl/$m.glb; done
for m in slims-gift dropper; do RES=512 python3 bl/render.py bl/$m.glb bl/cal_$m.png 16 >/dev/null 2>&1; echo "cal $m done"; done
export RES=1024
r(){ python3 bl/render.py bl/$1.glb bl/out_$2.png $3 40 >/dev/null 2>&1; echo "$2 done $(date +%T)"; }
r slims-std preroll-slims-closed closed
r slims-std preroll-slims-open open
r oil-box oil-bottle-box closed
r oil-box oil-bottle-box-open open
r spritzer-box oil-spritzer-box closed
r spritzer-box oil-spritzer-box-open open
echo ALL DONE

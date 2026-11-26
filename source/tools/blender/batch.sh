#!/bin/bash
cd /home/claude/work; MD=/home/claude/bazelet-catalog-temporary/images/models
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.6 KEY=28
for m in flower-gift slims-std oilcombo flower-oil flower5; do node bl/plain.mjs $MD/anim-$m.glb bl/$m.glb; done
for m in flower-gift slims-std oilcombo; do RES=512 python3 bl/render.py bl/$m.glb bl/cal_$m.png 16 >/dev/null 2>&1; echo "cal $m done"; done
export RES=1024
r(){ python3 bl/render.py bl/$1.glb bl/out_$2.png $3 40 >/dev/null 2>&1; echo "$2 done $(date +%T)"; }
r flower-gift flower-box-premium-open open
r slims-std preroll-slims-open open
r oilcombo combo-preroll-oil-open open
r flower-oil combo-flower-oil-closed closed
r flower-oil combo-flower-oil-open open
r flower5 combo-flower-oil-flower-open open
echo ALL DONE

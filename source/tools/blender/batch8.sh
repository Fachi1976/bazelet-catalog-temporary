#!/bin/bash
cd /home/claude/work
while ! grep -q "ALL DONE" bl/batch7.log; do sleep 10; done
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.38 KEY=14 RES=1630
for m in cone-05 cone-15 cone-025; do python3 bl/render.py bl/$m.glb bl/outhi_$m.png closed 40 >/dev/null 2>&1; echo "$m done $(date +%T)"; done
echo ALL DONE

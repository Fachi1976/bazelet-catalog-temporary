#!/bin/bash
cd /home/claude/work
export LENS=70 R=1.0 TH=25 EL=28 ENV=0.6 KEY=28 RES=1024
r(){ python3 bl/render.py bl/$1.glb bl/out_$2.png $3 40 >/dev/null 2>&1; echo "$2 done $(date +%T)"; }
r card-slims card-prerolls-05 closed
r card-slims card-prerolls-05-hover open
r card-oil card-oil closed
r card-oil card-oil-hover open
echo ALL DONE

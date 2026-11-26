# Category cards of the standing pre-roll packs: ONE scale (px per mm) for all three packs, closed and open.
import sys; sys.path.insert(0,'/home/claude/work/bl')
from post_all import *
from PIL import Image
import shutil
_,g=calib('combo-preroll-oil-closed.png','oilcombo')
size,top,bottom=1200,16,1124
names=['p05','p15','p2']; L={}
for n in names:
    for st in ('','-hover'):
        o=obj_layer(Image.open(B+f'out_card-{n}{st}.png').convert('RGBA'),g); L[n+st]=o.crop(o.getchannel('A').point(lambda v:255 if v>6 else 0).getbbox())
bb={k:solid(o,199).getbbox() for k,o in L.items()}
k=min((bottom-top)/max(b[3]-b[1] for b in bb.values()), (size-60)/max(b[2]-b[0] for b in bb.values()))
print('common scale',round(k,3),{kk:(b[2]-b[0],b[3]-b[1]) for kk,b in bb.items()})
for n,dst in zip(names,('prerolls-05','prerolls-15','prerolls-2')):
    S={st:L[n+st].resize((round(L[n+st].width*k),round(L[n+st].height*k)),Image.LANCZOS) for st in ('','-hover')}
    bs={st:solid(o,199).getbbox() for st,o in S.items()}; right=round(size/2+(bs[''][2]-bs[''][0])/2)
    for st in ('','-hover'):
        b=bs[st]; c=Image.new('RGBA',(size,size),(0,0,0,0)); x=max(4,min(size-4-S[st].width+0, right-b[2])); c.alpha_composite(S[st],(x,bottom-b[3])); out=shadow_for(c); out.alpha_composite(c)
        out.resize((600,600),Image.LANCZOS).save(OUT+dst+st+'.webp',quality=92,method=6)
for st in ('','-hover'): shutil.copy(OUT+'prerolls-05'+st+'.webp',OUT+'prerolls'+st+'.webp')
C='/home/claude/bazelet-catalog-temporary/images/cards/'
s=Image.new('RGB',(4*400,800),(236,239,243))
for i,n in enumerate(['prerolls-05','prerolls-025','prerolls-15','prerolls-2']):
    for j,st in enumerate(('','-hover')):
        f=(OUT if n!='prerolls-025' else C)+n+st+'.webp'
        try: im=Image.open(f).convert('RGBA').resize((400,400)); s.paste(im,(i*400,j*400),im)
        except Exception as e: print('missing',f)
s.save('/home/claude/work/cards5.png')

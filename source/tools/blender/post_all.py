# Finish the studio renders: scale and tone to match the existing set, and give every image the same soft contact shadow
# as the original stills (the rendered directional shadow is dropped).
import numpy as np, sys
from PIL import Image, ImageFilter, ImageStat
B='/home/claude/work/bl/'; REF=B+'orig/'; OUT=B+'fin/'
import os; os.makedirs(OUT,exist_ok=True)
def solid(im, th=235): return im.getchannel('A').point(lambda v:255 if v>th else 0)
def mean(im): return ImageStat.Stat(im.convert('RGB'), solid(im,250)).mean
def obj_layer(raw, gain):
    """object only (no floor), anti-aliased edge kept, edge colours taken from the object (no bright fringe)"""
    A=np.array(raw.getchannel('A')).astype(np.float32); rgb=np.array(raw.convert('RGB')).astype(np.float32)*np.array(gain)[None,None,:]
    sol=(A>=200); solI=Image.fromarray((sol*255).astype('uint8')); near=np.array(solI.filter(ImageFilter.MaxFilter(5)))>0
    w=np.array(solI.filter(ImageFilter.GaussianBlur(2.5))).astype(np.float32)/255+1e-4
    bleed=np.stack([np.array(Image.fromarray((rgb[...,c]*sol).clip(0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(2.5))).astype(np.float32)/w for c in range(3)],-1)
    rgb=np.where(sol[...,None],rgb,bleed).clip(0,255); a=np.where(sol,255,np.where(near,A,0))
    return Image.fromarray(np.dstack([rgb,a]).astype('uint8'),'RGBA')
def shadow_for(canvas):
    S=np.array(canvas.getchannel('A'))>=200; ys,xs=np.where(S); x0,x1,y0,y1=int(xs.min()),int(xs.max()),int(ys.min()),int(ys.max()); w=float(x1-x0); h=float(y1-y0)
    # footprint: the lowest strip of the silhouette in every column (only in the lower half, so open lids cast nothing in the air)
    H_=S.shape[0]; rows=np.arange(H_)[:,None]; low=np.where(S,rows,-1).max(0); t=max(0.06*h,14)
    band=S&(rows>=low[None,:]-t)&(low[None,:]>=y0+0.55*h)
    bI=Image.fromarray((band*255).astype('uint8'))
    wide=np.array(bI.filter(ImageFilter.GaussianBlur(0.15*w+22))).astype(np.float32); tight=np.array(bI.filter(ImageFilter.GaussianBlur(0.045*w+7))).astype(np.float32)
    a=wide/max(wide.max(),1)*92+tight/max(tight.max(),1)*58
    d=int(0.035*w+4); a=np.vstack([np.zeros((d,a.shape[1]),a.dtype),a[:-d]]).clip(0,170)   # shift down without wrapping
    a[:max(0,y0-2),:]=0
    # fade out towards the canvas border so the shadow never ends in a straight cut
    Hh,Ww=a.shape; m=0.07*Ww; ry=np.minimum(np.arange(Hh),Hh-1-np.arange(Hh))[:,None]/m; rx=np.minimum(np.arange(Ww),Ww-1-np.arange(Ww))[None,:]/m
    a=a*np.clip(np.minimum(ry,rx),0,1)
    return Image.fromarray(np.dstack([np.zeros(a.shape+(3,)),a]).astype('uint8'),'RGBA')
def finish(raw, k, gain, size=1024, fit=None, place=None):
    o=obj_layer(raw,gain); bb=o.getchannel('A').point(lambda v:255 if v>6 else 0).getbbox(); o=o.crop(bb)
    if fit:   # category cards: fit the object's height
        sb=solid(o,199).getbbox(); k=fit/(sb[3]-sb[1])
    o=o.resize((max(1,round(o.width*k)),max(1,round(o.height*k))),Image.LANCZOS)
    lim=size-70; s=min(1,lim/max(o.size))
    if s<1: o=o.resize((round(o.width*s),round(o.height*s)),Image.LANCZOS)
    sb=solid(o,199).getbbox(); cx,cy=place or (size/2,size/2)
    ox=round(cx-(sb[0]+sb[2])/2); oy=round(cy-(sb[1]+sb[3])/2) if not fit else round(place[1]-sb[1])
    ox=max(4,min(size-4-o.width,ox)); oy=max(4,min(size-4-o.height,oy))
    c=Image.new('RGBA',(size,size),(0,0,0,0)); c.alpha_composite(o,(ox,oy))
    out=shadow_for(c); out.alpha_composite(c); return out
def calib(ref,cal,honly=False):
    r=Image.open(REF+ref).convert('RGBA'); c=Image.open(B+f'cal_{cal}.png').convert('RGBA'); rb=solid(r).getbbox(); cb=solid(c).getbbox(); f=1024/c.width
    kh=(rb[3]-rb[1])/((cb[3]-cb[1])*f); kw=(rb[2]-rb[0])/((cb[2]-cb[0])*f); g=[a/b for a,b in zip(mean(r),mean(c))]
    return (kh if honly else (kh+kw)/2), g
if __name__=='__main__':
    CARTON=None
    jobs=[('flower-box-premium-closed.png','flower-gift',False,{'flower-box-premium-open':'flower-box-premium-open'}),
          ('combo-preroll-oil-closed.png','oilcombo',False,{'combo-flower-oil-closed':'combo-flower-oil-closed','combo-flower-oil-open':'combo-flower-oil-open','combo-flower-oil-flower-open':'combo-flower-oil-flower-open','combo-preroll-oil-preroll-open':'combo-preroll-oil-preroll-open'}),
          ('preroll-slims-gift-closed.png','slims-gift',False,{'preroll-slims-closed':'preroll-slims-closed','preroll-slims-open':'preroll-slims-open'}),
          ('oil-dropper-bottle.png','dropper',False,{'oil-bottle-box':'oil-bottle-box','oil-bottle-box-open':'oil-bottle-box-open'}),
          ('preroll-tube-box-15.png','tube-box',True,{'tube-closed':'preroll-tube-box-15','tube-open':'preroll-tube-box-15-open'}),
          ('preroll-tube-box-2.png','tube-box',True,{'tube-closed':'preroll-tube-box-2','tube-open':'preroll-tube-box-2-open'})]
    for ref,cal,honly,outs in jobs:
        k,g=calib(ref,cal,honly)
        if cal=='oilcombo': CARTON=g
        if cal=='dropper': g=CARTON      # the amber bottle is no reference for carton colour
        print(cal,'k',round(k,3),'gain',[round(x,2) for x in g])
        for src,dst in outs.items():
            finish(Image.open(B+f'out_{src}.png').convert('RGBA'),k,g).save(OUT+dst+'.png'); print('  ',dst)

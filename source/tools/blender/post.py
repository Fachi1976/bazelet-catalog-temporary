from PIL import Image, ImageStat
P='/home/claude/bazelet-catalog-temporary/images/products/'; B='/home/claude/work/bl/'
def solid(im, th=235): return im.getchannel('A').point(lambda v:255 if v>th else 0)
def mean(im): return ImageStat.Stat(im.convert('RGB'), solid(im,250)).mean
jobs=[('flower-box-premium-closed.png','flower-gift',['flower-box-premium-open']),
      ('preroll-slims-closed.png','slims-std',['preroll-slims-open']),
      ('combo-preroll-oil-closed.png','oilcombo',['combo-preroll-oil-open','combo-flower-oil-closed','combo-flower-oil-open','combo-flower-oil-flower-open'])]
for ref,cal,outs in jobs:
    r=Image.open(P+ref).convert('RGBA'); c=Image.open(B+f'cal_{cal}.png').convert('RGBA')
    rb=solid(r).getbbox(); cb=solid(c).getbbox(); f=1024/c.width
    kh=(rb[3]-rb[1])/((cb[3]-cb[1])*f); kw=(rb[2]-rb[0])/((cb[2]-cb[0])*f); k=(kh+kw)/2
    g=[a/b for a,b in zip(mean(r),mean(c))]; print(cal,'scale h/w',round(kh,3),round(kw,3),'gain',[round(x,2) for x in g])
    for o in outs:
        im=Image.open(B+f'out_{o}.png').convert('RGBA'); rr,gg,bb,aa=im.split()
        # the shadow catcher leaves a faint veil over the whole floor: remove that baseline, keep the real shadow and the object
        edge=sorted(list(aa.crop((0,0,aa.width,12)).tobytes())+list(aa.crop((0,aa.height-12,aa.width,aa.height)).tobytes())); a0=edge[int(len(edge)*0.9)]*1.6+6
        aa=aa.point(lambda v: 255 if v>=250 else int(max(0,(v-a0))/(250-a0)*250))
        # floor pixels carry only the shadow: neutral dark, no bright veil
        dark=Image.new('RGB',im.size,(38,44,54)); from PIL import ImageFilter, ImageChops
        near=aa.point(lambda v:255 if v>=200 else 0).filter(ImageFilter.MaxFilter(5)); m=ImageChops.subtract(aa.point(lambda v:255 if v<200 else 0),near); rgb=Image.merge('RGB',(rr.point(lambda v:min(255,v*g[0])),gg.point(lambda v:min(255,v*g[1])),bb.point(lambda v:min(255,v*g[2])))); rgb.paste(dark,(0,0),m); aa=Image.composite(aa.point(lambda v: min(199,int(max(0,v-12)*2.2))),aa,m); im=Image.merge('RGBA',(*rgb.split(),aa))
        # tidy the floor: fade towards the render frame, nothing below the object's footprint
        import numpy as np
        A=np.array(aa).astype(float); H,W=A.shape; sol=np.array(near)>0; ys,xs=np.where(sol); ramp=np.minimum(1,np.minimum.reduce([np.arange(W)[None,:]+0*A,(W-1-np.arange(W))[None,:]+0*A,np.arange(H)[:,None]+0*A,(H-1-np.arange(H))[:,None]+0*A])/90.0)
        fl=~sol; A[fl]*=ramp[fl]; A[(np.arange(H)[:,None]>ys.max()+0.03*H)&fl]=0; A[(np.arange(H)[:,None]<ys.min())&fl]=0
        aa=Image.fromarray(A.astype('uint8')); im.putalpha(aa)
        box=aa.point(lambda v:255 if v>6 else 0).getbbox(); im=im.crop(box); im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
        s=min(1,1004/max(im.size))
        if s<1: print('  shrink',o,round(s,3)); im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
        out=Image.new('RGBA',(1024,1024),(0,0,0,0)); sb=im.getchannel('A').point(lambda v:255 if v>=200 else 0).getbbox(); ox=round(512-(sb[0]+sb[2])/2); oy=round(512-(sb[1]+sb[3])/2)
        ox=max(10,min(1014-im.width,ox)) if im.width<=1004 else (1024-im.width)//2; oy=max(10,min(1014-im.height,oy)) if im.height<=1004 else (1024-im.height)//2
        out.alpha_composite(im,(ox,oy)); out.save(B+f'final_{o}.png'); print('  ',o,im.size)
pairs=[(P+'flower-box-premium-open.png',B+'final_flower-box-premium-open.png'),(P+'preroll-slims-open.png',B+'final_preroll-slims-open.png'),(P+'combo-preroll-oil-open.png',B+'final_combo-preroll-oil-open.png'),
       (P+'combo-preroll-oil-closed.png',B+'final_combo-flower-oil-closed.png'),(P+'combo-flower-oil-flower-open.png',B+'final_combo-flower-oil-flower-open.png'),(P+'combo-preroll-oil-open.png',B+'final_combo-flower-oil-open.png')]
s=Image.new('RGB',(6*300,600),(236,240,244))
for i,(a,b) in enumerate(pairs):
    for j,n in enumerate((a,b)):
        im=Image.open(n).convert('RGBA').resize((300,300)); s.paste(im,(i*300,j*300),im)
s.save('/home/claude/work/cmp2.png')

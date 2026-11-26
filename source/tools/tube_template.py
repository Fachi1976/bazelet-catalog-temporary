import pymupdf, json
from PIL import Image, ImageDraw, ImageFont
PT=72/25.4; T='/home/claude/bazelet-catalog-temporary/images/templates/'
X0,Y0,X1,Y1=68,124,222,330   # crop of the supplier sheet, mm
src=pymupdf.open('/home/claude/work/tube/tube.pdf'); pg=src[0]; W,H=pg.rect.width,pg.rect.height
for r in [(0,0,W,Y0*PT),(0,Y1*PT,W,H),(0,0,X0*PT,H),(X1*PT,0,W,H)]: pg.add_redact_annot(pymupdf.Rect(*r))
pg.apply_redactions(images=2, graphics=1, text=0)   # drop the title block, logo and designer details for real
out=pymupdf.open(); clip=pymupdf.Rect(X0*PT,Y0*PT,X1*PT,Y1*PT); np_=out.new_page(width=clip.width,height=clip.height); np_.show_pdf_page(np_.rect,src,0,clip=clip)
out.set_metadata({'title':'Single tube carton 28 x 20 x 120 mm'}); out.save(T+'dieline-tube.pdf',garbage=4,deflate=True)
chk=pymupdf.open(T+'dieline-tube.pdf'); print('template page pt',chk[0].rect, 'text left:',repr(chk[0].get_text()[:80]))
# geometry in the new page (pt)
G=[(x-X0)*PT for x in (112.3,140.3,160.3,188.3,207.3)]; y=lambda v:(v-Y0)*PT
geo={'page':[round(clip.width,2),round(clip.height,2)],'folds':[round(g,1) for g in G],'foldTop':round(y(165.9),1),'foldLen':round(120*PT,1),
     'lid':[y(146.3),y(165.4)],'tuck':[y(135.8),y(146.3)],'dust':[y(152.6),y(165.9)],'bottom':[y(285.9),y(304.7)]}
json.dump(geo,open('/home/claude/work/tube/geo.json','w')); print(geo)
# sample artwork on that page
K=6; Wp,Hp=round(clip.width/PT*K),round(clip.height/PT*K); mmx=lambda v:(v-X0)*K; mmy=lambda v:(v-Y0)*K
DARK=(13,58,51); LIME=(141,199,63); GOLD=(242,201,76); CREAM=(246,242,226); F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
im=Image.new('RGB',(Wp,Hp),DARK); d=ImageDraw.Draw(im)
for a,b in ((140.3,160.3),(188.3,207.3)): d.rectangle((mmx(a),mmy(165.9),mmx(b),mmy(285.9)),fill=LIME)
def vtext(cx,cy,s,size,fill):
    f=ImageFont.truetype(F,int(size*K)); w=int(d.textlength(s,font=f))+8; t=Image.new('RGBA',(w,int(size*K*1.4)),(0,0,0,0)); ImageDraw.Draw(t).text((4,0),s,font=f,fill=fill); t=t.rotate(90,expand=True); im.paste(t,(int(cx-t.width/2),int(cy-t.height/2)),t)
cx=mmx(126.3); r=7*K; cy=mmy(186)
d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=LIME); d.ellipse((cx-r*.55,cy-r*.55,cx+r*.55,cy+r*.55),fill=DARK); d.ellipse((cx-r*.28,cy-r*.28,cx+r*.28,cy+r*.28),fill=GOLD)
vtext(cx,mmy(236),'NOVA LEAF',9,CREAM); vtext(mmx(150.3),mmy(226),'NOVA LEAF',6,DARK); vtext(mmx(197.8),mmy(226),'NOVA LEAF',6,DARK)
vtext(mmx(170),mmy(226),'PRE-ROLL  ·  T22 / C4',4.2,GOLD); vtext(mmx(178.5),mmy(226),'Keep out of reach of children',2.6,CREAM)
im.save(T+'sample-tube.jpg',quality=90); print('sample',im.size)

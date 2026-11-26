import pymupdf
exec(open('/home/claude/work/gen/art.py').read().split("pouch_sheet(False).resize")[0])   # palette, fonts, panel(), logo(), ctext(), K
from bidi.algorithm import get_display
OUT='/home/claude/bazelet-catalog-temporary/images/templates/'; PT=72/25.4
# ---- DOY carton template: the die lines of CD1316 only (no artwork)
src=pymupdf.open('/home/claude/work/d2/gary.pdf'); sp=src[0]
doc=pymupdf.open(); pg=doc.new_page(width=sp.rect.width,height=sp.rect.height); sh=pg.new_shape(); n=0
for dr in sp.get_drawings():
    c=dr.get('color')
    if not c or not (abs(c[0]-0.97)<0.04 and abs(c[1]-0.58)<0.05 and abs(c[2]-0.11)<0.06): continue
    for it in dr['items']:
        if it[0]=='l': sh.draw_line(it[1],it[2])
        elif it[0]=='c': sh.draw_bezier(it[1],it[2],it[3],it[4])
        elif it[0]=='re': sh.draw_rect(it[1])
        elif it[0]=='qu': sh.draw_quad(it[1])
        n+=1
    sh.finish(color=(0.1,0.1,0.1),width=0.6,closePath=False)
sh.commit()
def lab(x,y,t,size=11,col=(0,0.55,0.85),rot=0):
    tw=pymupdf.TextWriter(pg.rect,color=col); f=pymupdf.Font(fontfile=FR); s=get_display(t); w=f.text_length(s,size); tw.append((x*PT-w/2,y*PT),s,font=f,fontsize=size); tw.write_text(pg)
lab(77.6,120,'גב (עם חלון 44×35)',14); lab(247.6,120,'חזית',14); lab(77.6,40,'מכסה עליון',10); lab(247.6,270,'מכסה תחתון',10); lab(162.6,150,'דופן',9); lab(332.3,150,'דופן',9); lab(77.6,186,'חלון',8)
lab(247.6,135,'131 × 39 × 190 מ"מ',10,(0.4,0.4,0.4)); lab(247.6,146,'כבו את שכבת הקווים לפני הייצוא',8,(0.4,0.4,0.4))
doc.set_metadata({'title':'DOY pouch carton 131 x 39 x 190 mm'}); doc.save(OUT+'dieline-doy-box.pdf',garbage=4,deflate=True); print('die items',n)
# ---- its demo design (page 351.6 x 304.3 mm)
Wm,Hm=sp.rect.width/PT,sp.rect.height/PT; im=Image.new('RGB',(round(Wm*K),round(Hm*K)),DARK); d=ImageDraw.Draw(im)
def paste(p,x,y): im.paste(p,(round(x*K),round(y*K)))
for a,b in ((143.1,182.1),(313.1,351.5)): d.rectangle((a*K,57.1*K,b*K,247.1*K),fill=LIME)
paste(panel(131,190,True),12.1,57.1); paste(panel(131,190),182.1,57.1)
d.rectangle((12.1*K,0,143.1*K,57.1*K),fill=DEEP); d.rectangle((182.1*K,247.1*K,313.1*K,304*K),fill=DEEP)
t=Image.new('RGB',(131*K,int(39.5*K)),DEEP); ctext(ImageDraw.Draw(t),131*K/2,13*K,'NOVA LEAF',ImageFont.truetype(F,int(11*K)),GOLD); paste(t.rotate(180),12.1,17.6)
for x in (162.6,332.3):
    f=ImageFont.truetype(F,int(9*K)); w=int(d.textlength('NOVA LEAF',font=f))+8; tt=Image.new('RGBA',(w,int(13*K)),(0,0,0,0)); ImageDraw.Draw(tt).text((4,0),'NOVA LEAF',font=f,fill=DARK); tt=tt.rotate(90,expand=True); im.paste(tt,(int(x*K-tt.width/2),int(152*K-tt.height/2)),tt)
im.resize((round(Wm*6),round(Hm*6)),Image.LANCZOS).save(OUT+'sample-doy-box.jpg',quality=90)
# ---- jar stickers
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont('DV',FR)); pdfmetrics.registerFont(TTFont('DVB',F))
for name,H in (('jar-label',45),('jar-label-short',30)):
    L=263.5; c=canvas.Canvas(OUT+f'dieline-{name}.pdf',pagesize=(L*mm,H*mm)); c.setTitle(f'Jar sticker {L} x {H} mm')
    c.setStrokeColorRGB(0.9,0,0.5); c.setLineWidth(0.5); c.roundRect(0,0,L*mm,H*mm,2*mm)
    c.setFillColorRGB(0,0.62,0.89); c.setFont('DVB',11); c.drawCentredString(L/2*mm,(H/2+1)*mm,get_display(f'מדבקת צנצנת  {L} × {H} מ"מ  ·  מרכז המדבקה = חזית הצנצנת'))
    c.setFillColorRGB(0.45,0.45,0.45); c.setFont('DV',7); c.drawCentredString(L/2*mm,(H/2-5)*mm,get_display('כבו את שכבת הקווים לפני הייצוא')); c.save()
    s=Image.new('RGB',(round(L*K),H*K),DARK); ds=ImageDraw.Draw(s); u=H/45; ds.rectangle((0,0,L*K,3*u*K),fill=LIME); ds.rectangle((0,(H-3*u)*K,L*K,H*K),fill=LIME)
    cx=L*K/2; logo(ds,cx-52*K,H*K/2,9*u*K); ds.text((cx-38*K,H*K/2-9.5*u*K),'NOVA LEAF',font=ImageFont.truetype(F,int(11*u*K)),fill=CREAM); ds.text((cx-38*K,H*K/2+4*u*K),'PREMIUM FLOWER  ·  T22 / C4  ·  10 g',font=ImageFont.truetype(F,int(3.6*u*K)),fill=GOLD)
    for i,t in enumerate(['Grown & packed under IMC-GMP','Store below 25°C','Keep out of reach of children']): ds.text((cx+62*K,H*K/2+(-8+6*i)*u*K),t,font=ImageFont.truetype(FR,int(3.2*u*K)),fill=CREAM)
    for i,t in enumerate(['Made in Israel','10 g']): ds.text((cx-118*K,H*K/2+(-5+7*i)*u*K),t,font=ImageFont.truetype(F,int(3.6*u*K)),fill=LIME)
    s.resize((round(L*8),H*8),Image.LANCZOS).save(OUT+f'sample-{name}.jpg',quality=90)

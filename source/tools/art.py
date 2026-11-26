# sample artwork (fictional brand, same look as the existing samples) + clean templates
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from bidi.algorithm import get_display
OUT='/home/claude/bazelet-catalog-temporary/images/templates/'
DARK=(13,58,51); LIME=(141,199,63); GOLD=(242,201,76); CREAM=(246,242,226); DEEP=(8,44,39)
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
K=8  # px per mm
def font(mmh, bold=True): return ImageFont.truetype(F if bold else FR, int(mmh*K))
def ctext(d, cx, y, s, f, fill): w=d.textlength(s,font=f); d.text((cx-w/2,y),s,font=f,fill=fill)
def logo(d, cx, cy, r):
    d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=LIME); d.ellipse((cx-r*.55,cy-r*.55,cx+r*.55,cy+r*.55),fill=DARK); d.ellipse((cx-r*.28,cy-r*.28,cx+r*.28,cy+r*.28),fill=GOLD)
def panel(w, h, back=False, sub='PREMIUM FLOWER'):
    im=Image.new('RGB',(w*K,h*K),DARK); d=ImageDraw.Draw(im); cx=w*K/2; u=min(w,h)*K/150
    d.rectangle((0,0,w*K,int(9*u)),fill=LIME); d.rectangle((0,h*K-int(9*u),w*K,h*K),fill=DEEP)
    if not back:
        logo(d,cx,h*K*.30,16*u); ctext(d,cx,h*K*.44,'NOVA LEAF',ImageFont.truetype(F,int(15*u)),CREAM)
        ctext(d,cx,h*K*.57,sub,ImageFont.truetype(F,int(5.2*u)),GOLD)
        d.line((cx-34*u,h*K*.66,cx+34*u,h*K*.66),fill=GOLD,width=max(2,int(.6*u)))
        ctext(d,cx,h*K*.70,'T22 / C4',ImageFont.truetype(F,int(7*u)),CREAM)
    else:
        ctext(d,cx,h*K*.20,'NOVA LEAF',ImageFont.truetype(F,int(9*u)),GOLD)
        for i,s in enumerate(['Grown & packed under IMC-GMP','Store below 25°C','Keep out of reach of children','10 g  ·  T22 / C4']):
            ctext(d,cx,h*K*(.36+.085*i),s,ImageFont.truetype(FR,int(4.6*u)),CREAM)
        d.rounded_rectangle((cx-22*u,h*K*.74,cx+22*u,h*K*.74+11*u),radius=int(2*u),outline=LIME,width=max(2,int(.5*u)))
        ctext(d,cx,h*K*.74+2.6*u,'Made in Israel',ImageFont.truetype(F,int(4.4*u)),LIME)
    return im
def pouch_sheet(vertical):
    s=Image.new('RGB',(450*K,150*K),DARK)
    if not vertical: f,b=panel(200,150),panel(200,150,True)
    else: f,b=panel(150,200).rotate(-90,expand=True),panel(150,200,True).rotate(90,expand=True)
    s.paste(f.rotate(180),(15*K,0)); s.paste(b.rotate(180),(235*K,0)); return s
pouch_sheet(False).resize((2700,900),Image.LANCZOS).save(OUT+'sample-pouch-h.jpg',quality=90)
pouch_sheet(True).resize((2700,900),Image.LANCZOS).save(OUT+'sample-pouch-v.jpg',quality=90)
# label 85 x 35 (13 mm clear zone on the left, as on the supplier sheet)
L=Image.new('RGB',(85*K,35*K),DARK); d=ImageDraw.Draw(L); d.rectangle((0,0,13*K,35*K),fill=LIME); d.rectangle((13*K,0,85*K,2.2*K),fill=LIME); d.rectangle((13*K,32.8*K,85*K,35*K),fill=LIME)
logo(d,22*K,17.5*K,5*K); d.text((30*K,9.5*K),'NOVA LEAF',font=font(4.4),fill=CREAM); d.text((30*K,16.2*K),'CANNABIS OIL',font=font(2.6),fill=GOLD); d.text((30*K,21.5*K),'T22 / C4  ·  10 ml',font=font(2.2,False),fill=CREAM)
d.line((60*K,8*K,60*K,27*K),fill=GOLD,width=3)
d.text((63*K,10*K),'Shake before use',font=font(1.8,False),fill=CREAM); d.text((63*K,14.5*K),'Store below 25°C',font=font(1.8,False),fill=CREAM); d.text((63*K,19*K),'Made in Israel',font=font(1.8),fill=LIME)
L.save(OUT+'sample-label.jpg',quality=92)
# ---------- templates
pdfmetrics.registerFont(TTFont('DV',FR)); pdfmetrics.registerFont(TTFont('DVB',F))
H=lambda s:get_display(s)
CY=(0,0.62,0.89); MG=(0.9,0,0.5); GR=(0.45,0.45,0.45)
def txt(c,x,y,s,size=7,col=CY,rot=0,bold=False):
    c.saveState(); c.translate(x*mm,y*mm); c.rotate(rot); c.setFillColorRGB(*col); c.setFont('DVB' if bold else 'DV',size); c.drawCentredString(0,0,H(s)); c.restoreState()
def line(c,x1,y1,x2,y2,col=CY,dash=None,w=0.5):
    c.setStrokeColorRGB(*col); c.setLineWidth(w); c.setDash(dash or []); c.line(x1*mm,y1*mm,x2*mm,y2*mm)
# pouch: artboard 450 x 150
c=canvas.Canvas(OUT+'dieline-pouch.pdf',pagesize=(450*mm,150*mm)); c.setTitle('Pouch 200x150 - artboard 450x150 mm')
c.setStrokeColorRGB(*MG); c.setLineWidth(0.6); c.rect(0,0,450*mm,150*mm)
for x in (15,215,235,435): line(c,x,0,x,150)
line(c,225,0,225,150,dash=[3,3]); line(c,0,6,450,6,dash=[6,4]); line(c,0,144,450,144,dash=[6,4])
for x0,sg in ((15,1),(435,-1)):
    line(c,x0+sg*15,0,x0+sg*15,150,dash=[4,3]); c.setDash([]); c.roundRect((x0+sg*25-1.5)*mm,8*mm,3*mm,134*mm,1.5*mm)
    txt(c,x0+sg*25,75,'zipper',6,rot=90); txt(c,x0+sg*7.5,75,'הלחמה 15 מ"מ - רקע בלבד',6,rot=90); txt(c,x0-sg*7.5,75,'אזור שנחתך - רקע בלבד',6,rot=90)
txt(c,220,75,'אזור שנחתך',6,rot=90); txt(c,230,75,'אזור שנחתך',6,rot=90); txt(c,211,75,'צד פתוח (מילוי)',6,rot=90); txt(c,239,75,'צד פתוח (מילוי)',6,rot=90)
txt(c,115,82,'חזית  FRONT',22,bold=True); txt(c,115,70,'200 × 150 מ"מ',10); txt(c,335,82,'גב  BACK',22,bold=True); txt(c,335,70,'200 × 150 מ"מ',10)
txt(c,115,3,'הלחמה 6 מ"מ - רקע בלבד',6); txt(c,335,3,'הלחמה 6 מ"מ - רקע בלבד',6); txt(c,115,146,'הלחמה 6 מ"מ - רקע בלבד',6); txt(c,335,146,'הלחמה 6 מ"מ - רקע בלבד',6)
txt(c,115,52,'הדפסה אופקית: ראש העיצוב לכיוון תחתית הדף. הדפסה אנכית: ראש העיצוב לכיוון הזיפר.',7,col=GR)
txt(c,335,52,'משטח העבודה: 450 × 150 מ"מ. לפני ייצוא העיצוב כבו את שכבת הקווים הזו.',7,col=GR)
c.save()
# label: artboard 85 x 35
c=canvas.Canvas(OUT+'dieline-label.pdf',pagesize=(85*mm,35*mm)); c.setTitle('Bottle label 85x35 mm')
c.setStrokeColorRGB(*MG); c.setLineWidth(0.4); c.roundRect(0,0,85*mm,35*mm,2*mm)
line(c,13,0,13,35,dash=[2,2],w=0.4); txt(c,6.5,17.5,'13 מ"מ ללא לכה',4.5,rot=90); txt(c,49,19,'תווית בקבוק  85 × 35 מ"מ',7,bold=True); txt(c,49,13,'כבו את שכבת הקווים לפני הייצוא',4.5,col=GR)
c.save()

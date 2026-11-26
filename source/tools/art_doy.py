import sys; sys.argv=['x']
exec(open('/home/claude/work/gen/art.py').read().split("pouch_sheet(False).resize")[0])   # palette, fonts, panel(), logo()
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from bidi.algorithm import get_display
OUT='/home/claude/bazelet-catalog-temporary/images/templates/'
Wm,Hm=133.33,520
s=Image.new('RGB',(round(Wm*K),Hm*K),DARK)
f=panel(133,190).resize((round(Wm*K),190*K)); b=panel(133,190,True).resize((round(Wm*K),190*K))
s.paste(f,(0,10*K)); s.paste(b.rotate(180),(0,320*K))
g=Image.new('RGB',(round(Wm*K),80*K),LIME); dg=ImageDraw.Draw(g); ctext(dg,Wm*K/2,34*K,'NOVA LEAF',ImageFont.truetype(F,int(9*K)),DARK); s.paste(g,(0,220*K))
s.resize((round(Wm*5),Hm*5),Image.LANCZOS).save(OUT+'sample-pouch-doy.jpg',quality=90)
pdfmetrics.registerFont(TTFont('DV',FR)); pdfmetrics.registerFont(TTFont('DVB',F))
Hh=lambda t:get_display(t); CY=(0,0.62,0.89); MG=(0.9,0,0.5); GR=(0.45,0.45,0.45)
c=canvas.Canvas(OUT+'dieline-pouch-doy.pdf',pagesize=(Wm*mm,Hm*mm)); c.setTitle('DOY pouch 133 x 190 - artboard 133.33 x 520 mm')
Y=lambda y:(Hm-y)*mm      # y measured from the top of the artboard
def txt(x,y,t,size=7,col=CY,rot=0,bold=False):
    c.saveState(); c.translate(x*mm,Y(y)); c.rotate(rot); c.setFillColorRGB(*col); c.setFont('DVB' if bold else 'DV',size); c.drawCentredString(0,0,Hh(t)); c.restoreState()
def hl(y,dash=None,col=CY): c.setStrokeColorRGB(*col); c.setLineWidth(0.5); c.setDash(dash or []); c.line(0,Y(y),Wm*mm,Y(y))
c.setStrokeColorRGB(*MG); c.setLineWidth(0.6); c.rect(0,0,Wm*mm,Hm*mm)
for y in (10,200,220,300,320,510): hl(y)
hl(260,[3,3]); hl(30,[5,3]); hl(45,[2,2]); hl(490,[5,3]); hl(475,[2,2])
txt(66.7,100,'חזית  FRONT',20,bold=True); txt(66.7,112,'133 × 190 מ"מ',9); txt(66.7,24,'הלחמה סופית 20 מ"מ - רקע בלבד',6); txt(66.7,42,'זיפר',6)
txt(66.7,258,'תחתית (קפל)  80 מ"מ',10,bold=True); txt(66.7,210,'הלחמה - רקע בלבד',6); txt(66.7,310,'הלחמה - רקע בלבד',6); txt(66.7,6,'גלישה - רקע בלבד',6); txt(66.7,516,'גלישה - רקע בלבד',6)
txt(66.7,410,'גב  BACK',20,rot=180,bold=True); txt(66.7,398,'הגב מעוצב הפוך: ראש העיצוב לכיוון תחתית הדף',7,col=GR,rot=180); txt(66.7,496,'הלחמה סופית 20 מ"מ - רקע בלבד',6,rot=180); txt(66.7,478,'זיפר',6,rot=180)
txt(66.7,130,'משטח העבודה: 133.33 × 520 מ"מ. כבו את שכבת הקווים לפני הייצוא.',6.5,col=GR)
c.save()

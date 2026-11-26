# usage: cap2.py out.png hashpath action... ; actions: open | sample | upload:<slotIndex>:<file> | <orbit string> (captures a tile)
import sys, asyncio, base64, io
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
out=sys.argv[1]; url='http://localhost:8765/#'+sys.argv[2]; acts=sys.argv[3:]
def tile(im, size=520):
    bg=Image.new('RGBA',im.size,(236,240,244,255)); a=im.getchannel('A'); bb=a.getbbox()
    bg.alpha_composite(im); im=bg.convert('RGB')
    if bb:
        cx,cy=(bb[0]+bb[2])/2,(bb[1]+bb[3])/2; h=max(bb[2]-bb[0],bb[3]-bb[1])/2*1.08
        im=im.crop((int(cx-h),int(cy-h),int(cx+h),int(cy+h)))
    return im.resize((size,size),Image.LANCZOS)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'])
        pg = await b.new_page(viewport={'width':1300,'height':950})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto(url); await pg.wait_for_timeout(7000)
        await pg.evaluate("(()=>{const v=document.querySelector('model-viewer');v.removeAttribute('auto-rotate');v.resetTurntableRotation(0);})()")
        ims=[]
        for a in acts:
            if a=='open':
                bb = await pg.locator('model-viewer').first.bounding_box()
                await pg.mouse.click(bb['x']+bb['width']/2, bb['y']+bb['height']/2); await pg.wait_for_timeout(3500)
            elif a=='sample':
                await pg.get_by_text('עיצוב לדוגמה').first.click(); await pg.wait_for_timeout(5000)
            elif a.startswith('upload:'):
                _,i,f=a.split(':',2); await pg.locator('.brand-panel input[type=file]').nth(int(i)).set_input_files(f); await pg.wait_for_timeout(7000)
                print('status:', await pg.locator('.brand-panel').inner_text())
            else:
                await pg.evaluate(f"(()=>{{const v=document.querySelector('model-viewer');v.cameraOrbit='{a}';v.jumpCameraToGoal();}})()"); await pg.wait_for_timeout(1500)
                d = await pg.evaluate("document.querySelector('model-viewer').toDataURL('image/png')")
                ims.append(tile(Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGBA')))
        s=Image.new('RGB',(520*len(ims),520))
        for i,im in enumerate(ims): s.paste(im,(i*520,0))
        s.save(out); print('errors:',errs[:5]); await b.close()
asyncio.run(main())

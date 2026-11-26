# Studio still of a catalog model. usage: python3 render.py in.glb out.png [open] [samples]
import bpy, sys, math, os
E=lambda k,d: float(os.environ.get(k,d))
from mathutils import Vector
src, out = sys.argv[1], sys.argv[2]; do_open = 'open' in sys.argv; samples = int(next((a for a in sys.argv[3:] if a.isdigit()), 96))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc = bpy.context.scene
# pose: last animation frame = open
end = 0
for a in bpy.data.actions: end = max(end, a.frame_range[1])
sc.frame_set(int(end) if do_open else 0)
bpy.context.view_layer.update()
mn = Vector((1e9,)*3); mx = Vector((-1e9,)*3)
for o in sc.objects:
    if o.type == 'MESH':
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            for k in range(3): mn[k] = min(mn[k], w[k]); mx[k] = max(mx[k], w[k])
ctr = (mn + mx) / 2
tgt = ctr + Vector((0, 0, E('DZ', 0)))
# floor: shadow catcher
bpy.ops.mesh.primitive_plane_add(size=6, location=(ctr.x, ctr.y, mn.z - 0.0002)); fl = bpy.context.object; fl.is_shadow_catcher = True
# camera: same orbit as the 3D viewer (35 deg right of front, 25 deg up), long lens
cam = bpy.data.cameras.new('cam'); cam.lens = E('LENS',135); cam.clip_start = 0.05; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
th, el, R = math.radians(E('TH',35)), math.radians(E('EL',25)), E('R',1.8)
co.location = tgt + Vector((math.sin(th) * math.cos(el), -math.cos(th) * math.cos(el), math.sin(el))) * R
co.rotation_euler = (tgt - co.location).to_track_quat('-Z', 'Y').to_euler()
# light: studio HDR + a soft key from the upper left
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree; bg = nt.nodes['Background']
env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load('/home/claude/bazelet-catalog-temporary/images/models/studio-env-3.hdr'); nt.links.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = E('ENV',1.0)
kd = bpy.data.lights.new('key', 'AREA'); kd.energy = E('KEY',18); kd.size = 1.2; ko = bpy.data.objects.new('key', kd); sc.collection.objects.link(ko)
ko.location = ctr + Vector((E('KX',-0.9), E('KY',-0.5), E('KZ',1.3))); ko.rotation_euler = (ctr - ko.location).to_track_quat('-Z', 'Y').to_euler()
sc.render.engine = 'CYCLES'; sc.cycles.samples = samples; sc.cycles.use_denoising = True; sc.cycles.device = 'CPU'
sc.render.film_transparent = True; sc.render.resolution_x = sc.render.resolution_y = int(E('RES',1200)); sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Standard'; sc.render.filepath = out
bpy.ops.render.render(write_still=True)

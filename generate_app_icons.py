import os
import math
from PIL import Image, ImageDraw, ImageFilter

os.makedirs("darkspot-app/assets", exist_ok=True)

def draw_darkspot_logo(draw, center_x, center_y, scale=1.0):
    # Colors
    bg_dark = (9, 9, 11)
    cyan = (0, 212, 170)
    purple = (124, 58, 237)
    white = (250, 250, 250)
    
    r_outer = int(180 * scale)
    r_inner = int(120 * scale)
    r_center = int(45 * scale)
    stroke_w = max(4, int(22 * scale))
    
    # Outer dashed/radar arc
    box_outer = [center_x - r_outer, center_y - r_outer, center_x + r_outer, center_y + r_outer]
    draw.arc(box_outer, start=40, end=300, fill=cyan, width=stroke_w)
    
    # Small pulse dots along the arc
    for angle in [330, 350, 10]:
        rad = math.radians(angle)
        px = center_x + r_outer * math.cos(rad)
        py = center_y + r_outer * math.sin(rad)
        pr = max(2, int(9 * scale))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=purple)
        
    # Inner scanner ring
    box_inner = [center_x - r_inner, center_y - r_inner, center_x + r_inner, center_y + r_inner]
    draw.arc(box_inner, start=160, end=390, fill=purple, width=max(3, int(14 * scale)))
    
    # Center glowing beacon dot
    glow_box = [center_x - r_center - 10, center_y - r_center - 10, center_x + r_center + 10, center_y + r_center + 10]
    draw.ellipse(glow_box, fill=(0, 212, 170, 80))
    
    center_box = [center_x - r_center, center_y - r_center, center_x + r_center, center_y + r_center]
    draw.ellipse(center_box, fill=cyan)
    
    # Core white pupil
    core_r = max(2, int(18 * scale))
    draw.ellipse([center_x - core_r, center_y - core_r, center_x + core_r, center_y + core_r], fill=white)

# 1. Main Icon (1024x1024)
img_icon = Image.new("RGBA", (1024, 1024), (0, 0, 0, 255))
draw_icon = ImageDraw.Draw(img_icon)

# Subtle rounded background tile or backdrop
tile_pad = 48
tile_box = [tile_pad, tile_pad, 1024 - tile_pad, 1024 - tile_pad]
draw_icon.rounded_rectangle(tile_box, radius=216, fill=(13, 14, 20), outline=(0, 212, 170, 70), width=6)

# Glowing aura in center
aura = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
draw_aura = ImageDraw.Draw(aura)
draw_aura.ellipse([512 - 260, 512 - 260, 512 + 260, 512 + 260], fill=(0, 212, 170, 55))
draw_aura.ellipse([512 - 170, 512 - 170, 512 + 170, 512 + 170], fill=(124, 58, 237, 65))
aura = aura.filter(ImageFilter.GaussianBlur(50))
img_icon.paste(Image.alpha_composite(Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)), aura), (0, 0), aura)

draw_icon = ImageDraw.Draw(img_icon)
draw_darkspot_logo(draw_icon, 512, 512, scale=1.55)
img_icon.convert("RGB").save("darkspot-app/assets/icon.png", "PNG")
print("Saved darkspot-app/assets/icon.png")

# 2. Adaptive Icon Foreground (1024x1024 transparent, content inside 66% safe area)
img_adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
draw_adaptive = ImageDraw.Draw(img_adaptive)

# Glowing aura for adaptive
aura_ad = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
draw_aura_ad = ImageDraw.Draw(aura_ad)
draw_aura_ad.ellipse([512 - 180, 512 - 180, 512 + 180, 512 + 180], fill=(0, 212, 170, 70))
draw_aura_ad.ellipse([512 - 120, 512 - 120, 512 + 120, 512 + 120], fill=(124, 58, 237, 80))
aura_ad = aura_ad.filter(ImageFilter.GaussianBlur(35))
img_adaptive.paste(Image.alpha_composite(Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)), aura_ad), (0, 0), aura_ad)

draw_adaptive = ImageDraw.Draw(img_adaptive)
# Adaptive icon safe area is 66% (radius ~ 340) -> scale 1.15
draw_darkspot_logo(draw_adaptive, 512, 512, scale=1.18)
img_adaptive.save("darkspot-app/assets/adaptive-icon.png", "PNG")
print("Saved darkspot-app/assets/adaptive-icon.png")

# 3. Splash Screen (2048x2048)
img_splash = Image.new("RGBA", (2048, 2048), (0, 0, 0, 255))
draw_splash = ImageDraw.Draw(img_splash)

aura_sp = Image.new("RGBA", (2048, 2048), (0, 0, 0, 0))
draw_aura_sp = ImageDraw.Draw(aura_sp)
draw_aura_sp.ellipse([1024 - 350, 1024 - 350, 1024 + 350, 1024 + 350], fill=(0, 212, 170, 60))
draw_aura_sp.ellipse([1024 - 230, 1024 - 230, 1024 + 230, 1024 + 230], fill=(124, 58, 237, 75))
aura_sp = aura_sp.filter(ImageFilter.GaussianBlur(60))
img_splash.paste(Image.alpha_composite(Image.new("RGBA", (2048, 2048), (0, 0, 0, 0)), aura_sp), (0, 0), aura_sp)

draw_splash = ImageDraw.Draw(img_splash)
draw_darkspot_logo(draw_splash, 1024, 1024, scale=1.9)
img_splash.convert("RGB").save("darkspot-app/assets/splash.png", "PNG")
print("Saved darkspot-app/assets/splash.png")

# 4. Favicon (48x48)
img_fav = img_icon.resize((48, 48), Image.Resampling.LANCZOS)
img_fav.save("darkspot-app/assets/favicon.png", "PNG")
print("Saved darkspot-app/assets/favicon.png")

#!/usr/bin/env python3
"""Regenerate the generated images: QR codes, app icons and the link-preview image.

Usage (from the repo root; needs Pillow):
    uv run --with pillow python scripts/make_images.py
    # or: pip install pillow && python3 scripts/make_images.py

Inputs:  public/assets/avatar.jpg and the QR payloads below.
Outputs: public/assets/{icons,widget}/*.png, public/assets/og.png,
         docs/readme/banner.png (GitHub profile README header)
         (widget art is built from public/assets/logos/vietcombank-full.png and vietcombank-emblem.png)

QR codes are not generated here: they contain private data and are rendered by the site at build
time from the CARD_DATA environment variable (lib/qr.ts).
"""
import pathlib
import re
import tempfile
import urllib.request

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"

BG = (14, 16, 19)  # maskable icon background
BG_PLATINUM = (11, 11, 12)  # page background


def circle(img: Image.Image, size: int) -> Image.Image:
    big = img.resize((size * 4, size * 4), Image.LANCZOS)
    mask = Image.new("L", big.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0) + big.size, fill=255)
    out = Image.new("RGBA", big.size)
    out.paste(big, mask=mask)
    return out.resize((size, size), Image.LANCZOS)


def download_fonts(folder: pathlib.Path) -> dict:
    """Fetch static TTFs from Google Fonts (Pillow cannot read the site's woff2 files)."""
    css_url = ("https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Pinyon+Script"
               "&family=Montserrat:ital,wght@0,300;0,400;0,500;0,700;1,800")
    css = urllib.request.urlopen(urllib.request.Request(css_url, headers={"User-Agent": "curl/8"})).read().decode()
    fonts = {}
    pattern = r"font-family: '([^']+)';\s*font-style: (\w+);\s*font-weight: (\d+);.*?url\((https://[^)]+)\)"
    for family, style, weight, url in re.findall(pattern, css, re.S):
        suffix = " italic" if style == "italic" else ""
        path = folder / f"{family.replace(' ', '')}-{weight}{suffix.strip()}.ttf"
        path.write_bytes(urllib.request.urlopen(url).read())
        fonts[f"{family} {weight}{suffix}"] = str(path)
    return fonts


def tracked_text(draw, xy, text, font, fill, tracking=0.0):
    """Draw text with letter-spacing (em units), like CSS letter-spacing."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking * font.size
    return x


def make_card(avatar: Image.Image, fonts: dict, width: int = 640) -> Image.Image:
    """The page's contact card (same layout as .card in index.html), for the link preview."""
    font = lambda key, size: ImageFont.truetype(fonts[key], max(1, int(size)))
    W, H = width, int(width / 1.586)
    u = W / 100  # 1 unit = 1% of the card's width, matching the page's cqw values
    # Charcoal stock: smooth diagonal ramp (average of a vertical and a mirrored horizontal ramp).
    ramp = Image.blend(Image.linear_gradient("L").resize((W, H)),
                       Image.linear_gradient("L").rotate(90).resize((W, H)).transpose(Image.FLIP_LEFT_RIGHT), 0.5)
    base = Image.merge("RGB", [ramp.point(lambda v: 60 - int(30 * v / 255))] * 3).convert("RGBA")
    shine = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shine).ellipse((W * 0.55, -H * 0.8, W * 1.6, H * 0.6), fill=(80, 80, 85, 120))
    base = Image.alpha_composite(base, shine.filter(ImageFilter.GaussianBlur(W * 0.08)))

    facets = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(facets)
    sx, sy = W / 1586, H / 1000
    for pts, grey, alpha in [  # same polygons as the page
        ((40, 390, 250, 390, 145, 540), 142, .55), ((250, 390, 145, 540, 355, 540), 93, .6),
        ((145, 540, 355, 540, 250, 690), 118, .5), ((40, 540, 145, 540, 92, 620), 157, .4),
        ((355, 450, 470, 450, 412, 535), 108, .45), ((260, 300, 340, 300, 300, 360), 163, .4),
        ((1020, 110, 1250, 110, 1135, 250), 138, .5), ((1135, 250, 1020, 390, 1250, 390), 102, .55),
        ((1250, 110, 1340, 110, 1295, 175), 160, .38), ((1250, 390, 1340, 390, 1295, 325), 119, .38),
    ]:
        fd.polygon([(pts[i] * sx, pts[i + 1] * sy) for i in range(0, 6, 2)], fill=(grey, grey, grey + 4, int(255 * alpha)))
    base = Image.alpha_composite(base, facets)
    d = ImageDraw.Draw(base)
    ink = (230, 230, 233)

    # Issuer slot: "NewEra" with its mark at the end, raised.
    issuer = font("Montserrat 700", 5.8 * u)
    ix, iy = 31 * u, H * 0.09
    d.text((ix, iy), "NewEra", font=issuer, fill=ink, anchor="lt")
    mark = Image.open(ASSETS / "logos" / "newera-white.png").convert("RGBA")
    mark = mark.resize((int(5.4 * u), int(5.4 * u * mark.height / mark.width)), Image.LANCZOS)
    base.alpha_composite(mark, (int(ix + d.textlength("NewEra", font=issuer) + 0.9 * u), int(iy - 2.6 * u)))

    # Contactless mark: four arcs.
    cx, cy, s = 55 * u + 2.9 * u, H * 0.21 + 2.9 * u, 5.8 * u / 24
    for r in (2.6, 6.0, 9.4, 12.8):
        rr = r * s * 1.0
        d.arc((cx - 7 * s - rr, cy - rr, cx - 7 * s + rr, cy + rr), -42, 42, fill=ink, width=max(2, int(2.2 * s)))

    # Script name, chip, number, birthday, holder, network slot.
    d.text((15 * u, H * 0.355), "William", font=font("Pinyon Script 400", 16.5 * u), fill=(220, 220, 224), anchor="lt")
    d.rounded_rectangle((8 * u, H * 0.635, 19 * u, H * 0.635 + 8.4 * u), radius=int(1.3 * u), fill=(204, 204, 209), outline=(128, 128, 135))
    tracked_text(d, (24.5 * u, H * 0.632), "0866 191 104", font("Montserrat 300", 6.3 * u), ink, 0.07)
    small = font("Montserrat 500", 1.35 * u)
    # Public images show the career start, like the portfolio card; the birthday stays private.
    d.text((38 * u, H * 0.765), "SHIPPING", font=small, fill=(185, 185, 190), anchor="ra")
    d.text((38 * u, H * 0.765 + 1.6 * u), "SINCE", font=small, fill=(185, 185, 190), anchor="ra")
    tracked_text(d, (38 * u + 1.2 * u, H * 0.765), "04/2025", font("Montserrat 300", 3.1 * u), ink, 0.08)
    holder = font("Montserrat 400", 3.7 * u)
    tracked_text(d, (8 * u, H - H * 0.055 - 3.7 * u * 1.2), "VU TRAN QUANG MINH", holder, ink, 0.17)
    dev = font("Montserrat 800 italic", 9 * u)
    d.text((W - 6.5 * u, H * 0.43), "DEV", font=dev, fill=(242, 242, 244), anchor="rt")
    d.text((W - 6.5 * u, H * 0.43 + 8.6 * u), "Software", font=font("Montserrat 400", 2.3 * u), fill=(196, 196, 201), anchor="rt")

    card = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), radius=int(4.4 * u), fill=255)
    card.paste(base, mask=mask)
    return card


def make_og(avatar: Image.Image, fonts: dict) -> Image.Image:
    font = lambda key, size: ImageFont.truetype(fonts[key], size)
    og = Image.new("RGB", (1200, 630), BG_PLATINUM)
    glow = Image.new("RGBA", og.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((-200, -420, 1400, 260), fill=(40, 40, 45, 255))
    og.paste(glow.filter(ImageFilter.GaussianBlur(120)), (0, 0), glow.filter(ImageFilter.GaussianBlur(120)))
    card = make_card(avatar, fonts, 600)
    shadow = Image.new("RGBA", (card.width + 120, card.height + 120), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((60, 80, card.width + 60, card.height + 80), radius=30, fill=(0, 0, 0, 200))
    og.paste(shadow.filter(ImageFilter.GaussianBlur(28)), (10, 76), shadow.filter(ImageFilter.GaussianBlur(28)))
    og.paste(card, (70, 126), card)

    d = ImageDraw.Draw(og)
    x = 730
    d.text((x, 214), "Vũ Trần", font=font("Inter 600", 50), fill=(236, 236, 238))
    d.text((x, 272), "Quang Minh", font=font("Inter 600", 50), fill=(236, 236, 238))
    role = font("Inter 500", 24)
    d.text((x, 350), "Software Developer @ ", font=role, fill=(143, 143, 150))
    d.text((x + d.textlength("Software Developer @ ", font=role), 350), "NewEra Inc", font=role, fill=(236, 236, 238))
    return og


def make_readme_banner(avatar: Image.Image, fonts: dict) -> Image.Image:
    """Header for the GitHub profile README: the contact card beside name and headline."""
    font = lambda key, size: ImageFont.truetype(fonts[key], size)
    W, H = 1280, 520
    banner = Image.new("RGB", (W, H), BG_PLATINUM)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((-200, -420, 1480, 230), fill=(38, 38, 43, 255))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    banner.paste(glow, (0, 0), glow)

    card = make_card(avatar, fonts, 600)
    shadow = Image.new("RGBA", (card.width + 120, card.height + 120), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((60, 80, card.width + 60, card.height + 80), radius=30, fill=(0, 0, 0, 210))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    cy = (H - card.height) // 2
    banner.paste(shadow, (20, cy - 50), shadow)
    banner.paste(card, (80, cy), card)

    d = ImageDraw.Draw(banner)
    x = 760
    small = font("Montserrat 500", 15)
    tracked_text(d, (x, 150), "FULL STACK ENGINEER", small, (143, 143, 150), 0.24)
    d.text((x, 182), "Vũ Trần", font=font("Inter 600", 54), fill=(236, 236, 238))
    d.text((x, 244), "Quang Minh", font=font("Inter 600", 54), fill=(236, 236, 238))
    d.text((x, 322), "AI systems · Edge-to-cloud · Multi-LLM & RAG", font=font("Montserrat 300", 20), fill=(200, 200, 205))
    d.line((x, 376, 1200, 376), fill=(38, 38, 42), width=2)
    tracked_text(d, (x, 396), "HO CHI MINH CITY", font("Montserrat 500", 13), (120, 120, 127), 0.18)
    return banner


# --- Vietcombank widget art ------------------------------------------------------------------
VCB_DEEP, VCB_GREEN, VCB_LIME = (0, 75, 39), (0, 122, 61), (141, 198, 63)
# Widget sizes in points on a 6.1" iPhone, rendered at 3x.
WIDGET_SIZES = {"small": (158, 158), "medium": (338, 158), "large": (338, 354)}


def white_version(img: Image.Image) -> Image.Image:
    """Same shape, every pixel white: for logos placed on the green background."""
    white = Image.new("RGBA", img.size, (255, 255, 255, 0))
    white.putalpha(img.getchannel("A"))
    return white


def diagonal_gradient(size, start, end) -> Image.Image:
    w, h = size
    mask = Image.linear_gradient("L").rotate(45, expand=True).resize((w, h), Image.BILINEAR)
    return Image.composite(Image.new("RGB", size, end), Image.new("RGB", size, start), mask)


def with_alpha(img: Image.Image, opacity: float) -> Image.Image:
    out = img.copy()
    out.putalpha(out.getchannel("A").point(lambda a: int(a * opacity)))
    return out


def vcb_background(w: int, h: int, emblem_white: Image.Image) -> Image.Image:
    ss = 2  # supersample for smooth edges
    W, H = w * ss, h * ss
    base = diagonal_gradient((W, H), VCB_DEEP, VCB_GREEN).convert("RGBA")

    # Lime glow in the top-right corner.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    r = int(max(W, H) * 0.45)
    ImageDraw.Draw(glow).ellipse((W - r, -r, W + r, r), fill=VCB_LIME + (95,))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(r * 0.45)))

    # Concentric arcs radiating from the bottom-right corner.
    arcs = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(arcs)
    cx, cy, step = W * 1.02, H * 1.04, H * 0.13
    for i in range(3, 12):
        rr = step * i
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline=(255, 255, 255, 16), width=2 * ss)
    base = Image.alpha_composite(base, arcs)

    # Oversized emblem watermark, tilted and bleeding off the bottom-right edge.
    mark_h = int(H * (1.05 if h < 200 else 0.78))
    mark = emblem_white.resize((int(mark_h * emblem_white.width / emblem_white.height), mark_h), Image.LANCZOS)
    mark = with_alpha(mark, 0.075).rotate(-12, resample=Image.BICUBIC, expand=True)
    base.alpha_composite(mark, (int(W - mark.width * 0.78), int(H - mark.height * 0.80)))

    # Lime ribbon echoing the emblem's light-green stroke.
    ribbon = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t = 5 * ss * 3  # 5pt
    x0, y0 = W * (0.72 if w > h else 0.58), H
    x1, y1 = W, H * (0.70 if h < 200 else 0.84)
    ImageDraw.Draw(ribbon).polygon([(x0, y0), (x1, y1), (x1, y1 + t), (x0 + t * 1.6, y0)], fill=VCB_LIME + (235,))
    base = Image.alpha_composite(base, ribbon)

    return base.resize((w, h), Image.LANCZOS).convert("RGB")


def split_logo(logo: Image.Image) -> tuple:
    """Split the official logo into (emblem, wordmark). The emblem sits above the end of the wordmark."""
    a = logo.getchannel("A")
    w, h = logo.size
    # Emblem columns: anything opaque in the top 40%, which the wordmark never reaches.
    cols = [x for x in range(w) if any(a.getpixel((x, y)) > 20 for y in range(0, int(h * 0.4), 2))]
    x0, x1 = min(cols), max(cols)
    # Emblem bottom: the lowest opaque row in a band around its centre, above the wordmark's x-height.
    cx = (x0 + x1) // 2
    band = range(cx - w // 60, cx + w // 60)
    y1 = max(y for y in range(int(h * 0.7)) if any(a.getpixel((x, y)) > 20 for x in band))
    pad = w // 200  # also clear the emblem's anti-aliased edge
    emblem = logo.crop((x0, 0, x1 + 1, y1 + 2))
    wordmark = logo.copy()
    wordmark.paste((0, 0, 0, 0), (x0 - pad, 0, x1 + 1 + pad, y1 + 2))

    def solid_bbox(img):  # ignore faint stray pixels when trimming
        return img.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()

    return emblem.crop(solid_bbox(emblem)), wordmark.crop(solid_bbox(wordmark))


def horizontal_lockup(emblem: Image.Image, wordmark: Image.Image, width: int) -> Image.Image:
    """Wordmark with the emblem at its end, raised like the official horizontal logo:
    the emblem's top rises above the letters and its tip sits around mid-height."""
    wh = wordmark.height
    eh = int(wh * 1.47)
    ew = int(emblem.width * eh / emblem.height)
    gap = int(wh * 0.38)
    rise = int(wh * 0.73)  # how far the emblem's top sits above the wordmark's top
    canvas = Image.new("RGBA", (wordmark.width + gap + ew, rise + wh), (0, 0, 0, 0))
    canvas.alpha_composite(wordmark, (0, rise))
    canvas.alpha_composite(emblem.resize((ew, eh), Image.LANCZOS), (wordmark.width + gap, 0))
    return canvas.resize((width, int(width * canvas.height / canvas.width)), Image.LANCZOS)


def make_widget_art() -> None:
    out = ASSETS / "widget"
    out.mkdir(exist_ok=True)
    logo = Image.open(ASSETS / "logos" / "vietcombank-full.png").convert("RGBA")
    emblem = Image.open(ASSETS / "logos" / "vietcombank-emblem.png").convert("RGBA")
    logo_emblem, logo_wordmark = split_logo(logo)
    horizontal_lockup(white_version(logo_emblem), white_version(logo_wordmark), 720).save(out / "vcb-logo-white.png", optimize=True)
    emblem_white = white_version(emblem)
    for family, (pw, ph) in WIDGET_SIZES.items():
        vcb_background(pw * 3, ph * 3, emblem_white).save(out / f"vcb-bg-{family}.png", optimize=True)


def main() -> None:
    (ASSETS / "icons").mkdir(exist_ok=True)


    avatar = Image.open(ASSETS / "avatar.jpg").convert("RGB")
    avatar.resize((512, 512), Image.LANCZOS).save(ASSETS / "icons" / "icon-512.png", optimize=True)
    avatar.resize((192, 192), Image.LANCZOS).save(ASSETS / "icons" / "icon-192.png", optimize=True)
    avatar.resize((180, 180), Image.LANCZOS).save(ASSETS / "icons" / "apple-touch-icon.png", optimize=True)
    maskable = Image.new("RGB", (512, 512), BG)
    photo = circle(avatar, 360)
    maskable.paste(photo, (76, 76), photo)  # stays inside the 80% safe zone
    maskable.save(ASSETS / "icons" / "icon-maskable-512.png", optimize=True)
    circle(avatar, 64).save(ASSETS / "icons" / "favicon-64.png", optimize=True)

    with tempfile.TemporaryDirectory() as tmp:
        fonts = download_fonts(pathlib.Path(tmp))
        make_og(avatar, fonts).save(ASSETS / "og.png", optimize=True)
        readme_dir = ROOT / "docs" / "readme"
        readme_dir.mkdir(parents=True, exist_ok=True)
        make_readme_banner(avatar, fonts).save(readme_dir / "banner.png", optimize=True)

    make_widget_art()
    print("Wrote public/assets/{icons,widget}/*.png, public/assets/og.png and docs/readme/banner.png")


if __name__ == "__main__":
    main()
